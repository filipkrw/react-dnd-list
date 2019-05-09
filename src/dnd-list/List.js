import React from 'react'
import Item from './Item'

import { inRange, shiftArray } from './util'

const initState = {
  drag: false,
  transition: false,
  index: null,
  height: null,
  offset: 0,
  origin: null,
  originOffset: null,
  step: null,
  ref: null
}

class List extends React.Component {
  constructor(props) {
    super(props)
    this.state = initState
  }

  setStep = (step) => {
    this.setState({ step })
  }

  activate = (index, height, origin, ref) => {
    if (this.state.drag) return

    window.addEventListener('mousemove', this.handleDrag)
    window.addEventListener('mouseup', this.deactivate)
    window.addEventListener('scroll', this.deactivate)

    this.setState({
      index, height, origin, ref,
      drag: true,
      step: 0,
      offset: 0
    })
  }

  deactivate = () => {
    window.removeEventListener('mousemove', this.handleDrag)
    window.removeEventListener('mouseup', this.deactivate)
    window.removeEventListener('scroll', this.deactivate)

    this.state.ref.addEventListener('transitionend', this.handleDragEnd)

    this.setState({
      transition: true,
      offset: this.state.originOffset
    })
  }

  handleDragEnd = () => {
    this.state.ref.removeEventListener('transitionend', this.handleDragEnd)
    shiftArray(this.props.list, this.state.index, this.state.step)
    this.setState(initState)
  }

  handleDrag = (event) => {
    const offset = event.clientY - this.state.origin
    const originOffset = this.state.height * this.state.step

    if (offset > originOffset + this.state.height) {
      this.setStep(this.state.step + 1)
    } else if (offset < originOffset - this.state.height) {
      this.setStep(this.state.step - 1)
    }

    this.setState({ offset, originOffset })
  }

  render() {
    const list = this.props.list.map((value, currentIx) => {
      const draggedIx = this.state.index

      let offset = 0
      let classes = ['draggable']

      if (draggedIx !== null && draggedIx !== currentIx) {
        classes.push('top-transition')

        if (inRange(currentIx, draggedIx, draggedIx + this.state.step)) {
          offset = this.state.step < 0
            ? this.state.height
            : -this.state.height
        }
      }

      if (draggedIx === currentIx) {
        offset = this.state.offset
        classes.push('in-drag')
        this.state.transition && classes.push('top-transition')
      }

      return (
        <Item
          key={value}
          index={currentIx}
          value={value}

          className={classes.join(' ')}
          offset={offset}
          step={this.state.step}
          setStep={this.setStep}
          activate={this.activate.bind(this, currentIx)}
          deactivate={this.deactivate}
          transition={this.state.transition}
        />
      )
    })

    return <ul>{list}</ul>
  }
}

export default List
