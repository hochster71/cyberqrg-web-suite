#!/bin/bash

# CyberQRG Web Suite - Cloudflare Pages Deployment Helper
# This script provides commands and checks for deployment

echo "🚀 CyberQRG Web Suite - Cloudflare Pages Deployment Helper"
echo "========================================================"
echo ""

echo "📋 Current Repository Status:"
echo "GitHub: https://github.com/hochster71/cyberqrg-web-suite"
echo "Branch: main"
echo ""

echo "🔧 Required Cloudflare Pages Configuration:"
echo ""
echo "For EACH app, set these build settings:"
echo "- Build command: (leave completely empty)"
echo "- Build output directory: apps/[app-name]/public"
echo "- Root directory: (leave empty)"
echo ""

echo "📁 App Configurations:"
echo "1. Web App: apps/web/public → cyberqrgai.com"
echo "2. Sentinel App: apps/sentinel/public → sentinel.cyberqrgai.com"
echo "3. Privacy App: apps/privacy/public → privacy.cyberqrgai.com"
echo ""

echo "✅ Verification Commands:"
echo "curl -s https://cyberqrgai.com/ | head -5"
echo "curl -s https://sentinel.cyberqrgai.com/ | head -5"
echo "curl -s https://privacy.cyberqrgai.com/ | head -5"
echo ""

echo "🔒 Security Settings to Enable:"
echo "- SSL/TLS: Full (strict)"
echo "- Always Use HTTPS: On"
echo "- Auto Minify: HTML, CSS, JS"
echo "- Brotli Compression: On"
echo ""

echo "📝 Next Steps:"
echo "1. Go to https://dash.cloudflare.com/pages"
echo "2. Create 3 separate projects"
echo "3. Connect to: hochster71/cyberqrg-web-suite"
echo "4. Use build settings shown above"
echo "5. Add custom domains"
echo "6. Enable security features"
echo ""

echo "🎉 Ready for deployment!"