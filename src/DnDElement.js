import React from 'react'

class DnDElement extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      drag: false,
      originY: null,
      offsetY: 0
    }

    this.handleDragStart = this.handleDragStart.bind(this);
    this.handleDragEnd = this.handleDragEnd.bind(this);
    this.handleDrag = this.handleDrag.bind(this);
  }

  handleDragStart(event) {
    document.onmousemove = this.handleDrag;
    this.setState({ drag: true, originY: event.clientY });
  }

  handleDragEnd() {
    document.onmousemove = null;
    this.setState({ drag: false, offsetY: 0 });
  }

  handleDrag(event) {
    this.setState({ offsetY: event.clientY - this.state.originY });
  }

  render() {
    const style = this.state.drag ? {
      position: 'relative',
      top: this.state.offsetY
    } : {}

    return (
      <li
        style={style}
        onMouseDown={this.handleDragStart}
        onMouseUp={this.handleDragEnd}
      >
        {this.props.children}
      </li>
    );
  }
}

export default DnDElement
