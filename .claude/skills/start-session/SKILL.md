---
name: start-session
description: >
  セッション開始時の状況確認とコンテキスト共有を行う。
  Use when the user says "start session", "セッション開始", "作業開始", "状況確認",
  "begin session", or "what's the current status".
compatibility: "Claude Code only. Requires git, gh CLI."
allowed-tools: "Bash(git:*) Bash(gh:*) Read(*)"
metadata:
  author: kizukai
  version: 1.0.0
  category: workflow
  tags: [session, context, git-status, onboarding]
---

# /start-session — セッション開始

開発セッション開始時に現在の状態を確認し、前回からの引き継ぎ事項を報告する Skill。

## Instructions

### Step 1: ブランチ状態と未コミット変更の確認

現在の git 状態を確認する。

```bash
git status
git branch --show-current
```

- 現在のブランチ名を表示する
- 未コミットの変更（staged / unstaged / untracked）があれば一覧を表示する
- 変更がある場合は、コミットまたは stash を提案する

### Step 2: 直近コミット履歴の表示

直近のコミット履歴を確認する。

```bash
git log --oneline -5
```

- 直近 5 件のコミットメッセージを表示する
- 前回の作業内容を把握する手がかりとする

### Step 3: 関連 Issue / PR の確認

GitHub 上の関連 Issue や PR の状態を確認する。

```bash
gh issue list --assignee @me --state open --limit 5
gh pr list --author @me --state open --limit 5
```

- 自分に割り当てられたオープン Issue を表示する
- 自分が作成したオープン PR を表示する
- レビュー待ちの PR があれば注意を促す

### Step 4: 引き継ぎ事項の確認

CLAUDE.md やメモリから前回セッションの引き継ぎ事項を確認する。

- CLAUDE.md に記載された TODO やメモがあれば表示する
- メモリに保存された進行中タスクの情報があれば共有する
- 前回中断した作業がある場合は再開を提案する

## Examples

### Example 1: 通常の開発セッション開始

```
ユーザー: 「作業開始」

実行結果:
## 現在の状態
- ブランチ: feature/123-user-auth
- 未コミット変更: 2 ファイル（staged: 1, unstaged: 1）

## 直近コミット
- abc1234 feat(auth): ログイン API のエンドポイント追加
- def5678 test(auth): ログインサービスのユニットテスト追加
- ...

## オープン Issue / PR
- Issue #123: ユーザー認証機能の実装（In Progress）
- PR #456: feat(auth): ログイン機能の追加（レビュー待ち）

## 引き継ぎ事項
- ログアウト処理の実装が残っています
```

### Example 2: 前回中断からの再開

```
ユーザー: 「セッション開始」

実行結果:
## 現在の状態
- ブランチ: fix/789-validation-error
- 未コミット変更: なし（クリーン）

## 直近コミット
- ghi9012 fix(validation): バリデーションエラーメッセージの修正
- ...

## 引き継ぎ事項
- メモリより: バリデーションエラーの修正が完了し、テスト追加が次のステップ
- 提案: `/review` でコードレビューを実行後、`/pr` で PR を作成できます
```

## Troubleshooting

### Error: git リポジトリでない場合

**原因**: 現在のディレクトリが git リポジトリとして初期化されていない

**解決策**:
1. `git init` でリポジトリを初期化するか確認する
2. 正しいディレクトリに移動してから再実行する

### Error: gh CLI が認証されていない場合

**原因**: GitHub CLI の認証が未設定

**解決策**:
1. `gh auth status` で認証状態を確認する
2. 未認証の場合は `gh auth login` を案内する
3. Issue / PR の確認は省略し、その他の情報を報告する
