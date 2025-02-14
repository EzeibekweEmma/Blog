import express, { Request, Response } from 'express';
import { MongoServerError } from 'mongodb';
import { BlogPostValidation } from '@/utils/generalValidation';
import { capitalize, generateUniqueSlug } from '@/utils/helper';
import { ZodError } from 'zod';
import Authentication from '@/middleware';
import BlogPost from '@/models/blog-post.model';

const router = express.Router();

/**
 * @route POST /post
 * @desc Create a new blog post
 * @access Private (Authenticated)
 */
router.post('/post', async (req: Request, res: Response): Promise<any> => {
  try {
    const field = BlogPostValidation.parse(req.body);
    const newPost = await BlogPost.create({
      ...field,
      title: capitalize(field.title),
      slug: generateUniqueSlug(field.title),
      // user: req.userId,
      user: "67a7c28f2f1db7141e619834",
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
router.put('/edit/:slug', async (req: Request, res: Response): Promise<any> => {
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
 * @route GET /
 * @desc Get all blog posts (excluding deleted)
 * @access Public
 */
router.get('/', async (req: Request, res: Response): Promise<any> => {
  try {
    let limit = req.query.limit ? parseInt(<string>req.query.limit) : 6
    let page = req.query.page ? parseInt(<string>req.query.page) : 1
    limit = isNaN(limit) ? 6 : limit
    page = isNaN(page) ? 1 : page
    const skip = (page - 1) * limit

    const posts = await BlogPost.find({ isDeleted: false, isPublished: true }).sort({ createdAt: -1 }).limit(limit).skip(skip);
    if (!posts) {
      return res.status(400).json({ error: 'Error fetching blog posts' });
    }
    return res.status(200).json({ posts, limit: limit, page: page });
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

/**
 * @route GET /all
 * @desc Get all blog posts
 * @access protected
 */
router.get('/all', Authentication, async (req: Request, res: Response): Promise<any> => {
  try {
    let limit = req.query.limit ? parseInt(<string>req.query.limit) : 6
    limit = isNaN(limit) ? 6 : limit
    let page = req.query.page ? parseInt(<string>req.query.page) : 1
    page = isNaN(page) ? 1 : page
    const skip = (page - 1) * limit
    const sort = req.query.sort ? String(req.query.sort).toLowerCase() === "newest" ? -1 : 1 : -1

    const posts = await BlogPost.find().sort({ createdAt: sort }).limit(limit).skip(skip);

    if (!posts) {
      return res.status(400).json({ error: 'Error fetching blog posts' });
    }
    return res.status(200).json({ posts });
  } catch (err) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
})

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

export default router;
