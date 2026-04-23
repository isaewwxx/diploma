document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) lucide.createIcons();
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const isOpen = navLinks.classList.contains('open');
      navToggle.setAttribute('aria-expanded', isOpen);
    });
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
      });
    });
    document.addEventListener('click', (e) => {
      if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('open');
      }
    });
  }
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
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    const svgNS = 'http://www.w3.org/2000/svg';
    const BTN = 44;
    const RING = 56;
    const R = (RING / 2) - 3.5;
    const CIRC = 2 * Math.PI * R;

    const ring = document.createElementNS(svgNS, 'svg');
    ring.setAttribute('class', 'back-to-top-ring');
    ring.setAttribute('width', RING);
    ring.setAttribute('height', RING);
    ring.setAttribute('viewBox', `0 0 ${RING} ${RING}`);
    ring.setAttribute('aria-hidden', 'true');

    const track = document.createElementNS(svgNS, 'circle');
    track.setAttribute('class', 'back-to-top-ring-track');
    track.setAttribute('cx', RING / 2);
    track.setAttribute('cy', RING / 2);
    track.setAttribute('r', R);
    track.setAttribute('fill', 'none');
    track.setAttribute('stroke', 'rgba(255,255,255,0.06)');
    track.setAttribute('stroke-width', '2.5');

    const progress = document.createElementNS(svgNS, 'circle');
    progress.setAttribute('class', 'back-to-top-ring-progress');
    progress.setAttribute('cx', RING / 2);
    progress.setAttribute('cy', RING / 2);
    progress.setAttribute('r', R);
    progress.setAttribute('fill', 'none');
    progress.setAttribute('stroke', '#6366f1');
    progress.setAttribute('stroke-width', '2.5');
    progress.setAttribute('stroke-linecap', 'round');
    progress.setAttribute('stroke-dasharray', CIRC);
    progress.setAttribute('stroke-dashoffset', CIRC);

    ring.appendChild(track);
    ring.appendChild(progress);
    backToTop.appendChild(ring);

    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docScrollable = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docScrollable > 0 ? Math.min(1, scrollTop / docScrollable) : 0;
      progress.setAttribute('stroke-dashoffset', CIRC * (1 - pct));
      if (scrollTop > 500) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    };

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
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
  const galleryCards = Array.from(document.querySelectorAll('[data-gallery-index]'));
  const galleryModal = document.getElementById('galleryModal');
  const galleryImage = document.getElementById('galleryImage');
  const galleryCaption = document.getElementById('galleryCaption');
  const galleryCount = document.getElementById('galleryCount');
  const galleryPrev = document.getElementById('galleryPrev');
  const galleryNext = document.getElementById('galleryNext');
  const galleryClose = document.getElementById('galleryClose');
  const gallerySource = document.getElementById('gallerySource');
  let activeGalleryIndex = 0;

  if (
    galleryCards.length > 0 &&
    galleryModal &&
    galleryImage &&
    galleryCaption &&
    galleryCount &&
    galleryPrev &&
    galleryNext &&
    galleryClose &&
    gallerySource
  ) {
    const galleryItems = galleryCards.map(card => {
      const image = card.querySelector('img');
      const caption = card.querySelector('figcaption');
      return {
        src: image?.getAttribute('src') || '',
        alt: image?.getAttribute('alt') || '',
        caption: caption?.textContent?.trim() || image?.getAttribute('alt') || '',
        source: card.getAttribute('data-source') || ''
      };
    });

    const setContent = (item, countText) => {
      galleryCaption.textContent = item.caption;
      gallerySource.textContent = item.source ? `Източник: ${item.source}` : '';
      galleryCount.textContent = countText;
    };

    const renderGalleryItem = (index, animate = true) => {
      const normalizedIndex = (index + galleryItems.length) % galleryItems.length;
      const item = galleryItems[normalizedIndex];
      activeGalleryIndex = normalizedIndex;
      const countText = `${normalizedIndex + 1} / ${galleryItems.length}`;

      if (animate && galleryModal.classList.contains('is-open')) {
        galleryImage.classList.remove('is-entering');
        void galleryImage.offsetWidth;
        galleryImage.src = item.src;
        galleryImage.alt = item.alt;
        galleryImage.classList.add('is-entering');
        setContent(item, countText);
      } else {
        galleryImage.src = item.src;
        galleryImage.alt = item.alt;
        setContent(item, countText);
      }
    };

    const openGallery = (index) => {
      renderGalleryItem(index, false);
      galleryModal.classList.add('is-open');
      document.body.classList.add('gallery-open');
    };

    const closeGallery = () => {
      galleryModal.classList.remove('is-open');
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
      if (!galleryModal.classList.contains('is-open')) return;

      if (event.key === 'Escape') {
        closeGallery();
      } else if (event.key === 'ArrowLeft') {
        renderGalleryItem(activeGalleryIndex - 1);
      } else if (event.key === 'ArrowRight') {
        renderGalleryItem(activeGalleryIndex + 1);
      }
    });
  }
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
