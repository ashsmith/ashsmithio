import { createClient } from 'contentful';

export interface BlogPostFields {
  title: string;
  date: string;
  content: string;
  category?: string;
  permalink: string;
}

export interface BlogPostItem {
  fields: BlogPostFields;
}

export interface EntriesResponse {
  items: BlogPostItem[];
}

const client = createClient({
  space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID,
  accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN,
});

const previewClient = createClient({
  space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID,
  accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_PREVIEW_ACCESS_TOKEN,
  host: 'preview.contentful.com',
});

const getClient = (preview) => (preview ? previewClient : client);

export const fetchBlogPost = async (permalink, preview): Promise<BlogPostItem> => {
  const entries: EntriesResponse = await getClient(preview).getEntries({
    content_type: 'blogPost',
    'fields.permalink[in]': permalink,
  });
  if (!entries.items) {
    throw new Error('Error getting blog post');
  }

  return entries.items.pop();
};

export async function fetchBlogPosts(preview, limit = 1000): Promise<BlogPostItem[]> {
  const entries: EntriesResponse = await getClient(preview).getEntries({
    content_type: 'blogPost',
    order: '-fields.date',
    limit,
  });

  if (!entries.items) {
    throw new Error('Error getting blog posts');
  }

  return entries.items;
}

export async function fetchBlogPostsByCategory(preview, category): Promise<BlogPostItem[]> {
  const entries: EntriesResponse = await getClient(preview).getEntries({
    content_type: 'blogPost',
    order: '-fields.date',
    'fields.category[in]': category,
  });

  if (!entries.items) {
    throw new Error('Error getting blog posts');
  }

  return entries.items;
}

export const getAllPostsWithPermalink = async (preview): Promise<BlogPostItem[]> => {
  const entries: EntriesResponse = await getClient(preview).getEntries({
    content_type: 'blogPost',
    order: '-fields.date',
  });

  if (!entries.items) {
    throw new Error('Error getting blog posts');
  }

  return entries.items;
};
