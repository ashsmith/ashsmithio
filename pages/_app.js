import { GeistProvider, CssBaseline } from '@geist-ui/react';
import Layout from '../components/Layout';

const MyApp = ({ Component, pageProps }) => (
  <GeistProvider>
    <CssBaseline />
    <Layout>
      <Component {...pageProps} />
    </Layout>
  </GeistProvider>
);

export default MyApp
