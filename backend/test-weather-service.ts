// WeatherServiceのテスト
import dotenv from "dotenv";
import { WeatherService } from "./services/weather-service";

dotenv.config({ path: "../.env" });

async function testWeatherService(): Promise<void> {
  const apiKey: string | undefined = process.env.OPENWEATHER_API_KEY;

  if (!apiKey) {
    console.error("❌ APIキーが設定されていません");
    return;
  }

  const weatherService = new WeatherService(apiKey);

  console.log("🧪 WeatherServiceテスト開始...\n");

  try {
    // 大阪の位置（緯度経度）
    const lat: number = 34.6937;
    const lng: number = 135.5023;

    console.log("📍 テスト地点: 大阪市");
    console.log(`🌍 緯度: ${lat}, 経度: ${lng}\n`);

    // 天気データ取得
    const weatherData = await weatherService.getWeatherData(lat, lng);

    console.log("📊 取得した天気データ:");
    console.log(`🌡️ 気温: ${Math.round(weatherData.main.temp)}°C`);
    console.log(`☁️ 雲量: ${weatherData.clouds.all}%`);
    console.log(`💧 湿度: ${weatherData.main.humidity}%`);
    console.log(`🌤️ 天気: ${weatherData.weather[0].description}`);
    console.log(`💨 風速: ${weatherData.wind.speed}m/s`);
    console.log(`👁️ 視程: ${weatherData.visibility}m\n`);

    // 可視性計算
    const visibility = weatherService.calculateVisibility(weatherData);

    console.log("🔮 マジックアワー予報:");
    console.log(`📈 予報スコア: ${visibility.score}点`);
    console.log(`⭐ 可視性レベル: ${visibility.level}`);
    console.log(`💬 メッセージ: ${visibility.message}`);
    console.log(`📋 判定要素: ${visibility.details.conditions.join(", ")}\n`);

    // レコメンデーション
    console.log("📸 撮影アドバイス:");
    switch (visibility.level) {
      case "excellent":
        console.log("✨ カメラの準備をして、15分前にはスタンバイを！");
        break;
      case "good":
        console.log("👍 撮影チャンスです。外に出てみましょう！");
        break;
      case "fair":
        console.log("🤞 雲の隙間に期待。一応チェックしてみて。");
        break;
      case "poor":
        console.log("📚 今日は室内でゆっくり過ごしましょう。");
        break;
    }

    console.log("\n🚀 WeatherServiceテスト完了！");
  } catch (error: unknown) {
    console.error(
      "❌ エラーが発生しました:",
      error instanceof Error ? error.message : "不明なエラー"
    );
  }
}

// テスト実行
testWeatherService();
