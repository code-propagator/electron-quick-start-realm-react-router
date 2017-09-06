// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

import React from 'react'
import ReactDOM from 'react-dom'
import {HashRouter} from 'react-router-dom'

// ### hashHistoryを独自に生成する
import history from './hashHist'
import MyRoutes from './MyRoutes'

import ClickCount from '../cptools/react/ClickCount'

console.log('start renderer.js loaded within index.html on the mainWindow')

console.log('HISTORY LOCATION', history.location)

// ### Router, BrowserRouter, HashRouterのいずれかを使うが、
// ### electron上は差異が見られない様子。
// ===> 動的サーバがある場合にはBrowserRouterを使う。HashRouterは静的コンテンツのみの場合。
// ===> electronでhistory.push('/memo')のようにプログラムから遷移させる場合には、
//       HashRouterを使うこと。BrowserRouterでは機能しない。
const Root = () => (
  <div>
    <ClickCount count={666} /><br />
    <ClickCount /><br />
    <HashRouter history={history}>
      <MyRoutes />
    </HashRouter>
  </div>
)

ReactDOM.render(
  <Root />,
  document.getElementById('reactapp')
)
