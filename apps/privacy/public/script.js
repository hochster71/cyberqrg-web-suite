// CyberQRG Privacy App - Main Script
// ESNext module with privacy-specific functionality

import { init, scrollToElement } from './utils.js';

// Initialize shared utilities
init();

// Privacy-specific functionality
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

  // Animate tool cards on scroll
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

  // Hero animations
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

  // Privacy compliance status simulation
  const statusIndicators = document.querySelectorAll('.status-indicator');
  statusIndicators.forEach(indicator => {
    if (indicator.classList.contains('status-online')) {
      indicator.style.animation = 'gentle-pulse 3s infinite';
    }
  });

  // Add CSS animation for gentle pulse
  const style = document.createElement('style');
  style.textContent = `
    @keyframes gentle-pulse {
      0% { opacity: 1; }
      50% { opacity: 0.8; }
      100% { opacity: 1; }
    }
  `;
  document.head.appendChild(style);

  // Simulate privacy assessment progress (for demo)
  const assessmentCard = document.querySelector('#assessment .card');
  if (assessmentCard) {
    // Add subtle loading animation to indicate active assessment
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
      height: 2px;
      background: linear-gradient(90deg, transparent, var(--color-accent-success), transparent);
      animation: progress 2s infinite;
      margin-top: var(--spacing-md);
    `;

    const progressStyle = document.createElement('style');
    progressStyle.textContent = `
      @keyframes progress {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }
    `;

    assessmentCard.appendChild(progressBar);
    document.head.appendChild(progressStyle);
  }
});