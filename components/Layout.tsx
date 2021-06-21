import React, { FC } from 'react';

import Header from './Header';

const Layout: FC = ({ children }) => (
  <div className="bg-gray-100 pb-12">
    <Header />
    {children}
  </div>
);

export default Layout;
