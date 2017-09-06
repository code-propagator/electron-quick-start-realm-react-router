import React, {Component} from 'react'
import {Route} from 'react-router-dom'

import Header from './comp/Header'
import Home from './comp/Header/Home'
import RouteOne from './comp/Header/RouteOne'
import RouteTwo from './comp/Header/RouteTwo'

class MyRoutes extends Component {
  render () {
    return (
      <div>
        <Header />
        <Route exact path='/' component={Home} />
        <Route path='/routeOne' component={RouteOne} />
        <Route path='/routeTwo' component={RouteTwo} />
        {this.props.chidren}
      </div>
    )
  }
}

export default MyRoutes
