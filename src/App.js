import React, { Component } from 'react';
import './dnd-list/styles.css';

import DnDList from './dnd-list/List';

class App extends Component {
  render() {
    return (
      <div>
        <DnDList list={['1', '2', '3', '4', '5']} />
      </div>
    );
  }
}

export default App;
