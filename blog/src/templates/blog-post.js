import React from 'react'
import Helmet from 'react-helmet'
import Link from 'gatsby-link'
import get from 'lodash/get'
import Bio from '../components/Bio'
import styled from 'styled-components';

const BlogPostContent = styled.div`

& p code {
  background-color: #EEE;
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

const PostDate = styled.p`color: #9F9F9F; font-size: ${14/16}rem;margin:0;`

const BlogTitle = styled.h1`font-size: 2.5rem;`;

const PostContainer = styled.div`
  padding: 0 4rem 4rem;
  margin-bottom: 4rem;
  border-bottom: 1px solid #F1F1F1;

  & p:last-child {
    margin: 0;
  }
`;
const PostNav = styled.div`
  margin-bottom: 4rem;
  padding: 0 4rem;
  `;

const PostNavItem = styled.div`

& span {
  color: #5C5C5C;
  font-size: ${18/16}rem;
  display: block;
}

& a {
  font-size: ${27/16}rem;
  font-weight: 700;

}
`;


class BlogPostTemplate extends React.Component {
  render() {
    const post = this.props.data.markdownRemark;
    const siteTitle = get(this.props, 'data.site.siteMetadata.title');
    const siteDescription = get(this.props, 'data.site.siteMetadata.description');
    const { previous, next } = this.props.pathContext

    return (
      <div>
        <Helmet title={`${post.frontmatter.title} | ${siteTitle}`}>
          <meta name="description" content={post.frontmatter.description || siteDescription} />
        </Helmet>

        <PostContainer>
          <PostDate>Posted on {post.frontmatter.date}</PostDate>
          <BlogTitle>{post.frontmatter.title}</BlogTitle>
          <BlogPostContent dangerouslySetInnerHTML={{ __html: post.html }} />
        </PostContainer>

        
        <PostNav>
          {previous && (
            <PostNavItem>
              <span>Previous Post</span>
              <Link to={previous.fields.slug} rel="prev">
                {previous.frontmatter.title}
              </Link>
            </PostNavItem>
          )}

          {next && (
            <PostNavItem>
              <span>Next Post</span>
              <Link to={next.fields.slug} rel="next">
                {next.frontmatter.title}
              </Link>
            </PostNavItem>
          )}
        </PostNav>

        <Bio />
      </div>
    )
  }
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        description
        author
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      html
      frontmatter {
        title
        comments
        date(formatString: "Do, MMMM YYYY")
        description
      }
    }
  }
`
