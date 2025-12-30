import express from 'express';
import TestimonialController from '../controllers/testimonialController.js';
import { validateTestimonial, validatePagination } from '../middleware/validation.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Testimonial:
 *       type: object
 *       required:
 *         - quote
 *         - author
 *         - location
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Auto-generated UUID
 *         quote:
 *           type: string
 *           description: Testimonial quote/content
 *         author:
 *           type: string
 *           maxLength: 255
 *           description: Author name
 *         location:
 *           type: string
 *           maxLength: 255
 *           description: Author location/title
 *         rating:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *           description: Rating (1-5 stars)
 *         image_url:
 *           type: string
 *           description: Author image URL
 *         image_hint:
 *           type: string
 *           description: Image alt text or hint
 *         is_active:
 *           type: boolean
 *           description: Testimonial active status
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *       example:
 *         quote: "Dịch vụ thiết kế sân vườn rất chuyên nghiệp và tận tâm"
 *         author: "Anh Minh"
 *         location: "Chủ biệt thự, Quận 2"
 *         rating: 5
 *         is_active: true
 */

/**
 * @swagger
 * /api/testimonials:
 *   get:
 *     summary: Get all testimonials
 *     tags: [Testimonials]
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
 *         name: active_only
 *         schema:
 *           type: string
 *           enum: [true, false]
 *         description: Filter active testimonials only
 *     responses:
 *       200:
 *         description: Testimonials retrieved successfully
 */
router.get('/', validatePagination, TestimonialController.getAllTestimonials);

/**
 * @swagger
 * /api/testimonials/random:
 *   get:
 *     summary: Get random testimonials for homepage
 *     tags: [Testimonials]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 20
 *           default: 5
 *         description: Number of random testimonials
 *     responses:
 *       200:
 *         description: Random testimonials retrieved successfully
 */
router.get('/random', TestimonialController.getRandomTestimonials);

/**
 * @swagger
 * /api/testimonials/stats:
 *   get:
 *     summary: Get rating statistics
 *     tags: [Testimonials]
 *     responses:
 *       200:
 *         description: Rating statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       rating:
 *                         type: integer
 *                       count:
 *                         type: integer
 *                       average_rating:
 *                         type: number
 *                       percentage:
 *                         type: number
 */
router.get('/stats', TestimonialController.getRatingStats);

/**
 * @swagger
 * /api/testimonials/{id}:
 *   get:
 *     summary: Get testimonial by ID
 *     tags: [Testimonials]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Testimonial ID
 *     responses:
 *       200:
 *         description: Testimonial retrieved successfully
 *       404:
 *         description: Testimonial not found
 */
router.get('/:id', TestimonialController.getTestimonialById);

/**
 * @swagger
 * /api/testimonials:
 *   post:
 *     summary: Create new testimonial
 *     tags: [Testimonials]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Testimonial'
 *     responses:
 *       201:
 *         description: Testimonial created successfully
 *       400:
 *         description: Validation failed
 */
router.post('/', validateTestimonial, TestimonialController.createTestimonial);

/**
 * @swagger
 * /api/testimonials/{id}:
 *   put:
 *     summary: Update testimonial
 *     tags: [Testimonials]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Testimonial ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Testimonial'
 *     responses:
 *       200:
 *         description: Testimonial updated successfully
 *       404:
 *         description: Testimonial not found
 */
router.put('/:id', validateTestimonial, TestimonialController.updateTestimonial);

/**
 * @swagger
 * /api/testimonials/{id}/toggle-active:
 *   patch:
 *     summary: Toggle testimonial active status
 *     tags: [Testimonials]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Testimonial ID
 *     responses:
 *       200:
 *         description: Testimonial status updated successfully
 *       404:
 *         description: Testimonial not found
 */
router.patch('/:id/toggle-active', TestimonialController.toggleTestimonialActive);

/**
 * @swagger
 * /api/testimonials/{id}:
 *   delete:
 *     summary: Delete testimonial
 *     tags: [Testimonials]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Testimonial ID
 *     responses:
 *       200:
 *         description: Testimonial deleted successfully
 *       404:
 *         description: Testimonial not found
 */
router.delete('/:id', TestimonialController.deleteTestimonial);

export default router;