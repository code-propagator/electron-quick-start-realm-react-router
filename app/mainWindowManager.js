const electron = require('electron')
const app = electron.app
console.log('starting electron app')

// ---------------------------------------------------------------
const win = require('./cptools/electron/createWindow')
const path = require('path')

let createMainWindow = () => {
  let indexhtml = path.join(__dirname, 'win', 'index.html')
  console.log('index.html', indexhtml)
  return win.createWindow(1280, 768, indexhtml)
}

let mainWindow

app.on('ready', () => {
  mainWindow = createMainWindow()
  console.log('app ready having mainWindow', mainWindow)
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  console.log('activate')
  if (mainWindow === null) {
    mainWindow = createMainWindow()
  }
})

let getMainWindow = () => {
  return mainWindow
}

module.exports.getMainWindow = getMainWindow
