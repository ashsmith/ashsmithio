import React, { FC } from 'react';
import { GeistProvider, CssBaseline } from '@geist-ui/react';
import type { AppProps } from 'next/app';
import Layout from '../components/Layout';

const MyApp:FC<AppProps> = ({ Component, pageProps }) => (
  <GeistProvider>
    <CssBaseline />
    <Layout>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <Component {...pageProps} />
    </Layout>
  </GeistProvider>
);

export default MyApp;
