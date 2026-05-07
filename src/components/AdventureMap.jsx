import { useRef, useState, useEffect } from 'react'
import {
  motion, useScroll, useTransform, useInView,
  useMotionValueEvent, AnimatePresence,
} from 'framer-motion'
import { Mountain, TreePine, Building2, Compass, Star, Sparkles, X, Flag, Play } from 'lucide-react'
import { MEMORIES as MEMORIES_DATA } from '../data/memories'
import { detectMediaType } from '../utils/media'

/* ─── 設計 Token ─────────────────────────────────────────────────────────── */
const C = {
  leather:      '#D4A373',
  leatherDark:  '#B88355',
  leatherDeep:  '#8A6940',
  leatherLite:  '#ECC98A',
  forest:       '#7A918D',
  forestDark:   '#5A716D',
  ink:          '#3D3027',
  inkMid:       '#4D3D2F',
  rose:         '#D9947E',
  dawn:         '#FFF9E3',
}

/* ─── 蜿蜒路線 SVG ───────────────────────────────────────────────────────── */
const SVG_W = 600
const SVG_H = 1080
const PATH_D = 'M 300 60 C 520 130 80 270 300 390 C 520 510 80 650 300 770 C 480 890 120 970 300 1040'

/* ─── 資料來自 src/data/memories.js（在那裡新增節點）───────────────────── */
const MEMORIES = MEMORIES_DATA

/* ─── 景觀裝飾 ────────────────────────────────────────────────────────────── */
const DECO = [
  { Icon: Compass,   x: 292, y: 26,  size: 22, color: C.leather,     opacity: 0.72 },
  { Icon: Mountain,  x: 490, y: 70,  size: 42, color: C.leatherDark,  opacity: 0.50 },
  { Icon: Mountain,  x: 528, y: 96,  size: 28, color: C.leatherDeep,  opacity: 0.34 },
  { Icon: Sparkles,  x: 546, y: 186, size: 18, color: C.leatherLite,  opacity: 0.52 },
  { Icon: TreePine,  x: 42,  y: 308, size: 38, color: C.forest,       opacity: 0.58 },
  { Icon: TreePine,  x: 76,  y: 336, size: 27, color: C.forestDark,   opacity: 0.48 },
  { Icon: TreePine,  x: 56,  y: 360, size: 20, color: C.forest,       opacity: 0.40 },
  { Icon: Star,      x: 548, y: 432, size: 16, color: C.leatherLite,  opacity: 0.46 },
  { Icon: Building2, x: 512, y: 564, size: 36, color: C.leather,      opacity: 0.56 },
  { Icon: Sparkles,  x: 66,  y: 514, size: 18, color: C.rose,         opacity: 0.42 },
  { Icon: TreePine,  x: 38,  y: 790, size: 30, color: C.forest,       opacity: 0.50 },
  { Icon: TreePine,  x: 68,  y: 814, size: 22, color: C.forestDark,   opacity: 0.42 },
  { Icon: Flag,      x: 292, y:1058, size: 22, color: C.leather,      opacity: 0.70 },
]

const SPRING = { type: 'spring', stiffness: 420, damping: 20 }

/* ─── MemoryAudioPlayer（小尺寸，用於 Modal 內）──────────────────────────── */
function MemoryAudioPlayer({ src, color, emoji }) {
  const ref = useRef(null)
  const [playing,  setPlaying]  = useState(false)
  const [progress, setProgress] = useState(0)
  const [current,  setCurrent]  = useState(0)
  const [duration, setDuration] = useState(0)
  const fmt = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`

  const toggle = () => {
    if (!ref.current) return
    playing ? ref.current.pause() : ref.current.play()
    setPlaying(p => !p)
  }
  const seek = e => {
    const r = e.currentTarget.getBoundingClientRect()
    const ratio = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width))
    if (ref.current) { ref.current.currentTime = ratio * ref.current.duration; setProgress(ratio) }
  }

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6">
      <span className="text-5xl select-none">{emoji}</span>

      {/* 聲波 */}
      <div className="flex items-end gap-1" style={{ height: 24 }}>
        {[0.6, 1, 0.7, 1, 0.55, 1, 0.65].map((h, i) => (
          <motion.div key={i} className="w-1 rounded-full" style={{ background: color, originY: 1 }}
            animate={playing ? { scaleY: [h, 1, 0.35, 1, h], opacity: [0.65, 1, 0.5, 1, 0.65] } : { scaleY: 0.2, opacity: 0.3 }}
            transition={{ duration: 0.7, delay: i * 0.09, repeat: Infinity }} />
        ))}
      </div>

      {/* 進度條 */}
      <div className="w-full flex flex-col gap-1">
        <div className="w-full h-1.5 rounded-full cursor-pointer overflow-hidden"
          style={{ background: `${color}25` }} onClick={seek}>
          <div className="h-full rounded-full transition-all"
            style={{ width: `${progress * 100}%`, background: `linear-gradient(90deg, ${color}88, ${color})` }} />
        </div>
        <div className="flex justify-between text-[9px] font-rpg opacity-50" style={{ color }}>
          <span>{fmt(current)}</span><span>{duration ? fmt(duration) : '--:--'}</span>
        </div>
      </div>

      {/* 播放鈕 */}
      <motion.button onClick={toggle}
        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.88 }}
        className="w-10 h-10 rounded-full flex items-center justify-center text-white text-base"
        style={{ background: `linear-gradient(145deg, ${color}cc, ${color})`, boxShadow: `0 3px 0 ${color}55` }}>
        {playing ? '⏸' : '▶'}
      </motion.button>

      <audio ref={ref} src={src}
        onTimeUpdate={() => { if (!ref.current) return; setCurrent(ref.current.currentTime); setProgress(ref.current.currentTime / (ref.current.duration || 1)) }}
        onLoadedMetadata={() => setDuration(ref.current?.duration ?? 0)}
        onEnded={() => { setPlaying(false); setProgress(0); setCurrent(0) }} />
    </div>
  )
}

/* ─── VideoThumbnail：擷取影片第一幀作為靜態縮圖 ────────────────────────── */
function VideoThumbnail({ src, emoji }) {
  const [thumb, setThumb] = useState(null)

  useEffect(() => {
    let cancelled = false
    const video = document.createElement('video')
    video.muted = true
    video.playsInline = true
    video.preload = 'metadata'
    video.crossOrigin = 'anonymous'

    const capture = () => {
      if (cancelled || !video.videoWidth) return
      const canvas = document.createElement('canvas')
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      canvas.getContext('2d').drawImage(video, 0, 0)
      try {
        const url = canvas.toDataURL('image/jpeg', 0.85)
        if (!cancelled) setThumb(url)
      } catch {}
    }

    video.addEventListener('seeked', capture)
    video.addEventListener('loadedmetadata', () => { video.currentTime = 0.01 })
    video.src = src
    video.load()

    return () => {
      cancelled = true
      video.removeEventListener('seeked', capture)
      video.src = ''
    }
  }, [src])

  if (thumb) return <img src={thumb} alt="" className="w-full h-full object-cover" />
  return <span className="text-xl leading-none">{emoji}</span>
}

/* ─── MemoryNode ──────────────────────────────────────────────────────────── */
function MemoryNode({ memory, position, onOpen }) {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const isRight = position.x > SVG_W / 2

  return (
    <motion.div
      ref={ref}
      className="absolute z-20 cursor-pointer select-none"
      style={{ left: `${(position.x / SVG_W) * 100}%`, top: `${(position.y / SVG_H) * 100}%`, transform: 'translate(-50%,-50%)' }}
      initial={{ scale: 0, opacity: 0 }}
      animate={inView ? { scale: 1, opacity: 1 } : {}}
      transition={{ ...SPRING, delay: 0.05 }}
      whileHover={{ scale: 1.18 }}
      whileTap={{ scale: 0.90, transition: SPRING }}
      onClick={() => onOpen(memory)}
    >
      {/* 脈衝光環 */}
      {inView && (
        <motion.div
          className="absolute rounded-full pointer-events-none"
          style={{ inset: '-10px', background: `radial-gradient(circle, ${memory.color}35, transparent 68%)` }}
          animate={{ scale: [1, 1.45, 1], opacity: [0.55, 0.18, 0.55] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {/* 主圓 */}
      <div
        className="relative w-12 h-12 rounded-full overflow-hidden flex items-center justify-center text-xl shadow-[0_4px_16px_rgba(0,0,0,0.16)] shrink-0"
        style={{
          background: `linear-gradient(145deg, ${memory.color}28, ${memory.color}55)`,
          border: `2.5px solid ${memory.color}`,
        }}
      >
        {(() => {
          if (memory.photo) return (
            <img src={memory.photo} alt="" className="w-full h-full object-cover" />
          )
          const t = detectMediaType(memory.media)
          if (t === 'video') return (
            <VideoThumbnail src={memory.media} emoji={memory.emoji} />
          )
          if (t === 'image') return (
            <img src={memory.media} alt="" className="w-full h-full object-cover" />
          )
          return <span className="text-xl leading-none">{memory.emoji}</span>
        })()}
      </div>


      {/* 標題標籤 — 統一在圓形右側 */}
      <div
        className="absolute top-1/2 -translate-y-1/2 left-[calc(100%+8px)] pointer-events-none"
        style={{ width: 'max-content' }}
      >
        <div
          className="px-2 py-1 rounded-lg text-xs font-medium whitespace-nowrap"
          style={{ background: 'rgba(255,252,235,0.92)', border: `1px solid ${memory.color}42`, backdropFilter: 'blur(8px)', color: C.inkMid }}
        >
          {memory.title}
        </div>
      </div>
    </motion.div>
  )
}

/* ─── MemoryModal ─────────────────────────────────────────────────────────── */
function MemoryModal({ memory, onClose }) {
  const [showYoutube, setShowYoutube] = useState(false)
  const [videoAspect, setVideoAspect] = useState(null)
  const [videoError,  setVideoError]  = useState(false)
  const mediaType = memory ? detectMediaType(memory.media) : 'none'
  // 當切換不同節點時，重置狀態
  useEffect(() => { setShowYoutube(false); setVideoAspect(null); setVideoError(false) }, [memory?.id])

  // 依長寬比動態計算高度（容器寬度約 352px）
  const CONTAINER_W = 352
  const MAX_VIDEO_H = 420
  const videoH = videoAspect
    ? Math.min(MAX_VIDEO_H, Math.round(CONTAINER_W / videoAspect))
    : 208

  return (
    <AnimatePresence>
      {memory && (
        <>
          <motion.div
            key="bd"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-100 bg-[rgba(42,32,24,0.70)] backdrop-blur-[6px]"
            onClick={onClose}
          />
          <motion.div
            key="card"
            initial={{ opacity: 0, scale: 0.86, y: 28 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 14 }}
            transition={{ ...SPRING }}
            className="fixed inset-0 z-101 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="w-full max-w-sm overflow-hidden pointer-events-auto"
              style={{
                background: 'rgba(255,252,235,0.93)',
                backdropFilter: 'blur(16px)',
                border: `1.5px solid ${memory.color}55`,
                borderRadius: '1.5rem',
                boxShadow: `0 8px 40px ${memory.color}30, 0 2px 8px rgba(61,48,39,0.12)`,
                outline: `1px dashed ${memory.color}22`,
                outlineOffset: '-6px',
              }}
              onClick={e => e.stopPropagation()}
            >
              {/* ── 媒體區域 ── */}
              <div
                className="relative overflow-hidden"
                style={{
                  height: mediaType === 'audio' ? 260
                    : mediaType === 'video' ? videoH
                    : 208,
                  transition: 'height 0.3s ease',
                  background: `linear-gradient(145deg, ${memory.color}18, ${memory.color}42)`,
                }}
              >
                <div className="absolute inset-0 pointer-events-none"
                  style={{ background: `radial-gradient(circle at 40% 35%, ${memory.color}28, transparent 62%)` }} />

                {/* 優先順序：photo → video → image → emoji（與節點圓形一致） */}

                {/* 1. photo */}
                {memory.photo && (
                  <img src={memory.photo} alt={memory.title}
                    className="absolute inset-0 w-full h-full object-cover" />
                )}

                {/* 2. video（直接顯示，自動播放） */}
                {!memory.photo && mediaType === 'video' && !videoError && (
                  <video
                    key={memory.media}
                    ref={node => { if (node) node.play().catch(() => {}) }}
                    className="absolute inset-0 w-full h-full"
                    style={{ objectFit: videoAspect && videoAspect < 1 ? 'contain' : 'cover' }}
                    controls playsInline
                    onLoadedMetadata={e => {
                      const { videoWidth, videoHeight } = e.target
                      if (videoWidth && videoHeight) setVideoAspect(videoWidth / videoHeight)
                    }}
                    onError={() => setVideoError(true)}
                  >
                    <source src={memory.media} type="video/mp4" />
                  </video>
                )}
                {!memory.photo && mediaType === 'video' && videoError && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                    <span className="text-4xl">🎬</span>
                    <p className="text-[11px] font-rpg opacity-55 text-center px-4" style={{ color: memory.color }}>
                      影片格式不支援<br />請用 HandBrake 將檔案轉成 H.264 MP4
                    </p>
                  </div>
                )}

                {/* 3. image（直接顯示） */}
                {!memory.photo && mediaType === 'image' && (
                  <img src={memory.media} alt={memory.title}
                    className="absolute inset-0 w-full h-full object-contain" />
                )}

                {/* 4. audio（直接顯示播放器） */}
                {mediaType === 'audio' && (
                  <MemoryAudioPlayer src={memory.media} color={memory.color} emoji={memory.emoji} />
                )}

                {/* 5. youtube（點擊觸發，避免 iframe 效能問題） */}
                {!memory.photo && mediaType === 'youtube' && !showYoutube && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                    <motion.span className="text-7xl"
                      initial={{ scale: 0.45, rotate: -12 }} animate={{ scale: 1, rotate: 0 }}
                      transition={{ ...SPRING, delay: 0.08 }}>
                      {memory.emoji}
                    </motion.span>
                    <motion.button
                      onClick={() => setShowYoutube(true)}
                      whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.90, transition: SPRING }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-rpg font-semibold"
                      style={{ background: 'rgba(255,252,235,0.88)', backdropFilter: 'blur(8px)', border: `1.5px solid ${memory.color}55`, color: memory.color }}
                    >
                      <Play size={11} /> 播放影片
                    </motion.button>
                  </div>
                )}
                {!memory.photo && mediaType === 'youtube' && showYoutube && (
                  <iframe src={`${memory.media}?autoplay=1`}
                    className="absolute inset-0 w-full h-full"
                    allow="autoplay; encrypted-media" allowFullScreen title={memory.title} />
                )}

                {/* 6. 無任何媒體：emoji */}
                {!memory.photo && mediaType === 'none' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.span className="text-7xl"
                      initial={{ scale: 0.45, rotate: -12 }} animate={{ scale: 1, rotate: 0 }}
                      transition={{ ...SPRING, delay: 0.08 }}>
                      {memory.emoji}
                    </motion.span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-rpg font-bold px-2 py-0.5 rounded-full"
                    style={{ background: `${memory.color}1E`, color: memory.color, border: `1px solid ${memory.color}50` }}>
                    Memory
                  </span>
                </div>
                <h3 className="font-rpg font-bold text-lg mt-2 leading-tight" style={{ color: C.ink }}>
                  {memory.title}
                </h3>
                <div className="ornament-divider my-3">
                  <span className="text-[8px]" style={{ color: memory.color }}>✦</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-1.5 justify-center">
                  {memory.tags.map(tag => (
                    <span key={tag} className="text-[10px] font-rpg px-2 py-0.5 rounded-full"
                      style={{ background: `${memory.color}18`, color: memory.color, border: `1px solid ${memory.color}45` }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Close */}
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.88, transition: SPRING }}
                className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center
                  border border-[rgba(212,163,115,0.32)] hover:bg-[rgba(212,163,115,0.18)] transition-colors"
                style={{ background: 'rgba(255,252,235,0.75)', backdropFilter: 'blur(8px)' }}
              >
                <X size={13} style={{ color: C.inkMid }} />
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

/* ─── AdventureMap (main) ─────────────────────────────────────────────────── */
export default function AdventureMap() {
  const sectionRef = useRef(null)
  const pathRef    = useRef(null)
  const titleRef   = useRef(null)
  const titleInView = useInView(titleRef, { once: true, margin: '-40px' })

  const [nodePositions, setNodePositions] = useState(MEMORIES.map(() => ({ x: SVG_W / 2, y: SVG_H / 2 })))
  const [dotPos,  setDotPos]  = useState({ x: 300, y: 60 })
  const [openMem, setOpenMem] = useState(null)

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start 65%', 'end 35%'] })
  const pathProgress = useTransform(scrollYProgress, [0, 1], [0, 1])

  useMotionValueEvent(pathProgress, 'change', v => {
    if (!pathRef.current) return
    const len = pathRef.current.getTotalLength()
    const pt  = pathRef.current.getPointAtLength(len * Math.min(v, 0.998))
    setDotPos({ x: pt.x, y: pt.y })
  })

  useEffect(() => {
    if (!pathRef.current) return
    const len = pathRef.current.getTotalLength()
    setNodePositions(MEMORIES.map(m => {
      const pt = pathRef.current.getPointAtLength(len * m.pathFraction)
      return { x: pt.x, y: pt.y }
    }))
  }, [])

  return (
    <section
      ref={sectionRef}
      id="adventure-map"
      className="relative w-full py-16 sm:py-20 overflow-hidden flex flex-col items-center"
      style={{ background: `linear-gradient(180deg, ${C.dawn} 0%, #F5EDD4 50%, ${C.dawn} 100%)` }}
    >
      {/* 背景水印 */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div className="absolute top-8 left-8 font-rpg select-none opacity-[0.025] -rotate-12"
          style={{ fontSize: '15rem', color: C.leather }}>✦</div>
        <div className="absolute bottom-8 right-8 font-rpg select-none opacity-[0.025] rotate-[8deg]"
          style={{ fontSize: '10rem', color: C.leather }}>◈</div>
      </div>

      {/* Section Header */}
      <motion.div
        ref={titleRef}
        initial={{ opacity: 0, y: 24 }} animate={titleInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        className="w-full max-w-2xl px-4 sm:px-8 text-center mb-10 sm:mb-14"
      >
        <span className="rpg-badge">Chapter II</span>
        <h2 className="font-rpg font-bold mt-4 shimmer-text leading-tight text-center w-full block"
          style={{ fontSize: 'clamp(1.75rem, 5vw, 3rem)' }}>
          Adventure Map
        </h2>
        <p className="font-rpg tracking-widest text-sm mt-1" style={{ color: C.leatherDeep }}>
          冒 險 回 憶 地 圖
        </p>
        <div className="ornament-divider max-w-xs mt-5" style={{ margin: '1.25rem auto 0' }}>
          <span className="text-xs" style={{ color: C.leather }}>✦</span>
        </div>
        <p className="mt-4 text-sm sm:text-base opacity-72 max-w-md leading-relaxed"
          style={{ margin: '1rem auto 0', color: C.inkMid }}>
          每一個足跡都是傳說的一部分。<br />點擊記憶節點，重溫每段珍貴的冒險時光。
        </p>
      </motion.div>

      {/* Map canvas */}
      <div className="relative w-full max-w-md px-2 sm:px-4" style={{ margin: '0 auto' }}>
        <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="w-full h-auto block" style={{ overflow: 'visible' }} aria-hidden>
          <path ref={pathRef} d={PATH_D} stroke="none" fill="none" />

          {/* 底層鬼影路線 */}
          <path d={PATH_D} stroke={`${C.leather}25`} strokeWidth="22" fill="none" strokeLinecap="round" />
          <path d={PATH_D} stroke={`${C.leather}30`} strokeWidth="9"  fill="none" strokeLinecap="round" />

          {/* 動態進度光軌 */}
          <motion.path d={PATH_D} stroke={`${C.leatherLite}45`} strokeWidth="14" fill="none" strokeLinecap="round" style={{ pathLength: pathProgress }} />
          <motion.path d={PATH_D} stroke={C.leather}             strokeWidth="3"  fill="none" strokeLinecap="round" style={{ pathLength: pathProgress }} />

          {/* 前進光點 */}
          <motion.circle cx={dotPos.x} cy={dotPos.y} r="8" fill={C.leatherLite}
            style={{ filter: `drop-shadow(0 0 7px ${C.leather})` }}
            animate={{ scale: [1, 1.35, 1], opacity: [0.9, 0.5, 0.9] }}
            transition={{ duration: 1.7, repeat: Infinity, ease: 'easeInOut' }} />
          <motion.circle cx={dotPos.x} cy={dotPos.y} r="4" fill={C.leather} />
        </svg>

        {/* 景觀裝飾 */}
        {DECO.map((d, i) => (
          <div key={i} className="absolute pointer-events-none" aria-hidden
            style={{ left: `${(d.x / SVG_W) * 100}%`, top: `${(d.y / SVG_H) * 100}%`,
              transform: 'translate(-50%,-50%)', opacity: d.opacity, color: d.color }}>
            <d.Icon size={d.size} strokeWidth={1.4} />
          </div>
        ))}

        {/* 記憶節點 */}
        {MEMORIES.map((m, i) => (
          <MemoryNode key={m.id} memory={m} position={nodePositions[i]} onOpen={setOpenMem} />
        ))}
      </div>

      {/* Footer note */}
      <motion.div
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
        transition={{ delay: 0.4 }} className="mt-12 text-center"
      >
        <div className="inline-block px-6 py-3 rounded-2xl"
          style={{ background: 'rgba(255,252,235,0.78)', border: `1px solid ${C.leather}30`, backdropFilter: 'blur(12px)' }}>
          <p className="text-sm font-medium font-rpg tracking-wide" style={{ color: C.leatherDeep }}>
            ✦ 更多回憶，敬請期待… ✦
          </p>
        </div>
      </motion.div>

      <MemoryModal memory={openMem} onClose={() => setOpenMem(null)} />
    </section>
  )
}
