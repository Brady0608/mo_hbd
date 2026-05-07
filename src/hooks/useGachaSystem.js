import { useState, useEffect, useCallback, useMemo } from 'react'
import { ALL_WISHES } from '../data/wishes'
import { RARITY_RATES, PITY_THRESHOLD, UR_PITY_THRESHOLD, POOL_GUARANTEE } from '../data/config'

// 資料結構版本：pity 邏輯變動時遞增，避免讀到舊格式
const STORAGE_KEY = 'momo_gacha_v3'

// 神秘嘉賓不進抽卡池
const GACHA_WISHES   = ALL_WISHES.filter(w => !w.isSecret)
export const SECRET_WISHES = ALL_WISHES.filter(w => w.isSecret)  // 依序排列

// HIGH 池包含 UR + SSR 兩種標籤，drawEngine 依稀有度標籤分開處理
const HIGH_RARITIES = new Set(['UR', 'SSR'])

/* ── buildPools ───────────────────────────────────────────────────────────────
   回傳 { pools, rarityMap }
   pools    = { HIGH: [id,...], SR: [id,...], R: [id,...] }
   rarityMap = { [id]: 'UR' | 'SSR' | 'SR' | 'R' }
   HIGH 池中同時含 UR 標籤與 SSR 標籤的好友，由 rarityMap 區分。
   ─────────────────────────────────────────────────────────────────────────── */
function buildPools(wishes = GACHA_WISHES, guarantee = POOL_GUARANTEE) {
  const highForced = []
  const srForced   = []
  const rForced    = []
  const flexible   = []
  const rarityMap  = {}

  for (const w of wishes) {
    if (w.forceRarity === 'UR' || w.forceRarity === 'SSR') {
      highForced.push(w.id); rarityMap[w.id] = w.forceRarity
    } else if (w.forceRarity === 'SR') {
      srForced.push(w.id);   rarityMap[w.id] = 'SR'
    } else if (w.forceRarity === 'R') {
      rForced.push(w.id);    rarityMap[w.id] = 'R'
    } else {
      flexible.push(w.id)
    }
  }

  const flex  = [...flexible].sort(() => Math.random() - 0.5)
  const pools = { HIGH: [...highForced], SR: [...srForced], R: [...rForced] }

  // 補足 HIGH 池最低保障
  const curUR  = highForced.filter(id => rarityMap[id] === 'UR').length
  const curSSR = highForced.filter(id => rarityMap[id] === 'SSR').length
  const needUR  = Math.max(0, (guarantee.UR  ?? 1) - curUR)
  const needSSR = Math.max(0, (guarantee.SSR ?? 2) - curSSR)

  for (let i = 0; i < needUR  && flex.length; i++) { const id = flex.shift(); pools.HIGH.push(id); rarityMap[id] = 'UR'  }
  for (let i = 0; i < needSSR && flex.length; i++) { const id = flex.shift(); pools.HIGH.push(id); rarityMap[id] = 'SSR' }

  // 剩餘 flex 約 1:2 分配到 SR / R
  flex.forEach((id, i) => {
    if (i % 3 === 0) { pools.SR.push(id); rarityMap[id] = 'SR' }
    else             { pools.R.push(id);  rarityMap[id] = 'R'  }
  })

  return { pools, rarityMap }
}

/* ── weightedRandom ───────────────────────────────────────────────────────── */
function weightedRandom(rates) {
  const entries = Object.entries(rates)
  const total   = entries.reduce((s, [, w]) => s + w, 0)
  let r = Math.random() * total
  for (const [rarity, weight] of entries) { r -= weight; if (r <= 0) return rarity }
  return entries[entries.length - 1][0]
}

/* ── drawEngine (純函數) ──────────────────────────────────────────────────────
   保底規則：
   ① SSR 保底（ssrPityCounter >= PITY_THRESHOLD）
       → 只從 HIGH 池內「SSR 標籤」的好友出貨，不包含 UR
   ② UR 保底（urPityCounter >= UR_PITY_THRESHOLD）
       → 由 claimUR() 手動觸發，不在此函數處理
   ③ 十連第 10 抽 SR 保底（forceSrMin）
       → 若正常抽到 R，強制升為 SR
   ─────────────────────────────────────────────────────────────────────────── */
function drawEngine(pools, rarityMap, ssrPity, opts = {}) {
  const { forceSrMin = false } = opts

  // ① SSR 保底：從 HIGH 池中篩出 SSR 標籤的好友
  if (ssrPity >= PITY_THRESHOLD) {
    const ssrOnly = (pools.HIGH ?? []).filter(id => rarityMap[id] === 'SSR')
    if (ssrOnly.length) {
      const id   = ssrOnly[Math.floor(Math.random() * ssrOnly.length)]
      const wish = ALL_WISHES.find(w => w.id === id)
      if (wish) return { wish, rarity: 'SSR' }
    }
    // SSR 池為空時降為 SR（不應發生，由 POOL_GUARANTEE 保障）
  }

  // ② 正常機率決定目標稀有度
  let target = weightedRandom(RARITY_RATES)

  // ③ 十連第 10 抽 SR 保底
  if (forceSrMin && target === 'R') target = 'SR'

  // ④ UR/SSR 分別只從 HIGH 池中對應標籤的好友抽取（確保機率獨立）
  //    SR / R 各自有池
  if (HIGH_RARITIES.has(target)) {
    // 先嘗試目標標籤（UR → 只抽 UR 標籤；SSR → 只抽 SSR 標籤）
    const labeled = (pools.HIGH ?? []).filter(id => rarityMap[id] === target)
    const pool    = labeled.length ? labeled : (pools.HIGH ?? [])  // 無對應標籤時 fallback 整個 HIGH
    if (pool.length) {
      const id   = pool[Math.floor(Math.random() * pool.length)]
      const wish = ALL_WISHES.find(w => w.id === id)
      if (wish) return { wish, rarity: rarityMap[id] ?? target }
    }
    // HIGH 池全空時降級到 SR
    target = 'SR'
  }

  // SR / R 各自池
  const pool = pools[target] ?? []
  if (pool.length) {
    const id   = pool[Math.floor(Math.random() * pool.length)]
    const wish = ALL_WISHES.find(w => w.id === id)
    if (wish) return { wish, rarity: rarityMap[id] ?? target }
  }

  // 終極後備（理論上不應走到這裡）
  for (const key of ['SR', 'R', 'HIGH']) {
    const fb = pools[key] ?? []
    if (!fb.length) continue
    const id   = fb[Math.floor(Math.random() * fb.length)]
    const wish = ALL_WISHES.find(w => w.id === id)
    if (wish) return { wish, rarity: rarityMap[id] ?? 'R' }
  }
  const wish = ALL_WISHES[Math.floor(Math.random() * ALL_WISHES.length)]
  return { wish, rarity: rarityMap[wish.id] ?? 'R' }
}

/* ── Storage ──────────────────────────────────────────────────────────────── */
function loadStorage() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) } catch { return null }
}
function saveStorage(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)) } catch {}
}

/* ── Hook ─────────────────────────────────────────────────────────────────── */
export function useGachaSystem() {
  const [_init] = useState(() => {
    const saved = loadStorage()
    if (saved?.pools && saved?.rarityMap) return saved
    const { pools, rarityMap } = buildPools(GACHA_WISHES)
    return { pools, rarityMap, totalPulls: 0, ssrPityCounter: 0, urPityCounter: 0, inventory: {}, secretsUnlocked: 0 }
  })

  const [pools,           setPools]           = useState(_init.pools)
  const [rarityMap,       setRarityMap]       = useState(_init.rarityMap)
  const [totalPulls,      setTotalPulls]      = useState(_init.totalPulls      ?? 0)
  const [ssrPityCounter,  setSsrPityCounter]  = useState(_init.ssrPityCounter  ?? 0)
  const [urPityCounter,   setUrPityCounter]   = useState(_init.urPityCounter   ?? 0)
  const [inventory,       setInventory]       = useState(_init.inventory       ?? {})
  const [secretsUnlocked, setSecretsUnlocked] = useState(_init.secretsUnlocked ?? 0)

  useEffect(() => {
    saveStorage({ pools, rarityMap, totalPulls, ssrPityCounter, urPityCounter, inventory, secretsUnlocked })
  }, [pools, rarityMap, totalPulls, ssrPityCounter, urPityCounter, inventory, secretsUnlocked])

  /* ── 衍生值 ─────────────────────────────────────────────────────────────── */
  const isUnlocked = useCallback((id) => (inventory[id] ?? 0) > 0, [inventory])
  const getCount   = useCallback((id) =>  inventory[id] ?? 0,      [inventory])

  // 只計算一般祝福（不含神秘嘉賓）的解鎖數
  const unlockedCount = useMemo(
    () => GACHA_WISHES.filter(w => (inventory[w.id] ?? 0) > 0).length,
    [inventory]
  )

  const allRegularUnlocked = unlockedCount === GACHA_WISHES.length

  const ssrPityProgress = Math.min(1, ssrPityCounter / PITY_THRESHOLD)
  const urPityProgress  = Math.min(1, urPityCounter  / UR_PITY_THRESHOLD)
  const canClaimUR      = urPityCounter >= UR_PITY_THRESHOLD

  /* ── drawSingle ─────────────────────────────────────────────────────────── */
  const drawSingle = useCallback(() => {
    const result = drawEngine(pools, rarityMap, ssrPityCounter)
    const isUR   = result.rarity === 'UR'
    const isHigh = HIGH_RARITIES.has(result.rarity)
    const isNew  = (inventory[result.wish.id] ?? 0) === 0

    setTotalPulls(p => p + 1)
    setSsrPityCounter(isHigh ? 0 : ssrPityCounter + 1)   // SSR 與 UR 都歸零 SSR 保底
    setUrPityCounter(isUR   ? 0 : urPityCounter  + 1)    // 只有 UR 歸零 UR 保底
    setInventory(prev => ({
      ...prev,
      [result.wish.id]: (prev[result.wish.id] ?? 0) + 1,
    }))

    return [{ ...result, isNew }]
  }, [pools, rarityMap, ssrPityCounter, urPityCounter, inventory])

  /* ── drawTen ────────────────────────────────────────────────────────────── */
  const drawTen = useCallback(() => {
    const results      = []
    let ssrPity        = ssrPityCounter
    let urPity         = urPityCounter
    const newInventory = { ...inventory }
    let hasSrOrHigher  = false

    for (let i = 0; i < 10; i++) {
      const forceSrMin = (i === 9) && !hasSrOrHigher

      const result   = drawEngine(pools, rarityMap, ssrPity, { forceSrMin })
      const isUR     = result.rarity === 'UR'
      const isHigh   = HIGH_RARITIES.has(result.rarity)
      const isSrPlus = isHigh || result.rarity === 'SR'
      const isNew    = (newInventory[result.wish.id] ?? 0) === 0

      if (isSrPlus) hasSrOrHigher = true
      ssrPity = isHigh ? 0 : ssrPity + 1
      urPity  = isUR   ? 0 : urPity  + 1
      newInventory[result.wish.id] = (newInventory[result.wish.id] ?? 0) + 1
      results.push({ ...result, isNew })
    }

    setTotalPulls(p => p + 10)
    setSsrPityCounter(ssrPity)
    setUrPityCounter(urPity)
    setInventory(newInventory)
    return results
  }, [pools, rarityMap, ssrPityCounter, urPityCounter, inventory])

  /* ── claimUR（200 抽 UR 保底，手動領取）────────────────────────────────── */
  const claimUR = useCallback(() => {
    if (urPityCounter < UR_PITY_THRESHOLD) return null

    const urPool = (pools.HIGH ?? []).filter(id => rarityMap[id] === 'UR')
    if (!urPool.length) return null

    const id   = urPool[Math.floor(Math.random() * urPool.length)]
    const wish = ALL_WISHES.find(w => w.id === id)
    if (!wish) return null

    const isNew = (inventory[wish.id] ?? 0) === 0

    setTotalPulls(p => p + 1)
    setSsrPityCounter(0)
    setUrPityCounter(0)
    setInventory(prev => ({ ...prev, [wish.id]: (prev[wish.id] ?? 0) + 1 }))

    return { wish, rarity: 'UR', isNew }
  }, [pools, rarityMap, inventory, urPityCounter])

  /* ── unlockAll（全覽，不解鎖神秘嘉賓）────────────────────────────────── */
  const unlockAll = useCallback(() => {
    setInventory(prev => {
      const next = { ...prev }
      GACHA_WISHES.forEach(w => { if (!next[w.id]) next[w.id] = 1 })
      return next
    })
  }, [])

  /* ── unlockNextSecret（依序解鎖下一位神秘嘉賓）────────────────────────── */
  const unlockNextSecret = useCallback(() => {
    setSecretsUnlocked(n => Math.min(n + 1, SECRET_WISHES.length))
  }, [])

  /* ── resetGacha ─────────────────────────────────────────────────────────── */
  const resetGacha = useCallback(() => {
    const { pools: p, rarityMap: rm } = buildPools(GACHA_WISHES)
    setPools(p); setRarityMap(rm)
    setTotalPulls(0); setSsrPityCounter(0); setUrPityCounter(0); setInventory({}); setSecretsUnlocked(0)
    saveStorage({ pools: p, rarityMap: rm, totalPulls: 0, ssrPityCounter: 0, urPityCounter: 0, inventory: {}, secretsUnlocked: 0 })
  }, [])

  return {
    totalPulls, ssrPityCounter, ssrPityProgress,
    urPityCounter, urPityProgress, canClaimUR,
    inventory, pools, rarityMap,
    isUnlocked, getCount, unlockedCount, allRegularUnlocked,
    secretsUnlocked, unlockNextSecret,
    drawSingle, drawTen, claimUR,
    unlockAll, resetGacha,
  }
}
