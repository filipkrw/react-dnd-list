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
  origin: 0,
  offset: 0,
  minOffset: 0,
  maxOffset: 0,
  newOriginOffset: 0
}

class List extends React.Component {
  constructor(props) {
    super(props)
    this.state = idleState

    this.itemRefs = []
    this.itemRects = []
    this.neighbors = {}
    this.inTransition = {}

    this.counter = 0

    this.Item = createControlledItem(this.props.itemComponent)
    this.transitionClass = this.props.transitionClass
      ? this.props.transitionClass
      : 'dnd-list__transition'
  }

  componentDidMount() {
    if (this.props.transitions) {
      this.attachTransitionListeners()
    }
    this.getitemRects()
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.drag && !this.state.drag) {
      this.getitemRects()
    }
  }

  saveRef = (ref) => {
    this.itemRefs.push(ref)
  }

  getitemRects = () => {
    this.itemRects = this.itemRefs.map(item => {
      return item.getBoundingClientRect()
    })
  }

  attachTransitionListeners = () => {
    this.itemRefs.forEach((item, index) => {
      item.addEventListener('transitionend', () => {
        this.inTransition[index] = false
      })
    })
  }

  swap = (newStep) => {
    let swapped = {}

    if (newStep > this.state.step) {
      swapped = {
        index: this.neighbors.next,
        height: this.itemRects[this.neighbors.next].height
      }
      this.neighbors = {
        prev: this.neighbors.next,
        next: this.neighbors.next + 1
      }
    } else {
      swapped = {
        index: this.neighbors.prev,
        height: -this.itemRects[this.neighbors.prev].height // negative value
      }
      this.neighbors = {
        prev: this.neighbors.prev - 1,
        next: this.neighbors.prev
      }
    }

    if (newStep === 0) {
      this.neighbors = {
        prev: this.state.index - 1,
        next: this.state.index + 1
      }
    }

    if (this.props.transitions) {
      this.inTransition = {
        ...this.inTransition,
        [swapped.index]: true,
        last: swapped.index
      }
    }

    this.setState({
      step: newStep,
      newOriginOffset: this.state.newOriginOffset + swapped.height
    })
  }

  handleDragStart = (index, origin) => {
    if (this.state.drag) { return }

    window.addEventListener('mousemove', this.handleDrag)
    window.addEventListener('mouseup', this.handleDrop)
    window.addEventListener('scroll', this.handleDrop)

    this.neighbors = {
      prev: index - 1,
      next: index + 1
    }

    const rects = this.itemRects

    this.setState({
      index, origin,
      drag: true,
      minOffset: rects[0].top - rects[index].top,
      maxOffset: rects[this.props.items.length - 1].bottom - rects[index].bottom
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
      this.swap(this.state.step + 1)
    }

    else if (
      this.neighbors.prev > -1 &&
      offset - this.state.newOriginOffset <= -prev.height
    ) {
      this.swap(this.state.step - 1)
    }

    if (offset !== this.state.offset) {
      this.setState({ offset })
    }
  }

  handleDrop = () => {
    window.removeEventListener('mousemove', this.handleDrag)
    window.removeEventListener('mouseup', this.handleDrop)
    window.removeEventListener('scroll', this.handleDrop)

    if (this.props.transitions) {
      if (this.state.offset === this.state.newOriginOffset) {
        const lastInTransition = this.inTransition[this.inTransition.last]
        
        if (lastInTransition) {
          this.itemRefs[this.inTransition.last].addEventListener('transitionend', this.handleDropEnd)
        } else {
          this.handleDropEnd()
        }
      } else {
        this.itemRefs[this.state.index].addEventListener('transitionend', this.handleDropEnd)
        this.setState({ drop: true, offset: this.state.newOriginOffset })
      }
    } else {
      this.handleDropEnd()
    }
  }

  handleDropEnd = () => {
    this.itemRefs[this.state.index].removeEventListener('transitionend', this.handleDropEnd)

    if (typeof(this.inTransition.last) !== 'undefined') {
      this.itemRefs[this.inTransition.last].removeEventListener('transitionend', this.handleDropEnd)
    }

    const newList = arrayShift(this.props.items, this.state.index, this.state.step)
    this.props.setList(newList)

    this.setState(idleState)
    this.inTransition = {}
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
