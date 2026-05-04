import { RARITY_RATES } from '../data/config'

/**
 * 依加權機率抽出一個稀有度。
 * @param {string|null} forceRarity - 若填入稀有度字串則直接回傳（強制指定）
 * @param {object} rates - 機率權重表，預設使用 config.js 的 RARITY_RATES
 * @returns {string} 稀有度字串，例如 'R' | 'SR' | 'SSR' | 'UR'
 */
export function drawRarity(forceRarity = null, rates = RARITY_RATES) {
  // forceRarity 強制指定（wishes.js 裡 forceRarity 欄位）
  if (forceRarity && forceRarity in rates) return forceRarity

  const entries = Object.entries(rates)
  const total   = entries.reduce((sum, [, w]) => sum + w, 0)
  let   rand    = Math.random() * total

  for (const [rarity, weight] of entries) {
    rand -= weight
    if (rand <= 0) return rarity
  }

  // fallback（理論上不會到這裡）
  return entries[entries.length - 1][0]
}
