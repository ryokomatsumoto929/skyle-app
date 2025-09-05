import express, { Request, Response, Router } from "express";
import { WeatherService } from "../services/weather-service.js";
import SunCalc from "suncalc";

const router: Router = express.Router();
const weatherService = new WeatherService(process.env.OPENWEATHER_API_KEY!);

interface QueryParams {
  lat?: string;
  lng?: string;
}

// マジックアワー・ブルーモーメント予報エンドポイント
router.get(
  "/api/golden-hour-forecast",
  async (req: Request<{}, {}, {}, QueryParams>, res: Response) => {
    try {
      const { lat, lng } = req.query;

      if (!lat || !lng) {
        return res.status(400).json({
          error: "緯度経度が必要です",
        });
      }

      // 天気データを取得
      const weatherData = await weatherService.getWeatherData(
        parseFloat(lat),
        parseFloat(lng)
      );

      // 可視性を計算
      const visibility = weatherService.calculateVisibility(weatherData);

      // レスポンス
      res.json({
        location: { lat: parseFloat(lat), lng: parseFloat(lng) },
        weather: {
          description: weatherData.weather[0].description,
          cloudCover: weatherData.clouds.all,
          humidity: weatherData.main.humidity,
          temperature: Math.round(weatherData.main.temp),
          windSpeed: weatherData.wind.speed,
        },
        forecast: {
          visibility: visibility.level,
          score: visibility.score,
          message: visibility.message,
          conditions: visibility.details.conditions,
          recommendation: getRecommendation(visibility.level),
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("天気予報エラー:", error);
      res.status(500).json({
        error: "天気データの取得に失敗しました",
      });
    }
  }
);

// 今日の総合予報（太陽時刻 + 天気予報）
router.get(
  "/api/today-forecast",
  async (req: Request<{}, {}, {}, QueryParams>, res: Response) => {
    try {
      const { lat, lng } = req.query;

      if (!lat || !lng) {
        return res.status(400).json({
          error: "緯度経度が必要です",
        });
      }

      const position = { lat: parseFloat(lat), lng: parseFloat(lng) };

      // 既存の太陽時刻計算
      const today = new Date();
      const times = SunCalc.getTimes(today, position.lat, position.lng) as any;

      // ブルーアワーの手動計算
      const blueHourStart =
        times.nauticalDusk ||
        times.dusk ||
        new Date(times.sunset.getTime() + 10 * 60000);
      const blueHourEnd =
        times.night || new Date(times.sunset.getTime() + 30 * 60000);

      // 天気予報を取得
      const weatherData = await weatherService.getWeatherData(
        position.lat,
        position.lng
      );
      const visibility = weatherService.calculateVisibility(weatherData);

      res.json({
        location: position,
        date: today.toISOString().split("T")[0],
        solarTimes: {
          sunrise: times.sunrise,
          sunset: times.sunset,
          goldenHour: times.goldenHour,
          goldenHourEnd: times.goldenHourEnd,
          blueHour: blueHourStart,
          blueHourEnd: blueHourEnd,
        },
        weather: {
          description: weatherData.weather[0].description,
          cloudCover: weatherData.clouds.all,
          humidity: weatherData.main.humidity,
          temperature: Math.round(weatherData.main.temp),
        },
        forecast: {
          visibility: visibility.level,
          message: visibility.message,
          score: visibility.score,
          recommendation: getRecommendation(visibility.level),
          bestTiming: getBestTiming(times, visibility.level),
        },
      });
    } catch (error) {
      console.error("総合予報エラー:", error);
      res.status(500).json({
        error: "予報データの取得に失敗しました",
      });
    }
  }
);

function getRecommendation(level: string): string {
  switch (level) {
    case "excellent":
      return "📸 カメラの準備をして、15分前にはスタンバイを！";
    case "good":
      return "👍 撮影チャンスです。外に出てみましょう！";
    case "fair":
      return "🤞 雲の隙間に期待。一応チェックしてみて。";
    case "poor":
      return "📚 今日は室内でゆっくり過ごしましょう。";
    default:
      return "🌅 マジックアワーをお楽しみください。";
  }
}

function getBestTiming(times: any, visibility: string): string {
  const goldenHour = new Date(times.goldenHour);

  if (visibility === "excellent" || visibility === "good") {
    return `${goldenHour.getHours()}:${goldenHour
      .getMinutes()
      .toString()
      .padStart(2, "0")}頃から撮影開始がおすすめ`;
  } else {
    return "雲の隙間を狙って柔軟に対応しましょう";
  }
}

export default router;
