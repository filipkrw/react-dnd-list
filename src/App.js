import React, { Fragment, Component } from 'react';
import './dnd-list/styles.css';

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

class App extends Component {
  render() {
    return (
      <ul>
        <DnDList
          items={['1', '2', '3', '4', '5']}
          itemComponent={ListItem}
          transitions
        />
    </ul>
    );
  }
}

export default App;
