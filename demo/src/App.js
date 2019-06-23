import React, { Fragment, useState } from 'react'
import './App.css'

import List from 'react-dnd-list'

const Item = (props) => {
  const dnd = props.dnd
  const handleClasses = props.inDrag ? 'handle active' : 'handle'

  return (
    <li
      style={dnd.styles}
      className={dnd.classes}
      ref={dnd.ref}
    >
      <div
        className={handleClasses}
        {...dnd.dragHandlers}
      >=</div>
      <span className="val">{props.item}</span>
    </li>
  )
}

const App = () => {
  const [list, setList] = useState(['1', '2', '3', '4', '5'])

  return (
    <Fragment>
      <ul>
        <List
          items={list}
          itemComponent={Item}
          setList={setList}
          setSwapThreshold={(size) => size * .75}
          setOverflowThreshold={(size) => size * .2}
        />
      </ul>
    </Fragment>
  )
}

export default App
