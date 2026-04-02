---
name: docs
description: >
  ドキュメントの生成・更新を行う。
  Use when the user says "update docs", "ドキュメント更新", "docs更新",
  "ドキュメントを書いて", "generate docs", or "write documentation".
compatibility: "Claude Code only. Requires git."
allowed-tools: "Write(docs/**) Read(*) Bash(git:*)"
metadata:
  author: kizukai
  version: 1.0.0
  category: documentation
  tags: [docs, documentation, markdown]
---

# /docs — ドキュメント更新

変更差分を分析し、影響を受けるドキュメントを特定・更新する Skill。

## Instructions

### Step 1: 変更差分から影響ドキュメントの特定

現在の変更差分を確認し、影響を受けるドキュメントを特定する。

```bash
git diff --name-only
git diff --staged --name-only
```

- 変更されたファイルのパスから、関連するドキュメントを推定する
- API エンドポイントの変更 → API 設計ドキュメント
- モジュールの追加・変更 → 機能設計ドキュメント
- 設定ファイルの変更 → セットアップ・運用ドキュメント

### Step 2: 既存ドキュメントの有無チェック

`docs/` ディレクトリ内の既存ドキュメントを確認する。

- 関連するドキュメントが既に存在するか確認する
- 存在する場合は現在の内容を読み取る
- 存在しない場合は新規作成の対象とする

### Step 3: ドキュメントの新規作成 or 既存更新

#### 新規作成の場合

`docs/` 配下に適切な構造でドキュメントを作成する。

```markdown
# <ドキュメントタイトル>

## 概要
<!-- 対象機能・モジュールの説明 -->

## 詳細
<!-- 設計・実装の詳細 -->

## 関連ドキュメント
<!-- 関連するドキュメントへのリンク -->
```

#### 既存更新の場合

- 変更内容に基づいて該当セクションを更新する
- 既存の記述と矛盾しないように整合性を確認する
- 不要になった記述は削除する

### Step 4: 更新サマリーの報告

ドキュメント更新の内容をサマリーとして報告する。

- 新規作成したドキュメントの一覧
- 更新したドキュメントと変更箇所の概要
- 確認が必要な箇所があれば指摘する
- 次のアクション（`/commit` でドキュメント変更をコミット等）を提案する

## Examples

### Example 1: API 変更に伴う設計ドキュメント更新

```
ユーザー: 「ドキュメント更新して」

Step 1: git diff で src/modules/user/user.controller.ts の変更を検出
  → 新しいエンドポイント POST /api/v1/users/verify が追加されている
Step 2: docs/features/user.md が存在することを確認
Step 3: user.md の API 設計セクションに新エンドポイントを追記
Step 4: サマリー報告

## 更新サマリー
- 更新: docs/features/user.md
  - API 設計セクションに POST /api/v1/users/verify を追加
```

### Example 2: 新機能のドキュメント作成

```
ユーザー: 「ドキュメントを書いて」

Step 1: git diff で src/modules/notification/ 配下の新規ファイルを検出
Step 2: docs/features/notification.md が存在しないことを確認
Step 3: docs/features/notification.md を新規作成
Step 4: サマリー報告

## 更新サマリー
- 新規作成: docs/features/notification.md
  - 概要、API 設計、データモデルのセクションを含む
```

## Troubleshooting

### Error: docs/ ディレクトリが存在しない場合

**原因**: プロジェクトにドキュメントディレクトリが作成されていない

**解決策**:
1. `docs/` ディレクトリを作成するか確認する
2. 作成する場合は適切なサブディレクトリ構成も提案する（例: `docs/features/`, `docs/api/`）
3. ユーザー確認後にディレクトリとドキュメントを作成する
