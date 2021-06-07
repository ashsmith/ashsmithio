import React, { FC } from 'react';
import { Page } from '@geist-ui/react';
import Header from './Header';

const Layout: FC = ({ children }) => (
  <Page size="large">
    <Page.Header>
      <Header />
    </Page.Header>
    <Page.Content>
      {children}
    </Page.Content>
  </Page>
);

export default Layout;
