import type { TimePeriod } from "../types";
// 時間帯別グラデーション定義
export const TIME_GRADIENTS: Record<TimePeriod, string> = {
  // 早朝 - 朝焼け（H）
  earlyMorning:
    "linear-gradient(to bottom, #a8c5f0 0%, #b8d0f3 45%, #F0F8FF 65%, #FFFFF0 82%, #FFE4E1 94%, #ffc4b8 100%)",

  // 朝 - 朝焼け（H）と同じ
  morning:
    "linear-gradient(to bottom, #a8c5f0 0%, #b8d0f3 45%, #F0F8FF 65%, #FFFFF0 82%, #FFE4E1 94%, #ffc4b8 100%)",

  // 昼 - 冬の昼（P）
  daytime:
    "linear-gradient(to bottom, #2850A8 0%, #5078C8 5%, #7CA0DC 15%, #A8C8F0 35%, #C8DEF5 55%, #E8F2FA 80%, #FFFFFF 100%)",

  // 夕方 - 夕焼け（Y）
  evening:
    "linear-gradient(to bottom, #8fa8c8 0%, #a0b8d0 25%, #dce8f0 40%, #fff5e0 55%, #ffc4a8 78%, #ff9878 100%)",

  // 夜 - 夜（NI）
  night:
    "linear-gradient(to bottom, #100a1c 0%, #181030 15%, #1c1840 30%, #1e2858 50%, #263c70 70%, #325088 85%, #3c60a0 100%)",
};

// プリロードする画像のリスト
export const IMAGES_TO_PRELOAD = [
  "/images/magic-hour-excellent.jpg",
  "/images/magic-hour-good.jpg",
  "/images/magic-hour-poor.jpg",
  "/images/blue-moment-excellent.jpg",
  "/images/blue-moment-good.jpg",
  "/images/blue-moment-poor.jpg",
  "/images/halo-excellent.jpg",
  "/images/halo-good.jpg",
  "/images/halo-poor.jpg",
];
