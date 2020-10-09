import React from 'react'
import Head from 'next/head';
import Header from './Header'
import { Page } from '@geist-ui/react';

const Layout = ({ children }) => (
  <Page size="large" dotBackdrop>
    <Head>
      <html lang="en" />
    </Head>
    <Page.Header>
      <Header />
    </Page.Header>
    <Page.Content>
      {children}
    </Page.Content>
  </Page>
);

export default Layout;
