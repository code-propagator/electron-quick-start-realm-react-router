
import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import rendererApi from '../../rendererApi'

// ERROR import { ipcRenderer } from 'electron'
const { ipcRenderer } = window.require('electron')

let uuidv4 = require('uuid/v4')

class RouteTwo extends Component {
  constructor (props) {
    super(props)
    this.state = {
      blog: null,
      instanceId: uuidv4(),
      update: 'now'
    }
    this.receiver = this.receiver.bind(this)
    this.handleClick = this.handleClick.bind(this)

    rendererApi.callMainGet({
      type: 'subscribe',
      monitor: this.state.instanceId
    },
    () => {})
  }

  componentDidMount () {
    console.log('Render did mount')

    ipcRenderer.on('force-update', (event, arg) => {
      console.log('Profile force-update RECEIVED', arg)
      let instanceId = arg
      console.log('received arg', instanceId)
      console.log('this.state.instanceId', this.state.instanceId)

      var obj = ReactDOM.findDOMNode(this.refs[this.state.instanceId])
      console.log('ReactDOM.findDOMNode', obj)
      // ===> <div></div>
      // obj.forceUpdate() // ERROR
      // obj.setState({update: 'now'}) // ERROR
      // Randomly change the state
      this.setState({update: uuidv4()})
      // this.forceUpdate() // USELESS
      // ===> Need latest values of Realm data
      this.handleClick()
    })
  }

  receiver (result) {
    console.log('receiver')
    this.setState({
      blog: result
    })
  }

  handleClick () {
    // Request latest data
    rendererApi.callMainGet({
      type: 'getBlog'
    },
    this.receiver)
  }

  render () {
    return (
      <div ref={this.state.instanceId} >
        <h2>RouteTwo:{this.state.instandeId}</h2>
        update: {this.state.update}<br />
        <button onClick={() => {
          rendererApi.callMainSync()
        }}>SYNC</button>

        <button onClick={() => {
          rendererApi.callMain()
        }}>ASYNC</button>

        <button onClick={this.handleClick}>DATA</button>
        <br />
        {JSON.stringify(this.state.blog)}
      </div>
    )
  }
}

export default RouteTwo
