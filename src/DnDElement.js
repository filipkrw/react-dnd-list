import React from 'react'
import PropTypes from 'prop-types'

class DnDElement extends React.Component {
  constructor(props) {
    super(props)

    this.ref = React.createRef()
    this.activate = this.activate.bind(this)
  }

  componentDidMount() {
    this.bounds = this.ref.current.getBoundingClientRect()
  }

  activate(event) {
    this.props.activate(this.bounds.height, event.clientY, this.ref.current)
  }

  render() {
    return (
      <li
        className={this.props.className}
        style={{ top: this.props.offset }}

        onMouseDown={this.activate}
        onTouchStart={this.activate}
        ref={this.ref}
      >
        {this.props.value}
      </li>
    )
  }

  // componentDidUpdate() {
    // if (this.state.drop) {
    //   if (this.state.offset === 0) {
    //     this.setState({
    //       drag: false,
    //       drop: false,
    //       transition: false
    //     })
    //   } else {
    //     window.requestAnimationFrame(() => {
    //       this.setState({
    //         drop: false,
    //         transition: true,
    //         offset: 0
    //       })
    //     })
    //
    //     this.ref.current.ontransitionend = () => {
    //       this.ref.current.ontransitionend = null
    //       this.setState({ drag: false, transition: false })
    //     }
    //   }
    // }
  // }
}

DnDElement.propTypes = {
  index: PropTypes.number
}

export default DnDElement
