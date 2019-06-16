import React, { Fragment } from 'react'
import { createControlledItem } from './Item'
import { inRange, arrayShift, clamp } from './util'

import './styles.css'

const initState = {
  // List controll
  drag: false,
  drop: false,
  step: 0,

  // Dragged element controll
  index: -1,
  origin: 0,
  offset: 0,
  newOriginOffset: 0
}

class List extends React.Component {
  constructor(props) {
    super(props)
    this.state = initState

    this.itemComponent = createControlledItem(this.props.itemComponent)
    this.options = this.props.horizontal
      ? { start: 'left', end: 'right', dist: 'width', mousePos: 'clientX' }
      : { start: 'top', end: 'bottom', dist: 'height', mousePos: 'clientY' }
    this.transitionStyles = this.props.transitionStyles
      ? this.props.transitionStyles
      : {}

    this.itemRefs = []
    this.itemRects = []
    this.inTransition = {}
    this.neighbors = {}
    this.offsetLimits = {}
  }

  componentDidMount() {
    if (this.props.allowTransitions) {
      this.attachTransitionListeners()
    }
    this.getitemRects()
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.drag && !this.state.drag) { // after handleDropEnd()
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

  handleDragStart = (index, origin) => {
    if (this.state.drag) { return }

    window.addEventListener('mousemove', this.handleDrag)
    window.addEventListener('mouseup', this.handleDrop)
    window.addEventListener('scroll', this.handleDrop)

    this.setState({ index, origin, drag: true })
    this.neighbors = { prev: index - 1, next: index + 1 }

    const { start, end } = this.options
    const rects = this.itemRects

    this.offsetLimits = {
      min: rects[0][start] - rects[index][start],
      max: rects[this.props.items.length - 1][end] - rects[index][end]
    }
  }

  handleDrag = (event) => {
    const offset = clamp(
      event[this.options.mousePos] - this.state.origin,
      this.offsetLimits.min,
      this.offsetLimits.max
    )

    const prev = this.itemRects[this.neighbors.prev]
    const next = this.itemRects[this.neighbors.next]

    if (
      this.neighbors.next < this.props.items.length &&
      offset - this.state.newOriginOffset >= next[this.options.dist]
    ) { this.swap(this.state.step + 1) }

    else if (
      this.neighbors.prev > -1 &&
      offset - this.state.newOriginOffset <= -prev[this.options.dist]
    ) { this.swap(this.state.step - 1) }

    if (offset !== this.state.offset) {
      this.setState({ offset })
    }
  }

  swap = (newStep) => {
    const { prev, next } = this.neighbors
    const { dist } = this.options

    let swapped = {}

    if (newStep > this.state.step) {
      this.neighbors = { prev: next, next: next + 1 }
      swapped = { index: next, [dist]: this.itemRects[next][dist] }
    } else {
      this.neighbors = { prev: prev - 1, next: prev }
      swapped = { index: prev, [dist]: -this.itemRects[prev][dist] } // Negative height
    }

    if (newStep === 0) {
      this.neighbors = { prev: this.state.index - 1, next: this.state.index + 1 }
    }

    if (this.props.allowTransitions) {
      this.inTransition[swapped.index] = true
      this.inTransition.last = swapped.index
    }

    this.setState({
      step: newStep,
      newOriginOffset: this.state.newOriginOffset + swapped[dist]
    })
  }

  handleDrop = () => {
    window.removeEventListener('mousemove', this.handleDrag)
    window.removeEventListener('mouseup', this.handleDrop)
    window.removeEventListener('scroll', this.handleDrop)

    if (this.props.allowTransitions) {
      if (this.state.offset !== this.state.newOriginOffset) {
        this.itemRefs[this.state.index].addEventListener('transitionend', this.handleDropEnd)
        this.setState({ drop: true, offset: this.state.newOriginOffset })
        return
      } else if (this.inTransition[this.inTransition.last]) {
        this.itemRefs[this.inTransition.last].addEventListener('transitionend', this.handleDropEnd)
        return
      }
    }

    this.handleDropEnd()
  }

  handleDropEnd = () => {
    this.itemRefs[this.state.index].removeEventListener('transitionend', this.handleDropEnd)

    if (typeof(this.inTransition.last) !== 'undefined') {
      this.itemRefs[this.inTransition.last].removeEventListener('transitionend', this.handleDropEnd)
    }

    const newList = arrayShift(this.props.items, this.state.index, this.state.step)
    this.props.setList(newList)

    this.setState(initState)
    this.inTransition = {}
  }

  render() {
    const items = this.props.items.map((value, currentIx) => {
      const draggedIx = this.state.index
      const currentInDrag = currentIx === draggedIx

      let classes = ['dnd-list__draggable']
      let styles = { [this.options.start]: 0 }

      if (currentInDrag) {
        classes.push('dnd-list__in-drag')
        styles[this.options.start] = this.state.offset

        if (this.state.drop) {
          classes.push('dnd-list__transition')
          styles = { ...styles, ...this.transitionStyles }
        }
      }

      else if (this.state.drag && !currentInDrag) {
        if (this.props.allowTransitions) {
          classes.push('dnd-list__transition')
          styles = { ...styles, ...this.transitionStyles }
        }

        if (inRange(currentIx, draggedIx, draggedIx + this.state.step)) {
          styles[this.options.start] = this.state.step < 0
            ? this.itemRects[draggedIx][this.options.dist]
            : -this.itemRects[draggedIx][this.options.dist]
        }
      }

      return <this.itemComponent
        key={currentIx}
        value={value}

        style={styles}
        className={classes.join(' ')}

        saveRef={this.saveRef}
        handleDragStart={this.handleDragStart.bind(this, currentIx)}

        inDrag={currentInDrag}
        mousePos={this.options.mousePos}
      />
    })

    return <Fragment>{items}</Fragment>
  }
}

export default List
