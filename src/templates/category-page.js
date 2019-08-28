import React from "react";
import GatsbyLink from "gatsby-link";
import Layout from '../components/layout';
import Helmet from 'react-helmet'
import BlogPostItem from '../components/BlogPostItem';
import styled from 'styled-components';
import get from 'lodash/get'
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

export default class CategoryTemplate extends React.Component {

    render() {
        const siteTitle = get(this, 'props.data.site.siteMetadata.title')
        const siteDescription = get(this, 'props.data.site.siteMetadata.description')
        const category = this.props.pageContext.category;
        const postEdges = this.props.data.allContentfulBlogPost.edges;
        return (
          <Layout>
            <Helmet title={`${category} blog posts | ${siteTitle}`}>
              <meta name="description" content={category || siteDescription} />
            </Helmet>
            <CategoryHeading>Posts filed under: {category}</CategoryHeading>

            <PostWrapper>
            {postEdges.map((post) => {

                let node = post.node;
                console.log(post, node);
                return (
                    <BlogPostItem key={post.node.permalink}
                        slug={post.node.permalink}
                        title={get(post.node, 'title') || post.node.permalink}
                        date={post.node.date}
                        category={post.node.category} />
                );
            })}
            </PostWrapper>
        </Layout>);

    }
}

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
