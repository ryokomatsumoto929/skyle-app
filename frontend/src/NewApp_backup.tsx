import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Container,
  Button,
  Paper,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Close,
  Camera,
  Info,
  LocationOn,
  Cloud,
} from "@mui/icons-material";

type TimePeriod = "earlyMorning" | "morning" | "daytime" | "evening" | "night";

interface NextMoment {
  type: "magic" | "blue" | "halo";
  time: string;
  timeRange: string;
  period: "morning" | "evening";
  message: string;
  isHappening: boolean;
  visibility: "excellent" | "good" | "fair" | "poor";
}

interface SolarData {
  sunrise: string;
  sunset: string;
  golden_hour_morning_start: string;
  golden_hour_morning_end: string;
  golden_hour_evening_start: string;
  golden_hour_evening_end: string;
  blue_hour_morning_start: string;
  blue_hour_morning_end: string;
  blue_hour_evening_start: string;
  blue_hour_evening_end: string;
}

interface WeatherData {
  description: string;
  clouds: number;
  humidity: number;
  temperature: number;
  visibility: string;
  haloVisibility?: {
    score: number;
    level: string;
    message: string;
    factors: Record<string, string>;
  };
}

interface ForecastResponse {
  weather: WeatherData;
  solarTimes: {
    sunrise: string;
    sunset: string;
    goldenHour: string;
    blueHour: string;
  };
  visibility: {
    score: number;
    level: string;
    message: string;
    factors: Record<string, string>;
  };
  haloVisibility: {
    score: number;
    level: string;
    message: string;
    factors: Record<string, string>;
  };
  location: { lat: number; lng: number };
  timestamp: string;
}

// 時間帯別グラデーション定義（全て淡く控えめなトーン）
const TIME_GRADIENTS: Record<TimePeriod, string> = {
  earlyMorning: "linear-gradient(to bottom, #dbeafe 0%, #bfdbfe 30%, #a5b4fc 60%, #c4b5fd 100%)",
  morning: "linear-gradient(to bottom, #fed7aa 0%, #fdba74 30%, #fb923c 60%, #fbbf24 100%)",
  daytime: "linear-gradient(to bottom, #eff6ff 0%, #dbeafe 30%, #bfdbfe 60%, #93c5fd 100%)",
  evening: "linear-gradient(to bottom, #fecaca 0%, #fca5a5 30%, #fb923c 60%, #fde047 100%)",
  night: "linear-gradient(to bottom, #cbd5e1 0%, #94a3b8 30%, #64748b 60%, #475569 100%)"
};

// 現在の時間帯を判定する関数
const getCurrentTimePeriod = (): TimePeriod => {
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

const MomentIcon: React.FC<{
  type: "magic" | "blue" | "halo";
  visibility: "excellent" | "good" | "fair" | "poor";
  size?: number;
}> = ({ type, visibility, size = 140 }) => {
  const [imageLoaded, setImageLoaded] = React.useState(false);

  const getImageSrc = () => {
    const imageVisibility = visibility === "fair" ? "poor" : visibility;

    if (type === "magic") {
      return `/images/magic-hour-${imageVisibility}.jpg`;
    } else if (type === "blue") {
      return `/images/blue-moment-${imageVisibility}.jpg`;
    } else if (type === "halo") {
      return `/images/halo-${imageVisibility}.jpg`;
    }
  };

  const getAltText = () => {
    if (type === "magic") return "マジックアワー";
    if (type === "blue") return "ブルーモーメント";
    return "ハロ";
  };

  return (
    <Box
      sx={{ display: "flex", justifyContent: "center", mb: { xs: 2, sm: 4 } }}
    >
      <Box
        component="img"
        src={getImageSrc()}
        alt={getAltText()}
        onLoad={() => setImageLoaded(true)}
        sx={{
          width: size,
          height: size,
          borderRadius: 3,
          boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
          objectFit: "cover",
          opacity: imageLoaded ? 1 : 0,
          transition: "opacity 0.3s ease-in",
        }}
        onError={(e) => {
          if (type === "halo") {
            e.currentTarget.src = `/images/halo-good.jpg`;
          } else {
            e.currentTarget.src = `/images/${
              type === "magic" ? "magic-hour" : "blue-moment"
            }-good.jpg`;
          }
        }}
      />
    </Box>
  );
};

const SkyleApp = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [currentPage, setCurrentPage] = useState("home");
  const [nextMoment, setNextMoment] = useState<NextMoment | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [currentGradient, setCurrentGradient] = useState<string>(
    TIME_GRADIENTS[getCurrentTimePeriod()]
  );
  const [demoMode, setDemoMode] = useState<TimePeriod | null>(null);

  const open = Boolean(anchorEl);

  // 画像のプリロード
  useEffect(() => {
    const imagesToPreload = [
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

    imagesToPreload.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // 時間帯に応じて背景グラデーションを更新
  useEffect(() => {
    const updateGradient = () => {
      const period = demoMode || getCurrentTimePeriod();
      setCurrentGradient(TIME_GRADIENTS[period]);
    };

    updateGradient();
    
    if (!demoMode) {
      const interval = setInterval(updateGradient, 60000); // 1分ごとに更新
      return () => clearInterval(interval);
    }
  }, [demoMode]);

  const parseISOTime = (isoStr: string): Date => {
    return new Date(isoStr);
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString("ja-JP", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getVisibilityLevel = (
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

  const findNextMoment = (
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
      }
    );
  };

  const fetchForecastData = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/today-forecast?lat=${lat}&lng=${lng}`
      );

      if (!response.ok) {
        throw new Error("データの取得に失敗しました");
      }

      const data: ForecastResponse = await response.json();
      console.log("取得したデータ:", data);

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
      console.log("次の美しい時間:", next);

      setNextMoment(next);
      setError(null);
      setLoading(false);
    } catch (err) {
      console.error("API呼び出しエラー:", err);
      setError(
        "バックエンドに接続できません。サーバーが起動しているか確認してください。"
      );
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForecastData(34.6937, 135.5023);
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (page: string) => {
    setCurrentPage(page);
    handleClose();
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: currentGradient,
        py: 3,
        transition: "background 2s ease-in-out",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          backgroundColor: "rgba(255, 255, 255, 0.7)",
          backdropFilter: "blur(10px)",
          borderRadius: 0,
          mb: 4,
        }}
      >
        <Container maxWidth="sm">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              py: 3,
            }}
          >
            <Box sx={{ textAlign: "center", flex: 1 }}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 200,
                  color: "#1e293b",
                  letterSpacing: "0.1em",
                  mb: 0.5,
                }}
              >
                Skyle
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "#64748b", fontWeight: 300 }}
              >
                空に余白と彩りを
              </Typography>
              {demoMode && (
                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    mt: 1,
                    color: "#3b82f6",
                    fontWeight: 500,
                    fontSize: "0.7rem",
                  }}
                >
                  プレビューモード
                </Typography>
              )}
            </Box>
            <IconButton
              onClick={handleClick}
              sx={{
                backgroundColor: "white",
                boxShadow: 2,
                "&:hover": { backgroundColor: "white", boxShadow: 4 },
              }}
            >
              {open ? <Close /> : <MenuIcon />}
            </IconButton>
          </Box>
        </Container>
      </Paper>

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
          {currentPage === "home" && (
            <>
              <Box sx={{ mb: 4, textAlign: "center" }}>
                <Button
                  variant="contained"
                  startIcon={<LocationOn />}
                  onClick={getLocation}
                  disabled={loading}
                  sx={{
                    backgroundColor: "rgba(59, 130, 246, 0.9)",
                    backdropFilter: "blur(10px)",
                    borderRadius: 3,
                    px: 3,
                    py: 1.5,
                    boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: "rgba(37, 99, 235, 0.9)",
                      transform: "translateY(-2px)",
                      boxShadow: "0 6px 20px rgba(59, 130, 246, 0.4)",
                    },
                    "&:active": {
                      transform: "translateY(0)",
                      boxShadow: "0 2px 8px rgba(59, 130, 246, 0.3)",
                    },
                  }}
                >
                  現在地の空を見る
                </Button>
                {location && (
                  <Typography
                    variant="caption"
                    sx={{ display: "block", mt: 1, color: "#64748b" }}
                  >
                    緯度: {location.lat.toFixed(4)}, 経度:{" "}
                    {location.lng.toFixed(4)}
                  </Typography>
                )}
              </Box>

              {loading && (
                <Box
                  sx={{
                    textAlign: "center",
                    py: 8,
                    animation: "pulse 2s ease-in-out infinite",
                    "@keyframes pulse": {
                      "0%, 100%": {
                        opacity: 0.4,
                      },
                      "50%": {
                        opacity: 1,
                      },
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
                <Box
                  sx={{
                    textAlign: "center",
                    width: "100%",
                    animation: "fadeSlideUp 0.7s ease-out",
                    "@keyframes fadeSlideUp": {
                      from: {
                        opacity: 0,
                        transform: "translateY(8px)",
                      },
                      to: {
                        opacity: 1,
                        transform: "translateY(0)",
                      },
                    },
                  }}
                >
                  <MomentIcon
                    type={nextMoment.type}
                    visibility={nextMoment.visibility}
                    size={120}
                  />

                  <Card
                    elevation={0}
                    sx={{
                      borderRadius: 5,
                      backgroundColor: "rgba(255, 255, 255, 0.6)",
                      backdropFilter: "blur(20px)",
                      border: "1px solid rgba(255, 255, 255, 0.8)",
                      width: "calc(100% - 32px)",
                      mx: "auto",
                      overflow: "visible",
                    }}
                  >
                    <CardContent sx={{ p: { xs: 3, sm: 6 } }}>
                      <Typography
                        variant="overline"
                        sx={{
                          fontWeight: 400,
                          color: "#94a3b8",
                          letterSpacing: "0.15em",
                          fontSize: "0.7rem",
                          mb: 0.5,
                        }}
                      >
                        {nextMoment.type === "magic"
                          ? "Magic Hour"
                          : "Blue Moment"}
                      </Typography>

                      <Typography
                        variant="h1"
                        sx={{
                          fontWeight: 200,
                          color: "#0f172a",
                          mb: 1,
                          letterSpacing: "-0.03em",
                          fontSize: { xs: "3.5rem", sm: "5rem" },
                        }}
                      >
                        {nextMoment.time}
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          color: "#cbd5e1",
                          mb: { xs: 2, sm: 4 },
                          fontWeight: 300,
                          letterSpacing: "0.05em",
                        }}
                      >
                        {nextMoment.timeRange}
                      </Typography>

                      <Box
                        sx={{
                          mb: { xs: 2, sm: 4 },
                          py: { xs: 2, sm: 3 },
                          borderTop: "1px solid rgba(203, 213, 225, 0.3)",
                          borderBottom: "1px solid rgba(203, 213, 225, 0.3)",
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#64748b",
                            fontSize: "0.9rem",
                            mb: 2,
                            fontWeight: 400,
                            lineHeight: 1.6,
                          }}
                        >
                          {weatherData.visibility}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            gap: 3,
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            <Cloud sx={{ fontSize: 16, color: "#94a3b8" }} />
                            <Typography
                              variant="caption"
                              sx={{
                                color: "#94a3b8",
                                fontSize: "0.8rem",
                                fontWeight: 300,
                              }}
                            >
                              {weatherData.clouds}%
                            </Typography>
                          </Box>
                          <Typography
                            variant="caption"
                            sx={{
                              color: "#94a3b8",
                              fontSize: "0.8rem",
                              fontWeight: 300,
                            }}
                          >
                            {weatherData.description}
                          </Typography>
                        </Box>
                      </Box>

                      <Typography
                        variant="body1"
                        sx={{
                          color: "#64748b",
                          lineHeight: 1.9,
                          fontWeight: 300,
                          fontSize: "0.95rem",
                        }}
                      >
                        {nextMoment.message}
                      </Typography>

                      {weatherData?.haloVisibility && (
                        <Box
                          sx={{
                            mt: 3,
                            pt: 3,
                            borderTop: "1px solid rgba(203, 213, 225, 0.2)",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 1.5,
                          }}
                        >
                          <Box
                            component="img"
                            src={`/images/halo-${
                              weatherData.haloVisibility.level === "fair"
                                ? "poor"
                                : weatherData.haloVisibility.level
                            }.jpg`}
                            alt="ハロ"
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: 1.5,
                              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                              objectFit: "cover",
                            }}
                            onError={(e: any) => {
                              e.currentTarget.src = `/images/halo-good.jpg`;
                            }}
                          />
                          <Box sx={{ textAlign: "center" }}>
                            <Typography
                              variant="overline"
                              sx={{
                                fontWeight: 400,
                                color: "#94a3b8",
                                letterSpacing: "0.15em",
                                fontSize: "0.65rem",
                                display: "block",
                                mb: 0.5,
                              }}
                            >
                              Halo Forecast
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                color: "#64748b",
                                fontSize: "0.85rem",
                                fontWeight: 300,
                              }}
                            >
                              {weatherData.haloVisibility.message}
                            </Typography>
                          </Box>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Box>
              )}
            </>
          )}

          {currentPage === "about" && (
            <Card
              elevation={8}
              sx={{
                borderRadius: 4,
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                backdropFilter: "blur(10px)",
                width: "100%",
              }}
            >
              <CardContent sx={{ p: 4, textAlign: "center" }}>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 500, color: "#1e293b", mb: 3 }}
                >
                  Skyleについて
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ color: "#475569", lineHeight: 1.8, mb: 2 }}
                >
                  日常に小さな余白と彩りを添える、空の美しい時間をお知らせするアプリです。
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ color: "#475569", lineHeight: 1.8 }}
                >
                  マジックアワーとブルーモーメントの時刻を確認して、空の特別な瞬間を楽しんでください。
                </Typography>
              </CardContent>
            </Card>
          )}
        </Box>
      </Container>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            elevation: 8,
            sx: {
              borderRadius: 3,
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(10px)",
              minWidth: 200,
            },
          },
        }}
      >
        <MenuItem
          onClick={() => handleMenuItemClick("home")}
          sx={{ py: 1.5, px: 2 }}
        >
          <Camera sx={{ mr: 2, color: "#64748b" }} />
          <Typography sx={{ color: "#374151", fontWeight: 500 }}>
            今日の空
          </Typography>
        </MenuItem>
        <MenuItem
          onClick={() => handleMenuItemClick("about")}
          sx={{ py: 1.5, px: 2 }}
        >
          <Info sx={{ mr: 2, color: "#64748b" }} />
          <Typography sx={{ color: "#374151", fontWeight: 500 }}>
            このアプリについて
          </Typography>
        </MenuItem>
        <Box sx={{ borderTop: "1px solid rgba(203, 213, 225, 0.3)", my: 1 }} />
        <Box sx={{ px: 2, py: 1 }}>
          <Typography
            variant="caption"
            sx={{ color: "#94a3b8", fontWeight: 600, fontSize: "0.7rem" }}
          >
            時間帯プレビュー
          </Typography>
        </Box>
        <MenuItem
          onClick={() => {
            setDemoMode("earlyMorning");
            handleClose();
          }}
          sx={{ py: 1, px: 2, fontSize: "0.9rem" }}
        >
          🌌 早朝 (4-6時)
        </MenuItem>
        <MenuItem
          onClick={() => {
            setDemoMode("morning");
            handleClose();
          }}
          sx={{ py: 1, px: 2, fontSize: "0.9rem" }}
        >
          🌅 朝 (6-9時)
        </MenuItem>
        <MenuItem
          onClick={() => {
            setDemoMode("daytime");
            handleClose();
          }}
          sx={{ py: 1, px: 2, fontSize: "0.9rem" }}
        >
          ☀️ 昼 (9-16時)
        </MenuItem>
        <MenuItem
          onClick={() => {
            setDemoMode("evening");
            handleClose();
          }}
          sx={{ py: 1, px: 2, fontSize: "0.9rem" }}
        >
          🌆 夕方 (16-18時)
        </MenuItem>
        <MenuItem
          onClick={() => {
            setDemoMode("night");
            handleClose();
          }}
          sx={{ py: 1, px: 2, fontSize: "0.9rem" }}
        >
          🌙 夜 (18-4時)
        </MenuItem>
        {demoMode && (
          <MenuItem
            onClick={() => {
              setDemoMode(null);
              handleClose();
            }}
            sx={{
              py: 1,
              px: 2,
              fontSize: "0.9rem",
              backgroundColor: "rgba(59, 130, 246, 0.1)",
            }}
          >
            ↻ 現在時刻に戻る
          </MenuItem>
        )}
      </Menu>
    </Box>
  );
};

export default SkyleApp;