// CyberQRG Sentinel App - Main Script
// ESNext module with monitoring-specific functionality

import { init, scrollToElement, isInViewport } from './utils.js';

// Initialize shared utilities
init();

// Sentinel-specific functionality
document.addEventListener('DOMContentLoaded', () => {
  // Smooth scrolling for anchor links
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = link.getAttribute('href');
      scrollToElement(target);
    });
  });

  // Animate feature cards on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  const cards = document.querySelectorAll('.persona-card, .trust-link, .card');
  cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
  });

  // Hero animations with staggered timing
  const heroTitle = document.querySelector('.hero-title');
  const heroSubtitle = document.querySelector('.hero-subtitle');
  const heroActions = document.querySelector('.hero-actions');

  if (heroTitle) {
    heroTitle.style.opacity = '0';
    heroTitle.style.transform = 'translateY(30px)';
    heroTitle.style.transition = 'opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s';

    setTimeout(() => {
      heroTitle.style.opacity = '1';
      heroTitle.style.transform = 'translateY(0)';
    }, 100);
  }

  if (heroSubtitle) {
    heroSubtitle.style.opacity = '0';
    heroSubtitle.style.transform = 'translateY(30px)';
    heroSubtitle.style.transition = 'opacity 0.8s ease 0.4s, transform 0.8s ease 0.4s';

    setTimeout(() => {
      heroSubtitle.style.opacity = '1';
      heroSubtitle.style.transform = 'translateY(0)';
    }, 300);
  }

  if (heroActions) {
    heroActions.style.opacity = '0';
    heroActions.style.transform = 'translateY(30px)';
    heroActions.style.transition = 'opacity 0.8s ease 0.6s, transform 0.8s ease 0.6s';

    setTimeout(() => {
      heroActions.style.opacity = '1';
      heroActions.style.transform = 'translateY(0)';
    }, 500);
  }

  // Simulate real-time status updates (for demo purposes)
  const statusIndicators = document.querySelectorAll('.status-indicator');
  statusIndicators.forEach(indicator => {
    // Add subtle pulse animation to online indicators
    if (indicator.classList.contains('status-online')) {
      indicator.style.animation = 'pulse 2s infinite';
    }
  });

  // Add CSS animation for pulse
  const style = document.createElement('style');
  style.textContent = `
    @keyframes pulse {
      0% { opacity: 1; }
      50% { opacity: 0.7; }
      100% { opacity: 1; }
    }
  `;
  document.head.appendChild(style);
});