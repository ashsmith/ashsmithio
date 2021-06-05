import { createClient } from 'contentful';

export interface BlogPostFields {
  title: string;
  date: string;
  content: string;
  category?: string;
  permalink: string;
}

export interface GuideStepFields {
  title: string;
  content: string;
}

export interface GuideFields {
  title: string;
  slug: string;
  date: string;
  introduction?: string;
  steps: {
    sys: {
      id: string;
    }
    fields: GuideStepFields
  }[]
}
export interface GuideItem {
  fields: GuideFields;
}

export interface BlogPostItem {
  fields: BlogPostFields;
}

export interface EntriesResponse<T> {
  items: T[];
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
  const entries: EntriesResponse<BlogPostItem> = await getClient(preview).getEntries({
    content_type: 'blogPost',
    'fields.permalink[in]': permalink,
  });
  if (!entries.items) {
    throw new Error('Error getting blog post');
  }

  return entries.items.pop();
};

export async function fetchBlogPosts(preview, limit = 1000): Promise<BlogPostItem[]> {
  const entries: EntriesResponse<BlogPostItem> = await getClient(preview).getEntries({
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
  const entries: EntriesResponse<BlogPostItem> = await getClient(preview).getEntries({
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
  const entries: EntriesResponse<BlogPostItem> = await getClient(preview).getEntries({
    content_type: 'blogPost',
    order: '-fields.date',
  });

  if (!entries.items) {
    throw new Error('Error getting blog posts');
  }

  return entries.items;
};

export const fetchGuide = async (slug, preview): Promise<GuideItem> => {
  const entries: EntriesResponse<GuideItem> = await getClient(preview).getEntries({
    content_type: 'guides',
    'fields.slug[in]': slug,
  });
  if (!entries.items) {
    throw new Error('Error getting blog post');
  }

  return entries.items.pop();
};

export async function fetchGuides(preview, limit = 1000): Promise<GuideItem[]> {
  const entries: EntriesResponse<GuideItem> = await getClient(preview).getEntries({
    content_type: 'guides',
    order: '-fields.date',
    limit,
  });

  if (!entries.items) {
    throw new Error('Error getting blog posts');
  }

  return entries.items;
}