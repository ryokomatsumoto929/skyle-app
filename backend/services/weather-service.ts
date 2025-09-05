import axios from "axios";

interface WeatherData {
  clouds: { all: number };
  main: { humidity: number; temp: number };
  weather: Array<{ main: string; description: string }>;
  wind: { speed: number };
  visibility: number;
}

interface VisibilityPrediction {
  score: number;
  level: "excellent" | "good" | "fair" | "poor";
  message: string;
  details: {
    cloudCover: number;
    humidity: number;
    conditions: string[];
  };
}

export class WeatherService {
  private apiKey: string;
  private baseUrl = "https://api.openweathermap.org/data/2.5";

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async getWeatherData(lat: number, lng: number): Promise<WeatherData> {
    try {
      const response = await axios.get(`${this.baseUrl}/weather`, {
        params: {
          lat,
          lon: lng,
          appid: this.apiKey,
          units: "metric",
          lang: "ja",
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(`天気データの取得に失敗しました: ${error}`);
    }
  }

  calculateVisibility(weather: WeatherData): VisibilityPrediction {
    let score = 0;
    const conditions: string[] = [];

    // 雲量チェック（最重要）
    const cloudCover = weather.clouds.all;
    if (cloudCover >= 30 && cloudCover <= 70) {
      score += 40;
      conditions.push("適度な雲量");
    } else if (cloudCover < 30) {
      score += 10;
      conditions.push("雲が少なめ");
    } else if (cloudCover > 80) {
      score -= 20;
      conditions.push("雲が多い");
    }

    // 湿度チェック
    const humidity = weather.main.humidity;
    if (humidity >= 40 && humidity <= 70) {
      score += 25;
      conditions.push("適度な湿度");
    } else if (humidity > 70) {
      score += 15;
      conditions.push("湿度高め");
    } else {
      score += 5;
      conditions.push("乾燥気味");
    }

    // 天気状況チェック
    const mainWeather = weather.weather[0].main;
    if (mainWeather === "Clear") {
      score += 10;
      conditions.push("晴れ");
    } else if (mainWeather === "Clouds") {
      score += 20;
      conditions.push("曇り");
    } else if (mainWeather === "Rain") {
      score -= 30;
      conditions.push("雨");
    }

    // 風速チェック（空気の澄み具合）
    const windSpeed = weather.wind.speed;
    if (windSpeed >= 2 && windSpeed <= 5) {
      score += 10;
      conditions.push("適度な風");
    }

    // 視程チェック
    if (weather.visibility >= 10000) {
      score += 15;
      conditions.push("視程良好");
    }

    return this.getVisibilityLevel(score, cloudCover, humidity, conditions);
  }

  private getVisibilityLevel(
    score: number,
    cloudCover: number,
    humidity: number,
    conditions: string[]
  ): VisibilityPrediction {
    let level: VisibilityPrediction["level"];
    let message: string;

    if (score >= 80) {
      level = "excellent";
      message = "✨ 絶好のマジックアワー日和です！";
    } else if (score >= 60) {
      level = "good";
      message = "👌 美しい空が期待できそうです";
    } else if (score >= 40) {
      level = "fair";
      message = "🤔 見える可能性はありますが...";
    } else {
      level = "poor";
      message = "😔 今日は厳しそうです";
    }

    return {
      score,
      level,
      message,
      details: {
        cloudCover,
        humidity,
        conditions,
      },
    };
  }
}

export type { WeatherData, VisibilityPrediction };
