# バックエンド実装ガイド (京旅プランナー)
このガイドでは、Node.jsとExpressを使ってバックエンドサーバーを構築し、Gemini APIから旅行の提案を取得する単一のAPIエンドポイントを作成し、最終的にデプロイするまでの手順を説明します。

## ステップ1: プロジェクトの初期化

まず、プロジェクト用の新しいディレクトリを作成し、Node.jsプロジェクトとして初期化します。次に、必要なnpmパッケージをインストールします。

```sh
mkdir kyoto-backend
cd kyoto-backend
npm init -y
npm install express @google/generative-ai cors
```

## ステップ2: `index.js`の作成と基本サーバーの構築

プロジェクトのルートに`index.js`という名前のファイルを作成し、以下のコードを記述して基本的なExpressサーバーをセットアップします。

```javascript
const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;

// すべてのオリジンからのリクエストを許可するためにCORSを有効化
app.use(cors());
app.use(express.json());

// APIエンドポイントのプレースホルダー
app.post('/api/suggest', (req, res) => {
  // この部分はステップ3で実装します
  res.status(501).json({ message: 'Not Implemented' });
});

app.listen(port, () => {
  console.log(`サーバーが http://localhost:${port} で起動しました`);
});
```

## ステップ3: Gemini APIロジックの実装

次に、`index.js`の`/api/suggest`エンドポイントを更新して、Gemini APIを呼び出すための完全なロジックを実装します。

```javascript
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require(' @google/generative-ai');

const app = express();
const port = 3000;

// CORSとJSONパーサーを有効化
app.use(cors());
app.use(express.json());

// APIキーを環境変数から読み込み、Geminiクライアントを初期化
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/suggest', async (req, res) => {
  try {
    // gemini-proモデルを使用
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // 具体的なプロンプトを定義
    const prompt = '「京都のおすすめ観光スポットを5つ、以下の厳密なJSON配列形式でのみ提案してください: [{"name": "スポット名", "description": "15文字程度の簡単な説明", "image_url": "画像のURL"}]」';

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // APIからのレスポンスをJSONとしてパース
    const suggestions = JSON.parse(text);
   
    res.json(suggestions);
  } catch (error) {
    // エラーハンドリング
    console.error('Error calling Gemini API:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.listen(port, (). => {
  console.log(`サーバーが http://localhost:${port} で起動しました`);
});
```

## ステップ4: Vercelでのデプロイ

このExpressサーバーをVercelのようなプラットフォームにデプロイするには、リクエストを正しく処理するための設定ファイルが必要です。プロジェクトのルートに`vercel.json`という名前のファイルを作成し、以下の内容を記述します。

これにより、すべての受信リクエストが`index.js`ファイルによって処理されるようになります。

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.js" }]
}
```

**重要:** Vercelプロジェクトをデプロイした後、プロジェクト設定の環境変数に`GEMINI_API_KEY`を追加することを忘れないでください。
