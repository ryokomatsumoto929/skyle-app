import os
import requests
from typing import Dict, Any, Optional
from datetime import datetime
import asyncio
from concurrent.futures import ThreadPoolExecutor


class WeatherService:
    def __init__(self):
        self.api_key = os.getenv("OPENWEATHER_API_KEY")
        self.base_url = "https://api.openweathermap.org/data/2.5"
        self.executor = ThreadPoolExecutor(max_workers=3)
    
    async def get_weather(self, latitude: float, longitude: float) -> Dict[str, Any]:
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(
            self.executor,
            self._fetch_weather,
            latitude,
            longitude
        )
    
    def _fetch_weather(self, latitude: float, longitude: float) -> Dict[str, Any]:
        if not self.api_key:
            raise ValueError("OpenWeather API key not found in environment variables")
        
        url = f"{self.base_url}/weather"
        params = {
            "lat": latitude,
            "lon": longitude,
            "appid": self.api_key,
            "units": "metric"
        }
        
        try:
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            data = response.json()
            
            return self._format_weather_data(data)
        except requests.RequestException as e:
            raise Exception(f"Weather API error: {str(e)}")
    
    def _format_weather_data(self, data: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "temperature": data["main"]["temp"],
            "feels_like": data["main"]["feels_like"],
            "humidity": data["main"]["humidity"],
            "pressure": data["main"]["pressure"],
            "wind_speed": data["wind"]["speed"],
            "wind_direction": data["wind"].get("deg", 0),
            "clouds": data["clouds"]["all"],
            "visibility": data.get("visibility", 10000),
            "weather": {
                "main": data["weather"][0]["main"],
                "description": data["weather"][0]["description"],
                "icon": data["weather"][0]["icon"]
            },
            "location": data["name"],
            "country": data["sys"]["country"],
            "sunrise": datetime.fromtimestamp(data["sys"]["sunrise"]).isoformat(),
            "sunset": datetime.fromtimestamp(data["sys"]["sunset"]).isoformat(),
            "timestamp": datetime.fromtimestamp(data["dt"]).isoformat()
        }
    
    async def get_forecast(self, latitude: float, longitude: float, days: int = 5) -> Dict[str, Any]:
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(
            self.executor,
            self._fetch_forecast,
            latitude,
            longitude,
            days
        )
    
    def _fetch_forecast(self, latitude: float, longitude: float, days: int) -> Dict[str, Any]:
        if not self.api_key:
            raise ValueError("OpenWeather API key not found in environment variables")
        
        url = f"{self.base_url}/forecast"
        params = {
            "lat": latitude,
            "lon": longitude,
            "appid": self.api_key,
            "units": "metric",
            "cnt": days * 8
        }
        
        try:
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            data = response.json()
            
            return self._format_forecast_data(data)
        except requests.RequestException as e:
            raise Exception(f"Forecast API error: {str(e)}")
    
    def _format_forecast_data(self, data: Dict[str, Any]) -> Dict[str, Any]:
        forecasts = []
        for item in data["list"]:
            forecasts.append({
                "datetime": datetime.fromtimestamp(item["dt"]).isoformat(),
                "temperature": item["main"]["temp"],
                "feels_like": item["main"]["feels_like"],
                "humidity": item["main"]["humidity"],
                "clouds": item["clouds"]["all"],
                "wind_speed": item["wind"]["speed"],
                "weather": {
                    "main": item["weather"][0]["main"],
                    "description": item["weather"][0]["description"],
                    "icon": item["weather"][0]["icon"]
                },
                "precipitation": item.get("rain", {}).get("3h", 0) + item.get("snow", {}).get("3h", 0)
            })
        
        return {
            "location": data["city"]["name"],
            "country": data["city"]["country"],
            "forecasts": forecasts
        }