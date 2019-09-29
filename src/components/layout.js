import React from 'react'
import Header from './Header'
import styled from 'styled-components';
import "prismjs/themes/prism-okaidia.css";
import "../fonts/work-sans.css";
import { calcSize } from '../config';
import Helmet from 'react-helmet'

const Wrapper = styled.div`
  max-width: ${calcSize(904)};
  margin: ${calcSize(24)} ${calcSize(32)};

  @media (min-width: 700px) {
    margin: 0 auto;
  }
`;

class Template extends React.Component {
  render() {
    const { children } = this.props

    return (
      <Wrapper>
        <Helmet>
          <html lang="en" />
        </Helmet>
      <Header />
        {children}
      </Wrapper>
    )
  }
}

export default Template
