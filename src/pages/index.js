import React from 'react';
import { graphql } from 'gatsby';
import get from 'lodash/get';
import Helmet from 'react-helmet';
import BlogPostItem from '../components/BlogPostItem';
import styled from 'styled-components';;
import ProfilePic from '../components/ProfilePic';
import Layout from '../components/layout';
import { styleScheme, calcSize } from '../config';

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

export default function BlogIndex ({ data }) {
  const {
    profileImage,
    site: { siteMetadata: { title, description } },
    allContentfulBlogPost: { edges: posts }
  } = data;
  return (
    <Layout>
      <Helmet title={title}>
      <meta name="description" content={description} />
      </Helmet>

      <HomepageHeaderWrapper>
        <ProfilePic image={profileImage} />
        <div>
        <HeaderTitle>I’m Ash! eCommerce Engineer and keen triathlete.</HeaderTitle>
        <JobTitle>eCommerce Engineer @ Play Sports Network</JobTitle>
        </div>
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
};

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
    profileImage: imageSharp(fixed: {originalName: {eq: "profile.jpg"}}) {
      fixed(height: 120, width: 120) {
        ...GatsbyImageSharpFixed_tracedSVG
      }
    }
  }
`
