import React from 'react'

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
        ref: this.ref,
        styles: this.props.style,
        classes: this.props.className,
        dragHandlers: {
          onMouseDown: (event) => this.props.handleDragStart(event, 'MOUSE'),
          onTouchStart: (event) => this.props.handleDragStart(event, 'TOUCH')
        }
      }

      return <Item
        dnd={dndProps}
        
        item={this.props.item}
        index={this.props.index}
        first={this.props.first}
        last={this.props.last}

        itemInDrag={this.props.itemInDrag}
        itemInDrop={this.props.itemInDrop}
        listInDrag={this.props.listInDrag}
        listInDrop={this.props.listInDrop}
      />
    }
  }
}
