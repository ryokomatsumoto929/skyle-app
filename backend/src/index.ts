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

// 太陽時刻計算API（位置情報対応版）
app.get("/api/solar/times", (req, res) => {
  try {
    // クエリパラメータから緯度経度を取得（デフォルトは大阪）
    const latitude = parseFloat(req.query.lat as string) || 34.6937;
    const longitude = parseFloat(req.query.lng as string) || 135.5023;
    const date = req.query.date
      ? new Date(req.query.date as string)
      : new Date();

    // 緯度経度の妥当性チェック
    if (latitude < -90 || latitude > 90) {
      return res
        .status(400)
        .json({ error: "緯度は-90から90の範囲で指定してください" });
    }
    if (longitude < -180 || longitude > 180) {
      return res
        .status(400)
        .json({ error: "経度は-180から180の範囲で指定してください" });
    }

    const times = SunCalc.getTimes(date, latitude, longitude);

    const result = {
      location: {
        latitude: latitude,
        longitude: longitude,
      },
      date: date.toISOString().split("T")[0],
      times: {
        sunrise: times.sunrise.toLocaleTimeString("ja-JP"),
        sunset: times.sunset.toLocaleTimeString("ja-JP"),
        goldenHour: times.goldenHour.toLocaleTimeString("ja-JP"),
        blueHour: times.dusk.toLocaleTimeString("ja-JP"),
        // 追加の太陽時刻
        dawn: times.dawn.toLocaleTimeString("ja-JP"),
        dusk: times.dusk.toLocaleTimeString("ja-JP"),
        nauticalDawn: times.nauticalDawn.toLocaleTimeString("ja-JP"),
        nauticalDusk: times.nauticalDusk.toLocaleTimeString("ja-JP"),
      },
    };

    res.json(result);
  } catch (error) {
    console.error("Solar calculation error:", error);
    res.status(500).json({ error: "太陽時刻の計算中にエラーが発生しました" });
  }
});

// 太陽時刻計算API（大阪の今日の時刻）- 後方互換性のため残す
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
