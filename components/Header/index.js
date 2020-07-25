import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import {styleScheme} from '../../config';

import twitterIcon from './twitter.svg';
import githubIcon from './github.svg';

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
    &.sl-github {
        mask-image: url(${githubIcon});
    }

`;

const WebsiteTitle = styled.div`
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
    margin-bottom: 4rem;
    @media (min-width: 700px) {
        margin-left: 4rem;
    }
`;

export default function Header() {
    return (
        <HeaderWrapper>
            <WebsiteTitle>
                <Link href="/"><a>Ash Smith</a></Link>
            </WebsiteTitle>
            <HeaderNav>
                <NavLink className="sl-twitter" href={'https://twitter.com/ashsmithco'} alt="Twitter">Twitter</NavLink>
                <NavLink className="sl-github" href={'https://github.com/ashsmith'} alt="Github">GitHub</NavLink>
            </HeaderNav>
        </HeaderWrapper>
    )
};
