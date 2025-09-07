import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Button, Chip, CircularProgress } from '@mui/material';

interface WeatherData {
  solar_times: {
    sunrise: string;
    sunset: string;
    solar_noon: string;
    golden_hour_evening_start: string;
    golden_hour_evening_end: string;
  };
  weather: {
    temperature: number;
    humidity: number;
    cloud_cover: number;
    wind_speed: number;
    visibility: number;
    weather_main: string;
    weather_description: string;
    pressure: number;
  };
  visibility: {
    level: string;
    score: number;
    message: string;
    emoji: string;
    factors: {
      [key: string]: {
        value: string;
        score: number;
        max: number;
      };
    };
  };
  location: {
    lat: number;
    lng: number;
  };
  city: string;
  data_source: string;
  timestamp: string;
}

const WeatherIntegrationTest: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeatherData = async (lat?: number, lng?: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const url = lat && lng 
        ? `http://localhost:3001/api/today-forecast?lat=${lat}&lng=${lng}`
        : 'http://localhost:3001/api/today-forecast';
      
      console.log('🌤️ API呼び出し:', url);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ 取得データ:', data);
      setWeatherData(data);
    } catch (err) {
      console.error('❌ API エラー:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData(); // 初回は東京
  }, []);

  const getScoreGradient = (score: number) => {
    if (score >= 75) return 'linear-gradient(135deg, #4caf50, #8bc34a)';
    if (score >= 55) return 'linear-gradient(135deg, #ff9800, #ffc107)';
    if (score >= 35) return 'linear-gradient(135deg, #ff5722, #ff9800)';
    return 'linear-gradient(135deg, #9e9e9e, #bdbdbd)';
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1000, mx: 'auto', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <Typography variant="h3" gutterBottom sx={{ textAlign: 'center', color: '#1976d2', mb: 4 }}>
        🌅 Skyle - リアルタイム夕焼け予報
      </Typography>

      {/* 操作ボタン */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Button 
          variant={!loading ? "contained" : "outlined"}
          onClick={() => fetchWeatherData()}
          disabled={loading}
          sx={{ mr: 2, mb: 1 }}
          size="large"
        >
          🗼 東京
        </Button>
        <Button 
          variant={!loading ? "contained" : "outlined"}
          onClick={() => fetchWeatherData(34.6937, 135.5023)}
          disabled={loading}
          sx={{ mr: 2, mb: 1 }}
          size="large"
        >
          🏯 大阪
        </Button>
        <Button 
          variant={!loading ? "contained" : "outlined"}
          onClick={() => fetchWeatherData(43.0642, 141.3469)}
          disabled={loading}
          sx={{ mb: 1 }}
          size="large"
        >
          ❄️ 札幌
        </Button>
      </Box>

      {/* ローディング状態 */}
      {loading && (
        <Box sx={{ textAlign: 'center', my: 4 }}>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            🔄 天気データを取得中...
          </Typography>
        </Box>
      )}

      {/* エラー状態 */}
      {error && (
        <Card sx={{ mb: 3, bgcolor: '#ffebee' }}>
          <CardContent>
            <Typography color="error" variant="h6">
              ❌ エラーが発生しました
            </Typography>
            <Typography variant="body1">
              {error}
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* メインデータ表示 */}
      {weatherData && (
        <Box>
          {/* ヘッダー情報 */}
          <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #1976d2, #42a5f5)' }}>
            <CardContent>
              <Typography variant="h4" sx={{ color: 'white', textAlign: 'center' }}>
                📍 {weatherData.city}
              </Typography>
              <Typography variant="body1" sx={{ color: 'white', textAlign: 'center', mt: 1 }}>
                📡 {weatherData.data_source} | 🕐 {new Date(weatherData.timestamp).toLocaleString()}
              </Typography>
            </CardContent>
          </Card>

          {/* 可視性判定（メイン） */}
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 3 }}>
            <Card sx={{ 
              background: getScoreGradient(weatherData.visibility.score),
              color: 'white',
              minHeight: 300,
              flex: 2
            }}>
              <CardContent>
                <Typography variant="h5" gutterBottom sx={{ color: 'white', textAlign: 'center' }}>
                  ✨ 今日の夕焼け予報
                </Typography>
                
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <Typography variant="h1" sx={{ fontSize: '4rem', fontWeight: 'bold' }}>
                    {weatherData.visibility.emoji}
                  </Typography>
                  <Typography variant="h2" sx={{ fontWeight: 'bold', mt: 1 }}>
                    {weatherData.visibility.score}点
                  </Typography>
                  <Chip 
                    label={weatherData.visibility.level.toUpperCase()} 
                    sx={{ 
                      mt: 2, 
                      bgcolor: 'rgba(255,255,255,0.2)', 
                      color: 'white',
                      fontSize: '1.1rem',
                      py: 2
                    }}
                    size="medium"
                  />
                </Box>
                
                <Typography variant="h6" sx={{ textAlign: 'center', mb: 3 }}>
                  {weatherData.visibility.message}
                </Typography>

                {/* 詳細スコア */}
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  {Object.entries(weatherData.visibility.factors).map(([key, factor]) => (
                    <Box key={key} sx={{ 
                      bgcolor: 'rgba(255,255,255,0.1)', 
                      p: 2, 
                      borderRadius: 2,
                      textAlign: 'center'
                    }}>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        {key}
                      </Typography>
                      <Typography variant="h6">
                        {factor.value}
                      </Typography>
                      <Typography variant="body2">
                        {factor.score}/{factor.max}点
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>

            {/* 天気情報 */}
            <Card sx={{ flex: 1 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  🌤️ 現在の天気
                </Typography>
                
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                  <Typography variant="h2" color="primary" sx={{ fontWeight: 'bold' }}>
                    {Math.round(weatherData.weather.temperature)}°C
                  </Typography>
                  <Typography variant="h6" color="textSecondary">
                    {weatherData.weather.weather_description}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                    <Typography>💧 湿度</Typography>
                    <Typography>{weatherData.weather.humidity}%</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                    <Typography>☁️ 雲量</Typography>
                    <Typography>{weatherData.weather.cloud_cover}%</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                    <Typography>💨 風速</Typography>
                    <Typography>{weatherData.weather.wind_speed}m/s</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                    <Typography>👁️ 視程</Typography>
                    <Typography>{weatherData.weather.visibility/1000}km</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>

          {/* 太陽時刻 */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🌅 今日の太陽時刻
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' }, 
                gap: 2, 
                mt: 2,
                flexWrap: 'wrap'
              }}>
                <Chip 
                  label={`🌄 日の出 ${weatherData.solar_times.sunrise}`} 
                  variant="outlined" 
                  sx={{ flex: 1, py: 2 }}
                />
                <Chip 
                  label={`🌇 日の入り ${weatherData.solar_times.sunset}`} 
                  variant="outlined" 
                  sx={{ flex: 1, py: 2 }}
                />
                <Chip 
                  label={`✨ マジックアワー ${weatherData.solar_times.golden_hour_evening_start} - ${weatherData.solar_times.golden_hour_evening_end}`} 
                  color="primary" 
                  sx={{ flex: { xs: '100%', md: 2 }, py: 2 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Box>
      )}
    </Box>
  );
};

export default WeatherIntegrationTest;