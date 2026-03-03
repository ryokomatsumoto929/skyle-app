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

---

## 📌 Current Status

- 空の可視性判定のコア機能は実装済み
- 機能追加よりもUXの整理・簡潔化を優先中
- ウェルビーイング記録機能（形＋三日月サマリー）を設計中
- UX調整後にデプロイ予定

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
- React 18 + TypeScript
- Vite
- Material-UI (一部使用)
- Vanilla CSS（ガラスモーフィズム / グラデーション）

### Backend
- FastAPI (Python)
- PostgreSQL 15 (Docker)
- OpenWeatherMap API
- SunCalc / Astral

### Infra / Tools
- Docker Compose
- Git / GitHub

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
