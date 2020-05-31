import React from 'react'
import Helmet from 'react-helmet'
import get from 'lodash/get'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import Bio from '../components/Bio'
import Layout from '../components/layout';
import styled from 'styled-components';
import { graphql } from 'gatsby';

const PageContent = styled.div`
  & p code {
    padding: .25rem;
    display: inline-block;
    line-height: 1;
  }

  & .gatsby-highlight pre {
    max-height: 150vh;
  }

  & .gatsby-highlight {
    margin-bottom: 1.75em;
  }
`;

const BlogTitle = styled.h1`
  font-size: 4rem;
  line-height: 1.25em;
`;

const PostContainer = styled.div`
  margin-bottom: 4rem;
  padding-bottom: 4rem;
  border-bottom: 1px solid #F1F1F1;

  & p:last-child {
    margin: 0 0 4rem 0;
  }

  @media (min-width: 700px) {
    padding: 0 4rem;
  }
`;


export default function PageTemplate({ data }) {
  const {
    profileImage,
    contentfulPage: page,
    site: { siteMetadata: { title, description } },
  } = data;

  return (
    <Layout>
      <Helmet title={`${page.title} | ${title}`}>
        <meta name="description" content={description} />
      </Helmet>

      <PostContainer>
        <BlogTitle>{page.title}</BlogTitle>
        <PageContent>
          {documentToReactComponents(page.content.json)}
        </PageContent>
      </PostContainer>

      <Bio profileImage={profileImage} />
    </Layout>
  )
};

export const pageQuery = graphql`
  query PageBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        description
        author
      }
    }
    contentfulPage(slug: {eq: $slug}) {
      id
      content {
        json
      }
      title
    }
    profileImage: imageSharp(fixed: {originalName: {eq: "profile.jpg"}}) {
      fixed(height: 120, width: 120) {
        ...GatsbyImageSharpFixed_tracedSVG
      }
    }
  }
`
