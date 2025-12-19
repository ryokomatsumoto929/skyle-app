# skyle 🌅

**"空の機嫌を教えてくれる、朝と夕の贈りもの"**

マジックアワーとブルーモーメント——写真家や空好きが待ちわびる、一日で最も美しい光の時間。  
でも、その日の空が本当に美しく染まるかは、雲や湿度次第。

**skyle** は、太陽の位置と天気を掛け合わせて「今日は見える？」を静かに教えてくれるWebアプリです。  
技術的な興味と、日常の小さな感動を繋ぐ実験として開発しています。

🚧 **This project is under active development.**

---

## ✨ Features

- **🌅 マジックアワー・ブルーモーメント予報**  
  位置情報と太陽計算ライブラリで、正確な時刻を表示

- **🌤️ 空の可視性判定**  
  OpenWeatherMap APIから雲量・湿度・視程を取得し、独自アルゴリズムで「今日は見えそう？」を4段階評価

- **🎨 時間帯で変わるグラデーション背景**  
  朝・昼・夕・夜で背景色が変化し、「今」の空の印象を表現

- **📱 PWA対応**  
  ホーム画面に追加して、ネイティブアプリのように使える

---

## 🛠️ Tech Stack

### Frontend
- **React 18** + **TypeScript**
- **Vite** (Build tool)
- **Material-UI (MUI) v7** (一部機能)
- **Vanilla CSS** (ガラスモーフィズム、グラデーション)

### Backend
- **FastAPI** (Python)
- **PostgreSQL 15** (Docker)
- **OpenWeatherMap API** (天気データ)
- **SunCalc / Astral** (太陽位置計算)

### Infra / Tools
- **Docker Compose**
- **Git / GitHub**

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.11+
- Docker & Docker Compose

### Installation
```bash
# Clone repository
git clone https://github.com/yourusername/skyle.git
cd skyle

# Frontend setup
cd frontend
npm install
npm run dev  # → http://localhost:5173

# Backend setup (別ターミナル)
cd ../backend
pip install -r requirements.txt
python3 -m uvicorn main:app --reload --port 3001
```

### Environment Variables
```env
# backend/.env
OPENWEATHER_API_KEY=your_api_key_here
```

---

## 📖 Development Notes

### なぜこの技術スタックなのか

- **TypeScript → Python移行の経緯**  
  当初はNode.js + TypeScriptで開発していたが、ES Modules周りの不安定さに直面。学習効率を優先し、FastAPIに移行した。([詳細](./技術スタック変更理由))

- **Material-UI → Vanilla CSSへの移行**  
  「余白と彩り」というコンセプトを追求する中で、MUIの重厚さが合わないと判断。カスタムCSSでミニマルなデザインに刷新した。

### 判断の軸

- **技術的興味 < ユーザー体験**  
  複雑な可視性判定アルゴリズムより、シンプルで分かりやすいメッセージを優先

- **既存アプリとの差別化**  
  詳細な気象データではなく、「今日の空は美しい？」という問いに特化

---

## 🌱 Roadmap

- [ ] プッシュ通知機能（マジックアワー開始15分前）
- [ ] ハロ現象・虹予報の精度向上
- [ ] 機械学習による予測モデル
- [ ] iOS/Android対応（React Native検討）

---

## 📝 Blog

開発の過程をnoteで**継続的に**発信中：  
→ [skyle開発記録](https://note.com/ryoko0655/m/ma478bfbd9c71)
---

## 📄 License

MIT

---

**Made with ☕ and a love for beautiful skies**
