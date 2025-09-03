import { useState } from "react";
import {
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  Alert,
  Chip,
} from "@mui/material";

import "./App.css";

interface ApiResponse {
  message: string;
  timestamp: string;
}

interface SolarTimes {
  location: string;
  date: string;
  times: {
    sunrise: string;
    sunset: string;
    goldenHourStart: string;
    goldenHourEnd: string;
    blueHourStart: string;
    blueHourEnd: string;
  };
}

function App() {
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
  const [solarTimes, setSolarTimes] = useState<SolarTimes | null>(null);
  const [loading, setLoading] = useState(false);
  const [solarLoading, setSolarLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

              <Button
                variant="contained"
                color="secondary"
                onClick={getSolarTimes}
                disabled={solarLoading}
                sx={{ marginBottom: 2 }}
              >
                {solarLoading ? "取得中..." : "太陽時刻を取得"}
              </Button>

              {solarTimes && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    📍 {solarTimes.location} ({solarTimes.date})
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
                      label={`✨ マジックアワー: ${solarTimes.times.goldenHourStart}`}
                      color="warning"
                      sx={{ width: "100%" }}
                    />
                    <Chip
                      label={`🔵 ブルーモーメント: ${solarTimes.times.blueHourStart} - ${solarTimes.times.blueHourEnd}`}
                      color="primary"
                      sx={{ width: "100%" }}
                    />
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
