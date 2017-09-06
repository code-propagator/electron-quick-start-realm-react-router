// ---------------------------------------------------------------
const updater = require('../cptools/electron/autoUpdater')
const pkg = require('../package.json')

let updateAppIfNeeded = () => {
  const appVersion = pkg.version
  console.log('app version', appVersion)

  const os = require('os').platform()
  console.log('os', os)

  var updateFeed
  if (process.env.NODE_ENV === 'development') {
    if (os === 'darwin') {
      updateFeed = 'http://localhost:3000/updates/latest'
    }
  }

  if (!updateFeed) {
    console.log('Update server\'s URL is not specified.')
    return
  }

  const feedURL = updateFeed + '/' + appVersion
  console.log('feedURL', feedURL)

  updater.checkVersion(feedURL)
  updater.checkUpdate(feedURL)
}

updateAppIfNeeded()
