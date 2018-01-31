import React from 'react'
import styled from 'styled-components'
import profilePic from './profile-pic.jpg'
import {styleScheme, calcSize} from '../../config';

const ProfilePicture = styled.img`
align-self: center;
border-radius: 100%;
border: 6px solid ${styleScheme.primaryColor};
`


class ProfilePic extends React.Component {
    render() {
        return (<ProfilePicture src={profilePic}  alt="Ash Smith - Freelance Magento Developer"/>)
    }
}


export default ProfilePic;