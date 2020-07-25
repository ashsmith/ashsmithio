import React from 'react'
import styled from 'styled-components';
import Head from 'next/head';
import Header from './Header'
import { calcSize } from '../config';

const Wrapper = styled.div`
  max-width: ${calcSize(904)};
  margin: ${calcSize(24)} ${calcSize(32)};

  @media (min-width: 700px) {
    margin: 0 auto;
  }
`;

export default function Layout({ children }) {
  return (
    <Wrapper>
      <Head>
        <html lang="en" />
      </Head>
      <Header />
      {children}
    </Wrapper>
  );
};
