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

const BlogTitle = styled.h1`font-size: 4rem; line-height: 1.25em`;

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


class PageTemplate extends React.Component {
  render() {
    const page = this.props.data.contentfulPage;
    const siteTitle = get(this.props, 'data.site.siteMetadata.title');
    const siteDescription = get(this.props, 'data.site.siteMetadata.description');

    return (
      <Layout>
        <Helmet title={`${page.title} | ${siteTitle}`}>
          <meta name="description" content={siteDescription} />
        </Helmet>

        <PostContainer>
          <BlogTitle>{page.title}</BlogTitle>
          <PageContent>
            {documentToReactComponents(page.content.json)}
          </PageContent>
        </PostContainer>

        <Bio />
      </Layout>
    )
  }
}

export default PageTemplate

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
  }
`
