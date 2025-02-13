import express, { Request, Response } from 'express';
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
router.post('/post', Authentication, async (req: Request, res: Response): Promise<any> => {
  try {
    const field = BlogPostValidation.parse(req.body);
    const newPost = await BlogPost.create({
      ...field,
      title: capitalize(field.title),
      slug: generateUniqueSlug(field.title, true),
      user: req.userId,
    });

    res.status(201).json({ message: 'Blog post created successfully', slug: newPost.slug });
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({ error: err.errors[0].message });
    }
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * @route PUT /edit/:slug
 * @desc Edit a blog post
 * @access Private (Authenticated)
 */
router.put('/edit/:slug', Authentication, async (req: Request, res: Response): Promise<any> => {
  try {
    const field = BlogPostValidation.parse(req.body);
    field.title = capitalize(field.title);
    const updatedPost = await BlogPost.findOneAndUpdate({ slug: req.params.slug }, { ...field, updatedAt: new Date() }, { new: true });

    if (!updatedPost) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    res.status(200).json({ message: 'Blog post updated successfully', slug: updatedPost.slug });
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({ error: err.errors[0].message });
    }
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * @route DELETE /delete/:slug
 * @desc Soft delete a blog post
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
      return res.status(404).json({ error: 'Blog post not found' });
    }

    res.status(200).json({ message: 'Blog post deleted successfully', post: deletedPost });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * @route PATCH /restore/:slug
 * @desc Restore a soft-deleted blog post
 * @access Private (Authenticated)
 */
router.patch('/restore/:slug', Authentication, async (req: Request, res: Response): Promise<any> => {
  try {
    const restoredPost = await BlogPost.findOneAndUpdate(
      { slug: req.params.slug, isDeleted: true },
      { isDeleted: false, deletedAt: null },
      { new: true }
    );

    if (!restoredPost) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    res.status(200).json({ message: 'Blog post restored successfully', post: restoredPost });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * @route GET /all
 * @desc Get all blog posts (excluding deleted)
 * @access Public
 */
router.get('/all', async (req: Request, res: Response): Promise<any> => {
  try {
    const posts = await BlogPost.find({ isDeleted: false, isPublished: true }).sort({ createdAt: -1 });
    res.status(200).json({ posts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * @route GET /:slug
 * @desc Get a single blog post
 * @access Public
 */
router.get('/:slug', async (req: Request, res: Response): Promise<any> => {
  try {
    const post = await BlogPost.findOne({ slug: req.params.slug, isDeleted: false, isPublished: true });
    if (!post || post.isDeleted) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    post.visit += 1;
    await post.save();

    res.status(200).json({ post });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * @route GET /admin
 * @desc Get all blog posts
 * @access protected
 */
router.get('/admin', Authentication, async (req: Request, res: Response): Promise<any> => {
  try {
    const posts = await BlogPost.find().sort({ createdAt: -1 });
    res.status(200).json({ posts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

/**
 * @route GET /admin/:slug
 * @desc Get a single blog post
 * @access protected
 */
router.get('/admin/:slug', Authentication, async (req: Request, res: Response): Promise<any> => {
  try {
    const post = await BlogPost.findOne({ slug: req.params.slug });
    if (!post) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    res.status(200).json({ post });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

export default router;
