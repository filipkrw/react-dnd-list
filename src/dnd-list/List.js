import React, { Fragment } from 'react'
import { createControlledItem } from './Item'
import { inRange, arrayShift } from './util'

import './styles.css'

const idleState = {
  // List controll
  drag: false,
  drop: false,
  step: 0,

  // Dragged element controll
  index: -1,
  offset: 0,
  minOffset: 0,
  maxOffset: 0,
  origin: 0,
  newOriginOffset: 0,

  lastSwapped: -1
}

class List extends React.Component {
  constructor(props) {
    super(props)
    this.state = idleState

    this.itemRefs = []
    this.itemRects = []
    this.neighbors = {}

    this.Item = createControlledItem(this.props.itemComponent)
    this.transitionClass = this.props.transitionClass
      ? this.props.transitionClass
      : 'dnd-list__transition'
  }

  componentDidMount() {
    this.getitemRects()
  }

  componentDidUpdate(prevProps, prevState) {
    // after handleDropEnd()
    if (prevState.drag && !this.state.drag) {
      this.getitemRects()
    }
  }

  saveRef = (ref) => {
    this.itemRefs.push(ref)
  }

  getitemRects = () => {
    this.itemRects = this.itemRefs.map(ref => {
      return ref.getBoundingClientRect()
    })
  }

  updateStep = (newStep) => {
    const lastSwapped = newStep > this.state.step ? this.neighbors.next : this.neighbors.prev

    if (newStep === 0) {
      this.neighbors = { prev: this.state.index - 1, next: this.state.index + 1 }
    } else if (newStep > this.state.step) {
      this.neighbors = { prev: this.neighbors.next, next: this.neighbors.next + 1 }
    } else {
      this.neighbors = { prev: this.neighbors.prev - 1, next: this.neighbors.prev }
    }

    this.setState({ step: newStep, lastSwapped })
  }

  handleDragStart = (index, origin) => {
    if (this.state.drag) { return }

    window.addEventListener('mousemove', this.handleDrag)
    window.addEventListener('mouseup', this.handleDrop)
    window.addEventListener('scroll', this.handleDrop)

    this.neighbors = { prev: index - 1, next: index + 1 }

    const dims = this.itemRects

    this.setState({
      index, origin,
      drag: true,
      minOffset: dims[0].top - dims[index].top,
      maxOffset: dims[this.props.items.length - 1].bottom - dims[index].bottom
    })
  }

  handleDrag = (event) => {
    const offset = Math.max(
      this.state.minOffset,
      Math.min(this.state.maxOffset, event.clientY - this.state.origin)
    )

    const prev = this.itemRects[this.neighbors.prev]
    const next = this.itemRects[this.neighbors.next]

    if (
      this.neighbors.next < this.props.items.length &&
      offset - this.state.newOriginOffset >= next.height
    ) {
      this.setState({ newOriginOffset: this.state.newOriginOffset + next.height })
      this.updateStep(this.state.step + 1)
    }

    else if (
      this.neighbors.prev > -1 &&
      offset - this.state.newOriginOffset <= -prev.height
    ) {
      this.setState({ newOriginOffset: this.state.newOriginOffset - prev.height })
      this.updateStep(this.state.step - 1)
    }

    this.setState({ offset })
  }

  handleDrop = () => {
    window.removeEventListener('mousemove', this.handleDrag)
    window.removeEventListener('mouseup', this.handleDrop)
    window.removeEventListener('scroll', this.handleDrop)

    if (this.props.transitions) {
      this.itemRefs[this.state.index].addEventListener('transitionend', this.handleDropEnd)

      // Add arbitrary small value to new offset, because animation won't play
      // if offset and newOriginOffset have exact same values when element is dropped
      // (will happen when dragged element is dropped precisely where it will end up
      // after drop), resulting in handleDropEnd() not being called.
      const newOffset = this.state.offset === this.state.newOriginOffset
        ? this.state.newOriginOffset + .00001
        : this.state.newOriginOffset

      this.setState({ drop: true, offset: newOffset })
    } else {
      this.handleDropEnd()
    }
  }

  handleDropEnd = () => {
    this.itemRefs[this.state.index].removeEventListener('transitionend', this.handleDropEnd)

    const newList = arrayShift(this.props.items, this.state.index, this.state.step)
    this.props.setList(newList)

    this.setState(idleState)
  }

  render() {
    const items = this.props.items.map((value, currentIx) => {
      const draggedIx = this.state.index
      const currentInDrag = currentIx === draggedIx

      let classes = ['dnd-list__draggable']
      let styles = {}

      if (this.state.drag && !currentInDrag) {
        if (this.props.transitions) { classes.push(this.transitionClass) }

        if (inRange(currentIx, draggedIx, draggedIx + this.state.step)) {
          styles.top = this.state.step < 0
            ? this.itemRects[draggedIx].height
            : -this.itemRects[draggedIx].height
        }
      }

      if (currentInDrag) {
        styles.top = this.state.offset
        classes.push('dnd-list__in-drag')
        if (this.state.drop) { classes.push(this.transitionClass)}
      }

      return <this.Item
        key={currentIx}
        value={value}

        style={styles}
        className={classes.join(' ')}

        saveRef={this.saveRef}
        handleDragStart={this.handleDragStart.bind(this, currentIx)}

        inDrag={currentInDrag}
      />
    })

    return <Fragment>{items}</Fragment>
  }
}

export default List
