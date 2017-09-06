'use strict'

const electron = require('electron')
const dialog = electron.dialog
const autoUpdater = electron.autoUpdater

function confirmRestart (releaseNotes) {
  return new Promise((resolve, reject) => {
    dialog.showMessageBox({
      type: 'info',
      title: 'New Updates',
      message: 'New version of app exists. Please restart the app to update.',
      detail: releaseNotes,
      buttons: ['Restart Now', 'Later']
    },
    (response) => {
      if (response === 0) {
        resolve('yes')
      } else {
        resolve('no')
      }
    })
  })
}

function download (url) {
  console.log('download', url)

  const rp = require('request-promise')

  rp(url)
  .then((data) => {
    console.log('New app downloaded.')
  })
  .catch((err) => {
    console.log('download error', err)

    var code = err.statusCode
    switch (code) {
      case 404:
        break
      default:
        break
    }
  })
}

function checkVersion (feedURL) {
  console.log('checkVersion')

  const rp = require('request-promise')

  rp(feedURL)
  .then((data) => {
    console.log('data', data)
    // data {"url":"http://localhost:3000/releases/darwin/1.0.0"}
    var url = JSON.parse(data).url
    download(url)
  })
  .catch((err) => {
    console.log('### checkVersion error', err.message)
    // ==> RequestError 'Error: connect ECONNREFUSED 127.0.0.1:3000' etc,...
    // ==> Just keep going anyway.
    var code = err.statusCode
    switch (code) {
      case 404:
        break
      default:
        break
    }
  })
}

function checkUpdate (feedURL) {
  console.log('checkUpdate')

  autoUpdater.on('update-downloaded', (event, releaseNotes) => {
    confirmRestart(releaseNotes)
    .then((ans) => {
      if (ans === 'yes') {
        autoUpdater.quitAndInstall()
      }
    })
  })

  autoUpdater.on('update-not-available', () => {
    dialog.showMessageBox({
      message: 'Update not available.',
      buttons: ['OK']
    })
  })

  autoUpdater.on('error', (e) => {
    console.error(e.message)
  })

  autoUpdater.setFeedURL(feedURL)
  autoUpdater.checkForUpdates()
}

function updateAppIfNeeded (updateFeed, appVersion) {
  if (!updateFeed) {
    console.log('Update server\'s URL is not specified.')
    return
  }

  const feedURL = updateFeed + '/' + appVersion
  console.log('feedURL', feedURL)

  checkVersion(feedURL)
  checkUpdate(feedURL)
}

module.exports.checkVersion = checkVersion
module.exports.checkUpdate = checkUpdate
module.exports.updateAppIfNeeded = updateAppIfNeeded
