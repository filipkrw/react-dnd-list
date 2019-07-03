import React, { Fragment } from 'react'
import './App.css'

import Demo from './Demo'
import Bar from './Bar'

const App = () => {
  return (
    <Fragment>
      <Bar className="top">
        <a href="https://atmhrt.github.io/react-dnd-list">React DnD List Demo</a>
        <a href="https://github.com/atmhrt/react-dnd-list">GitHub</a>
      </Bar>

      <Demo />

      <Bar className="bottom">
        <a href="https://github.com/atmhrt">{'<3'}</a>
      </Bar>
    </Fragment>
  )
}

export default App
