import React, { FC } from 'react';
import type { AppProps } from 'next/app';
import Layout from '../components/Layout';
import '../styles/globals.css';

const MyApp:FC<AppProps> = ({ Component, pageProps }) => (
  <Layout>
    {/* eslint-disable-next-line react/jsx-props-no-spreading */}
    <Component {...pageProps} />
  </Layout>
);

export default MyApp;
