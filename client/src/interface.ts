import { Dispatch, SetStateAction } from "react";

export interface IBlogPost {
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
}

export interface IOptionProps {
  setOptions: Dispatch<
    SetStateAction<{
      categories: string;
      filterByDeleted: boolean;
      filterByPublished: boolean;
      searchQuery: string;
    }>
  >;
  options: {
    categories: string;
    filterByDeleted: boolean;
    filterByPublished: boolean;
    searchQuery: string;
  };
}