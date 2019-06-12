import React, { useState } from 'react';
import './App.css'

import DnDList from './dnd-list/dnd-list';

const ListItem = (props) => {
  return (
    <li
      style={props.style}
      className={props.className}
      ref={props.domRef}
    >
      <div
        className="mover"
        onMouseDown={props.handleDrag}
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
        transitions
      />
    </ul>
  )
}

export default App;
