import React from 'react'
import PropTypes from 'prop-types'

class DnDElement extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      drag: false,
      originY: null,
      offsetY: 0,
      step: 0
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
    this.props.activate(this.height)
    document.onmousemove = this.handleDrag
    this.setState({
      drag: true,
      originY: event.clientY,
      offsetY: 0,
      step: 0
    })
  }

  handleDragEnd() {
    this.props.deactivate()
    document.onmousemove = null
    this.setState({ drag: false })
  }

  handleDrag(event) {
    const offsetY = event.clientY - this.state.originY

    const relOriginY = this.height * this.state.step

    if (offsetY >= relOriginY + this.height) {
      this.props.setStep(1)
      this.setState({ step: this.state.step + 1, offsetY })
    } else if (offsetY <= relOriginY - this.height) {
      this.props.setStep(-1)
      this.setState({ step: this.state.step - 1, offsetY })
    }

    // const round = offsetY > 0 ? Math.floor : Math.ceil
    // this.props.setStep(round(offsetY / this.height))

    // if (Math.abs(offsetY) > this.height) {
    //   const direction = offsetY > 0 ? 1 : -1
    //   this.props.swap(this.props.index, this.props.index + direction)
    //   this.handleDragEnd()
    // }

    this.setState({ offsetY })
  }

  render() {
    const style = this.state.drag ? {
      position: 'relative',
      top: this.state.offsetY,
      zIndex: 200
    } : null
    return (
      <li
        style={style || this.props.style}
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
