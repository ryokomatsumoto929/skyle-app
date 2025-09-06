from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from datetime import datetime


class WeatherData(BaseModel):
    temperature: float
    feels_like: float
    humidity: float
    pressure: float
    wind_speed: float
    wind_direction: float
    clouds: float
    visibility: float
    weather: Dict[str, str]
    location: str
    country: str
    sunrise: str
    sunset: str
    timestamp: str


class WeatherResponse(BaseModel):
    temperature: float
    feels_like: float
    humidity: float
    pressure: float
    wind_speed: float
    wind_direction: float
    clouds: float
    visibility: float
    weather: Dict[str, str]
    location: str
    country: str
    sunrise: str
    sunset: str
    timestamp: str


class TwilightData(BaseModel):
    dawn: Optional[str]
    dusk: Optional[str]


class TwilightInfo(BaseModel):
    civil: TwilightData
    nautical: TwilightData
    astronomical: TwilightData


class GoldenHourData(BaseModel):
    morning: Optional[str]
    evening: Optional[str]


class SolarPosition(BaseModel):
    altitude: float
    azimuth: float


class MoonData(BaseModel):
    phase: float
    illumination: float
    phase_name: str


class SolarData(BaseModel):
    sunrise: Optional[str]
    sunset: Optional[str]
    solar_noon: Optional[str]
    day_length: Optional[float]
    twilight: TwilightInfo
    golden_hour: GoldenHourData
    current_position: SolarPosition
    moon: MoonData


class SolarResponse(BaseModel):
    sunrise: Optional[str]
    sunset: Optional[str]
    solar_noon: Optional[str]
    day_length: Optional[float]
    twilight: TwilightInfo
    golden_hour: GoldenHourData
    current_position: SolarPosition
    moon: MoonData


class LocationInfo(BaseModel):
    latitude: float
    longitude: float
    name: str


class VisibilityScore(BaseModel):
    overall: float
    star_gazing: float
    aurora: float
    meteor_shower: float
    milky_way: float
    planet_viewing: float


class VisibilityFactors(BaseModel):
    cloud_cover: float
    light_pollution: float
    moon_brightness: float
    atmospheric_conditions: float
    time_of_day: float


class VisibilityRecommendation(BaseModel):
    best_time: Optional[str]
    quality: str
    description: str
    tips: List[str]


class VisibilityData(BaseModel):
    score: VisibilityScore
    factors: VisibilityFactors
    recommendation: VisibilityRecommendation
    is_nighttime: bool
    is_clear: bool


class VisibilityResponse(BaseModel):
    location: LocationInfo
    weather: WeatherResponse
    solar: SolarResponse
    visibility: VisibilityData
    timestamp: str


class ForecastItem(BaseModel):
    datetime: str
    temperature: float
    feels_like: float
    humidity: float
    clouds: float
    wind_speed: float
    weather: Dict[str, str]
    precipitation: float


class ForecastResponse(BaseModel):
    location: str
    country: str
    forecasts: List[ForecastItem]