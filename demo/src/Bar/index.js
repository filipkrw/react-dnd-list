import React from 'react'
import './style.css'

const Bar = props => {
  return (
    <div className={`bar ${props.className}`}>
      {props.children}
    </div>
  )
}

export default Bar
