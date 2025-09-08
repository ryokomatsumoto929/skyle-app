// SimpleMomentCard.tsx - バックエンドのレスポンス構造に合わせて修正
import React, { useState, useEffect } from "react";
import "./SimpleMomentCard.css";

// バックエンドの実際のレスポンス構造に合わせた型定義
interface WeatherData {
  solar_times: {
    sunrise: string;
    sunset: string;
    solar_noon: string;
    golden_hour_evening_start: string;
    golden_hour_evening_end: string;
    blue_hour_morning_start?: string;
    blue_hour_morning_end?: string;
    blue_hour_evening_start?: string;
    blue_hour_evening_end?: string;
  };
  weather: {
    temperature: number;
    humidity: number;
    cloud_cover: number;
    wind_speed: number;
    visibility: number;
    weather_description: string;
  };
  visibility: {
    level: string;
    score: number;
    message: string;
    emoji: string;
  };
  city?: string;
  timestamp: string;
  data_source: string;
}

const SimpleMomentCard: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentCity, setCurrentCity] = useState("大阪");

  // 現在時刻から時間帯を判定
  const getCurrentTimeType = (): "morning" | "evening" | "night" => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour <= 8) return "morning";
    if (hour >= 17 && hour <= 20) return "evening";
    return "night";
  };

  // スコアから品質情報を生成
  const getQualityInfo = (score: number, timeType: string) => {
    const timeText =
      timeType === "morning" ? "朝" : timeType === "evening" ? "夕暮れ" : "夜";

    if (score >= 75)
      return {
        quality: "excellent",
        description: `息をのむほど美しい${timeText}になりそうです`,
      };
    if (score >= 55)
      return {
        quality: "good",
        description: `とても美しい${timeText}になりそうです`,
      };
    if (score >= 35)
      return {
        quality: "fair",
        description: `美しい${timeText}になりそうです`,
      };
    return {
      quality: "poor",
      description: `今日は静かな${timeText}になりそうです`,
    };
  };

  // API呼び出し関数
  const fetchWeatherData = async (lat?: number, lng?: number) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (lat !== undefined && lng !== undefined) {
        params.append("lat", lat.toString());
        params.append("lng", lng.toString());
      }

      const url = `http://localhost:3001/api/today-forecast${
        params.toString() ? "?" + params.toString() : ""
      }`;
      console.log("Fetching:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        mode: "cors",
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.log("Non-JSON response:", text);
        throw new Error("レスポンスがJSONではありません");
      }

      const data: WeatherData = await response.json();
      console.log("Received data:", data);
      setWeatherData(data);
    } catch (err) {
      console.error("API Error:", err);
      setError(
        err instanceof Error ? err.message : "不明なエラーが発生しました"
      );
    } finally {
      setLoading(false);
    }
  };

  // 都市データ
  const cities = {
    東京: { lat: 35.6762, lng: 139.6503 },
    大阪: { lat: 34.6937, lng: 135.5023 },
    札幌: { lat: 43.0642, lng: 141.3469 },
  };

  // 都市変更ハンドラー
  const handleCityChange = (cityName: string) => {
    setCurrentCity(cityName);
    const coords = cities[cityName as keyof typeof cities];
    fetchWeatherData(coords.lat, coords.lng);
  };

  // 初期データ取得
  useEffect(() => {
    const coords = cities[currentCity as keyof typeof cities];
    fetchWeatherData(coords.lat, coords.lng);
  }, []);

  // 現在の時間とデータから表示内容を決定
  const getCurrentMoment = () => {
    if (!weatherData) return null;

    const timeType = getCurrentTimeType();
    const qualityInfo = getQualityInfo(weatherData.visibility.score, timeType);

    let time = "";
    let title = "";

    if (timeType === "morning") {
      // 朝の場合：日の出時刻を表示
      time = `${weatherData.solar_times.sunrise} 頃`;
      title = "今朝の日の出";
    } else if (timeType === "evening") {
      // 夕方の場合：ゴールデンアワーを表示
      time = `${weatherData.solar_times.golden_hour_evening_start} - ${weatherData.solar_times.golden_hour_evening_end}`;
      title = "今夕のマジックアワー";
    } else {
      // 夜の場合：翌朝の日の出
      time = `明朝 ${weatherData.solar_times.sunrise} 頃`;
      title = "明朝の日の出";
    }

    return {
      timeType,
      quality: qualityInfo.quality,
      time,
      title,
      description: weatherData.visibility.message,
      location: weatherData.city || "不明な地域",
    };
  };

  const currentMoment = getCurrentMoment();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-text">読み込み中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-text">エラー: {error}</div>
        <button onClick={() => fetchWeatherData()} className="retry-button">
          再試行
        </button>
      </div>
    );
  }

  if (!currentMoment) {
    return <div>データがありません</div>;
  }

  return (
    <div
      className={`moment-container ${
        currentMoment.timeType === "evening" ? "evening" : ""
      }`}
    >
      <h1 className="app-title">Skyle</h1>

      {/* 都市選択ボタン */}
      <div className="city-selector">
        {Object.keys(cities).map((cityName) => (
          <button
            key={cityName}
            className={`city-button ${
              currentCity === cityName ? "active" : ""
            }`}
            onClick={() => handleCityChange(cityName)}
          >
            {cityName}
          </button>
        ))}
      </div>

      <div className="location">📍 {currentMoment.location}</div>

      <div className={`main-content ${currentMoment.quality}`}>
        <div className={`moment-icon ${currentMoment.timeType}-icon`}></div>
        <div className="moment-title">{currentMoment.title}</div>
        <div className="moment-time">{currentMoment.time}</div>
        <div className="moment-description">{currentMoment.description}</div>
      </div>

      <button className="notification-toggle">🔔 15分前にお知らせ</button>

      {/* 次の時間帯のプレビュー */}
      <div className="next-moment">
        {currentMoment.timeType === "morning"
          ? `🌇 今夕のマジックアワー ${weatherData?.solar_times.golden_hour_evening_start} - ${weatherData?.solar_times.golden_hour_evening_end}`
          : `🌅 明朝の日の出 ${weatherData?.solar_times.sunrise} 頃`}
      </div>

      {/* デバッグ情報（開発用） */}
      {weatherData && (
        <div
          style={{
            marginTop: "20px",
            padding: "10px",
            background: "rgba(0,0,0,0.1)",
            borderRadius: "10px",
            fontSize: "12px",
            opacity: 0.7,
          }}
        >
          スコア: {weatherData.visibility.score}/100 | データソース:{" "}
          {weatherData.data_source}
        </div>
      )}
    </div>
  );
};

export default SimpleMomentCard;
