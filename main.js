// Excetute the command only once to start development.
// npm run setup-once
// https://github.com/realm/realm-js/issues/765

const electron = require('electron')
const app = electron.app
const ipcMain = electron.ipcMain

// ---------------------------------------------

let userDataDir = app.getPath('userData')

// #############################################
// Change directrory for Realm
// https://github.com/realm/realm-js/issues/818
process.chdir(userDataDir)
// #############################################

const path = require('path')
let dbPath = path.join(userDataDir, 'database.realm')
console.log('dbPath', dbPath)
// /Users/codepropagator/Library/Application Support/electronquickstart/database.realm

let db = require('./app/database')
db.testDB(dbPath)
// db.allData(dbPath)

// ---------------------------------------------
// ### Open Main Window
// ### only single mainWindow is needed for SPA-like app.
let mainWindowManager = require('./app/mainWindowManager')
console.log('mainWindow.getMainWindow()', mainWindowManager.getMainWindow())

// ---------------------------------------------------------------
// Start listening any change in Realm database
let realmChangeMonitor = () => {
  console.log('realmChangeMonitor called')
  let mainWindow = mainWindowManager.getMainWindow()
  // console.log('mainWindow is', mainWindow)
  // Get the webContents of the window
  let webContents = mainWindow.webContents
  // console.log('webContents', webContents)
  console.log('try send')
  webContents.send('force-update', 'Anyway')
}

db.subscribeChange(dbPath, realmChangeMonitor)
// ---------------------------------------------------------------

// ### Application Data Manager
// All renderer process should access to the application data
// through the IPC protocol.
ipcMain.on('synchronous-message', (event, arg) => {
  console.log('ipcMain SYNC RECEIVED', arg)  // prints "ping"
  let reply = 'SYNC pong pong'
  console.log('ipcMain SYNC REPLY', reply)
  event.returnValue = reply
})

ipcMain.on('asynchronous-message', (event, arg) => {
  console.log('ipcMain ASYNC RECEIVED', arg)  // prints "ping"
  let reply = 'ASYNC pong pong'
  console.log('ipcMain ASYNC REPLY', reply)
  event.sender.send('asynchronous-reply', reply)
})

ipcMain.on('synchronous-get', (event, arg) => {
  console.log('ipcMain synchronous-get', event, arg)
  // ### echo
  let reply = arg
  event.returnValue = reply
})

ipcMain.on('asynchronous-get', (event, arg) => {
  console.log('ipcMain asynchronous-get', event, arg)

  let requestId = arg.requestId
  let request = arg.request
  var result
  // ------------------------------------------------
  if (request.type === 'getBlog') {
    let blog = db.allData(dbPath)
    result = blog
  } else if (request.type === 'subscribe') {
    console.log('#### ipcMain handle subscribe request ', request)
    // let instanceId = request.monitor
    result = null
  }
  // ------------------------------------------------
  let reply = {
    requestId: requestId,
    // type: request.type,
    result: result
  }
  event.sender.send('asynchronous-get-reply', reply)
})

// ---------------------------------------------

// ### Application Updater

const updater = require('./app/cptools/electron/autoUpdater')

const os = require('os').platform()
console.log('os', os)

var updateFeed

if (process.env.NODE_ENV === 'development') {
  if (os === 'darwin') {
    updateFeed = 'http://localhost:3000/updates/latest'
  }
}

const appVersion = require('./package.json').version
console.log('app version', appVersion)

updater.updateAppIfNeeded(updateFeed, appVersion)
