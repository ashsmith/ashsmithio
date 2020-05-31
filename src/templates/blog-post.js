import React from 'react';
import Helmet from 'react-helmet';
import Link from 'gatsby-link';
import Bio from '../components/Bio';
import Layout from '../components/layout';
import styled from 'styled-components';
import { graphql } from 'gatsby';

const BlogPostContent = styled.div`
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

const PostDate = styled.p`
  color: #9F9F9F;
  font-size: ${14/16}rem;
  margin:0;
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

const PostNav = styled.div`
  margin-bottom: 4rem;
  @media (min-width: 700px) {
    padding: 0 4rem;
  }
`;

const PostNavItem = styled.div`
  & span {
    color: #5C5C5C;
    font-size: ${18/16}rem;
    display: block;
  }

  & a {
    font-size: ${27/16}rem;
    font-weight: 600;
  }
`;


export default function BlogPostTemplate ({ data, pageContext }) {
  const {
    profileImage,
    contentfulBlogPost: post,
    site: { siteMetadata: { title, description } },

  } = data;
  const { previous, next } = pageContext

  return (
    <Layout>
      <Helmet title={`${post.title} | ${title}`}>
        <meta name="description" content={post.description || description} />
      </Helmet>

      <PostContainer>
        <BlogTitle>{post.title}</BlogTitle>
        <PostDate>Posted on {post.date}</PostDate>
        <BlogPostContent dangerouslySetInnerHTML={{ __html: post.content.childMarkdownRemark.html }} />
      </PostContainer>


      <PostNav>
        {previous && (
          <PostNavItem>
            <span>Previous Post</span>
            <Link to={previous.permalink} rel="prev">
              {previous.title}
            </Link>
          </PostNavItem>
        )}

        {next && (
          <PostNavItem>
            <span>Next Post</span>
            <Link to={next.permalink} rel="next">
              {next.title}
            </Link>
          </PostNavItem>
        )}
      </PostNav>
      <Bio profileImage={profileImage} />
    </Layout>
  )
};

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        description
        author
      }
    }
    contentfulBlogPost(permalink: {eq: $slug}) {
      id
      content {
        childMarkdownRemark {
          html
        }
      }
      title
      date(formatString: "Do, MMMM YYYY")
    }
    profileImage: imageSharp(fixed: {originalName: {eq: "profile.jpg"}}) {
      fixed(height: 120, width: 120) {
        ...GatsbyImageSharpFixed_tracedSVG
      }
    }
  }
`