import React, { FC } from 'react';
import type { AppProps } from 'next/app';
import { Router } from 'next/router';
import Layout from '../components/Layout';
import * as gtag from '../lib/gtag';
import '../styles/globals.css';

Router.events.on('routeChangeComplete', (url) => gtag.pageview(url));

const MyApp:FC<AppProps> = ({ Component, pageProps }) => (
  <Layout>
    {/* eslint-disable-next-line react/jsx-props-no-spreading */}
    <Component {...pageProps} />
  </Layout>
);

export default MyApp;
