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
        item={this.props.item}
        inDrag={this.props.inDrag}
        dnd={dndProps}
      />
    }
  }
}
