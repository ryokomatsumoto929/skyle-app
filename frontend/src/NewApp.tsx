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
  CircularProgress,
  Button,
  Paper,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Close,
  Camera,
  Info,
  LocationOn,
} from "@mui/icons-material";

interface NextMoment {
  type: "magic" | "blue";
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

const MomentIcon: React.FC<{
  type: "magic" | "blue";
  visibility: "excellent" | "good" | "fair" | "poor";
  size?: number;
}> = ({ type, visibility, size = 140 }) => {
  const getImageSrc = () => {
    if (type === "magic") {
      return `/images/magic-hour-${visibility}.jpg`;
    } else {
      return `/images/blue-moment-${visibility}.jpg`;
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
      <Box
        component="img"
        src={getImageSrc()}
        alt={type === "magic" ? "マジックアワー" : "ブルーモーメント"}
        sx={{
          width: size,
          height: size,
          borderRadius: 3,
          boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
          objectFit: "cover",
        }}
        onError={(e) => {
          e.currentTarget.src = `/images/${
            type === "magic" ? "magic-hour" : "blue-moment"
          }-good.jpg`;
        }}
      />
    </Box>
  );
};

const SkyleApp = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [currentPage, setCurrentPage] = useState("home");
  const [nextMoment, setNextMoment] = useState<NextMoment | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );

  const open = Boolean(anchorEl);

  const parseISOTime = (isoStr: string): Date => {
    return new Date(isoStr);
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString("ja-JP", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const findNextMoment = (data: SolarData): NextMoment => {
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
          visibility: "excellent",
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
          visibility: "excellent",
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
      visibility: "excellent",
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
        fetchSolarData(latitude, longitude);
      },
      (error) => {
        console.error("位置情報取得エラー:", error);
        setError("位置情報の取得に失敗しました。大阪のデータを表示します。");
        fetchSolarData(34.6937, 135.5023);
      }
    );
  };

  const fetchSolarData = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/solar/times?lat=${lat}&lng=${lng}`
      );

      if (!response.ok) {
        throw new Error("データの取得に失敗しました");
      }

      const data: SolarData = await response.json();
      console.log("取得したデータ:", data);

      const next = findNextMoment(data);
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
    fetchSolarData(34.6937, 135.5023);
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
        background: "linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%)",
        py: 3,
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
                    "&:hover": { backgroundColor: "rgba(37, 99, 235, 0.9)" },
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
                <Box sx={{ textAlign: "center", py: 8 }}>
                  <CircularProgress />
                  <Typography sx={{ mt: 2, color: "#64748b" }}>
                    データを取得中...
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

              {!loading && nextMoment && (
                <Box sx={{ textAlign: "center", width: "100%" }}>
                  <MomentIcon
                    type={nextMoment.type}
                    visibility={nextMoment.visibility}
                    size={140}
                  />
                  <Card
                    elevation={8}
                    sx={{
                      borderRadius: 4,
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      backdropFilter: "blur(10px)",
                      maxWidth: 400,
                      mx: "auto",
                    }}
                  >
                    <CardContent sx={{ p: 5 }}>
                      <Typography
                        variant="h5"
                        sx={{ fontWeight: 500, color: "#1e293b", mb: 1 }}
                      >
                        {nextMoment.isHappening ? "今です！" : "次の美しい時間"}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "#64748b", mb: 3 }}
                      >
                        {nextMoment.type === "magic"
                          ? "マジックアワー"
                          : "ブルーモーメント"}
                      </Typography>
                      <Typography
                        variant="h1"
                        sx={{
                          fontWeight: 100,
                          color: "#0f172a",
                          mb: 2,
                          letterSpacing: "-0.02em",
                        }}
                      >
                        {nextMoment.time}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "#94a3b8", mb: 3 }}
                      >
                        {nextMoment.timeRange}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ color: "#475569", lineHeight: 1.8 }}
                      >
                        {nextMoment.message}
                      </Typography>
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
      </Menu>
    </Box>
  );
};

export default SkyleApp;
