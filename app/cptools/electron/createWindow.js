'use strict'

const electron = require('electron')
const BrowserWindow = electron.BrowserWindow
const url = require('url')

let createWindow = (width, height, pathname) => {
  let myWindow

  myWindow = new BrowserWindow({
    show: false,
    width: width,
    height: height,
    'web-preferences': {
      'web-security': false
    }
  })

  if (process.env.NODE_ENV === 'development') {
    myWindow.webContents.openDevTools()
  }

  myWindow.on('closed', () => {
    myWindow = null
  })

  myWindow.webContents.on('did-finish-load', () => {
    if (!myWindow) {
      throw new Error('myWindow is not defined')
    }
    myWindow.show()
    myWindow.focus()
  })

  myWindow.loadURL(url.format({
    pathname: pathname,
    protocol: 'file:',
    slashes: true
  }))

  return myWindow
}

module.exports.createWindow = createWindow
