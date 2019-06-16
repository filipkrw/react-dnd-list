import React from 'react'

export const createControlledItem = (Item) => {
  return class extends React.Component {
    constructor(props) {
      super(props)
      this.ref = React.createRef()
    }

    componentDidMount() {
      this.props.saveRef(this.ref.current)
    }

    handleDragStart = (event) => {
      this.props.handleDragStart(event[this.props.mousePos])
    }

    render() {
      return (
        <Item
          {...this.props}
          domRef={this.ref}
          dragHandlers={{
            onMouseDown: this.handleDragStart,
            onTouchStart: this.handleDragStart,
            onPointerDown: this.handleDragStart
          }}
        />
      )
    }
  }
}
