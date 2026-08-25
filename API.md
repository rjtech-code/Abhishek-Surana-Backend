# API Documentation - District Administration Backend

All endpoints are prefixed with `/api`.

## Response Format

### Success
```json
{
  "success": true,
  "message": "...",
  "data": {}
}


{
  "success": true,
  "message": "...",
  "data": [],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}

{
  "success": false,
  "message": "Error description",
  "errors": []
}