/* 撕裂紙邊分隔器 — 放在兩個 section 之間 */
export default function TornEdge({ fill = '#FFF9E3', flip = false, height = 28 }) {
  const d = flip
    ? 'M0,6 Q60,18 120,8 T240,14 T360,6 T480,14 T600,6 T720,14 T840,6 T960,14 T1080,6 T1200,14 T1320,6 T1440,12 L1440,0 L0,0 Z'
    : 'M0,20 Q60,8 120,16 T240,10 T360,20 T480,10 T600,20 T720,10 T840,20 T960,10 T1080,20 T1200,10 T1320,20 T1440,14 L1440,28 L0,28 Z'

  return (
    <div
      className="torn-edge pointer-events-none"
      style={{ height, marginTop: flip ? 0 : -1, marginBottom: flip ? -1 : 0, zIndex: 1, position: 'relative' }}
      aria-hidden
    >
      <svg
        viewBox={`0 0 1440 ${height}`}
        preserveAspectRatio="none"
        style={{ height }}
      >
        <path d={d} fill={fill} />
      </svg>
    </div>
  )
}
