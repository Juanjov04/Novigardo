document.addEventListener('DOMContentLoaded', () => {
  // --- 1. STATE MANAGEMENT ---
  const state = {
    currentStep: 1,
    head: { option: 'bunny', price: 8 },
    size: { option: 'medium', price: 18 },
    bodyColor: '#F5E6D3',
    clothing: { option: 'none', price: 0 },
    clothingColor: '#D4A0A0',
    accessories: [] // array of { option: string, price: number }
  };

  // --- 2. PRICING & LABELS DATA ---
  const PRICES = {
    heads: { bunny: 8, bear: 8, cat: 8, dog: 8, unicorn: 10, dinosaur: 10, character: 12, person: 15 },
    sizes: { small: 10, medium: 18, large: 28 },
    clothing: { none: 0, overalls: 5, dress: 6, sweater: 4, skirt: 4, pants: 4, pajamas: 5, cape: 8 },
    accessories: { bow: 2, necklace: 2, glasses: 3, flowers: 3, hat: 4, scarf: 4, bag: 4, crown: 5 }
  };

  const LABELS = {
    heads: { bunny: 'Conejito', bear: 'Osito', cat: 'Gatito', dog: 'Perrito', unicorn: 'Unicornio', dinosaur: 'Dinosaurio', character: 'Personaje Animado', person: 'Persona' },
    sizes: { small: 'Pequeño (15cm)', medium: 'Mediano (25cm)', large: 'Grande (35cm)' },
    clothing: { none: 'Sin ropa', overalls: 'Overol', dress: 'Vestido', sweater: 'Suéter', skirt: 'Falda', pants: 'Pantalón', pajamas: 'Pijama', cape: 'Capa' },
    accessories: { bow: 'Moño', necklace: 'Collar', glasses: 'Lentes', flowers: 'Flores', hat: 'Gorrito', scarf: 'Bufanda', bag: 'Bolsito', crown: 'Corona' },
    colors: { '#F5E6D3': 'Crema', '#F0B5B5': 'Rosa', '#B5896E': 'Marrón', '#A5C8E1': 'Azul', '#A5D6A7': 'Verde', '#F5E6A3': 'Amarillo', '#D1B5E8': 'Lavanda', '#F5C7A3': 'Durazno', '#FFFFFF': 'Blanco', '#2C2C2C': 'Negro', '#D4A0A0': 'Rosa', '#8BB5E8': 'Azul oscuro', '#E88B8B': 'Rojo' }
  };

  // --- 4. NAVBAR ---
  const navbar = document.querySelector('.navbar');
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  const navItems = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  });

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks?.classList.toggle('active');
      mobileMenuBtn.classList.toggle('active');
    });
  }

  navItems.forEach(link => {
    link.addEventListener('click', (e) => {
      // Close mobile menu on click
      navLinks?.classList.remove('active');
      mobileMenuBtn?.classList.remove('active');
      
      // Smooth scroll
      const targetId = link.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  // --- 5. CUSTOMIZER - STEP NAVIGATION ---
  const btnNext = document.getElementById('btn-next');
  const btnPrev = document.getElementById('btn-prev');
  const btnOrder = document.getElementById('btn-order');
  const steps = document.querySelectorAll('.step');
  const stepIndicators = document.querySelectorAll('.step-indicator');

  function updateStepView() {
    // 1. Remove 'active' from all steps and indicators
    steps.forEach(step => step.classList.remove('active'));
    stepIndicators.forEach(indicator => {
      indicator.classList.remove('active');
      indicator.classList.remove('completed');
    });

    // 2. Add 'active' to current step and indicator
    const currentStepEl = document.querySelector(`.step[data-step="${state.currentStep}"]`);
    const currentIndicatorEl = document.querySelector(`.step-indicator[data-step="${state.currentStep}"]`);
    
    if (currentStepEl) currentStepEl.classList.add('active');
    if (currentIndicatorEl) currentIndicatorEl.classList.add('active');

    // 3. Mark completed steps
    stepIndicators.forEach(indicator => {
      const stepNum = parseInt(indicator.dataset.step, 10);
      if (stepNum < state.currentStep) {
        indicator.classList.add('completed');
      }
    });

    // 4, 5, 6. Update buttons visibility
    if (btnPrev) btnPrev.style.display = state.currentStep === 1 ? 'none' : 'block';
    
    if (state.currentStep === 4) {
      if (btnNext) btnNext.style.display = 'none';
      if (btnOrder) btnOrder.style.display = 'block';
    } else {
      if (btnNext) btnNext.style.display = 'block';
      if (btnOrder) btnOrder.style.display = 'none';
    }
  }

  if (btnNext) {
    btnNext.addEventListener('click', () => {
      if (state.currentStep < 4) {
        state.currentStep++;
        updateStepView();
      }
    });
  }

  if (btnPrev) {
    btnPrev.addEventListener('click', () => {
      if (state.currentStep > 1) {
        state.currentStep--;
        updateStepView();
      }
    });
  }

  stepIndicators.forEach(indicator => {
    indicator.addEventListener('click', () => {
      const targetStep = parseInt(indicator.dataset.step, 10);
      if (targetStep) {
        state.currentStep = targetStep;
        updateStepView();
      }
    });
  });

  // Initialize step view
  updateStepView();

  // --- 6. CUSTOMIZER - OPTION SELECTION ---
  // Step 1: Head
  document.querySelectorAll('.step[data-step="1"] .option-card').forEach(card => {
    card.addEventListener('click', () => {
      // Remove selected from siblings
      card.parentNode.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      
      const option = card.dataset.option;
      state.head = { option, price: PRICES.heads[option] };
      updatePriceDisplay();
      updateDollPreview();
    });
  });

  // Step 2: Size
  document.querySelectorAll('.step[data-step="2"] .option-card').forEach(card => {
    card.addEventListener('click', () => {
      card.parentNode.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      
      const option = card.dataset.option;
      state.size = { option, price: PRICES.sizes[option] };
      updatePriceDisplay();
      updateDollPreview();
    });
  });

  // Step 3: Clothing
  const clothingColorPicker = document.getElementById('clothing-color-picker');
  const clothingColorTitle = document.getElementById('clothing-color-title');
  
  document.querySelectorAll('.step[data-step="3"] .option-card').forEach(card => {
    card.addEventListener('click', () => {
      card.parentNode.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      
      const option = card.dataset.option;
      state.clothing = { option, price: PRICES.clothing[option] };
      
      if (option !== 'none') {
        if (clothingColorPicker) clothingColorPicker.style.display = 'flex';
        if (clothingColorTitle) clothingColorTitle.style.display = 'block';
      } else {
        if (clothingColorPicker) clothingColorPicker.style.display = 'none';
        if (clothingColorTitle) clothingColorTitle.style.display = 'none';
      }
      
      updatePriceDisplay();
      updateDollPreview();
    });
  });

  // Step 4: Accessories (Multi-select)
  document.querySelectorAll('.step[data-step="4"] .option-card').forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('selected');
      const option = card.dataset.option;
      const isSelected = card.classList.contains('selected');
      
      if (isSelected) {
        state.accessories.push({ option, price: PRICES.accessories[option] });
      } else {
        state.accessories = state.accessories.filter(a => a.option !== option);
      }
      
      updatePriceDisplay();
      updateDollPreview();
    });
  });

  // --- 7. COLOR PICKER ---
  const bodyColorOptions = document.querySelectorAll('#body-color-picker .color-option');
  bodyColorOptions.forEach(option => {
    option.addEventListener('click', () => {
      bodyColorOptions.forEach(o => o.classList.remove('selected'));
      option.classList.add('selected');
      
      state.bodyColor = option.dataset.color;
      updateDollPreview();
    });
  });

  const clothingColorOptions = document.querySelectorAll('#clothing-color-picker .color-option');
  clothingColorOptions.forEach(option => {
    option.addEventListener('click', () => {
      clothingColorOptions.forEach(o => o.classList.remove('selected'));
      option.classList.add('selected');
      
      state.clothingColor = option.dataset.color;
      updateDollPreview();
    });
  });

  // --- 8. PRICE CALCULATION ---
  function calculateTotal() {
    let total = state.head.price + state.size.price + state.clothing.price;
    state.accessories.forEach(acc => {
      total += acc.price;
    });
    return total;
  }

  function updatePriceDisplay() {
    const total = calculateTotal();
    const priceDisplay = document.getElementById('total-price');
    if (priceDisplay) {
      priceDisplay.textContent = `$${total.toFixed(2)}`;
    }
  }

  // --- 9. SVG PREVIEW UPDATE ---
  function updateDollPreview() {
    // Hide all head groups, show selected one
    const headGroups = ['bunny', 'bear', 'cat', 'dog', 'unicorn', 'dinosaur', 'character', 'person'];
    headGroups.forEach(h => {
      const el = document.getElementById(`head-${h}`);
      if (el) el.style.display = (h === state.head.option) ? 'block' : 'none';
    });
    
    // Hide all body groups, show selected one
    const bodyGroups = ['small', 'medium', 'large'];
    bodyGroups.forEach(b => {
      const el = document.getElementById(`body-${b}`);
      if (el) el.style.display = (b === state.size.option) ? 'block' : 'none';
    });
    
    // Hide all clothing groups, show selected one
    const clothingGroups = ['none', 'overalls', 'dress', 'sweater', 'skirt', 'pants', 'pajamas', 'cape'];
    clothingGroups.forEach(c => {
      const el = document.getElementById(`clothes-${c}`);
      if (el) el.style.display = (c === state.clothing.option) ? 'block' : 'none';
    });
    
    // Hide all accessory groups, show selected ones
    const accGroups = ['bow', 'necklace', 'glasses', 'flowers', 'hat', 'scarf', 'bag', 'crown'];
    const selectedAccs = state.accessories.map(a => a.option);
    accGroups.forEach(a => {
      const el = document.getElementById(`acc-${a}`);
      if (el) el.style.display = selectedAccs.includes(a) ? 'block' : 'none';
    });
    
    // Update body color
    document.querySelectorAll('.body-fill').forEach(el => {
      el.setAttribute('fill', state.bodyColor);
    });
    
    // Update clothing color
    document.querySelectorAll('.clothing-fill').forEach(el => {
      el.setAttribute('fill', state.clothingColor);
    });
  }

  // Initial updates
  updatePriceDisplay();
  updateDollPreview();

  // --- 10. ORDER BUTTON & MODAL ---
  const orderModal = document.getElementById('order-modal');
  const modalOverlay = document.querySelector('.modal-overlay');
  
  function generateInstagramMessage(total) {
    let msg = '🧶 ¡Hola! Quiero pedir un amigurumi personalizado:\n\n';
    msg += `🧸 Cabeza: ${LABELS.heads[state.head.option]}\n`;
    msg += `📏 Tamaño: ${LABELS.sizes[state.size.option]}\n`;
    msg += `🎨 Color cuerpo: ${LABELS.colors[state.bodyColor] || state.bodyColor}\n`;
    msg += `👗 Ropa: ${LABELS.clothing[state.clothing.option]}\n`;
    if (state.clothing.option !== 'none') {
      msg += `🎨 Color ropa: ${LABELS.colors[state.clothingColor] || state.clothingColor}\n`;
    }
    if (state.accessories.length > 0) {
      msg += `🎀 Accesorios: ${state.accessories.map(a => LABELS.accessories[a.option]).join(', ')}\n`;
    }
    msg += `\n💰 Precio total: $${total.toFixed(2)}\n`;
    msg += '\n¡Gracias! 💝';
    return msg;
  }

  function showOrderModal() {
    const summary = document.getElementById('order-summary');
    const total = calculateTotal();
    
    if (summary) {
      let html = '';
      html += `<div class="order-item"><span class="order-item-label">Cabeza:</span><span class="order-item-value">${LABELS.heads[state.head.option]} (+$${state.head.price})</span></div>`;
      html += `<div class="order-item"><span class="order-item-label">Tamaño:</span><span class="order-item-value">${LABELS.sizes[state.size.option]} (+$${state.size.price})</span></div>`;
      html += `<div class="order-item"><span class="order-item-label">Color cuerpo:</span><span class="order-item-value">${LABELS.colors[state.bodyColor] || state.bodyColor}</span></div>`;
      html += `<div class="order-item"><span class="order-item-label">Ropa:</span><span class="order-item-value">${LABELS.clothing[state.clothing.option]} (+$${state.clothing.price})</span></div>`;
      
      if (state.clothing.option !== 'none') {
        html += `<div class="order-item"><span class="order-item-label">Color ropa:</span><span class="order-item-value">${LABELS.colors[state.clothingColor] || state.clothingColor}</span></div>`;
      }
      
      if (state.accessories.length > 0) {
        const accNames = state.accessories.map(a => `${LABELS.accessories[a.option]} (+$${a.price})`).join(', ');
        html += `<div class="order-item"><span class="order-item-label">Accesorios:</span><span class="order-item-value">${accNames}</span></div>`;
      } else {
        html += `<div class="order-item"><span class="order-item-label">Accesorios:</span><span class="order-item-value">Ninguno</span></div>`;
      }
      
      summary.innerHTML = html;
    }
    
    const modalTotal = document.getElementById('modal-total');
    if (modalTotal) {
      modalTotal.textContent = `$${total.toFixed(2)}`;
    }
    
    // Generate Instagram DM message
    const message = generateInstagramMessage(total);
    const instagramUrl = `https://ig.me/m/novigardo`;
    const instaLink = document.getElementById('instagram-link');
    
    if (instaLink) {
      instaLink.href = 'javascript:void(0)'; // Prevent default navigation
      instaLink.setAttribute('data-message', message);
      instaLink.setAttribute('data-url', instagramUrl);
    }
    
    if (modalOverlay) {
      modalOverlay.classList.add('active');
    } else if (orderModal) {
      // Fallback if structured slightly differently
      orderModal.classList.add('active');
    }
  }

  if (btnOrder) {
    btnOrder.addEventListener('click', showOrderModal);
  }

  // Instagram Link Click Handler
  const instaLink = document.getElementById('instagram-link');
  if (instaLink) {
    instaLink.addEventListener('click', (e) => {
      e.preventDefault();
      const message = instaLink.getAttribute('data-message');
      const url = instaLink.getAttribute('data-url');
      
      navigator.clipboard.writeText(message).then(() => {
        showToast('Mensaje copiado. Pégalo en el DM de Instagram');
        setTimeout(() => {
          window.open(url, '_blank');
        }, 1500);
      }).catch(err => {
        console.error('Error al copiar al portapapeles: ', err);
        // Open anyway if copy fails
        window.open(url, '_blank');
      });
    });
  }

  // --- 11. MODAL CLOSE ---
  const modalClose = document.getElementById('modal-close');
  
  function closeModal() {
    if (modalOverlay) {
      modalOverlay.classList.remove('active');
    } else if (orderModal) {
      orderModal.classList.remove('active');
    }
  }

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  });

  // --- 12. GALLERY FILTERS ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      
      galleryItems.forEach(item => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  // --- 13. TESTIMONIALS CAROUSEL ---
  let currentTestimonial = 0;
  const track = document.querySelector('.testimonials-track');
  const cards = document.querySelectorAll('.testimonial-card');
  const totalCards = cards.length;
  const dotsContainer = document.getElementById('carousel-dots');

  if (track && cards.length > 0) {
    function updateCarousel() {
      track.style.transform = `translateX(-${currentTestimonial * 100}%)`;
      // Update dots
      if (dotsContainer) {
        document.querySelectorAll('.carousel-dots .dot').forEach((dot, i) => {
          dot.classList.toggle('active', i === currentTestimonial);
        });
      }
    }

    // Create dots
    if (dotsContainer) {
      for (let i = 0; i < totalCards; i++) {
        const dot = document.createElement('span');
        dot.className = 'dot' + (i === 0 ? ' active' : '');
        dot.addEventListener('click', () => { 
          currentTestimonial = i; 
          updateCarousel(); 
        });
        dotsContainer.appendChild(dot);
      }
    }

    const carouselPrev = document.getElementById('carousel-prev');
    if (carouselPrev) {
      carouselPrev.addEventListener('click', () => {
        currentTestimonial = (currentTestimonial - 1 + totalCards) % totalCards;
        updateCarousel();
      });
    }

    const carouselNext = document.getElementById('carousel-next');
    if (carouselNext) {
      carouselNext.addEventListener('click', () => {
        currentTestimonial = (currentTestimonial + 1) % totalCards;
        updateCarousel();
      });
    }

    // Auto-rotate every 5 seconds
    setInterval(() => {
      currentTestimonial = (currentTestimonial + 1) % totalCards;
      updateCarousel();
    }, 5000);
  }

  // --- 14. SCROLL ANIMATIONS ---
  // Add 'fade-in' class programmatically
  document.querySelectorAll('.section-title, .gallery-item, .about-content, .contact-content, .feature, .contact-item, .testimonials-wrapper').forEach(el => {
    el.classList.add('fade-in');
  });

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Optional: stop observing once visible
        // observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

  // --- 15. TOAST NOTIFICATION ---
  // Add keyframes for toast
  const style = document.createElement('style');
  style.textContent = `
    @keyframes toastIn { 
      from { opacity: 0; transform: translateX(-50%) translateY(20px); } 
      to { opacity: 1; transform: translateX(-50%) translateY(0); } 
    }
    @keyframes toastOut { 
      from { opacity: 1; transform: translateX(-50%) translateY(0); } 
      to { opacity: 0; transform: translateX(-50%) translateY(20px); } 
    }
  `;
  document.head.appendChild(style);

  window.showToast = function(message, duration = 3000) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed; 
      bottom: 30px; 
      left: 50%; 
      transform: translateX(-50%);
      background: #4A3728; 
      color: white; 
      padding: 15px 30px; 
      border-radius: 30px;
      font-family: 'Nunito', sans-serif; 
      font-size: 0.95rem; 
      z-index: 3000;
      box-shadow: 0 5px 20px rgba(0,0,0,0.2); 
      animation: toastIn 0.3s ease;
      text-align: center;
      max-width: 90%;
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.animation = 'toastOut 0.3s ease forwards';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  };

});
