/* =========================================================
   Amjed Mohammed — Portfolio
   Theme, navigation, scroll-spy and reveal animations
   ========================================================= */
(function () {
    'use strict';

    const root = document.documentElement;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------- Theme ---------- */
    const themeToggle = document.getElementById('themeToggle');
    const media = window.matchMedia('(prefers-color-scheme: light)');

    function applyTheme(theme) {
        root.setAttribute('data-theme', theme);
        document
            .querySelector('meta[name="theme-color"]')
            ?.setAttribute('content', theme === 'light' ? '#f6f8fc' : '#070b14');
        themeToggle?.setAttribute('aria-pressed', String(theme === 'light'));
    }

    applyTheme(root.getAttribute('data-theme') || (media.matches ? 'light' : 'dark'));

    themeToggle?.addEventListener('click', function () {
        const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        applyTheme(next);
        try {
            localStorage.setItem('theme', next);
        } catch (e) {
            /* storage unavailable — session-only theme */
        }
    });

    // Follow the OS while the visitor has not chosen explicitly.
    media.addEventListener('change', function (event) {
        let stored = null;
        try {
            stored = localStorage.getItem('theme');
        } catch (e) {
            /* ignore */
        }
        if (!stored) applyTheme(event.matches ? 'light' : 'dark');
    });

    /* ---------- Header state on scroll ---------- */
    const header = document.getElementById('siteHeader');

    function syncHeader() {
        header?.classList.toggle('is-scrolled', window.scrollY > 8);
    }

    syncHeader();
    window.addEventListener('scroll', syncHeader, { passive: true });

    /* ---------- Mobile navigation ---------- */
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    function closeNav() {
        navLinks?.classList.remove('is-open');
        navToggle?.setAttribute('aria-expanded', 'false');
    }

    navToggle?.addEventListener('click', function () {
        const open = navLinks.classList.toggle('is-open');
        navToggle.setAttribute('aria-expanded', String(open));
    });

    navLinks?.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', closeNav);
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') closeNav();
    });

    document.addEventListener('click', function (event) {
        if (!navLinks?.classList.contains('is-open')) return;
        if (navLinks.contains(event.target) || navToggle.contains(event.target)) return;
        closeNav();
    });

    /* ---------- Scroll spy ---------- */
    const sections = Array.from(document.querySelectorAll('main section[id]'));
    const linkFor = new Map();

    navLinks?.querySelectorAll('a[href^="#"]').forEach(function (link) {
        linkFor.set(link.getAttribute('href').slice(1), link);
    });

    if (sections.length && 'IntersectionObserver' in window) {
        const visible = new Set();

        const spy = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) visible.add(entry.target.id);
                    else visible.delete(entry.target.id);
                });

                const current = sections.map((s) => s.id).find((id) => visible.has(id));
                linkFor.forEach(function (link, id) {
                    if (id === current) link.setAttribute('aria-current', 'true');
                    else link.removeAttribute('aria-current');
                });
            },
            { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
        );

        sections.forEach(function (section) {
            spy.observe(section);
        });
    }

    /* ---------- Reveal on scroll ---------- */
    const revealables = document.querySelectorAll('.reveal');

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
        revealables.forEach(function (el) {
            el.classList.add('is-visible');
        });
    } else {
        const revealer = new IntersectionObserver(
            function (entries, observer) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) return;
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                });
            },
            { rootMargin: '0px 0px -8% 0px', threshold: 0.06 }
        );

        revealables.forEach(function (el, index) {
            el.style.transitionDelay = Math.min(index % 4, 3) * 70 + 'ms';
            revealer.observe(el);
        });

        // Safety net: if the observer never fires (odd browser or embedded view),
        // never leave the page blank — show everything.
        window.addEventListener('load', function () {
            setTimeout(function () {
                if (document.querySelectorAll('.reveal.is-visible').length) return;
                revealables.forEach(function (el) {
                    el.style.transitionDelay = '';
                    el.classList.add('is-visible');
                });
            }, 2500);
        });
    }

    /* ---------- Footer year ---------- */
    const year = document.getElementById('year');
    if (year) year.textContent = String(new Date().getFullYear());
})();
