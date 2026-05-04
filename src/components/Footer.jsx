import { motion } from 'framer-motion'

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="relative w-full py-10 text-center parchment-bg"
      style={{ borderTop: '1.5px solid rgba(212,163,115,0.24)' }}
    >
      {/* 角框裝飾 */}
      {['top-3 left-4', 'top-3 right-4'].map((pos, i) => (
        <div key={i} className={`absolute ${pos} w-8 h-8 pointer-events-none`}
          style={{
            borderColor: 'rgba(212,163,115,0.40)',
            borderStyle: 'solid',
            borderWidth: i === 0 ? '2px 0 0 2px' : '2px 2px 0 0',
          }} aria-hidden />
      ))}

      <div className="ornament-divider max-w-xs mx-auto mb-6" style={{ margin: '0 auto 1.5rem' }}>
        <span className="text-xs" style={{ color: 'rgba(212,163,115,0.7)' }}>⚔️</span>
      </div>

      <p className="font-rpg text-sm tracking-widest shimmer-text">
        ✦ Happy Birthday, MoMo ✦
      </p>
      <p className="mt-2 text-xs opacity-45" style={{ color: '#4D3D2F' }}>
        MOMO的冒險紀行 · 每一天都是新章節
      </p>

      <div className="ornament-divider max-w-xs mx-auto mt-6" style={{ margin: '1.5rem auto 0' }}>
        <span className="text-xs" style={{ color: 'rgba(212,163,115,0.7)' }}>◈</span>
      </div>
    </motion.footer>
  )
}
