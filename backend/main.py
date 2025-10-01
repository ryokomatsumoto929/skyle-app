from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import requests
from datetime import datetime

# 環境変数読み込み
load_dotenv()

app = FastAPI(
    title="Skyle API",
    description="太陽時刻と天気予報による可視性予測API",
    version="2.0.0"  # バージョンアップ！
)

# CORS設定（開発環境用 - 包括的許可）
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # 通常のViteポート
        "http://localhost:5174",  # 今回のViteポート
        "http://localhost:3000",  # 予備ポート
        "http://127.0.0.1:5173",  # 127.0.0.1版
        "http://127.0.0.1:5174",  # 127.0.0.1版
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "message": "Skyle API v2.0 - Real-time weather integration! 🌅",
        "features": ["実際の天気データ", "可視性判定", "太陽時刻計算"],
        "data_sources": ["OpenWeatherMap", "太陽計算アルゴリズム"]
    }

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

@app.get("/api/today-forecast")
def get_today_forecast(lat: float = 35.6762, lng: float = 139.6503):
    """ハンバーガーメニュー用の統合エンドポイント"""
    try:
        # APIキー取得
        api_key = os.getenv("OPENWEATHER_API_KEY")
        
        if not api_key:
            # APIキーがない場合はテストデータ
            return get_test_forecast_for_menu(lat, lng)
        
        # OpenWeatherMap API呼び出し
        weather_url = "https://api.openweathermap.org/data/2.5/weather"
        params = {
            "lat": lat,
            "lon": lng,
            "appid": api_key,
            "units": "metric",
            "lang": "ja"
        }
        
        response = requests.get(weather_url, params=params)
        
        if response.status_code != 200:
            print(f"❌ Weather API Error: {response.status_code}")
            return get_test_forecast_for_menu(lat, lng)
        
        weather_data = response.json()
        
        # 実際の天気データを抽出（ハンバーガーメニュー形式）
        weather = {
            "description": weather_data["weather"][0]["description"],
            "clouds": weather_data["clouds"]["all"],
            "humidity": weather_data["main"]["humidity"],
            "temperature": weather_data["main"]["temp"],
            "visibility": get_visibility_message(weather_data)
        }
        
        # 太陽時刻（ハンバーガーメニュー形式）
        solar_times = {
            "sunrise": "2025-09-09T06:00:00+09:00",
            "sunset": "2025-09-09T18:00:00+09:00",
            "goldenHour": "2025-09-09T05:30:00+09:00",
            "blueHour": "2025-09-09T18:30:00+09:00"
        }
        
        return {
            "weather": weather,
            "solarTimes": solar_times,
            "location": {"lat": lat, "lng": lng},
            "timestamp": datetime.now().isoformat()
        }
        
    except requests.RequestException as e:
        print(f"🌐 ネットワークエラー: {str(e)}")
        return get_test_forecast_for_menu(lat, lng)
    except Exception as e:
        print(f"💥 エラー: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

def get_test_forecast_for_menu(lat: float = 35.6762, lng: float = 139.6503):
    """ハンバーガーメニュー用テストデータ"""
    weather = {
        "description": "薄い雲",
        "clouds": 45,
        "humidity": 65,
        "temperature": 23.5,
        "visibility": "👌 美しい夕焼けが期待できそうです（テストデータ）"
    }
    
    solar_times = {
        "sunrise": "2025-09-09T06:00:00+09:00",
        "sunset": "2025-09-09T18:00:00+09:00",
        "goldenHour": "2025-09-09T05:30:00+09:00",
        "blueHour": "2025-09-09T18:30:00+09:00"
    }
    
    return {
        "weather": weather,
        "solarTimes": solar_times,
        "location": {"lat": lat, "lng": lng},
        "timestamp": datetime.now().isoformat()
    }

def get_visibility_message(weather_data):
    """天気データから可視性メッセージを生成"""
    cloud_cover = weather_data["clouds"]["all"]
    humidity = weather_data["main"]["humidity"]
    
    score = 0
    
    # 雲量スコア
    if 30 <= cloud_cover <= 70:
        score += 40
    elif 20 <= cloud_cover <= 80:
        score += 25
    else:
        score += 10
    
    # 湿度スコア
    if 40 <= humidity <= 70:
        score += 25
    else:
        score += 10
    
    # メッセージ生成
    if score >= 50:
        return "✨ 絶好の撮影日和です！"
    elif score >= 30:
        return "👌 期待できそうです"
    else:
        return "🤔 微妙かも..."

# 既存のエンドポイントも保持
@app.get("/api/test-forecast")
def get_test_forecast(lat: float = 35.6762, lng: float = 139.6503):
    """詳細テストデータ版（既存機能との互換性用）"""
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
        "message": "👌 美しい夕焼けが期待できそうです（テストデータ）",
        "emoji": "👌"
    }
    
    return {
        "solar_times": solar_times,
        "weather": weather,
        "visibility": visibility,
        "location": {"lat": lat, "lng": lng},
        "timestamp": datetime.now().isoformat(),
        "data_source": "Test Data"
    }

def calculate_visibility_score(weather):
    """実際の天気データから可視性を判定（既存機能）"""
    score = 0
    factors = {}
    
    # 雲量スコア (0-40点)
    cloud_cover = weather["cloud_cover"]
    if 30 <= cloud_cover <= 70:
        cloud_score = 40
    elif 20 <= cloud_cover <= 80:
        cloud_score = 25
    elif 10 <= cloud_cover <= 90:
        cloud_score = 15
    else:
        cloud_score = 5
    score += cloud_score
    factors["雲量"] = {"value": f"{cloud_cover}%", "score": cloud_score, "max": 40}
    
    # 湿度スコア (0-25点)
    humidity = weather["humidity"]
    if 40 <= humidity <= 70:
        humidity_score = 25
    elif 30 <= humidity <= 80:
        humidity_score = 15
    else:
        humidity_score = 8
    score += humidity_score
    factors["湿度"] = {"value": f"{humidity}%", "score": humidity_score, "max": 25}
    
    # 風速スコア (0-15点)
    wind_speed = weather["wind_speed"]
    if wind_speed <= 3:
        wind_score = 15
    elif wind_speed <= 5:
        wind_score = 10
    elif wind_speed <= 8:
        wind_score = 5
    else:
        wind_score = 0
    score += wind_score
    factors["風速"] = {"value": f"{wind_speed}m/s", "score": wind_score, "max": 15}
    
    # 視程スコア (0-20点)
    visibility = weather["visibility"]
    if visibility >= 10000:
        visibility_score = 20
    elif visibility >= 5000:
        visibility_score = 15
    elif visibility >= 2000:
        visibility_score = 8
    else:
        visibility_score = 0
    score += visibility_score
    factors["視程"] = {"value": f"{visibility/1000:.1f}km", "score": visibility_score, "max": 20}
    
    # レベル判定
    if score >= 75:
        level, message, emoji = "excellent", "✨ 絶好の夕焼け日和です！", "✨"
    elif score >= 55:
        level, message, emoji = "good", "👌 美しい夕焼けが期待できそうです", "👌" 
    elif score >= 35:
        level, message, emoji = "fair", "🤔 条件はまずまずです", "🤔"
    else:
        level, message, emoji = "poor", "😔 夕焼けを見るのは難しそうです", "😔"
    
    return {
        "level": level,
        "score": score,
        "message": message,
        "emoji": emoji,
        "factors": factors
    }

# ハンバーガーメニュー用の新機能エンドポイント
@app.get("/api/halo-forecast")
async def get_halo_forecast(lat: float, lng: float):
    """ハロ予報（機械学習実装予定）"""
    return {
        "probability": 0.3,
        "conditions": "氷晶の形成条件を確認中...",
        "message": "機械学習モデル開発中"
    }

@app.get("/api/rainbow-forecast") 
async def get_rainbow_forecast(lat: float, lng: float):
    """虹予報（機械学習実装予定）"""
    return {
        "probability": 0.5,
        "conditions": "雨と太陽の位置関係を分析中...",
        "message": "機械学習モデル開発中"
    }

@app.get("/api/health")
async def health_check():
    """ハンバーガーメニューの接続ステータス確認用"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "message": "Skyle API is running"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)  # ポートを8000に変更