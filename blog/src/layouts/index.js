import React from 'react'
import Link from 'gatsby-link'
import { Container } from 'react-responsive-grid'
import Header from '../components/Header'
import styled from 'styled-components';
import "prismjs/themes/prism-okaidia.css";
import { calcSize } from '../config';

const Wrapper = styled.div`
  max-width: ${calcSize(904)};
  margin: ${calcSize(24)} ${calcSize(32)};

  @media (min-width: 700px) {
    margin-left: ${calcSize(64)};
  }
`;

class Template extends React.Component {
  render() {
    const { location, children } = this.props

    return (
      <Wrapper>
      <Header showTitle={((this.props.location.pathname !== '/'))} />
        {children()}
      </Wrapper>
    )
  }
}

export default Template
