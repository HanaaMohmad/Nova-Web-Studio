(() => {
  const body = document.body;
  body.classList.add('js-enabled');

  const themeToggle = document.getElementById('themeToggle');
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  let savedTheme = null;
  try { savedTheme = localStorage.getItem('nova-theme'); } catch { /* Storage can be disabled by the browser. */ }
  const applyTheme = (theme) => {
    document.documentElement.dataset.theme = theme;
    const isDark = theme !== 'light';
    if (themeToggle) {
      themeToggle.innerHTML = `<span aria-hidden="true">${isDark ? '☀️' : '🌙'}</span>`;
      themeToggle.setAttribute('aria-label', isDark ? 'تفعيل الوضع النهاري' : 'تفعيل الوضع الليلي');
      themeToggle.title = isDark ? 'تفعيل الوضع النهاري' : 'تفعيل الوضع الليلي';
    }
    if (themeMeta) themeMeta.content = isDark ? '#07111f' : '#f4f7fc';
  };
  applyTheme(savedTheme === 'light' ? 'light' : 'dark');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme);
      try { localStorage.setItem('nova-theme', nextTheme); } catch { /* The toggle still works without storage. */ }
    });
  }
  const menuButton = document.getElementById('menuBtn');
  const nav = document.getElementById('navLinks');
  if (menuButton && nav) {
    const closeMenu = () => {
      nav.classList.remove('is-open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'فتح القائمة');
    };
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open');
      menuButton.setAttribute('aria-expanded', String(isOpen));
      menuButton.setAttribute('aria-label', isOpen ? 'إغلاق القائمة' : 'فتح القائمة');
    });
    nav.addEventListener('click', (event) => {
      if (event.target.closest('a')) closeMenu();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu();
    });
    document.addEventListener('click', (event) => {
      if (!nav.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
    });
  }

  const revealItems = document.querySelectorAll('.reveal-item');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  const glow = document.querySelector('.cursor-glow');
  if (glow && window.matchMedia('(pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let frame = 0;
    window.addEventListener('pointermove', (event) => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        glow.style.setProperty('--pointer-x', `${event.clientX}px`);
        glow.style.setProperty('--pointer-y', `${event.clientY}px`);
        frame = 0;
      });
    }, { passive: true });
  } else if (glow) {
    glow.remove();
  }

  const form = document.getElementById('projectForm');
  const message = document.getElementById('formMessage');
  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      const details = [
        'مرحبًا، أود بدء مشروع موقع مع Nova Web Studio.',
        `الاسم: ${data.get('name')}`,
        `الهاتف: ${data.get('phone')}`,
        `اسم المشروع: ${data.get('project') || 'غير محدد'}`,
        `نوع الموقع: ${data.get('type')}`,
        `تفاصيل الفكرة: ${data.get('message') || 'لا توجد تفاصيل إضافية'}`
      ].join('\n');
      const whatsappUrl = `https://wa.me/201050664964?text=${encodeURIComponent(details)}`;
      if (message) {
        message.hidden = false;
        message.textContent = 'تم تجهيز رسالتك. أكمل الإرسال من نافذة واتساب.';
      }
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    });
  }
})();


