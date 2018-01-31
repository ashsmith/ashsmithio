import React from 'react'
import Link from 'gatsby-link'
import { Container } from 'react-responsive-grid'
import Header from '../components/Header'
import "./body-reset.css";
import "prismjs/themes/prism-okaidia.css";


class Template extends React.Component {
  render() {
    const { location, children } = this.props

    return (
      <div style={{maxWidth: '56.5em'}}>
      <Header showTitle={((this.props.location.pathname !== '/'))} />
        {children()}
      </div>
    )
  }
}

export default Template
