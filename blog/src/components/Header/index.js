import React from 'react'
import Link from 'gatsby-link'
import styled from 'styled-components';
import {styleScheme, calcSize} from '../../config';


const HeaderNav = styled.nav`
    display: inline-block;
    max-height: 36px;
`;
const NavLink = styled(Link)`
    width: 36px;
    max-width: 36px;
    height: 36px;

    display: inline-block;
    background-color: ${styleScheme.primaryColor};
    &:last-child {
        margin-right: 0;
    }

    text-indent: 100%;
    white-space: nowrap;
    overflow: hidden;

    &:hover {
        background-color: #1443b8;
    }


        margin-right: 24px;

`;

const WebsiteTitle = styled.h4`
    display: inline-block;
    vertical-align: top;
    font-size: 20px;
    line-height: 36px;
    font-weight: 700;
    padding: 0;
    margin: 0;
    margin-right: 1.5rem;
    a {
        color: inherit;
        span {
            font-weight: normal;
        }
    }
`

const HeaderWrapper = styled.div`
    margin-bottom: 8rem;
    @media (min-width: 700px) {
        margin-left: 4rem;
    }
`;

class Header extends React.Component {
    render() {
        return (
            <HeaderWrapper>
                {(<WebsiteTitle><Link to={"/"}>Ash Smith</Link></WebsiteTitle>)}
                <HeaderNav>
                    <NavLink to={'/'}>Twitter</NavLink>
                    <NavLink to={'/'}>GitHub</NavLink>
                    <NavLink to={'/'}>CommerceHero</NavLink>
                    <NavLink to={'/'}>StackOverflow</NavLink>
                </HeaderNav>
            </HeaderWrapper>
        )
    }
}

export default Header;