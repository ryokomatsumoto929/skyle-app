import React, { useState, useEffect } from "react";
import { Box, Card, CardContent, Container, Typography } from "@mui/material";

// Types
import type {
  NextMoment,
  WeatherData,
  ForecastResponse,
  SolarData,
  Location,
  TimePeriod,
} from "./types";

// Components
import { Header } from "./components/Header";
import { LocationButton } from "./components/LocationButton";
import { MomentCard } from "./components/MomentCard";
import { NavigationMenu } from "./components/NavigationMenu";
import { AboutPage } from "./components/AboutPage";
import MoodShape from "./components/MoodShape";
import { InstallPrompt } from "./components/InstallPrompt";

// Hooks
import { useTimeGradient } from "./hooks/useTimeGradient";

// Utils
import { getVisibilityLevel, findNextMoment } from "./utils/timeUtils";

// Constants
import { IMAGES_TO_PRELOAD } from "./constants/gradients";

// ============================================
// Page Dot Navigator (上部配置)
// ============================================
interface PageDotsProps {
  pages: string[];
  current: string;
  onChange: (page: string) => void;
}

const PageDots: React.FC<PageDotsProps> = ({ pages, current, onChange }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      gap: 10,
      marginTop: 16,
      marginBottom: 8,
    }}
  >
    {pages.map((page) => (
      <button
        key={page}
        onClick={() => onChange(page)}
        aria-label={page}
        style={{
          width: current === page ? 8 : 6,
          height: current === page ? 8 : 6,
          borderRadius: "50%",
          border: "none",
          background: current === page ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.12)",
          cursor: "pointer",
          padding: 0,
          transition: "all 0.3s ease",
        }}
      />
    ))}
  </div>
);

// ============================================
// Main App
// ============================================
const SkyleApp = () => {
  // State
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [currentPage, setCurrentPage] = useState("home");
  const [nextMoment, setNextMoment] = useState<NextMoment | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<Location | null>(null);
  const [demoMode, setDemoMode] = useState<TimePeriod | null>(null);

  const open = Boolean(anchorEl);
  const currentGradient = useTimeGradient(demoMode);

  // メインページ一覧（about はメニューからのみ）
  const mainPages = ["home", "mood"];

  // 画像のプリロード
  useEffect(() => {
    IMAGES_TO_PRELOAD.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // 位置情報取得
  const getLocation = () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("位置情報がサポートされていません");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });
        fetchForecastData(latitude, longitude);
      },
      (error) => {
        console.error("位置情報取得エラー:", error);
        setError("位置情報の取得に失敗しました。大阪のデータを表示します。");
        fetchForecastData(34.6937, 135.5023);
      },
    );
  };

  // 天気予報データ取得
  const fetchForecastData = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/today-forecast?lat=${lat}&lng=${lng}`,
      );

      if (!response.ok) {
        throw new Error("データの取得に失敗しました");
      }

      const data: ForecastResponse = await response.json();

      setWeatherData({
        ...data.weather,
        haloVisibility: data.haloVisibility,
      });

      const visibilityLevel = getVisibilityLevel(data.weather.visibility);

      const solarData: SolarData = {
        sunrise: data.solarTimes.sunrise,
        sunset: data.solarTimes.sunset,
        golden_hour_morning_start: data.solarTimes.sunrise,
        golden_hour_morning_end: data.solarTimes.sunrise,
        golden_hour_evening_start: data.solarTimes.sunset,
        golden_hour_evening_end: data.solarTimes.goldenHour,
        blue_hour_morning_start: data.solarTimes.sunrise,
        blue_hour_morning_end: data.solarTimes.sunrise,
        blue_hour_evening_start: data.solarTimes.blueHour,
        blue_hour_evening_end: data.solarTimes.blueHour,
      };

      const next = findNextMoment(solarData, visibilityLevel);
      setNextMoment(next);
      setError(null);
      setLoading(false);
    } catch (err) {
      console.error("API呼び出しエラー:", err);
      setError(
        "バックエンドに接続できません。サーバーが起動しているか確認してください。",
      );
      setLoading(false);
    }
  };

  // 初回データ取得（大阪）
  useEffect(() => {
    fetchForecastData(34.6937, 135.5023);
  }, []);

  // メニューハンドラー
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
  };

  const handleTimePeriodChange = (period: TimePeriod | null) => {
    setDemoMode(period);
  };

  return (
    <Box
      sx={
        {
          minHeight: "100vh",
          background: currentGradient,
          py: 3,
          transition: "background 2s ease-in-out",
          "--skyle-bg": currentGradient,
        } as React.CSSProperties
      }
    >
      <Header open={open} demoMode={!!demoMode} onMenuClick={handleClick} />

      {/* ページ切り替えドット（aboutページ以外で表示） */}
      {currentPage !== "about" && (
        <PageDots
          pages={mainPages}
          current={currentPage}
          onChange={handlePageChange}
        />
      )}

      <Container maxWidth="xs">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            minHeight: "calc(100vh - 200px)",
            justifyContent: "center",
          }}
        >
          {/* ===== 空の予報ページ ===== */}
          {currentPage === "home" && (
            <>
              <LocationButton
                loading={loading}
                location={location}
                onGetLocation={getLocation}
              />

              {loading && (
                <Box
                  sx={{
                    textAlign: "center",
                    py: 8,
                    animation: "pulse 2s ease-in-out infinite",
                    "@keyframes pulse": {
                      "0%, 100%": { opacity: 0.4 },
                      "50%": { opacity: 1 },
                    },
                  }}
                >
                  <Typography
                    sx={{
                      color: "#94a3b8",
                      fontWeight: 300,
                      fontSize: "0.9rem",
                      letterSpacing: "0.05em",
                    }}
                  >
                    空の様子を確認しています...
                  </Typography>
                </Box>
              )}

              {error && (
                <Card
                  sx={{
                    backgroundColor: "rgba(239, 68, 68, 0.1)",
                    borderRadius: 3,
                    mb: 4,
                  }}
                >
                  <CardContent>
                    <Typography color="error">{error}</Typography>
                  </CardContent>
                </Card>
              )}

              {!loading && nextMoment && weatherData && (
                <MomentCard nextMoment={nextMoment} weatherData={weatherData} />
              )}
            </>
          )}

          {/* ===== 気持ちの記録ページ ===== */}
          {currentPage === "mood" && <MoodShape />}

          {/* ===== Aboutページ ===== */}
          {currentPage === "about" && <AboutPage />}
        </Box>
      </Container>

      <NavigationMenu
        anchorEl={anchorEl}
        open={open}
        demoMode={demoMode}
        onClose={handleClose}
        onPageChange={handlePageChange}
        onTimePeriodChange={handleTimePeriodChange}
      />
      <InstallPrompt />
    </Box>
  );
};

export default SkyleApp;
