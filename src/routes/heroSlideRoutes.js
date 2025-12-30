import express from 'express';
import HeroSlideController from '../controllers/heroSlideController.js';
import { validateHeroSlide, validatePagination } from '../middleware/validation.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     HeroSlide:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - button_text
 *         - button_link
 *         - image_url
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         title:
 *           type: string
 *           maxLength: 255
 *         description:
 *           type: string
 *         button_text:
 *           type: string
 *           maxLength: 100
 *         button_link:
 *           type: string
 *           maxLength: 255
 *         image_url:
 *           type: string
 *         image_hint:
 *           type: string
 *         order:
 *           type: integer
 *           default: 0
 *         is_active:
 *           type: boolean
 *           default: true
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/hero-slides:
 *   get:
 *     summary: Get all hero slides
 *     tags: [Hero Slides]
 *     parameters:
 *       - in: query
 *         name: active_only
 *         schema:
 *           type: string
 *           enum: [true, false]
 *     responses:
 *       200:
 *         description: Hero slides retrieved successfully
 */
router.get('/', validatePagination, HeroSlideController.getAllHeroSlides);

/**
 * @swagger
 * /api/hero-slides/{id}:
 *   get:
 *     summary: Get hero slide by ID
 *     tags: [Hero Slides]
 */
router.get('/:id', HeroSlideController.getHeroSlideById);

/**
 * @swagger
 * /api/hero-slides:
 *   post:
 *     summary: Create new hero slide
 *     tags: [Hero Slides]
 */
router.post('/', validateHeroSlide, HeroSlideController.createHeroSlide);

/**
 * @swagger
 * /api/hero-slides/{id}:
 *   put:
 *     summary: Update hero slide
 *     tags: [Hero Slides]
 */
router.put('/:id', validateHeroSlide, HeroSlideController.updateHeroSlide);

/**
 * @swagger
 * /api/hero-slides/{id}/order:
 *   patch:
 *     summary: Update hero slide order
 *     tags: [Hero Slides]
 */
router.patch('/:id/order', HeroSlideController.updateHeroSlideOrder);

/**
 * @swagger
 * /api/hero-slides/reorder:
 *   patch:
 *     summary: Reorder multiple hero slides
 *     tags: [Hero Slides]
 */
router.patch('/reorder', HeroSlideController.reorderHeroSlides);

/**
 * @swagger
 * /api/hero-slides/{id}/toggle-active:
 *   patch:
 *     summary: Toggle hero slide active status
 *     tags: [Hero Slides]
 */
router.patch('/:id/toggle-active', HeroSlideController.toggleHeroSlideActive);

/**
 * @swagger
 * /api/hero-slides/{id}:
 *   delete:
 *     summary: Delete hero slide
 *     tags: [Hero Slides]
 */
router.delete('/:id', HeroSlideController.deleteHeroSlide);

export default router;