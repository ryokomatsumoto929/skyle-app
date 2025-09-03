import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// 環境変数を読み込み
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// ミドルウェア設定
app.use(cors());
app.use(express.json());

// 基本的なルート
app.get("/", (req, res) => {
  res.json({ message: "Skyle API Server is running!" });
});

// ヘルスチェック用
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// テスト用APIエンドポイント
app.get("/api/test", (req, res) => {
  res.json({
    message: "API is working!",
    timestamp: new Date().toISOString(),
  });
});

// サーバー起動
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
