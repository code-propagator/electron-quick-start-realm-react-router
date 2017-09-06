import React, {Component} from 'react'

import {Link} from 'react-router-dom'
// ### use react-router-dom instead of react-router
// ### hashHistory is locally created for the electron
import history from '../../../hashHist'

// this.props.match contains router info
class Content extends Component {
  constructor (props) {
    super(props)
    console.log('Content props', props)
  }
  render () {
    const id = Number(this.props.match.params.contentId)
    // external contents data
    if (!id || id > this.props.contents.length) {
      return (<p>Not Found.</p>)
    }
    return (
      <p>
        {this.props.contents[id - 1]}<br />
        <Link to='/routeOne'>RouteOne</Link>
        <button onClick={() => {
          console.log('BACK')
          history.push('/routeOne')
        }}>Back</button>
      </p>
    )
  }
}

export default Content
