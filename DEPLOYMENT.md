# 🚀 Deployment Guide for Render

## 📋 Pre-Deployment Checklist

### ✅ Files Created/Updated for Deployment
- [x] `render.yaml` - Render service configuration
- [x] `Dockerfile` - Container configuration
- [x] `.dockerignore` - Docker ignore rules
- [x] `package.json` - Updated with deployment scripts
- [x] `src/app.js` - Production-ready configuration
- [x] `src/config/db.js` - Enhanced database configuration
- [x] `scripts/deploy-init.js` - Database initialization script
- [x] `scripts/health-check.js` - Health monitoring script
- [x] `.env.production` - Production environment template
- [x] `README.md` - Comprehensive documentation
- [x] `.gitignore` - Git ignore rules
- [x] `DEPLOYMENT.md` - This deployment guide

### ✅ Configuration Updates
- [x] **CORS Configuration** - Updated for production domains
- [x] **SSL Configuration** - Enabled for Render PostgreSQL
- [x] **Port Configuration** - Set to 10000 for Render
- [x] **Environment Detection** - Production vs development
- [x] **Database Pool Settings** - Optimized for production
- [x] **Error Handling** - Enhanced for production
- [x] **Logging** - Production-appropriate logging
- [x] **Health Checks** - Added monitoring endpoints

## 🌐 Deployment Steps on Render

### Method 1: Automatic Deployment (Recommended)

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Prepare for Render deployment"
   git push origin main
   ```

2. **Create Render Service**:
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Render will detect `render.yaml` automatically
   - Click "Apply" to create both database and web service

3. **Monitor Deployment**:
   - Watch the build logs in Render dashboard
   - Database will be created first
   - Web service will build and deploy
   - Database initialization runs automatically

### Method 2: Manual Setup

1. **Create PostgreSQL Database**:
   - Go to Render Dashboard
   - Click "New +" → "PostgreSQL"
   - Choose database name: `koi-garden-database`
   - Select plan (Free tier available)
   - Note the connection details

2. **Create Web Service**:
   - Click "New +" → "Web Service"
   - Connect GitHub repository
   - Configure settings:
     - **Name**: `koi-garden-backend`
     - **Environment**: `Node`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Plan**: Free (or paid for better performance)

3. **Set Environment Variables**:
   ```
   NODE_ENV=production
   PORT=10000
   DB_HOST=<your-render-postgres-host>
   DB_PORT=5432
   DB_NAME=koi_garden_database
   DB_USER=<your-render-postgres-user>
   DB_PASSWORD=<your-render-postgres-password>
   ```

4. **Deploy**:
   - Click "Create Web Service"
   - Monitor build and deployment logs

## 🔍 Post-Deployment Verification

### 1. Health Check
Visit your deployed URL + `/health`:
```
https://your-app-name.onrender.com/health
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2025-12-30T08:49:29.932Z",
  "environment": "production"
}
```

### 2. Database Test
Visit your deployed URL + `/test-db`:
```
https://your-app-name.onrender.com/test-db
```

Expected response:
```json
{
  "message": "Database connection successful",
  "time": "2025-12-30T08:49:29.932Z"
}
```

### 3. API Endpoints Test
Test a few key endpoints:
```
https://your-app-name.onrender.com/api/services
https://your-app-name.onrender.com/api/projects
https://your-app-name.onrender.com/api/dashboard/stats
```

### 4. API Documentation (if enabled)
```
https://your-app-name.onrender.com/api-docs
```

## 🔧 Configuration Options

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NODE_ENV` | Yes | `production` | Environment mode |
| `PORT` | Yes | `10000` | Server port (Render default) |
| `DB_HOST` | Yes | - | Database host from Render |
| `DB_PORT` | Yes | `5432` | Database port |
| `DB_NAME` | Yes | - | Database name |
| `DB_USER` | Yes | - | Database username |
| `DB_PASSWORD` | Yes | - | Database password |
| `ENABLE_SWAGGER` | No | `false` | Enable API docs in production |

### CORS Configuration
Update `src/app.js` with your frontend domains:
```javascript
origin: isProduction 
  ? ['https://your-frontend-domain.com', 'https://koi-garden-admin.vercel.app'] 
  : ['http://localhost:3001', 'http://localhost:3000'],
```

## 🚨 Troubleshooting

### Common Issues

1. **Build Fails**:
   - Check Node.js version (requires 18+)
   - Verify all dependencies in package.json
   - Check build logs for specific errors

2. **Database Connection Fails**:
   - Verify database environment variables
   - Check if database is running
   - Ensure SSL is properly configured

3. **App Crashes on Start**:
   - Check application logs in Render dashboard
   - Verify start command: `npm start`
   - Check for missing environment variables

4. **API Returns 500 Errors**:
   - Check database connection
   - Verify table initialization
   - Check application logs

### Debug Commands

Run locally with production settings:
```bash
NODE_ENV=production npm start
```

Test health check:
```bash
curl https://your-app-name.onrender.com/health
```

Check database connection:
```bash
curl https://your-app-name.onrender.com/test-db
```

## 📊 Monitoring

### Built-in Monitoring
- **Health Check**: `/health` endpoint
- **Database Test**: `/test-db` endpoint
- **Request Logging**: Morgan middleware
- **Error Logging**: Console output

### Render Monitoring
- **Metrics**: CPU, Memory, Response time
- **Logs**: Real-time application logs
- **Alerts**: Configure via Render dashboard

## 🔄 Updates and Maintenance

### Deploying Updates
1. Push changes to GitHub
2. Render automatically rebuilds and deploys
3. Monitor deployment in dashboard
4. Verify functionality with health checks

### Database Migrations
- Add migration scripts to `scripts/` folder
- Run via Render shell or deployment hooks
- Test thoroughly in staging environment

### Scaling
- Upgrade Render plan for better performance
- Configure auto-scaling if needed
- Monitor resource usage

## 📞 Support

### Render Support
- [Render Documentation](https://render.com/docs)
- [Render Community](https://community.render.com)
- Support tickets via dashboard

### Application Support
- Check application logs first
- Review this deployment guide
- Test locally with production settings
- Contact development team

## 🎉 Success!

If all checks pass, your Koi Garden Backend API is successfully deployed on Render and ready for production use!

Your API will be available at:
```
https://your-app-name.onrender.com
```

Remember to update your frontend application to use the new production API URL.