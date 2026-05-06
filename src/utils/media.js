/**
 * 偵測媒體類型
 * @param {string|null} src
 * @returns {'youtube'|'video'|'audio'|'image'|'none'}
 */
export function detectMediaType(src) {
  if (!src) return 'none'
  if (src.includes('youtube.com') || src.includes('youtu.be')) return 'youtube'
  if (/\.(mp3|wav|m4a|ogg|aac|flac)$/i.test(src)) return 'audio'
  if (/\.(mp4|webm|mov|avi)$/i.test(src)) return 'video'
  if (/\.(jpe?g|png|gif|webp|avif|heic|svg)$/i.test(src)) return 'image'
  return 'none'
}
