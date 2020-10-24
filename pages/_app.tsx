import React, { FC } from 'react';
import { GeistProvider, CssBaseline } from '@geist-ui/react';
import type { AppProps } from 'next/app';
import { Router } from 'next/router';
import Layout from '../components/Layout';
import * as gtag from '../lib/gtag';

Router.events.on('routeChangeComplete', (url) => gtag.pageview(url));

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
