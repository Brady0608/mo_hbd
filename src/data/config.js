/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║           扭蛋稀有度機率設定                                   ║
 * ╠══════════════════════════════════════════════════════════════╣
 * ║  數值為「比例權重」，系統會自動換算成百分比。                     ║
 * ║  例如預設 40:30:20:10 → R=40%, SR=30%, SSR=20%, UR=10%       ║
 * ║                                                              ║
 * ║  調整方式：直接修改數字，重新執行 npm run build 即生效。          ║
 * ║                                                              ║
 * ║  範例（提高 UR 機率）：                                        ║
 * ║    R: 35, SR: 30, SSR: 20, UR: 15                           ║
 * ║                                                              ║
 * ║  範例（均等）：                                               ║
 * ║    R: 25, SR: 25, SSR: 25, UR: 25                           ║
 * ╚══════════════════════════════════════════════════════════════╝
 */

export const RARITY_RATES = {
  R:   70,   // 普通
  SR:  28.7,   // 稀有
  SSR: 1,   // 超稀有
  UR:  0.3,   // 極稀有
}

// ssrPityCounter 累積到此值時，該抽強制從 SSR 池出貨（第 50 抽保底，不含 UR）
export const PITY_THRESHOLD = 49

// urPityCounter 累積到此值時，可手動兌換一張 UR（200 抽保底）
export const UR_PITY_THRESHOLD = 200

// 卡池最低人數保障（不足則從隨機好友自動補入）
export const POOL_GUARANTEE = { UR: 1, SSR: 2 }

// 突破等級上限：同一好友抽到第 LIMIT_BREAK_MAX+1 次（含）後顯示 +MAX
// 例如設為 5 → 累計 ≥ 6 次顯示 +MAX；設為 3 → 累計 ≥ 4 次顯示 +MAX
export const LIMIT_BREAK_MAX = 20

// ── 蛋池資訊彈窗：角色卡片尺寸 ─────────────────────────────────────────
export const POOL_INFO = {
  cardW: 76,   // 每張角色卡片寬度 (px)，高度依 3:4 比例自動
  cols:  4,    // 每列顯示幾張（建議 3-5）
}

// ── 結算畫面卡片尺寸（直接改數字，重新 npm run dev 即生效）──────────────
export const RESULT_CARD = {
  // 單抽：卡片寬度 (px)
  singleWidth: 240,
  // 十連抽：欄數、間距 (px)、容器最大寬度 (px)
  tenCols:     5,
  tenGap:      14,
  tenMaxWidth: 720,
}

/**
 * 各稀有度顯示設定（邊框色 / Badge 樣式 / 光暈）
 * 若需新增稀有度等級，在此同步加入即可。
 */
export const RARITY_DISPLAY = {
  R:   { label: 'R',   badge: 'bg-[rgba(122,145,141,0.22)] text-[#5A716D]', border: 'rgba(122,145,141,0.75)', glow: 'rgba(122,145,141,0.28)' },
  SR:  { label: 'SR',  badge: 'bg-[rgba(212,163,115,0.22)] text-[#8A6940]', border: 'rgba(212,163,115,0.75)', glow: 'rgba(212,163,115,0.32)' },
  SSR: { label: 'SSR', badge: 'bg-[rgba(217,148,126,0.22)] text-[#A05040]', border: 'rgba(217,148,126,0.75)', glow: 'rgba(217,148,126,0.28)' },
  UR:  { label: 'UR',  badge: 'bg-[rgba(155,127,212,0.22)] text-[#7A5AB8]', border: 'rgba(155,127,212,0.75)', glow: 'rgba(155,127,212,0.38)' },
}
