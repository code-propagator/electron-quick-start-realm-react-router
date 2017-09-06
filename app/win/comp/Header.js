import React from 'react'
import {Link} from 'react-router-dom'

const Header = () => (
  <div>
    <p>Header</p>
    <ul>
      <li><Link to='/'>Home</Link></li>
      <li><Link to='/routeOne'>RouteOne</Link></li>
      <li><Link to='/routeTwo'>RouteTwo</Link></li>
    </ul>
  </div>
)

export default Header
