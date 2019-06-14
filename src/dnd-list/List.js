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
  origin: 0,
  newOriginOffset: 0
}

class List extends React.Component {
  constructor(props) {
    super(props)
    this.state = idleState

    this.itemRefs = []
    this.itemHeights = []

    this.neighbors = {}

    this.Item = createControlledItem(this.props.itemComponent)
    this.transitionClass = this.props.transitionClass
      ? this.props.transitionClass
      : 'dnd-list__transition'
  }

  componentDidMount() {
    this.getitemHeights()
  }

  componentDidUpdate(prevProps, prevState) {
    // after handleDropEnd()
    if (prevState.drag && !this.state.drag) {
      this.getitemHeights()
    }
  }

  saveRef = (ref) => {
    this.itemRefs.push(ref)
  }

  getitemHeights = () => {
    this.itemHeights = this.itemRefs.map(ref => {
      return ref.getBoundingClientRect().height
    })
  }

  updateStep = (newStep, index = this.state.index) => {
    if (newStep === 0) {
      this.neighbors = { prev: index - 1, next: index + 1 }
    } else if (newStep > this.state.step) {
      this.neighbors = { prev: this.neighbors.next, next: this.neighbors.next + 1 }
    } else {
      this.neighbors = { prev: this.neighbors.prev - 1, next: this.neighbors.prev }
    }

    this.setState({ step: newStep })
  }

  handleDragStart = (index, origin) => {
    if (this.state.drag) { return }

    window.addEventListener('mousemove', this.handleDrag)
    window.addEventListener('mouseup', this.handleDrop)
    window.addEventListener('scroll', this.handleDrop)

    this.neighbors = { prev: index - 1, next: index + 1 }
    this.setState({ index, origin, drag: true })
  }

  handleDrag = (event) => {
    const { step, newOriginOffset } = this.state
    const offset = event.clientY - this.state.origin

    const prevHeight = this.itemHeights[this.neighbors.prev]
    const nextHeight = this.itemHeights[this.neighbors.next]

    if (
      this.neighbors.next < this.props.items.length &&
      offset - newOriginOffset > nextHeight
    ) {
      this.setState({ newOriginOffset: this.state.newOriginOffset + nextHeight })
      this.updateStep(step + 1)
    }

    else if (
      this.neighbors.prev > -1 && offset - newOriginOffset < -prevHeight
    ) {
      this.setState({ newOriginOffset: this.state.newOriginOffset - prevHeight })
      this.updateStep(step - 1)
    }

    this.setState({ offset })
  }

  handleDrop = () => {
    window.removeEventListener('mousemove', this.handleDrag)
    window.removeEventListener('mouseup', this.handleDrop)
    window.removeEventListener('scroll', this.handleDrop)

    if (this.props.transitions) {
      this.itemRefs[this.state.index].addEventListener('transitionend', this.handleDropEnd)

      this.setState({
        drop: true,
        offset: this.state.newOriginOffset
      })
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
      const inDrag = draggedIx === currentIx

      let classes = ['dnd-list__draggable']
      let styles = {}

      if (this.state.drag && !inDrag) {
        if (this.props.transitions) {
          classes.push(this.transitionClass)
        }

        if (inRange(currentIx, draggedIx, draggedIx + this.state.step)) {
          styles.top = this.state.step < 0
            ? this.itemHeights[draggedIx]
            : -this.itemHeights[draggedIx]
        }
      }

      if (inDrag) {
        styles.top = this.state.offset
        classes.push('dnd-list__in-drag')
        if (this.state.drop) {
          classes.push(this.transitionClass)
        }
      }

      return <this.Item
        key={currentIx}
        value={value}

        style={styles}
        className={classes.join(' ')}

        saveRef={this.saveRef}
        handleDragStart={this.handleDragStart.bind(this, currentIx)}

        inDrag={inDrag}
      />
    })

    return <Fragment>{items}</Fragment>
  }
}

export default List
