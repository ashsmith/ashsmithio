import React from 'react';
import styled from 'styled-components';
import Image from 'gatsby-image';
import {styleScheme} from '../../config';

const ProfilePicture = styled(Image)`
    align-self: center;
    border-radius: 100%;
    border: 6px solid ${styleScheme.primaryColor};
    max-width: 120px;
`;

export default function ProfilePic({ image }) {
    return <ProfilePicture fixed={image.fixed}  alt="Ash Smith - Freelance Magento Developer"/>
};