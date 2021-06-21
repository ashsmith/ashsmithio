import React, { FC } from 'react';
import ContentfulImage from '@moxy/react-contentful-image';

interface Props {
  src: string;
  alt: string;
}

const Image: FC<Props> = ({ src, alt }) => (
  <div>
    <ContentfulImage
      image={src}
      alt={alt}
      resize={{ width: 776 }}
      loading="lazy"
    />
  </div>
);

export default Image;
