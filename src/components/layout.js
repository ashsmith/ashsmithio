import React from 'react'
import styled from 'styled-components';
import Helmet from 'react-helmet';
import Header from './Header'
import "prismjs/themes/prism-okaidia.css";
import "../fonts/work-sans.css";
import { calcSize } from '../config';

const Wrapper = styled.div`
  max-width: ${calcSize(904)};
  margin: ${calcSize(24)} ${calcSize(32)};

  @media (min-width: 700px) {
    margin: 0 auto;
  }
`;

export default function Template({ children }) {
  return (
    <Wrapper>
      <Helmet>
        <html lang="en" />
      </Helmet>
    <Header />
      {children}
    </Wrapper>
  );
};
