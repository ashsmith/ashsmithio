import React, { FC } from 'react';

import Header from './Header';

const Layout: FC = ({ children }) => (
  <div className="bg-gray-100 pb-12">
    <Header />
    <div className="max-w-3xl m-auto bg-white -mt-14 px-10 py-8">
      {children}
    </div>
  </div>
);

export default Layout;
