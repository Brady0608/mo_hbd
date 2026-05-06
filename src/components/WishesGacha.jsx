import { useRef, useState, useEffect, useCallback, useMemo } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Lock, Play, X, Key, Info } from 'lucide-react'
import { ALL_WISHES as WISHES_DATA } from '../data/wishes'
import { RARITY_DISPLAY, RARITY_RATES, POOL_INFO } from '../data/config'
import { detectMediaType } from '../utils/media'
import { useGachaSystem } from '../hooks/useGachaSystem'
import GachaAnimation from './GachaAnimation'

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

/* ─── (CapsuleDisplay & GachaMachine removed — replaced by GachaAnimation) ── */

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
            className="fixed inset-0 z-[300] bg-[rgba(42,32,18,0.72)] backdrop-blur-[6px]"
            onClick={onClose} />

          <motion.div key="card" initial={{ opacity: 0, scale: 0.86, y: 28 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 14 }}
            transition={SPRING}
            className="fixed inset-0 z-[301] flex items-center justify-center p-4 pointer-events-none"
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

/* ─── PoolInfoModal ───────────────────────────────────────────────────────────
   蛋池資訊彈窗：顯示各稀有度出率、每位好友所在池別。
   卡片尺寸由 src/data/config.js → POOL_INFO 控制。
   ─────────────────────────────────────────────────────────────────────────── */
function PoolInfoModal({ pools, rarityMap, onClose }) {
  const wishById = useMemo(
    () => Object.fromEntries(ALL_WISHES.map(w => [w.id, w])),
    []
  )

  const total = Object.values(RARITY_RATES).reduce((a, b) => a + b, 0)
  const pctNum = (key) => RARITY_RATES[key] / total * 100
  const pctStr = (key) => pctNum(key).toFixed(1)

  // UR / SSR 各自機率獨立（drawEngine 已依標籤分池）
  const tiers = [
    {
      label: 'UR',  ids: (pools.HIGH ?? []).filter(id => rarityMap[id] === 'UR'),
      cfg: RARITY_DISPLAY.UR,  rateKey: 'UR',
    },
    {
      label: 'SSR', ids: (pools.HIGH ?? []).filter(id => rarityMap[id] === 'SSR'),
      cfg: RARITY_DISPLAY.SSR, rateKey: 'SSR',
    },
    {
      label: 'SR',  ids: pools.SR ?? [],
      cfg: RARITY_DISPLAY.SR,  rateKey: 'SR',
    },
    {
      label: 'R',   ids: pools.R  ?? [],
      cfg: RARITY_DISPLAY.R,   rateKey: 'R',
    },
  ]

  const { cardW, cols } = POOL_INFO
  const emojiPx = Math.round(cardW * 0.42)

  return (
    <AnimatePresence>
      <motion.div key="pi-bd"
        className="fixed inset-0 z-[150] bg-[rgba(42,32,18,0.68)] backdrop-blur-[4px]"
        initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
        transition={{ duration:0.2 }}
        onClick={onClose}
      />

      <motion.div key="pi-card"
        className="fixed inset-0 z-[151] flex items-center justify-center p-4 pointer-events-none"
        initial={{ opacity:0, scale:0.9, y:18 }}
        animate={{ opacity:1, scale:1, y:0 }}
        exit={{ opacity:0, scale:0.94, y:10 }}
        transition={SPRING}>

        <div
          className="w-full max-w-sm max-h-[85vh] overflow-y-auto rounded-2xl pointer-events-auto"
          style={{
            background: 'rgba(255,252,235,0.97)',
            backdropFilter: 'blur(16px)',
            border: `2px solid ${C.leather}50`,
            outline: `1px dashed ${C.leather}20`, outlineOffset: '-6px',
            boxShadow: `0 8px 40px rgba(61,48,39,0.18), 0 4px 0 ${C.leather}30`,
          }}
          onClick={e => e.stopPropagation()}>

          {/* ── Header ─────────────────────────────────────────────── */}
          <div className="sticky top-0 flex items-center justify-between px-5 py-3.5"
            style={{
              background: 'rgba(255,252,235,0.96)',
              backdropFilter: 'blur(8px)',
              borderBottom: `1px solid ${C.leather}25`,
            }}>
            <p className="font-rpg font-bold text-sm" style={{ color: C.ink }}>
              ✦ 蛋池資訊
            </p>
            <motion.button onClick={onClose}
              className="w-7 h-7 rounded-full flex items-center justify-center border"
              style={{ borderColor:`${C.leather}35`, background:'rgba(255,252,235,0.8)' }}
              whileHover={{ scale:1.1 }} whileTap={{ scale:0.88, transition:SPRING }}>
              <X size={12} style={{ color:C.inkMid }} />
            </motion.button>
          </div>

          {/* ── 保底說明 ────────────────────────────────────────────── */}
          <div className="px-5 py-3 text-[11px] leading-relaxed"
            style={{ borderBottom:`1px solid ${C.leather}18`, background:`${C.leather}06`, color:C.inkMid }}>
            <p className="font-rpg text-[9px] tracking-widest opacity-55 mb-1.5"
              style={{ color:C.leatherDeep }}>保底說明</p>
            <p>🛡 <span className="font-semibold" style={{ color:RARITY_DISPLAY.SSR.border }}>SSR 保底</span>
              ：第 50 抽必出 SSR</p>
            <p className="mt-0.5">💎 <span className="font-semibold" style={{ color:RARITY_DISPLAY.UR.border }}>UR 保底</span>
              ：累計 200 抽可手動兌換一張 UR</p>
          </div>

          {/* ── 各稀有度區塊 ─────────────────────────────────────────── */}
          <div className="px-5 py-4 space-y-5">
            {tiers.map(({ label, ids, cfg, rateKey }) => {
              const tierPct   = pctStr(rateKey)
              const perChar   = ids.length
                ? (pctNum(rateKey) / ids.length).toFixed(2)
                : '—'

              return (
                <div key={label}>
                  {/* Tier header row */}
                  <div className="flex items-baseline gap-2 mb-2.5">
                    <span className={`text-[10px] font-rpg font-bold px-2 py-0.5 rounded-full ${cfg.badge}`}
                      style={{ border:`1px solid ${cfg.border}` }}>
                      {label}
                    </span>
                    <span className="font-rpg text-[11px] font-bold" style={{ color:cfg.border }}>
                      {tierPct}%
                    </span>
                    {ids.length > 0 && (
                      <span className="font-rpg text-[9px] opacity-45" style={{ color:C.inkMid }}>
                        各約 {perChar}%
                      </span>
                    )}
                  </div>

                  {/* Character cards grid */}
                  {ids.length > 0 ? (
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: `repeat(${cols}, ${cardW}px)`,
                      gap: 8,
                    }}>
                      {ids.map((id, i) => {
                        const w = wishById[id]
                        if (!w) return null
                        return (
                          <motion.div key={id}
                            className="relative rounded-xl overflow-hidden"
                            style={{
                              width: cardW,
                              aspectRatio: '3/4',
                              background: `linear-gradient(160deg, ${w.color}18, ${w.color}45)`,
                              border: `1.5px solid ${w.color}55`,
                            }}
                            initial={{ opacity:0, scale:0.8 }}
                            animate={{ opacity:1, scale:1 }}
                            transition={{ delay:i*0.05, type:'spring', stiffness:320, damping:22 }}>

                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 px-0.5">
                              {w.avatar
                                ? <img src={w.avatar} alt={w.name}
                                    className="rounded-full object-cover"
                                    style={{ width: emojiPx, height: emojiPx }} />
                                : <span style={{ fontSize: emojiPx }}>{w.emoji}</span>
                              }
                              <p className="font-rpg font-semibold text-center leading-tight"
                                style={{ fontSize: Math.max(8, Math.round(cardW * 0.14)), color:'rgba(61,48,39,0.85)' }}>
                                {w.name}
                              </p>
                            </div>

                            {/* Rarity badge */}
                            <div className="absolute top-1 left-1">
                              <span className={`font-rpg font-bold rounded-full ${cfg.badge}`}
                                style={{ fontSize:7, padding:'1px 4px', border:`1px solid ${cfg.border}55` }}>
                                {label}
                              </span>
                            </div>
                          </motion.div>
                        )
                      })}
                    </div>
                  ) : (
                    <p className="text-[10px] font-rpg opacity-35 pl-1" style={{ color:C.inkMid }}>
                      尚無角色
                    </p>
                  )}
                </div>
              )
            })}
          </div>

          {/* 附註 */}
          <p className="px-5 pb-4 text-[9px] font-rpg opacity-35 leading-relaxed" style={{ color:C.inkMid }}>
            ※ UR / SSR 雖存於同一蛋池，抽取時依各自機率分別出牌。
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

/* ─── GachaDebugPanel ────────────────────────────────────────────────────────
   純文字測試面板，方便確認 state 是否正確更新。
   ─────────────────────────────────────────────────────────────────────────── */
const RARITY_COLOR = { UR: '#7A5AB8', SSR: '#A05040', SR: '#8A6940', R: '#5A716D' }

function GachaDebugPanel({ totalPulls, ssrPityCounter, ssrPityProgress,
                            urPityCounter, urPityProgress, canClaimUR,
                            inventory, pools, rarityMap, lastResults,
                            onSingle, onTen, onClaimUR, onReset }) {
  const [open, setOpen] = useState(false)

  const wishById = Object.fromEntries(ALL_WISHES.map(w => [w.id, w]))

  return (
    <div className="w-full max-w-5xl px-4 mt-8">
      <button
        onClick={() => setOpen(o => !o)}
        className="font-rpg text-[10px] tracking-widest px-3 py-1 rounded border"
        style={{ borderColor: `${C.leather}35`, color: C.leatherDeep, background: `${C.leather}08` }}
      >
        {open ? '▲' : '▼'} DEV · 抽蛋狀態檢查
      </button>

      {open && (
        <div
          className="mt-2 rounded-xl p-4 font-mono text-[11px] leading-relaxed"
          style={{ background: 'rgba(61,48,39,0.05)', border: `1px dashed ${C.leather}35`, color: C.inkMid }}
        >
          {/* ── 狀態列 ── */}
          <div className="font-bold mb-2 flex flex-wrap gap-x-4 gap-y-0.5" style={{ color: C.ink }}>
            <span>totalPulls: {totalPulls}</span>
            <span>
              SSR保底: {ssrPityCounter} / 49 &nbsp;({(ssrPityProgress * 100).toFixed(0)}%)
              {ssrPityCounter >= 49 && <span style={{ color: '#A05040' }}> ← 本抽保底！</span>}
            </span>
            <span style={{ color: canClaimUR ? '#7A5AB8' : undefined }}>
              UR保底: {urPityCounter} / 200 &nbsp;({(urPityProgress * 100).toFixed(0)}%)
              {canClaimUR && ' ← 可領取！'}
            </span>
          </div>

          {/* ── 操作按鈕 ── */}
          <div className="flex gap-2 mb-3 flex-wrap">
            {[
              { label: '單抽測試', fn: onSingle,  color: C.forest },
              { label: '十連抽測試', fn: onTen,   color: C.leather },
              { label: '重置卡池', fn: onReset,   color: C.rose },
            ].map(({ label, fn, color }) => (
              <button key={label} onClick={fn}
                className="px-3 py-1 rounded text-white text-[10px] font-rpg"
                style={{ background: color }}>
                {label}
              </button>
            ))}
            <button
              onClick={onClaimUR}
              disabled={!canClaimUR}
              className="px-3 py-1 rounded text-[10px] font-rpg"
              style={{
                background: canClaimUR ? '#7A5AB8' : 'rgba(122,90,184,0.25)',
                color: canClaimUR ? '#fff' : '#9B7FD4',
                cursor: canClaimUR ? 'pointer' : 'not-allowed',
              }}>
              領取 UR 保底 {canClaimUR ? '✦' : `(${urPityCounter}/200)`}
            </button>
          </div>

          {/* ── 上次抽卡結果 ── */}
          {lastResults.length > 0 && (
            <div className="mb-3">
              <span className="font-bold" style={{ color: C.ink }}>上次結果：</span>
              {lastResults.map((r, i) => (
                <span key={i}
                  className="inline-block mr-1.5 px-1.5 py-0.5 rounded text-[10px]"
                  style={{
                    background: `${RARITY_COLOR[r.rarity]}22`,
                    border: `1px solid ${RARITY_COLOR[r.rarity]}55`,
                    color: RARITY_COLOR[r.rarity],
                  }}>
                  {r.wish.name} [{r.rarity}]{r.isNew ? ' ★NEW' : ''}
                </span>
              ))}
            </div>
          )}

          {/* ── 卡池分布 ── */}
          <p className="font-bold mb-1" style={{ color: C.ink }}>卡池分布（HIGH = UR+SSR 共池）：</p>
          {['HIGH', 'SR', 'R'].map(poolKey => (
            <div key={poolKey} className="mb-1">
              <span style={{ color: poolKey === 'HIGH' ? '#7A5AB8' : poolKey === 'SR' ? '#8A6940' : '#5A716D' }}>
                [{poolKey}]&nbsp;
              </span>
              {(pools[poolKey] ?? []).map(id => {
                const w = wishById[id]
                const r = rarityMap[id]
                return (
                  <span key={id} className="mr-2"
                    style={{ color: RARITY_COLOR[r] }}>
                    {w?.name}({r})
                  </span>
                )
              })}
            </div>
          ))}

          {/* ── 圖鑑 / inventory ── */}
          <p className="font-bold mt-2 mb-1" style={{ color: C.ink }}>圖鑑（已解鎖次數）：</p>
          <div className="flex flex-wrap gap-x-3">
            {ALL_WISHES.map(w => {
              const cnt = inventory[w.id] ?? 0
              return (
                <span key={w.id} style={{ color: cnt > 0 ? RARITY_COLOR[rarityMap[w.id]] : '#aaa' }}>
                  {w.name} ×{cnt}
                </span>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

/* ─── WishesGacha (main) ──────────────────────────────────────────────────── */
export default function WishesGacha() {
  const titleRef    = useRef(null)
  const titleInView = useInView(titleRef, { once: true, margin: '-40px' })

  const {
    totalPulls, ssrPityCounter, ssrPityProgress,
    urPityCounter, urPityProgress, canClaimUR,
    inventory, pools, rarityMap,
    isUnlocked, unlockedCount,
    drawSingle, drawTen, claimUR,
    unlockAll, resetGacha,
  } = useGachaSystem()

  // ── State machine ──────────────────────────────────────────────────────
  const [gachaPhase,   setGachaPhase]   = useState('IDLE')  // 'IDLE' | 'ANIMATING'
  const [pullResults,  setPullResults]  = useState([])
  const [pullKey,      setPullKey]      = useState(0)       // 每次新抽遞增，強制 GachaAnimation 重掛
  const [revealWish,   setRevealWish]   = useState(null)
  const [revealIsNew,  setRevealIsNew]  = useState(false)
  const [lastResults,  setLastResults]  = useState([])
  const [showPoolInfo, setShowPoolInfo] = useState(false)

  const allUnlocked = unlockedCount === ALL_WISHES.length

  // ── Pull handlers (走全螢幕動畫) ────────────────────────────────────────
  const startPull = (results) => {
    setPullResults(results)
    setPullKey(k => k + 1)   // 強制 GachaAnimation 重掛，重置動畫到 effect 階段
    setGachaPhase('ANIMATING')
  }
  const handleSinglePull   = () => startPull(drawSingle())
  const handleTenPull      = () => startPull(drawTen())
  const handleContinuePull = useCallback(() => startPull(drawTen()), [drawTen])
  const handleClaimURPull  = () => {
    const result = claimUR(); if (result) startPull([result])
  }
  const handleGachaClose = useCallback(() => { setGachaPhase('IDLE'); setPullResults([]) }, [])
  const handleResultCardClick   = useCallback((result) => {
    setRevealWish({ ...result.wish, assignedRarity: result.rarity })
    setRevealIsNew(result.isNew)
  }, [])

  // ── Debug handlers (不走動畫) ─────────────────────────────────────────
  const handleDebugSingle  = () => setLastResults(drawSingle())
  const handleDebugTen     = () => setLastResults(drawTen())
  const handleClaimURDebug = () => { const r = claimUR(); if (r) setLastResults([r]) }
  const handleUnlockAll    = () => unlockAll()

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

          {/* ── 左：抽卡面板 ──────────────────────────────────────────────── */}
          <motion.div initial={{ opacity:0, x:-28 }} whileInView={{ opacity:1, x:0 }}
            viewport={{ once:true }} transition={{ duration:0.6 }}
            className="flex flex-col items-center gap-4 w-full lg:w-auto">

            {/* 裝飾球 */}
            <div className="relative w-36 h-36 rounded-full flex items-center justify-center"
              style={{
                background: 'radial-gradient(circle at 32% 28%, rgba(255,255,255,0.52), rgba(255,249,227,0.28) 52%, transparent)',
                border: `2.5px solid ${C.leather}40`,
                boxShadow: `0 4px 28px ${C.leather}18, inset 0 1px 0 rgba(255,255,255,0.7)`,
              }}>
              <motion.span className="text-5xl select-none"
                animate={{ rotate:[0,6,-6,0], scale:[1,1.06,0.97,1] }}
                transition={{ duration:4.5, repeat:Infinity, ease:'easeInOut' }}>
                🎊
              </motion.span>
              <div className="absolute inset-0 rounded-full pointer-events-none"
                style={{ background:'radial-gradient(ellipse at 30% 25%, rgba(255,255,255,0.4), transparent 55%)' }} />
            </div>

            <p className="font-rpg text-[10px] tracking-[0.25em] -mt-1"
              style={{ color:C.leatherDeep, opacity:0.52 }}>
              ✦ BIRTHDAY GACHA ✦
            </p>

            {/* 單抽 */}
            <motion.button onClick={handleSinglePull}
              className="btn-game-primary w-52 py-3.5 font-semibold"
              whileHover={{ scale:1.04, y:-2 }}
              whileTap={{ scale:0.93, y:3, transition:SPRING }} transition={SPRING}>
              ✦ 抽取祝福 ✦
            </motion.button>

            {/* 十連抽 */}
            <motion.button onClick={handleTenPull}
              className="btn-game-primary w-52 py-3 text-sm"
              whileHover={{ scale:1.04, y:-2 }}
              whileTap={{ scale:0.93, y:3, transition:SPRING }} transition={SPRING}>
              ✦✦✦ 十連抽 ✦✦✦
            </motion.button>

            {/* 蛋池資訊按鈕 */}
            <motion.button
              onClick={() => setShowPoolInfo(true)}
              className="flex items-center gap-1.5 font-rpg text-[10px] tracking-wider"
              style={{ color:C.leatherDeep, opacity:0.5 }}
              whileHover={{ opacity:1 }}
              transition={{ duration:0.15 }}>
              <Info size={11} />蛋池資訊
            </motion.button>

            {/* 保底進度條 */}
            <div className="w-52 flex flex-col gap-2.5 mt-1">
              {/* SSR */}
              <div>
                <div className="flex justify-between text-[9px] font-rpg mb-0.5 opacity-55"
                  style={{ color:C.leatherDeep }}>
                  <span>SSR 保底</span><span>{ssrPityCounter} / 49</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background:`${C.rose}22` }}>
                  <motion.div className="h-full rounded-full"
                    style={{ background:`linear-gradient(90deg,${C.rose}88,${C.rose})` }}
                    animate={{ width:`${ssrPityProgress*100}%` }} transition={{ duration:0.4 }} />
                </div>
              </div>
              {/* UR */}
              <div>
                <div className="flex justify-between text-[9px] font-rpg mb-0.5 opacity-55"
                  style={{ color:C.leatherDeep }}>
                  <span>UR 保底</span><span>{urPityCounter} / 200</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden"
                  style={{ background:'rgba(122,90,184,0.12)' }}>
                  <motion.div className="h-full rounded-full"
                    style={{ background:'linear-gradient(90deg,rgba(155,127,212,0.75),#9B7FD4)' }}
                    animate={{ width:`${urPityProgress*100}%` }} transition={{ duration:0.4 }} />
                </div>
              </div>
              {/* UR claim */}
              <AnimatePresence>
                {canClaimUR && (
                  <motion.button onClick={handleClaimURPull}
                    initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                    className="w-full py-2.5 rounded-xl font-rpg text-[11px] font-bold text-white"
                    style={{
                      background:'linear-gradient(135deg,#7A5AB8,#9B7FD4)',
                      boxShadow:'0 4px 0 rgba(90,50,160,0.45)',
                    }}
                    whileHover={{ scale:1.04, y:-1 }}
                    whileTap={{ scale:0.94, y:3, transition:SPRING }}>
                    ★ 領取 UR 保底
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            <motion.p initial={{ opacity:0 }} animate={{ opacity: unlockedCount > 0 ? 0.5 : 0 }}
              className="text-[10px] font-rpg tracking-wider" style={{ color:C.leatherDeep }}>
              已解鎖 {unlockedCount} / {ALL_WISHES.length} 個祝福
            </motion.p>
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
                  {unlockedCount} / {ALL_WISHES.length} 已解鎖 · 點擊已解鎖卡片可重播
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
                    isUnlocked={isUnlocked(wish.id)}
                    assignedRarity={rarityMap[wish.id]}
                    onClick={w => { setRevealWish(w); setRevealIsNew(false) }}
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

      {/* 蛋池資訊彈窗 */}
      {showPoolInfo && (
        <PoolInfoModal
          pools={pools}
          rarityMap={rarityMap}
          onClose={() => setShowPoolInfo(false)}
        />
      )}

      {/* WishRevealModal — z-[301], 覆蓋在 GachaAnimation 之上 */}
      <WishRevealModal wish={revealWish} isNew={revealIsNew} onClose={() => setRevealWish(null)} />

      {/* GachaAnimation — 全螢幕覆蓋，ANIMATING 狀態時顯示 */}
      <AnimatePresence>
        {gachaPhase === 'ANIMATING' && (
          <GachaAnimation
            key={pullKey}
            results={pullResults}
            inventory={inventory}
            onClose={handleGachaClose}
            onContinue={handleContinuePull}
            onCardClick={handleResultCardClick}
          />
        )}
      </AnimatePresence>

      {/* ── 開發測試面板 ──────────────────────────────────────────── */}
      <GachaDebugPanel
        totalPulls={totalPulls}
        ssrPityCounter={ssrPityCounter}
        ssrPityProgress={ssrPityProgress}
        urPityCounter={urPityCounter}
        urPityProgress={urPityProgress}
        canClaimUR={canClaimUR}
        inventory={inventory}
        pools={pools}
        rarityMap={rarityMap}
        lastResults={lastResults}
        onSingle={handleDebugSingle}
        onTen={handleDebugTen}
        onClaimUR={handleClaimURDebug}
        onReset={resetGacha}
      />
    </section>
  )
}
