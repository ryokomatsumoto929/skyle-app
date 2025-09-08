from typing import Dict, Any, List, Optional
from datetime import datetime, timezone
import math


class VisibilityCalculator:
    def __init__(self):
        self.weights = {
            "cloud_cover": 0.35,
            "light_pollution": 0.25,
            "moon_brightness": 0.20,
            "atmospheric_conditions": 0.15,
            "time_of_day": 0.05
        }
    
    def calculate_visibility(self, weather_data: Dict[str, Any], solar_data: Dict[str, Any]) -> Dict[str, Any]:
        factors = self._calculate_factors(weather_data, solar_data)
        scores = self._calculate_scores(factors, solar_data)
        recommendation = self._generate_recommendation(scores, factors, weather_data, solar_data)
        
        is_nighttime = self._is_nighttime(solar_data)
        is_clear = factors["cloud_cover"] < 0.3
        
        return {
            "score": scores,
            "factors": factors,
            "recommendation": recommendation,
            "is_nighttime": is_nighttime,
            "is_clear": is_clear
        }
    
    def _calculate_factors(self, weather_data: Dict[str, Any], solar_data: Dict[str, Any]) -> Dict[str, Any]:
        cloud_factor = weather_data["clouds"] / 100
        
        visibility_km = weather_data["visibility"] / 1000
        atmospheric_factor = 1 - min(visibility_km / 10, 1)
        
        moon_illumination = solar_data["moon"]["illumination"]
        moon_factor = moon_illumination if self._is_nighttime(solar_data) else 0
        
        light_pollution_factor = self._estimate_light_pollution(weather_data)
        
        time_factor = self._calculate_time_factor(solar_data)
        
        return {
            "cloud_cover": cloud_factor,
            "light_pollution": light_pollution_factor,
            "moon_brightness": moon_factor,
            "atmospheric_conditions": atmospheric_factor,
            "time_of_day": time_factor
        }
    
    def _calculate_scores(self, factors: Dict[str, Any], solar_data: Dict[str, Any]) -> Dict[str, Any]:
        base_score = 0
        for factor_name, weight in self.weights.items():
            base_score += (1 - factors[factor_name]) * weight
        
        overall_score = base_score * 100
        
        star_gazing_score = self._calculate_star_gazing_score(factors, solar_data)
        aurora_score = self._calculate_aurora_score(factors, solar_data)
        meteor_shower_score = self._calculate_meteor_shower_score(factors, solar_data)
        milky_way_score = self._calculate_milky_way_score(factors, solar_data)
        planet_viewing_score = self._calculate_planet_viewing_score(factors, solar_data)
        
        return {
            "overall": round(overall_score, 1),
            "star_gazing": round(star_gazing_score, 1),
            "aurora": round(aurora_score, 1),
            "meteor_shower": round(meteor_shower_score, 1),
            "milky_way": round(milky_way_score, 1),
            "planet_viewing": round(planet_viewing_score, 1)
        }
    
    def _calculate_star_gazing_score(self, factors: Dict[str, Any], solar_data: Dict[str, Any]) -> float:
        if not self._is_nighttime(solar_data):
            return 0
        
        score = 100
        score *= (1 - factors["cloud_cover"])
        score *= (1 - factors["moon_brightness"] * 0.5)
        score *= (1 - factors["light_pollution"])
        score *= (1 - factors["atmospheric_conditions"] * 0.3)
        
        return max(0, min(100, score))
    
    def _calculate_aurora_score(self, factors: Dict[str, Any], solar_data: Dict[str, Any]) -> float:
        if not self._is_nighttime(solar_data):
            return 0
        
        score = 100
        score *= (1 - factors["cloud_cover"])
        score *= (1 - factors["moon_brightness"] * 0.2)
        score *= (1 - factors["light_pollution"] * 0.5)
        
        return max(0, min(100, score))
    
    def _calculate_meteor_shower_score(self, factors: Dict[str, Any], solar_data: Dict[str, Any]) -> float:
        if not self._is_nighttime(solar_data):
            return 0
        
        score = 100
        score *= (1 - factors["cloud_cover"])
        score *= (1 - factors["moon_brightness"] * 0.7)
        score *= (1 - factors["light_pollution"] * 0.8)
        
        return max(0, min(100, score))
    
    def _calculate_milky_way_score(self, factors: Dict[str, Any], solar_data: Dict[str, Any]) -> float:
        if not self._is_nighttime(solar_data):
            return 0
        
        score = 100
        score *= (1 - factors["cloud_cover"])
        score *= (1 - factors["moon_brightness"] * 0.9)
        score *= (1 - factors["light_pollution"] * 0.95)
        score *= (1 - factors["atmospheric_conditions"] * 0.5)
        
        return max(0, min(100, score))
    
    def _calculate_planet_viewing_score(self, factors: Dict[str, Any], solar_data: Dict[str, Any]) -> float:
        if not self._is_nighttime(solar_data):
            return 0
        
        score = 100
        score *= (1 - factors["cloud_cover"])
        score *= (1 - factors["atmospheric_conditions"] * 0.7)
        score *= (1 - factors["light_pollution"] * 0.3)
        
        return max(0, min(100, score))
    
    def _generate_recommendation(self, scores: Dict[str, float], factors: Dict[str, Any], 
                                weather_data: Dict[str, Any], solar_data: Dict[str, Any]) -> Dict[str, Any]:
        
        overall_score = scores["overall"]
        
        if overall_score >= 80:
            quality = "Excellent"
            description = "Perfect conditions for sky observation!"
        elif overall_score >= 60:
            quality = "Good"
            description = "Good conditions for most sky viewing activities."
        elif overall_score >= 40:
            quality = "Fair"
            description = "Acceptable conditions, but some limitations exist."
        elif overall_score >= 20:
            quality = "Poor"
            description = "Challenging conditions for sky observation."
        else:
            quality = "Very Poor"
            description = "Not recommended for sky viewing."
        
        tips = self._generate_tips(factors, scores, weather_data, solar_data)
        best_time = self._find_best_viewing_time(solar_data)
        
        return {
            "best_time": best_time,
            "quality": quality,
            "description": description,
            "tips": tips
        }
    
    def _generate_tips(self, factors: Dict[str, Any], scores: Dict[str, float], 
                       weather_data: Dict[str, Any], solar_data: Dict[str, Any]) -> List[str]:
        tips = []
        
        if factors["cloud_cover"] > 0.5:
            tips.append("Heavy cloud cover detected. Consider checking forecast for clearer conditions.")
        elif factors["cloud_cover"] > 0.2:
            tips.append("Some clouds present. Look for gaps in cloud cover for best viewing.")
        
        if factors["moon_brightness"] > 0.7:
            tips.append("Bright moon tonight. Best for lunar observation, challenging for deep-sky objects.")
        elif factors["moon_brightness"] > 0.3:
            tips.append("Moderate moonlight. Consider observing before moonrise or after moonset.")
        
        if factors["light_pollution"] > 0.6:
            tips.append("High light pollution detected. Consider traveling to darker skies if possible.")
        
        if weather_data["humidity"] > 80:
            tips.append("High humidity may cause lens fogging. Bring anti-fog solutions.")
        
        if weather_data["wind_speed"] > 10:
            tips.append("Windy conditions. Secure equipment and dress warmly.")
        
        if scores["milky_way"] > 70:
            tips.append("Excellent conditions for Milky Way photography!")
        
        if scores["planet_viewing"] > 80:
            tips.append("Great night for planetary observation.")
        
        if not self._is_nighttime(solar_data):
            astronomical_twilight = solar_data["twilight"]["astronomical"]["dusk"]
            if astronomical_twilight:
                tips.append(f"Best viewing starts after astronomical twilight at {astronomical_twilight}")
        
        return tips if tips else ["Check weather updates closer to viewing time."]
    
    def _find_best_viewing_time(self, solar_data: Dict[str, Any]) -> Optional[str]:
        astronomical_dusk = solar_data["twilight"]["astronomical"]["dusk"]
        astronomical_dawn = solar_data["twilight"]["astronomical"]["dawn"]
        
        if astronomical_dusk and astronomical_dawn:
            dusk_dt = datetime.fromisoformat(astronomical_dusk)
            dawn_dt = datetime.fromisoformat(astronomical_dawn)
            
            middle_of_night = dusk_dt + (dawn_dt - dusk_dt) / 2
            return middle_of_night.isoformat()
        
        return None
    
    def _is_nighttime(self, solar_data: Dict[str, Any]) -> bool:
        current_altitude = solar_data["current_position"]["altitude"]
        return current_altitude < -18
    
    def _estimate_light_pollution(self, weather_data: Dict[str, Any]) -> float:
        if "location" in weather_data:
            location = weather_data["location"].lower()
            if any(city in location for city in ["tokyo", "new york", "london", "paris", "shanghai"]):
                return 0.9
            elif any(term in location for term in ["city", "downtown", "metro"]):
                return 0.7
            elif any(term in location for term in ["suburb", "town"]):
                return 0.5
            elif any(term in location for term in ["rural", "countryside"]):
                return 0.3
            else:
                return 0.4
        return 0.5
    
    def _calculate_time_factor(self, solar_data: Dict[str, Any]) -> float:
        current_altitude = solar_data["current_position"]["altitude"]
        
        if current_altitude > 0:
            return 1.0
        elif current_altitude > -6:
            return 0.8
        elif current_altitude > -12:
            return 0.4
        elif current_altitude > -18:
            return 0.1
        else:
            return 0.0