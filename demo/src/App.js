import React, { useState } from 'react'
import './App.css'

import DnDList from 'react-dnd-list'

const ListItem = (props) => {
  const style = props.value === '3'
    ? { height: '100px '}
    : {}

  return (
    <li
      style={{ ...props.style, ...style }}
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
      <DnDList
        items={list}
        itemComponent={ListItem}
        setList={setList}
        allowTransitions
        swapThreshold={(size) => size * .75}
        overflowThreshold={(size) => size * .2}
      />
    </ul>
  )
}

export default App;
