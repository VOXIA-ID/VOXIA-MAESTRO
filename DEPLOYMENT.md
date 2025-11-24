# Trading Assistant - Deployment Guide

## 🚀 Quick Deploy to GitHub Pages

### Method 1: Direct Upload (Easiest)

1. **Create GitHub Repository**
   - Go to https://github.com and create new repository
   - Name: `trading-assistant` (or your preferred name)
   - Make it Public
   - Don't initialize with README

2. **Upload Files**
   - Click "Add file" → "Upload files"
   - Drag and drop all files from the project folder:
     - `index.html`
     - `styles.css`
     - `script.js`
     - `search-api.js`
     - `ai-analyzer.js`
     - `README.md`
     - `package.json`

3. **Enable GitHub Pages**
   - Go to Settings → Pages
   - Source: Deploy from a branch
   - Branch: main / (root)
   - Click Save

4. **Access Your Site**
   - Wait 2-5 minutes for deployment
   - Visit: `https://yourusername.github.io/trading-assistant/`

### Method 2: Git Command Line

```bash
# Clone your empty repository
git clone https://github.com/yourusername/trading-assistant.git
cd trading-assistant

# Copy all project files here
# Then commit and push
git add .
git commit -m "Initial commit - Trading Assistant App"
git push origin main

# Enable GitHub Pages in repository settings
```

### Method 3: GitHub Desktop

1. Clone your repository using GitHub Desktop
2. Copy all project files to the repository folder
3. Commit changes with description
4. Push to GitHub
5. Enable GitHub Pages in repository settings

## 🔧 Custom Configuration

### Custom Domain

1. **Buy a domain** (optional)
2. **Add CNAME file** in root directory:
   ```
   yourdomain.com
   ```
3. **Configure DNS**:
   - Add CNAME record: `www` → `yourusername.github.io`
   - Add A record: `@` → GitHub Pages IPs

### Environment Variables

For production with real APIs, create `config.js`:

```javascript
const CONFIG = {
    GOOGLE_API_KEY: 'your-google-api-key',
    SEARCH_ENGINE_ID: 'your-search-engine-id',
    BASE_URL: window.location.origin,
    DEBUG: false
};
```

## 📱 Testing Locally

### Option 1: Python Server
```bash
python -m http.server 8000
# Visit http://localhost:8000
```

### Option 2: Node.js Serve
```bash
npx serve . -l 8000
# Visit http://localhost:8000
```

### Option 3: Live Server (VS Code)
1. Install Live Server extension
2. Right-click `index.html`
3. Select "Open with Live Server"

## 🌐 Deployment Checklist

- [ ] All files uploaded to GitHub
- [ ] GitHub Pages enabled in settings
- [ ] Site loads correctly at GitHub Pages URL
- [ ] Mobile responsive test passed
- [ ] All interactive features working
- [ ] Links to Voxia ID working
- [ ] App link (Opal Google) working
- [ ] Disclaimer text visible

## 🔍 Troubleshooting

### Common Issues

**404 Error**
- Check that GitHub Pages is enabled
- Verify branch is set to `main/(root)`
- Wait 5-10 minutes for propagation

**Styles Not Loading**
- Check file paths in `index.html`
- Ensure CSS file is uploaded
- Clear browser cache

**JavaScript Errors**
- Check browser console (F12)
- Verify all JS files are uploaded
- Check for syntax errors

**App Link Not Working**
- Verify the Opal Google URL is correct
- Check if link opens in new tab
- Test the target URL separately

### Performance Optimization

- Images are optimized (if any)
- CSS and JS are minified for production
- Font loading is optimized
- No console errors in production

## 📊 Analytics (Optional)

Add Google Analytics to `index.html` before `</head>`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 🔒 Security Notes

- No sensitive data in client-side code
- API keys should be server-side if using real APIs
- HTTPS enforced by GitHub Pages
- Input validation implemented

## 📈 Monitoring

- Check GitHub Pages build status in repository
- Monitor site uptime
- Test all features regularly
- Update content as needed

---

**Need Help?**
- Check GitHub Pages documentation
- Review this guide
- Contact Voxia ID support