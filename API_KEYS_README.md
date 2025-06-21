# API Key Management System

This document describes the API key management system for the Dandi application.

## Overview

The API key management system provides a complete CRUD (Create, Read, Update, Delete) interface for managing API keys. It includes:

- A web-based dashboard for managing API keys
- RESTful API endpoints for programmatic access
- Secure key generation and storage
- Usage tracking and monitoring

## Dashboard Access

Access the API key management dashboard by:

1. Going to the home page (`/`)
2. Clicking the "Manage API Keys" button
3. Or navigating directly to `/dashboards`

## Dashboard Features

### Viewing API Keys
- Display all API keys in a table format
- Shows key name, partial key value, creation date, and last used date
- Copy full API key to clipboard with one click

### Creating New API Keys
1. Click "Create New API Key" button
2. Enter a descriptive name for the key
3. Click "Create" to generate a new API key
4. The new key will be displayed in the table

### Editing API Keys
1. Click the "Edit" button next to any API key
2. Modify the key name in the inline editor
3. Press Enter or click outside to save changes

### Deleting API Keys
1. Click the "Delete" button next to any API key
2. Confirm the deletion in the popup dialog
3. The key will be permanently removed

## API Endpoints

### List All API Keys
```http
GET /api/keys
```

**Response:**
```json
[
  {
    "id": "1",
    "name": "Development Key",
    "key": "dk_dev_1234567890abcdef",
    "createdAt": "2024-01-15T10:30:00Z",
    "lastUsed": "2024-01-20T14:22:00Z"
  }
]
```

### Create New API Key
```http
POST /api/keys
Content-Type: application/json

{
  "name": "My New API Key"
}
```

**Response:**
```json
{
  "id": "1703123456789",
  "name": "My New API Key",
  "key": "dk_abc123def456ghi789",
  "createdAt": "2024-01-20T15:30:45.123Z",
  "lastUsed": null
}
```

### Get Specific API Key
```http
GET /api/keys/{id}
```

**Response:**
```json
{
  "id": "1",
  "name": "Development Key",
  "key": "dk_dev_1234567890abcdef",
  "createdAt": "2024-01-15T10:30:00Z",
  "lastUsed": "2024-01-20T14:22:00Z"
}
```

### Update API Key
```http
PUT /api/keys/{id}
Content-Type: application/json

{
  "name": "Updated Key Name"
}
```

**Response:**
```json
{
  "id": "1",
  "name": "Updated Key Name",
  "key": "dk_dev_1234567890abcdef",
  "createdAt": "2024-01-15T10:30:00Z",
  "lastUsed": "2024-01-20T14:22:00Z"
}
```

### Delete API Key
```http
DELETE /api/keys/{id}
```

**Response:**
```json
{
  "message": "API key deleted successfully",
  "deletedKey": {
    "id": "1",
    "name": "Development Key",
    "key": "dk_dev_1234567890abcdef",
    "createdAt": "2024-01-15T10:30:00Z",
    "lastUsed": "2024-01-20T14:22:00Z"
  }
}
```

## API Key Format

API keys follow this format:
- Prefix: `dk_` (Dandi Key)
- Length: 32 characters total
- Characters: Alphanumeric (a-z, 0-9)
- Example: `dk_dev_1234567890abcdef`

## Security Considerations

### Current Implementation
- Uses in-memory storage for demonstration
- Keys are generated with cryptographically secure random values
- Partial key display in UI for security

### Production Recommendations
- Use a secure database (PostgreSQL, MongoDB, etc.)
- Implement proper authentication and authorization
- Add rate limiting to API endpoints
- Use HTTPS for all API communications
- Implement key rotation policies
- Add audit logging for key usage
- Consider using JWT tokens for API authentication

## Error Handling

All API endpoints return appropriate HTTP status codes:

- `200` - Success
- `201` - Created (for new resources)
- `400` - Bad Request (invalid input)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error

Error responses include a descriptive message:
```json
{
  "error": "API key name is required"
}
```

## Usage Tracking

The system tracks when API keys are last used. This information is displayed in the dashboard and can be used for:

- Identifying unused keys
- Security monitoring
- Usage analytics
- Key rotation decisions

## Development Notes

### File Structure
```
app/
├── dashboards/
│   └── page.js              # Dashboard UI
├── api/
│   └── keys/
│       ├── route.js         # GET /api/keys, POST /api/keys
│       └── [id]/
│           └── route.js     # GET, PUT, DELETE /api/keys/{id}
└── lib/
    └── apiKeysStore.js      # Shared data store
```

### Data Storage
Currently uses in-memory storage for demonstration. In production, replace the `apiKeysStore.js` implementation with database operations.

### UI Framework
Built with Next.js 14 and Tailwind CSS for a modern, responsive interface.

## Getting Started

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000`

3. Click "Manage API Keys" to access the dashboard

4. Start creating and managing your API keys!

## Future Enhancements

- [ ] Database integration
- [ ] User authentication
- [ ] Key permissions and scopes
- [ ] Usage analytics dashboard
- [ ] Key rotation automation
- [ ] Webhook notifications
- [ ] API rate limiting
- [ ] Audit logging
- [ ] Bulk operations
- [ ] Key expiration dates 