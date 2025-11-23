import { TimePeriod } from "../types";

// 時間帯別グラデーション定義（全て淡く控えめなトーン）
export const TIME_GRADIENTS: Record<TimePeriod, string> = {
  earlyMorning: "linear-gradient(to bottom, #dbeafe 0%, #bfdbfe 30%, #a5b4fc 60%, #c4b5fd 100%)",
  morning: "linear-gradient(to bottom, #fed7aa 0%, #fdba74 30%, #fb923c 60%, #fbbf24 100%)",
  daytime: "linear-gradient(to bottom, #eff6ff 0%, #dbeafe 30%, #bfdbfe 60%, #93c5fd 100%)",
  evening: "linear-gradient(to bottom, #fecaca 0%, #fca5a5 30%, #fb923c 60%, #fde047 100%)",
  night: "linear-gradient(to bottom, #cbd5e1 0%, #94a3b8 30%, #64748b 60%, #475569 100%)"
};

// プリロードする画像のリスト
export const IMAGES_TO_PRELOAD = [
  '/images/magic-hour-excellent.jpg',
  '/images/magic-hour-good.jpg',
  '/images/magic-hour-poor.jpg',
  '/images/blue-moment-excellent.jpg',
  '/images/blue-moment-good.jpg',
  '/images/blue-moment-poor.jpg',
  '/images/halo-excellent.jpg',
  '/images/halo-good.jpg',
  '/images/halo-poor.jpg',
];
