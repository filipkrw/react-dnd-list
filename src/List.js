import React, { Fragment } from 'react'
import { createControlledItem } from './Item'
import { inRange, arrayShift, clamp } from './util'
import { CLASSES, KEYWORDS, INPUTS } from './consts'

import './styles.css'

const initState = {
  // List controll
  drag: false,
  drop: false,
  step: 0,
  lastSwapped: null,
  neighborIds: {},

  // Dragged element controll
  index: null,
  origin: 0,
  offset: 0,
  newOriginOffset: 0,
  offsetLimits: {},

  dragInput: null, // mouse or touch
}

class List extends React.Component {
  constructor(props) {
    super(props)
    this.state = initState

    this.itemComponent = createControlledItem(this.props.itemComponent)
    this.transitionStyles = this.props.transitionStyles
      ? this.props.transitionStyles
      : {}
    this.getKeywords()

    this.itemRefs = []
    this.itemDims = []
    this.itemOrder = this.props.items.map((item, index) => index)
  }

  componentDidMount() {
    this.addTransitionListeners()
    this.getItemDims()
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.drag && !this.state.drag) { // after handleDropEnd
      this.setState(initState)
      this.getItemDims()
    }

    if (prevProps.horizontal !== this.props.horizontal) {
      this.getKeywords()
      this.getItemDims()
    }
  }

  // Drag and drop functionality -----------------------------------------------

  handleDragStart = (index, event, dragInput) => {
    if (this.state.drag) { return }
    this.setDnDEventListeners(window.addEventListener)

    this.setState({
      index, dragInput, drag: true,
      origin: this.getEventPosition(event, dragInput),
      offsetLimits: this.getOffsetLimits(index),
      neighborIds: { prev: index - 1, next: index + 1 }
    })
  }

  handleDrag = (event) => {
    const offset = this.getOffset(event)

    const prev = this.itemDims[this.state.neighborIds.prev]
    const next = this.itemDims[this.state.neighborIds.next]

    if (
      this.state.neighborIds.next < this.props.items.length &&
      offset - this.state.newOriginOffset >= next.threshold
    ) {
      this.handleSwap(this.state.step + 1)
    }

    else if (
      this.state.neighborIds.prev > -1 &&
      offset - this.state.newOriginOffset <= -prev.threshold
    ) {
      this.handleSwap(this.state.step - 1)
    }

    if (offset !== this.state.offset) {
      this.setState({ offset })
    }
  }

  handleSwap = (newStep) => {
    const { prev, next } = this.state.neighborIds
    const { size } = this.keywords

    let newneighborIds = {}
    let swappedItem = {}

    if (newStep > this.state.step) {
      newneighborIds = { prev: next, next: next + 1 }
      swappedItem = { index: next, size: this.itemDims[next][size] }
    } else {
      newneighborIds = { prev: prev - 1, next: prev }
      swappedItem = { index: prev, size: -this.itemDims[prev][size] } // Negative size
    }

    if (newStep === 0) {
      newneighborIds = { prev: this.state.index - 1, next: this.state.index + 1 }
    }

    this.setState({
      step: newStep,
      newOriginOffset: this.state.newOriginOffset + swappedItem.size,
      lastSwapped: swappedItem.index,
      neighborIds: newneighborIds
    })
  }

  handleDrop = () => {
    this.setDnDEventListeners(window.removeEventListener)

    // Dragged element needs to be transitioned to a new origin
    if (
      !this.props.disableTransitions &&
      Math.abs(this.state.offset - this.state.newOriginOffset) > 1
    ) {
      this.itemRefs[this.itemOrder[this.state.index]].addEventListener('transitionend', this.handleDropTransition)
      this.setState({ drop: true, offset: this.state.newOriginOffset })
    }

    // Dragged element in a new origin, no transition needed, but last swapped element is still in transition
    else if (
      !this.props.disableTransitions &&
      typeof(this.state.lastSwapped) === 'number' &&
      this.itemRefs[this.itemOrder[this.state.lastSwapped]].dataset.intransition === 'true'
    ) {
      this.itemRefs[this.itemOrder[this.state.lastSwapped]].addEventListener('transitionend', this.handleDropTransition)
    }

    // All elements in their new origins, no transitions needed for any elements
    else {
      this.handleDropEnd()
    }
  }

  handleDropTransition = (element) => {
    // Did you know `transitionend` events bubble up?
    if (
      element.propertyName === 'transform' &&
      element.target.className.includes(CLASSES.DRAGGABLE)
    ) {
      this.handleDropEnd()
    }
  }

  handleDropEnd = () => {
    this.itemRefs[this.itemOrder[this.state.index]].removeEventListener('transitionend', this.handleDropEnd)
    this.itemRefs[this.itemOrder[this.state.index]].removeEventListener('transitionend', this.handleDropTransition)

    if (typeof(this.state.lastSwapped) === 'number') {
      this.itemRefs[this.state.lastSwapped].removeEventListener('transitionend', this.handleDropTransition)
    }

    const { index, step } = this.state

    this.itemOrder = arrayShift(this.itemOrder, index, step)
    this.props.setList(arrayShift(this.props.items, index, step))

    this.setState({ ...initState, index: index + step })
    // Final stage of drop happens in componentDidUpdate, to prevent
    // transition cut after components shift
  }

  // Render --------------------------------------------------------------------

  render() {
    const items = this.props.items.map((value, currentIx) => {
      const draggedIx = this.state.index
      const currentInDrag = currentIx === draggedIx

      let classes = [CLASSES.DRAGGABLE]
      let styles = {}

      if (currentInDrag) {
        classes.push(CLASSES.IN_DRAG)
        styles.transform = this.getTransform(this.state.offset)

        if (this.state.drop) {
          classes.push(CLASSES.TRANSITION)
          styles = { ...styles, ...this.transitionStyles }
        }
      }

      else if (this.state.drag && !currentInDrag) {
        if (!this.props.disableTransitions) {
          classes.push(CLASSES.TRANSITION)
          styles = { ...styles, ...this.transitionStyles }
        }

        if (inRange(currentIx, draggedIx, draggedIx + this.state.step)) {
          styles.transform = this.state.step < 0
            ? this.getTransform(this.itemDims[draggedIx][this.keywords.size])
            : this.getTransform(-this.itemDims[draggedIx][this.keywords.size])
        }
      }

      return <this.itemComponent
        key={this.itemOrder[currentIx]}

        style={styles}
        className={classes.join(' ')}

        addRef={this.addRef}
        handleDragStart={this.handleDragStart.bind(this, currentIx)}

        item={value}
        index={currentIx}
        first={currentIx === 0}
        last={currentIx === this.props.items.length - 1}

        listInDrag={this.state.drag}
        itemInDrag={currentInDrag}
      />
    })

    return <Fragment>{items}</Fragment>
  }

  // Helper functions ----------------------------------------------------------

  addRef = (ref) => {
    this.itemRefs.push(ref)
  }

  getKeywords = () => {
    this.keywords = this.props.horizontal
      ? KEYWORDS.HORIZONTAL
      : KEYWORDS.VERTICAL
  }

  addTransitionListeners = () => {
    this.itemRefs.forEach(item => {
      item.addEventListener('transitionstart', () => item.dataset.intransition = true)
      item.addEventListener('transitionend', () => item.dataset.intransition = false)
    })
  }

  getItemDims = () => {
    const { start, end, size } = this.keywords

    this.itemDims = this.itemOrder.map(index => {
      const rect = this.itemRefs[index].getBoundingClientRect()

      return {
        [start]: rect[start],
        [end]: rect[end],
        [size]: rect[size],
        threshold: this.props.setSwapThreshold
          ? this.props.setSwapThreshold(rect[size])
          : rect[size]
      }
    })
  }

  getOffset = (event) => {
    const dragPosition = this.getEventPosition(event)

    return clamp(
      dragPosition - this.state.origin,
      this.state.offsetLimits.min,
      this.state.offsetLimits.max
    )
  }

  getOffsetLimits = (index) => {
    const { start, end, size } = this.keywords
    const dims = this.itemDims

    const overflowThreshold = this.props.setOverflowThreshold
      ? this.props.setOverflowThreshold(dims[index][size])
      : 0

    return {
      min: dims[0][start] - dims[index][start] - overflowThreshold,
      max: dims[this.props.items.length - 1][end] - dims[index][end] + overflowThreshold
    }
  }

  getTransform = (offset) => {
    return `translate${this.keywords.axis}(${offset}px)`
  }

  getEventPosition = (event, dragInput = null) => {
    const client = `client${this.keywords.axis}`
    return (dragInput || this.state.dragInput) === INPUTS.MOUSE
      ? event[client]
      : event.touches[0][client]
  }

  setDnDEventListeners = (listenerFunction) => {
    listenerFunction('mousemove', this.handleDrag)
    listenerFunction('touchmove', this.handleDrag)

    listenerFunction('mouseup', this.handleDrop)
    listenerFunction('scroll', this.handleDrop)
    listenerFunction('touchend', this.handleDrop)
    listenerFunction('touchcancel', this.handleDrop)
  }
}

export default List
