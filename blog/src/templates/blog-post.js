import React from 'react'
import Helmet from 'react-helmet'
import Link from 'gatsby-link'
import get from 'lodash/get'

import Bio from '../components/Bio'
import Comments from '../components/Comments'
// import DisqusThread from 'react-disqus-thread'
var ReactDisqusThread = require('react-disqus-thread');

class BlogPostTemplate extends React.Component {
  render() {
    const post = this.props.data.markdownRemark;
    const siteTitle = get(this.props, 'data.site.siteMetadata.title');
    const siteDescription = get(this.props, 'data.site.siteMetadata.description');

    return (
      <div>
        <Helmet title={`${post.frontmatter.title} | ${siteTitle}`}>
          <meta name="description" content={post.frontmatter.description || siteDescription} />
        </Helmet>
        <h1>{post.frontmatter.title}</h1>
        <p>{post.frontmatter.date}</p>
        <div dangerouslySetInnerHTML={{ __html: post.html }} />
        <hr />
        <Bio />
        {post.frontmatter.comments ? (
        <ReactDisqusThread 
          shortname="meteorify" 
          identifier={this.props.pathContext.slug} 
          title={post.frontmatter.title}
				  url={window.location.href}
          />
          ) : ''}
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
        date(formatString: "MMMM DD, YYYY")
        description
      }
    }
  }
`
