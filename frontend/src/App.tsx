import { useState } from "react";
import {
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  Alert,
  Chip,
  CircularProgress,
} from "@mui/material";

import "./App.css";

interface ApiResponse {
  message: string;
  timestamp: string;
}

interface Location {
  latitude: number;
  longitude: number;
}

interface SolarTimes {
  location: Location | string; // 新APIは Location型、旧APIは string型
  date: string;
  times: {
    sunrise: string;
    sunset: string;
    goldenHour: string;
    blueHour: string;
    dawn: string;
    dusk: string;
    nauticalDawn: string;
    nauticalDusk: string;
  };
}

interface LocationState {
  coordinates: Location | null;
  error: string | null;
  loading: boolean;
  permission: "granted" | "denied" | "prompt" | null;
}

function App() {
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
  const [solarTimes, setSolarTimes] = useState<SolarTimes | null>(null);
  const [loading, setLoading] = useState(false);
  const [solarLoading, setSolarLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 位置情報の状態管理
  const [locationState, setLocationState] = useState<LocationState>({
    coordinates: null,
    error: null,
    loading: false,
    permission: null,
  });

  const testApi = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:3001/api/test");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: ApiResponse = await response.json();
      setApiResponse(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
      setApiResponse(null);
    } finally {
      setLoading(false);
    }
  };

  // 現在地を取得する関数
  const getCurrentLocation = () => {
    setLocationState((prev) => ({ ...prev, loading: true, error: null }));

    if (!navigator.geolocation) {
      setLocationState((prev) => ({
        ...prev,
        loading: false,
        error: "このブラウザは位置情報に対応していません",
      }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coordinates: Location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        setLocationState({
          coordinates,
          error: null,
          loading: false,
          permission: "granted",
        });

        // 位置情報取得後、自動的に太陽時刻を取得
        getSolarTimesWithLocation(coordinates);
      },
      (error) => {
        let errorMessage = "位置情報の取得に失敗しました";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "位置情報の使用が拒否されました";
            setLocationState((prev) => ({ ...prev, permission: "denied" }));
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "位置情報が利用できません";
            break;
          case error.TIMEOUT:
            errorMessage = "位置情報の取得がタイムアウトしました";
            break;
        }

        setLocationState((prev) => ({
          ...prev,
          loading: false,
          error: errorMessage,
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5分間キャッシュ
      }
    );
  };

  // 指定した位置の太陽時刻を取得
  const getSolarTimesWithLocation = async (location?: Location) => {
    setSolarLoading(true);
    setError(null);

    try {
      let url = "http://localhost:3001/api/solar/times";

      if (location) {
        url += `?lat=${location.latitude}&lng=${location.longitude}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: SolarTimes = await response.json();
      setSolarTimes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
      setSolarTimes(null);
    } finally {
      setSolarLoading(false);
    }
  };

  // 大阪（デフォルト）の太陽時刻を取得
  const getSolarTimes = async () => {
    setSolarLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:3001/api/solar/today");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: SolarTimes = await response.json();
      setSolarTimes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
      setSolarTimes(null);
    } finally {
      setSolarLoading(false);
    }
  };

  // 位置情報の表示用フォーマット
  const formatLocation = (location: Location | string) => {
    if (typeof location === "string") {
      return location;
    }
    return `緯度: ${location.latitude.toFixed(
      4
    )}, 経度: ${location.longitude.toFixed(4)}`;
  };

  return (
    <Box sx={{ padding: 4, maxWidth: 800, margin: "0 auto" }}>
      <Typography variant="h3" component="h1" gutterBottom>
        🌅 Skyle App
      </Typography>

      <Typography variant="h6" color="text.secondary" gutterBottom>
        ブルーモーメントとマジックアワーをお知らせするアプリ
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 3,
          marginTop: 2,
        }}
      >
        {/* API連携テスト */}
        <Box sx={{ flex: 1 }}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                API連携テスト
              </Typography>

              <Button
                variant="contained"
                onClick={testApi}
                disabled={loading}
                sx={{ marginBottom: 2 }}
              >
                {loading ? "テスト中..." : "バックエンドAPIテスト"}
              </Button>

              {error && (
                <Alert severity="error" sx={{ marginBottom: 2 }}>
                  エラー: {error}
                </Alert>
              )}

              {apiResponse && (
                <Alert severity="success">
                  <Typography variant="body1">
                    <strong>レスポンス:</strong> {apiResponse.message}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    取得時刻:{" "}
                    {new Date(apiResponse.timestamp).toLocaleString("ja-JP")}
                  </Typography>
                </Alert>
              )}
            </CardContent>
          </Card>
        </Box>

        {/* 太陽時刻表示 */}
        <Box sx={{ flex: 1 }}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                今日の太陽時刻
              </Typography>

              {/* 位置情報取得ボタン */}
              <Box sx={{ display: "flex", gap: 1, marginBottom: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={getCurrentLocation}
                  disabled={locationState.loading}
                  sx={{ flex: 1 }}
                >
                  {locationState.loading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    "📍 現在地で取得"
                  )}
                </Button>

                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={getSolarTimes}
                  disabled={solarLoading}
                  sx={{ flex: 1 }}
                >
                  {solarLoading ? "取得中..." : "🏢 大阪で取得"}
                </Button>
              </Box>

              {/* 位置情報のエラー表示 */}
              {locationState.error && (
                <Alert severity="warning" sx={{ marginBottom: 2 }}>
                  {locationState.error}
                </Alert>
              )}

              {/* 現在の位置情報表示 */}
              {locationState.coordinates && (
                <Alert severity="info" sx={{ marginBottom: 2 }}>
                  📍 現在地: {formatLocation(locationState.coordinates)}
                </Alert>
              )}

              {solarTimes && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    📍 {formatLocation(solarTimes.location)} ({solarTimes.date})
                  </Typography>

                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Chip
                        label={`🌅 日の出: ${solarTimes.times.sunrise}`}
                        variant="outlined"
                        sx={{ flex: 1 }}
                      />
                      <Chip
                        label={`🌇 日の入り: ${solarTimes.times.sunset}`}
                        variant="outlined"
                        sx={{ flex: 1 }}
                      />
                    </Box>
                    <Chip
                      label={`✨ ゴールデンアワー: ${solarTimes.times.goldenHour}`}
                      color="warning"
                      sx={{ width: "100%" }}
                    />
                    <Chip
                      label={`🔵 ブルーアワー: ${solarTimes.times.blueHour}`}
                      color="primary"
                      sx={{ width: "100%" }}
                    />
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Chip
                        label={`🌄 夜明け: ${solarTimes.times.dawn}`}
                        variant="outlined"
                        size="small"
                        sx={{ flex: 1 }}
                      />
                      <Chip
                        label={`🌆 夕暮れ: ${solarTimes.times.dusk}`}
                        variant="outlined"
                        size="small"
                        sx={{ flex: 1 }}
                      />
                    </Box>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}

export default App;
