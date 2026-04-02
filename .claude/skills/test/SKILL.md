---
disable-model-invocation: true
argument-hint: "[target-file]"
---

# /test - Vitest テスト作成

対象ファイルを解析して TDD 手法でユニットテストを作成します。

## 引数

- `target-file`: テスト対象のファイルパス（例: `src/services/reports.service.ts`）

## 手順

1. 対象ファイルを読み込み、公開 API（exported functions/classes/hooks）を解析
2. テストケースを設計:
   - 正常系: 主要な使用パターン
   - 異常系: エラーケース、エッジケース
   - 境界値: 空配列、null、undefined 等
3. TDD で実装:
   - **Red**: 失敗するテストを記述
   - **Green**: テストをパスさせる（対象ファイルに問題がある場合は修正を提案）
   - **Refactor**: テストコードを整理
4. `pnpm test {テストファイルパス}` で実行して全てパスすることを確認

## テスト配置ルール

- コンポーネント: `src/components/**/{name}.test.tsx`
- サービス: `src/services/{name}.service.test.ts`
- フック: `src/hooks/**/{name}.test.ts`
- ユーティリティ: `src/lib/{name}.test.ts`

## テストの原則

- 実装詳細ではなく振る舞いをテスト
- テスト間の依存を避ける
- 外部依存はモック化
- 冗長なテストコードは不要
- 各テストには明確な日本語の説明（describe/it）を使用
