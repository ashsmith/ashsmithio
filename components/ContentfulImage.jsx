import React from 'react';
import ContentfulImage from '@moxy/react-contentful-image';

const Image = ({ src, alt }) => (
  <ContentfulImage
    image={ src }
    alt={alt}
    resize={{ width: 776 }}
    loading="lazy"
  />
);

export default Image;