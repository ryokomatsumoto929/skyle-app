import type { TimePeriod, NextMoment, SolarData } from "../types";

// 現在の時間帯を判定する関数
export const getCurrentTimePeriod = (): TimePeriod => {
  const now = new Date();
  const hour = now.getHours();

  if (hour >= 4 && hour < 6) {
    return "earlyMorning";
  } else if (hour >= 6 && hour < 9) {
    return "morning";
  } else if (hour >= 9 && hour < 16) {
    return "daytime";
  } else if (hour >= 16 && hour < 18) {
    return "evening";
  } else {
    return "night";
  }
};

// ISO時刻をDateオブジェクトに変換
export const parseISOTime = (isoStr: string): Date => {
  return new Date(isoStr);
};

// 時刻を "HH:MM" 形式にフォーマット
export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString("ja-JP", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

// 可視性レベルを判定
export const getVisibilityLevel = (
  message: string
): "excellent" | "good" | "fair" | "poor" => {
  if (message.includes("絶好")) return "excellent";
  if (message.includes("美しい") || message.includes("期待"))
    return "excellent";
  if (message.includes("綺麗")) return "good";
  if (
    message.includes("隙間") ||
    message.includes("微妙") ||
    message.includes("チャンス")
  )
    return "fair";
  return "poor";
};

// 次のマジックアワー/ブルーモーメントを検索
export const findNextMoment = (
  data: SolarData,
  visibility: "excellent" | "good" | "fair" | "poor"
): NextMoment => {
  const now = new Date();

  const moments = [
    {
      type: "blue" as const,
      period: "morning" as const,
      start: parseISOTime(data.blue_hour_morning_start),
      end: parseISOTime(data.blue_hour_morning_end),
      message: "静寂な青い時間が訪れます",
    },
    {
      type: "magic" as const,
      period: "morning" as const,
      start: parseISOTime(data.golden_hour_morning_start),
      end: parseISOTime(data.golden_hour_morning_end),
      message: "黄金色の朝が始まります",
    },
    {
      type: "magic" as const,
      period: "evening" as const,
      start: parseISOTime(data.golden_hour_evening_start),
      end: parseISOTime(data.golden_hour_evening_end),
      message: "美しい夕暮れが期待できそうです",
    },
    {
      type: "blue" as const,
      period: "evening" as const,
      start: parseISOTime(data.blue_hour_evening_start),
      end: parseISOTime(data.blue_hour_evening_end),
      message: "静寂な青い時間をお楽しみください",
    },
  ];

  // 現在進行中のモーメントをチェック
  for (const moment of moments) {
    if (now >= moment.start && now <= moment.end) {
      return {
        type: moment.type,
        time: formatTime(moment.start),
        timeRange: `${formatTime(moment.start)} - ${formatTime(moment.end)}`,
        period: moment.period,
        message: "今です！空を見上げてみてください",
        isHappening: true,
        visibility: visibility,
      };
    }
  }

  // 次のモーメントを検索
  for (const moment of moments) {
    if (now < moment.start) {
      const minutesUntil = Math.floor(
        (moment.start.getTime() - now.getTime()) / 60000
      );
      const hoursUntil = Math.floor(minutesUntil / 60);
      const minsUntil = minutesUntil % 60;

      let timeMessage = "";
      if (hoursUntil > 0) {
        timeMessage = `あと${hoursUntil}時間${minsUntil}分`;
      } else if (minutesUntil > 0) {
        timeMessage = `あと${minutesUntil}分`;
      } else {
        timeMessage = "まもなく";
      }

      return {
        type: moment.type,
        time: formatTime(moment.start),
        timeRange: `${formatTime(moment.start)} - ${formatTime(moment.end)}`,
        period: moment.period,
        message: `${timeMessage} ${moment.message}`,
        isHappening: false,
        visibility: visibility,
      };
    }
  }

  // 全てのモーメントが過ぎた場合は明日の最初のモーメント
  return {
    type: "blue",
    time: formatTime(moments[0].start),
    timeRange: `${formatTime(moments[0].start)} - ${formatTime(
      moments[0].end
    )}`,
    period: "morning",
    message: "明日の朝、静寂な青い時間が訪れます",
    isHappening: false,
    visibility: visibility,
  };
};
