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

    handleDragStart = (event) => {
      this.props.handleDragStart(event[this.props.mousePos])
    }

    render() {
      const dndProps = {
        ref: this.ref,
        style: this.props.style,
        classes: this.props.className,
        dragHandlers: {
          onMouseDown: this.handleDragStart,
          onTouchStart: this.handleDragStart,
          onPointerDown: this.handleDragStart
        }
      }

      return <Item item={this.props.item} dnd={dndProps} />
    }
  }
}
