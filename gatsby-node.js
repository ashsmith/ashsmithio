const _ = require('lodash')
const Promise = require('bluebird')
const path = require('path')

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions

  return new Promise((resolve, reject) => {
    const page = path.resolve('./src/templates/page.js');
    const blogPost = path.resolve('./src/templates/blog-post.js');
    const categoryPage = path.resolve('./src/templates/category-page.js');
    resolve(
      graphql(
        `
          {
            allContentfulBlogPost(sort: {fields: date, order: DESC}) {
              edges {
                node {
                  category
                  permalink
                  title
                }
              }
            }
          }
        `
      ).then(result => {
        if (result.errors) {
          console.log(result.errors)
          reject(result.errors)
        }

        const posts = result.data.allContentfulBlogPost.edges;
        const categorySet = new Set();

        _.each(posts, (post, index) => {
          const previous = index === posts.length - 1 ? false : posts[index + 1].node;
          const next = index === 0 ? false : posts[index - 1].node;

          if (post.node.category) {
            categorySet.add(post.node.category);
          }

          createPage({
            path: post.node.permalink,
            component: blogPost,
            context: {
              slug: post.node.permalink,
              previous,
              next,
            },
          })
        })

        const categoryList = Array.from(categorySet);
        categoryList.forEach(category => {
          return createPage({
            path: `/${_.toLower(category.replace(/\s/g, ''))}/`,
            component: categoryPage,
            context: {
              category
            }
          });
        });

      })
    );

    resolve(
      graphql(
        `{
          allContentfulPage {
            nodes {
              slug
            }
          }
        }
        `
      ).then(result => {
        if (result.errors) {
          console.log(result.errors)
          reject(result.errors)
        }

        const pages = result.data.allContentfulPage.nodes;
        _.each(pages, (pageContent, index) => {
          createPage({
            path: pageContent.slug,
            component: page,
            context: {
              slug: pageContent.slug,
            },
          })
        })

      })
    )
  })
}
