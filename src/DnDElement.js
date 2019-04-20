import React from 'react'
import PropTypes from 'prop-types'

class DnDElement extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      drag: false,
      drop: false,
      transition: false,
      origin: null,
      offset: 0
    }

    this.ref = React.createRef()

    this.handleDragStart = this.handleDragStart.bind(this)
    this.handleDragEnd = this.handleDragEnd.bind(this)
    this.handleDrag = this.handleDrag.bind(this)
  }

  componentDidMount() {
    this.bounds = this.ref.current.getBoundingClientRect()
  }

  componentDidUpdate() {
    if (this.state.drop) {
      window.requestAnimationFrame(() => {
        this.setState({
          drop: false,
          transition: true,
          offset: 0
        })
      });

      this.ref.current.ontransitionend = () => {
        this.ref.current.ontransitionend = null
        this.setState({ drag: false, transition: false })
      }
    }
  }

  handleDragStart(event) {
    document.onmousemove = this.handleDrag
    this.props.activate(this.bounds.height)

    this.setState({
      drag: true,
      origin: event.clientY,
      offset: 0,
      step: 0
    })
  }

  handleDragEnd() {
    document.onmousemove = null
    this.props.deactivate()

    this.setState({
      drop: true,
      offset: Math.round(this.state.offset - (this.props.step * this.bounds.height))
    })
  }

  handleDrag(event) {
    const offset = event.clientY - this.state.origin
    const originOffset = this.bounds.height * this.props.step

    if (offset >= originOffset + this.bounds.height) {
      this.props.setStep(this.props.step + 1)
    }

    else if (offset <= originOffset - this.bounds.height) {
      this.props.setStep(this.props.step - 1)
    }

    this.setState({ offset })
  }

  render() {
    let classes = ['draggable']
    this.state.drag && classes.push('in-drag')

    if (this.props.transition || this.state.transition) {
      classes.push('top-transition')
    }

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
        onMouseLeave={this.hansdleDragEnd}
        onTouchStart={this.handleDragStart}
        onTouchEnd={this.handleDragEnd}
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
