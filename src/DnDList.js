import React from 'react';
import PropTypes from 'prop-types';
import DnDElement from './DnDElement';

class DnDList extends React.Component {
  // constructor(props) {
  //   super(props)
  // }

  render() {
    const list = this.props.list.map((idx, el) => (
      <DnDElement key={idx}>
        {el}
      </DnDElement>
    ));

    return (
      <ul>
        {list}
      </ul>
    )
  }
}

DnDList.propTypes = {
  list: PropTypes.array
}

export default DnDList
