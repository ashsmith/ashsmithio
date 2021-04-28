import React, { FC } from 'react';
import Head from 'next/head';
import { Page } from '@geist-ui/react';
import Header from './Header';

const Layout: FC = ({ children }) => (
  <Page size="large">
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
