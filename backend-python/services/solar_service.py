import math
from datetime import datetime, timedelta, timezone
from typing import Dict, Any, Optional, Tuple
import asyncio


class SolarService:
    def __init__(self):
        pass
    
    async def get_solar_times(self, latitude: float, longitude: float, date: datetime) -> Dict[str, Any]:
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(
            None,
            self._calculate_solar_times,
            latitude,
            longitude,
            date
        )
    
    def _calculate_solar_times(self, latitude: float, longitude: float, date: datetime) -> Dict[str, Any]:
        julian_day = self._get_julian_day(date)
        
        sunrise, sunset = self._calculate_sunrise_sunset(latitude, longitude, julian_day)
        solar_noon = self._calculate_solar_noon(longitude, julian_day)
        
        dawn_civil, dusk_civil = self._calculate_twilight(latitude, longitude, julian_day, -6)
        dawn_nautical, dusk_nautical = self._calculate_twilight(latitude, longitude, julian_day, -12)
        dawn_astronomical, dusk_astronomical = self._calculate_twilight(latitude, longitude, julian_day, -18)
        
        golden_hour_morning, golden_hour_evening = self._calculate_golden_hour(latitude, longitude, julian_day)
        
        altitude, azimuth = self._calculate_solar_position(latitude, longitude, datetime.now())
        
        moon_phase = self._calculate_moon_phase(date)
        moon_illumination = self._calculate_moon_illumination(moon_phase)
        
        return {
            "sunrise": sunrise.isoformat() if sunrise else None,
            "sunset": sunset.isoformat() if sunset else None,
            "solar_noon": solar_noon.isoformat() if solar_noon else None,
            "day_length": self._calculate_day_length(sunrise, sunset),
            "twilight": {
                "civil": {
                    "dawn": dawn_civil.isoformat() if dawn_civil else None,
                    "dusk": dusk_civil.isoformat() if dusk_civil else None
                },
                "nautical": {
                    "dawn": dawn_nautical.isoformat() if dawn_nautical else None,
                    "dusk": dusk_nautical.isoformat() if dusk_nautical else None
                },
                "astronomical": {
                    "dawn": dawn_astronomical.isoformat() if dawn_astronomical else None,
                    "dusk": dusk_astronomical.isoformat() if dusk_astronomical else None
                }
            },
            "golden_hour": {
                "morning": golden_hour_morning.isoformat() if golden_hour_morning else None,
                "evening": golden_hour_evening.isoformat() if golden_hour_evening else None
            },
            "current_position": {
                "altitude": altitude,
                "azimuth": azimuth
            },
            "moon": {
                "phase": moon_phase,
                "illumination": moon_illumination,
                "phase_name": self._get_moon_phase_name(moon_phase)
            }
        }
    
    def _get_julian_day(self, date: datetime) -> float:
        a = (14 - date.month) // 12
        y = date.year + 4800 - a
        m = date.month + 12 * a - 3
        
        jdn = date.day + (153 * m + 2) // 5 + 365 * y + y // 4 - y // 100 + y // 400 - 32045
        return jdn + (date.hour - 12) / 24 + date.minute / 1440 + date.second / 86400
    
    def _calculate_sunrise_sunset(self, lat: float, lon: float, julian_day: float) -> Tuple[Optional[datetime], Optional[datetime]]:
        n = julian_day - 2451545.0 + 0.0008
        j_star = n - lon / 360
        m = math.radians((357.5291 + 0.98560028 * j_star) % 360)
        c = 1.9148 * math.sin(m) + 0.0200 * math.sin(2 * m) + 0.0003 * math.sin(3 * m)
        lambda_sun = math.radians((math.degrees(m) + c + 180 + 102.9372) % 360)
        
        j_transit = 2451545.0 + j_star + 0.0053 * math.sin(m) - 0.0069 * math.sin(2 * lambda_sun)
        
        declination = math.asin(math.sin(lambda_sun) * math.sin(math.radians(23.45)))
        
        lat_rad = math.radians(lat)
        hour_angle_arg = -math.tan(lat_rad) * math.tan(declination)
        
        if hour_angle_arg < -1 or hour_angle_arg > 1:
            return None, None
        
        hour_angle = math.degrees(math.acos(hour_angle_arg))
        
        j_sunrise = j_transit - hour_angle / 360
        j_sunset = j_transit + hour_angle / 360
        
        sunrise = self._julian_to_datetime(j_sunrise)
        sunset = self._julian_to_datetime(j_sunset)
        
        return sunrise, sunset
    
    def _calculate_solar_noon(self, lon: float, julian_day: float) -> Optional[datetime]:
        n = julian_day - 2451545.0 + 0.0008
        j_star = n - lon / 360
        m = math.radians((357.5291 + 0.98560028 * j_star) % 360)
        lambda_sun = math.radians((math.degrees(m) + 1.9148 * math.sin(m) + 0.0200 * math.sin(2 * m) + 0.0003 * math.sin(3 * m) + 180 + 102.9372) % 360)
        j_transit = 2451545.0 + j_star + 0.0053 * math.sin(m) - 0.0069 * math.sin(2 * lambda_sun)
        
        return self._julian_to_datetime(j_transit)
    
    def _calculate_twilight(self, lat: float, lon: float, julian_day: float, angle: float) -> Tuple[Optional[datetime], Optional[datetime]]:
        n = julian_day - 2451545.0 + 0.0008
        j_star = n - lon / 360
        m = math.radians((357.5291 + 0.98560028 * j_star) % 360)
        c = 1.9148 * math.sin(m) + 0.0200 * math.sin(2 * m) + 0.0003 * math.sin(3 * m)
        lambda_sun = math.radians((math.degrees(m) + c + 180 + 102.9372) % 360)
        
        j_transit = 2451545.0 + j_star + 0.0053 * math.sin(m) - 0.0069 * math.sin(2 * lambda_sun)
        
        declination = math.asin(math.sin(lambda_sun) * math.sin(math.radians(23.45)))
        
        lat_rad = math.radians(lat)
        hour_angle_arg = (math.sin(math.radians(angle)) - math.sin(lat_rad) * math.sin(declination)) / (math.cos(lat_rad) * math.cos(declination))
        
        if hour_angle_arg < -1 or hour_angle_arg > 1:
            return None, None
        
        hour_angle = math.degrees(math.acos(hour_angle_arg))
        
        dawn = self._julian_to_datetime(j_transit - hour_angle / 360)
        dusk = self._julian_to_datetime(j_transit + hour_angle / 360)
        
        return dawn, dusk
    
    def _calculate_golden_hour(self, lat: float, lon: float, julian_day: float) -> Tuple[Optional[datetime], Optional[datetime]]:
        return self._calculate_twilight(lat, lon, julian_day, 6)
    
    def _calculate_solar_position(self, lat: float, lon: float, date: datetime) -> Tuple[float, float]:
        julian_day = self._get_julian_day(date)
        n = julian_day - 2451545.0
        l = math.radians((280.460 + 0.9856474 * n) % 360)
        g = math.radians((357.528 + 0.9856003 * n) % 360)
        lambda_sun = l + math.radians(1.915) * math.sin(g) + math.radians(0.020) * math.sin(2 * g)
        
        beta = 0
        epsilon = math.radians(23.439 - 0.0000004 * n)
        
        alpha = math.atan2(math.cos(epsilon) * math.sin(lambda_sun), math.cos(lambda_sun))
        delta = math.asin(math.sin(epsilon) * math.sin(lambda_sun))
        
        h = self._calculate_hour_angle(date, lon, alpha)
        
        lat_rad = math.radians(lat)
        altitude = math.asin(math.sin(lat_rad) * math.sin(delta) + math.cos(lat_rad) * math.cos(delta) * math.cos(h))
        azimuth = math.atan2(math.sin(h), math.cos(h) * math.sin(lat_rad) - math.tan(delta) * math.cos(lat_rad))
        
        return math.degrees(altitude), (math.degrees(azimuth) + 180) % 360
    
    def _calculate_hour_angle(self, date: datetime, lon: float, right_ascension: float) -> float:
        julian_day = self._get_julian_day(date)
        d = julian_day - 2451545.0
        gmst = 18.697374558 + 24.06570982441908 * d
        gmst = gmst % 24
        
        lmst = gmst + lon / 15
        hour_angle = (lmst * 15 - math.degrees(right_ascension)) % 360
        if hour_angle > 180:
            hour_angle -= 360
        
        return math.radians(hour_angle)
    
    def _calculate_moon_phase(self, date: datetime) -> float:
        new_moon = datetime(2000, 1, 6, 18, 14, tzinfo=timezone.utc)
        lunation = 29.53058867
        
        days_since = (date - new_moon).total_seconds() / 86400
        phase = (days_since % lunation) / lunation
        
        return phase
    
    def _calculate_moon_illumination(self, phase: float) -> float:
        return (1 - math.cos(2 * math.pi * phase)) / 2
    
    def _get_moon_phase_name(self, phase: float) -> str:
        if phase < 0.0625:
            return "New Moon"
        elif phase < 0.1875:
            return "Waxing Crescent"
        elif phase < 0.3125:
            return "First Quarter"
        elif phase < 0.4375:
            return "Waxing Gibbous"
        elif phase < 0.5625:
            return "Full Moon"
        elif phase < 0.6875:
            return "Waning Gibbous"
        elif phase < 0.8125:
            return "Last Quarter"
        elif phase < 0.9375:
            return "Waning Crescent"
        else:
            return "New Moon"
    
    def _julian_to_datetime(self, julian_day: float) -> datetime:
        j = julian_day + 0.5
        z = int(j)
        f = j - z
        
        if z >= 2299161:
            alpha = int((z - 1867216.25) / 36524.25)
            a = z + 1 + alpha - int(alpha / 4)
        else:
            a = z
        
        b = a + 1524
        c = int((b - 122.1) / 365.25)
        d = int(365.25 * c)
        e = int((b - d) / 30.6001)
        
        day = b - d - int(30.6001 * e) + f
        month = e - 1 if e < 14 else e - 13
        year = c - 4716 if month > 2 else c - 4715
        
        hours = (day - int(day)) * 24
        minutes = (hours - int(hours)) * 60
        seconds = (minutes - int(minutes)) * 60
        
        return datetime(int(year), int(month), int(day), int(hours), int(minutes), int(seconds), tzinfo=timezone.utc)
    
    def _calculate_day_length(self, sunrise: Optional[datetime], sunset: Optional[datetime]) -> Optional[float]:
        if sunrise and sunset:
            return (sunset - sunrise).total_seconds() / 3600
        return None