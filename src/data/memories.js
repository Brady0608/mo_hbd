/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║           Adventure Map — 記憶節點資料                        ║
 * ╠══════════════════════════════════════════════════════════════╣
 * ║  新增節點：在下方陣列中複製一個物件並填入資料                    ║
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
 * ║                                                              ║
 * ║  photo + media 同時填入 → 先顯示照片，點「▶ 播放」換成影片/音訊 ║
 * ╚══════════════════════════════════════════════════════════════╝
 */

export const MEMORIES = [
  {
    id: 1,
    emoji: '🌱',
    title: '鬼修女來臨！！',
    color: '#7A918D',
    pathFraction: 0.04,
    photo: null,
    media: './videos/memories/1.mp4',
    tags: ['驚悚', '符合人設？'],
  },
  {
    id: 2,
    emoji: '⭐',
    title: '我們是世界在台漂亮協會!',
    color: '#D4A373',
    pathFraction: 0.11,
    photo: null,
    media: './videos/memories/2.mp4',
    tags: ['顏值越高', '責任越大'],
  },
  {
    id: 3,
    emoji: '🔥',
    title: '我要叮叮噹',
    color: '#D9947E',
    pathFraction: 0.17,
    photo: null,
    media: './videos/memories/6.mp4',
    tags: ['專業女團', '錦繡二重唱!?'],
  },
  {
    id: 4,
    emoji: '🌊',
    title: '歡迎來到動物方程式...嗎?',
    color: '#6A8FC2',
    pathFraction: 0.24,
    photo: null,
    media: './videos/memories/8.mp4',
    tags: ['最佳吉祥物', '動物方程式3熱映中?'],
  },
  {
    id: 5,
    emoji: '🎵',
    title: '這可能是事業第二春?',
    color: '#9B7FD4',
    pathFraction: 0.30,
    photo: null,
    media: './videos/memories/9.mp4',
    tags: ['馴獸師', '大毛友情客串'],
  },
  {
    id: 6,
    emoji: '🌸',
    title: '初一大劫財',
    color: '#C4848E',
    pathFraction: 0.37,
    photo: null,
    media: './videos/memories/10.mp4',
    tags: ['劉又郡請客喔', '財神到'],
  },
  {
    id: 7,
    emoji: '🎮',
    title: '阿吉仔重出江湖',
    color: '#5A716D',
    pathFraction: 0.43,
    photo: null,
    media: './videos/memories/11.mp4',
    tags: ['Hawaii', '只要我不尷尬'],
  },
  {
    id: 8,
    emoji: '🍜',
    title: '拎辣拎辣',
    color: '#CD853F',
    pathFraction: 0.50,
    photo: null,
    media: './videos/memories/12.mp4',
    tags: ['誰敢不給面子?', '叫你喝就喝'],
  },
  {
    id: 9,
    emoji: '🌈',
    title: 'Su!Su!Supernova',
    color: '#5B9BD5',
    pathFraction: 0.57,
    photo: null,
    media: './videos/memories/13.mp4',
    tags: ['速速開箱', '腦筋急轉彎'],
  },
  {
    id: 10,
    emoji: '🎨',
    title: 'Baby Shark doo doo doo doo doo doo?',
    color: '#D4785A',
    pathFraction: 0.63,
    photo: null,
    media: './videos/memories/14.mp4',
    tags: ['旁觀者看玩VR很尬', '標題詐欺'],
  },
  {
    id: 11,
    emoji: '🌺',
    title: '干擾工作惡魔現身',
    color: '#4A9E6E',
    pathFraction: 0.70,
    photo: null,
    media: './videos/memories/15.mp4',
    tags: ['小心惡魔會把你做成消波塊', '你懂玄哥的感受了嗎?'],
  },
  {
    id: 12,
    emoji: '🚀',
    title: '天生的女演員，怎麼了？',
    color: '#7B5CB8',
    pathFraction: 0.76,
    photo: null,
    media: './videos/memories/16.mp4',
    tags: ['奧斯卡是我不想要，沒有得不到', '藏不住的巨星光環'],
  },
  {
    id: 13,
    emoji: '⛺',
    title: '超實用的水豚打扮技巧！',
    color: '#BC8F8F',
    pathFraction: 0.83,
    photo: null,
    media: './videos/memories/3.mp4',
    tags: ['首先你要有隻水豚', '還要有馬尾'],
  },
  {
    id: 14,
    emoji: '🌙',
    title: '無敵破壞王最新力作!',
    color: '#8FBC8F',
    pathFraction: 0.89,
    photo: null,
    media: './videos/memories/4.mp4',
    tags: ['專業到府拆遷服務', '信不信我輕輕地把你給對摺?'],
  },
  {
    id: 15,
    emoji: '🎂',
    title: '尾牙中大獎了...對...對吧?',
    color: '#F4A460',
    pathFraction: 0.96,
    photo: null,
    media: './videos/memories/7.mp4',
    tags: ['好了年後沒心情工作', '明年再來'],
  },
]
