---
name: pr
description: >
  PR（プルリクエスト）を作成する。
  Use when the user says "create PR", "PR作成", "PRを作って", "プルリクエスト",
  "open pull request", or "submit PR".
compatibility: "Claude Code only. Requires git, gh CLI."
allowed-tools: "Bash(git:*) Bash(gh:*)"
metadata:
  author: kizukai
  version: 1.0.0
  category: git
  tags: [git, pull-request, github, gh-cli]
---

# /pr — PR 作成

GitHub CLI を使用してプルリクエストを作成する Skill。

## Instructions

### Step 1: 現在ブランチの全コミット確認

ベースブランチからの全コミットを確認する。

```bash
git branch --show-current
git log main..HEAD --oneline
```

- 現在のブランチが feature / fix / hotfix ブランチであることを確認する
- main ブランチから直接 PR を作成しようとしている場合は警告する
- コミットが存在しない場合はその旨を報告して終了する

### Step 2: 変更内容の分析

コミット履歴と差分から変更内容を分析する。

```bash
git diff main...HEAD --stat
```

- 変更ファイル数、追加行数、削除行数を把握する
- 変更の主要な目的（新機能・バグ修正・リファクタリング等）を特定する

### Step 3: PR タイトルの生成

Conventional Commits 形式で PR タイトルを生成する。

- ブランチ名やコミット履歴から適切な prefix を選定する
- 70文字以内で簡潔なタイトルを作成する
- ユーザーに確認し、必要に応じて修正を受け付ける

### Step 4: PR 本文の作成

PR 本文テンプレートに従って本文を作成する。

テンプレートの詳細は [references/pr-template.md](references/pr-template.md) を参照。

- Summary: 変更の概要を 1-3 行で記述する
- Changes: 変更点を箇条書きで記述する
- Test Plan: テスト方法のチェックリストを作成する

### Step 5: PR の作成

GitHub CLI で PR を作成する。

```bash
git push -u origin <branch-name>
gh pr create --title "<title>" --body "<body>" --base main
```

- リモートに未 push のコミットがあれば先に push する
- ベースブランチはデフォルトで `main` を使用する
- ユーザーが別のベースブランチを指定した場合はそれに従う

### Step 6: PR URL の表示

作成された PR の URL を表示する。

- PR 番号と URL をユーザーに報告する
- レビュアーのアサインが必要か確認する
- 次のアクション（レビュー依頼等）を提案する

## Examples

### Example 1: 機能追加の PR

```
ユーザー: 「PR を作って」

Step 1: feature/123-user-auth ブランチ、3 コミットを確認
Step 2: 5 ファイル変更、+200 -10 行
Step 3: タイトル → "feat(auth): ユーザー認証機能の実装"
Step 4: テンプレートに沿って本文を作成
Step 5: gh pr create で PR 作成
Step 6: PR #456 https://github.com/org/repo/pull/456
```

### Example 2: バグ修正の PR

```
ユーザー: 「PRを作成して」

Step 1: fix/789-validation-error ブランチ、1 コミットを確認
Step 2: 2 ファイル変更、+15 -5 行
Step 3: タイトル → "fix(validation): 入力バリデーションのエラーハンドリング修正"
Step 4: テンプレートに沿って本文を作成
Step 5: gh pr create で PR 作成
Step 6: PR #790 https://github.com/org/repo/pull/790
```

## Troubleshooting

### Error: リモートに未 push のコミットがある

**原因**: ローカルのコミットがリモートに push されていない

**解決策**:
1. `git push -u origin <branch>` でリモートに push する
2. push 成功後に `gh pr create` を実行する

### Error: gh CLI が認証されていない

**原因**: GitHub CLI の認証が未設定

**解決策**:
1. `gh auth status` で認証状態を確認する
2. 未認証の場合は `gh auth login` を案内する
3. 認証後に PR 作成フローを再開する

### Error: ベースブランチとの差分がない

**原因**: 現在のブランチにベースブランチからの変更がない

**解決策**:
1. コミットが存在するか確認する
2. 正しいベースブランチを指定しているか確認する
3. リベースや マージが必要な場合は案内する
