// App.tsx - 既存UIと新UIの切り替え
import React, { useState } from "react";
import WeatherIntegrationTest from "./components/WeatherIntegrationTest";
import SimpleMomentCard from "./components/SimpleMomentCard";

function App() {
  // UI切り替えフラグ（開発用）
  const [useSimpleUI, setUseSimpleUI] = useState(true);

  return (
    <div className="App">
      {/* 開発用の切り替えボタン */}
      <div
        style={{
          position: "fixed",
          top: 10,
          right: 10,
          zIndex: 1000,
          background: "rgba(255, 255, 255, 0.9)",
          padding: "8px 12px",
          borderRadius: "20px",
          fontSize: "12px",
          border: "1px solid rgba(0, 0, 0, 0.1)",
          cursor: "pointer",
        }}
        onClick={() => setUseSimpleUI(!useSimpleUI)}
      >
        {useSimpleUI ? "従来UI" : "シンプルUI"}
      </div>

      {/* UI切り替え */}
      {useSimpleUI ? <SimpleMomentCard /> : <WeatherIntegrationTest />}
    </div>
  );
}

export default App;
