# Services API

A RESTful API for managing services with full CRUD operations, built with Node.js, Express, and PostgreSQL.

## Features

- ✅ Full CRUD operations (Create, Read, Update, Delete)
- ✅ Pagination support
- ✅ Auto-generated slugs from Vietnamese text
- ✅ Input validation and error handling
- ✅ Swagger/OpenAPI documentation
- ✅ Professional API structure

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/services` | Get all services (paginated) |
| GET | `/api/services/:id` | Get service by ID |
| GET | `/api/services/slug/:slug` | Get service by slug |
| POST | `/api/services` | Create new service |
| PUT | `/api/services/:id` | Update service |
| DELETE | `/api/services/:id` | Delete service |

## Request/Response Format

### Standard Response Structure
```json
{
  "success": true,
  "message": "Operation message",
  "data": {}, // Response data
  "pagination": {} // Only for list endpoints
}
```

### Create/Update Service
```json
{
  "name": "Service Name", // Required, max 255 chars
  "slug": "custom-slug", // Optional, auto-generated if not provided
  "image_url": "https://example.com/image.jpg", // Optional, max 500 chars
  "description": "Service description" // Optional
}
```

## Validation Rules

- **name**: Required, maximum 255 characters
- **slug**: Auto-generated from name if not provided, must be unique, maximum 255 characters
- **image_url**: Optional, maximum 500 characters
- **description**: Optional, no limit

## Auto Slug Generation

The API automatically converts Vietnamese text to URL-friendly slugs:
- "Thiết kế kiến trúc xanh" → "thiet-ke-kien-truc-xanh"
- Removes diacritics and special characters
- Converts spaces to hyphens
- Ensures uniqueness

## Pagination

List endpoints support pagination with query parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)

Example: `GET /api/services?page=2&limit=20`

## Setup & Installation

1. **Install dependencies**
```bash
npm install
```

2. **Configure environment variables** in `.env`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=your_database
DB_USER=your_username
DB_PASSWORD=your_password
PORT=3000
```

3. **Create database table**
```sql
CREATE TABLE services (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  image_url VARCHAR(500),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_services_slug ON services(slug);
```

4. **Start the server**
```bash
# Development
npm run dev

# Production
npm start
```

5. **Access API Documentation**
- Swagger UI: http://localhost:3000/api-docs
- API Base URL: http://localhost:3000/api/services

## Testing

Use the `test-api.http` file with REST Client extension in VS Code to test all endpoints.

## Project Structure

```
src/
├── models/
│   └── Service.js              # Database model
├── controllers/
│   └── serviceController.js    # Business logic
├── routes/
│   └── serviceRoutes.js        # API routes & Swagger docs
├── middleware/
│   └── validation.js           # Input validation
├── config/
│   ├── db.js                   # Database connection
│   └── swagger.js              # Swagger configuration
└── app.js                      # Main application
```

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Detailed error messages"],
  "error": "Technical error details"
}
```

Common HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `404`: Not Found
- `500`: Internal Server Error