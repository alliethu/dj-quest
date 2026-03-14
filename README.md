# 🎧 DJ Quest

A kid-friendly DJ progression game built with React. Tap glowing beat pads, hype the crowd, earn badges, and work your way up from Bedroom DJ to Festival Champion!

**[▶️ Play Now](https://alliethu.github.io/dj-quest/)**

## 🎮 How to Play

1. Enter your DJ name
2. Pick a stage
3. When a pad lights up — **tap it!**
4. Hit enough beats to win the level and earn a badge
5. Miss too many and the crowd leaves 😴

Build combos for bonus crowd energy: **3x 🔥 → 5x 🔥🔥 → 7x+ 🔥🔥🔥**

## 🏟️ Levels

| # | Stage | Pads | Beats to Win | Badge |
|---|-------|------|:------------:|:-----:|
| 1 | Bedroom DJ 🛏️ | 2 | 10 | 🎧 |
| 2 | Backyard Party 🏡 | 3 | 14 | 🎵 |
| 3 | School Dance 🏫 | 3 | 18 | 🎶 |
| 4 | Block Party 🎪 | 4 | 22 | 🎤 |
| 5 | Festival Stage 🎤 | 4 | 26 | 👑 |

## 🎛️ Beat Maker

Create your own beats in free-play mode:

- **Tap** any of the 4 pads (KICK, SNARE, HI-HAT, FX) to jam freely
- **Record** a beat sequence with precise timing
- **Play back** your recordings with audio and visual highlights
- **Name & save** your beats — they persist across sessions
- **Share** beats via link — recipients auto-import them when they open the URL

## 🔊 Beat Pads

Each pad plays a unique synthesized tone via the Web Audio API — no audio files needed:

| Pad | Sound | Color |
|-----|-------|-------|
| 🥁 KICK | Deep bass drum | Pink |
| 👏 SNARE | Snappy snare hit | Yellow |
| 🎩 HI-HAT | Crisp hi-hat | Green |
| ✨ FX | Sweeping effect | Blue |

## 📱 Install on iPad / Phone

DJ Quest is a PWA (Progressive Web App). To add it to a home screen:

1. Open [alliethu.github.io/dj-quest](https://alliethu.github.io/dj-quest/) in **Safari**
2. Tap the **Share** button (↑)
3. Tap **Add to Home Screen**
4. It launches fullscreen like a native app — no browser chrome!

## 🛠️ Development

```bash
# Install dependencies
npm install

# Start dev server
npm start

# Production build
npm run build

# Deploy to GitHub Pages
npm run deploy
```

## 🧱 Tech Stack

- **React 19** — functional components + hooks
- **Web Audio API** — synthesized sounds, no external audio files
- **CSS-in-JS** — inline styles + CSS keyframe animations
- **localStorage** — persistent progress, badges, and saved beats
- **Service Worker** — offline-capable PWA
- **GitHub Pages** — hosted via `gh-pages`

## 📁 Project Structure

```
src/
├── App.js                        # Screen router + global state
├── styles.js                     # Color palette + shared styles
├── index.css                     # CSS reset + keyframe animations
├── data/
│   ├── levels.js                 # 5 level configurations
│   └── tips.js                   # DJ learning tips
├── hooks/
│   ├── useAudio.js               # Web Audio API sound synthesis
│   ├── useGame.js                # Game loop, scoring, combos
│   ├── useRecorder.js            # Beat recording with timing
│   └── useBeatPlayer.js          # Beat playback engine
└── components/
    ├── HomeScreen.js             # DJ name, level select, badges
    ├── PlayingScreen.js          # The beat pad game
    ├── WinScreen.js              # Badge earned celebration
    ├── FinalScreen.js            # Festival Champion finale
    ├── BeatMakerScreen.js        # Free-play + record/save/share
    ├── BeatPad.js                # Glowing circular pad
    └── CrowdEnergyBar.js         # Energy bar with emoji labels
```
