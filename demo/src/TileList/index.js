import React, { useState } from 'react'
import DnDList from 'react-dnd-list'

import './style.css'

const Item = props => {
  const dnd = props.dnd

  let classes = 'el no-select';
  if (props.itemInDrag) classes += ' active'

  return (
    <li
      style={{ ...dnd.item.styles, ...dnd.handler.styles }}
      className={dnd.item.classes}
      ref={dnd.item.ref}
      {...dnd.handler.listeners}
    >
      <div
        className={classes}
        style={{ height: props.item.height }}
      >
        {props.item.value}
      </div>
    </li>
  )
}

const List = props => {
  const [list, setList] = useState(props.items)

  return (
    <ul className={'tile-list ' + props.color}>
      <DnDList
        items={list}
        itemComponent={Item}
        setList={setList}
        setSwapThreshold={size => size * .75}
        setOverflowThreshold={() => 50}
      />
    </ul>
  )
}

export default List
