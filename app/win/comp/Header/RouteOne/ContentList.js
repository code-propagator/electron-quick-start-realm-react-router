import React, {Component} from 'react'
import {Link} from 'react-router-dom'

class ContentList extends Component {
  render () {
    if (!this.props) {
      return <div />
    }

    console.log('ContentList has contents', this.props.contents)

    let matchurl = this.props.match.url
    console.log('matrch.url', matchurl)

    const list = this.props.contents.map((elem, index) => (
      <li key={index}>
        <div>
          <Link to={`${matchurl}/${index + 1}`}>
          [{index}]: Link to {matchurl}/{index + 1}
          </Link><br />
        </div>
      </li>
    ))

    return (
      <ul>
        {list}
      </ul>
    )
  }
}

export default ContentList
