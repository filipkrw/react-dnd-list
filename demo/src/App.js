import React, { useState } from 'react'
import './App.css'

import List from 'react-dnd-list'

const Item = (props) => {
  return (
    <li
      style={props.style}
      className={props.className}
      ref={props.domRef}
    >
      <div
        className="mover"
        {...props.dragHandlers}
      >=</div>
      <span>{props.value}</span>
    </li>
  )
}

const App = () => {
  const [list, setList] = useState(['1', '2', '3', '4', '5'])

  return (
    <ul>
      <List
        items={list}
        itemComponent={Item}
        setList={setList}
        allowTransitions
        swapThreshold={(size) => size * .75}
        overflowThreshold={(size) => size * .2}
      />
    </ul>
  )
}

export default App
