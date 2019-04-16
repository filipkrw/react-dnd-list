import React from 'react'
import DnDElement from './DnDElement'

class DnDList extends React.Component {
  constructor(props) {
    super(props)
    this.swap = this.swap.bind(this)
    this.state = {
      list: ['1', '2', '3', '4', '5']
    }
  }

  swap(a, b) {
    let list = this.state.list.slice()
    ;[list[a], list[b]] = [list[b], list[a]] // swap
    this.setState({ list })
  }

  render() {
    const list = this.state.list.map((el, idx) => (
      <DnDElement
        index={idx}
        last={idx === this.state.list.length - 1}
        swap={this.swap}
        key={el}
      >
        {el}
      </DnDElement>
    ))

    return <ul>{list}</ul>
  }
}

export default DnDList
