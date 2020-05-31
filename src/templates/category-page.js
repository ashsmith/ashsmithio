import React from "react";
import Layout from '../components/layout';
import Helmet from 'react-helmet';
import BlogPostItem from '../components/BlogPostItem';
import styled from 'styled-components';
import { graphql } from 'gatsby';

const PostWrapper = styled.div`
@media (min-width: 700px) {
    display: grid;
    grid-auto-rows: 1fr;
}
`;

const CategoryHeading = styled.h1`
margin-left: 4rem;
`;

export default function CategoryTemplate({ data, pageContext }) {
  const {
    site: { siteMetadata: { title, description } },
    allContentfulBlogPost: { edges: posts }
  } = data;
  const { category } = pageContext;
  return (
    <Layout>
      <Helmet title={`${category} blog posts | ${title}`}>
        <meta name="description" content={category || description} />
      </Helmet>
      <CategoryHeading>Posts filed under: {category}</CategoryHeading>

      <PostWrapper>
      {posts.map((post) => (
        <BlogPostItem key={post.node.permalink}
            slug={post.node.permalink}
            title={post.node.title || post.node.permalink}
            date={post.node.date}
            category={post.node.category} />
      ))}
      </PostWrapper>
    </Layout>
  );
};

/* eslint no-undef: "off"*/
export const pageQuery = graphql`
  query CategoryPage($category: String) {
    site {
      siteMetadata {
        title
        description
      }
    }
    allContentfulBlogPost(
      limit: 1000
      sort: { fields: date, order: DESC }
      filter: { category: { eq: $category } }
    ) {
      edges {
        node {
          permalink
          date(formatString: "Do, MMMM YYYY")
          title
          category
        }
      }
    }
  }
`;
