/* script.js - Enhanced Version
   - Builds category grid from provided Product_images filenames
   - Opens a paginated Swiper lightbox (flipbook-style) for each category
   - Smooth scrolling / mobile nav collapse / contact form basic handling
   - Performance: images use loading="lazy" and decoding="async"
   - Enhanced with better error handling, UX, and performance
*/

/* ============================
   Product image filenames (exact as uploaded)
   ============================ */
const PRODUCT_FILES = [
  'Adhesive wound dressing pads.jpg',
  'Apron polythene disposable_.jpg',
  'Autoclave tape 3_4 inch.jpg',
  'Autoclave tape_(1).jpg',
  'Autoclave tape_.jpg',
  'Chest drainage tubes with trocar.jpg',
  'Closed wound drainage set_bottle_portovac_surgivac.jpg',
  'Closed wound drainage set_portovac.png',
  'Disposable gowns.webp',
  'Disposable nurse caps.jpg',
  'Disposable nylon aprons.jpg',
  'Endo-tracheal tube plain.jpg',
  'Endo-tracheal tubes cuffed_(1).jpg',
  'Endo-tracheal tubes cuffed_.jpg',
  'Endo-tracheal tubes oral plain_uncuffed.jpg',
  'Endo-tracheal tubes_.png',
  'Gastrostomy feeding tubes Fr18, Fr24_.jpg',
  'Gastrostomy feeding tubes_.png',
  'Gauze roll 1.5kgs',
  'Nasal twin cannula_(1).jpg',
  'Nasal twin cannula_.jpg',
  'Nasal twin cannula_Nasal prongs.jpg',
  'Nebulizer mask adult, child, infant.jpg',
  'Nebulizer mask adult.jpg',
  'Nebulizer masks.png',
  'Non-rebreather Oxygen mask with rebreathing bag.jpg',
  'Nylon surgical sutures.jpg',
  'Oxygen mask non-rebreather high flow.webp',
  'Oxygen mask non-rebreather_.jpg',
  'Oxygen masks adult, child, infant.jpg',
  'Oxygen masks.jpg',
  'Polyglactin_Vicryl surgical sutures_.webp',
  'Reinforced gowns for theatre_.png',
  'Reinforced surgical gowns full pack.jpg',
  'Reinforced surgical gowns.png',
  'Suction catheter_.jpg',
  'Suction catheters.webp',
  'Suction tubes_catheters with thumb control and knob.webp',
  'Surgical gowns_nylon.jpg',
  'Thoracic catheter with trocar_chest drainage tubes.jpg',
  'Wound drainage set closed.webp',
  'Wound dressing pads adhesive.png',
  'Yankuer suction kit handle and connecting tube.png',
  'Yankuer suction set.jpg'
];

/* Enhanced category mapping with better logic */
function mapCategory(filename) {
  const f = filename.toLowerCase();
  
  // Define category patterns with priority
  const categories = [
    { 
      name: 'Diagnostic Kits', 
      patterns: [/rapid.*test|rdt|diagnostic|covid|malaria|hiv|pregnancy|urinalysis/i] 
    },
    { 
      name: 'Laboratory Equipment', 
      patterns: [/autoclave|microscope|centrifuge|pipette|test.*tube|blood.*tube|reagent|elisa|incubator/i] 
    },
    { 
      name: 'Surgical Supplies', 
      patterns: [/suture|scalpel|forceps|surgical.*gown|drape|sterile/i] 
    },
    { 
      name: 'Respiratory Care', 
      patterns: [/oxygen.*mask|nebulizer|nasal.*cannula|endotracheal|tracheostomy/i] 
    },
    { 
      name: 'Wound Care', 
      patterns: [/dressing|gauze|bandage|wound|drainage|catheter|suction/i] 
    },
    { 
      name: 'Patient Care', 
      patterns: [/apron|gown|glove|mask|linen|patient.*care|hospital/i] 
    },
    { 
      name: 'Pharmaceutical Supplies', 
      patterns: [/pharma|drug|tablet|capsule|injection|syringe|medication/i] 
    }
  ];

  for (const category of categories) {
    if (category.patterns.some(pattern => pattern.test(f))) {
      return category.name;
    }
  }

  return 'Medical Consumables';
}

/* Group files by category */
function groupByCategory(files) {
  const groups = {};
  files.forEach(fn => {
    const cat = mapCategory(fn);
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(fn);
  });
  return groups;
}

/* Enhanced image path function with better error handling */
function imagePath(fn) {
  // Clean filename and encode properly
  const cleanFn = fn.trim().replace(/\s+/g, ' ');
  return `assets/Product_images/${encodeURIComponent(cleanFn)}`;
}

/* Preload critical first images */
function preloadCriticalImages() {
  const groups = groupByCategory(PRODUCT_FILES);
  Object.keys(groups).slice(0, 3).forEach(cat => {
    const firstImage = groups[cat][0];
    if (firstImage) {
      const img = new Image();
      img.src = imagePath(firstImage);
    }
  });
}

/* Category grid cache */
let categoryCache = null;

/* Enhanced grid building with performance optimizations */
function buildCategoryGrid() {
  const container = document.getElementById('categoryGrid');
  
  if (!container) {
    console.error('Category grid container not found');
    return;
  }

  // Show loading state
  container.innerHTML = `
    <div class="col-12 text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading products...</span>
      </div>
      <p class="mt-2 text-muted">Loading our product catalog...</p>
    </div>
  `;

  // Use cached data if available
  if (categoryCache) {
    renderCategoryGrid(container, categoryCache);
    return;
  }

  // Process in chunks for better performance
  setTimeout(() => {
    try {
      const groups = groupByCategory(PRODUCT_FILES);
      categoryCache = groups;
      renderCategoryGrid(container, groups);
    } catch (error) {
      console.error('Error building category grid:', error);
      showErrorState(container, error);
    }
  }, 50);
}

function renderCategoryGrid(container, groups) {
  container.innerHTML = '';

  // Sort categories by product count (descending)
  const sortedCategories = Object.keys(groups).sort((a, b) => groups[b].length - groups[a].length);

  sortedCategories.forEach(cat => {
    const first = groups[cat][0] || '';
    const thumbSrc = first ? imagePath(first) : 'https://placehold.co/400x300/0077b6/white?text=Medical+Supplies';

    const card = document.createElement('article');
    card.className = 'category-card';
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `View ${cat} category with ${groups[cat].length} products`);
    card.setAttribute('aria-pressed', 'false');
    
    card.innerHTML = `
      <div class="thumb position-relative">
        <img 
          src="${thumbSrc}" 
          alt="${cat}" 
          loading="lazy" 
          decoding="async" 
          onerror="this.onerror=null;this.src='https://placehold.co/400x300/0077b6/white?text=Medical+Supplies'"
        >
        <div class="product-count-badge">${groups[cat].length}</div>
      </div>
      <h4 class="h6 fw-bold mt-3">${cat}</h4>
      <p class="small text-muted">${groups[cat].length} product${groups[cat].length !== 1 ? 's' : ''}</p>
    `;

    // Enhanced event handlers
    const openModal = () => {
      card.setAttribute('aria-pressed', 'true');
      openCategoryModal(cat, groups[cat]);
      // Reset after modal closes
      setTimeout(() => card.setAttribute('aria-pressed', 'false'), 300);
    };

    card.addEventListener('click', openModal);
    card.addEventListener('keydown', (e) => { 
      if (e.key === 'Enter' || e.key === ' ') { 
        e.preventDefault(); 
        openModal(); 
      } 
    });

    container.appendChild(card);
  });
}

function showErrorState(container, error) {
  container.innerHTML = `
    <div class="col-12 text-center py-5">
      <i class="bi bi-exclamation-triangle display-4 text-warning"></i>
      <h3 class="mt-3">Temporary Unavailable</h3>
      <p class="text-muted">Our product catalog is temporarily unavailable. Please refresh the page or contact us directly.</p>
      <button class="btn btn-primary mt-2" onclick="window.location.reload()">
        <i class="bi bi-arrow-clockwise me-2"></i>Refresh Page
      </button>
    </div>
  `;
}

/* Enhanced Modal with Better UX */
let modalSwiper = null;

function openCategoryModal(categoryName, files) {
  const modalEl = document.getElementById('galleryModal');
  const modalTitle = document.getElementById('modalCategoryName');
  const wrapper = modalEl.querySelector('.modal-swiper .swiper-wrapper');

  if (!modalEl || !modalTitle || !wrapper) {
    console.error('Modal elements not found');
    return;
  }

  modalTitle.textContent = categoryName;
  wrapper.innerHTML = ''; // clear existing slides

  // Add loading state
  wrapper.innerHTML = '<div class="swiper-slide"><div class="d-flex justify-content-center align-items-center" style="height: 400px;"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading images...</span></div></div></div>';

  // Destroy previous swiper if exists
  if (modalSwiper) {
    try { 
      modalSwiper.destroy(true, true); 
    } catch (err) { 
      console.warn('Swiper destroy error:', err); 
    }
    modalSwiper = null;
  }

  // Initialize Swiper first for better UX
  modalSwiper = new Swiper('.modal-swiper', {
    loop: false,
    spaceBetween: 20,
    slidesPerView: 1,
    pagination: { 
      el: '.modal-swiper .swiper-pagination', 
      clickable: true,
      type: 'fraction'
    },
    navigation: { 
      nextEl: '.modal-swiper .swiper-button-next', 
      prevEl: '.modal-swiper .swiper-button-prev' 
    },
    keyboard: { enabled: true, onlyInViewport: false },
    preloadImages: false,
    lazy: { 
      loadPrevNext: true, 
      loadPrevNextAmount: 2,
      checkInView: true 
    },
    a11y: {
      enabled: true,
      prevSlideMessage: 'Previous image',
      nextSlideMessage: 'Next image',
      firstSlideMessage: 'This is the first image',
      lastSlideMessage: 'This is the last image',
      paginationBulletMessage: 'Go to image {{index}}'
    }
  });

  // Populate slides after Swiper initialization
  setTimeout(() => {
    wrapper.innerHTML = '';
    
    files.forEach((fn, index) => {
      const slide = document.createElement('div');
      slide.className = 'swiper-slide';
      slide.setAttribute('role', 'group');
      slide.setAttribute('aria-label', `${index + 1} of ${files.length}`);
      
      const src = imagePath(fn);
      const cleanName = fn.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
      
      slide.innerHTML = `
        <div class="image-container">
          <img 
            src="${src}" 
            alt="${cleanName}" 
            class="swiper-lazy"
            loading="lazy"
            decoding="async" 
            onerror="this.onerror=null;this.src='https://placehold.co/600x400/0077b6/white?text=Image+Not+Found&font=poppins'"
          >
          <div class="swiper-lazy-preloader swiper-lazy-preloader-white"></div>
        </div>
        <div class="image-caption small text-muted mt-2 text-center">
          ${index + 1}/${files.length}: ${cleanName}
        </div>
      `;
      wrapper.appendChild(slide);
    });

    // Update Swiper
    if (modalSwiper) {
      modalSwiper.update();
      modalSwiper.lazy.load();
    }
  }, 100);

  // Show modal
  const bsModal = new bootstrap.Modal(modalEl);
  bsModal.show();

  // Focus management for accessibility
  modalEl.addEventListener('shown.bs.modal', () => {
    const closeBtn = modalEl.querySelector('.btn-close');
    if (closeBtn) closeBtn.focus();
  });

  // Cleanup on modal hide
  modalEl.addEventListener('hidden.bs.modal', () => {
    if (modalSwiper) {
      try {
        modalSwiper.destroy(true, true);
      } catch (err) {
        console.warn('Error destroying swiper:', err);
      }
      modalSwiper = null;
    }
  });
}

/* Smooth scrolling anchor links with header offset */
function initSmoothScroll() {
  const header = document.querySelector('.navbar');
  const offset = () => header ? header.offsetHeight + 8 : 72;
  
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || href === '#' || href === '#!') return;
      
      const el = document.querySelector(href);
      if (!el) return;
      
      e.preventDefault();
      const top = el.getBoundingClientRect().top + window.pageYOffset - offset();
      
      window.scrollTo({ top, behavior: 'smooth' });

      // collapse navbar on mobile if open
      const bsCollapseEl = document.querySelector('.navbar-collapse');
      if (bsCollapseEl && bsCollapseEl.classList.contains('show')) {
        const bs = bootstrap.Collapse.getInstance(bsCollapseEl) || new bootstrap.Collapse(bsCollapseEl);
        bs.hide();
      }
    });
  });
}

/* Back-to-top button behavior */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  // Initial state
  btn.style.display = 'none';
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.style.display = 'flex';
      btn.setAttribute('aria-hidden', 'false');
    } else {
      btn.style.display = 'none';
      btn.setAttribute('aria-hidden', 'true');
    }
  });
  
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Move focus to top of page for accessibility
    setTimeout(() => {
      const firstFocusable = document.querySelector('header [tabindex], header a, header button');
      if (firstFocusable) firstFocusable.focus();
    }, 500);
  });
}

/* Enhanced Contact Form with Better UX */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const alertBox = document.getElementById('formAlert');
  const submitBtn = form?.querySelector('button[type="submit"]');
  
  if (!form) return;

  // Add real-time validation
  form.addEventListener('input', (e) => {
    const target = e.target;
    if (target.name === 'email' && target.value) {
      const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(target.value);
      target.classList.toggle('is-invalid', !isValid);
      target.classList.toggle('is-valid', isValid);
    }
    
    // Basic name validation
    if (target.name === 'name' && target.value) {
      const isValid = target.value.trim().length >= 2;
      target.classList.toggle('is-invalid', !isValid);
      target.classList.toggle('is-valid', isValid);
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Basic form validation
    const name = form.querySelector('#name');
    const email = form.querySelector('#email');
    const message = form.querySelector('#message');
    
    let isValid = true;
    
    if (!name.value.trim()) {
      name.classList.add('is-invalid');
      isValid = false;
    }
    
    if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      email.classList.add('is-invalid');
      isValid = false;
    }
    
    if (!message.value.trim()) {
      message.classList.add('is-invalid');
      isValid = false;
    }
    
    if (!isValid) {
      alertBox.className = 'alert alert-danger';
      alertBox.innerHTML = '<i class="bi bi-exclamation-triangle-fill me-2"></i>Please fill in all required fields correctly.';
      alertBox.classList.remove('d-none');
      return;
    }
    
    // Show loading state
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sending...';
    submitBtn.disabled = true;
    
    alertBox.className = 'alert d-none';

    try {
      const formData = new FormData(form);
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: { 
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      });

      if (response.ok) {
        alertBox.className = 'alert alert-success';
        alertBox.innerHTML = `
          <i class="bi bi-check-circle-fill me-2"></i>
          <strong>Thank you!</strong> Your message has been sent successfully. We'll get back to you within 24 hours.
        `;
        form.reset();
        // Remove validation classes
        form.querySelectorAll('.is-valid, .is-invalid').forEach(el => {
          el.classList.remove('is-valid', 'is-invalid');
        });
      } else {
        const result = await response.json().catch(() => ({}));
        alertBox.className = 'alert alert-danger';
        alertBox.innerHTML = `
          <i class="bi bi-exclamation-triangle-fill me-2"></i>
          <strong>Error:</strong> ${result.error || 'There was an error sending your message. Please try again.'}
        `;
      }
    } catch (error) {
      console.error('Form submission error:', error);
      alertBox.className = 'alert alert-danger';
      alertBox.innerHTML = `
        <i class="bi bi-exclamation-triangle-fill me-2"></i>
        <strong>Network Error:</strong> Please check your connection and try again.
      `;
    } finally {
      // Reset button state
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      
      // Show alert
      alertBox.classList.remove('d-none');
      
      // Auto-hide success messages after 8 seconds
      if (alertBox.classList.contains('alert-success')) {
        setTimeout(() => {
          alertBox.classList.add('d-none');
        }, 8000);
      }
      
      // Scroll to alert for visibility
      alertBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });
}

/* Accessibility helpers */
function initAccessibility() {
  // Skip to main content link for screen readers
  const skipLink = document.createElement('a');
  skipLink.href = '#main';
  skipLink.className = 'skip-to-main visually-hidden-focusable';
  skipLink.textContent = 'Skip to main content';
  document.body.insertBefore(skipLink, document.body.firstChild);

  // Add main content id
  const main = document.querySelector('main');
  if (main && !main.id) {
    main.id = 'main';
  }
}

/* Robust initialization with error handling */
function initializeApp() {
  try {
    // Set year in footer
    const yearEl = document.getElementById('currentYear');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Initialize components with error handling
    const initTasks = [
      { name: 'Category Grid', fn: buildCategoryGrid },
      { name: 'Smooth Scroll', fn: initSmoothScroll },
      { name: 'Back to Top', fn: initBackToTop },
      { name: 'Contact Form', fn: initContactForm },
      { name: 'Accessibility', fn: initAccessibility },
      { name: 'Image Preloading', fn: preloadCriticalImages }
    ];

    initTasks.forEach(task => {
      try {
        task.fn();
      } catch (error) {
        console.warn(`Failed to initialize ${task.name}:`, error);
      }
    });

  } catch (error) {
    console.error('Failed to initialize application:', error);
    // Show user-friendly error message
    const container = document.getElementById('categoryGrid');
    if (container) {
      container.innerHTML = `
        <div class="col-12 text-center py-5">
          <i class="bi bi-exclamation-triangle display-4 text-warning"></i>
          <h3 class="mt-3">Temporary Unavailable</h3>
          <p class="text-muted">Our product catalog is temporarily unavailable. Please refresh the page or contact us directly.</p>
          <button class="btn btn-primary mt-2" onclick="window.location.reload()">
            <i class="bi bi-arrow-clockwise me-2"></i>Refresh Page
          </button>
        </div>
      `;
    }
  }
}

// Performance optimization: Wait for critical resources
function waitForBootstrap() {
  if (typeof bootstrap !== 'undefined') {
    initializeApp();
  } else {
    setTimeout(waitForBootstrap, 100);
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', waitForBootstrap);
} else {
  waitForBootstrap();
}

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { 
    mapCategory, 
    groupByCategory, 
    buildCategoryGrid,
    openCategoryModal 
  };
}