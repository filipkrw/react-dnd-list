import React from 'react'
import PropTypes from 'prop-types'

class DnDElement extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      drag: false,
      origin: null,
      offset: 0
    }

    this.ref = React.createRef()

    this.handleDragStart = this.handleDragStart.bind(this)
    this.handleDragEnd = this.handleDragEnd.bind(this)
    this.handleDrag = this.handleDrag.bind(this)
  }

  componentDidMount() {
    const dimensions = this.ref.current.getBoundingClientRect()
    this.height = dimensions.height
  }

  handleDragStart(event) {
    this.props.activate(this.height)
    document.onmousemove = this.handleDrag

    this.setState({
      drag: true,
      origin: event.clientY,
      offset: 0,
      step: 0
    })
  }

  handleDragEnd() {
    document.onmousemove = null

    this.setState({
      offset: this.state.offset - (this.props.step * this.height),
      drag: false
    })

    this.props.deactivate()
  }

  handleDrag(event) {
    const offset = event.clientY - this.state.origin
    const originOffset = this.height * this.props.step

    if (offset >= originOffset + this.height) {
      this.props.setStep(this.props.step + 1)
    }

    else if (offset <= originOffset - this.height) {
      this.props.setStep(this.props.step - 1)
    }

    this.setState({ offset })
  }

  render() {
    let classes = ['draggable']
    this.state.drag && classes.push('in-drag')

    const offset = this.state.drag
      ? this.state.offset
      : this.props.offset

    return (
      <li
        id={this.props.element}
        className={classes.join(' ')}
        style={{ top: offset }}

        onMouseDown={this.handleDragStart}
        onMouseUp={this.handleDragEnd}
        ref={this.ref}
      >
        {this.props.value}
      </li>
    )
  }
}

DnDElement.propTypes = {
  index: PropTypes.number
}

export default DnDElement
