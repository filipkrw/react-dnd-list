import React from 'react';
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

class App extends React.Component {
  render() {
    return (
      <ul>
        <DnDList
          items={['1', '2', '3', '4', '5']}
          itemComponent={ListItem}
          transitions
          transitionsClass={'long-transition'}
        />
    </ul>
    );
  }
}

export default App;
