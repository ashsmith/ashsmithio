import { createClient } from 'contentful';

const client = createClient({
  space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID,
  accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN
});

const previewClient = createClient({
  space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID,
  accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_PREVIEW_ACCESS_TOKEN,
  host: 'preview.contentful.com',
})

const getClient = (preview) => (preview ? previewClient : client)

export const fetchBlogPost = async (permalink, preview) => {
  const entries = await getClient(preview).getEntries({
    content_type: "blogPost",
    'fields.permalink[in]': permalink
  });
  if (entries.items)
    return entries.items.pop();
}

export async function fetchBlogPosts(preview, limit = 1000) {
  const entries = await getClient(preview).getEntries({
    content_type: "blogPost",
    order: '-fields.date',
    limit,
  });
  if (entries.items) return entries.items
  console.log(`Error getting blog posts`)
}


export const getAllPostsWithPermalink = async (preview) => {
  const entries = await getClient(preview).getEntries({
    content_type: "blogPost",
    order: '-fields.date'
  });
  if (entries.items)
    return entries.items
  console.log(`Error getting blog posts`)
}

