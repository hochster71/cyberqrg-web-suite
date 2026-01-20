# CyberQRG Master Operations Runbook

## Overview
This runbook provides comprehensive operational procedures for maintaining, deploying, and scaling the CyberQRG web suite. The suite consists of three applications deployed to Cloudflare Pages with automated verification and security controls.

## Architecture
- **Monorepo Structure**: Single repository with shared design system
- **Three Applications**:
  - `cyberqrgai.com` (main web app)
  - `sentinel.cyberqrgai.com` (threat detection)
  - `privacy.cyberqrgai.com` (privacy tools)
- **Deployment**: Cloudflare Pages with _redirects and _headers
- **Verification**: Automated link checking, security validation, theme compliance

## Daily Operations

### Health Checks
```bash
# Run verification suite
npm run verify

# Check all apps load correctly
curl -I https://cyberqrgai.com
curl -I https://sentinel.cyberqrgai.com
curl -I https://privacy.cyberqrgai.com
```

### Content Updates
1. Make changes to HTML/CSS/JS files
2. Run verification: `npm run verify`
3. If passing, commit and push
4. Cloudflare Pages auto-deploys on push

### Security Monitoring
- Monitor CSP violation reports
- Review _headers for new security headers
- Update dependencies quarterly
- Run security scans monthly

## Emergency Procedures

### Broken Links Detected
1. Run `npm run verify` to identify issues
2. Check _redirects files for missing routes
3. Update HTML links or add redirects
4. Re-verify and deploy

### Security Incident
1. Assess impact across all three domains
2. Update _headers with additional security measures
3. Implement emergency redirects if needed
4. Notify stakeholders and document incident

### Deployment Failure
1. Check Cloudflare Pages build logs
2. Verify _redirects and _headers syntax
3. Test locally with `python3 -m http.server`
4. Rollback to previous commit if needed

## Maintenance Procedures

### Monthly Tasks
- Review and update security headers
- Check for broken external links
- Update shared design system components
- Archive old verification logs

### Quarterly Tasks
- Full security audit of all applications
- Performance optimization review
- Accessibility compliance check
- Dependency updates and testing

### Annual Tasks
- Complete redesign evaluation
- Technology stack assessment
- Compliance certification renewal
- Disaster recovery testing

## Contact Information
- **Technical Lead**: Owner
- **Security Issues**: Report via trust pages
- **General Support**: owner@cyberqrgai.com

## References
- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages)
- [Security Headers Reference](https://owasp.org/www-project-secure-headers/)
- [CSP Guidelines](https://content-security-policy.com/)