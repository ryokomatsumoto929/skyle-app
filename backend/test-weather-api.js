// テスト用スクリプト - test-weather-api.js
import axios from "axios";
import dotenv from "dotenv";

// .envファイルを読み込み（親ディレクトリから）
dotenv.config({ path: "../.env" });

async function testWeatherAPI() {
  const apiKey = process.env.OPENWEATHER_API_KEY;

  console.log("🔑 APIキー確認:", apiKey ? "設定済み" : "未設定");

  if (!apiKey) {
    console.error("❌ APIキーが設定されていません");
    console.log("💡 .envファイルにOPENWEATHER_API_KEYを追加してください");
    return;
  }

  console.log("🌤️ OpenWeatherMap API テスト開始...");

  try {
    // 大阪の天気を取得
    const response = await axios.get(
      "https://api.openweathermap.org/data/2.5/weather",
      {
        params: {
          q: "Osaka,JP",
          appid: apiKey,
          units: "metric",
          lang: "ja",
        },
      }
    );

    const data = response.data;

    console.log("✅ API接続成功！");
    console.log("📍 場所:", data.name);
    console.log("🌡️ 気温:", Math.round(data.main.temp) + "°C");
    console.log("☁️ 雲量:", data.clouds.all + "%");
    console.log("💧 湿度:", data.main.humidity + "%");
    console.log("🌤️ 天気:", data.weather[0].description);
    console.log("");

    // マジックアワー予報に必要なデータを確認
    console.log("📊 予報機能に必要なデータ:");
    console.log("- 雲量:", data.clouds.all + "% ✅");
    console.log("- 湿度:", data.main.humidity + "% ✅");
    console.log("- 風速:", data.wind.speed + "m/s ✅");
    console.log("- 視程:", data.visibility + "m ✅");
    console.log("");
    console.log("🚀 Skyleアプリでの予報機能実装準備完了！");
  } catch (error) {
    if (error.response?.status === 401) {
      console.error("❌ APIキーが無効です");
      console.log("💡 正しいAPIキーを.envファイルに設定してください");
    } else if (error.response?.status === 429) {
      console.error("❌ API使用制限に達しました");
      console.log("💡 しばらく待ってから再試行してください");
    } else {
      console.error("❌ エラーが発生しました:", error.message);
    }
  }
}

// テスト実行
testWeatherAPI();
