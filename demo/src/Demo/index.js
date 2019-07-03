import React, { useState } from 'react'
import './style.css'

import DnDList from 'react-dnd-list'
import TileList from '../TileList'

const Item = props => {
  const dnd = props.dnd
  const cardClasses = props.itemInDrag ? 'card in-drag' : 'card'

  return (
    <div
      style={dnd.item.styles}
      className={dnd.item.classes + ' card-outer'}
      ref={dnd.item.ref}
    >
      <div className={cardClasses}>
        <div className="card-header">
          <span>List {props.item.index}</span>
          <span
            className="drag-handler no-select"
            style={dnd.handler.styles}
            {...dnd.handler.listeners}
          >=</span>
        </div>
        {props.item.component}
      </div>
    </div>
  )
}

const Demo = () => {
  const TileList1 = <TileList
    color="blue"
    items={[
      { value: 1, height: 125 },
      { value: 2, height: 125 },
      { value: 3, height: 75 },
      { value: 4, height: 75 }
    ]}
  />

  const TileList2 = <TileList
    color="pink"
    items={[
      { value: 1, height: 75 },
      { value: 2, height: 75 },
      { value: 3, height: 125 },
      { value: 4, height: 75 }
    ]}
  />

  const [list, setList] = useState([
    { index: 1, component: TileList1 },
    { index: 2, component: TileList2 }
  ])

  return (
    <div className="demo">
      <DnDList
        horizontal
        items={list}
        itemComponent={Item}
        setList={setList}
        setSwapThreshold={size => size * .5}
        setOverflowThreshold={() => 100}
      />
    </div>
  )
}

export default Demo
