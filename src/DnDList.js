import React from 'react'
import DnDElement from './DnDElement'

const isInRange = (x, rangeA, rangeB) => {
  if (rangeA > rangeB) {
    [rangeA, rangeB] = [rangeB, rangeA]
  }

  return x >= rangeA && x <= rangeB
}

const arrayMove = (array, index, step) => {
  let copy = [...array]
  copy.splice(index + step, 0, copy.splice(index, 1)[0])
  return copy
}

class DnDList extends React.Component {
  constructor(props) {
    super(props)
    this.swap = this.swap.bind(this)
    this.state = {
      list: [
        '-',
        '-----',
        '---------',
        '-------------',
        '-----------------'
      ],
      activeIndex: null,
      activeHeight: null,
      step: null
    }

    this.setStep = this.setStep.bind(this)
    this.getActivator = this.getActivator.bind(this)
    this.deactivate = this.deactivate.bind(this)
  }

  setStep(step) {
    this.setState({ step: this.state.step + step })
  }

  getActivator(index) {
    return (height) => this.setState({
      activeIndex: index,
      activeHeight: height,
      step: 0
    })
  }

  deactivate() {
    this.setState({
      list: arrayMove(this.state.list, this.state.activeIndex, this.state.step),
      activeIndex: null,
      activeHeight: null,
      step: null
    })
  }

  swap(a, b) {
    let list = this.state.list.slice()
    ;[list[a], list[b]] = [list[b], list[a]] // swap
    this.setState({ list, forceDragIdx: b })
  }

  render() {
    const list = this.state.list.map((element, index) => {
      const activeIndex = this.state.activeIndex
      let style = {
        position: 'relative',
        zIndex: 100,
        top: 0
      }

      if (
        activeIndex !== null &&
        activeIndex !== index &&
        isInRange(index, activeIndex, activeIndex + this.state.step)
      ) {
        style.top = this.state.step < 0 ? this.state.activeHeight : -this.state.activeHeight
      }

      return (
        <DnDElement
          key={index}
          setStep={this.setStep}
          activate={this.getActivator(index).bind(this)}
          deactivate={this.deactivate}
          style={style}
        >
          {element}
        </DnDElement>
      )
    })

    return <ul>{list}</ul>
  }
}

export default DnDList
