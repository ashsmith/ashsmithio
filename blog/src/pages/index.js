import React from 'react'
import Link from 'gatsby-link'
import get from 'lodash/get'
import Helmet from 'react-helmet'
import Bio from '../components/Bio'
import BlogPostItem from '../components/BlogPostItem'
import styled from 'styled-components';
import ProfilePic from '../components/ProfilePic'
import {styleScheme, calcSize} from '../config';

const HeaderTitle = styled.h1`
font-size: ${calcSize(40)};
font-weight: 600;
letter-spacing: -0.5;
line-height: 1.25;
margin: 0;
`

const HomepageHeaderWrapper = styled.div`
display: grid;
grid-template-columns: ${calcSize(120)} 1fr;
grid-column-gap: ${calcSize(32)};
padding: 0 ${calcSize(64)} ${calcSize(96)};
border-bottom: 1px solid ${styleScheme.borderColor};
margin-bottom: ${calcSize(40)};
`


const PostWrapper = styled.div`
display: grid;
grid-auto-rows: 1fr;
`

class BlogIndex extends React.Component {
  render() {
    const siteTitle = get(this, 'props.data.site.siteMetadata.title')
    const siteDescription = get(this, 'props.data.site.siteMetadata.description')
    const posts = get(this, 'props.data.allMarkdownRemark.edges')

    return (
      <div>
        <Helmet title={siteTitle}>
        <meta name="description" content={siteDescription} />
        </Helmet>

        <HomepageHeaderWrapper>
          <ProfilePic />
          <HeaderTitle>Hey, I’m Ash Smith. A Magento Developer, keen cyclist and aspiring triathlete.</HeaderTitle>
        </HomepageHeaderWrapper>


        <PostWrapper>
          {posts.map(({ node }) => {
            return (<BlogPostItem key={node.fields.slug} 
              slug={node.fields.slug} 
              title={get(node, 'frontmatter.title') || node.fields.slug} 
              date={node.frontmatter.date} 
              excerpt={node.excerpt} category={node.frontmatter.category} />)
          })}
        </PostWrapper>
      </div>
    )
  }
}

export default BlogIndex

export const pageQuery = graphql`
  query IndexQuery {
    site {
      siteMetadata {
        title
        description
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "Do, MMMM YYYY")
            title
            permalink
            category
          }
        }
      }
    }
  }
`
