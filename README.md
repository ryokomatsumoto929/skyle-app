# skyle 🌅

> 個人で企画・設計・開発を行っているWebアプリです。

**日常に、空を見上げる余白を。**

マジックアワー、ブルーモーメント、ハロ現象——  
一日の中には、ほんの数分だけ現れる美しい時間がある。  
でもそれが今日見えるかどうかは、雲や湿度、空気の状態次第。

**skyle** は、太陽の位置と天気データを掛け合わせて  
「今日の空、見えるかな？」を静かに教えてくれるWebアプリです。

空の予報に加えて、その日の気持ちを「形」で記録する機能も開発中。  
言葉にしなくても、毎日の小さな変化を色で振り返れる仕組みを目指しています。

🚧 **This project is under active development.**

## 📌 Current Status

- Core features for sky visibility calculation are implemented.
# skyle 🌅

> 個人で企画・設計・開発を行っているWebアプリです。

**日常に、空を見上げる余白を。**

マジックアワー、ブルーモーメント、ハロ現象——  
一日の中には、ほんの数分だけ現れる美しい時間がある。  
でもそれが今日見えるかどうかは、雲や湿度、空気の状態次第。

**skyle** は、太陽の位置と天気データを掛け合わせて  
「今日の空、見えるかな？」を静かに教えてくれるWebアプリです。

空の予報に加えて、その日の気持ちを「形」で記録する機能も開発中。  
言葉にしなくても、毎日の小さな変化を色で振り返れる仕組みを目指しています。

🚧 **This project is under active development.**

## 📌 Current Status

- Core features for sky visibility calculation are implemented.
- UX simplification in progress (prioritizing clarity over adding new features).
- Preparing wellbeing record feature (shape + crescent summary logic).
- Deployment planned after UX refinement.
---

## ✨ Features

### 🌅 マジックアワー・ブルーモーメント予報

位置情報と太陽計算ライブラリ（SunCalc / Astral）で、現在地の正確な時刻を表示。

### 🌤️ 空の可視性判定

OpenWeatherMap APIから雲量・湿度・視程を取得し、独自のスコアリングで  
「今日は見えそう？」を4段階（excellent / good / fair / poor）で評価。

### 🎨 時間帯で変わる背景

朝・昼・夕・夜で背景のグラデーションが変化。  
アプリを開いた瞬間に「今」の空気を感じられるように。

### 🌙 ウェルビーイング記録（開発中）

気持ちを言葉ではなく「形」で選ぶ記録機能。  
6種類の抽象的なアイコンから、その日の自分に近いものをタップ。  
選んだ形の色が三日月のシルエットに少しずつ混ざり、月末に自分だけのグラデーションができる。

### ☀️ ハロ現象予報

太陽の周りに現れる光の環（ハロ）の出現可能性を天気データから判定。

---

## 🛠️ Tech Stack

### Frontend

- **React 18** + **TypeScript**
- **Vite** (Build tool)
- **Material-UI (MUI) v7**（一部）
- **Vanilla CSS**（ガラスモーフィズム、グラデーション）

### Backend

- **FastAPI** (Python)
- **PostgreSQL 15** (Docker)
- **OpenWeatherMap API**（天気データ）
- **SunCalc / Astral**（太陽位置計算）

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
# Clone
git clone https://github.com/yourusername/skyle.git
cd skyle

# Frontend
cd frontend
npm install
npm run dev  # → http://localhost:5173

# Backend（別ターミナル）
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
Currently prioritizing clarity and emotional resonance over feature expansion.

### このアプリについて

最初は「マジックアワーの時刻が知りたい」という単純な動機だった。  
でも作り始めると、技術的な面白さに引っ張られて機能を詰め込みすぎてしまい、  
「誰のために、何を届けたいのか」が見えなくなる時期があった。

そこで立ち止まって、コンセプトに戻ることにした。  
複雑な気象データの羅列ではなく、「今日の空、見えるかな？」という一つの問いに絞る。  
詳細なスコアより、開いた瞬間に伝わるシンプルなメッセージを優先する。

この「技術的にできること」と「ユーザーにとって意味があること」のバランスは、  
開発を通じて何度も向き合ったテーマで、今も試行錯誤の途中にある。

### 技術選択の経緯

- **TypeScript (Node.js) → Python (FastAPI)**  
  ES Modules周りの不安定さで開発が停滞。学習効率と実装の安定性を優先して移行した。

- **Material-UI → Vanilla CSS**  
  MUIの重厚さがコンセプトに合わないと判断。  
  ガラスモーフィズムやグラデーションをカスタムCSSで表現する方向に切り替えた。

---

## 🌱 Roadmap

- [ ] 形カード選択UIの設計・実装
- [ ] 三日月に色を反映させるロジックの整理・実装
- [ ] 月末に振り返れるサマリー表示の実装
- [ ] Gemini API連携による空の予測（虹予報・夕焼けの美しさ判定）
- [ ] デプロイ（Firebase Hosting + Cloud Run）
- [ ] ハロ現象・虹予報の精度向上
- [ ] UI/UXの継続的な改善

---

## 📝 Blog

開発の過程をnoteで記録しています：  
→ [skyle開発記録](https://note.com/ryoko0655/m/ma478bfbd9c71)

---

## 📄 License

MIT

---

**Made with ☕ and a love for beautiful skies**

- Preparing wellbeing record feature (shape + crescent summary logic).
- Deployment planned after UX refinement.
---

## ✨ Features

### 🌅 マジックアワー・ブルーモーメント予報

位置情報と太陽計算ライブラリ（SunCalc / Astral）で、現在地の正確な時刻を表示。

### 🌤️ 空の可視性判定

OpenWeatherMap APIから雲量・湿度・視程を取得し、独自のスコアリングで  
「今日は見えそう？」を4段階（excellent / good / fair / poor）で評価。

### 🎨 時間帯で変わる背景

朝・昼・夕・夜で背景のグラデーションが変化。  
アプリを開いた瞬間に「今」の空気を感じられるように。

### 🌙 ウェルビーイング記録（開発中）

気持ちを言葉ではなく「形」で選ぶ記録機能。  
6種類の抽象的なアイコンから、その日の自分に近いものをタップ。  
選んだ形の色が三日月のシルエットに少しずつ混ざり、月末に自分だけのグラデーションができる。

### ☀️ ハロ現象予報

太陽の周りに現れる光の環（ハロ）の出現可能性を天気データから判定。

---

## 🛠️ Tech Stack

### Frontend

- **React 18** + **TypeScript**
- **Vite** (Build tool)
- **Material-UI (MUI) v7**（一部）
- **Vanilla CSS**（ガラスモーフィズム、グラデーション）

### Backend

- **FastAPI** (Python)
- **PostgreSQL 15** (Docker)
- **OpenWeatherMap API**（天気データ）
- **SunCalc / Astral**（太陽位置計算）

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
# Clone
git clone https://github.com/yourusername/skyle.git
cd skyle

# Frontend
cd frontend
npm install
npm run dev  # → http://localhost:5173

# Backend（別ターミナル）
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
Currently prioritizing clarity and emotional resonance over feature expansion.

### このアプリについて

最初は「マジックアワーの時刻が知りたい」という単純な動機だった。  
でも作り始めると、技術的な面白さに引っ張られて機能を詰め込みすぎてしまい、  
「誰のために、何を届けたいのか」が見えなくなる時期があった。

そこで立ち止まって、コンセプトに戻ることにした。  
複雑な気象データの羅列ではなく、「今日の空、見えるかな？」という一つの問いに絞る。  
詳細なスコアより、開いた瞬間に伝わるシンプルなメッセージを優先する。

この「技術的にできること」と「ユーザーにとって意味があること」のバランスは、  
開発を通じて何度も向き合ったテーマで、今も試行錯誤の途中にある。

### 技術選択の経緯

- **TypeScript (Node.js) → Python (FastAPI)**  
  ES Modules周りの不安定さで開発が停滞。学習効率と実装の安定性を優先して移行した。

- **Material-UI → Vanilla CSS**  
  MUIの重厚さがコンセプトに合わないと判断。  
  ガラスモーフィズムやグラデーションをカスタムCSSで表現する方向に切り替えた。

---

## 🌱 Roadmap

- [ ] 形カード選択UIの設計・実装
- [ ] 三日月に色を反映させるロジックの整理・実装
- [ ] 月末に振り返れるサマリー表示の実装
- [ ] Gemini API連携による空の予測（虹予報・夕焼けの美しさ判定）
- [ ] デプロイ（Firebase Hosting + Cloud Run）
- [ ] ハロ現象・虹予報の精度向上
- [ ] UI/UXの継続的な改善

---

## 📝 Blog

開発の過程をnoteで記録しています：  
→ [skyle開発記録](https://note.com/ryoko0655/m/ma478bfbd9c71)

---

## 📄 License

MIT

---

**Made with ☕ and a love for beautiful skies**
