import express from 'express';
import ServiceController from '../controllers/serviceController.js';
import { validateService, validatePagination } from '../middleware/validation.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Service:
 *       type: object
 *       required:
 *         - slug
 *         - title
 *         - description
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
 *           description: Service title
 *         description:
 *           type: string
 *           description: Service description
 *         icon:
 *           type: string
 *           maxLength: 100
 *           description: Lucide icon name
 *         image_url:
 *           type: string
 *           description: Service image URL
 *         image_hint:
 *           type: string
 *           description: Image alt text or hint
 *         details:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of service details
 *         benefits:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               icon:
 *                 type: string
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *           description: Array of benefit objects
 *         process:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *           description: Array of process steps
 *         pricing:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               item:
 *                 type: string
 *               price:
 *                 type: string
 *           description: Array of pricing options
 *         is_active:
 *           type: boolean
 *           description: Service active status
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *       example:
 *         slug: "thiet-ke-san-vuon"
 *         title: "Thiết kế sân vườn"
 *         description: "Dịch vụ thiết kế sân vườn chuyên nghiệp"
 *         icon: "Leaf"
 *         image_url: "https://example.com/service.jpg"
 *         details: ["Tư vấn miễn phí", "Thiết kế 3D", "Thi công trọn gói"]
 *         benefits: [{"icon": "CheckCircle", "title": "Chất lượng cao", "description": "Đảm bảo chất lượng tốt nhất"}]
 *         process: [{"title": "Khảo sát", "description": "Khảo sát thực địa"}]
 *         pricing: [{"item": "Thiết kế cơ bản", "price": "5 triệu"}]
 *         is_active: true
 */

/**
 * @swagger
 * /api/services:
 *   get:
 *     summary: Get all services
 *     tags: [Services]
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
 *         description: Filter active services only
 *     responses:
 *       200:
 *         description: Services retrieved successfully
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
 *                     $ref: '#/components/schemas/Service'
 *                 pagination:
 *                   type: object
 */
router.get('/', validatePagination, ServiceController.getAllServices);

/**
 * @swagger
 * /api/services/{id}:
 *   get:
 *     summary: Get service by ID
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Service ID
 *     responses:
 *       200:
 *         description: Service retrieved successfully
 *       404:
 *         description: Service not found
 */
router.get('/:id', ServiceController.getServiceById);

/**
 * @swagger
 * /api/services/slug/{slug}:
 *   get:
 *     summary: Get service by slug
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Service slug
 *     responses:
 *       200:
 *         description: Service retrieved successfully
 *       404:
 *         description: Service not found
 */
router.get('/slug/:slug', ServiceController.getServiceBySlug);

/**
 * @swagger
 * /api/services:
 *   post:
 *     summary: Create new service
 *     tags: [Services]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Service'
 *     responses:
 *       201:
 *         description: Service created successfully
 *       400:
 *         description: Validation failed
 */
router.post('/', validateService, ServiceController.createService);

/**
 * @swagger
 * /api/services/{id}:
 *   put:
 *     summary: Update service
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Service ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Service'
 *     responses:
 *       200:
 *         description: Service updated successfully
 *       404:
 *         description: Service not found
 */
router.put('/:id', validateService, ServiceController.updateService);

/**
 * @swagger
 * /api/services/{id}/toggle-active:
 *   patch:
 *     summary: Toggle service active status
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Service ID
 *     responses:
 *       200:
 *         description: Service status updated successfully
 *       404:
 *         description: Service not found
 */
router.patch('/:id/toggle-active', ServiceController.toggleServiceActive);

/**
 * @swagger
 * /api/services/{id}:
 *   delete:
 *     summary: Delete service
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Service ID
 *     responses:
 *       200:
 *         description: Service deleted successfully
 *       404:
 *         description: Service not found
 */
router.delete('/:id', ServiceController.deleteService);

export default router;