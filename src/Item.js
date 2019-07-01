import React from 'react'
import { INPUTS, STYLES } from './consts'

export const createControlledItem = (Item) => {
  return class extends React.Component {
    constructor(props) {
      super(props)
      this.ref = React.createRef()
    }

    componentDidMount() {
      this.props.addRef(this.ref.current)
    }

    render() {
      const dndProps = {
        item: {
          ref: this.ref,
          classes: this.props.className,
          styles: this.props.style
        },
        handler: {
          styles: STYLES.HANDLER,
          listeners: {
            onMouseDown: (event) => this.props.handleDragStart(event, INPUTS.MOUSE),
            onTouchStart: (event) => this.props.handleDragStart(event, INPUTS.TOUCH)
          }
        }
      }

      return <Item
        dnd={dndProps}

        item={this.props.item}
        index={this.props.index}
        first={this.props.first}
        last={this.props.last}

        itemInDrag={this.props.itemInDrag}
        listInDrag={this.props.listInDrag}
      />
    }
  }
}
