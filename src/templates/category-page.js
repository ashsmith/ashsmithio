import React from "react";
import GatsbyLink from "gatsby-link";
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
        const category = this.props.pathContext.category;
        const postEdges = this.props.data.allMarkdownRemark.edges;
        console.log(postEdges);
        return (<div>
            <CategoryHeading>{category}</CategoryHeading>

            <PostWrapper>
            {postEdges.map((post) => {

                let node = post.node;
                console.log(post, node);
                return (
                    <BlogPostItem key={post.node.fields.slug}
                        slug={post.node.fields.slug}
                        title={get(post.node, 'frontmatter.title') || post.node.fields.slug}
                        date={post.node.frontmatter.date}
                        excerpt={post.node.excerpt} category={post.node.frontmatter.category} />
                );
            })}
            </PostWrapper>
        </div>);

    }
}

/* eslint no-undef: "off"*/
export const pageQuery = graphql`
  query CategoryPage($category: String) {
    allMarkdownRemark(
      limit: 1000
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { category: { eq: $category } } }
    ) {
      edges {
        node {
          fields {
            slug
          }
          excerpt
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
`;
