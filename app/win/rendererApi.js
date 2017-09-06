const { ipcRenderer } = window.require('electron')

// ------------------------------------------------------------------
// electron documentation about IPC

let callMainSync = (request) => {
  let msg = typeof request !== 'undefined' ? request : 'rendererApi SYNC ping'
  console.log('rendererApi.callMainSync:', msg) // prints "pong"
  let result = ipcRenderer.sendSync('synchronous-message', msg)
  console.log('#### callMainSync synchronous-message RESULT ', result)
  // ===> event.returnValue in the main is obtained.
  // After SYNC request, the event has some immediate result from main.
}

let callMain = (request) => {
  let msg = typeof request !== 'undefined' ? request : 'rendererApi ASYNC ping'
  console.log('rendererAPi.callMain asynchronous-message', msg)
  ipcRenderer.send('asynchronous-message', msg)
}

ipcRenderer.on('asynchronous-reply', (event, arg) => {
  console.log('rendererApi asynchronous-reply:', event, arg) // prints "pong"

  let msg = 'rendererApi SYNC ping'
  console.log('rendererApi synchronous-message:', msg)
  let result = ipcRenderer.sendSync('synchronous-message', msg)
  console.log('rendererApi synchronous-message RESULT ', result)
})

// ------------------------------------------------------------------

let callMainGetSync = (request) => {
  return ipcRenderer.sendSync('synchronous-get', request)
}

let uuidv4 = require('uuid/v4')
let asynchronousGetCallbacks = {}

let callMainGet = (request, callback) => {
  let requestId = uuidv4()
  asynchronousGetCallbacks[requestId] = callback
  ipcRenderer.send('asynchronous-get', {
    requestId: requestId,
    request: request
  })
}

ipcRenderer.on('asynchronous-get-reply', (event, arg) => {
  console.log('rendererApi asynchronous-get-reply:', event, arg)

  let requestId = arg.requestId
  // let type = arg.type
  let result = arg.result
  let callback = asynchronousGetCallbacks[requestId]
  callback(result)

  delete asynchronousGetCallbacks[requestId]
})

module.exports = {
  callMainSync,
  callMain,
  callMainGetSync,
  callMainGet
}
