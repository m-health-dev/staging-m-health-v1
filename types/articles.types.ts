export type ArticleAuthorType = {
  id: string;
  slug: string;
  created_at: Date;
  updated_at: Date;
  name: string;
  jobdesc: string;
  profile_image: string;
};

export type ArticleCategoryType = {
  id: string;
  created_at: Date;
  updated_at: Date;
  id_category: string;
  en_category: string;
  id_description?: string;
  en_description?: string;
};

export type ArticleType = {
  id: string;
  created_at: Date;
  updated_at: Date;
  slug: string;
  en_title: string;
  id_title: string;
  en_content: string;
  id_content: string;
  highlight_image: string;
  author: Array<ArticleAuthorType>;
  category: Array<ArticleCategoryType>;
  status: string;
};
