import React from 'react'
import DnDElement from './DnDElement'

import { isInRange, shiftArray } from './dnd-util'

class DnDList extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      drag: false,
      activeIndex: null,
      activeHeight: null,
      step: null
    }

    this.setStep = this.setStep.bind(this)
    this.deactivate = this.deactivate.bind(this)
  }

  setStep(step) {
    this.setState({ step })
  }

  activate(index, height) {
    this.setState({
      activeIndex: index,
      activeHeight: height,
      step: 0
    })
  }

  deactivate() {
    shiftArray(this.props.list, this.state.activeIndex, this.state.step)

    this.setState({
      activeIndex: null,
      activeHeight: null,
      step: null
    })
  }

  render() {
    const list = this.props.list.map((value, index) => {
      const activeIx = this.state.activeIndex

      let offset = 0
      let transition = false

      if (activeIx !== null && activeIx !== index) {
        transition = true

        if (isInRange(index, activeIx, activeIx + this.state.step)) {
          offset = this.state.step < 0
            ? this.state.activeHeight
            : -this.state.activeHeight
        }
      }

      return (
        <DnDElement
          key={value}
          index={index}
          value={value}

          offset={offset}
          transition={transition}
          step={this.state.step}
          setStep={this.setStep}
          activate={this.activate.bind(this, index)}
          deactivate={this.deactivate}
        />
      )
    })

    return <ul>{list}</ul>
  }
}

export default DnDList
