import { Dispatch, SetStateAction } from "react";

export interface IPost {
  image?: string;
  title: string;
  slug: string;
  description: string;
  categories: string[];
  content: string;
  isFeatured?: boolean;
  isPublished?: boolean;
  visit?: number;
  isDeleted?: boolean;
  deletedAt?: Date;
  createdAt: Date;
  user: {
    name: string;
  }
}

export interface IOptionProps {
  setOptions: Dispatch<
    SetStateAction<{
      categories: string;
      filterByDeleted: boolean | string;
      filterByPublished: boolean | string;
      searchQuery: string;
      sort: string;
    }>
  >;
  options: {
    categories: string;
    filterByDeleted: boolean | string;
    filterByPublished: boolean | string;
    searchQuery: string;
    sort: string;
  };
}

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'blog' | 'product';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  categories?: string[];
  tags?: string[];
  locale?: string;
  siteName?: string;
  twitterHandle?: string;
}
