from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
from datetime import datetime

# 環境変数読み込み
load_dotenv()

app = FastAPI(
    title="Skyle API",
    description="太陽時刻と天気予報による可視性予測API",
    version="1.0.0"
)

# CORS設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Skyle API - Ready to predict your golden moments! 🌅"}

@app.get("/api/solar/times")
def get_solar_times(lat: float = 35.6762, lng: float = 139.6503):
    """太陽時刻取得 (簡易版)"""
    try:
        return {
            "sunrise": "06:00",
            "sunset": "18:00",
            "solar_noon": "12:00",
            "golden_hour_morning_start": "05:30",
            "golden_hour_morning_end": "06:00",
            "golden_hour_evening_start": "18:00",
            "golden_hour_evening_end": "18:30",
            "blue_hour_morning_start": "05:00",
            "blue_hour_morning_end": "06:00",
            "blue_hour_evening_start": "18:00",
            "blue_hour_evening_end": "19:00"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/golden-hour-forecast")
def get_golden_hour_forecast(lat: float = 35.6762, lng: float = 139.6503):
    """天気予報のみ (テスト版)"""
    try:
        return {
            "weather": {
                "temperature": 23.5,
                "humidity": 65,
                "cloud_cover": 45,
                "wind_speed": 3.2,
                "visibility": 10000,
                "weather_main": "Clouds",
                "weather_description": "薄い雲",
                "pressure": 1013
            },
            "visibility": {
                "level": "good",
                "score": 75,
                "message": "�� 美しい夕焼けが期待できそうです",
                "emoji": "👌",
                "factors": {
                    "雲量": {"value": "45%", "score": 40, "max": 40},
                    "湿度": {"value": "65%", "score": 25, "max": 25}
                }
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/today-forecast")
def get_today_forecast(lat: float = 35.6762, lng: float = 139.6503):
    """太陽時刻 + 天気予報統合 (テスト版)"""
    try:
        solar_times = {
            "sunrise": "06:00",
            "sunset": "18:00",
            "solar_noon": "12:00",
            "golden_hour_evening_start": "18:00",
            "golden_hour_evening_end": "18:30"
        }
        
        weather = {
            "temperature": 23.5,
            "humidity": 65,
            "cloud_cover": 45,
            "wind_speed": 3.2,
            "visibility": 10000,
            "weather_main": "Clouds",
            "weather_description": "薄い雲"
        }
        
        visibility = {
            "level": "good",
            "score": 75,
            "message": "�� 美しい夕焼けが期待できそうです",
            "emoji": "👌"
        }
        
        return {
            "solar_times": solar_times,
            "weather": weather,
            "visibility": visibility,
            "location": {"lat": lat, "lng": lng},
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3001)
