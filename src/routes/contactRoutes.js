import express from 'express';
import ContactController from '../controllers/contactController.js';
import { validateContact, validateContactStatus, validatePagination } from '../middleware/validation.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Contact:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - message
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Auto-generated UUID
 *         name:
 *           type: string
 *           maxLength: 255
 *           description: Contact name
 *         email:
 *           type: string
 *           format: email
 *           maxLength: 255
 *           description: Contact email
 *         phone:
 *           type: string
 *           maxLength: 20
 *           description: Contact phone number
 *         subject:
 *           type: string
 *           maxLength: 255
 *           description: Contact subject
 *         message:
 *           type: string
 *           description: Contact message
 *         status:
 *           type: string
 *           enum: [new, read, replied]
 *           default: new
 *           description: Contact status
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *       example:
 *         name: "Nguyễn Văn A"
 *         email: "nguyenvana@example.com"
 *         phone: "0901234567"
 *         subject: "Tư vấn thiết kế sân vườn"
 *         message: "Tôi muốn tư vấn thiết kế sân vườn cho biệt thự"
 *         status: "new"
 */

/**
 * @swagger
 * /api/contacts:
 *   get:
 *     summary: Get all contacts
 *     tags: [Contacts]
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
 *         name: status
 *         schema:
 *           type: string
 *           enum: [new, read, replied]
 *         description: Filter by status
 *     responses:
 *       200:
 *         description: Contacts retrieved successfully
 */
router.get('/', validatePagination, ContactController.getAllContacts);

/**
 * @swagger
 * /api/contacts/stats:
 *   get:
 *     summary: Get contact statistics by status
 *     tags: [Contacts]
 *     responses:
 *       200:
 *         description: Contact statistics retrieved successfully
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
 *                   type: object
 *                   properties:
 *                     new:
 *                       type: integer
 *                     read:
 *                       type: integer
 *                     replied:
 *                       type: integer
 */
router.get('/stats', ContactController.getContactStats);

/**
 * @swagger
 * /api/contacts/{id}:
 *   get:
 *     summary: Get contact by ID
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Contact ID
 *     responses:
 *       200:
 *         description: Contact retrieved successfully
 *       404:
 *         description: Contact not found
 */
router.get('/:id', ContactController.getContactById);

/**
 * @swagger
 * /api/contacts:
 *   post:
 *     summary: Create new contact
 *     tags: [Contacts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Contact'
 *     responses:
 *       201:
 *         description: Contact created successfully
 *       400:
 *         description: Validation failed
 */
router.post('/', validateContact, ContactController.createContact);

/**
 * @swagger
 * /api/contacts/{id}:
 *   put:
 *     summary: Update contact
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Contact ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Contact'
 *     responses:
 *       200:
 *         description: Contact updated successfully
 *       404:
 *         description: Contact not found
 */
router.put('/:id', validateContact, ContactController.updateContact);

/**
 * @swagger
 * /api/contacts/{id}/status:
 *   patch:
 *     summary: Update contact status only
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Contact ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [new, read, replied]
 *             example:
 *               status: "read"
 *     responses:
 *       200:
 *         description: Contact status updated successfully
 *       400:
 *         description: Invalid status
 *       404:
 *         description: Contact not found
 */
router.patch('/:id/status', validateContactStatus, ContactController.updateContactStatus);

/**
 * @swagger
 * /api/contacts/{id}:
 *   delete:
 *     summary: Delete contact
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Contact ID
 *     responses:
 *       200:
 *         description: Contact deleted successfully
 *       404:
 *         description: Contact not found
 */
router.delete('/:id', ContactController.deleteContact);

export default router;