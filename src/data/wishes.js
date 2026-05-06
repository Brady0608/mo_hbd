/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║           Wishes Gacha — 扭蛋祝福資料                        ║
 * ╠══════════════════════════════════════════════════════════════╣
 * ║  新增好友：在下方陣列中複製一個物件並填入資料                    ║
 * ║                                                              ║
 * ║  ★ 稀有度由系統隨機抽籤決定（機率見 src/data/config.js）        ║
 * ║    forceRarity（選填）→ 強制指定稀有度，不走隨機               ║
 * ║      null      → 每次抽籤隨機決定                             ║
 * ║      'R'       → 永遠顯示為普通                               ║
 * ║      'SR'      → 永遠顯示為稀有                               ║
 * ║      'SSR'     → 永遠顯示為超稀有                             ║
 * ║      'UR'      → 永遠顯示為極稀有                             ║
 * ║                                                              ║
 * ║  media（祝福媒體）三種格式任選其一：                            ║
 * ║    YouTube 影片 → 'https://www.youtube.com/embed/影片ID'     ║
 * ║    本地影片     → './videos/wishes/檔名.mp4'                  ║
 * ║    本地錄音     → './audio/wishes/檔名.mp3'                   ║
 * ║    無媒體       → null（只顯示文字祝福）                       ║
 * ║                                                              ║
 * ║  avatar（頭像照片）：                                          ║
 * ║    null                         → 顯示 emoji                 ║
 * ║    './images/wishes/檔名.jpg'   → 顯示圓形大頭貼              ║
 * ╚══════════════════════════════════════════════════════════════╝
 */

export const ALL_WISHES = [
  {
    id: 1,
    name: '小明',
    emoji: '🌿',
    avatar: null,
    color: '#7A918D',
    forceRarity: null,              // null = 隨機抽籤
    from: '國中死黨',
    media: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    message: '好友相伴，是人生最大的財富。生日快樂，願你每天都充滿能量！',
  },
  {
    id: 2,
    name: 'Alice',
    emoji: '⭐',
    avatar: null,
    color: '#D4A373',
    forceRarity: null,
    from: '同事',
    media: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    message: '每次和你出去都笑到肚子痛，希望你永遠這麼有趣可愛！',
  },
  {
    id: 3,
    name: '阿哲',
    emoji: '🔥',
    avatar: null,
    color: '#D9947E',
    forceRarity: null,
    from: '高中兄弟',
    media: null,
    message: '哥們，記得我那次幫你的忙嗎？現在要來還了喔！哈哈，生日快樂！',
  },
  {
    id: 4,
    name: '小雯',
    emoji: '🌸',
    avatar: null,
    color: '#B88355',
    forceRarity: null,
    from: '大學同學',
    media: './videos/wishes/xiaowen.mp4',
    message: '祝你今年一切順利，每個願望都能實現，繼續發光發熱！',
  },
  {
    id: 5,
    name: '老林',
    emoji: '🎸',
    avatar: null,
    color: '#5A716D',
    forceRarity: null,
    from: '社團好友',
    media: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    message: '希望你的人生像這首歌一樣精彩，副歌永遠是高潮！',
  },
  {
    id: 6,
    name: 'Ray',
    emoji: '🌊',
    avatar: null,
    color: '#6A8FC2',
    forceRarity: null,
    from: '摯友',
    media: './audio/wishes/ray.mp3',
    message: '遇見你是我這輩子最好的事之一。無論去哪裡，永遠支持你。',
  },
  {
    id: 7,
    name: '阿媽',
    emoji: '💝',
    avatar: null,
    color: '#C4848E',
    forceRarity: 'null',              // 阿媽永遠是 UR！
    from: '家人',
    media: './audio/wishes/grandma.mp3',
    message: '乖孫生日快樂！出門要穿多一點，要吃飽睡好，阿媽最愛你！',
  },
  {
    id: 8,
    name: '小傑',
    emoji: '🎮',
    avatar: null,
    color: '#9B7FD4',
    forceRarity: null,
    from: '遊戲夥伴',
    media: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    message: '下次開車遊我要當隊長！哈哈，生日快樂！一起繼續闖關！',
  },

  /* ── 新增好友範本（複製下方並取消註解）──────────────────────────
  {
    id: 9,                               // 不可重複，依序遞增
    name: '小花',
    emoji: '🌺',
    avatar: './images/wishes/xiaohua.jpg',
    color: '#E8A0B0',
    forceRarity: null,                   // null 隨機 或 'R'/'SR'/'SSR'/'UR'
    from: '鄰居好友',
    media: './audio/wishes/xiaohua.mp3',
    message: '生日快樂！希望你天天開心！',
  },
  ─────────────────────────────────────────────────────────────── */
]
