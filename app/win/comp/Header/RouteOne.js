import React, {Component} from 'react'
import {Route} from 'react-router-dom'

import contents from './RouteOne/contents.js'

import Content from './RouteOne/Content'
import ContentList from './RouteOne/ContentList'

class RouteOne extends Component {
  render () {
    let url = this.props.match.url
    console.log('RouteOne match.url', url)

    return (
      <div>
        <h2>RouteOne</h2>
        <Route
          path={url}
          render={props => <ContentList contents={contents} {...props} />}
        />
        <Route
          exact path={`${url}/:contentId`}
          render={props => <Content contents={contents} {...props} />}
        />
      </div>
    )
  }
}

export default RouteOne
