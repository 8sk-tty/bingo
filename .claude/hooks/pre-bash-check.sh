#!/bin/bash
# pre-bash-check.sh — PreToolUse (Bash) 統合チェックスクリプト
# 以下の4つのチェックを順番に実行し、いずれかが失敗した時点でブロックする。
#
# 1. prevent-force-push — force push 検出
# 2. prevent-main-commit — 保護ブランチへの直接コミット検出
# 3. lint-before-commit — コミット時の lint チェック
# 4. prevent-secret-commit — 機密情報のコミット検出

TOOL_INPUT="$1"

# --- 1. prevent-force-push ---
# git push --force または git push -f を検出してブロック
if echo "$TOOL_INPUT" | grep -qE 'git\s+push\s+.*(-f|--force)'; then
  echo "BLOCKED: force push は禁止されています。"
  echo "hotfix ブランチでやむを得ない場合は、ユーザーに確認を取ってください。"
  exit 2
fi

# --- 2. prevent-main-commit ---
# main または develop ブランチでの git commit を検出してブロック
if echo "$TOOL_INPUT" | grep -qE 'git\s+commit'; then
  CURRENT_BRANCH=$(git branch --show-current 2>/dev/null)
  if [ "$CURRENT_BRANCH" = "main" ] || [ "$CURRENT_BRANCH" = "develop" ]; then
    echo "BLOCKED: ${CURRENT_BRANCH} ブランチへの直接コミットは禁止されています。"
    echo "feature ブランチで作業してください。"
    exit 2
  fi
fi

# --- 3. lint-before-commit ---
# git commit 時にステージングされた .ts/.tsx ファイルの lint チェック
if echo "$TOOL_INPUT" | grep -qE 'git\s+commit'; then
  STAGED_TS_FILES=$(git diff --cached --name-only --diff-filter=ACM 2>/dev/null | grep -E '\.(ts|tsx)$')
  if [ -n "$STAGED_TS_FILES" ]; then
    # eslint チェック（インストール済みの場合のみ）
    if command -v npx &> /dev/null && [ -f "node_modules/.bin/eslint" ]; then
      echo "$STAGED_TS_FILES" | xargs npx eslint --quiet 2>/dev/null
      if [ $? -ne 0 ]; then
        echo "BLOCKED: ESLint エラーがあります。修正してからコミットしてください。"
        exit 2
      fi
    fi
    # prettier チェック（インストール済みの場合のみ）
    if command -v npx &> /dev/null && [ -f "node_modules/.bin/prettier" ]; then
      echo "$STAGED_TS_FILES" | xargs npx prettier --check 2>/dev/null
      if [ $? -ne 0 ]; then
        echo "BLOCKED: Prettier フォーマットエラーがあります。\`npx prettier --write\` で修正してからコミットしてください。"
        exit 2
      fi
    fi
  fi
fi

# --- 4. prevent-secret-commit ---
# git add / git commit 時に機密情報を検出してブロック
if echo "$TOOL_INPUT" | grep -qE 'git\s+(add|commit)'; then
  # .env ファイルや credentials ファイルの検出
  if echo "$TOOL_INPUT" | grep -qE '\.(env|env\.[a-z]+)|credentials'; then
    echo "BLOCKED: 機密情報が含まれている可能性があります。"
    echo ".env ファイルは .gitignore に追加し、コミットしないでください。"
    exit 2
  fi

  # ステージングされたファイル内の API キーパターン検出
  if echo "$TOOL_INPUT" | grep -qE 'git\s+commit'; then
    STAGED_FILES=$(git diff --cached --name-only 2>/dev/null)
    if [ -n "$STAGED_FILES" ]; then
      # API キーパターン: AKIA..., sk-..., ghp_..., パスワード文字列等
      SECRET_PATTERN='(AKIA[0-9A-Z]{16}|sk-[a-zA-Z0-9]{32,}|ghp_[a-zA-Z0-9]{36}|password\s*=\s*["'"'"'][^"'"'"']+["'"'"']|secret\s*=\s*["'"'"'][^"'"'"']+["'"'"'])'
      FOUND_SECRETS=$(echo "$STAGED_FILES" | xargs git diff --cached 2>/dev/null | grep -E "$SECRET_PATTERN")
      if [ -n "$FOUND_SECRETS" ]; then
        echo "BLOCKED: ステージングされたファイルに機密情報（APIキー・パスワード等）が含まれています。"
        echo ".env を使用し、.gitignore に追加してください。"
        exit 2
      fi
    fi
  fi
fi

# すべてのチェックを通過
exit 0
