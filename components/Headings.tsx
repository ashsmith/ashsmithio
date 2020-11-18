import React from 'react';
import { Text } from '@geist-ui/react';

const H1 = ({ children }) => (<Text h1>{children}</Text>);
const H2 = ({ children }) => (<Text h2>{children}</Text>);
const H3 = ({ children }) => (<Text h3>{children}</Text>);
const H4 = ({ children }) => (<Text h4>{children}</Text>);
const H5 = ({ children }) => (<Text h5>{children}</Text>);

export {
  H1, H2, H3, H4, H5,
};
