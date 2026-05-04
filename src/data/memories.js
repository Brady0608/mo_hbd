/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║           Adventure Map — 記憶節點資料                        ║
 * ╠══════════════════════════════════════════════════════════════╣
 * ║  新增節點：在下方陣列中複製一個物件並填入資料                    ║
 * ║                                                              ║
 * ║  pathFraction 視覺位置（路線從上到下）：                        ║
 * ║    0.05 ← 起點附近                                           ║
 * ║    0.13 ← 目前節點 1                                         ║
 * ║    0.25 ← 可新增                                             ║
 * ║    0.38 ← 目前節點 2                                         ║
 * ║    0.50 ← 可新增                                             ║
 * ║    0.63 ← 目前節點 3                                         ║
 * ║    0.75 ← 可新增                                             ║
 * ║    0.86 ← 目前節點 4                                         ║
 * ║    0.95 ← 終點附近                                           ║
 * ║                                                              ║
 * ║  photo（縮圖照片）：                                           ║
 * ║    null                           → 顯示 emoji 占位圖        ║
 * ║    './images/memories/檔名.jpg'   → 顯示靜態照片              ║
 * ║    (放在 public/images/memories/ 資料夾)                      ║
 * ║                                                              ║
 * ║  media（影片 / 錄音）：                                       ║
 * ║    null                           → 無媒體                   ║
 * ║    './videos/memories/檔名.mp4'   → 本地影片                  ║
 * ║    './audio/memories/檔名.mp3'    → 本地錄音                  ║
 * ║    'https://youtube.com/embed/ID' → YouTube 影片              ║
 * ║    (影片放 public/videos/memories/，音訊放 public/audio/memories/)║
 * ║                                                              ║
 * ║  photo + media 同時填入 → 先顯示照片，點「▶ 播放」換成影片/音訊 ║
 * ╚══════════════════════════════════════════════════════════════╝
 */

export const MEMORIES = [
  {
    id: 1,
    year: '2019',
    emoji: '🌱',
    title: '相遇的起點',
    subtitle: 'The Beginning',
    color: '#7A918D',               // 節點顏色（可自訂 hex）
    pathFraction: 0.13,             // 路線位置 0.0 ~ 1.0
    desc:
      '第一次見到你的那天，完全沒料到這會是一段讓人想永遠珍藏的友情。\n' +
      '那個下午陽光很好，你笑起來的樣子讓人忍不住也跟著笑了起來。',
    photo: null,                    // 或 './images/memories/2019-meet.jpg'
    media: null,                    // 或 './videos/memories/2019-meet.mp4'
    tags: ['友情', '相遇', '起點'],
  },
  {
    id: 2,
    year: '2021',
    emoji: '⛺',
    title: '瘋狂野營之夜',
    subtitle: 'The Wild Camp',
    color: '#D4A373',
    pathFraction: 0.38,
    desc:
      '帳篷搭歪了三次，最後乾脆直接睡在外面數星星。\n' +
      '那晚我們聊到天亮，說了很多平常不敢說的話，大概是人生中最誠實的一個晚上。',
    photo: null,                    // 或 './images/memories/2021-camp.jpg'
    tags: ['旅行', '野營', '星空'],
  },
  {
    id: 3,
    year: '2023',
    emoji: '🌙',
    title: '深夜的長途電話',
    subtitle: 'The Midnight Call',
    color: '#D9947E',
    pathFraction: 0.63,
    desc:
      '那通電話聊了快三個小時，從失落聊到夢想，又從夢想聊回失落。\n' +
      '掛電話的時候，外面已經開始有鳥叫聲了，但心裡卻非常踏實。',
    photo: null,
    tags: ['陪伴', '友情', '深夜'],
  },
  {
    id: 4,
    year: '2025',
    emoji: '🎂',
    title: '勇者的生日',
    subtitle: "Hero's Birthday",
    color: '#B88355',
    pathFraction: 0.86,
    desc:
      '今天是屬於你的日子。\n' +
      '感謝你一直做那個最有趣、最真誠的冒險夥伴，新的一章，要繼續一起創造更多值得被記住的故事。',
    photo: null,                    // 或 './images/memories/2025-birthday.jpg'
    tags: ['生日', '新旅程', '感謝'],
  },

  /* ── 新增節點範本（複製下方並取消註解）────────────────────────
  {
    id: 5,                          // 不可重複
    year: '2022',
    emoji: '🏔️',
    title: '登山的那個週末',
    subtitle: 'The Mountain Weekend',
    color: '#7A918D',               // 任意 hex 色碼
    pathFraction: 0.50,             // 介於現有節點之間
    desc:
      '爬到山頂的時候，累到說不出話，但風景好到讓人忘記所有疲憊。\n' +
      '那張合照現在還放在桌面。',
    photo: './images/memories/2022-mountain.jpg',  // 或 null
    media: null,                    // 或 './videos/memories/2022-mountain.mp4' 或 './audio/memories/...'
    tags: ['登山', '風景', '挑戰'],
  },
  ─────────────────────────────────────────────────────────────── */
]
