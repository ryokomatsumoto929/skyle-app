import React, { useState, useCallback, useEffect } from "react";
import {
  getTodayEntry,
  addShape,
  addSkyView,
  resetToday,
} from "../utils/moodStorage";
import type { DayEntry } from "../utils/moodStorage";

// ============================================
// Color Mixing Engine (HSL space, guaranteed beauty)
// ============================================

interface ShapeColor {
  h: number;
  s: number;
  l: number;
}

const SHAPE_COLORS: Record<string, ShapeColor> = {
  peaks: { h: 350, s: 65, l: 70 },
  drift: { h: 210, s: 65, l: 70 },
  scatter: { h: 280, s: 55, l: 75 },
  blocks: { h: 40, s: 60, l: 72 },
  tangle: { h: 170, s: 55, l: 70 },
  settle: { h: 30, s: 50, l: 68 },
};

const SHAPE_KEYS = Object.keys(SHAPE_COLORS);
const MIN_SATURATION = 50;
const MIN_LIGHTNESS = 60;
const MAX_LIGHTNESS = 78;

function mixColors(entries: string[], skyViewCount: number): ShapeColor | null {
  if (entries.length === 0) return null;

  const counts: Record<string, number> = {};
  entries.forEach((e) => {
    counts[e] = (counts[e] || 0) + 1;
  });

  const total = entries.length;
  let hueX = 0,
    hueY = 0,
    satSum = 0,
    lightSum = 0;

  Object.entries(counts).forEach(([shape, count]) => {
    const color = SHAPE_COLORS[shape];
    if (!color) return;
    const weight = count / total;
    const rad = (color.h * Math.PI) / 180;
    hueX += Math.cos(rad) * weight;
    hueY += Math.sin(rad) * weight;
    satSum += color.s * weight;
    lightSum += color.l * weight;
  });

  let hue = (Math.atan2(hueY, hueX) * 180) / Math.PI;
  if (hue < 0) hue += 360;

  let saturation = Math.max(satSum, MIN_SATURATION);
  let lightness = Math.max(Math.min(lightSum, MAX_LIGHTNESS), MIN_LIGHTNESS);

  const skyBonus = Math.min(skyViewCount * 1.5, 8);
  lightness = Math.min(lightness + skyBonus * 0.5, MAX_LIGHTNESS);
  saturation = Math.min(saturation + skyBonus * 0.3, 80);

  return {
    h: Math.round(hue),
    s: Math.round(saturation),
    l: Math.round(lightness),
  };
}

interface GradientResult {
  colors: string[];
  angle: number;
}

function buildGradient(
  entries: string[],
  skyViewCount: number,
): GradientResult | null {
  if (entries.length === 0) return null;

  if (entries.length === 1) {
    const c = SHAPE_COLORS[entries[0]];
    if (!c) return null;
    return { colors: [`hsl(${c.h}, ${c.s}%, ${c.l}%)`], angle: 135 };
  }

  const mixed = mixColors(entries, skyViewCount);
  if (!mixed) return null;

  const recent = SHAPE_COLORS[entries[entries.length - 1]];
  if (!recent) return null;

  const midH = (mixed.h + recent.h) / 2;
  const midS = Math.max((mixed.s + recent.s) / 2, MIN_SATURATION);
  const midL = Math.max(
    Math.min((mixed.l + recent.l) / 2, MAX_LIGHTNESS),
    MIN_LIGHTNESS,
  );

  return {
    colors: [
      `hsl(${mixed.h}, ${mixed.s}%, ${mixed.l}%)`,
      `hsl(${Math.round(midH)}, ${Math.round(midS)}%, ${Math.round(midL)}%)`,
      `hsl(${recent.h}, ${recent.s}%, ${recent.l}%)`,
    ],
    angle: 135 + entries.length * 17,
  };
}

// ============================================
// Shape SVG Components (organic, irregular)
// ============================================

const S = "rgba(0,0,0,0.28)";
const W = 1.8;

function PeaksShape({ size = 44 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none">
      <polyline
        points="2,38 8,18 13,30 19,8 24,26 28,14 33,32 38,6 42,38"
        stroke={S}
        strokeWidth={W}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

function DriftShape({ size = 44 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none">
      <line
        x1="10"
        y1="6"
        x2="10"
        y2="32"
        stroke={S}
        strokeWidth={W}
        strokeLinecap="round"
      />
      <line
        x1="17"
        y1="12"
        x2="17"
        y2="38"
        stroke={S}
        strokeWidth={W}
        strokeLinecap="round"
      />
      <line
        x1="24"
        y1="4"
        x2="24"
        y2="26"
        stroke={S}
        strokeWidth={W}
        strokeLinecap="round"
      />
      <line
        x1="31"
        y1="14"
        x2="31"
        y2="40"
        stroke={S}
        strokeWidth={W}
        strokeLinecap="round"
      />
      <line
        x1="37"
        y1="8"
        x2="37"
        y2="28"
        stroke={S}
        strokeWidth={W}
        strokeLinecap="round"
      />
    </svg>
  );
}

function ScatterShape({ size = 44 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none">
      <circle cx="13" cy="12" r="5" stroke={S} strokeWidth={W} />
      <circle cx="32" cy="10" r="3" stroke={S} strokeWidth={W} />
      <circle cx="38" cy="21" r="2" stroke={S} strokeWidth={W} />
      <circle cx="22" cy="26" r="7.5" stroke={S} strokeWidth={W} />
      <circle cx="10" cy="33" r="4" stroke={S} strokeWidth={W} />
      <circle cx="34" cy="35" r="5" stroke={S} strokeWidth={W} />
    </svg>
  );
}

function BlocksShape({ size = 44 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none">
      <rect
        x="4"
        y="4"
        width="18"
        height="18"
        rx="2"
        stroke={S}
        strokeWidth={W}
      />
      <rect
        x="14"
        y="14"
        width="18"
        height="18"
        rx="2"
        stroke={S}
        strokeWidth={W}
      />
      <rect
        x="22"
        y="22"
        width="18"
        height="18"
        rx="2"
        stroke={S}
        strokeWidth={W}
      />
    </svg>
  );
}

function TangleShape({ size = 44 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none">
      <path
        d="M8,20 C12,8 22,6 26,16 C30,26 18,32 14,24 C10,16 28,10 36,18 C42,24 34,36 24,32"
        stroke={S}
        strokeWidth={W}
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

function SettleShape({ size = 44 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none">
      <path
        d="M4,14 Q14,10 22,14 Q30,18 40,13"
        stroke={S}
        strokeWidth={W}
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M4,23 Q12,27 22,22 Q32,17 40,23"
        stroke={S}
        strokeWidth={W}
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M4,32 Q16,28 22,32 Q28,36 40,31"
        stroke={S}
        strokeWidth={W}
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

const SHAPE_COMPONENTS: Record<string, React.FC<{ size?: number }>> = {
  peaks: PeaksShape,
  drift: DriftShape,
  scatter: ScatterShape,
  blocks: BlocksShape,
  tangle: TangleShape,
  settle: SettleShape,
};

// ============================================
// Crescent Moon Visualization
// ============================================

interface CrescentMoonProps {
  entries: string[];
  skyViewCount: number;
  size?: number;
}

function CrescentMoon({
  entries,
  skyViewCount,
  size = 160,
}: CrescentMoonProps) {
  const grad = buildGradient(entries, skyViewCount);
  const isEmpty = entries.length === 0;

  const bg = isEmpty
    ? "rgba(255,255,255,0.06)"
    : grad && grad.colors.length === 1
      ? grad.colors[0]
      : grad
        ? `linear-gradient(${grad.angle}deg, ${grad.colors.join(", ")})`
        : "rgba(255,255,255,0.06)";

  return (
    <div
      style={{
        width: size,
        height: size,
        position: "relative",
        margin: "0 auto",
      }}
    >
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          background: bg,
          position: "absolute",
          top: 0,
          left: 0,
          transition: "background 1s ease",
          boxShadow: isEmpty
            ? "none"
            : `0 0 ${20 + skyViewCount * 4}px rgba(255,255,255,${0.1 + skyViewCount * 0.03})`,
        }}
      />
      <div
        style={{
          width: size * 0.82,
          height: size * 0.82,
          borderRadius: "50%",
          background: "var(--skyle-bg, #1a1a2e)",
          position: "absolute",
          top: size * -0.06,
          right: size * -0.12,
          transition: "background 2s ease",
        }}
      />
    </div>
  );
}

// ============================================
// Main MoodShape Component
// ============================================

const MoodShape: React.FC = () => {
  const [todayData, setTodayData] = useState<DayEntry>(getTodayEntry());
  const [lastTapped, setLastTapped] = useState<string | null>(null);
  const [skyJustTapped, setSkyJustTapped] = useState(false);

  useEffect(() => {
    setTodayData(getTodayEntry());
  }, []);

  const handleShapeTap = useCallback((shapeId: string) => {
    const updated = addShape(shapeId);
    setTodayData({ ...updated });
    setLastTapped(shapeId);
    setTimeout(() => setLastTapped(null), 600);
  }, []);

  const handleSkyView = useCallback(() => {
    const updated = addSkyView();
    setTodayData({ ...updated });
    setSkyJustTapped(true);
    setTimeout(() => setSkyJustTapped(false), 800);
  }, []);

  const handleReset = useCallback(() => {
    const updated = resetToday();
    setTodayData({ ...updated });
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 24,
        padding: "20px 16px",
        minHeight: "calc(100vh - 200px)",
        justifyContent: "center",
      }}
    >
      {/* 三日月 */}
      <div style={{ marginBottom: 0 }}>
        <CrescentMoon
          entries={todayData.shapes}
          skyViewCount={todayData.skyViewCount}
          size={140}
        />
      </div>

      {/* 空を見た ボタン（三日月と形カードの間） */}
      <button
        onClick={handleSkyView}
        style={{
          background: "none",
          border: "1px solid rgba(255,255,255,0.25)",
          borderRadius: 24,
          padding: "10px 28px",
          color: "rgba(255,255,255,0.75)",
          fontSize: "0.82rem",
          fontWeight: 300,
          letterSpacing: "0.12em",
          cursor: "pointer",
          transition: "all 0.4s ease",
          opacity: skyJustTapped ? 0.5 : 1,
          transform: skyJustTapped ? "scale(0.96)" : "scale(1)",
        }}
      >
        空を見た
        {todayData.skyViewCount > 0 && (
          <span style={{ marginLeft: 8, opacity: 0.6 }}>
            {todayData.skyViewCount}
          </span>
        )}
      </button>

      {/* 形カード 6種 */}
      <div
        style={{
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          justifyContent: "center",
          maxWidth: 320,
        }}
      >
        {SHAPE_KEYS.map((key) => {
          const ShapeComp = SHAPE_COMPONENTS[key];
          const isActive = lastTapped === key;
          return (
            <button
              key={key}
              onClick={() => handleShapeTap(key)}
              style={{
                width: 72,
                height: 72,
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 16,
                background: isActive
                  ? "rgba(255,255,255,0.15)"
                  : "rgba(255,255,255,0.06)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.3s ease",
                transform: isActive ? "scale(0.92)" : "scale(1)",
                padding: 0,
              }}
            >
              <ShapeComp size={40} />
            </button>
          );
        })}
      </div>

      {/* 今日の記録数 */}
      {todayData.shapes.length > 0 && (
        <div
          style={{
            fontSize: "0.7rem",
            color: "rgba(255,255,255,0.25)",
            letterSpacing: "0.08em",
            textAlign: "center",
          }}
        >
          {todayData.shapes.length} 色
        </div>
      )}

      {/* リセットボタン（開発用） */}
      {todayData.shapes.length > 0 && (
        <button
          onClick={handleReset}
          style={{
            background: "none",
            border: "none",
            color: "rgba(255,255,255,0.15)",
            fontSize: "0.65rem",
            cursor: "pointer",
            letterSpacing: "0.08em",
            padding: "8px 16px",
          }}
        >
          リセット
        </button>
      )}
    </div>
  );
};

export default MoodShape;
