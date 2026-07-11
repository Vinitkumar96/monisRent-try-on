# Monis Rent Bali - Interactive Workspace Designer

<img width="1600" height="804" alt="image" src="https://github.com/user-attachments/assets/62868baf-4155-4b5b-ad96-cf555c02b34a" />


A modern, highly interactive, and visually immersive workspace configurator built for digital nomads and startups moving to Bali. Designed to showcase a premium, tactile, and gamified experience where users can live-preview their custom desks, chairs, accessories, and hobby zones before renting them.

## 🌴 Deployed Application

- **Live URL**: *(Deployable immediately via Vercel - see instructions below)*

---

## ✨ Features

- **2.5D Real-Time Visualizer Canvas**: Custom-styled components rendering desks (Bali Bamboo, Ubud Teak, Canggu Minimalist), seating (ErgoNomad, Seminyak Leather, Uluwatu Active Stool), and multiple accessories (curved ultrawide monitor, ring lights, Monstera plant, speakers, wireless mechanical keyboard).
- **Smooth Micro-Animations**: Interactive transitions powered by `framer-motion` for fluid component swap triggers (e.g. items drop or slide onto the desk in real-time).
- **Procedural Soundscapes (No download latency)**: Built-in ambient room console powered by the browser's Web Audio API generating procedural synthesizers for lo-fi music beats, local rainforest rainfall, and coast-sweeping waves.
- **Bali-Specific Booking Checkout**: Complete contact, delivery location selector (Canggu, Ubud, Seminyak, Uluwatu, etc.), desired date, and setup instructions.
- **Checkout Celebration**: Integrated confetti explosion wizard (`canvas-confetti`) on order placement success.

---

## 🛠️ Tech Stack & Choices

1. **Next.js 14/15 App Router & TypeScript**: Fast rendering, page optimization, type-safe development.
2. **Tailwind CSS (v4)**: Modern, class-based utilities for responsive layouts and color themes (custom dark/zinc mode with emerald forest accents).
3. **Framer Motion**: State transitions and physical feedback for visual component placement.
4. **Web Audio API**: Real-time noise oscillators and filters for fully customizable lofi room atmospheres, loaded zero-dependency and 100% offline.
5. **Canvas Confetti**: High-performance canvas-based particle simulation for the completion celebration.

---

## 📦 How to Run Locally

1. Clone this repository:
   ```bash
   git clone <your-repo-url>
   cd rent-vinit
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 🚀 Deployed on Vercel

The project is optimized for deployment on Vercel. 
To deploy:
1. Push this folder to a GitHub repository.
2. Go to [Vercel](https://vercel.com) -> Add New Project -> Import your repo.
3. Keep default settings and click **Deploy**.

---

## 💭 Approach & Future Improvements

### Approach
I took a developer-designer perspective. Instead of listing boring dropdown tables or embedding heavy 3D files that lag on mobile devices, I built a fast, lightweight 2.5D visual preview layered using optimized HTML/CSS/SVG groups. This guarantees 60fps animations even on mobile devices. Adding the procedural lofi ambient soundtrack replicates the authentic Bali digital nomad lifestyle, keeping users engaged longer.


