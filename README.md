# Koi Garden Backend API

Backend API for Cảnh Quan Kiến Trúc Xanh (Green Landscape Architecture) - A comprehensive landscape and koi pond design service platform.

## 🚀 Features

- **RESTful API** with full CRUD operations
- **PostgreSQL Database** with proper relationships
- **Swagger Documentation** for API endpoints
- **File Upload Support** for images
- **CORS Configuration** for frontend integration
- **Production Ready** with proper error handling

## 📋 API Endpoints

### Core Resources
- **Services** - `/api/services` - Landscape design services
- **Projects** - `/api/projects` - Portfolio projects
- **Posts** - `/api/posts` - Blog posts and articles
- **Testimonials** - `/api/testimonials` - Customer reviews
- **Contacts** - `/api/contacts` - Contact form submissions
- **Hero Slides** - `/api/hero-slides` - Homepage banners
- **Users** - `/api/users` - User management
- **Dashboard** - `/api/dashboard` - Analytics and stats

### Utility Endpoints
- **Upload** - `/api/upload` - File upload handling
- **Health Check** - `/health` - Service health status
- **Database Test** - `/test-db` - Database connectivity

## 🛠️ Local Development

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- npm or yarn



## 🌐 Deployment on Render

### Method 1: Using render.yaml (Recommended)

1. **Fork/Clone** this repository to your GitHub account

2. **Create a new Web Service** on Render:
   - Connect your GitHub repository
   - Render will automatically detect the `render.yaml` file
   - The database and web service will be created automatically

3. **Environment Variables** (automatically configured via render.yaml):
   - `NODE_ENV=production`
   - `PORT=10000`
   - Database credentials (auto-configured)

### Method 2: Manual Setup

1. **Create PostgreSQL Database** on Render:
   - Go to Render Dashboard
   - Create new PostgreSQL database
   - Note the connection details

2. **Create Web Service** on Render:
   - Connect your GitHub repository
   - Set build command: `npm install`
   - Set start command: `npm start`
   - Set environment variables:
  

3. **Deploy**: Render will automatically build and deploy your application

### Post-Deployment

1. **Database Initialization**: The database will be automatically initialized on first deployment via the `postinstall` script

2. **Health Check**: Visit `https://your-app.onrender.com/health` to verify deployment

3. **API Documentation**: Visit `https://your-app.onrender.com/api-docs` (if enabled)

## 📊 Database Schema

The application uses PostgreSQL with the following tables:
- `services` - Service offerings
- `projects` - Portfolio projects  
- `posts` - Blog content
- `testimonials` - Customer reviews
- `contacts` - Contact submissions
- `hero_slides` - Homepage banners
- `company_info` - Company details
- `users` - User accounts
- `settings` - Application settings

## 🔧 Configuration



### CORS Configuration

The API is configured to accept requests from:
- `http://localhost:3001` (development)
- `http://localhost:3000` (development)
- Your production frontend domains (update in `src/app.js`)

## 📝 API Documentation

When running locally, visit `http://localhost:3000/api-docs` for interactive API documentation powered by Swagger UI.

## 🔒 Security Features

- **CORS Protection** with configurable origins
- **Input Validation** on all endpoints
- **SQL Injection Prevention** using parameterized queries
- **File Upload Validation** with size and type restrictions
- **Environment-based Configuration** for security

## 🚨 Error Handling

The API includes comprehensive error handling:
- **Validation Errors** - 400 Bad Request
- **Not Found** - 404 Not Found  
- **Server Errors** - 500 Internal Server Error
- **Database Errors** - Proper error logging and user-friendly messages

## 📈 Monitoring

- **Health Check Endpoint** - `/health`
- **Database Connection Test** - `/test-db`
- **Request Logging** with Morgan
- **Error Logging** to console

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 📞 Support

For support and questions, please contact the development team or create an issue in the repository.
