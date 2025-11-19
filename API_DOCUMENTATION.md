# API Documentation

Complete API reference for backend integration.

## Base URL

```
Development: http://localhost:5173/api (MirageJS)
Production:  https://your-backend.com/api
```

## Authentication

All admin endpoints require authentication via Bearer token.

### Login

**POST** `/api/login`

Request:
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

Response (200 OK):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "1",
    "email": "admin@example.com",
    "name": "Admin User"
  }
}
```

Response (401 Unauthorized):
```json
{
  "error": "Invalid credentials"
}
```

### Logout

**POST** `/api/logout`

Headers:
```
Authorization: Bearer {token}
```

Response (200 OK):
```json
{
  "success": true
}
```

---

## Pages

### List All Pages

**GET** `/api/pages`

Response (200 OK):
```json
{
  "pages": [
    {
      "id": "page-1",
      "slug": "home",
      "title": {
        "en": "Home",
        "ar": "الرئيسية",
        "ku": "سەرەکی"
      },
      "visible": true,
      "showInNavbar": true,
      "navbarParentId": null,
      "order": 1,
      "sections": ["section-1", "section-2"]
    }
  ]
}
```

### Get Page by ID

**GET** `/api/pages/:id`

Response (200 OK):
```json
{
  "id": "page-1",
  "slug": "home",
  "title": {
    "en": "Home",
    "ar": "الرئيسية",
    "ku": "سەرەکی"
  },
  "visible": true,
  "showInNavbar": true,
  "navbarParentId": null,
  "order": 1,
  "sections": ["section-1", "section-2"],
  "sectionsData": [
    {
      "id": "section-1",
      "pageId": "page-1",
      "type": "header",
      "content": { ... },
      "layout": { ... },
      "order": 1
    }
  ]
}
```

Response (404 Not Found):
```json
{
  "error": "Page not found"
}
```

### Create Page

**POST** `/api/pages`

Headers:
```
Authorization: Bearer {token}
Content-Type: application/json
```

Request:
```json
{
  "slug": "about",
  "title": {
    "en": "About Us",
    "ar": "من نحن",
    "ku": "دەربارەی ئێمە"
  },
  "visible": true,
  "showInNavbar": true,
  "navbarParentId": null,
  "order": 2
}
```

Response (201 Created):
```json
{
  "id": "page-2",
  "slug": "about",
  "title": {
    "en": "About Us",
    "ar": "من نحن",
    "ku": "دەربارەی ئێمە"
  },
  "visible": true,
  "showInNavbar": true,
  "navbarParentId": null,
  "order": 2,
  "sections": []
}
```

### Update Page

**PUT** `/api/pages/:id`

Headers:
```
Authorization: Bearer {token}
Content-Type: application/json
```

Request:
```json
{
  "slug": "about-us",
  "title": {
    "en": "About Us - Updated",
    "ar": "من نحن - محدث",
    "ku": "دەربارەی ئێمە - نوێکراوە"
  },
  "visible": true,
  "showInNavbar": false,
  "navbarParentId": "page-1",
  "order": 2
}
```

Response (200 OK):
```json
{
  "id": "page-2",
  "slug": "about-us",
  "title": {
    "en": "About Us - Updated",
    "ar": "من نحن - محدث",
    "ku": "دەربارەی ئێمە - نوێکراوە"
  },
  "visible": true,
  "showInNavbar": false,
  "navbarParentId": "page-1",
  "order": 2,
  "sections": []
}
```

### Delete Page

**DELETE** `/api/pages/:id`

Headers:
```
Authorization: Bearer {token}
```

Response (200 OK):
```json
{
  "success": true
}
```

---

## Sections

### List Sections

**GET** `/api/sections?pageId={pageId}`

Query Parameters:
- `pageId` (optional): Filter by page ID

Response (200 OK):
```json
{
  "sections": [
    {
      "id": "section-1",
      "pageId": "page-1",
      "type": "header",
      "content": {
        "title": {
          "en": "Welcome",
          "ar": "مرحبا",
          "ku": "بەخێربێن"
        },
        "details": {
          "en": "<p>Welcome to our site</p>",
          "ar": "<p>مرحبا بكم في موقعنا</p>",
          "ku": "<p>بەخێربێن بۆ ماڵپەڕەکەمان</p>"
        },
        "image": "data:image/png;base64,...",
        "button": {
          "text": {
            "en": "Learn More",
            "ar": "اعرف المزيد",
            "ku": "زیاتر بزانە"
          },
          "link": "/about"
        },
        "shareText": {
          "en": "Check this out!",
          "ar": "تحقق من هذا!",
          "ku": "سەیری ئەمە بکە!"
        }
      },
      "layout": {
        "imagePosition": "center",
        "bg": "gradient",
        "padding": "xl",
        "textAlign": "center"
      },
      "order": 1
    }
  ]
}
```

### Get Section by ID

**GET** `/api/sections/:id`

Response (200 OK):
```json
{
  "id": "section-1",
  "pageId": "page-1",
  "type": "header",
  "content": { ... },
  "layout": { ... },
  "order": 1
}
```

### Create Section

**POST** `/api/sections`

Headers:
```
Authorization: Bearer {token}
Content-Type: application/json
```

Request:
```json
{
  "pageId": "page-1",
  "type": "features",
  "content": {
    "title": {
      "en": "Our Features",
      "ar": "ميزاتنا",
      "ku": "تایبەتمەندییەکانمان"
    },
    "details": {
      "en": "<p>Discover what we offer</p>",
      "ar": "<p>اكتشف ما نقدمه</p>",
      "ku": "<p>بزانە چیمان پێشکەش دەکەیت</p>"
    },
    "features": [
      {
        "icon": "🚀",
        "title": {
          "en": "Fast",
          "ar": "سريع",
          "ku": "خێرا"
        },
        "description": {
          "en": "Lightning fast performance",
          "ar": "أداء سريع كالبرق",
          "ku": "کارکردنی زۆر خێرا"
        }
      }
    ],
    "shareText": {
      "en": "Check out our features!",
      "ar": "تحقق من ميزاتنا!",
      "ku": "سەیری تایبەتمەندییەکانمان بکە!"
    }
  },
  "layout": {
    "bg": "white",
    "padding": "lg",
    "textAlign": "center"
  }
}
```

Response (201 Created):
```json
{
  "id": "section-2",
  "pageId": "page-1",
  "type": "features",
  "content": { ... },
  "layout": { ... },
  "order": 2
}
```

### Update Section

**PUT** `/api/sections/:id`

Headers:
```
Authorization: Bearer {token}
Content-Type: application/json
```

Request: Same as Create Section

Response (200 OK): Returns updated section

### Delete Section

**DELETE** `/api/sections/:id`

Headers:
```
Authorization: Bearer {token}
```

Response (200 OK):
```json
{
  "success": true
}
```

### Reorder Sections

**POST** `/api/sections/reorder`

Headers:
```
Authorization: Bearer {token}
Content-Type: application/json
```

Request:
```json
{
  "sections": [
    { "id": "section-2", "order": 1 },
    { "id": "section-1", "order": 2 },
    { "id": "section-3", "order": 3 }
  ]
}
```

Response (200 OK):
```json
{
  "success": true
}
```

---

## Surveys

### List All Surveys

**GET** `/api/surveys`

Response (200 OK):
```json
{
  "surveys": [
    {
      "id": "survey-1",
      "slug": "feedback",
      "title": {
        "en": "Feedback Survey",
        "ar": "استبيان الملاحظات",
        "ku": "ڕاپرسی فیدباک"
      },
      "description": {
        "en": "Share your thoughts",
        "ar": "شارك أفكارك",
        "ku": "بیرەکانت هاوبەش بکە"
      },
      "isPublic": true,
      "questions": [ ... ],
      "createdAt": "2024-01-15T00:00:00.000Z"
    }
  ]
}
```

### Get Survey by ID

**GET** `/api/surveys/:id`

Response (200 OK):
```json
{
  "id": "survey-1",
  "slug": "feedback",
  "title": {
    "en": "Feedback Survey",
    "ar": "استبيان الملاحظات",
    "ku": "ڕاپرسی فیدباک"
  },
  "description": {
    "en": "Share your thoughts",
    "ar": "شارك أفكارك",
    "ku": "بیرەکانت هاوبەش بکە"
  },
  "isPublic": true,
  "questions": [
    {
      "id": "q1",
      "type": "text",
      "question": {
        "en": "What's your name?",
        "ar": "ما اسمك؟",
        "ku": "ناوت چییە؟"
      },
      "required": true
    },
    {
      "id": "q2",
      "type": "single-choice",
      "question": {
        "en": "How do you rate us?",
        "ar": "كيف تقيمنا؟",
        "ku": "چۆن هەڵمانسەنگێنیت؟"
      },
      "required": true,
      "options": [
        {
          "id": "opt1",
          "text": {
            "en": "Excellent",
            "ar": "ممتاز",
            "ku": "نایاب"
          }
        },
        {
          "id": "opt2",
          "text": {
            "en": "Good",
            "ar": "جيد",
            "ku": "باش"
          }
        }
      ]
    },
    {
      "id": "q3",
      "type": "multi-choice",
      "question": {
        "en": "What features do you use?",
        "ar": "ما الميزات التي تستخدمها؟",
        "ku": "کام تایبەتمەندییەکان بەکاردێنیت؟"
      },
      "required": false,
      "options": [ ... ]
    }
  ],
  "createdAt": "2024-01-15T00:00:00.000Z"
}
```

### Create Survey

**POST** `/api/surveys`

Headers:
```
Authorization: Bearer {token}
Content-Type: application/json
```

Request:
```json
{
  "slug": "feedback",
  "title": {
    "en": "Feedback Survey",
    "ar": "استبيان الملاحظات",
    "ku": "ڕاپرسی فیدباک"
  },
  "description": {
    "en": "Share your thoughts",
    "ar": "شارك أفكارك",
    "ku": "بیرەکانت هاوبەش بکە"
  },
  "isPublic": true,
  "questions": [ ... ]
}
```

Response (201 Created): Returns created survey

### Update Survey

**PUT** `/api/surveys/:id`

Headers:
```
Authorization: Bearer {token}
Content-Type: application/json
```

Request: Same as Create Survey

Response (200 OK): Returns updated survey

### Delete Survey

**DELETE** `/api/surveys/:id`

Headers:
```
Authorization: Bearer {token}
```

Response (200 OK):
```json
{
  "success": true
}
```

### Get Survey Responses

**GET** `/api/surveys/:id/responses`

Headers:
```
Authorization: Bearer {token}
```

Response (200 OK):
```json
{
  "surveyResponses": [
    {
      "id": "response-1",
      "surveyId": "survey-1",
      "answers": [
        "John Doe",
        "opt1",
        ["feat1", "feat3"]
      ],
      "submittedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

### Submit Survey Response

**POST** `/api/surveys/:id/responses`

Request:
```json
{
  "answers": [
    "John Doe",
    "opt1",
    ["feat1", "feat3"]
  ]
}
```

Response (201 Created):
```json
{
  "id": "response-1",
  "surveyId": "survey-1",
  "answers": [
    "John Doe",
    "opt1",
    ["feat1", "feat3"]
  ],
  "submittedAt": "2024-01-15T10:30:00.000Z"
}
```

---

## Data Management

### Export All Data

**GET** `/api/export`

Headers:
```
Authorization: Bearer {token}
```

Response (200 OK):
```json
{
  "pages": [ ... ],
  "sections": [ ... ],
  "surveys": [ ... ]
}
```

### Import Data

**POST** `/api/import`

Headers:
```
Authorization: Bearer {token}
Content-Type: application/json
```

Request:
```json
{
  "pages": [ ... ],
  "sections": [ ... ],
  "surveys": [ ... ]
}
```

Response (200 OK):
```json
{
  "success": true
}
```

---

## Section Types Reference

### Available Section Types

1. **header**: Hero section with title, subtitle, and CTA
2. **image-left**: Image on left, text on right
3. **image-right**: Image on right, text on left
4. **cta**: Centered call-to-action
5. **features**: Grid of features with icons
6. **testimonials**: Customer testimonials
7. **faq**: Accordion FAQ items
8. **rich**: Custom HTML content

### Content Schema by Type

#### Header, Image-Left, Image-Right, CTA
```json
{
  "title": { "en": "...", "ar": "...", "ku": "..." },
  "details": { "en": "<p>...</p>", "ar": "...", "ku": "..." },
  "image": "data:image/png;base64,..." or "url",
  "button": {
    "text": { "en": "...", "ar": "...", "ku": "..." },
    "link": "/path"
  },
  "shareText": { "en": "...", "ar": "...", "ku": "..." }
}
```

#### Features
```json
{
  "title": { "en": "...", "ar": "...", "ku": "..." },
  "details": { "en": "<p>...</p>", "ar": "...", "ku": "..." },
  "features": [
    {
      "icon": "🚀",
      "title": { "en": "...", "ar": "...", "ku": "..." },
      "description": { "en": "...", "ar": "...", "ku": "..." }
    }
  ],
  "shareText": { "en": "...", "ar": "...", "ku": "..." }
}
```

#### Testimonials
```json
{
  "title": { "en": "...", "ar": "...", "ku": "..." },
  "details": { "en": "<p>...</p>", "ar": "...", "ku": "..." },
  "testimonials": [
    {
      "name": "John Doe",
      "role": { "en": "CEO", "ar": "الرئيس التنفيذي", "ku": "سەرۆک" },
      "text": { "en": "...", "ar": "...", "ku": "..." },
      "avatar": "👨‍💼"
    }
  ],
  "shareText": { "en": "...", "ar": "...", "ku": "..." }
}
```

#### FAQ
```json
{
  "title": { "en": "...", "ar": "...", "ku": "..." },
  "faqs": [
    {
      "question": { "en": "...", "ar": "...", "ku": "..." },
      "answer": { "en": "...", "ar": "...", "ku": "..." }
    }
  ]
}
```

---

## Error Responses

All endpoints may return these error responses:

### 400 Bad Request
```json
{
  "error": "Invalid request data"
}
```

### 401 Unauthorized
```json
{
  "error": "Authentication required"
}
```

### 403 Forbidden
```json
{
  "error": "Permission denied"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## Rate Limiting

Recommended rate limits for production:

- Authentication: 5 requests per minute
- Read operations: 100 requests per minute
- Write operations: 30 requests per minute
- Survey submissions: 10 requests per minute

---

## CORS Configuration

For production, configure CORS headers:

```
Access-Control-Allow-Origin: https://your-frontend.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
```

---

## Webhooks (Optional)

Consider implementing webhooks for:

- Page published/unpublished
- Survey response submitted
- Content updated

Example webhook payload:
```json
{
  "event": "page.published",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "data": {
    "pageId": "page-1",
    "slug": "about"
  }
}
```

---

For implementation questions, refer to the [README.md](README.md) or check the MirageJS implementation in `src/api/mirage.js`.

