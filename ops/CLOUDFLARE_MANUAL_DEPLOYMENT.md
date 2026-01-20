# Cloudflare Pages Manual Deployment Guide

## Prerequisites
- GitHub repository with CyberQRG codebase
- Cloudflare account with Pages enabled
- Three domains configured:
  - `cyberqrgai.com`
  - `sentinel.cyberqrgai.com`
  - `privacy.cyberqrgai.com`

## Deployment Steps

### 1. Connect Repository
1. Log into Cloudflare Dashboard
2. Navigate to Pages
3. Click "Create a project"
4. Select "Connect to Git"
5. Choose your GitHub repository
6. Configure build settings:
   - **Build command**: (leave empty - static site)
   - **Build output directory**: `apps/web/public` (for main site)
   - **Root directory**: `/` (leave default)

### 2. Deploy Main Site (cyberqrgai.com)
1. Create project with output directory: `apps/web/public`
2. Add custom domain: `cyberqrgai.com`
3. Configure DNS records as instructed
4. Deploy

### 3. Deploy Sentinel (sentinel.cyberqrgai.com)
1. Create second project with output directory: `apps/sentinel/public`
2. Add custom domain: `sentinel.cyberqrgai.com`
3. Configure DNS records
4. Deploy

### 4. Deploy Privacy (privacy.cyberqrgai.com)
1. Create third project with output directory: `apps/privacy/public`
2. Add custom domain: `privacy.cyberqrgai.com`
3. Configure DNS records
4. Deploy

## Configuration Files

### _redirects (Required)
Each app has its own `_redirects` file in the `public/` directory:

**apps/web/public/_redirects:**
```
/trust/*  /trust/:splat.html  200
/terms     /trust/terms.html  200
/privacy   /trust/privacy.html  200
/status    /trust/status.html  200
/security  /trust/security.html  200
/sentinel/*  https://sentinel.cyberqrgai.com/:splat  200
/privacy/*   https://privacy.cyberqrgai.com/:splat  200
```

**apps/sentinel/public/_redirects:**
```
/trust/*  https://cyberqrgai.com/trust/:splat  200
/*        https://cyberqrgai.com/sentinel/:splat  200
```

**apps/privacy/public/_redirects:**
```
/trust/*  https://cyberqrgai.com/trust/:splat  200
/*        https://cyberqrgai.com/privacy/:splat  200
```

### _headers (Required)
Each app has security headers in `_headers` file:

```
# CyberQRG Security Headers
/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: accelerometer=(), ...
  Content-Security-Policy: default-src 'self'; ...
```

## Verification

### Pre-Deployment Checks
```bash
# Run verification suite
npm run verify

# Test locally
cd apps/web/public && python3 -m http.server 8000
cd apps/sentinel/public && python3 -m http.server 8001
cd apps/privacy/public && python3 -m http.server 8002
```

### Post-Deployment Checks
```bash
# Test all domains
curl -I https://cyberqrgai.com
curl -I https://sentinel.cyberqrgai.com
curl -I https://privacy.cyberqrgai.com

# Test redirects
curl -I https://cyberqrgai.com/trust/
curl -I https://sentinel.cyberqrgai.com/trust/
```

## Troubleshooting

### Build Failures
- Check that output directories exist
- Verify _redirects and _headers syntax
- Ensure no external dependencies

### Redirect Issues
- Verify _redirects file is in correct location
- Check Cloudflare Pages build logs
- Test redirects locally first

### Domain Issues
- Confirm DNS records are correct
- Check SSL certificate status
- Verify domain ownership

## Rollback Procedure
1. Go to Cloudflare Pages project
2. Navigate to "Deployments" tab
3. Find previous working deployment
4. Click "Rollback" button
5. Verify site functionality