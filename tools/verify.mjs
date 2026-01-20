#!/usr/bin/env node

/**
 * CyberQRG Verification Tool
 * Validates the production-ready web suite for:
 * - Broken links and routes
 * - Dark-only theme enforcement
 * - No external dependencies
 * - Security headers presence
 * - Cloudflare Pages compatibility
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, extname, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = join(__dirname, '..');
const APPS_DIR = join(ROOT_DIR, 'apps');

const ERRORS = [];
const WARNINGS = [];

// Colors for console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(color, message) {
  console.log(`${color}${message}${colors.reset}`);
}

function error(message) {
  ERRORS.push(message);
  log(colors.red, `❌ ${message}`);
}

function warning(message) {
  WARNINGS.push(message);
  log(colors.yellow, `⚠️  ${message}`);
}

function success(message) {
  log(colors.green, `✅ ${message}`);
}

function info(message) {
  log(colors.blue, `ℹ️  ${message}`);
}

// Check if file exists and is readable
function fileExists(path) {
  try {
    statSync(path);
    return true;
  } catch {
    return false;
  }
}

// Extract links from HTML content
function extractLinks(content, filePath) {
  const links = [];
  const linkRegex = /href=["']([^"']+)["']/g;
  const srcRegex = /src=["']([^"']+)["']/g;

  let match;
  while ((match = linkRegex.exec(content)) !== null) {
    links.push({ href: match[1], line: getLineNumber(content, match.index) });
  }
  while ((match = srcRegex.exec(content)) !== null) {
    links.push({ src: match[1], line: getLineNumber(content, match.index) });
  }

  return links;
}

// Get line number from character position
function getLineNumber(content, charIndex) {
  return content.substring(0, charIndex).split('\n').length;
}

// Validate internal links
function validateInternalLink(link, filePath, appName) {
  const appDir = join(APPS_DIR, appName, 'public');

  // Skip external links
  if (link.href?.startsWith('http') || link.src?.startsWith('http')) {
    return;
  }

  // Skip anchor links
  if (link.href?.startsWith('#')) {
    return;
  }

  // Skip mailto/tel links
  if (link.href?.startsWith('mailto:') || link.href?.startsWith('tel:')) {
    return;
  }

  const targetPath = link.href || link.src;
  if (!targetPath) return;

  // Check for cross-app redirects and trust routes
  if (targetPath.startsWith('/sentinel/') || targetPath.startsWith('/privacy/')) {
    // These are handled by _redirects, so they're valid
    return;
  }

  // Trust routes - for sentinel and privacy, these redirect to main site
  if (targetPath.startsWith('/trust/') && (appName === 'sentinel' || appName === 'privacy')) {
    // These redirect to the main site, so they're valid
    return;
  }

  // Trust routes - for web app, these redirect to .html files
  if (targetPath.startsWith('/trust/') && appName === 'web') {
    const htmlPath = targetPath.replace(/\/$/, '') + '.html';
    const fullHtmlPath = join(appDir, htmlPath.substring(1));
    if (fileExists(fullHtmlPath)) {
      return; // Valid redirect
    }
  }

  // Resolve relative paths
  let fullPath;
  if (targetPath.startsWith('/')) {
    fullPath = join(appDir, targetPath.substring(1));
  } else {
    fullPath = join(dirname(filePath), targetPath);
  }

  // Check if target exists
  if (!fileExists(fullPath)) {
    const line = link.href ? link.line : 'unknown';
    error(`Broken link in ${filePath}: ${targetPath} (line ${line})`);
  }
}

// Check for dark-only theme compliance
function checkDarkTheme(content, filePath) {
  // Check for light theme colors
  const lightColors = [
    /color:\s*white/i,
    /background-color:\s*white/i,
    /background:\s*white/i,
    /color:\s*#fff/i,
    /background-color:\s*#fff/i,
    /background:\s*#fff/i
  ];

  for (const pattern of lightColors) {
    if (pattern.test(content)) {
      warning(`Potential light theme color in ${filePath}: ${pattern.source}`);
    }
  }
}

// Check for external dependencies
function checkExternalDeps(content, filePath) {
  const externalPatterns = [
    /https?:\/\/(?!localhost|127\.0\.0\.1|cyberqrgai\.com|sentinel\.cyberqrgai\.com|privacy\.cyberqrgai\.com)/i,
    /cdn\./i,
    /googleapis\.com/i,
    /bootstrapcdn\.com/i,
    /jquery\.com/i,
    /cdnjs\.com/i
  ];

  for (const pattern of externalPatterns) {
    if (pattern.test(content)) {
      error(`External dependency found in ${filePath}: ${pattern.source}`);
    }
  }
}

// Validate _headers file
function validateHeaders(appName) {
  const headersPath = join(APPS_DIR, appName, 'public', '_headers');
  if (!fileExists(headersPath)) {
    error(`Missing _headers file in ${appName}`);
    return;
  }

  const content = readFileSync(headersPath, 'utf8');

  // Check for required security headers
  const requiredHeaders = [
    'X-Content-Type-Options: nosniff',
    'X-Frame-Options: DENY',
    'Referrer-Policy: strict-origin-when-cross-origin'
  ];

  for (const header of requiredHeaders) {
    if (!content.includes(header)) {
      error(`Missing security header in ${appName}/_headers: ${header}`);
    }
  }

  // Check CSP
  if (!content.includes("Content-Security-Policy")) {
    error(`Missing Content-Security-Policy in ${appName}/_headers`);
  }
}

// Validate _redirects file
function validateRedirects(appName) {
  const redirectsPath = join(APPS_DIR, appName, 'public', '_redirects');
  if (!fileExists(redirectsPath)) {
    error(`Missing _redirects file in ${appName}`);
    return;
  }

  const content = readFileSync(redirectsPath, 'utf8');

  // Check for basic redirect structure
  if (!content.trim()) {
    error(`Empty _redirects file in ${appName}`);
  }
}

// Process HTML files
function processHtmlFile(filePath, appName) {
  try {
    const content = readFileSync(filePath, 'utf8');

    // Extract and validate links
    const links = extractLinks(content, filePath);
    links.forEach(link => validateInternalLink(link, filePath, appName));

    // Check theme compliance
    checkDarkTheme(content, filePath);

    // Check external dependencies
    checkExternalDeps(content, filePath);

  } catch (err) {
    error(`Failed to process ${filePath}: ${err.message}`);
  }
}

// Process CSS files
function processCssFile(filePath) {
  try {
    const content = readFileSync(filePath, 'utf8');

    // Check theme compliance
    checkDarkTheme(content, filePath);

    // Check external dependencies
    checkExternalDeps(content, filePath);

  } catch (err) {
    error(`Failed to process ${filePath}: ${err.message}`);
  }
}

// Recursively process directory
function processDirectory(dirPath, appName) {
  const items = readdirSync(dirPath);

  for (const item of items) {
    const fullPath = join(dirPath, item);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      // Skip certain directories
      if (!['node_modules', '.git', 'dist', 'build'].includes(item)) {
        processDirectory(fullPath, appName);
      }
    } else {
      const ext = extname(item).toLowerCase();

      if (['.html', '.htm'].includes(ext)) {
        processHtmlFile(fullPath, appName);
      } else if (ext === '.css') {
        processCssFile(fullPath);
      }
    }
  }
}

// Main validation function
function validate() {
  info('Starting CyberQRG verification...');

  // Get all apps
  const apps = readdirSync(APPS_DIR).filter(item => {
    const path = join(APPS_DIR, item);
    return statSync(path).isDirectory() && item !== 'shared';
  });

  for (const appName of apps) {
    info(`\nValidating ${appName}...`);

    const appPath = join(APPS_DIR, appName, 'public');

    if (!fileExists(appPath)) {
      error(`Missing public directory for ${appName}`);
      continue;
    }

    // Validate Cloudflare Pages files
    validateHeaders(appName);
    validateRedirects(appName);

    // Process all files
    processDirectory(appPath, appName);
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  info('Verification complete!');

  if (ERRORS.length === 0 && WARNINGS.length === 0) {
    success('All checks passed! 🎉');
    process.exit(0);
  } else {
    if (ERRORS.length > 0) {
      log(colors.red, `\n${ERRORS.length} error(s) found:`);
      ERRORS.forEach(err => console.log(`  ${err}`));
    }

    if (WARNINGS.length > 0) {
      log(colors.yellow, `\n${WARNINGS.length} warning(s) found:`);
      WARNINGS.forEach(warn => console.log(`  ${warn}`));
    }

    process.exit(ERRORS.length > 0 ? 1 : 0);
  }
}

// Run validation
validate();