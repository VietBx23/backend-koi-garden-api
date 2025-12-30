import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import db from './config/db.js';
import swaggerSpec from './config/swagger.js';

// Import all routes
import serviceRoutes from './routes/serviceRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import postRoutes from './routes/postRoutes.js';
import testimonialRoutes from './routes/testimonialRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import heroSlideRoutes from './routes/heroSlideRoutes.js';
import userRoutes from './routes/userRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 10000;
const isProduction = process.env.NODE_ENV === 'production';

// Middleware
app.use(cors({
  origin: isProduction 
    ? ['https://your-frontend-domain.com', 'https://koi-garden-admin.vercel.app'] 
    : ['http://localhost:3001', 'http://localhost:3000'],
  credentials: true
}));

app.use(isProduction ? morgan('combined') : morgan('dev'));
app.use(express.json({ limit: '50mb' })); // Increase limit for image uploads
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

// Health check endpoint for Render
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Swagger UI (only in development or if explicitly enabled)
if (!isProduction || process.env.ENABLE_SWAGGER === 'true') {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

// API Routes
app.use('/api/services', serviceRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/hero-slides', heroSlideRoutes);
app.use('/api/users', userRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/dashboard', dashboardRoutes);

/**
 * @swagger
 * /:
 *   get:
 *     summary: Welcome message
 *     description: Returns a welcome message.
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Welcome to the Node.js PostgreSQL Backend!
 */
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Node.js PostgreSQL Backend!' });
});

/**
 * @swagger
 * /test-db:
 *   get:
 *     summary: Test Database Connection
 *     description: Checks if the backend can connect to the PostgreSQL database.
 *     responses:
 *       200:
 *         description: Database connection successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Database connection successful
 *                 time:
 *                   type: string
 *                   example: 2023-10-27T10:00:00.000Z
 *       500:
 *         description: Database connection failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Database connection failed
 *                 error:
 *                   type: string
 */
app.get('/test-db', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW()');
    res.json({ 
      message: 'Database connection successful', 
      time: result.rows[0].now 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      message: 'Database connection failed', 
      error: err.message 
    });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Server is running on port ${port}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🗄️  Database: ${process.env.DB_HOST ? 'Connected' : 'Local'}`);
  
  if (!isProduction || process.env.ENABLE_SWAGGER === 'true') {
    console.log(`📚 Swagger UI available at http://localhost:${port}/api-docs`);
  }
  
  console.log(`❤️  Health check available at http://localhost:${port}/health`);
});
