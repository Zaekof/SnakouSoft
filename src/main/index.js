import { shell, app, Tray, BrowserWindow, Menu } from 'electron'
import notifier from 'node-notifier'
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
let tray

const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    minWidth: 1000,
    minHeight: 700,
    resizable: true,
    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: false,
      webSecurity: true,
      nativeWindowOpen: true
    }
  })

  tray = new Tray(require('path').join(__static, '/icon.ico'))

  let contextMenu = Menu.buildFromTemplate([
    {
      label: "Afficher l'application", click: function () {
        mainWindow.show()
      }
    },
    {
      label: 'Quitter', click: function () {
        app.isQuiting = true
        app.quit()
      }
    }
  ])

  tray.setToolTip('Snakou Application')
  tray.setContextMenu(contextMenu)
  tray.on('click', () => {
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()
  })
  mainWindow.on('show', () => {
    tray.setHighlightMode('always')
  })
  mainWindow.on('hide', () => {
    tray.setHighlightMode('never')
  })
 
  mainWindow.webContents.on('new-window', (event, url, frameName, disposition, options, additionalFeatures) => {
    event.preventDefault()
    shell.openExternal(url)
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('minimize', (event) => {
    event.preventDefault()
    mainWindow.hide()
    notifier.notify({
      title: 'Snakou Application',
      message: "L'application est minimisée"
    })    
  })


  // mainWindow.webContents.openDevTools()
  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    tray.destroy()
    app.quit()
  } 
})

app.on('activate', function () {
  if (mainWindow === null) createWindow()
})