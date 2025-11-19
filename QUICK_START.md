# Quick Start Guide

Get up and running with the CMS platform in 5 minutes!

## Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open at `http://localhost:5173`

## First Steps

### 1. Access the Admin Dashboard

1. Go to `http://localhost:5173/login`
2. Use these credentials:
   - Email: `admin@example.com`
   - Password: `password123`
3. You'll be redirected to the admin dashboard

### 2. Explore the Public Site

1. Click the preview icon (👁) in the admin sidebar
2. Or visit `http://localhost:5173/page/home`
3. Use the language switcher to see Arabic and Kurdish content
4. Toggle dark mode with the moon/sun icon

### 3. Create Your First Page

1. In admin dashboard, go to "Pages"
2. Click "Create Page"
3. Enter:
   - Slug: `my-first-page`
   - Title (English): `My First Page`
   - Title (Arabic): `صفحتي الأولى`
   - Title (Kurdish): `یەکەم پەڕەی من`
4. Check "Visible" and "Show in Navbar"
5. Click "Save"

### 4. Add Sections to Your Page

1. After saving, scroll down to "Sections"
2. Click "Add Section"
3. Choose "Header" type
4. Switch between language tabs (EN/AR/KU) and fill in content
5. Add a title and details in each language
6. Upload an image (optional)
7. Add a button with text and link
8. Configure layout (background, padding, alignment)
9. Click "Save"

### 5. Create a Survey

1. Go to "Surveys" in admin sidebar
2. Click "Create Survey"
3. Enter:
   - Slug: `feedback`
   - Title in all languages
   - Description in all languages
4. Check "Public"
5. Save the survey
6. Add questions:
   - Click "Add Question"
   - Choose question type (Text, Single Choice, or Multiple Choice)
   - Enter question text in all languages
   - For choice questions, add options in all languages
   - Mark as required if needed
7. Save changes

### 6. Test Your Survey

1. Copy the public link from the survey list
2. Open it in a new tab
3. Fill out and submit the survey
4. Go back to admin and click "View Responses"
5. See analytics and export to CSV

## Common Tasks

### Switch Languages
- Click EN/AR/KU in the navbar
- Content automatically switches
- Arabic and Kurdish display RTL (right-to-left)

### Toggle Dark Mode
- Click the moon icon (in light mode)
- Or sun icon (in dark mode)
- Preference is saved automatically

### Reorder Pages/Sections
- Use the drag handle (≡) icon
- Click and hold, then drag up or down
- Release to set new position
- Changes save automatically

### Share Content
- Click "Share" button on any section
- Choose platform or copy link
- Works with Web Share API on mobile

## Tips

- **Save Often**: Changes are saved to MirageJS (in-memory)
- **Refresh to Reset**: Reload page to reset to seed data
- **Multi-language**: Always fill English (required), Arabic and Kurdish optional
- **RTL Testing**: Switch to Arabic or Kurdish to see RTL layout
- **Mobile**: Admin panel is fully responsive

## Next Steps

1. Read the full [README.md](README.md) for detailed documentation
2. Check [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for backend integration
3. Customize seed data in `src/api/seedData.js`
4. Modify translations in `src/i18n/locales/`
5. Add custom section types to meet your needs

## Need Help?

- **Issue?** Check browser console for errors
- **MirageJS not working?** Ensure dev server is running
- **Language not switching?** Clear localStorage and refresh
- **Drag & drop not working?** Use the handle (≡) icon

## Production Checklist

Before deploying to production:

- [ ] Replace MirageJS with real backend
- [ ] Implement proper authentication (JWT/OAuth)
- [ ] Add input validation and sanitization
- [ ] Set up image upload service (e.g., S3)
- [ ] Configure environment variables
- [ ] Enable HTTPS
- [ ] Add rate limiting
- [ ] Set up monitoring and logging
- [ ] Test all features thoroughly
- [ ] Optimize images and assets
- [ ] Enable production builds

---

Happy building! 🚀

