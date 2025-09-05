import SunCalc from "suncalc";

// 大阪の座標でテスト
const lat = 34.6937;
const lng = 135.5023;
const today = new Date();

console.log("🌅 SunCalcで取得できる時刻一覧:");
const times = SunCalc.getTimes(today, lat, lng);

// 全プロパティを表示
console.log("利用可能なプロパティ:", Object.keys(times));

// 各時刻を表示
for (const [key, value] of Object.entries(times)) {
  if (value instanceof Date) {
    console.log(`${key}: ${value.toLocaleTimeString("ja-JP")}`);
  }
}
