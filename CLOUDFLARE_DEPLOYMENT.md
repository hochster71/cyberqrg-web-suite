# CyberQRG Web Suite - GitHub & Cloudflare Deployment Guide
## Deploy to Production - January 19, 2026

## 📋 Prerequisites
- GitHub account
- Cloudflare account
- Git installed locally

## 🚀 Step 1: GitHub Repository Setup

### Create Repository on GitHub
1. Go to https://github.com/new
2. Repository name: `cyberqrg-web-suite`
3. Description: `Production-ready CyberQRG web suite with premium dark UI`
4. Make it **Public** (for Cloudflare Pages access)
5. **DO NOT** initialize with README, .gitignore, or license
6. Click "Create repository"

### Push to GitHub
```bash
# Add GitHub remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/cyberqrg-web-suite.git

# Push to main branch
git push -u origin main
```

## ☁️ Step 2: Cloudflare Pages Deployment

### Deploy Each App Separately

#### 1. Web App (cyberqrgai.com)
1. Go to https://dash.cloudflare.com/pages
2. Click "Create a project"
3. Connect to GitHub and select `cyberqrg-web-suite`
4. **Build settings:**
   - **Build command:** (leave empty - static site)
   - **Build output directory:** `apps/web/public`
   - **Root directory:** (leave empty)
5. **Environment variables:** (none needed)
6. **Custom domain:** `cyberqrgai.com`
7. Click "Save and Deploy"

#### 2. Sentinel App (sentinel.cyberqrgai.com)
1. Create new Pages project
2. Same GitHub repo: `cyberqrg-web-suite`
3. **Build settings:**
   - **Build output directory:** `apps/sentinel/public`
4. **Custom domain:** `sentinel.cyberqrgai.com`
5. Deploy

#### 3. Privacy App (privacy.cyberqrgai.com)
1. Create new Pages project
2. Same GitHub repo: `cyberqrg-web-suite`
3. **Build settings:**
   - **Build output directory:** `apps/privacy/public`
4. **Custom domain:** `privacy.cyberqrgai.com`
5. Deploy

## 🔧 Step 3: Update Navigation Links for Production

After deployment, update all navigation links to use production domains:

### Web App Navigation (apps/web/public/index.html)
```html
<nav class="nav-links">
  <a href="/" class="nav-link active">Home</a>
  <a href="https://sentinel.cyberqrgai.com/" class="nav-link">Sentinel</a>
  <a href="https://privacy.cyberqrgai.com/" class="nav-link">Privacy</a>
  <a href="/trust/" class="nav-link">Trust</a>
</nav>
```

### Sentinel App Navigation (apps/sentinel/public/index.html)
```html
<nav class="nav-links">
  <a href="https://cyberqrgai.com/" class="nav-link">Home</a>
  <a href="/" class="nav-link active">Sentinel</a>
  <a href="https://privacy.cyberqrgai.com/" class="nav-link">Privacy</a>
  <a href="https://cyberqrgai.com/trust/" class="nav-link">Trust</a>
</nav>
```

### Privacy App Navigation (apps/privacy/public/index.html)
```html
<nav class="nav-links">
  <a href="https://cyberqrgai.com/" class="nav-link">Home</a>
  <a href="https://sentinel.cyberqrgai.com/" class="nav-link">Sentinel</a>
  <a href="/" class="nav-link active">Privacy</a>
  <a href="https://cyberqrgai.com/trust/" class="nav-link">Trust</a>
</nav>
```

## ⚙️ Step 4: Cloudflare Workers (Optional - For Dynamic Features)

If you need dynamic features later, create Workers:

### API Worker (api.cyberqrgai.com)
```javascript
// Example Worker for future API endpoints
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Route to appropriate app or API
    if (url.pathname.startsWith('/api/web')) {
      // Handle web app API calls
    } else if (url.pathname.startsWith('/api/sentinel')) {
      // Handle sentinel API calls
    } else if (url.pathname.startsWith('/api/privacy')) {
      // Handle privacy API calls
    }

    return new Response('API endpoint', { status: 200 });
  },
};
```

## 🔒 Step 5: Security & Performance

### Enable Cloudflare Security Features
1. **SSL/TLS:** Full (strict)
2. **Always Use HTTPS:** On
3. **Security Level:** Medium
4. **Bot Management:** On
5. **Rate Limiting:** Configure as needed

### Performance Optimizations
1. **Auto Minify:** Enable for HTML, CSS, JS
2. **Brotli Compression:** Enable
3. **Caching:** Browser Cache TTL: 1 year for static assets
4. **Image Optimization:** Enable Mirage

## 📊 Step 6: Monitoring & Analytics

### Cloudflare Analytics
- Real-time visitor analytics
- Performance metrics
- Security events

### Custom Analytics (Optional)
Add to each app's `<head>`:
```html
<!-- Add your analytics code here -->
```

## 🚀 Step 7: DNS Configuration

Ensure your domains point to Cloudflare:
1. **cyberqrgai.com** → Cloudflare Pages
2. **sentinel.cyberqrgai.com** → Cloudflare Pages
3. **privacy.cyberqrgai.com** → Cloudflare Pages

## ✅ Step 8: Verification

After deployment, verify:
1. All sites load correctly
2. Navigation works between apps
3. HTTPS certificates are valid
4. Security headers are present
5. Performance is optimized

## 🔄 Step 9: Future Updates

### Deployment Workflow
```bash
# Make changes locally
git add .
git commit -m "Update: [description]"
git push origin main
# Cloudflare Pages auto-deploys
```

### Rollback (if needed)
- Use Cloudflare Pages deployment history
- Or revert Git commits and push

## 📞 Support
- Cloudflare Pages: https://developers.cloudflare.com/pages/
- GitHub: https://docs.github.com/

---
**Deployment Date:** January 19, 2026
**Status:** Ready for production deployment</content>
<parameter name="filePath">/Users/michaelhoch/Library/Mobile Documents/com~apple~CloudDocs/CyberQRG-Rebuild/CLOUDFLARE_DEPLOYMENT.md