import React from 'react';
import styled from 'styled-components';
import Image from './profile-pic.jpg';
import {styleScheme} from '../../config';

const ProfilePicture = styled.img`
    align-self: center;
    border-radius: 100%;
    border: 6px solid ${styleScheme.primaryColor};
    max-width: 120px;
`;

export default function ProfilePic() {
    return <ProfilePicture src={Image}  alt="Ash Smith - Freelance Magento Developer"/>
};