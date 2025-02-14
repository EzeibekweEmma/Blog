export interface IBlogPost {
  image?: string;
  title: string;
  slug: string;
  description: string;
  category: string[];
  content: string;
  isFeatured?: boolean;
  isPublished?: boolean;
  visit?: number;
  isDeleted?: boolean;
  deletedAt?: Date;
  createdAt: Date;
}