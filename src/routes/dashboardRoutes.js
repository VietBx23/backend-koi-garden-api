import express from 'express';
import DashboardController from '../controllers/dashboardController.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     DashboardStats:
 *       type: object
 *       properties:
 *         services:
 *           type: integer
 *         projects:
 *           type: integer
 *         posts:
 *           type: integer
 *         testimonials:
 *           type: integer
 *         contacts:
 *           type: integer
 *         users:
 *           type: integer
 *         heroSlides:
 *           type: integer
 */

/**
 * @swagger
 * /api/dashboard/stats:
 *   get:
 *     summary: Get dashboard statistics
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully
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
 *                   $ref: '#/components/schemas/DashboardStats'
 */
router.get('/stats', DashboardController.getDashboardStats);

/**
 * @swagger
 * /api/dashboard/monthly-stats:
 *   get:
 *     summary: Get monthly statistics
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Monthly statistics retrieved successfully
 */
router.get('/monthly-stats', DashboardController.getMonthlyStats);

/**
 * @swagger
 * /api/dashboard/category-stats:
 *   get:
 *     summary: Get category statistics
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Category statistics retrieved successfully
 */
router.get('/category-stats', DashboardController.getCategoryStats);

/**
 * @swagger
 * /api/dashboard/recent-activities:
 *   get:
 *     summary: Get recent activities
 *     tags: [Dashboard]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Recent activities retrieved successfully
 */
router.get('/recent-activities', DashboardController.getRecentActivities);

/**
 * @swagger
 * /api/dashboard/performance-stats:
 *   get:
 *     summary: Get performance statistics
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Performance statistics retrieved successfully
 */
router.get('/performance-stats', DashboardController.getPerformanceStats);

export default router;