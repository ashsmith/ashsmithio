require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})
module.exports = {
  siteMetadata: {
    title: 'Ash Smith',
    author: 'Ash Smith',
    description: 'eCommerce Engineer @ Play Sports Network. Bath, UK',
    siteUrl: 'https://www.ashsmith.io',
  },
  pathPrefix: '/',
  plugins: [
    {
      resolve: `gatsby-source-contentful`,
      options: {
        spaceId: `hoagspxz8z3s`,
        accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
      },
    },
    `gatsby-plugin-twitter`,
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          `gatsby-remark-embedder`,
          {
            resolve: "gatsby-remark-embed-gist",
            options: {
              username: 'ashsmith',
              includeDefaultCss: true
            }
          },
          {
            resolve: `gatsby-remark-prismjs`,
            options: {
              // Class prefix for <pre> tags containing syntax highlighting;
              // defaults to 'language-' (eg <pre class="language-js">).
              // If your site loads Prism into the browser at runtime,
              // (eg for use with libraries like react-live),
              // you may use this to prevent Prism from re-processing syntax.
              // This is an uncommon use-case though;
              // If you're unsure, it's best to use the default value.
              classPrefix: "language-",
            },
          },
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 590,
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          'gatsby-remark-copy-linked-files',
        ],
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: `UA-10830573-3`,
      },
    },
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
          {
            site {
              siteMetadata {
                title
                description
                siteUrl
                site_url: siteUrl
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({ query: { site, allContentfulBlogPost } }) => {
              return allContentfulBlogPost.edges.map(edge => {
                return Object.assign({}, {
                  title: edge.node.title,
                  date: edge.node.date,
                  description: edge.node.content.childMarkdownRemark.excerpt,
                  url: site.siteMetadata.siteUrl + edge.node.permalink,
                  guid: site.siteMetadata.siteUrl + edge.node.permalink,
                  custom_elements: [{ "content:encoded": edge.node.content.childMarkdownRemark.html }],
                });
              });
            },
            query: `
              {
                allContentfulBlogPost(sort: {fields: date, order: DESC}) {
                  edges {
                    node {
                      permalink
                      title
                      date
                      content {
                        childMarkdownRemark {
                          excerpt
                          html
                        }
                      }
                    }
                  }
                }
              }
            `,
            output: "/feed.xml",
            title: "ashsmith.io",
          },
        ],
      },
    },
    {
      resolve: `gatsby-plugin-typography`,
      options: {
        pathToConfigModule: `src/utils/typography`
      }
    },
    {
      resolve: `gatsby-plugin-sitemap`
    },
    `gatsby-plugin-offline`,
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-styled-components`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: "Ash Smith - Magento Developer",
        short_name: "Ash Smith",
        start_url: "/",
        background_color: "#FFFFFF",
        theme_color: "#3567E8",
        display: "minimal-ui",
        // icons: [
        //   {
        //     // Everything in /static will be copied to an equivalent
        //     // directory in /public during development and build, so
        //     // assuming your favicons are in /static/favicons,
        //     // you can reference them here
        //     src: `/favicons/android-chrome-192x192.png`,
        //     sizes: `192x192`,
        //     type: `image/png`,
        //   },
        //   {
        //     src: `/favicons/android-chrome-512x512.png`,
        //     sizes: `512x512`,
        //     type: `image/png`,
        //   },
        // ],
      },
    },
  ],
}
