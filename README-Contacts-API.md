# Contacts API

A comprehensive RESTful API for managing contact inquiries with status tracking, built with Node.js, Express, and PostgreSQL.

## Features

- ✅ Full CRUD operations for contact management
- ✅ Status-based filtering and tracking
- ✅ Contact statistics dashboard
- ✅ Email and phone validation
- ✅ Pagination support
- ✅ Professional error handling
- ✅ Swagger/OpenAPI documentation

## Contact Status Flow

```
new → in_progress → resolved → closed
```

- **new**: Initial contact submission
- **in_progress**: Contact is being processed
- **resolved**: Issue/inquiry has been resolved
- **closed**: Contact is closed/archived

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/contacts` | Get all contacts (paginated, filterable) |
| GET | `/api/contacts/stats` | Get contact statistics by status |
| GET | `/api/contacts/:id` | Get contact by ID |
| POST | `/api/contacts` | Create new contact |
| PUT | `/api/contacts/:id` | Update contact |
| PATCH | `/api/contacts/:id/status` | Update contact status only |
| DELETE | `/api/contacts/:id` | Delete contact |

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

### Create/Update Contact
```json
{
  "full_name": "John Doe", // Required, max 255 chars
  "phone": "+1234567890", // Required, max 20 chars
  "email": "john@example.com", // Optional, max 100 chars, must be valid email
  "subject": "Project Inquiry", // Optional, max 255 chars
  "message": "Detailed message content", // Optional
  "status": "new" // Optional, defaults to 'new'
}
```

### Update Status Only
```json
{
  "status": "in_progress" // Required: new, in_progress, resolved, closed
}
```

## Validation Rules

- **full_name**: Required, maximum 255 characters
- **phone**: Required, maximum 20 characters, must be valid phone format
- **email**: Optional, maximum 100 characters, must be valid email format if provided
- **subject**: Optional, maximum 255 characters
- **message**: Optional, no limit
- **status**: Must be one of: `new`, `in_progress`, `resolved`, `closed`

## Query Parameters

### List Contacts (`GET /api/contacts`)
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)
- `status`: Filter by status (`new`, `in_progress`, `resolved`, `closed`)

Example: `GET /api/contacts?status=new&page=1&limit=20`

## Statistics Endpoint

`GET /api/contacts/stats` returns:
```json
{
  "success": true,
  "message": "Contact statistics retrieved successfully",
  "data": {
    "new": 15,
    "in_progress": 8,
    "resolved": 42,
    "closed": 23
  }
}
```

## Database Schema

```sql
CREATE TABLE IF NOT EXISTS contacts (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(100),
  subject VARCHAR(255),
  message TEXT,
  status VARCHAR(20) DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_contacts_status ON contacts(status);
```

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

3. **Create database table** (run the SQL schema above)

4. **Start the server**
```bash
# Development
npm run dev

# Production
npm start
```

5. **Access API Documentation**
- Swagger UI: http://localhost:3000/api-docs
- API Base URL: http://localhost:3000/api/contacts

## Testing

Use the `test-contacts-api.http` file with REST Client extension in VS Code to test all endpoints.

## Use Cases

### Customer Service Dashboard
- View all new contacts: `GET /api/contacts?status=new`
- Get statistics: `GET /api/contacts/stats`
- Update status: `PATCH /api/contacts/:id/status`

### Contact Form Integration
- Submit contact: `POST /api/contacts`
- Auto-validation of email and phone

### Admin Management
- Full CRUD operations
- Status tracking workflow
- Contact history and analytics

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Detailed validation errors"],
  "error": "Technical error details"
}
```

Common HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `404`: Not Found
- `500`: Internal Server Error

## Project Structure

```
src/
├── models/
│   └── Contact.js              # Database model
├── controllers/
│   └── contactController.js    # Business logic
├── routes/
│   └── contactRoutes.js        # API routes & Swagger docs
├── middleware/
│   └── validation.js           # Input validation
└── app.js                      # Main application
```

## Integration Examples

### Frontend Contact Form
```javascript
// Submit contact form
const submitContact = async (formData) => {
  const response = await fetch('/api/contacts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  });
  return response.json();
};
```

### Admin Dashboard
```javascript
// Get contact statistics
const getStats = async () => {
  const response = await fetch('/api/contacts/stats');
  return response.json();
};

// Update contact status
const updateStatus = async (id, status) => {
  const response = await fetch(`/api/contacts/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  return response.json();
};
```