import React from 'react'
import Link from 'gatsby-link'
import styled from 'styled-components';


const PageHeading = styled.h3`
    margin: 0;
`;

class Header extends React.Component {
    render() {
        return (
            <header>
                <PageHeading><Link
            style={{
              boxShadow: 'none',
              textDecoration: 'none',
              color: 'inherit',
            }}
            to={'/'}
          >Ash Smith</Link></PageHeading>
                <h5>Freelance Certified Magento Developer</h5>
            </header>
        )
    }
}

export default Header;