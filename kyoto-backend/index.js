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