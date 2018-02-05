import React from 'react'
import Link from 'gatsby-link'
import styled from 'styled-components';
import {styleScheme, calcSize} from '../../config';
import twitterIcon from './twitter.svg';
import commerceheroIcon from './commercehero.svg';
import githubIcon from './github.svg';
import stackoverflowIcon from './stack-overflow.svg';

const HeaderNav = styled.nav`
    display: inline-block;
    max-height: 36px;
`;
const NavLink = styled.a`
    width: 36px;
    max-width: 36px;
    height: 36px;

    display: inline-block;
    background-color: ${styleScheme.primaryColor};
    mask-size: 26px;
    mask-repeat: no-repeat;
    mask-position: center;
    &:last-child {
        margin-right: 0;
    }

    text-indent: 100%;
    white-space: nowrap;
    overflow: hidden;

    &:hover {
        color: #1443b8;
    }


    margin-right: 24px;

    &.sl-twitter {
        mask-image: url(${twitterIcon});
    }
    &.sl-commercehero {
        mask-image: url(${commerceheroIcon});
    }
    &.sl-github {
        mask-image: url(${githubIcon});
    }
    &.sl-stackoverflow {
        mask-image: url(${stackoverflowIcon});
        mask-size: 22px 96%;
    }

`;

const WebsiteTitle = styled.h4`
    display: inline-block;
    vertical-align: top;
    font-size: 20px;
    line-height: 36px;
    font-weight: 600;
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
                    <NavLink className="sl-twitter" href={'https://twitter.com/ashsmithco'} alt="Twitter">Twitter</NavLink>
                    <NavLink className="sl-github" href={'https://github.com/ashsmith'} alt="Github">GitHub</NavLink>
                    <NavLink className="sl-commercehero" href={'https://commercehero.io/ashsmith'} alt="CommerceHero">CommerceHero</NavLink>
                    <NavLink className="sl-stackoverflow" href={'https://stackoverflow.com/users/614535/ash-smith'} alt="StackOverflow">StackOverflow</NavLink>
                </HeaderNav>
            </HeaderWrapper>
        )
    }
}

export default Header;