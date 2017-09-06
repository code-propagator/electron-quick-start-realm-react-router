import React, {Component} from 'react'

class ClickCount extends Component {
  constructor (props) {
    super(props)

    this.state = {
      count: (typeof this.props.count !== 'undefined') ? this.props.count : 0
    }
    this.handleClickUp = this.handleClickUp.bind(this)
  }

  handleClickUp () {
    let val = this.state.count + 1

    this.setState({
      count: val
    })
  }

  render () {
    return (
      <div>
        Count:<span>{this.state.count}</span>
        <div><button onClick={this.handleClickUp}>UP</button></div>
      </div>
    )
  }
}

export default ClickCount
