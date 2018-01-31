import React from 'react'
import Link from 'gatsby-link'
import { Container } from 'react-responsive-grid'
import Header from '../components/Header'

import "prismjs/themes/prism-okaidia.css";


class Template extends React.Component {
  render() {
    const { location, children } = this.props

    return (
      <div style={{maxWidth: '50em', margin: '0 auto'}}>
        <Header />
        {children()}
      </div>
    )
  }
}

export default Template
