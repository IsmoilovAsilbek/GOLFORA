(function () {
    const nav = document.querySelector('.nav');
    const burger = document.getElementById('burger');
    const menu = document.getElementById('menu');
    const toTop = document.getElementById('toTop');
    const links = document.querySelectorAll('.nav-list__link');

    /* Burger menu */
    burger.addEventListener('click', () => {
        const open = menu.classList.toggle('open');
        burger.classList.toggle('active', open);
        burger.setAttribute('aria-expanded', open);
    });
    links.forEach(l => l.addEventListener('click', () => {
        menu.classList.remove('open');
        burger.classList.remove('active');
        burger.setAttribute('aria-expanded', false);
    }));

    /* Scroll: sticky nav style + back to top */
    function onScroll() {
        nav.classList.toggle('scrolled', window.scrollY > 40);
        toTop.classList.toggle('show', window.scrollY > 600);
    }
    window.addEventListener('scroll', onScroll, {passive: true});
    onScroll();
    toTop.addEventListener('click', () => window.scrollTo({top: 0, behavior: 'smooth'}));

    /* Reveal on scroll */
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            el.style.transitionDelay = (el.dataset.delay || 0) + 'ms';
            el.classList.add('in');
            revealObserver.unobserve(el);
        });
    }, {threshold: 0.15});
    document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));

    /* Counters */
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const target = +el.dataset.count;
            const suffix = el.dataset.suffix || '';
            const duration = 1800;
            const start = performance.now();
            function tick(now) {
                const p = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - p, 3);
                el.textContent = Math.floor(target * eased) + (p === 1 ? suffix : '');
                if (p < 1) requestAnimationFrame(tick);
            }
            requestAnimationFrame(tick);
            counterObserver.unobserve(el);
        });
    }, {threshold: 0.5});
    document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

    /* Active nav link on scroll */
    const sections = [...links]
        .map(l => document.querySelector(l.getAttribute('href')))
        .filter(Boolean);
    const spy = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + entry.target.id));
        });
    }, {rootMargin: '-45% 0px -50% 0px'});
    sections.forEach(s => spy.observe(s));

    /* Testimonials slider */
    const slides = document.querySelectorAll('.review');
    const dotsBox = document.getElementById('dots');
    let current = 0;
    let timer;

    slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.setAttribute('aria-label', 'Review ' + (i + 1));
        dot.addEventListener('click', () => { show(i); restart(); });
        dotsBox.appendChild(dot);
    });
    const dots = dotsBox.querySelectorAll('button');

    function show(i) {
        slides[current].classList.remove('active');
        dots[current].classList.remove('active');
        current = i;
        slides[current].classList.add('active');
        dots[current].classList.add('active');
    }
    function restart() {
        clearInterval(timer);
        timer = setInterval(() => show((current + 1) % slides.length), 5500);
    }
    show(0);
    restart();

    /* Newsletter form */
    const form = document.getElementById('subscribe');
    const msg = document.getElementById('subscribeMsg');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = form.querySelector('input');
        const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
        msg.classList.toggle('error', !valid);
        msg.textContent = valid ? 'Thank you! You are subscribed.' : 'Please enter a valid email address.';
        if (valid) form.reset();
    });
})();