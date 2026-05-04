const { app, BrowserWindow } = require('electron')
const path = require('path')

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 860,
    minWidth: 800,
    minHeight: 600,
    title: 'MOMO 的冒險紀行',
    // icon: path.join(__dirname, '../public/icon.png'), // 放圖示時取消註解
    backgroundColor: '#FFF9E3',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true,
    },
  })

  // 載入打包後的網頁（相對路徑 → 離線可用）
  win.loadFile(path.join(__dirname, '../dist/index.html'))

  // 隱藏選單列（正式版）
  win.setMenuBarVisibility(false)
}

app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
