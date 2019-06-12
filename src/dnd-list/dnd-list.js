import React, { Fragment, useRef } from 'react'
import { inRange, shiftArray } from './util'

const initState = {
  drag: false,
  drop: false,
  step: 0,
  index: -1,
  height: 0,
  offset: 0,
  origin: 0,
  newOriginOffset: 0,
  ref: null
}

class List extends React.Component {
  constructor(props) {
    super(props)
    this.state = initState
    this.ControlledItem = createControlledItem(this.props.itemComponent)
  }

  handleDragStart = (index, height, origin, ref) => {
    if (this.state.drag) { return }

    window.addEventListener('mousemove', this.handleDrag)
    window.addEventListener('mouseup', this.handleDrop)
    window.addEventListener('scroll', this.handleDrop)

    this.setState({
      index, height, origin, ref,
      drag: true,
      step: 0,
      offset: 0
    })
  }

  handleDrag = (event) => {
    const offset = event.clientY - this.state.origin
    const newOriginOffset = this.state.height * this.state.step

    if (offset > newOriginOffset + this.state.height) {
      this.setState({ step: this.state.step + 1 })
    } else if (offset < newOriginOffset - this.state.height) {
      this.setState({ step: this.state.step - 1 })
    }

    this.setState({ offset, newOriginOffset })
  }

  handleDrop = () => {
    window.removeEventListener('mousemove', this.handleDrag)
    window.removeEventListener('mouseup', this.handleDrop)
    window.removeEventListener('scroll', this.handleDrop)

    if (!this.props.transitions) {
      this.handleDropEnd()
    } else {
      this.state.ref.addEventListener('transitionend', this.handleDropEnd)

      this.setState({
        drop: true,
        offset: this.state.newOriginOffset
      })
    }
  }

  handleDropEnd = () => {
    this.state.ref.removeEventListener('transitionend', this.handleDropEnd)
    shiftArray(this.props.items, this.state.index, this.state.step)
    this.setState(initState)
  }

  render() {
    const items = this.props.items.map((value, currentIx) => {
      const draggedIx = this.state.index
      const inDrag = draggedIx === currentIx

      let offset = 0
      let classes = ['draggable']

      if (this.state.drag && !inDrag) {
        this.props.transitions && classes.push('top-transition')

        if (inRange(currentIx, draggedIx, draggedIx + this.state.step)) {
          offset = this.state.step < 0
            ? this.state.height
            : -this.state.height
        }
      }

      if (inDrag) {
        offset = this.state.offset
        classes.push('in-drag')
        this.state.drop && classes.push('top-transition')
      }

      return <this.ControlledItem
        key={currentIx}
        value={value}

        style={{ top: offset }}
        className={classes.join(' ')}

        handleDragStart={this.handleDragStart.bind(this, currentIx)}
        inDrag={inDrag}
      />
    })

    return <Fragment>{items}</Fragment>
  }
}

export const createControlledItem = (ItemComponent) => {
  const ControlledItem = (props) => {
    const ref = useRef(null)

    const handleDragStart = (event) => {
      props.handleDragStart(
        ref.current.offsetHeight,
        event.clientY,
        ref.current
      )
    }

    return (
      <ItemComponent
        {...props}
        domRef={ref}
        handleDrag={handleDragStart}
      />
    )
  }

  return ControlledItem
}

export default List
