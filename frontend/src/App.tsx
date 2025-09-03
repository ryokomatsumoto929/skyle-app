import { useState } from "react";
import {
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  Alert,
} from "@mui/material";
import "./App.css";

interface ApiResponse {
  message: string;
  timestamp: string;
}

function App() {
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
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

  return (
    <Box sx={{ padding: 4, maxWidth: 600, margin: "0 auto" }}>
      <Typography variant="h3" component="h1" gutterBottom>
        🌅 Skyle App
      </Typography>

      <Typography variant="h6" color="text.secondary" gutterBottom>
        ブルーモーメントとマジックアワーをお知らせするアプリ
      </Typography>

      <Card sx={{ marginTop: 3 }}>
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
  );
}

export default App;
