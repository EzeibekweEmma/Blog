import express, { Request, Response } from 'express';
import { MongoServerError } from 'mongodb';
import { PostValidation, EditPostValidation } from '../utils/generalValidation';
import { capitalize, generateUniqueSlug } from '../utils/helper';
import { ZodError } from 'zod';
import Authentication from '../middleware';
import BlogPost from '../models/blog-post.model';

const router = express.Router();

/**
 * @route POST /post
 * @desc Create a new blog post
 * @access Private (Authenticated)
 */
router.post('/post', Authentication, async (req: Request, res: Response): Promise<any> => {
  try {
    const field = PostValidation.parse(req.body);
    const newPost = await BlogPost.create({
      ...field,
      title: capitalize(field.title),
      slug: generateUniqueSlug(field.title),
      user: req.userId,
    });

    if (!newPost) {
      return res.status(400).json({ error: 'Failed to create blog' });
    }
    return res.status(201).json({ message: 'Blog created successfully', slug: newPost.slug });
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({ error: err.errors[0].message });
    }
    if ((err as MongoServerError).code === 11000) {
      return res.status(409).json({ error: `Blog with title: '${req.body.title}' already exists` });
    }
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * @route PUT /edit/:slug
 * @desc Edit a blog
 * @access Private (Authenticated)
 */
router.put('/edit/:slug', Authentication, async (req: Request, res: Response): Promise<any> => {
  try {
    const field = EditPostValidation.parse(req.body);
    if (field.title && field.title.length > 0)
      field.title = capitalize(field.title || '');

    const existingPost = await BlogPost.findOne({ slug: req.params.slug });
    if (!existingPost) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    if (field.isFeatured) {
      if (existingPost.isDeleted) {
        return res.status(400).json({ error: "Can't feature a deleted blog" });
      }

      const checkFeatured = await BlogPost.countDocuments({ isFeatured: true });

      if (checkFeatured + 1 >= 3) {
        return res.status(400).json({ error: 'Only 3 blogs can be featured.' });
      }
    }

    const updatedPost = await BlogPost.findOneAndUpdate({ slug: req.params.slug }, { ...field, updatedAt: new Date() }, { new: true });
    if (!updatedPost) {
      return res.status(400).json({ error: 'Failed to update blog, Please try again' });
    }
    return res.status(200).json({ message: 'Blog updated successfully', slug: updatedPost.slug });
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({ error: err.errors[0].message });
    }
    if ((err as MongoServerError).code === 11000) {
      return res.status(409).json({ error: `Blog with title: '${req.body.title}' already exists` });
    }
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * @route DELETE /delete/:slug
 * @desc Soft delete a blog
 * @access Private (Authenticated)
 */
router.delete('/delete/:slug', Authentication, async (req: Request, res: Response): Promise<any> => {
  try {
    const existingPost = await BlogPost.findOne({ slug: req.params.slug, isDeleted: false });
    if (!existingPost) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    const deletedPost = await BlogPost.findOneAndUpdate(
      { slug: req.params.slug, isDeleted: false },
      { isDeleted: true, deletedAt: new Date(), isFeatured: false },
      { new: true }
    );

    if (!deletedPost) {
      return res.status(404).json({ error: 'Failed to delete blog, Please try again' });
    }

    return res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (err) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * @route PATCH /restore/:slug
 * @desc Restore a soft-deleted blog
 * @access Private (Authenticated)
 */
router.patch('/restore/:slug', Authentication, async (req: Request, res: Response): Promise<any> => {
  try {
    const existingPost = await BlogPost.findOne({ slug: req.params.slug, isDeleted: true });
    if (!existingPost) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    const restoredBlog = await BlogPost.findOneAndUpdate(
      { slug: req.params.slug, isDeleted: true },
      { isDeleted: false, deletedAt: null },
      { new: true }
    );

    if (!restoredBlog) {
      return res.status(404).json({ error: 'Failed to restore blog, Please try again' });
    }

    return res.status(200).json({ message: 'Blog restored successfully' });
  } catch (err) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});


/**
 * @route GET /all
 * @desc Get all blog posts
 * @access protected
 */
router.get('/all', Authentication, async (req: Request, res: Response): Promise<any> => {
  try {
    const limit = Number(req.query.limit) > 0 ? Number(req.query.limit) : 18;
    const page = Number(req.query.page) > 0 ? Number(req.query.page) : 1;
    const skip = (page - 1) * limit;
    const sort = req.query.sort?.toString().toLowerCase() === "newest" ? -1 : 1;
    const categories = req.query.categories?.toString().trim().toLowerCase() || undefined;
    const filterByDeleted = req.query.filterByDeleted || 'all';
    const filterByPublished = req.query.filterByPublished || 'all';
    const searchQuery = req.query.searchQuery?.toString().trim().toLowerCase() || undefined;

    const option: Record<string, any> = {};
    if (categories && categories.toLowerCase() !== 'general') option.categories = { $in: [categories] };
    if (filterByDeleted === 'true' || filterByDeleted === 'false') option.isDeleted = filterByDeleted === 'true';
    if (filterByPublished === 'true' || filterByPublished === 'false') option.isPublished = filterByPublished === 'true';
    if (searchQuery) option.title = { $regex: searchQuery, $options: 'i' };

    const posts = await BlogPost.find(option)
      .sort({ createdAt: sort })
      .limit(limit)
      .skip(skip)
      .populate('user', 'name')
      .select('_id title description image slug createdAt isFeatured isDeleted')

    const totalPosts = await BlogPost.countDocuments(option);
    const hasMore = Math.ceil(totalPosts / limit) > page;

    return res.status(200).json({ posts, limit: limit, page: page, hasMore });
  } catch (err) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});


/**
 * @route GET /all/:slug
 * @desc Get a single blog
 * @access protected
 */
router.get('/all/:slug', Authentication, async (req: Request, res: Response): Promise<any> => {
  try {
    const blog = await BlogPost.findOne({ slug: req.params.slug }).populate('user', 'name');
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    return res.status(200).json({ blog });
  } catch (err) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
})

/**
 * @route GET /
 * @desc Get all blog posts (excluding deleted)
 * @access Public
 */
router.get('/', async (req: Request, res: Response): Promise<any> => {
  try {
    const limit = Number(req.query.limit) > 0 ? Number(req.query.limit) : 18;
    const page = Number(req.query.page) > 0 ? Number(req.query.page) : 1;
    const skip = (page - 1) * limit;
    const categories = req.query.categories?.toString().trim().toLowerCase() || undefined;
    const searchQuery = req.query.searchQuery?.toString().trim().toLowerCase() || undefined;

    const option: Record<string, any> = { isDeleted: false, isPublished: true, };
    if (categories && categories.toLowerCase() !== 'general') option.categories = { $in: [categories] };
    if (searchQuery) option.title = { $regex: searchQuery, $options: 'i' };

    const posts = await BlogPost.find(option)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .populate('user', 'name')
      .select('_id title description image slug createdAt isFeatured isDeleted')

    if (!posts) {
      return res.status(400).json({ error: 'Error fetching blog posts' });
    }

    const totalPosts = await BlogPost.countDocuments(option);
    const hasMore = Math.ceil(totalPosts / limit) > page;

    return res.status(200).json({ posts, limit: limit, page: page, hasMore });
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * @route GET /:slug
 * @desc Get a single blog
 * @access Public
 */
router.get('/:slug', async (req: Request, res: Response): Promise<any> => {
  try {
    const blog = await BlogPost.findOne({ slug: req.params.slug, isDeleted: false, isPublished: true }).populate('user', 'name');

    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    blog.visit += 1;
    await blog.save();

    return res.status(200).json({ blog });
  } catch (err) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
