import React from 'react'
import PropTypes from 'prop-types'

class DnDElement extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      drag: false,
      originY: null,
      offsetY: 0
    }

    this.ref = React.createRef()

    this.handleDragStart = this.handleDragStart.bind(this)
    this.handleDragEnd = this.handleDragEnd.bind(this)
    this.handleDrag = this.handleDrag.bind(this)
  }

  componentDidMount() {
    this.height = this.ref.current.offsetHeight
  }

  handleDragStart(event) {
    document.onmousemove = this.handleDrag
    this.setState({
      drag: true,
      originY: event.clientY,
      offsetY: 0
    })
  }

  handleDragEnd() {
    document.onmousemove = null
    this.setState({ drag: false })
  }

  handleDrag(event) {
    const offsetY = event.clientY - this.state.originY

    if (Math.abs(offsetY) > this.height) {
      const direction = offsetY > 0 ? 1 : -1
      this.props.swap(this.props.index, this.props.index + direction)
      this.handleDragEnd()
    }

    this.setState({ offsetY })
  }

  render() {
    const style = this.state.drag ? {
      position: 'relative',
      top: this.state.offsetY
    } : {}

    return (
      <li
        style={style}
        onMouseDown={this.handleDragStart}
        onMouseUp={this.handleDragEnd}
        ref={this.ref}
      >
        {this.props.children}
      </li>
    )
  }
}

DnDElement.propTypes = {
  index: PropTypes.number
}

export default DnDElement
