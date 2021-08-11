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
