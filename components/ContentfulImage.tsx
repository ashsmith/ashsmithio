import React, { FC } from 'react';
import ContentfulImage from '@moxy/react-contentful-image';
import { Display } from '@geist-ui/react';

interface Props {
  src: string;
  alt: string;
}

const Image: FC<Props> = ({ src, alt }) => (
  <Display shadow caption={alt}>
    <ContentfulImage
      image={src}
      alt={alt}
      resize={{ width: 776 }}
      loading="lazy"
    />
  </Display>
);

export default Image;
