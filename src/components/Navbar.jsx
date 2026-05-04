import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const NAV_ITEMS = [
  { id: 'hero',           label: '起點',    icon: '⚔️' },
  { id: 'adventure-map',  label: '冒險地圖', icon: '🗺️' },
  { id: 'wishes-gacha',   label: '祝福扭蛋', icon: '✨' },
]

const SPRING = { type: 'spring', stiffness: 400, damping: 28 }

export default function Navbar() {
  const [scrolled, setScrolled]       = useState(false)
  const [active, setActive]           = useState('hero')
  const [menuOpen, setMenuOpen]       = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const obs = NAV_ITEMS.map(({ id }) => {
      const el = document.getElementById(id)
      if (!el) return null
      const o = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) setActive(id) },
        { threshold: 0.35 }
      )
      o.observe(el)
      return o
    })
    return () => obs.forEach(o => o?.disconnect())
  }, [])

  const scrollTo = id => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'navbar-glass shadow-sm' : 'bg-transparent'
      }`}
    >
      <div
        className="w-full max-w-5xl h-14 flex items-center justify-between px-4 sm:px-6"
        style={{ margin: '0 auto' }}
      >
        {/* Logo */}
        <motion.button
          onClick={() => scrollTo('hero')}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96, transition: SPRING }}
          className="font-rpg text-sm sm:text-base font-semibold shimmer-text tracking-wider select-none"
        >
          ✦ MoMo's Quest
        </motion.button>

        {/* Desktop nav */}
        <div className="hidden sm:flex items-center gap-1">
          {NAV_ITEMS.map(({ id, label, icon }) => (
            <motion.button
              key={id}
              onClick={() => scrollTo(id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.94, transition: SPRING }}
              className={`relative px-3 py-1.5 rounded-full text-sm transition-colors duration-200 font-body
                ${active === id ? 'text-[#8A6940] font-semibold' : 'text-[#4D3D2F] hover:text-[#8A6940]'}`}
            >
              {active === id && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-full"
                  style={{ background: 'rgba(212,163,115,0.16)', border: '1px solid rgba(212,163,115,0.38)' }}
                  transition={SPRING}
                />
              )}
              <span className="relative flex items-center gap-1.5">
                <span className="text-xs">{icon}</span>
                {label}
              </span>
            </motion.button>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          className="sm:hidden p-2 rounded-lg text-[#4D3D2F]"
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Toggle menu"
        >
          {[0,1,2].map(i => (
            <motion.span
              key={i}
              animate={
                i === 0 ? { rotate: menuOpen ? 45 : 0,  y: menuOpen ?  8 : 0 }
              : i === 1 ? { opacity: menuOpen ? 0 : 1 }
              :            { rotate: menuOpen ? -45 : 0, y: menuOpen ? -8 : 0 }
              }
              className="block w-5 h-0.5 bg-current mb-1 last:mb-0 origin-center"
            />
          ))}
        </button>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="sm:hidden overflow-hidden navbar-glass border-t border-[rgba(212,163,115,0.2)]"
          >
            <div className="px-4 py-3 flex flex-col gap-1">
              {NAV_ITEMS.map(({ id, label, icon }) => (
                <motion.button
                  key={id}
                  onClick={() => scrollTo(id)}
                  whileTap={{ scale: 0.97, transition: SPRING }}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-left transition-all
                    ${active === id
                      ? 'bg-[rgba(212,163,115,0.16)] text-[#8A6940] font-semibold'
                      : 'text-[#4D3D2F] hover:bg-[rgba(212,163,115,0.09)]'
                    }`}
                >
                  <span>{icon}</span>{label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
