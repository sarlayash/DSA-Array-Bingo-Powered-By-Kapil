# 🎬 SarlaYash Productions Presents
# 🎮 DSA Array Bingo — Powered By Kapil

An online multiplayer and single-player **Tambola / Bingo 90** platform fused with **90 LeetCode Array Problems & DSA Concepts**!

---

## ⚡ New Features & Capabilities

- 🎬 **Official Branding**:
  - **SarlaYash Productions presents DSA Array Bingo — Powered By Kapil**
  - High-energy arcade cyberpunk visual styling, glowing HUD, and animated number ball.
- 🤖 **Single Player Mode vs Inbuilt AI Bots**:
  - Play anytime solo against smart AI bots (`🤖 ByteBot`, `⚡ AlgoTron`, `🧙 PointerMage`).
  - Select bot count (1 to 3 bots) and challenge difficulty (Casual, Competitive, Turbo).
  - Bots receive authentic tickets, daub called numbers, and compete for winning claims!
- 🗣️ **Voice Caller for Numbers & Winners**:
  - Web Speech synthesis announces both drawn numbers and winning claims!
  - Announces: **Rows** (Top Row, Middle Row, Bottom Row), **Corners** (Four Corners), **Early 5**, and **Full House**!
- 📜 **Official Certificates & Badges (PNG & PDF)**:
  - Every winner earns an **Achievement Badge** and an official **Certificate of Algorithmic Excellence**.
  - **Pristine Export**: Download in **High-Resolution PNG** and **Vector PDF** with zero text overlapping, zero cropping, golden rosette seals, and verification IDs!
- 🕹️ **Zero Sign-Ups / Instant Play**:
  - Play on phone, tablet, and laptop immediately. Just enter your nickname and choose your avatar!
- 🎟️ **Authentic 3×9 Tambola Tickets**:
  - Mathematically generated authentic 90-ball Tambola tickets (3 rows × 9 columns, strictly 5 numbers per row, column-sorted).
  - Players can choose 1, 2, or 3 tickets from the 60-ticket room deck or click **"🎲 Auto-Pick Random"**.
  - Interactive daubing with tactile haptic vibration (on phones), sounds, and auto-daub option.
- 🧠 **90 DSA Array Problems & Fun Facts**:
  - Every called number (1 to 90) spotlights a famous LeetCode problem, algorithm pattern, or memory trick!
  - Features classics like **Two Sum (LC #1)**, **Two Pointers**, **Dutch National Flag (LC #75)**, **Kadane's Algorithm**, **Trapping Rain Water (LC #42)**, **Sliding Window**, **Monotonic Stack**, and **L1/L2 CPU Cache Locality**.
  - Accessible in real-time in the HUD and via the **📚 DSA Array Codex** vault.
- 🔊 **Arcade Synthesizer SFX & Confetti**:
  - Web Audio API synthesizer for retro chimes, coin pops, power-ups, victory fanfares, and bogey buzzers (100% offline, zero external sound files).
  - SpeechSynthesis voice caller announcing the number and problem title!
  - Multi-blast celebratory fireworks and confetti using `canvas-confetti`.
- 🏆 **Authoritative Anti-Cheat Verification**:
  - Standard winning categories: **Early 5 (Jaldi 5)**, **Top Line (Row 0)**, **Middle Line (Row 1)**, **Bottom Line (Row 2)**, **Four Corners**, **Full House (1st Housie)**, and **2nd Full House**.
  - Server automatically checks claims against actual called numbers to prevent false / bogey claims with retro screen-shake alerts!
- 📱 **Installable PWA (Web & Phone App)**:
  - Works as a native-like app on Android Chrome, Windows/Mac PC, and iOS Safari ("Add to Home Screen").

---

## 🚀 Quick Start

### 1. Install & Run
```bash
cd C:\Users\LC\.gemini\antigravity\scratch\dsa-tambola
npm start
```

### 2. Accessing the Game
- **On Laptop / PC**: Open [http://localhost:3000](http://localhost:3000)
- **On Mobile Phones (same Wi-Fi)**: Open `http://<your-computer-ip>:3000` (e.g. `http://192.168.29.36:3000`)

---

## 🎮 How to Play

1. **Host a Game**:
   - Click **"Create Game Room"**.
   - Share the generated Room Code (e.g., `ARRAY-454`) or direct link (`http://<ip>:3000/?room=ARRAY-454`) with friends.
2. **Join a Game**:
   - Enter your nickname, pick an avatar, and paste the Room Code.
3. **Select Tickets**:
   - In the lobby, browse the tickets or click **"Auto-Pick Random"** (choose 1, 2, or 3 tickets).
4. **Play the Arena**:
   - Host clicks **"Launch Game Arena"**.
   - Host draws numbers manually (or toggles **⚡ Auto-Caller** with speed control).
   - As numbers are called, tap your ticket cells to daub them!
   - When you qualify for a prize (e.g. 5 numbers marked or a completed row), hit the glowing **Claim** button to celebrate with confetti and fanfare!

---

## 📂 Project Structure

```
dsa-tambola/
├── server.js               # Express + Socket.IO server (Multiplayer rooms & claim validator)
├── package.json            # Node.js dependencies
├── generate-icons.js       # PWA icon generator
├── test-gameplay.js        # Automated end-to-end integration test
└── public/
    ├── index.html          # Video game HUD, lobby, ticket arena, master board & modals
    ├── manifest.json       # Progressive Web App manifest
    ├── sw.js               # PWA offline service worker
    ├── css/
    │   └── style.css       # Arcade neon cyberpunk responsive theme
    ├── js/
    │   ├── dsa-facts.js    # 90 DSA Array Problems & LeetCode concepts database
    │   ├── tickets.js      # Authentic Tambola ticket generator & claim rules
    │   ├── audio.js        # Web Audio API arcade synthesizer & voice caller
    │   ├── confetti.js     # High-performance canvas confetti launcher
    │   └── app.js          # Socket.io multiplayer orchestration & UI interactions
    └── icons/
        ├── icon.svg        # Scalable vector game icon
        ├── icon-192.png    # PWA 192x192 icon
        └── icon-512.png    # PWA 512x512 icon
```
