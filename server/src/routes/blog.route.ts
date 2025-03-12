import express, { Request, Response } from 'express';
import { MongoServerError } from 'mongodb';
import { BlogPostValidation } from '../utils/generalValidation';
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
    const field = BlogPostValidation.parse(req.body);
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
    const field = BlogPostValidation.parse(req.body);
    field.title = capitalize(field.title);
    const updatedPost = await BlogPost.findOneAndUpdate({ slug: req.params.slug }, { ...field, updatedAt: new Date() }, { new: true });

    if (!updatedPost) {
      return res.status(404).json({ error: 'Blog not found' });
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
    const deletedPost = await BlogPost.findOneAndUpdate(
      { slug: req.params.slug, isDeleted: false },
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    );

    if (!deletedPost) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    return res.status(200).json({ message: 'Blog deleted successfully', blog: deletedPost });
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
    const restoredBlog = await BlogPost.findOneAndUpdate(
      { slug: req.params.slug, isDeleted: true },
      { isDeleted: false, deletedAt: null },
      { new: true }
    );

    if (!restoredBlog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    return res.status(200).json({ message: 'Blog restored successfully', blog: restoredBlog });
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
    const limit = Number(req.query.limit) > 0 ? Number(req.query.limit) : 15;
    const page = Number(req.query.page) > 0 ? Number(req.query.page) : 1;
    const skip = (page - 1) * limit;
    const sort = req.query.sort?.toString().toLowerCase() === "newest" ? -1 : 1;
    const category = req.query.category?.toString().trim().toLowerCase() || undefined;
    const filterByDeleted = req.query.filterByDeleted === "true";
    const filterByPublished = req.query.filterByPublished === "true";
    const searchQuery = req.query.searchQuery?.toString().trim().toLowerCase() || undefined;

    const option: Record<string, any> = {};
    if (category) option.category = { $in: [category] };
    if (filterByDeleted) option.isDeleted = true;
    if (filterByPublished) option.isPublished = true;
    if (searchQuery) option.title = { $regex: searchQuery, $options: 'i' };

    const posts = await BlogPost.find(option)
      .sort({ createdAt: sort })
      .limit(limit)
      .skip(skip);

    return res.status(200).json({ posts, hasMore: posts.length === limit });
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
    const blog = await BlogPost.findOne({ slug: req.params.slug });
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
    const limit = Number(req.query.limit) > 0 ? Number(req.query.limit) : 15;
    const page = Number(req.query.page) > 0 ? Number(req.query.page) : 1;
    const skip = (page - 1) * limit;
    const category = req.query.category?.toString().trim().toLowerCase() || undefined;
    const searchQuery = req.query.searchQuery?.toString().trim().toLowerCase() || undefined;

    const option: Record<string, any> = { isDeleted: false, isPublished: true, };
    if (category) option.category = { $in: [category] };
    if (searchQuery) option.title = { $regex: searchQuery, $options: 'i' };

    const posts = await BlogPost.find(option)
      .sort({ createdAt: -1 }).limit(limit).skip(skip).select('_id title description image slug createdAt isFeatured');
    if (!posts) {
      return res.status(400).json({ error: 'Error fetching blog posts' });
    }

    const totalPosts = await BlogPost.countDocuments({ isDeleted: false, isPublished: true });
    const hasMore = totalPosts > skip + posts.length;
    console.log(hasMore)
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
    const blog = await BlogPost.findOne({ slug: req.params.slug, isDeleted: false, isPublished: true });
    if (!blog || blog.isDeleted) {
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
