import React, { Component } from 'react';
import './App.css';

import DnDList from './DnDList';

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
