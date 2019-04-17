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
      let offset = 0
      const activeIndex = this.state.activeIndex

      if (
        activeIndex !== null &&
        activeIndex !== index &&
        isInRange(index, activeIndex, activeIndex + this.state.step)
      ) {
        offset = this.state.step < 0
          ? this.state.activeHeight
          : -this.state.activeHeight
      }

      return (
        <DnDElement
          key={value}
          index={index}
          value={value}

          offset={offset}
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
