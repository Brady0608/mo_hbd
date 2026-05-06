import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RARITY_DISPLAY, LIMIT_BREAK_MAX, RESULT_CARD } from '../data/config'

const RC     = RARITY_DISPLAY
const SPRING = { type: 'spring', stiffness: 440, damping: 18 }

/* ── Fixed aurora blob layout ──────────────────────────────────────────── */
const AURORA_BLOBS = [
  { color: '#ff006e', x: 15, y: 20, size: 520, dx:[0,45,-30,20,0],  dy:[0,-35,45,-15,0] },
  { color: '#8338ec', x: 72, y: 12, size: 480, dx:[0,-25,35,-20,0], dy:[0,30,-20,25,0]  },
  { color: '#3a86ff', x: 78, y: 68, size: 440, dx:[0,-40,25,-15,0], dy:[0,-25,35,-10,0] },
  { color: '#06d6a0', x:  8, y: 72, size: 460, dx:[0,30,-40,20,0],  dy:[0,-30,25,-20,0] },
  { color: '#ffbe0b', x: 50, y: 48, size: 400, dx:[0,20,-15,30,0],  dy:[0,25,-35,15,0]  },
  { color: '#c77dff', x: 30, y: 85, size: 360, dx:[0,-20,35,-25,0], dy:[0,-40,20,-15,0] },
]

const SPARKLES = [
  {x:10,y:15,s:3,c:'#fff',    d:0.0}, {x:88,y:22,s:2,c:'#ffbe0b',d:0.4},
  {x:30,y: 8,s:4,c:'#c77dff',d:0.8}, {x:72,y:60,s:2,c:'#3a86ff',d:0.2},
  {x:18,y:55,s:3,c:'#06d6a0',d:1.0}, {x:90,y:75,s:2,c:'#fff',    d:0.6},
  {x:50,y:90,s:3,c:'#ff006e',d:1.2}, {x:65,y:10,s:2,c:'#ffbe0b',d:0.3},
  {x:42,y:35,s:2,c:'#c77dff',d:0.9}, {x:78,y:88,s:3,c:'#3a86ff',d:0.7},
  {x: 5,y:40,s:2,c:'#fff',    d:0.5}, {x:55,y:70,s:3,c:'#06d6a0',d:1.1},
]

const GOLD_DOTS = [
  {x:22,y:28},{x:75,y:20},{x:82,y:62},
  {x:16,y:72},{x:50,y:12},{x:38,y:85},
  {x:66,y:78},{x:46,y:88},
]

const SSR_LINES = Array.from({ length: 16 }, (_, i) => i * 22.5)

/* ── UREffect ──────────────────────────────────────────────────────────── */
function UREffect({ onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 4500); return () => clearTimeout(t) }, [onDone])

  return (
    <motion.div className="absolute inset-0 overflow-hidden flex items-center justify-center"
      style={{ background: '#050212' }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}>

      {/* Aurora blobs */}
      {AURORA_BLOBS.map((b, i) => (
        <motion.div key={i} className="absolute rounded-full pointer-events-none"
          style={{
            left:`${b.x}%`, top:`${b.y}%`,
            width:b.size, height:b.size,
            background:b.color,
            filter:'blur(100px)',
            mixBlendMode:'screen',
            transform:'translate(-50%,-50%)',
          }}
          animate={{ x:b.dx, y:b.dy, scale:[1,1.2,0.85,1.15,1], opacity:[0.5,0.85,0.6,0.9,0.5] }}
          transition={{ duration:4, delay:i*0.25, ease:'easeInOut' }}
        />
      ))}

      {/* Floating sparkles */}
      {SPARKLES.map((p, i) => (
        <motion.div key={i} className="absolute rounded-full pointer-events-none"
          style={{
            left:`${p.x}%`, top:`${p.y}%`, width:p.s, height:p.s,
            background:p.c, boxShadow:`0 0 ${p.s*4}px ${p.c}`,
            transform:'translate(-50%,-50%)',
          }}
          animate={{ y:[0,-80,-160], opacity:[0,1,0], scale:[0.5,1,0.2] }}
          transition={{ duration:2+p.d*0.5, delay:p.d, repeat:Infinity, ease:'easeOut' }}
        />
      ))}

      {/* Center content */}
      <div className="relative z-10 flex flex-col items-center gap-3 text-center px-6">
        <motion.div className="relative"
          initial={{ scale:0, opacity:0 }} animate={{ scale:1, opacity:1 }}
          transition={{ delay:0.3, type:'spring', stiffness:200, damping:15 }}>
          {/* Glow clone */}
          <motion.p className="font-rpg font-bold absolute inset-0 blur-2xl select-none"
            style={{ fontSize:'clamp(3.5rem,12vw,7rem)', color:'#a78bfa' }}
            animate={{ opacity:[0.35,0.9,0.35] }}
            transition={{ duration:1.8, repeat:Infinity }}>
            ✦ UR ✦
          </motion.p>
          {/* Main text */}
          <p className="font-rpg font-bold text-white relative select-none"
            style={{ fontSize:'clamp(3.5rem,12vw,7rem)' }}>
            ✦ UR ✦
          </p>
        </motion.div>

        <motion.p className="font-rpg text-sm tracking-[0.3em]"
          style={{ color:'rgba(255,255,255,0.72)' }}
          initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
          transition={{ delay:1.2, duration:0.6 }}>
          極稀有好友降臨
        </motion.p>
      </div>
    </motion.div>
  )
}

/* ── SSREffect ─────────────────────────────────────────────────────────── */
function SSREffect({ onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 3000); return () => clearTimeout(t) }, [onDone])

  return (
    <motion.div className="absolute inset-0 overflow-hidden flex items-center justify-center"
      style={{ background:'radial-gradient(ellipse at center, #201500 0%, #0a0700 70%)' }}
      initial={{ opacity:0 }} animate={{ opacity:1 }}
      exit={{ opacity:0, transition:{ duration:0.4 } }}>

      {/* Radial burst lines */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {SSR_LINES.map((deg, i) => (
          <motion.div key={i} className="absolute"
            style={{
              width:2, height:'52vmax',
              background:'linear-gradient(to top, transparent, rgba(255,200,50,0.55), transparent)',
              transformOrigin:'center center',
              rotate:deg,
            }}
            initial={{ scaleY:0, opacity:0 }}
            animate={{ scaleY:[0,1.3,1], opacity:[0,0.85,0.32] }}
            transition={{ duration:0.9, delay:0.1+i*0.03 }}
          />
        ))}
      </div>

      {/* Central glow pulse */}
      <motion.div className="absolute inset-0 pointer-events-none"
        style={{ background:'radial-gradient(circle at center, rgba(255,200,50,0.26) 0%, transparent 52%)' }}
        animate={{ opacity:[0.3,0.9,0.35,0.8,0.3] }}
        transition={{ duration:2.5, repeat:Infinity }}
      />

      {/* Gold sparkle dots */}
      {GOLD_DOTS.map((p, i) => (
        <motion.div key={i} className="absolute rounded-full pointer-events-none"
          style={{
            left:`${p.x}%`, top:`${p.y}%`, width:4, height:4,
            background:'#ffd700', boxShadow:'0 0 10px #ffd700',
            transform:'translate(-50%,-50%)',
          }}
          initial={{ scale:0, opacity:0 }}
          animate={{ scale:[0,1.8,0], opacity:[0,1,0] }}
          transition={{ duration:1.4, delay:0.25+i*0.16, repeat:Infinity, repeatDelay:0.6 }}
        />
      ))}

      {/* Center content */}
      <div className="relative z-10 flex flex-col items-center gap-3 text-center px-6">
        <motion.div className="relative"
          initial={{ scale:0, opacity:0 }} animate={{ scale:1, opacity:1 }}
          transition={{ delay:0.35, type:'spring', stiffness:220, damping:14 }}>
          {/* Glow clone */}
          <motion.p className="font-rpg font-bold absolute inset-0 blur-xl select-none"
            style={{ fontSize:'clamp(3rem,11vw,6.5rem)', color:'#ffd700' }}
            animate={{ opacity:[0.4,0.9,0.4] }} transition={{ duration:1.6, repeat:Infinity }}>
            ✦ SSR ✦
          </motion.p>
          <p className="font-rpg font-bold relative select-none"
            style={{ fontSize:'clamp(3rem,11vw,6.5rem)', color:'#ffd700',
              textShadow:'0 0 30px rgba(255,215,0,0.45)' }}>
            ✦ SSR ✦
          </p>
        </motion.div>

        <motion.p className="font-rpg text-sm tracking-[0.3em]"
          style={{ color:'rgba(255,220,100,0.75)' }}
          initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }}
          transition={{ delay:1.0 }}>
          超稀有好友降臨
        </motion.p>
      </div>
    </motion.div>
  )
}

/* ── NormalEffect (skippable) ──────────────────────────────────────────── */
function NormalEffect({ onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 1800); return () => clearTimeout(t) }, [onDone])

  return (
    <motion.div className="absolute inset-0 flex items-center justify-center"
      style={{ background:'rgba(10,7,4,0.97)' }}
      initial={{ opacity:0 }} animate={{ opacity:1 }}
      exit={{ opacity:0, transition:{ duration:0.3 } }}>

      <motion.span className="text-7xl select-none"
        animate={{ rotate:[0,720], scale:[0.3,1.3,1] }}
        transition={{ duration:1.4, ease:'easeOut' }}>
        🎊
      </motion.span>

      {/* Skip button — appears after brief delay */}
      <motion.button onClick={onDone}
        initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.35 }}
        className="absolute bottom-10 right-10 font-rpg text-xs px-4 py-2 rounded-full"
        style={{
          border:'1px solid rgba(255,255,255,0.22)',
          color:'rgba(255,255,255,0.65)',
          background:'rgba(255,255,255,0.07)',
        }}>
        SKIP →
      </motion.button>
    </motion.div>
  )
}

/* ── ResultCard ─────────────────────────────────────────────────────────── */
function ResultCard({ result, inventory, onClick }) {
  const { wish, rarity, isNew } = result
  const cfg        = RC[rarity] ?? RC.R
  const count      = inventory[wish.id] ?? 1
  const breakLevel = isNew ? null : count - 1
  const breakLabel = breakLevel === null ? null
    : breakLevel >= LIMIT_BREAK_MAX ? '+MAX' : `+${breakLevel}`

  return (
    <motion.div onClick={onClick}
      className="relative rounded-xl overflow-hidden cursor-pointer select-none"
      style={{ border:`2px solid ${cfg.border}`, boxShadow:`0 4px 18px ${cfg.glow}`, aspectRatio:'3/4' }}
      whileHover={{ scale:1.08, y:-4, transition:SPRING }}
      whileTap={{ scale:0.93, transition:SPRING }}>

      {/* BG gradient */}
      <div className="absolute inset-0"
        style={{ background:`linear-gradient(160deg,${wish.color}18,${wish.color}55)` }} />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 px-1">
        {wish.avatar
          ? <img src={wish.avatar} alt={wish.name} className="w-12 h-12 rounded-full object-cover" />
          : <span className="text-4xl">{wish.emoji}</span>
        }
        <p className="text-[11px] font-rpg font-semibold text-center leading-tight"
          style={{ color:'rgba(255,248,230,0.9)' }}>
          {wish.name}
        </p>

        {/* Break level badge */}
        {!isNew && breakLabel && (
          <motion.span className="text-[10px] font-rpg font-black"
            style={{ color:cfg.border, textShadow:`0 0 8px ${cfg.border}99` }}
            animate={{ opacity:[0.7,1,0.7] }}
            transition={{ duration:2, repeat:Infinity }}>
            {breakLabel}
          </motion.span>
        )}
      </div>

      {/* Rarity badge */}
      <div className="absolute top-1.5 left-1.5">
        <span className={`text-[9px] font-rpg font-bold px-1.5 py-0.5 rounded-full ${cfg.badge}`}>
          {rarity}
        </span>
      </div>

      {/* NEW! badge — pulsing gold */}
      {isNew && (
        <motion.div className="absolute top-1.5 right-1.5"
          animate={{ scale:[1,1.2,1], opacity:[1,0.6,1] }}
          transition={{ duration:1.1, repeat:Infinity }}>
          <span className="text-[9px] font-rpg font-black px-1.5 py-0.5 rounded-full"
            style={{ background:'#ffd700', color:'#1a0a00' }}>
            NEW!
          </span>
        </motion.div>
      )}
    </motion.div>
  )
}

/* ── ResultScreen ───────────────────────────────────────────────────────── */
function ResultScreen({ results, inventory, onClose, onCardClick }) {
  const isSingle = results.length === 1

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center p-4 gap-5"
      style={{ background:'rgba(8,5,2,0.94)', backdropFilter:'blur(10px)' }}
      initial={{ opacity:0 }} animate={{ opacity:1 }}
      exit={{ opacity:0, transition:{ duration:0.3 } }}>

      <motion.p className="font-rpg text-xs tracking-[0.4em] text-white"
        style={{ opacity:0 }}
        initial={{ opacity:0, y:-10 }} animate={{ opacity:0.4, y:0 }} transition={{ delay:0.15 }}>
        ✦ RESULT ✦
      </motion.p>

      {/* Single card — large and centred */}
      {isSingle && (
        <motion.div style={{ width: RESULT_CARD.singleWidth }}
          initial={{ scale:0.3, opacity:0, y:30 }} animate={{ scale:1, opacity:1, y:0 }}
          transition={{ delay:0.1, type:'spring', stiffness:240, damping:18 }}>
          <ResultCard result={results[0]} inventory={inventory}
            onClick={() => onCardClick(results[0])} />
        </motion.div>
      )}

      {/* Ten-pull grid — cols/gap/maxWidth all from config */}
      {!isSingle && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${RESULT_CARD.tenCols}, 1fr)`,
          gap: RESULT_CARD.tenGap,
          width: '100%',
          maxWidth: RESULT_CARD.tenMaxWidth,
        }}>
          {results.map((r, i) => (
            <motion.div key={i}
              initial={{ scale:0, opacity:0, y:24 }} animate={{ scale:1, opacity:1, y:0 }}
              transition={{ delay:0.05+i*0.07, type:'spring', stiffness:280, damping:22 }}>
              <ResultCard result={r} inventory={inventory} onClick={() => onCardClick(r)} />
            </motion.div>
          ))}
        </div>
      )}

      <motion.p className="text-[10px] font-rpg text-white"
        style={{ opacity:0 }}
        initial={{ opacity:0 }} animate={{ opacity:0.38 }} transition={{ delay:0.8 }}>
        點擊卡片可播放好友的祝福 ♪
      </motion.p>

      <motion.button onClick={onClose}
        className="px-10 py-3 rounded-full font-rpg font-semibold text-sm"
        style={{ background:'rgba(212,163,115,0.92)', color:'#1a0a00',
          boxShadow:'0 4px 0 rgba(120,72,36,0.45)' }}
        initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.5 }}
        whileHover={{ scale:1.04, y:-2 }} whileTap={{ scale:0.94, y:3, transition:SPRING }}>
        ✦ 繼續抽 ✦
      </motion.button>
    </motion.div>
  )
}

/* ── GachaAnimation (main export) ───────────────────────────────────────── */
export default function GachaAnimation({ results, inventory, onClose, onCardClick }) {
  const [innerPhase, setInnerPhase] = useState('effect')

  const tier = useMemo(() => {
    if (results.some(r => r.rarity === 'UR'))  return 'UR'
    if (results.some(r => r.rarity === 'SSR')) return 'SSR'
    return 'NORMAL'
  }, [results])

  const advance = useCallback(() => setInnerPhase('result'), [])

  return (
    // Outer wrapper: fixed z-200, handles enter/exit for the whole overlay
    <motion.div className="fixed inset-0 z-[200]"
      initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      transition={{ duration:0.25 }}>
      <AnimatePresence mode="wait">
        {innerPhase === 'effect'
          ? tier === 'UR'    ? <UREffect     key="ur"   onDone={advance} />
            : tier === 'SSR' ? <SSREffect    key="ssr"  onDone={advance} />
            :                  <NormalEffect key="norm" onDone={advance} />
          : <ResultScreen key="result" results={results} inventory={inventory}
              onClose={onClose} onCardClick={onCardClick} />
        }
      </AnimatePresence>
    </motion.div>
  )
}
