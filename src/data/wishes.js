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
 * ║  media（祝福媒體）任選其一：                                    ║
 * ║    YouTube 影片 → 'https://www.youtube.com/embed/影片ID'     ║
 * ║    本地影片     → './videos/wishes/檔名.mp4'                  ║
 * ║    本地錄音     → './audio/wishes/檔名.mp3'                   ║
 * ║    本地圖片     → './images/wishes/檔名.jpg'（或 png/gif）    ║
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
    name: 'YoYo',
    emoji: '🌿',
    avatar: './images/avatar/yoyo.png',
    color: '#7A918D',
    forceRarity: null,              // null = 隨機抽籤
    from: '體驗中心',
    media: './videos/wishes/yoyo.mp4',
    message: '施摸摸，今逢誕辰，百鳥朝賀，盛事美顏常在，無論到哪都是人間限定款美少女！',
  },
  {
    id: 2,
    name: '孟苹',
    emoji: '⭐',
    avatar: './images/avatar/nancy.jpg',
    color: '#D4A373',
    forceRarity: null,
    from: '行銷部',
    media: './videos/wishes/yoyo.mp4',
    message: '咱們大唐當今第一美女，天將祥雲，願你永遠青春不老，無論到哪都是人間限定款美少女！',
  },
  {
    id: 3,
    name: '羽彤',
    emoji: '🔥',
    avatar: './images/avatar/yutong.jpg',
    color: '#D9947E',
    forceRarity: null,
    from: '體驗中心',
    media: './images/wishes/yutong.jpg',
    message: '天天都要快樂!這才是最重要的!',
  },
  {
    id: 4,
    name: '詩晴',
    emoji: '🌸',
    avatar: './images/avatar/shiqing.jpg',
    color: '#B88355',
    forceRarity: null,
    from: '體驗中心',
    media: './images/wishes/shiqing.png',
    message: '你是我會想成為的大人，祝盲盒都抽到最！不！想！要！的！',
  },
  {
    id: 5,
    name: '玲玉',
    emoji: '🎸',
    avatar: './images/avatar/linda.jpg',
    color: '#5A716D',
    forceRarity: null,
    from: '業務部',
    media: './audio/wishes/linda.m4a',
    message: '生日快樂! 身體健健康康，遠離爛人爛事，愛妳喔！',
  },
  {
    id: 6,
    name: '矇矇',
    emoji: '🌊',
    avatar: './images/avatar/mong1.jpg',
    color: '#6A8FC2',
    forceRarity: null,
    from: 'T1機電',
    media: './audio/wishes/mong.m4a',
    message: '相見恨晚，未來煩請繼續多多指教，無論在何時何地，你都不會是獨自一人喔',
  },
  {
    id: 7,
    name: '鎔瑄',
    emoji: '💝',
    avatar: './images/avatar/rongxuan.jpg',
    color: '#C4848E',
    forceRarity: 'null',              // 阿媽永遠是 UR！
    from: '體驗中心',
    media: './audio/wishes/grandma.mp3',
    message: '生日快樂！',
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
