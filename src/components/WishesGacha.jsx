import { useRef, useState, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Lock, Play, X, Key } from 'lucide-react'
import { ALL_WISHES as WISHES_DATA } from '../data/wishes'
import { RARITY_DISPLAY } from '../data/config'
import { detectMediaType } from '../utils/media'
import { drawRarity } from '../utils/gacha'

/* ─── 設計 Token ──────────────────────────────────────────────────────────── */
const C = {
  leather:     '#D4A373',
  leatherDark: '#B88355',
  leatherDeep: '#8A6940',
  leatherLite: '#ECC98A',
  forest:      '#7A918D',
  forestDark:  '#5A716D',
  ink:         '#3D3027',
  inkMid:      '#4D3D2F',
  rose:        '#D9947E',
  dawn:        '#FFF9E3',
}

const SPRING = { type: 'spring', stiffness: 440, damping: 18 }

/* ─── 資料來自 src/data/wishes.js（在那裡新增好友）─────────────────────── */
const ALL_WISHES = WISHES_DATA

/* 稀有度顯示設定 → 來自 src/data/config.js，可在那裡統一調整 */
const RARITY_CFG = RARITY_DISPLAY

const DOME_DOTS = [[24,32],[56,18],[80,38],[14,58],[50,60],[83,62],[32,80],[66,77]]
const DOME_COLS = [C.forest, C.leather, C.rose, '#9B7FD4', '#6A8FC2', C.leatherLite, C.leatherDark, '#C4848E']

/* ─── CapsuleDisplay ──────────────────────────────────────────────────────── */
function CapsuleDisplay({ phase, pick }) {
  if (phase === 'idle')
    return <span className="text-3xl select-none">🎊</span>
  if (phase === 'shaking')
    return (
      <motion.span className="text-3xl select-none"
        animate={{ rotate: [-12, 12, -10, 10, -6, 6, 0] }}
        transition={{ duration: 0.6 }}>🌀</motion.span>
    )
  if (phase === 'dropping')
    return (
      <motion.div
        className="w-11 h-11 rounded-full"
        style={{
          background: `linear-gradient(145deg, ${pick?.color ?? C.leather}99, ${pick?.color ?? C.leather})`,
          boxShadow: `0 0 18px ${pick?.color ?? C.leather}66`,
        }}
        initial={{ y: -52, scale: 0.32, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 16 }}
      />
    )
  if (phase === 'opening')
    return (
      <motion.div
        className="w-11 h-11 rounded-full flex items-center justify-center text-xl"
        style={{ background: `linear-gradient(145deg, ${pick?.color ?? C.leather}99, ${pick?.color ?? C.leather})` }}
        animate={{ scale: [1, 1.55, 0.1], rotate: [0, 25, -25, 0], opacity: [1, 1, 0] }}
        transition={{ duration: 0.48 }}
      >
        {pick?.emoji}
      </motion.div>
    )
  return null
}

/* ─── GachaMachine ────────────────────────────────────────────────────────── */
function GachaMachine({ remaining, phase, pick, onPull }) {
  const allDone = remaining === 0

  return (
    <motion.div
      className="flex flex-col items-center select-none"
      animate={phase === 'shaking'
        ? { x: [-4,4,-7,7,-4,4,-2,2,0], rotate: [-1.2,1.2,-1.8,1.8,-1.2,1.2,-0.6,0.6,0] }
        : {}}
      transition={{ duration: 0.65 }}
    >
      {/* 玻璃圓頂 */}
      <div
        className="relative w-40 h-40 rounded-full overflow-hidden"
        style={{
          background: 'rgba(255,252,235,0.58)',
          border: `2.5px solid ${C.leather}45`,
          boxShadow: `0 4px 24px ${C.leather}18, inset 0 1px 0 rgba(255,255,255,0.72)`,
        }}
      >
        {/* 高光 */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 35% 28%, rgba(255,255,255,0.48), transparent 58%)' }} />

        {/* 小膠囊點 */}
        {Array.from({ length: Math.min(remaining, 8) }, (_, i) => (
          <motion.div key={i}
            className="absolute rounded-full"
            style={{
              left: `${DOME_DOTS[i][0]}%`, top: `${DOME_DOTS[i][1]}%`,
              width: 12, height: 12, background: DOME_COLS[i],
              transform: 'translate(-50%,-50%)', opacity: 0.72,
            }}
            animate={phase === 'shaking'
              ? { y: [0,-5,3,-2,0], x: [0,2,-2,1,0] }
              : {}}
            transition={{ duration: 0.5, delay: i * 0.04 }}
          />
        ))}

        <div className="absolute inset-0 flex items-center justify-center">
          {allDone
            ? <motion.span className="text-3xl" animate={{ rotate: [0,10,-10,0] }} transition={{ duration: 2, repeat: Infinity }}>✨</motion.span>
            : <span className="font-rpg text-2xl font-bold opacity-55" style={{ color: C.leatherDeep }}>{remaining}</span>
          }
        </div>
      </div>

      {/* 頸管 */}
      <div className="w-14 h-3"
        style={{ background: `linear-gradient(to bottom, ${C.leather}45, ${C.leather}28)`, borderRadius: '0 0 6px 6px' }} />

      {/* 機器本體 */}
      <div className="w-52 rounded-2xl overflow-hidden"
        style={{
          background: 'rgba(255,252,235,0.85)',
          border: `1.5px solid ${C.leather}32`,
          outline: `1px dashed ${C.leather}18`, outlineOffset: '-5px',
          boxShadow: `0 4px 24px rgba(61,48,39,0.10), 0 2px 0 ${C.leatherDark}22, inset 0 1px 0 rgba(255,255,255,0.62)`,
        }}
      >
        {/* 品牌帶 */}
        <div className="py-2 text-center" style={{ background: `linear-gradient(135deg, ${C.leather}22, ${C.leather}12)` }}>
          <p className="font-rpg text-[10px] tracking-[0.20em] font-semibold" style={{ color: C.leatherDeep }}>
            ✦ BIRTHDAY GACHA ✦
          </p>
        </div>

        {/* 顯示窗 */}
        <div className="px-4 pt-4">
          <div className="h-16 rounded-xl flex items-center justify-center"
            style={{
              background: 'rgba(255,249,227,0.92)',
              border: `1.5px solid ${C.leather}2A`,
              boxShadow: 'inset 0 2px 6px rgba(61,48,39,0.06)',
            }}>
            <CapsuleDisplay phase={phase} pick={pick} />
          </div>
        </div>

        <p className="text-center text-[10px] font-rpg opacity-60 mt-2" style={{ color: C.leatherDeep }}>
          {allDone ? 'All Wishes Unlocked ✦' : `還有 ${remaining} 位好友等待解鎖`}
        </p>

        {/* 抽取按鈕 */}
        <div className="px-4 pb-4 mt-3">
          <motion.button
            onClick={onPull}
            disabled={phase !== 'idle' || allDone}
            className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-150 ${
              phase === 'idle' && !allDone ? 'btn-game-primary' : ''
            }`}
            style={phase !== 'idle' || allDone
              ? { background: `${C.leather}28`, color: C.leatherDeep, cursor: 'not-allowed', borderRadius: '0.75rem', padding: '0.75rem' }
              : undefined}
            whileHover={phase === 'idle' && !allDone ? { scale: 1.03, y: -2 } : {}}
            whileTap={phase === 'idle' && !allDone ? { scale: 0.93, y: 3, transition: SPRING } : {}}
            transition={SPRING}
          >
            {phase === 'shaking' ? '✦ 搖動中…'
             : phase === 'dropping' || phase === 'opening' ? '✦ 抽取中…'
             : allDone ? '✦ 全部解鎖！'
             : '✦ 抽取祝福 ✦'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

/* ─── WishCard ────────────────────────────────────────────────────────────── */
function WishCard({ wish, isUnlocked, assignedRarity, onClick }) {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-20px' })
  const [sparkle, setSparkle] = useState(false)
  const prev = useRef(isUnlocked)
  // assignedRarity 由抽籤時決定；未解鎖時 cfg 不影響顯示
  const cfg  = RARITY_CFG[assignedRarity ?? 'R'] ?? RARITY_CFG.R

  useEffect(() => {
    if (!prev.current && isUnlocked) {
      setSparkle(true)
      const t = setTimeout(() => setSparkle(false), 1800)
      return () => clearTimeout(t)
    }
    prev.current = isUnlocked
  }, [isUnlocked])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 14 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.42 }}
      whileHover={isUnlocked ? { scale: 1.07, y: -3 } : {}}
      whileTap={isUnlocked ? { scale: 0.93, y: 1, transition: SPRING } : {}}
      onClick={() => isUnlocked && onClick({ ...wish, assignedRarity })}
      className="relative rounded-2xl overflow-hidden"
      style={{
        border: isUnlocked ? `2px solid ${cfg.border}` : '2px solid rgba(160,145,130,0.22)',
        boxShadow: isUnlocked ? `0 4px 0 ${cfg.border}30, 0 6px 18px ${cfg.glow}` : 'none',
        cursor: isUnlocked ? 'pointer' : 'default',
      }}
    >
      <div
        className="p-3 flex flex-col items-center gap-1.5"
        style={{
          background: isUnlocked ? `linear-gradient(160deg, ${wish.color}12, ${wish.color}28)` : 'rgba(200,190,175,0.10)',
          filter: isUnlocked ? 'none' : 'grayscale(1)',
          opacity: isUnlocked ? 1 : 0.42,
        }}
      >
        {/* 頭像：有 avatar 照片優先，否則用 emoji */}
        <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center text-2xl flex-shrink-0"
          style={{ background: isUnlocked ? `${wish.color}30` : 'rgba(180,165,145,0.2)' }}>
          {isUnlocked
            ? wish.avatar
              ? <img src={wish.avatar} alt={wish.name} className="w-full h-full object-cover" />
              : wish.emoji
            : <Lock size={15} className="opacity-65" />
          }
        </div>
        <p className="text-xs font-medium text-center leading-tight" style={{ color: C.ink }}>{wish.name}</p>
        {isUnlocked && assignedRarity && (
          <span className={`text-[9px] font-rpg font-bold px-1.5 py-0.5 rounded-full ${cfg.badge}`}>
            {assignedRarity}
          </span>
        )}
      </div>

      {/* 解鎖 sparkle */}
      <AnimatePresence>
        {sparkle && (
          <motion.div key="sp" className="absolute inset-0 pointer-events-none rounded-2xl"
            initial={{ opacity: 0.9 }} animate={{ opacity: 0 }} exit={{ opacity: 0 }} transition={{ duration: 1.6 }}
            style={{ background: `radial-gradient(circle at 50% 50%, ${wish.color}70, transparent 62%)` }} />
        )}
      </AnimatePresence>

      {/* Hover 提示：依媒體類型顯示不同標籤 */}
      {isUnlocked && (
        <div className="absolute bottom-0 left-0 right-0 py-0.5 flex items-center justify-center gap-1
          opacity-0 hover:opacity-100 transition-opacity"
          style={{ background: `${wish.color}55`, backdropFilter: 'blur(4px)' }}>
          {(() => {
            const t = detectMediaType(wish.media ?? wish.video ?? null)
            return t === 'audio'
              ? <><span className="text-[8px]">🎵</span><span className="text-[8px] font-rpg font-bold">聆聽</span></>
              : t !== 'none'
                ? <><Play size={9} /><span className="text-[8px] font-rpg font-bold">觀看</span></>
                : <span className="text-[8px] font-rpg font-bold">閱讀</span>
          })()}
        </div>
      )}
    </motion.div>
  )
}

/* ─── 自訂音訊播放器 ──────────────────────────────────────────────────────── */
function AudioPlayer({ src, color, emoji, avatar }) {
  const audioRef = useRef(null)
  const [playing,  setPlaying]  = useState(false)
  const [progress, setProgress] = useState(0)
  const [current,  setCurrent]  = useState(0)
  const [duration, setDuration] = useState(0)

  const fmt = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`

  const toggle = () => {
    if (!audioRef.current) return
    playing ? audioRef.current.pause() : audioRef.current.play()
    setPlaying(p => !p)
  }

  const seek = e => {
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    if (audioRef.current) {
      audioRef.current.currentTime = ratio * audioRef.current.duration
      setProgress(ratio)
    }
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4 px-5 py-6">
      {/* 頭像 / emoji */}
      {avatar
        ? <img src={avatar} alt="" className="w-20 h-20 rounded-full object-cover border-4"
            style={{ borderColor: `${color}60` }} />
        : <span className="text-6xl select-none">{emoji}</span>
      }

      {/* 聲波動畫（播放中才跳動） */}
      <div className="flex items-end gap-1" style={{ height: 28 }}>
        {[0.6, 1, 0.75, 1, 0.55, 1, 0.7].map((h, i) => (
          <motion.div key={i}
            className="w-1.5 rounded-full"
            style={{ background: color, originY: 1 }}
            animate={playing
              ? { scaleY: [h, 1, 0.4, 1, h], opacity: [0.7, 1, 0.6, 1, 0.7] }
              : { scaleY: 0.25, opacity: 0.35 }}
            transition={{ duration: 0.7, delay: i * 0.09, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </div>

      {/* 進度條 */}
      <div className="w-full flex flex-col gap-1.5">
        <div
          className="w-full h-2 rounded-full cursor-pointer overflow-hidden"
          style={{ background: `${color}25` }}
          onClick={seek}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg, ${color}99, ${color})`, width: `${progress * 100}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] font-rpg opacity-55" style={{ color }}>
          <span>{fmt(current)}</span>
          <span>{duration ? fmt(duration) : '--:--'}</span>
        </div>
      </div>

      {/* 播放 / 暫停按鈕 */}
      <motion.button
        onClick={toggle}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.90, transition: { type: 'spring', stiffness: 500, damping: 15 } }}
        className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg shadow-md"
        style={{
          background: `linear-gradient(145deg, ${color}cc, ${color})`,
          boxShadow: `0 4px 0 ${color}55, 0 6px 14px ${color}35`,
        }}
      >
        {playing ? '⏸' : '▶'}
      </motion.button>

      {/* 隱藏的 audio 元素 */}
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={() => {
          if (!audioRef.current) return
          setCurrent(audioRef.current.currentTime)
          setProgress(audioRef.current.currentTime / (audioRef.current.duration || 1))
        }}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration ?? 0)}
        onEnded={() => { setPlaying(false); setProgress(0); setCurrent(0) }}
      />
    </div>
  )
}

/* ─── WishRevealModal ─────────────────────────────────────────────────────── */
function WishRevealModal({ wish, isNew, onClose }) {
  const cfg = wish ? (RARITY_CFG[wish.assignedRarity ?? 'R'] ?? RARITY_CFG.R) : null
  const [mediaReady, setMediaReady] = useState(false)
  // 為了向下相容，同時支援舊的 video 欄位
  const media     = wish?.media ?? wish?.video ?? null
  const mediaType = wish ? detectMediaType(media) : 'none'
  useEffect(() => { if (wish) setMediaReady(false) }, [wish?.id])

  // assignedRarity 由 currentPick 或 gallery 點擊傳入
  const rarity = wish?.assignedRarity ?? 'R'
  // 把原本的 videoReady 換名
  const videoReady  = mediaReady
  const setVideoReady = setMediaReady

  return (
    <AnimatePresence>
      {wish && (
        <>
          <motion.div key="bd" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-[100] bg-[rgba(42,32,18,0.72)] backdrop-blur-[6px]"
            onClick={onClose} />

          <motion.div key="card" initial={{ opacity: 0, scale: 0.86, y: 28 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 14 }}
            transition={SPRING}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="w-full max-w-sm overflow-hidden pointer-events-auto"
              style={{
                background: 'rgba(255,252,235,0.94)',
                backdropFilter: 'blur(18px)',
                border: `2px solid ${cfg.border}`,
                borderRadius: '1.5rem',
                outline: `1px dashed ${cfg.border}25`, outlineOffset: '-6px',
                boxShadow: `0 8px 40px ${cfg.glow}, 0 4px 0 ${cfg.border}35, 0 8px 16px rgba(61,48,39,0.14)`,
              }}
              onClick={e => e.stopPropagation()}
            >
              {/* ── 媒體區域 ── */}
              <div
                className="relative overflow-hidden"
                style={{
                  height: mediaType === 'audio' ? 260 : videoReady ? 220 : 200,
                  background: `linear-gradient(145deg, ${wish.color}18, ${wish.color}42)`,
                  transition: 'height 0.3s ease',
                }}
              >
                <div className="absolute inset-0 pointer-events-none"
                  style={{ background: `radial-gradient(circle at 40% 35%, ${wish.color}28, transparent 62%)` }} />

                {/* 錄音播放器（audio 類型直接顯示，不需點擊解鎖） */}
                {mediaType === 'audio' && (
                  <AudioPlayer src={media} color={wish.color} emoji={wish.emoji} avatar={wish.avatar} />
                )}

                {/* YouTube iframe */}
                {mediaType === 'youtube' && videoReady && (
                  <iframe src={`${media}?autoplay=1`}
                    className="absolute inset-0 w-full h-full"
                    allow="autoplay; encrypted-media" allowFullScreen title={`${wish.name}的祝福`} />
                )}

                {/* 本地影片 */}
                {mediaType === 'video' && videoReady && (
                  <video src={media} className="absolute inset-0 w-full h-full object-cover"
                    autoPlay controls playsInline />
                )}

                {/* 占位圖（youtube / video 未播放 / 無媒體） */}
                {mediaType !== 'audio' && !videoReady && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                    {wish.avatar
                      ? <img src={wish.avatar} alt={wish.name}
                          className="w-24 h-24 rounded-full object-cover border-4"
                          style={{ borderColor: `${wish.color}60` }} />
                      : isNew
                        ? <motion.span className="text-7xl"
                            initial={{ scale: 0.3, rotate: -20 }} animate={{ scale: 1, rotate: 0 }}
                            transition={{ ...SPRING, delay: 0.08 }}>{wish.emoji}</motion.span>
                        : <span className="text-7xl">{wish.emoji}</span>
                    }
                    {(mediaType === 'youtube' || mediaType === 'video') ? (
                      <motion.button
                        onClick={() => setVideoReady(true)}
                        className="btn-game-ghost flex items-center gap-2 text-sm py-2 px-5"
                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.94, y: 2, transition: SPRING }}
                        transition={SPRING}
                      >
                        <Play size={13} />播放祝福影片
                      </motion.button>
                    ) : (
                      <span className="text-[11px] font-rpg opacity-40" style={{ color: wish.color }}>
                        [ 純文字祝福 ]
                      </span>
                    )}
                  </div>
                )}

                {/* 稀有度 badge（新解鎖時） */}
                {isNew && (
                  <motion.div initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
                    className="absolute top-3 left-3">
                    <span className={`text-[10px] font-rpg font-bold px-2 py-1 rounded-full ${cfg.badge}`}
                      style={{ border: `1px solid ${cfg.border}` }}>
                      {wish.assignedRarity ?? 'R'} Unlocked!
                    </span>
                  </motion.div>
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-rpg font-bold text-lg" style={{ color: C.ink }}>{wish.name}</span>
                  <span className="text-xs opacity-55" style={{ color: C.inkMid }}>· {wish.from}</span>
                </div>
                <div className="ornament-divider my-3">
                  <span className="text-[8px]" style={{ color: cfg.border }}>✦</span>
                </div>
                <blockquote className="text-sm leading-relaxed italic pl-3"
                  style={{ borderLeft: `2.5px solid ${cfg.border}`, color: C.inkMid }}>
                  「{wish.message}」
                </blockquote>
                <motion.button
                  onClick={onClose}
                  className="mt-5 w-full btn-game-primary"
                  style={{ background: `linear-gradient(to bottom, ${wish.color}cc, ${wish.color})`,
                    boxShadow: `0 4px 0 ${wish.color}55, 0 6px 16px ${cfg.glow}` }}
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.95, y: 3, transition: SPRING }}
                  transition={SPRING}
                >
                  {isNew ? '✦ 好感動！繼續抽 ✦' : '✦ 關閉 ✦'}
                </motion.button>
              </div>

              <motion.button onClick={onClose}
                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.88, transition: SPRING }}
                className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center
                  border hover:bg-[rgba(212,163,115,0.18)] transition-colors"
                style={{ background: 'rgba(255,252,235,0.80)', backdropFilter: 'blur(8px)', borderColor: `${C.leather}35` }}>
                <X size={13} style={{ color: C.inkMid }} />
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

/* ─── WishesGacha (main) ──────────────────────────────────────────────────── */
export default function WishesGacha() {
  const titleRef  = useRef(null)
  const titleInView = useInView(titleRef, { once: true, margin: '-40px' })

  // unlockedMap: { [wishId]: assignedRarity } — 同時記錄「已解鎖」和「當次抽到的稀有度」
  const [unlockedMap,  setUnlockedMap]  = useState({})
  const [pullPhase,    setPullPhase]    = useState('idle')
  const [currentPick,  setCurrentPick]  = useState(null)  // 含 assignedRarity
  const [revealWish,   setRevealWish]   = useState(null)  // 含 assignedRarity
  const [isNewReveal,  setIsNewReveal]  = useState(false)

  const available   = ALL_WISHES.filter(w => !(w.id in unlockedMap))
  const unlockedCnt = Object.keys(unlockedMap).length
  const allUnlocked = unlockedCnt === ALL_WISHES.length

  useEffect(() => {
    let t
    if (pullPhase === 'shaking')  t = setTimeout(() => setPullPhase('dropping'), 700)
    if (pullPhase === 'dropping') t = setTimeout(() => setPullPhase('opening'),  900)
    if (pullPhase === 'opening')  t = setTimeout(() => {
      if (currentPick) {
        setUnlockedMap(prev => ({ ...prev, [currentPick.id]: currentPick.assignedRarity }))
        setRevealWish(currentPick)
        setIsNewReveal(true)
      }
      setPullPhase('idle')
    }, 480)
    return () => clearTimeout(t)
  }, [pullPhase, currentPick])

  const handlePull = () => {
    if (pullPhase !== 'idle' || available.length === 0) return
    const wish   = available[Math.floor(Math.random() * available.length)]
    const rarity = drawRarity(wish.forceRarity)       // ← 抽籤決定稀有度
    setCurrentPick({ ...wish, assignedRarity: rarity })
    setPullPhase('shaking')
  }

  const handleUnlockAll = () => {
    const all = {}
    ALL_WISHES.forEach(w => {
      // 已解鎖的保留原稀有度，未解鎖的現在抽籤
      all[w.id] = unlockedMap[w.id] ?? drawRarity(w.forceRarity)
    })
    setUnlockedMap(all)
  }

  return (
    <section
      id="wishes-gacha"
      className="relative w-full py-20 sm:py-28 overflow-hidden flex flex-col items-center"
      style={{ background: `linear-gradient(180deg, #F5EDD4 0%, #EDE0C4 50%, #F5EDD4 100%)` }}
    >
      {/* 背景裝飾 */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.025]" aria-hidden>
        <div className="absolute top-20 right-20 font-rpg select-none rotate-12" style={{ fontSize: '13rem', color: C.leather }}>✺</div>
        <div className="absolute bottom-20 left-14 font-rpg select-none -rotate-12" style={{ fontSize: '9rem', color: C.rose }}>❋</div>
      </div>

      {/* Section Header */}
      <motion.div ref={titleRef}
        initial={{ opacity: 0, y: 24 }} animate={titleInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        className="w-full max-w-2xl px-4 sm:px-8 text-center mb-12 sm:mb-16"
      >
        <span className="rpg-badge">Chapter III</span>
        <h2 className="font-rpg font-bold mt-4 shimmer-text leading-tight text-center w-full block"
          style={{ fontSize: 'clamp(1.75rem, 5vw, 3rem)' }}>
          Wishes Gacha
        </h2>
        <p className="font-rpg tracking-widest text-sm mt-1" style={{ color: C.leatherDeep }}>
          祝 福 扭 蛋 機
        </p>
        <div className="ornament-divider max-w-xs mt-5" style={{ margin: '1.25rem auto 0' }}>
          <span className="text-xs" style={{ color: C.leather }}>✦</span>
        </div>
        <p className="mt-4 text-sm sm:text-base opacity-75 max-w-md leading-relaxed"
          style={{ margin: '1rem auto 0', color: C.inkMid }}>
          每位好友都帶來了珍稀祝福。<br />轉動扭蛋，一一解鎖他們的心意。
        </p>
      </motion.div>

      {/* Main layout */}
      <div className="w-full max-w-5xl px-4 sm:px-8">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 items-start justify-center">

          {/* 左：扭蛋機 */}
          <motion.div initial={{ opacity: 0, x: -28 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="flex flex-col items-center w-full lg:w-auto">
            <GachaMachine remaining={available.length} phase={pullPhase} pick={currentPick} onPull={handlePull} />
            {unlockedCnt > 0 && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="mt-4 text-xs font-rpg tracking-wider text-center" style={{ color: C.leatherDeep }}>
                已解鎖 {unlockedCnt} / {ALL_WISHES.length} 個祝福
              </motion.p>
            )}
          </motion.div>

          {/* 右：Gallery */}
          <motion.div initial={{ opacity: 0, x: 28 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}
            className="flex-1 w-full">

            {/* Gallery header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-rpg text-sm tracking-widest" style={{ color: C.leatherDeep }}>✦ 祝福清單</h3>
                <p className="text-[10px] opacity-60 mt-0.5 font-rpg" style={{ color: C.inkMid }}>
                  {unlockedCnt} / {ALL_WISHES.length} 已解鎖 · 點擊已解鎖卡片可重播
                </p>
              </div>
              {!allUnlocked && (
                <motion.button
                  onClick={handleUnlockAll}
                  initial={{ opacity: 0.32 }} animate={{ opacity: 0.32 }}
                  whileHover={{ scale: 1.08, opacity: 1 }}
                  whileTap={{ scale: 0.94, transition: SPRING }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-rpg text-[10px] tracking-wider transition-colors"
                  style={{ border: `1px dashed ${C.leather}55`, background: `${C.leather}08`, color: C.leatherDeep }}
                  title="一鍵解鎖全部（全覽模式）"
                >
                  <Key size={11} />全覽
                </motion.button>
              )}
            </div>

            {/* 卡片網格 */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 sm:gap-3">
              {ALL_WISHES.map((wish, i) => (
                <motion.div key={wish.id}
                  initial={{ opacity: 0, scale: 0.84 }} whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }} transition={{ duration: 0.38, delay: i * 0.06 }}>
                  <WishCard
                    wish={wish}
                    isUnlocked={wish.id in unlockedMap}
                    assignedRarity={unlockedMap[wish.id]}
                    onClick={w => { setRevealWish(w); setIsNewReveal(false) }}
                  />
                </motion.div>
              ))}
            </div>

            <AnimatePresence>
              {allUnlocked && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="mt-5 text-center">
                  <div className="inline-block px-5 py-2.5 rounded-full font-rpg text-sm"
                    style={{ background: `${C.leather}18`, border: `1.5px solid ${C.leather}45`, color: C.leatherDeep }}>
                    ✦ 所有祝福已解鎖！感謝大家的愛 ✦
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      <WishRevealModal wish={revealWish} isNew={isNewReveal} onClose={() => setRevealWish(null)} />
    </section>
  )
}
