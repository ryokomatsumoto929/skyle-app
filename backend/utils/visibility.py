"""
可視性判定ロジック
夕焼け・マジックアワー・ブルーモーメントが美しく見える条件を判定
"""

def calculate_visibility_score(weather_data: dict) -> dict:
    """
    天気データから可視性スコアを計算
    
    Args:
        weather_data: OpenWeatherMap APIからの天気データ
        
    Returns:
        {
            "score": int (0-100),
            "level": str ("excellent" | "good" | "fair" | "poor"),
            "message": str,
            "factors": dict
        }
    """
    score = 0
    factors = {}
    
    # 1. 雲量チェック（最重要: 40点）
    cloud_cover = weather_data["clouds"]["all"]
    factors["雲量"] = f"{cloud_cover}%"
    
    if 30 <= cloud_cover <= 60:
        score += 40
        factors["雲量判定"] = "理想的"
    elif 20 <= cloud_cover < 30 or 60 < cloud_cover <= 75:
        score += 25
        factors["雲量判定"] = "良好"
    elif cloud_cover < 20:
        score += 10
        factors["雲量判定"] = "快晴すぎる"
    else:
        score += 5
        factors["雲量判定"] = "曇りすぎ"
    
    # 2. 湿度チェック（25点）
    humidity = weather_data["main"]["humidity"]
    factors["湿度"] = f"{humidity}%"
    
    if 40 <= humidity <= 70:
        score += 25
        factors["湿度判定"] = "理想的"
    elif 30 <= humidity < 40 or 70 < humidity <= 80:
        score += 15
        factors["湿度判定"] = "良好"
    else:
        score += 5
        factors["湿度判定"] = "要注意"
    
    # 3. 天気状況（20点）
    weather_condition = weather_data["weather"][0]["main"].lower()
    factors["天気"] = weather_data["weather"][0]["description"]
    
    if weather_condition == "clear":
        score += 15
        factors["天気判定"] = "晴れ"
    elif weather_condition == "clouds":
        score += 20  # 薄曇りは実は良い
        factors["天気判定"] = "薄曇り（最適）"
    elif weather_condition == "rain":
        # 雨上がりの可能性を考慮
        score += 10
        factors["天気判定"] = "雨（雨上がりに期待）"
    else:
        score += 5
        factors["天気判定"] = "その他"
    
    # 4. 視程（15点）
    if "visibility" in weather_data:
        visibility_m = weather_data["visibility"]
        factors["視程"] = f"{visibility_m}m"
        
        if visibility_m >= 10000:
            score += 15
            factors["視程判定"] = "非常に良好"
        elif visibility_m >= 5000:
            score += 10
            factors["視程判定"] = "良好"
        else:
            score += 5
            factors["視程判定"] = "やや不良"
    
    # スコアに基づいてレベルとメッセージを決定
    level, message = get_level_and_message(score, cloud_cover, humidity)
    
    return {
        "score": score,
        "level": level,
        "message": message,
        "factors": factors
    }


def get_level_and_message(score: int, cloud_cover: int, humidity: int) -> tuple:
    """
    スコアから可視性レベルとメッセージを生成
    
    Returns:
        (level, message) のタプル
    """
    # 雲量が85%を超える場合は厳しめの判定
    if cloud_cover > 85:
        if score >= 60:
            return ("fair", "雲が多いですが、隙間に期待")
        else:
            return ("poor", "雲が多く、見るのは難しそう...")
    
    if score >= 75:
        if 30 <= cloud_cover <= 50 and 50 <= humidity <= 70:
            return ("excellent", "絶好の撮影日和です")
        return ("excellent", "美しい時間が期待できそうです")
    
    elif score >= 60:
        return ("good", "綺麗な空が見られるかもしれません")
    
    elif score >= 40:
        if cloud_cover > 75:
            return ("fair", "雲が多めですが、チャンスはあります")
        return ("fair", "条件は微妙ですが、可能性はあります")
    
    else:
        if cloud_cover < 20:
            return ("poor", "快晴すぎて控えめな色合いかも")
        return ("poor", "今日は厳しそうです...")


def get_simple_visibility_message(weather_data: dict) -> str:
    """
    シンプルなメッセージのみを返す（フロントエンド用）
    """
    result = calculate_visibility_score(weather_data)
    return result["message"]


def get_detailed_visibility(weather_data: dict) -> dict:
    """
    詳細な可視性情報を返す（デバッグ用）
    """
    return calculate_visibility_score(weather_data)