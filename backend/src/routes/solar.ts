import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import SunCalc from "suncalc";

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

// 太陽時刻計算API（大阪の今日の時刻）
app.get("/api/solar/today", (req, res) => {
  try {
    const latitude = 34.6937; // 大阪の緯度
    const longitude = 135.5023; // 大阪の経度
    const today = new Date();

    const times = SunCalc.getTimes(today, latitude, longitude);

    const result = {
      location: "大阪",
      date: today.toISOString().split("T")[0],
      times: {
        sunrise: times.sunrise.toLocaleTimeString("ja-JP"),
        sunset: times.sunset.toLocaleTimeString("ja-JP"),
        goldenHour: times.goldenHour.toLocaleTimeString("ja-JP"),
        blueHour: times.dusk.toLocaleTimeString("ja-JP"),
      },
    };

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "太陽時刻の計算中にエラーが発生しました" });
  }
});

// サーバー起動
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
