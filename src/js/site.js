/* ============================================
   site.js — ESD Diploma Website
   Nav, scroll effects, animations, utilities
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Init Lucide icons
  if (window.lucide) lucide.createIcons();

  // --- Mobile Nav Toggle ---
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const isOpen = navLinks.classList.contains('open');
      navToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close nav on link click (mobile)
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
      });
    });

    // Close nav on outside click
    document.addEventListener('click', (e) => {
      if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('open');
      }
    });
  }

  // --- Navbar Glass Effect on Scroll ---
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const onScroll = () => {
      if (window.scrollY > 20) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // --- Back to Top Button ---
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }, { passive: true });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- IntersectionObserver: Fade-In Animations ---
  const fadeEls = document.querySelectorAll('.fade-in');
  if (fadeEls.length > 0 && 'IntersectionObserver' in window) {
    const fadeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          fadeObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    fadeEls.forEach(el => fadeObserver.observe(el));
  }

  // --- Screenshot Gallery Modal ---
  const galleryCards = Array.from(document.querySelectorAll('[data-gallery-index]'));
  const galleryModal = document.getElementById('galleryModal');
  const galleryImage = document.getElementById('galleryImage');
  const galleryCaption = document.getElementById('galleryCaption');
  const galleryCount = document.getElementById('galleryCount');
  const galleryPrev = document.getElementById('galleryPrev');
  const galleryNext = document.getElementById('galleryNext');
  const galleryClose = document.getElementById('galleryClose');
  let activeGalleryIndex = 0;

  if (
    galleryCards.length > 0 &&
    galleryModal &&
    galleryImage &&
    galleryCaption &&
    galleryCount &&
    galleryPrev &&
    galleryNext &&
    galleryClose
  ) {
    const galleryItems = galleryCards.map(card => {
      const image = card.querySelector('img');
      const caption = card.querySelector('figcaption');
      return {
        src: image?.getAttribute('src') || '',
        alt: image?.getAttribute('alt') || '',
        caption: caption?.textContent?.trim() || image?.getAttribute('alt') || ''
      };
    });

    const renderGalleryItem = (index) => {
      const normalizedIndex = (index + galleryItems.length) % galleryItems.length;
      const item = galleryItems[normalizedIndex];
      activeGalleryIndex = normalizedIndex;
      galleryImage.src = item.src;
      galleryImage.alt = item.alt;
      galleryCaption.textContent = item.caption;
      galleryCount.textContent = `${normalizedIndex + 1} / ${galleryItems.length}`;
    };

    const openGallery = (index) => {
      renderGalleryItem(index);
      galleryModal.hidden = false;
      document.body.classList.add('gallery-open');
    };

    const closeGallery = () => {
      galleryModal.hidden = true;
      document.body.classList.remove('gallery-open');
      galleryImage.src = '';
    };

    galleryCards.forEach((card, index) => {
      card.addEventListener('click', () => openGallery(index));
      card.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openGallery(index);
        }
      });
    });

    galleryPrev.addEventListener('click', () => renderGalleryItem(activeGalleryIndex - 1));
    galleryNext.addEventListener('click', () => renderGalleryItem(activeGalleryIndex + 1));
    galleryClose.addEventListener('click', closeGallery);

    galleryModal.querySelectorAll('[data-gallery-close]').forEach(el => {
      el.addEventListener('click', closeGallery);
    });

    document.addEventListener('keydown', (event) => {
      if (galleryModal.hidden) return;

      if (event.key === 'Escape') {
        closeGallery();
      } else if (event.key === 'ArrowLeft') {
        renderGalleryItem(activeGalleryIndex - 1);
      } else if (event.key === 'ArrowRight') {
        renderGalleryItem(activeGalleryIndex + 1);
      }
    });
  }

  // --- Charts Page: Sidebar Active State ---
  const sidebarNav = document.getElementById('sidebarNav');
  if (sidebarNav) {
    const sidebarLinks = sidebarNav.querySelectorAll('a');
    const sections = [];

    sidebarLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        const target = document.getElementById(href.substring(1));
        if (target) sections.push({ link, target });
      }
    });

    if (sections.length > 0) {
      const updateActive = () => {
        const scrollPos = window.scrollY + 160;

        let currentSection = sections[0];
        for (const s of sections) {
          if (s.target.offsetTop <= scrollPos) {
            currentSection = s;
          }
        }

        sidebarLinks.forEach(l => l.classList.remove('active'));
        if (currentSection) {
          currentSection.link.classList.add('active');
        }
      };

      window.addEventListener('scroll', updateActive, { passive: true });
      updateActive();
    }
  }

  // --- Smooth scroll for all anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
});
