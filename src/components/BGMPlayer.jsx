import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const BGM_SRC = './audio/bgm.mp3'

export default function BGMPlayer() {
  const audioRef        = useRef(null)
  const [playing,   setPlaying]   = useState(false)
  const [visible,   setVisible]   = useState(false)
  const [blocked,   setBlocked]   = useState(false) // 瀏覽器擋住 autoplay

  useEffect(() => {
    let active = true

    const audio = new Audio(BGM_SRC)
    audio.loop    = true
    audio.volume  = 0.35
    audio.preload = 'auto'
    audioRef.current = audio

    const onMeta = () => {
      if (!active) return
      setVisible(true)
      audio.play()
        .then(() => { if (active) { setPlaying(true); setBlocked(false) } })
        .catch(() => {
          if (!active) return
          setBlocked(true)
          const unlock = () => {
            audio.play()
              .then(() => { setPlaying(true); setBlocked(false) })
              .catch(() => {})
            window.removeEventListener('click',   unlock)
            window.removeEventListener('keydown', unlock)
          }
          window.addEventListener('click',   unlock)
          window.addEventListener('keydown', unlock)
        })
    }

    audio.addEventListener('loadedmetadata', onMeta, { once: true })

    return () => {
      active = false
      audio.removeEventListener('loadedmetadata', onMeta)
      audio.pause()
      audio.src = '' // 完全停止載入，防止 Strict Mode 重複執行時殘留播放
    }
  }, [])

  const toggle = (e) => {
    e.stopPropagation()
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
      setPlaying(false)
    } else {
      audio.play().then(() => { setPlaying(true); setBlocked(false) }).catch(() => {})
    }
  }

  if (!visible) return null

  return (
    <>
      {/* 被擋住時的提示條 */}
      <AnimatePresence>
        {blocked && (
          <motion.div
            key="hint"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ type: 'spring', stiffness: 380, damping: 24 }}
            className="fixed bottom-20 right-4 z-499 px-4 py-2 rounded-full text-[11px] font-rpg pointer-events-none select-none"
            style={{
              background: 'rgba(255,252,235,0.92)',
              border: '1.5px solid rgba(212,163,115,0.4)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 16px rgba(61,48,39,0.12)',
              color: '#8A6940',
            }}
          >
            🎵 點擊任意處開始音樂
          </motion.div>
        )}
      </AnimatePresence>

      {/* 浮動按鈕 */}
      <motion.button
        onClick={toggle}
        initial={{ opacity: 0, scale: 0.7, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 340, damping: 22, delay: 0.5 }}
        title={playing ? '暫停背景音樂' : '播放背景音樂'}
        className="fixed bottom-6 right-6 z-500 w-11 h-11 rounded-full flex items-center justify-center select-none"
        style={{
          background: 'rgba(255,252,235,0.92)',
          border: '1.5px solid rgba(212,163,115,0.45)',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 4px 0 rgba(184,131,85,0.25), 0 6px 20px rgba(61,48,39,0.14)',
        }}
        whileHover={{ scale: 1.12, y: -2 }}
        whileTap={{ scale: 0.88, y: 2, transition: { type: 'spring', stiffness: 500, damping: 16 } }}
      >
        <motion.span
          className="text-lg leading-none"
          animate={playing
            ? { rotate: [0, 15, -10, 15, 0] }
            : { rotate: 0, opacity: 0.4 }}
          transition={playing
            ? { duration: 2.4, repeat: Infinity, ease: 'easeInOut' }
            : { duration: 0.25 }}
        >
          🎵
        </motion.span>

        <AnimatePresence>
          {playing && (
            <motion.span
              key="ring"
              className="absolute inset-0 rounded-full pointer-events-none"
              initial={{ opacity: 0.55, scale: 1 }}
              animate={{ opacity: 0, scale: 1.75 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
              style={{ border: '1.5px solid rgba(212,163,115,0.5)' }}
            />
          )}
        </AnimatePresence>
      </motion.button>
    </>
  )
}
