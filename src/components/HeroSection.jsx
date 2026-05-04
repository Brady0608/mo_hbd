import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

/* 浮動粒子數據（固定，避免每次 render 重建） */
const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  delay: Math.random() * 6,
  dur: 5 + Math.random() * 5,
  size: 3 + Math.random() * 5,
  emoji: ['✦', '✧', '⋆', '✺', '◈'][Math.floor(Math.random() * 5)],
}))

const SPRING = { type: 'spring', stiffness: 420, damping: 18 }

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show:   (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.65, delay: i * 0.14, ease: [0.22, 1, 0.36, 1] },
  }),
}

function Particle({ x, delay, dur, size, emoji }) {
  return (
    <motion.span
      className="absolute pointer-events-none select-none"
      style={{ left: `${x}%`, bottom: '-2rem', fontSize: size, color: '#D4A373', opacity: 0 }}
      animate={{ y: [0, -window.innerHeight - 60], opacity: [0, 0.65, 0.35, 0], rotate: [0, 360] }}
      transition={{ duration: dur, delay, repeat: Infinity, ease: 'linear' }}
    >
      {emoji}
    </motion.span>
  )
}

export default function HeroSection() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <section
      id="hero"
      className="relative w-full min-h-screen flex flex-col items-center justify-center parchment-bg overflow-hidden"
    >
      {/* 浮動粒子 */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
        {mounted && PARTICLES.map(p => <Particle key={p.id} {...p} />)}
      </div>

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, transparent 38%, rgba(255,249,227,0.65) 100%)' }}
        aria-hidden
      />

      {/* 地圖角框裝飾 */}
      {['top-5 left-5', 'top-5 right-5', 'bottom-5 left-5', 'bottom-5 right-5'].map((pos, i) => (
        <div
          key={i}
          className={`absolute ${pos} w-10 h-10 pointer-events-none`}
          style={{
            borderColor: 'rgba(212,163,115,0.45)',
            borderStyle: 'solid',
            borderWidth: i < 2
              ? (i === 0 ? '2px 0 0 2px' : '2px 2px 0 0')
              : (i === 2 ? '0 0 2px 2px' : '0 2px 2px 0'),
          }}
          aria-hidden
        />
      ))}

      <div className="relative z-10 flex flex-col items-center text-center px-4 sm:px-8 w-full max-w-3xl">
        {/* RPG Badge */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}>
          <span className="rpg-badge">⚔️ Birthday Quest Unlocked</span>
        </motion.div>

        {/* 裝飾符文 */}
        <motion.div
          variants={fadeUp} initial="hidden" animate="show" custom={1}
          className="mt-5 mb-1 tracking-[0.55em] select-none"
          style={{ color: '#D4A373', fontSize: '1.1rem' }}
        >
          ✦ ✦ ✦
        </motion.div>

        {/* 主標題 */}
        <motion.h1
          variants={fadeUp} initial="hidden" animate="show" custom={2}
          className="font-rpg font-bold leading-tight"
          style={{ fontSize: 'clamp(2rem, 7vw, 4rem)' }}
        >
          <span className="shimmer-text">MOMO的冒險紀行</span>
        </motion.h1>

        {/* 英文副標 */}
        <motion.p
          variants={fadeUp} initial="hidden" animate="show" custom={3}
          className="mt-2 font-rpg tracking-widest text-sm sm:text-base"
          style={{ color: '#8A6940' }}
        >
          The Legend of MoMo · Chapter New
        </motion.p>

        {/* 分隔線 */}
        <motion.div
          variants={fadeUp} initial="hidden" animate="show" custom={4}
          className="ornament-divider w-full max-w-xs mt-6"
        >
          <span className="text-xs">◈</span>
        </motion.div>

        {/* 歡迎訊息 */}
        <motion.p
          variants={fadeUp} initial="hidden" animate="show" custom={5}
          className="mt-6 text-base sm:text-lg leading-relaxed max-w-md"
          style={{ color: '#4D3D2F' }}
        >
          親愛的 MoMo，<br />
          歡迎來到屬於你的回憶大陸。<br />
          <span className="font-semibold" style={{ color: '#8A6940' }}>
            翻開地圖，開始你的生日冒險吧。
          </span>
        </motion.p>

        {/* CTA 按鈕 */}
        <motion.div
          variants={fadeUp} initial="hidden" animate="show" custom={6}
          className="mt-10 flex flex-col sm:flex-row items-center gap-3"
        >
          {/* 主按鈕 — 遊戲立體感 */}
          <motion.button
            onClick={() => document.getElementById('adventure-map')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-game-primary"
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.94, y: 3, transition: SPRING }}
            transition={SPRING}
          >
            🗺️ 展開冒險地圖
          </motion.button>

          {/* 副按鈕 */}
          <motion.button
            onClick={() => document.getElementById('wishes-gacha')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-game-ghost"
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.94, y: 3, transition: SPRING }}
            transition={SPRING}
          >
            ✨ 抽取祝福扭蛋
          </motion.button>
        </motion.div>

        {/* 滾動提示 */}
        <motion.div
          variants={fadeUp} initial="hidden" animate="show" custom={7}
          className="mt-16 flex flex-col items-center gap-2 opacity-55"
          style={{ color: '#B88355' }}
        >
          <span className="text-xs tracking-widest font-rpg uppercase">Scroll Down</span>
          <div className="bounce-soft text-lg">⬇</div>
        </motion.div>
      </div>

      {/* 底部漸層淡出 */}
      <div
        className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, #FFF9E3)' }}
        aria-hidden
      />
    </section>
  )
}
