import React, { FC } from 'react';

import Header from './Header';

const Layout: FC = ({ children }) => (
  <div className="pb-12">
    <Header />
    {children}
  </div>
);

export default Layout;
