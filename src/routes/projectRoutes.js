import express from 'express';
import ProjectController from '../controllers/projectController.js';
import { validateProject, validatePagination } from '../middleware/validation.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Project:
 *       type: object
 *       required:
 *         - title
 *         - category
 *         - location
 *         - image_url
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Auto-generated UUID
 *         title:
 *           type: string
 *           maxLength: 255
 *           description: Project title
 *         category:
 *           type: string
 *           maxLength: 50
 *           enum: ["Sân Vườn", "Hồ Koi", "Tiểu Cảnh"]
 *           description: Project category
 *         style:
 *           type: string
 *           maxLength: 100
 *           description: Project style (e.g., "Hiện đại", "Nhiệt đới", "Zen Nhật Bản")
 *         location:
 *           type: string
 *           maxLength: 255
 *           description: Project location
 *         cost:
 *           type: string
 *           maxLength: 100
 *           description: Project cost estimate
 *         date:
 *           type: string
 *           maxLength: 20
 *           description: Project completion date
 *         image_url:
 *           type: string
 *           description: Project image URL
 *         image_hint:
 *           type: string
 *           description: Image alt text or hint
 *         is_active:
 *           type: boolean
 *           description: Project active status
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *       example:
 *         title: "Sân vườn biệt thự Thảo Điền"
 *         category: "Sân Vườn"
 *         style: "Hiện đại"
 *         location: "Quận 2, TP.HCM"
 *         cost: "~ 150 triệu"
 *         date: "2024"
 *         image_url: "https://example.com/project.jpg"
 *         is_active: true
 */

/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: Get all projects
 *     tags: [Projects]
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
 *           enum: ["Sân Vườn", "Hồ Koi", "Tiểu Cảnh"]
 *         description: Filter by category
 *       - in: query
 *         name: active_only
 *         schema:
 *           type: string
 *           enum: [true, false]
 *         description: Filter active projects only
 *     responses:
 *       200:
 *         description: Projects retrieved successfully
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
 *                     $ref: '#/components/schemas/Project'
 *                 pagination:
 *                   type: object
 */
router.get('/', validatePagination, ProjectController.getAllProjects);

/**
 * @swagger
 * /api/projects/categories:
 *   get:
 *     summary: Get project categories with counts
 *     tags: [Projects]
 *     responses:
 *       200:
 *         description: Categories retrieved successfully
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
 *                       category:
 *                         type: string
 *                       count:
 *                         type: integer
 */
router.get('/categories', ProjectController.getProjectCategories);

/**
 * @swagger
 * /api/projects/styles:
 *   get:
 *     summary: Get project styles with counts
 *     tags: [Projects]
 *     responses:
 *       200:
 *         description: Styles retrieved successfully
 */
router.get('/styles', ProjectController.getProjectStyles);

/**
 * @swagger
 * /api/projects/{id}:
 *   get:
 *     summary: Get project by ID
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *     responses:
 *       200:
 *         description: Project retrieved successfully
 *       404:
 *         description: Project not found
 */
router.get('/:id', ProjectController.getProjectById);

/**
 * @swagger
 * /api/projects:
 *   post:
 *     summary: Create new project
 *     tags: [Projects]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Project'
 *     responses:
 *       201:
 *         description: Project created successfully
 *       400:
 *         description: Validation failed
 */
router.post('/', validateProject, ProjectController.createProject);

/**
 * @swagger
 * /api/projects/{id}:
 *   put:
 *     summary: Update project
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Project'
 *     responses:
 *       200:
 *         description: Project updated successfully
 *       404:
 *         description: Project not found
 */
router.put('/:id', validateProject, ProjectController.updateProject);

/**
 * @swagger
 * /api/projects/{id}/toggle-active:
 *   patch:
 *     summary: Toggle project active status
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *     responses:
 *       200:
 *         description: Project status updated successfully
 *       404:
 *         description: Project not found
 */
router.patch('/:id/toggle-active', ProjectController.toggleProjectActive);

/**
 * @swagger
 * /api/projects/{id}:
 *   delete:
 *     summary: Delete project
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *     responses:
 *       200:
 *         description: Project deleted successfully
 *       404:
 *         description: Project not found
 */
router.delete('/:id', ProjectController.deleteProject);

export default router;