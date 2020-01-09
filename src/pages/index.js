import React from 'react'
import { graphql } from 'gatsby';
import Link from 'gatsby-link'
import get from 'lodash/get'
import Helmet from 'react-helmet'
import Bio from '../components/Bio'
import BlogPostItem from '../components/BlogPostItem'
import styled from 'styled-components';
import ProfilePic from '../components/ProfilePic'
import Layout from '../components/layout';
import {styleScheme, calcSize} from '../config';

const HeaderTitleWrapper = styled.div``;

const JobTitle = styled.h2`
font-weight: normal;
color: ${styleScheme.secondaryColor};
`;

const HeaderTitle = styled.h1`

font-size: ${calcSize(32)};

@media (min-width: 700px) {
  font-size: ${calcSize(40)};
}
font-weight: 600;
letter-spacing: -0.5;
line-height: 1.25;
margin: 0 0 0.3em 0;
`

const HomepageHeaderWrapper = styled.div`
text-align: center;
margin-bottom: ${calcSize(40)};
padding-bottom: ${calcSize(96)};
border-bottom: 1px solid ${styleScheme.borderColor};

@media (min-width: 700px) {
  text-align: inherit;
  display: grid;
  grid-template-columns: ${calcSize(120)} 1fr;
  grid-column-gap: ${calcSize(32)};
  padding-top: 0;
  padding-left: ${calcSize(64)};
  padding-right: ${calcSize(64)};
}
`


const PostWrapper = styled.div`
@media (min-width: 700px) {
  display: grid;
  grid-auto-rows: 1fr;
}
`

class BlogIndex extends React.Component {
  render() {
    const siteTitle = get(this, 'props.data.site.siteMetadata.title')
    const siteDescription = get(this, 'props.data.site.siteMetadata.description')
    const posts = get(this, 'props.data.allContentfulBlogPost.edges')

    return (
      <Layout>
        <Helmet title={siteTitle}>
        <meta name="description" content={siteDescription} />
        </Helmet>

        <HomepageHeaderWrapper>
          <ProfilePic />
          <HeaderTitleWrapper>
          <HeaderTitle>I’m Ash! A DevOps Engineer and keen triathlete.</HeaderTitle>
          <JobTitle>DevOps Engineer @ Play Sports Network</JobTitle>
          </HeaderTitleWrapper>
        </HomepageHeaderWrapper>


        <PostWrapper>
          {posts.map(({ node }) => {
            return (<BlogPostItem key={node.permalink}
              slug={node.permalink}
              title={get(node, 'title') || node.permalink}
              date={node.date} category={node.category} />)
          })}
        </PostWrapper>
      </Layout>
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
    allContentfulBlogPost(sort: {fields: date, order: DESC}) {
      edges {
        node {
          date(formatString: "Do, MMMM YYYY")
          title
          permalink
          category
        }
      }
    }
  }
`
