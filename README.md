# LaQ Recipe AI

手持ち LaQ パーツから、Gemini 3.5 Flash がオリジナル作品案を提案する Web アプリ（MVP）。

## 機能（Phase 1）

- パーツの手入力（色・形状・数量）
- ジャンル・難易度・サイズ感の指定
- Gemini 3.5 Flash による作品案生成
  - タイトル・コンセプト
  - 必要パーツ一覧
  - 3 ステップの組み立て手順
  - 構造メモ
- 結果のテキストコピー

## 技術スタック

- **Frontend / API**: Next.js 16 (App Router) + TypeScript + Tailwind CSS
- **AI**: Google Gemini 3.5 Flash (`@google/genai`)

## セットアップ

### 要件

- **Node.js >= 20.9.0**（Next.js 16 / `@google/genai` の要件）

```bash
node -v   # v20.9.0 以上を確認
```

### インストール

```bash
cp .env.example .env.local
# .env.local に GEMINI_API_KEY を設定

npm install
npm run dev
```

http://localhost:3000 を開く。

## 環境変数

| 変数 | 必須 | 説明 |
|------|------|------|
| `GEMINI_API_KEY` | ○ | Google AI Studio の API キー |
| `GEMINI_MODEL` | - | デフォルト: `gemini-3.5-flash` |

## API

### `POST /api/recipes/manual`

手入力から作品案を同期生成。

```json
{
  "genre": "乗り物",
  "difficulty": "中級",
  "size": "standard",
  "parts": [
    { "color": "黒", "type": "スクエア 5×5", "count": 24 },
    { "color": "赤", "type": "スクエア 3×3", "count": 16 }
  ],
  "notes": "レトロな四輪車"
}
```

## 今後（Phase 2+）

- カメラ撮影 + S3 アップロード
- AWS Lambda（Ruby）へのバックエンド移行
- 作品履歴・再生成

## ライセンス

Private
