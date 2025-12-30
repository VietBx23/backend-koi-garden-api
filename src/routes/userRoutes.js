import express from 'express';
import UserController from '../controllers/userController.js';
import { validateUser, validatePagination } from '../middleware/validation.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         email:
 *           type: string
 *           format: email
 *           maxLength: 255
 *         name:
 *           type: string
 *           maxLength: 255
 *         role:
 *           type: string
 *           enum: [admin, editor]
 *           default: admin
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
 * /api/users/login:
 *   post:
 *     summary: User login
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', UserController.loginUser);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 */
router.get('/', validatePagination, UserController.getAllUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 */
router.get('/:id', UserController.getUserById);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create new user
 *     tags: [Users]
 */
router.post('/', validateUser, UserController.createUser);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update user
 *     tags: [Users]
 */
router.put('/:id', validateUser, UserController.updateUser);

/**
 * @swagger
 * /api/users/{id}/password:
 *   patch:
 *     summary: Update user password (admin)
 *     tags: [Users]
 */
router.patch('/:id/password', UserController.updateUserPassword);

/**
 * @swagger
 * /api/users/{id}/change-password:
 *   patch:
 *     summary: Change user password (with current password)
 *     tags: [Users]
 */
router.patch('/:id/change-password', UserController.changeUserPassword);

/**
 * @swagger
 * /api/users/{id}/toggle-active:
 *   patch:
 *     summary: Toggle user active status
 *     tags: [Users]
 */
router.patch('/:id/toggle-active', UserController.toggleUserActive);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete user
 *     tags: [Users]
 */
router.delete('/:id', UserController.deleteUser);

export default router;