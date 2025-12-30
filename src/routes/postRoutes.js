import express from 'express';
import PostController from '../controllers/postController.js';
import { validatePost, validatePagination } from '../middleware/validation.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       required:
 *         - slug
 *         - title
 *         - content
 *         - author
 *         - category
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Auto-generated UUID
 *         slug:
 *           type: string
 *           maxLength: 255
 *           description: Unique slug for URL
 *         title:
 *           type: string
 *           maxLength: 255
 *           description: Post title
 *         excerpt:
 *           type: string
 *           description: Post excerpt/summary
 *         content:
 *           type: string
 *           description: Post content (HTML/Markdown)
 *         author:
 *           type: string
 *           maxLength: 255
 *           description: Post author
 *         image_url:
 *           type: string
 *           description: Featured image URL
 *         image_hint:
 *           type: string
 *           description: Image alt text or hint
 *         category:
 *           type: string
 *           maxLength: 100
 *           description: Post category
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of tags
 *         is_published:
 *           type: boolean
 *           description: Publication status
 *         published_at:
 *           type: string
 *           format: date-time
 *           description: Publication date
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *       example:
 *         slug: "cach-cham-soc-ho-koi"
 *         title: "Cách chăm sóc hồ Koi hiệu quả"
 *         excerpt: "Hướng dẫn chi tiết cách chăm sóc hồ Koi để cá khỏe mạnh"
 *         content: "Nội dung bài viết chi tiết..."
 *         author: "Nguyễn Văn A"
 *         category: "Hướng dẫn"
 *         tags: ["hồ koi", "chăm sóc", "cá cảnh"]
 *         is_published: true
 */

/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Get all posts
 *     tags: [Posts]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Items per page
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: published_only
 *         schema:
 *           type: string
 *           enum: [true, false]
 *         description: Filter published posts only
 *     responses:
 *       200:
 *         description: Posts retrieved successfully
 */
router.get('/', validatePagination, PostController.getAllPosts);

/**
 * @swagger
 * /api/posts/search:
 *   get:
 *     summary: Search posts
 *     tags: [Posts]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Search term
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Items per page
 *     responses:
 *       200:
 *         description: Search completed successfully
 *       400:
 *         description: Search term is required
 */
router.get('/search', validatePagination, PostController.searchPosts);

/**
 * @swagger
 * /api/posts/categories:
 *   get:
 *     summary: Get post categories with counts
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: Categories retrieved successfully
 */
router.get('/categories', PostController.getPostCategories);

/**
 * @swagger
 * /api/posts/tags:
 *   get:
 *     summary: Get post tags with counts
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: Tags retrieved successfully
 */
router.get('/tags', PostController.getPostTags);

/**
 * @swagger
 * /api/posts/{id}:
 *   get:
 *     summary: Get post by ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Post retrieved successfully
 *       404:
 *         description: Post not found
 */
router.get('/:id', PostController.getPostById);

/**
 * @swagger
 * /api/posts/slug/{slug}:
 *   get:
 *     summary: Get post by slug
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Post slug
 *       - in: query
 *         name: published_only
 *         schema:
 *           type: string
 *           enum: [true, false]
 *         description: Filter published posts only
 *     responses:
 *       200:
 *         description: Post retrieved successfully
 *       404:
 *         description: Post not found
 */
router.get('/slug/:slug', PostController.getPostBySlug);

/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: Create new post
 *     tags: [Posts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       201:
 *         description: Post created successfully
 *       400:
 *         description: Validation failed
 */
router.post('/', validatePost, PostController.createPost);

/**
 * @swagger
 * /api/posts/{id}:
 *   put:
 *     summary: Update post
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       200:
 *         description: Post updated successfully
 *       404:
 *         description: Post not found
 */
router.put('/:id', validatePost, PostController.updatePost);

/**
 * @swagger
 * /api/posts/{id}/toggle-published:
 *   patch:
 *     summary: Toggle post publication status
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Post publication status updated successfully
 *       404:
 *         description: Post not found
 */
router.patch('/:id/toggle-published', PostController.togglePostPublished);

/**
 * @swagger
 * /api/posts/{id}:
 *   delete:
 *     summary: Delete post
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *       404:
 *         description: Post not found
 */
router.delete('/:id', PostController.deletePost);

export default router;