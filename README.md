# Dynamic Multi-language Website Builder + Admin Dashboard + Survey Builder

A powerful, modern CMS platform built with React, featuring full support for Arabic, English, and Kurdish (Sorani) with RTL support, drag-and-drop page building, and survey management.

## 🌟 Features

### Multi-language Support
- **Languages**: English (LTR), Arabic (RTL), Kurdish Sorani (RTL)
- **Full RTL Support**: Automatic direction switching for Arabic and Kurdish
- **Per-language Content**: Edit all content (pages, sections, surveys) in each language
- **Language Switcher**: Easy switching between languages with persistent preference

### Dynamic Page Management
- **CRUD Operations**: Create, edit, delete, and reorder pages
- **Nested Navigation**: Support for dropdown menus with parent-child page relationships
- **Visibility Control**: Toggle page visibility and navbar display
- **Drag & Drop**: Reorder pages with intuitive drag-and-drop interface

### Section Builder
- **Multiple Templates**:
  - Header: Full-width hero section with title, subtitle, and CTA
  - Image + Text: Left or right image with text content
  - Call to Action: Centered CTA with button
  - Features Grid: Showcase features with icons and descriptions
  - Testimonials: Display customer testimonials
  - FAQ: Accordion-style frequently asked questions
  - Rich HTML: Custom HTML content block
- **Rich Text Editor**: WYSIWYG editor for content (React Quill)
- **Image Upload**: Simulated image upload with base64 encoding
- **Customizable Layout**: Background, padding, text alignment options
- **Drag & Drop Reordering**: Rearrange sections within pages

### Survey Builder
- **Question Types**:
  - Text Input: Free-form text responses
  - Single Choice: Radio button selection
  - Multiple Choice: Checkbox selections
- **Multi-language Questions**: Questions and options in all supported languages
- **Public Links**: Generate shareable survey URLs
- **Response Management**: View all responses with analytics
- **CSV Export**: Export survey responses to CSV for analysis
- **Analytics**: Automatic calculation of response percentages for choice questions

### Social Sharing
- **Web Share API**: Native sharing on supported devices
- **Social Platforms**: Share to Facebook, Twitter, WhatsApp
- **Copy Link**: Fallback copy-to-clipboard functionality
- **Per-section Sharing**: Share individual sections with custom text

### Admin Dashboard
- **Clean Interface**: Modern, intuitive admin UI
- **Dark Mode**: Toggle between light and dark themes
- **Responsive**: Mobile-friendly admin panel
- **Authentication**: Protected admin routes with simple login

### Technical Features
- **Mock Backend**: MirageJS for in-browser API simulation
- **React Query**: Efficient data fetching and caching
- **Zustand**: Lightweight state management
- **Drag & Drop**: dnd-kit for sortable lists
- **Routing**: React Router with protected routes
- **TypeScript Ready**: Easy migration to TypeScript
- **SEO Friendly**: Semantic HTML structure
- **Accessible**: ARIA labels and keyboard navigation

## 📦 Tech Stack

- **Frontend**: React 18.3 + Vite 7
- **Styling**: TailwindCSS 4
- **Routing**: React Router v7
- **State Management**: Zustand + React Query (TanStack Query)
- **i18n**: react-i18next
- **Drag & Drop**: @dnd-kit
- **Rich Text**: React Quill
- **Mock API**: MirageJS

> **Note**: Using React 18 instead of React 19 for compatibility with React Quill. React 19 will be supported once React Quill updates.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd CMS-Project
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to:
```
http://localhost:5173
```

### Default Admin Credentials

```
Email: admin@example.com
Password: password123
```

## 📖 Usage Guide

### Public Site

1. **View Pages**: Navigate through pages using the top navigation bar
2. **Switch Languages**: Use the language switcher (EN/AR/KU) in the navbar
3. **Toggle Theme**: Click the sun/moon icon to switch between light/dark themes
4. **Share Content**: Click the share button on any section to share on social media
5. **Take Surveys**: Access public surveys at `/survey/{slug}`

### Admin Dashboard

#### Login
1. Go to `/login`
2. Enter admin credentials
3. You'll be redirected to the admin dashboard

#### Managing Pages

1. **Create a Page**:
   - Click "Create Page" button
   - Enter slug (URL-friendly identifier)
   - Add titles in all languages
   - Configure visibility and navbar settings
   - Save the page

2. **Edit a Page**:
   - Click "Edit" on any page in the list
   - Update page settings
   - Add/edit/delete sections
   - Reorder sections with drag & drop

3. **Reorder Pages**:
   - Drag pages using the handle icon
   - Order changes save automatically

4. **Add Sections**:
   - On the page editor, click "Add Section"
   - Choose a section type
   - Fill in content for each language
   - Upload images (simulated)
   - Configure layout options
   - Save the section

#### Managing Surveys

1. **Create a Survey**:
   - Go to Surveys in admin
   - Click "Create Survey"
   - Enter slug and titles/descriptions
   - Add questions with drag-and-drop ordering
   - Configure question types and options
   - Mark as public to enable public access

2. **View Responses**:
   - Click "View Responses" on any survey
   - See analytics for choice questions
   - View all individual responses
   - Export to CSV for further analysis

3. **Share Surveys**:
   - Copy the public link
   - Share with respondents
   - Monitor responses in real-time

## 🔧 Configuration

### Language Configuration

Edit `src/i18n/config.js` to add or modify languages:

```javascript
export const RTL_LANGUAGES = ['ar', 'ku']; // Add RTL languages here
```

Add translation files in `src/i18n/locales/`:
- `en.json` - English translations
- `ar.json` - Arabic translations
- `ku.json` - Kurdish translations

### Seed Data

Modify `src/api/seedData.js` to customize initial data:

```javascript
export const seedData = {
  users: [...],    // Admin users
  pages: [...],    // Initial pages
  sections: [...], // Initial sections
  surveys: [...],  // Initial surveys
};
```

## 🔄 Switching from MirageJS to Real Backend

### Overview

The application is designed to easily switch from MirageJS (mock backend) to a real backend. All API calls are centralized in `src/services/api.js`.

### Steps to Migrate

1. **Update API Base URL**:

```javascript
// src/services/api.js
const API_BASE = process.env.VITE_API_URL || 'https://your-backend.com/api';
```

2. **Remove MirageJS**:

```javascript
// src/main.jsx
// Comment out or remove:
// import { makeServer } from './api/mirage'
// if (import.meta.env.MODE === 'development') {
//   makeServer({ environment: 'development' })
// }
```

3. **Implement Backend Endpoints**:

Your backend should implement the following endpoints:

#### Authentication
```
POST   /api/login
POST   /api/logout
```

#### Pages
```
GET    /api/pages
GET    /api/pages/:id
POST   /api/pages
PUT    /api/pages/:id
DELETE /api/pages/:id
```

#### Sections
```
GET    /api/sections?pageId=:id
GET    /api/sections/:id
POST   /api/sections
PUT    /api/sections/:id
DELETE /api/sections/:id
POST   /api/sections/reorder
```

#### Surveys
```
GET    /api/surveys
GET    /api/surveys/:id
POST   /api/surveys
PUT    /api/surveys/:id
DELETE /api/surveys/:id
GET    /api/surveys/:id/responses
POST   /api/surveys/:id/responses
```

#### Data Export/Import
```
GET    /api/export
POST   /api/import
```

### API Request/Response Formats

#### Page Object
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
  "sections": ["section-1", "section-2"]
}
```

#### Section Object
```json
{
  "id": "section-1",
  "pageId": "page-1",
  "type": "header",
  "content": {
    "title": { "en": "...", "ar": "...", "ku": "..." },
    "details": { "en": "<p>...</p>", "ar": "...", "ku": "..." },
    "image": "data:image/png;base64,..." or "url",
    "button": {
      "text": { "en": "...", "ar": "...", "ku": "..." },
      "link": "/contact"
    },
    "shareText": { "en": "...", "ar": "...", "ku": "..." }
  },
  "layout": {
    "imagePosition": "left",
    "bg": "light",
    "padding": "md",
    "textAlign": "center"
  },
  "order": 1
}
```

#### Survey Object
```json
{
  "id": "survey-1",
  "slug": "customer-satisfaction",
  "title": { "en": "...", "ar": "...", "ku": "..." },
  "description": { "en": "...", "ar": "...", "ku": "..." },
  "isPublic": true,
  "questions": [
    {
      "id": "q1",
      "type": "text|single-choice|multi-choice",
      "question": { "en": "...", "ar": "...", "ku": "..." },
      "required": true,
      "options": [
        {
          "id": "opt1",
          "text": { "en": "...", "ar": "...", "ku": "..." }
        }
      ]
    }
  ]
}
```

#### Survey Response Object
```json
{
  "id": "response-1",
  "surveyId": "survey-1",
  "answers": ["text answer", "opt1", ["opt2", "opt3"]],
  "submittedAt": "2024-01-15T10:30:00Z"
}
```

### Environment Variables

Create a `.env` file:

```env
VITE_API_URL=https://your-backend.com/api
VITE_ENABLE_MIRAGE=false
```

## 📁 Project Structure

```
CMS-Project/
├── src/
│   ├── api/              # MirageJS mock server
│   │   ├── mirage.js
│   │   └── seedData.js
│   ├── components/
│   │   ├── admin/        # Admin dashboard components
│   │   │   ├── AdminLayout.jsx
│   │   │   ├── PageList.jsx
│   │   │   ├── PageEditor.jsx
│   │   │   ├── SectionList.jsx
│   │   │   ├── SectionEditorModal.jsx
│   │   │   ├── SurveyList.jsx
│   │   │   ├── SurveyEditor.jsx
│   │   │   └── SurveyResponses.jsx
│   │   ├── public/       # Public-facing components
│   │   │   ├── NavBar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── PageRenderer.jsx
│   │   │   ├── SectionRenderer.jsx
│   │   │   ├── ShareButton.jsx
│   │   │   ├── SurveyPage.jsx
│   │   │   ├── LanguageSwitcher.jsx
│   │   │   └── ThemeToggle.jsx
│   │   └── ui/           # Reusable UI components
│   │       ├── Button.jsx
│   │       ├── Modal.jsx
│   │       ├── Input.jsx
│   │       ├── Card.jsx
│   │       ├── Tabs.jsx
│   │       ├── Loading.jsx
│   │       ├── RichTextEditor.jsx
│   │       └── ImageUpload.jsx
│   ├── hooks/            # Custom React hooks
│   │   ├── useAuth.js
│   │   └── useTheme.js
│   ├── i18n/             # Internationalization
│   │   ├── config.js
│   │   └── locales/
│   │       ├── en.json
│   │       ├── ar.json
│   │       └── ku.json
│   ├── pages/            # Page components
│   │   ├── LoginPage.jsx
│   │   └── HomePage.jsx
│   ├── routes/           # Routing configuration
│   │   ├── AppRoutes.jsx
│   │   └── ProtectedRoute.jsx
│   ├── services/         # API services
│   │   └── api.js
│   ├── styles/           # Custom styles
│   │   └── custom.css
│   ├── utils/            # Utility functions
│   │   ├── csvExport.js
│   │   └── share.js
│   ├── App.jsx           # Main App component
│   ├── main.jsx          # Entry point
│   └── index.css         # Global styles
├── public/               # Static assets
├── .env                  # Environment variables
├── index.html           # HTML template
├── package.json         # Dependencies
├── vite.config.js       # Vite configuration
└── README.md            # This file
```

## 🎨 Customization

### Theme Colors

Edit `tailwind.config.js` to customize colors:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {...},
        secondary: {...},
      },
    },
  },
};
```

### Default Language

Change default language in `src/i18n/config.js`:

```javascript
lng: localStorage.getItem('language') || 'en', // Change 'en' to 'ar' or 'ku'
```

### Section Templates

Add new section types in:
1. `src/components/public/SectionRenderer.jsx` - Add rendering logic
2. `src/components/admin/SectionEditorModal.jsx` - Add editor form
3. `src/i18n/locales/*.json` - Add translations

## 🧪 Testing

### Manual Testing Checklist

- [ ] Login with admin credentials
- [ ] Create a new page with content in all languages
- [ ] Add various section types to the page
- [ ] Reorder sections with drag & drop
- [ ] Switch languages and verify RTL for Arabic/Kurdish
- [ ] Toggle theme (light/dark)
- [ ] Create a survey with multiple question types
- [ ] Submit a survey response
- [ ] View survey analytics
- [ ] Export survey responses to CSV
- [ ] Share a section on social media
- [ ] Test mobile responsiveness

## 📊 Data Export/Import

### Export Site Data

```javascript
// In browser console on admin page
const data = await fetch('/api/export').then(r => r.json());
console.log(JSON.stringify(data, null, 2));
```

### Import Site Data

1. Prepare JSON file with pages, sections, and surveys
2. Use the `/api/import` endpoint (implement in your backend)
3. Or modify `src/api/seedData.js` and restart dev server

## 🔒 Security Considerations

### For Production

1. **Authentication**: Replace simple token auth with JWT or OAuth
2. **Authorization**: Implement role-based access control
3. **Input Validation**: Validate all inputs on backend
4. **XSS Protection**: Sanitize HTML content
5. **CSRF Protection**: Implement CSRF tokens
6. **Rate Limiting**: Add rate limiting to API endpoints
7. **Image Upload**: Use proper file upload service (e.g., S3)
8. **Environment Variables**: Never commit secrets to repository

## 🐛 Troubleshooting

### React Quill Error (findDOMNode)

If you see an error about `findDOMNode is not a function`:
- Ensure you're using React 18 (not React 19)
- Run `npm install` to install the correct React version
- The project uses React 18.3 for compatibility with React Quill

### MirageJS not loading

- Ensure `makeServer()` is called in `src/main.jsx`
- Check browser console for errors

### Language not switching

- Clear localStorage: `localStorage.clear()`
- Refresh the page

### Drag & drop not working

- Ensure you're clicking and holding the drag handle (≡)
- Check if JavaScript is enabled

### Images not displaying

- Images are stored as base64 strings in MirageJS
- For production, implement proper image upload service

## 📝 License

MIT License - feel free to use this project for any purpose.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and questions, please open an issue on GitHub.

## 🎯 Roadmap

Future enhancements:
- [ ] Media library for images
- [ ] Version control for pages
- [ ] Schedule page publishing
- [ ] Email notifications for surveys
- [ ] Advanced analytics dashboard
- [ ] Multi-user support with permissions
- [ ] Content approval workflow
- [ ] SEO metadata editor
- [ ] Custom domain mapping
- [ ] API documentation with Swagger

## 👥 Credits

Built with ❤️ using modern web technologies.

Special thanks to:
- React team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- All open-source contributors

---

**Happy Building! 🚀**
