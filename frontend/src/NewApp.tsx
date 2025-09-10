import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Container,
  Stack,
  Paper,
} from "@mui/material";
import { Menu as MenuIcon, Close, Camera, Info } from "@mui/icons-material";

console.log("=== NEW MUI DESIGN LOADED ===");

// 型定義
interface IconProps {
  type: "magic" | "blue";
  visibility: "excellent" | "good" | "fair" | "poor";
  size?: number;
}

interface TimeData {
  time: string;
  visibility: "excellent" | "good" | "fair" | "poor";
  message: string;
}

interface TodayData {
  magicHour: TimeData;
  blueMoment: TimeData;
}

// アイコンコンポーネント（画像版）
const ImageIcon: React.FC<IconProps> = ({ type, visibility, size = 80 }) => {
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

// メインアプリ
const NewSkyleApp = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [currentPage, setCurrentPage] = useState("home");
  const open = Boolean(anchorEl);

  const todayData: TodayData = {
    magicHour: {
      time: "17:15",
      visibility: "excellent",
      message: "美しい夕暮れが期待できそうです",
    },
    blueMoment: {
      time: "18:30",
      visibility: "good",
      message: "静寂な青い時間をお楽しみください",
    },
  };

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
      {/* ヘッダー */}
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
                sx={{
                  color: "#64748b",
                  fontWeight: 300,
                }}
              >
                空に余白と彩りを
              </Typography>
            </Box>

            <IconButton
              onClick={handleClick}
              sx={{
                backgroundColor: "white",
                boxShadow: 2,
                "&:hover": {
                  backgroundColor: "white",
                  boxShadow: 4,
                },
              }}
            >
              {open ? <Close /> : <MenuIcon />}
            </IconButton>
          </Box>
        </Container>
      </Paper>

      {/* メインコンテンツ */}
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
            <Stack spacing={8} sx={{ width: "100%" }}>
              {/* マジックアワー */}
              <Box sx={{ textAlign: "center" }}>
                <ImageIcon
                  type="magic"
                  visibility={todayData.magicHour.visibility}
                  size={120}
                />
                <Card
                  elevation={8}
                  sx={{
                    borderRadius: 4,
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 500,
                        color: "#1e293b",
                        mb: 3,
                      }}
                    >
                      今夕のマジックアワー
                    </Typography>
                    <Typography
                      variant="h2"
                      sx={{
                        fontWeight: 100,
                        color: "#0f172a",
                        mb: 2,
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {todayData.magicHour.time}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: "#475569",
                        lineHeight: 1.6,
                      }}
                    >
                      {todayData.magicHour.message}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>

              {/* ブルーモーメント */}
              <Box sx={{ textAlign: "center" }}>
                <ImageIcon
                  type="blue"
                  visibility={todayData.blueMoment.visibility}
                  size={100}
                />
                <Card
                  elevation={6}
                  sx={{
                    borderRadius: 4,
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 500,
                        color: "#1e293b",
                        mb: 2,
                      }}
                    >
                      ブルーモーメント
                    </Typography>
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 100,
                        color: "#0f172a",
                        mb: 2,
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {todayData.blueMoment.time}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#475569",
                        lineHeight: 1.6,
                      }}
                    >
                      {todayData.blueMoment.message}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            </Stack>
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
                  sx={{
                    fontWeight: 500,
                    color: "#1e293b",
                    mb: 3,
                  }}
                >
                  Skyleについて
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "#475569",
                    lineHeight: 1.8,
                    mb: 2,
                  }}
                >
                  日常に小さな余白と彩りを添える、空の美しい時間をお知らせするアプリです。
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "#475569",
                    lineHeight: 1.8,
                  }}
                >
                  マジックアワーとブルーモーメントの時刻を確認して、空の特別な瞬間を楽しんでください。
                </Typography>
              </CardContent>
            </Card>
          )}
        </Box>
      </Container>

      {/* メニュー */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 8,
          sx: {
            borderRadius: 3,
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            minWidth: 200,
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

export default NewSkyleApp;
