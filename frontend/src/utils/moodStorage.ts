// moodStorage.ts — localStorage で日別データを仮保存
// 後から FastAPI + PostgreSQL に差し替え可能な設計

export interface DayEntry {
  date: string; // "2026-02-13"
  shapes: string[]; // 選んだ形の履歴 ["peaks", "scatter", ...]
  skyViewCount: number; // 空を見た回数
}

const STORAGE_KEY = "skyle_mood_data";

function getAllData(): Record<string, DayEntry> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveAllData(data: Record<string, DayEntry>): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function todayKey(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function getOrCreateToday(data: Record<string, DayEntry>): DayEntry {
  const key = todayKey();
  if (!data[key]) {
    data[key] = { date: key, shapes: [], skyViewCount: 0 };
  }
  return data[key];
}

/** 今日のデータを取得 */
export function getTodayEntry(): DayEntry {
  const data = getAllData();
  return getOrCreateToday(data);
}

/** 形カードを選択して保存 */
export function addShape(shapeId: string): DayEntry {
  const data = getAllData();
  const today = getOrCreateToday(data);
  today.shapes.push(shapeId);
  saveAllData(data);
  return today;
}

/** 「空を見た」を記録 */
export function addSkyView(): DayEntry {
  const data = getAllData();
  const today = getOrCreateToday(data);
  today.skyViewCount += 1;
  saveAllData(data);
  return today;
}

/** 当月の全エントリを取得（サマリー用） */
export function getCurrentMonthEntries(): DayEntry[] {
  const data = getAllData();
  const now = new Date();
  const prefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  return Object.values(data)
    .filter((e) => e.date.startsWith(prefix))
    .sort((a, b) => a.date.localeCompare(b.date));
}

/** 今日のデータをリセット（開発用） */
export function resetToday(): DayEntry {
  const data = getAllData();
  const key = todayKey();
  data[key] = { date: key, shapes: [], skyViewCount: 0 };
  saveAllData(data);
  return data[key];
}
