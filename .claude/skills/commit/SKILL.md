---
name: commit
description: >
  Conventional Commits 形式でコミットを作成する。
  Use when the user says "commit", "コミット", "変更をコミット", "コミットして",
  "create commit", or "save changes".
compatibility: "Claude Code only. Requires git."
allowed-tools: "Bash(git:*)"
metadata:
  author: kizukai
  version: 1.0.0
  category: git
  tags: [git, commit, conventional-commits]
---

# /commit — Conventional Commits コミット

git-workflow ルールに準拠した Conventional Commits 形式でコミットを作成する Skill。

## Instructions

### Step 1: ステージング差分の確認

ステージングされた変更を確認する。

```bash
git diff --staged
```

- 差分の内容を分析し、変更の目的を把握する
- ステージングが空の場合は Step 2 に進む

### Step 2: 変更がない場合の対応

ステージングが空の場合、未ステージの変更を確認する。

```bash
git status
git diff
```

- 未ステージの変更があれば `git add` の対象ファイルを提案する
- ユーザーに確認してからステージングを実行する
- 変更がまったくない場合はその旨を報告して終了する

### Step 3: Conventional Commits prefix の自動選定

変更内容から適切な prefix を選定する。

| prefix | 用途 |
|--------|------|
| `feat:` | 新機能の追加 |
| `fix:` | バグの修正 |
| `docs:` | ドキュメントの変更 |
| `refactor:` | リファクタリング（機能変更なし） |
| `test:` | テストの追加・修正 |
| `chore:` | その他（依存更新、設定変更等） |

- 変更内容から最適な prefix を判定する
- scope がある場合は `prefix(scope):` 形式にする（例: `feat(auth):`）
- 複数の prefix に該当する場合は、主要な変更に基づいて選定する

### Step 4: コミットメッセージの作成

日本語で簡潔なコミットメッセージを作成する。

- 1行目は72文字以内を目安とする
- prefix は英語、説明文は日本語
- 変更の「何を」「なぜ」が伝わるメッセージにする
- ユーザーにメッセージを確認し、必要に応じて修正を受け付ける

### Step 5: コミット実行と結果確認

コミットを実行し、結果を確認する。

```bash
git commit -m "<prefix>(<scope>): <message>"
git log --oneline -1
```

- コミットが成功したことを確認する
- コミットハッシュとメッセージを表示する
- 次のアクション（`/pr` で PR 作成等）を提案する

## Examples

### Example 1: 新機能のコミット

```
ユーザー: 「コミットして」

Step 1: git diff --staged で差分を確認
  → src/modules/auth/auth.service.ts に新しいメソッド追加を検出

Step 3: prefix 選定 → feat(auth)
Step 4: メッセージ作成 → "feat(auth): ログイン認証サービスの実装"
Step 5: コミット実行

結果: abc1234 feat(auth): ログイン認証サービスの実装
```

### Example 2: バグ修正のコミット

```
ユーザー: 「変更をコミット」

Step 1: git diff --staged で差分を確認
  → src/modules/user/user.service.ts のバリデーション修正を検出

Step 3: prefix 選定 → fix(user)
Step 4: メッセージ作成 → "fix(user): メールアドレスバリデーションの修正"
Step 5: コミット実行

結果: def5678 fix(user): メールアドレスバリデーションの修正
```

## Troubleshooting

### Error: ステージングが空

**原因**: `git add` が実行されておらず、ステージングに変更がない

**解決策**:
1. `git status` で未ステージの変更を確認する
2. 対象ファイルを `git add <file>` でステージングする
3. 全変更をステージングする場合は `git add -A` を提案する（ユーザー確認必須）

### Error: pre-commit hook の失敗

**原因**: lint やフォーマットチェックで問題が検出された

**解決策**:
1. エラーメッセージを確認し、問題箇所を特定する
2. lint エラーの場合は自動修正を試みる（`npx eslint --fix`）
3. 修正後に再度 `git add` → `git commit` を実行する
