document.addEventListener('DOMContentLoaded', () => {

  // ========================================
  // STATE
  // ========================================
  const state = {
    step: 1,
    head: 'bunny', headPrice: 8,
    size: 'medium', sizePrice: 18,
    bodyColor: '#F5E6D3',
    clothing: 'none', clothingPrice: 0, clothingColor: '#D4A0A0',
    accessories: []
  };

  const PRICES = {
    heads: { bunny:8, bear:8, cat:8, dog:8, unicorn:10, dino:10, character:12, person:15 },
    sizes: { small:10, medium:18, large:28 },
    clothing: { none:0, overalls:5, dress:6, sweater:4, skirt:4, cape:8 },
    accessories: { bow:2, glasses:3, flower:3, hat:4, scarf:4, bag:4, heart:2, crown:5 }
  };

  const LABELS = {
    heads: { bunny:'Conejito', bear:'Osito', cat:'Gatito', dog:'Perrito', unicorn:'Unicornio', dino:'Dinosaurio', character:'Personaje', person:'Persona' },
    sizes: { small:'Pequeño (15cm)', medium:'Mediano (25cm)', large:'Grande (35cm)' },
    clothing: { none:'Sin ropa', overalls:'Overol', dress:'Vestido', sweater:'Suéter', skirt:'Falda', cape:'Capa' },
    accessories: { bow:'Moño', glasses:'Lentes', flower:'Flor', hat:'Gorrito', scarf:'Bufanda', bag:'Bolsito', heart:'Corazón', crown:'Corona' },
    colors: { '#F5E6D3':'Crema', '#F0B5B5':'Rosa', '#B5896E':'Marrón', '#A5C8E1':'Azul', '#A5D6A7':'Verde', '#F5E6A3':'Amarillo', '#D1B5E8':'Lavanda', '#F5C7A3':'Durazno', '#FFFFFF':'Blanco', '#2C2C2C':'Negro', '#D4A0A0':'Rosa', '#E88B8B':'Rojo', '#4A3728':'Café', '#8BB5E8':'Azul oscuro' }
  };

  // Reference photos per head type
  const REF_PHOTOS = {
    bunny: ['assets/gallery/conejito.jpg', 'assets/gallery/bunny_overol.jpg', 'assets/gallery/ajolote.jpg'],
    bear: ['assets/gallery/mini_bears.jpg', 'assets/gallery/snoopy.jpg'],
    cat: ['assets/gallery/scooby_doo.jpg', 'assets/gallery/jake_perro.jpg'],
    dog: ['assets/gallery/scooby_doo.jpg', 'assets/gallery/jake_perro.jpg'],
    unicorn: ['assets/gallery/conejito.jpg', 'assets/gallery/ajolote.jpg'],
    dino: ['assets/gallery/dragon_rojo.jpg', 'assets/gallery/enderman.jpg'],
    character: ['assets/gallery/deadpool.jpg', 'assets/gallery/spiderman.jpg', 'assets/gallery/coraline.jpg', 'assets/gallery/jack_skellington.jpg', 'assets/gallery/bob_esponja.jpg'],
    person: ['assets/gallery/ingeniera.jpg', 'assets/gallery/muneco_traje.jpg', 'assets/gallery/muneca_cumple.jpg', 'assets/gallery/nacimiento.jpg']
  };

  // ========================================
  // NAVBAR
  // ========================================
  const navbar = document.querySelector('.navbar');
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');

  window.addEventListener('scroll', () => navbar?.classList.toggle('scrolled', window.scrollY > 50));
  mobileMenuBtn?.addEventListener('click', () => {
    navLinks?.classList.toggle('active');
    mobileMenuBtn.classList.toggle('active');
  });
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', (e) => {
      navLinks?.classList.remove('active');
      mobileMenuBtn?.classList.remove('active');
      const t = document.querySelector(link.getAttribute('href'));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
    });
  });

  // ========================================
  // STEP NAVIGATION
  // ========================================
  const btnNext = document.getElementById('btn-next');
  const btnPrev = document.getElementById('btn-prev');
  const btnOrder = document.getElementById('btn-order');

  function updateStepView() {
    document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.step-indicator').forEach(i => { i.classList.remove('active', 'completed'); });
    document.querySelector(`.step[data-step="${state.step}"]`)?.classList.add('active');
    document.querySelector(`.step-indicator[data-step="${state.step}"]`)?.classList.add('active');
    document.querySelectorAll('.step-indicator').forEach(i => {
      if (parseInt(i.dataset.step) < state.step) i.classList.add('completed');
    });
    if (btnPrev) btnPrev.style.display = state.step === 1 ? 'none' : 'block';
    if (state.step === 4) {
      if (btnNext) btnNext.style.display = 'none';
      if (btnOrder) btnOrder.style.display = 'block';
    } else {
      if (btnNext) btnNext.style.display = 'block';
      if (btnOrder) btnOrder.style.display = 'none';
    }
  }

  btnNext?.addEventListener('click', () => { if (state.step < 4) { state.step++; updateStepView(); } });
  btnPrev?.addEventListener('click', () => { if (state.step > 1) { state.step--; updateStepView(); } });
  document.querySelectorAll('.step-indicator').forEach(i => {
    i.addEventListener('click', () => { state.step = parseInt(i.dataset.step); updateStepView(); });
  });
  updateStepView();

  // ========================================
  // STEP 1: HEAD SELECTION
  // ========================================
  document.querySelectorAll('[data-category="head"]').forEach(card => {
    card.addEventListener('click', () => {
      card.closest('.options-grid').querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      state.head = card.dataset.option;
      state.headPrice = PRICES.heads[state.head];
      updateDoll();
      updatePrice();
      updateRefPhotos();
    });
  });

  // ========================================
  // STEP 2: SIZE + BODY COLOR
  // ========================================
  document.querySelectorAll('[data-category="size"]').forEach(card => {
    card.addEventListener('click', () => {
      card.closest('.options-grid').querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      state.size = card.dataset.option;
      state.sizePrice = PRICES.sizes[state.size];
      updateDoll();
      updatePrice();
    });
  });

  document.querySelectorAll('#body-color-picker .color-option').forEach(opt => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('#body-color-picker .color-option').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      state.bodyColor = opt.dataset.color;
      updateDoll();
    });
  });

  // ========================================
  // STEP 3: CLOTHING
  // ========================================
  document.querySelectorAll('[data-category="clothing"]').forEach(card => {
    card.addEventListener('click', () => {
      card.closest('.options-grid').querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      state.clothing = card.dataset.option;
      state.clothingPrice = PRICES.clothing[state.clothing];
      const colorPicker = document.getElementById('clothing-color-picker');
      const colorTitle = document.getElementById('clothing-color-title');
      if (state.clothing !== 'none') {
        colorPicker && (colorPicker.style.display = 'flex');
        colorTitle && (colorTitle.style.display = 'block');
      } else {
        colorPicker && (colorPicker.style.display = 'none');
        colorTitle && (colorTitle.style.display = 'none');
      }
      updateDoll();
      updatePrice();
    });
  });

  document.querySelectorAll('#clothing-color-picker .color-option').forEach(opt => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('#clothing-color-picker .color-option').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      state.clothingColor = opt.dataset.color;
      updateDoll();
    });
  });

  // ========================================
  // STEP 4: ACCESSORIES (multi-select)
  // ========================================
  document.querySelectorAll('[data-category="accessory"]').forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('selected');
      const opt = card.dataset.option;
      if (card.classList.contains('selected')) {
        state.accessories.push(opt);
      } else {
        state.accessories = state.accessories.filter(a => a !== opt);
      }
      updateDoll();
      updatePrice();
    });
  });

  // ========================================
  // UPDATE AMIGURUMI DOLL
  // ========================================
  function updateDoll() {
    const root = document.documentElement;
    root.style.setProperty('--ami-body-color', state.bodyColor);
    root.style.setProperty('--ami-clothing-color', state.clothingColor);

    // --- EARS ---
    const earsContainer = document.getElementById('ami-ears');
    const horn = document.getElementById('ami-horn');
    const nose = document.getElementById('ami-nose');
    const whiskers = document.getElementById('ami-whiskers');
    
    horn.style.display = 'none';
    nose.style.display = 'none';
    whiskers.style.display = 'none';

    let earsHTML = '';
    switch (state.head) {
      case 'bunny':
        earsHTML = `
          <div class="ami-ear ami-ear-left bunny-ear"><div class="ear-inner"></div></div>
          <div class="ami-ear ami-ear-right bunny-ear"><div class="ear-inner"></div></div>`;
        break;
      case 'bear':
        earsHTML = `
          <div class="ami-ear ami-ear-left bear-ear"><div class="ear-inner"></div></div>
          <div class="ami-ear ami-ear-right bear-ear"><div class="ear-inner"></div></div>`;
        nose.style.display = 'block';
        break;
      case 'cat':
        earsHTML = `
          <div class="ami-ear ami-ear-left cat-ear"><div class="ear-inner"></div></div>
          <div class="ami-ear ami-ear-right cat-ear"><div class="ear-inner"></div></div>`;
        nose.style.display = 'block';
        whiskers.style.display = 'block';
        break;
      case 'dog':
        earsHTML = `
          <div class="ami-ear ami-ear-left dog-ear"><div class="ear-inner"></div></div>
          <div class="ami-ear ami-ear-right dog-ear"><div class="ear-inner"></div></div>`;
        nose.style.display = 'block';
        break;
      case 'unicorn':
        earsHTML = `
          <div class="ami-ear ami-ear-left bunny-ear" style="height:30px;top:-5px;"><div class="ear-inner" style="height:18px;"></div></div>
          <div class="ami-ear ami-ear-right bunny-ear" style="height:30px;top:-5px;"><div class="ear-inner" style="height:18px;"></div></div>`;
        horn.style.display = 'block';
        break;
      case 'dino':
        earsHTML = `
          <div class="dino-spike" style="display:block;left:35px;top:5px;background:${state.bodyColor};filter:brightness(0.85);"></div>
          <div class="dino-spike" style="display:block;left:50px;top:-5px;height:22px;background:${state.bodyColor};filter:brightness(0.85);"></div>
          <div class="dino-spike" style="display:block;left:65px;top:5px;background:${state.bodyColor};filter:brightness(0.85);"></div>`;
        break;
      case 'character':
        earsHTML = ''; // No ears for characters
        break;
      case 'person':
        // Hair
        earsHTML = `<div style="position:absolute;top:8px;left:10px;right:10px;height:40px;background:#8B5A2B;border-radius:50px 50px 0 0;z-index:0;"></div>
                    <div style="position:absolute;top:30px;left:5px;width:20px;height:50px;background:#8B5A2B;border-radius:0 0 10px 10px;z-index:0;"></div>
                    <div style="position:absolute;top:30px;right:5px;width:20px;height:50px;background:#8B5A2B;border-radius:0 0 10px 10px;z-index:0;"></div>`;
        break;
    }
    earsContainer.innerHTML = earsHTML;

    // --- SIZE ---
    const doll = document.getElementById('ami-doll');
    doll.style.transform = '';
    if (state.size === 'small') doll.style.transform = 'scale(0.8)';
    else if (state.size === 'large') doll.style.transform = 'scale(1.1)';

    // --- CLOTHING ---
    const clothingEl = document.getElementById('ami-clothing');
    const armLeft = document.getElementById('ami-arm-left');
    const armRight = document.getElementById('ami-arm-right');
    const legLeft = document.getElementById('ami-leg-left');
    const legRight = document.getElementById('ami-leg-right');
    
    // Reset arm/leg colors
    armLeft.style.backgroundColor = '';
    armRight.style.backgroundColor = '';
    legLeft.style.backgroundColor = '';
    legRight.style.backgroundColor = '';

    clothingEl.innerHTML = '';
    if (state.clothing !== 'none') {
      clothingEl.innerHTML = `<div class="clothing-${state.clothing}"></div>`;
      
      if (state.clothing === 'overalls') {
        legLeft.style.backgroundColor = state.clothingColor;
        legRight.style.backgroundColor = state.clothingColor;
      }
      if (state.clothing === 'sweater') {
        armLeft.style.backgroundColor = state.clothingColor;
        armRight.style.backgroundColor = state.clothingColor;
      }
      if (state.clothing === 'cape') {
        armLeft.style.backgroundColor = state.clothingColor;
        armRight.style.backgroundColor = state.clothingColor;
      }
    }

    // --- ACCESSORIES ---
    const accContainer = document.getElementById('ami-accessory');
    accContainer.innerHTML = '';
    state.accessories.forEach(acc => {
      accContainer.innerHTML += `<div class="acc-${acc}"></div>`;
    });
  }

  // ========================================
  // REFERENCE PHOTOS
  // ========================================
  function updateRefPhotos() {
    const container = document.getElementById('ref-photos');
    if (!container) return;
    const photos = REF_PHOTOS[state.head] || [];
    container.innerHTML = photos.map((p, i) => 
      `<img src="${p}" alt="Referencia" class="ref-thumb ${i === 0 ? 'active' : ''}" loading="lazy">`
    ).join('');
  }

  // ========================================
  // PRICE
  // ========================================
  function calcTotal() {
    let t = state.headPrice + state.sizePrice + state.clothingPrice;
    state.accessories.forEach(a => t += PRICES.accessories[a] || 0);
    return t;
  }

  function updatePrice() {
    const el = document.getElementById('total-price');
    if (el) el.textContent = `$${calcTotal().toFixed(2)}`;
  }

  // INIT
  updateDoll();
  updatePrice();
  updateRefPhotos();

  // ========================================
  // ORDER MODAL
  // ========================================
  const modal = document.getElementById('order-modal');

  function genMsg(total) {
    let m = '🧶 ¡Hola! Quiero pedir un amigurumi personalizado:\n\n';
    m += `🧸 Cabeza: ${LABELS.heads[state.head]}\n`;
    m += `📏 Tamaño: ${LABELS.sizes[state.size]}\n`;
    m += `🎨 Color: ${LABELS.colors[state.bodyColor] || state.bodyColor}\n`;
    m += `👗 Ropa: ${LABELS.clothing[state.clothing]}\n`;
    if (state.clothing !== 'none') m += `🎨 Color ropa: ${LABELS.colors[state.clothingColor] || state.clothingColor}\n`;
    if (state.accessories.length > 0) m += `🎀 Accesorios: ${state.accessories.map(a => LABELS.accessories[a]).join(', ')}\n`;
    m += `\n💰 Total: $${total.toFixed(2)}\n\n¡Gracias! 💝`;
    return m;
  }

  function showModal() {
    const summary = document.getElementById('order-summary');
    const total = calcTotal();
    if (summary) {
      let h = '';
      h += `<div class="order-item"><span class="order-item-label">Cabeza:</span><span class="order-item-value">${LABELS.heads[state.head]} (+$${state.headPrice})</span></div>`;
      h += `<div class="order-item"><span class="order-item-label">Tamaño:</span><span class="order-item-value">${LABELS.sizes[state.size]} (+$${state.sizePrice})</span></div>`;
      h += `<div class="order-item"><span class="order-item-label">Color:</span><span class="order-item-value">${LABELS.colors[state.bodyColor] || state.bodyColor}</span></div>`;
      h += `<div class="order-item"><span class="order-item-label">Ropa:</span><span class="order-item-value">${LABELS.clothing[state.clothing]} (+$${state.clothingPrice})</span></div>`;
      if (state.clothing !== 'none') h += `<div class="order-item"><span class="order-item-label">Color ropa:</span><span class="order-item-value">${LABELS.colors[state.clothingColor]}</span></div>`;
      if (state.accessories.length > 0) {
        const accStr = state.accessories.map(a => `${LABELS.accessories[a]} (+$${PRICES.accessories[a]})`).join(', ');
        h += `<div class="order-item"><span class="order-item-label">Accesorios:</span><span class="order-item-value">${accStr}</span></div>`;
      }
      summary.innerHTML = h;
    }
    document.getElementById('modal-total').textContent = `$${total.toFixed(2)}`;
    const msg = genMsg(total);
    const link = document.getElementById('instagram-link');
    if (link) {
      link.href = 'javascript:void(0)';
      link.setAttribute('data-message', msg);
      link.setAttribute('data-url', 'https://ig.me/m/novigardo_');
    }
    modal?.classList.add('active');
  }

  btnOrder?.addEventListener('click', showModal);

  const instaLink = document.getElementById('instagram-link');
  instaLink?.addEventListener('click', (e) => {
    e.preventDefault();
    const msg = instaLink.getAttribute('data-message');
    const url = instaLink.getAttribute('data-url');
    navigator.clipboard.writeText(msg).then(() => {
      showToast('✅ Mensaje copiado. Pégalo en el DM de Instagram');
      setTimeout(() => window.open(url, '_blank'), 1500);
    }).catch(() => window.open(url, '_blank'));
  });

  function closeModal() { modal?.classList.remove('active'); }
  document.getElementById('modal-close')?.addEventListener('click', closeModal);
  modal?.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  // ========================================
  // GALLERY FILTERS
  // ========================================
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      document.querySelectorAll('.gallery-item').forEach(item => {
        item.classList.toggle('hidden', f !== 'all' && item.dataset.category !== f);
      });
    });
  });

  // ========================================
  // TESTIMONIALS CAROUSEL
  // ========================================
  let slide = 0;
  const track = document.querySelector('.testimonials-track');
  const cards = document.querySelectorAll('.testimonial-card');
  const dots = document.getElementById('carousel-dots');

  if (track && cards.length) {
    function updateCarousel() {
      track.style.transform = `translateX(-${slide * 100}%)`;
      document.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === slide));
    }
    if (dots) {
      for (let i = 0; i < cards.length; i++) {
        const d = document.createElement('span');
        d.className = 'dot' + (i === 0 ? ' active' : '');
        d.addEventListener('click', () => { slide = i; updateCarousel(); });
        dots.appendChild(d);
      }
    }
    document.getElementById('carousel-prev')?.addEventListener('click', () => { slide = (slide - 1 + cards.length) % cards.length; updateCarousel(); });
    document.getElementById('carousel-next')?.addEventListener('click', () => { slide = (slide + 1) % cards.length; updateCarousel(); });
    setInterval(() => { slide = (slide + 1) % cards.length; updateCarousel(); }, 5000);
  }

  // ========================================
  // SCROLL ANIMATIONS
  // ========================================
  document.querySelectorAll('.section-title, .gallery-item, .about-content, .contact-content, .feature, .contact-item, .testimonials-wrapper').forEach(el => el.classList.add('fade-in'));
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  document.querySelectorAll('.fade-in').forEach(el => obs.observe(el));

  // ========================================
  // TOAST
  // ========================================
  const ts = document.createElement('style');
  ts.textContent = `@keyframes toastIn{from{opacity:0;transform:translateX(-50%) translateY(20px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}@keyframes toastOut{from{opacity:1;transform:translateX(-50%) translateY(0)}to{opacity:0;transform:translateX(-50%) translateY(20px)}}`;
  document.head.appendChild(ts);

  window.showToast = function(msg, dur = 3000) {
    const t = document.createElement('div');
    t.textContent = msg;
    t.style.cssText = `position:fixed;bottom:30px;left:50%;transform:translateX(-50%);background:#4A3728;color:white;padding:15px 30px;border-radius:30px;font-family:'Nunito',sans-serif;font-size:.95rem;z-index:3000;box-shadow:0 5px 20px rgba(0,0,0,.2);animation:toastIn .3s ease;text-align:center;max-width:90%`;
    document.body.appendChild(t);
    setTimeout(() => { t.style.animation = 'toastOut .3s ease forwards'; setTimeout(() => t.remove(), 300); }, dur);
  };
});
