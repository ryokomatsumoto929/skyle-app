from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import requests
from datetime import datetime, timedelta
import pytz
from astral import LocationInfo
from astral.sun import sun

# 可視性判定モジュールをインポート
from utils.visibility import get_simple_visibility_message, get_detailed_visibility
from utils.visibility import (
    calculate_visibility_score,
    calculate_halo_visibility  # この行を追加
)
# 環境変数読み込み
load_dotenv()

app = FastAPI(
    title="Skyle API",
    description="太陽時刻と天気予報による可視性予測API",
    version="2.0.0"
)

# CORS設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
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
    """実際の太陽時刻を計算"""
    try:
        # 日本時間のタイムゾーン
        jst = pytz.timezone('Asia/Tokyo')
        
        # 位置情報を作成
        location = LocationInfo(latitude=lat, longitude=lng, timezone="Asia/Tokyo")
        
        # 今日の日付（JST）
        today = datetime.now(jst).date()
        
        # 太陽時刻を計算
        s = sun(location.observer, date=today, tzinfo=jst)
        
        print(f"計算された日の出: {s['sunrise']}")
        print(f"計算された日の入: {s['sunset']}")
        
        return {
            "sunrise": s['sunrise'].isoformat(),
            "sunset": s['sunset'].isoformat(),
            "solar_noon": s['noon'].isoformat(),
            "golden_hour_morning_start": (s['sunrise'] - timedelta(minutes=30)).isoformat(),
            "golden_hour_morning_end": s['sunrise'].isoformat(),
            "golden_hour_evening_start": s['sunset'].isoformat(),
            "golden_hour_evening_end": (s['sunset'] + timedelta(minutes=30)).isoformat(),
            "blue_hour_morning_start": (s['dawn'] - timedelta(minutes=20)).isoformat(),
            "blue_hour_morning_end": s['dawn'].isoformat(),
            "blue_hour_evening_start": s['dusk'].isoformat(),
            "blue_hour_evening_end": (s['dusk'] + timedelta(minutes=20)).isoformat()
        }
    except Exception as e:
        print(f"エラー: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/today-forecast")
def get_today_forecast(lat: float = 35.6762, lng: float = 139.6503):
    """統合エンドポイント：太陽時刻 + 天気予報"""
    try:
        # APIキー取得
        api_key = os.getenv("OPENWEATHER_API_KEY")
        
        if not api_key:
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
        
        # 可視性判定（マジックアワー・ブルーモーメント用）
        visibility_result = calculate_visibility_score(weather_data)
        
        # ハロ可視性判定を追加
        halo_visibility = calculate_halo_visibility(weather_data)
        
        # 天気データを抽出
        weather = {
            "description": weather_data["weather"][0]["description"],
            "clouds": weather_data["clouds"]["all"],
            "humidity": weather_data["main"]["humidity"],
            "temperature": weather_data["main"]["temp"],
            "visibility": visibility_result["message"]  # メッセージを使用
        }
        
        # 太陽時刻を計算
        jst = pytz.timezone('Asia/Tokyo')
        location = LocationInfo(latitude=lat, longitude=lng, timezone="Asia/Tokyo")
        today = datetime.now(jst).date()
        s = sun(location.observer, date=today, tzinfo=jst)
        
        solar_times = {
            "sunrise": s['sunrise'].isoformat(),
            "sunset": s['sunset'].isoformat(),
            "goldenHour": (s['sunset'] + timedelta(minutes=30)).isoformat(),
            "blueHour": s['dusk'].isoformat()
        }
        
        return {
            "weather": weather,
            "solarTimes": solar_times,
            "visibility": visibility_result,      # 詳細な可視性情報を追加
            "haloVisibility": halo_visibility,    # ハロ可視性情報を追加
            "location": {"lat": lat, "lng": lng},
            "timestamp": datetime.now().isoformat()
        }
        
    except requests.RequestException as e:
        print(f"🌐 ネットワークエラー: {str(e)}")
        return get_test_forecast_for_menu(lat, lng)
    except Exception as e:
        print(f"💥 エラー: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
@app.get("/api/visibility-detail")
def get_visibility_detail(lat: float = 35.6762, lng: float = 139.6503):
    """詳細な可視性情報（デバッグ用）"""
    try:
        api_key = os.getenv("OPENWEATHER_API_KEY")
        
        if not api_key:
            raise HTTPException(status_code=500, detail="APIキーが設定されていません")
        
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
            raise HTTPException(status_code=response.status_code, detail="天気APIエラー")
        
        weather_data = response.json()
        
        # 詳細な可視性情報を取得
        visibility_info = get_detailed_visibility(weather_data)
        
        return {
            "visibility": visibility_info,
            "raw_weather": {
                "description": weather_data["weather"][0]["description"],
                "clouds": weather_data["clouds"]["all"],
                "humidity": weather_data["main"]["humidity"],
                "temperature": weather_data["main"]["temp"]
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def get_test_forecast_for_menu(lat: float = 35.6762, lng: float = 139.6503):
    """テストデータ（APIキーがない場合）"""
    weather = {
        "description": "薄い雲",
        "clouds": 45,
        "humidity": 65,
        "temperature": 23.5,
        "visibility": "美しい時間が期待できそうです"
    }
    
    solar_times = {
        "sunrise": "2025-10-02T06:00:00+09:00",
        "sunset": "2025-10-02T18:00:00+09:00",
        "goldenHour": "2025-10-02T05:30:00+09:00",
        "blueHour": "2025-10-02T18:30:00+09:00"
    }
    
    # テスト用の可視性データを追加
    test_visibility = {
        "score": 70,
        "level": "good",
        "message": "綺麗な空が見られるかもしれません",
        "factors": {
            "雲量": "45%",
            "雲量判定": "良好",
            "湿度": "65%",
            "湿度判定": "理想的"
        }
    }
    
    # テスト用のハロ可視性データを追加
    test_halo = {
        "score": 65,
        "level": "good",
        "message": "👌 ハロが見えるかもしれません",
        "factors": {
            "雲量": "45% ✓ 高層雲に期待",
            "湿度": "65% ✓ 氷晶形成に適した条件",
            "視程": "10.0km ✓ クリア",
            "天気": "薄曇り ✓ ハロに最適"
        }
    }
    
    return {
        "weather": weather,
        "solarTimes": solar_times,
        "visibility": test_visibility,      # 追加
        "haloVisibility": test_halo,        # 追加
        "location": {"lat": lat, "lng": lng},
        "timestamp": datetime.now().isoformat()
    }
    

@app.get("/api/health")
async def health_check():
    """ヘルスチェック"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "message": "Skyle API is running"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3001)
   
