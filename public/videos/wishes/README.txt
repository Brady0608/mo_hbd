【Wishes Gacha 祝福影片放這裡】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

格式建議：MP4（H.264）/ WebM
大小建議：單檔 100MB 以下
命名建議：好友名字.mp4（例如 xiaoming.mp4）

設定方法：
  在 src/data/wishes.js 中，將對應好友的
  media: null
  改為
  media: './videos/wishes/你的檔名.mp4'

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【媒體類型總覽】

  YouTube 影片  → media: 'https://www.youtube.com/embed/影片ID'
  本地影片      → media: './videos/wishes/檔名.mp4'
  本地錄音      → media: './audio/wishes/檔名.mp3'   ← audio 資料夾
  無媒體        → media: null   （只顯示文字祝福）

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
