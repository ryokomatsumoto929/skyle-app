import React, { useState, useEffect } from "react";
import {
  Menu,
  X,
  Camera,
  Bell,
  Settings,
  Info,
  Sun,
  Cloud,
  Eye,
  Wifi,
  MapPin,
  Star,
  Navigation,
} from "lucide-react";
import "./HamburgerMenu.css";

interface WeatherData {
  description: string;
  clouds: number;
  humidity: number;
  visibility: string;
  temperature: number;
}

interface SolarTimes {
  sunrise: string;
  sunset: string;
  goldenHour: string;
  blueHour: string;
}

interface TodayForecast {
  weather: WeatherData | null;
  solarTimes: SolarTimes | null;
  location: { lat: number; lng: number };
  timestamp: string;
}

interface MenuItem {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  badge?: string | null;
  path: string;
  description: string;
}

interface HamburgerMenuProps {
  onMenuItemClick?: (path: string) => void;
  currentLat?: number;
  currentLng?: number;
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({
  onMenuItemClick,
  currentLat = 34.6937, // 大阪をデフォルト
  currentLng = 135.5023,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [forecastData, setForecastData] = useState<TodayForecast | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const menuItems: MenuItem[] = [
    {
      icon: Sun,
      label: "マジックアワー",
      badge: null,
      path: "/",
      description: "今日の最高の撮影時間",
    },
    {
      icon: Star,
      label: "ブルーモーメント",
      badge: null,
      path: "/blue-moment",
      description: "空が青く染まる時間",
    },
    {
      icon: Cloud,
      label: "ハロ予報",
      badge: "NEW",
      path: "/halo",
      description: "AI機械学習による予測",
    },
    {
      icon: Eye,
      label: "虹予報",
      badge: "NEW",
      path: "/rainbow",
      description: "レインボー出現予報",
    },
    {
      icon: MapPin,
      label: "位置情報",
      badge: null,
      path: "/location",
      description: "お気に入りスポット管理",
    },
    {
      icon: Camera,
      label: "撮影記録",
      badge: null,
      path: "/photos",
      description: "美しい瞬間の記録",
    },
    {
      icon: Bell,
      label: "通知設定",
      badge: null,
      path: "/notifications",
      description: "タイミングを逃さない",
    },
    {
      icon: Wifi,
      label: "PWA設定",
      badge: null,
      path: "/pwa",
      description: "オフライン対応",
    },
    {
      icon: Settings,
      label: "設定",
      badge: null,
      path: "/settings",
      description: "アプリのカスタマイズ",
    },
    {
      icon: Info,
      label: "アプリについて",
      badge: null,
      path: "/about",
      description: "Skyleの想い",
    },
  ];

  // Python FastAPI からデータを取得
  const fetchTodayForecast = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8001/api/today-forecast?lat=${currentLat}&lng=${currentLng}`
      );

      if (response.ok) {
        const data: TodayForecast = await response.json();
        setForecastData(data);
      } else {
        console.error("予報データの取得に失敗しました");
      }
    } catch (error) {
      console.error("FastAPI接続エラー:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getIconPath = (type: string, visibility: string): string => {
    switch (type) {
      case "magic-hour":
        switch (visibility) {
          case "excellent":
            return "/images/magic-hour-excellent.jpg";
          case "good":
            return "/images/magic-hour-good.jpg";
          default:
            return "/images/magic-hour-poor.jpg";
        }
      case "blue-moment":
        switch (visibility) {
          case "excellent":
            return "/images/blue-moment-excellent.jpg";
          case "good":
            return "/images/blue-moment-good.jpg";
          default:
            return "/images/blue-moment-poor.jpg";
        }
      case "halo":
        switch (visibility) {
          case "excellent":
            return "/images/halo-excellent.jpg";
          case "good":
            return "/images/halo-good.jpg";
          default:
            return "/images/halo-poor.jpg";
        }
      default:
        return "/images/magic-hour-good.jpg";
    }
  };
  // コンポーネントマウント時にデータ取得
  useEffect(() => {
    fetchTodayForecast();
  }, [currentLat, currentLng]);

  // メニュー項目クリック処理
  const handleMenuClick = (item: MenuItem) => {
    console.log(`${item.label} が選択されました (${item.path})`);

    // 親コンポーネントに通知
    onMenuItemClick?.(item.path);

    // 特別な処理
    if (item.path === "/") {
      fetchTodayForecast();
    }

    setIsMenuOpen(false);
  };

  // 時刻フォーマット
  const formatTime = (timeString: string | undefined): string => {
    if (!timeString) return "--:--";
    try {
      return new Date(timeString).toLocaleTimeString("ja-JP", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "--:--";
    }
  };

  return (
    <>
      {/* ハンバーガーボタン */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="relative z-50 p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105"
        aria-label="メニュー"
      >
        <div className="relative w-6 h-6">
          <Menu
            className={`absolute inset-0 transition-all duration-300 ${
              isMenuOpen
                ? "opacity-0 rotate-90 scale-50"
                : "opacity-100 rotate-0 scale-100"
            }`}
            size={24}
          />
          <X
            className={`absolute inset-0 transition-all duration-300 ${
              isMenuOpen
                ? "opacity-100 rotate-0 scale-100"
                : "opacity-0 rotate-90 scale-50"
            }`}
            size={24}
          />
        </div>
      </button>

      {/* オーバーレイ */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* メニューパネル */}
      <div
        className={`fixed top-0 right-0 h-full w-96 bg-gradient-to-b from-slate-900/95 to-slate-800/95 backdrop-blur-xl border-l border-white/10 z-40 transition-transform duration-500 ease-out shadow-2xl ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* ヘッダー */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
              <Sun size={24} className="text-white" />
            </div>
            <div>
              <h3 className="font-medium text-lg text-white">Skyle</h3>
              <p className="text-sm text-gray-400">v2.0.0 - Python Edition</p>
            </div>
          </div>

          {/* 今日の情報サマリー */}
          <div className="bg-white/5 rounded-lg p-3">
            <h4 className="text-sm font-medium mb-2 text-gray-300">
              今日のハイライト
            </h4>
            {isLoading ? (
              <div className="text-center py-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mx-auto"></div>
              </div>
            ) : forecastData?.solarTimes ? (
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-gray-400">日の出:</span>
                  <p className="text-white">
                    {formatTime(forecastData.solarTimes.sunrise)}
                  </p>
                </div>
                <div>
                  <span className="text-gray-400">日の入:</span>
                  <p className="text-white">
                    {formatTime(forecastData.solarTimes.sunset)}
                  </p>
                </div>
                <div>
                  <span className="text-gray-400">マジック:</span>
                  <p className="text-white">
                    {formatTime(forecastData.solarTimes.goldenHour)}
                  </p>
                </div>
                <div>
                  <span className="text-gray-400">ブルー:</span>
                  <p className="text-white">
                    {formatTime(forecastData.solarTimes.blueHour)}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-gray-400">データを取得中...</p>
            )}
          </div>
        </div>

        {/* メニュー項目 */}
        <nav className="p-4 flex-1 overflow-y-auto">
          <ul className="space-y-1">
            {menuItems.map((item, index) => (
              <li key={item.label}>
                <button
                  className={`w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-white/10 transition-all duration-200 group ${
                    isMenuOpen ? "animate-slide-in" : ""
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                  onClick={() => handleMenuClick(item)}
                >
                  <div className="flex-shrink-0">
                    <item.icon
                      size={20}
                      className="text-gray-300 group-hover:text-white transition-colors duration-200"
                    />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-200 group-hover:text-white transition-colors duration-200">
                        {item.label}
                      </span>
                      {item.badge && (
                        <span className="px-2 py-1 text-xs bg-gradient-to-r from-blue-500 to-purple-500 rounded-full font-medium">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 group-hover:text-gray-300 mt-1">
                      {item.description}
                    </p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* フッター */}
        <div className="p-6 border-t border-white/10">
          <div className="text-center">
            <p className="text-xs text-gray-400 mb-3">
              Made with ❤️ for sky lovers
            </p>

            {/* API接続ステータス */}
            <div className="flex justify-center items-center space-x-2 mb-3">
              <div
                className={`w-2 h-2 rounded-full ${
                  forecastData ? "bg-green-400 animate-pulse" : "bg-red-400"
                }`}
              ></div>
              <span className="text-xs text-gray-400">
                {forecastData ? "FastAPI接続中" : "API接続エラー"}
              </span>
            </div>

            {/* データ更新ボタン */}
            <button
              onClick={fetchTodayForecast}
              disabled={isLoading}
              className="flex items-center justify-center space-x-2 w-full py-2 px-4 bg-white/5 hover:bg-white/10 rounded-lg transition-colors duration-200 disabled:opacity-50"
            >
              <Navigation size={14} className="text-gray-400" />
              <span className="text-xs text-gray-400">
                {isLoading ? "更新中..." : "データ更新"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default HamburgerMenu;
