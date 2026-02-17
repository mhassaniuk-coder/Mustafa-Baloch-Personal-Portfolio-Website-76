/* ============================================
   MAIN JAVASCRIPT — main.js
   Portfolio Website
   ============================================ */

(function () {
    'use strict';

    // ==========================================
    // UTILITIES
    // ==========================================
    function debounce(fn, delay = 250) {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => fn(...args), delay);
        };
    }

    function throttle(fn, limit = 100) {
        let inThrottle = false;
        return (...args) => {
            if (!inThrottle) {
                fn(...args);
                inThrottle = true;
                setTimeout(() => (inThrottle = false), limit);
            }
        };
    }

    // ==========================================
    // 1. THEME TOGGLE
    // ==========================================
    const ThemeManager = {
        STORAGE_KEY: 'portfolio-theme',
        toggleBtn: null,

        init() {
            this.toggleBtn = document.getElementById('theme-toggle');
            if (!this.toggleBtn) return;

            // Apply saved or system theme
            const saved = localStorage.getItem(this.STORAGE_KEY);
            if (saved) {
                this.setTheme(saved);
            } else {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                this.setTheme(prefersDark ? 'dark' : 'light');
            }

            // Toggle on click
            this.toggleBtn.addEventListener('click', () => {
                const current = document.documentElement.getAttribute('data-theme');
                const next = current === 'dark' ? 'light' : 'dark';
                this.setTheme(next);
                localStorage.setItem(this.STORAGE_KEY, next);
            });

            // Listen for system preference changes
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                if (!localStorage.getItem(this.STORAGE_KEY)) {
                    this.setTheme(e.matches ? 'dark' : 'light');
                }
            });
        },

        setTheme(theme) {
            document.documentElement.setAttribute('data-theme', theme);
            if (this.toggleBtn) {
                this.toggleBtn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
            }
        }
    };

    // ==========================================
    // 2. NAVIGATION
    // ==========================================
    const Navigation = {
        nav: null,
        mobileBtn: null,
        mobileMenu: null,
        navLinks: [],
        sections: [],

        init() {
            this.nav = document.getElementById('nav');
            this.mobileBtn = document.getElementById('mobile-menu-btn');
            this.mobileMenu = document.getElementById('mobile-menu');
            this.navLinks = document.querySelectorAll('[data-nav-link]');
            this.sections = document.querySelectorAll('section[id]');

            if (!this.nav) return;

            // Scroll handler for sticky nav & active link
            window.addEventListener('scroll', throttle(() => this.onScroll(), 100));

            // Mobile menu toggle
            if (this.mobileBtn) {
                this.mobileBtn.addEventListener('click', () => this.toggleMobile());
            }

            // Close mobile menu on link click
            document.querySelectorAll('[data-mobile-link]').forEach(link => {
                link.addEventListener('click', () => this.closeMobile());
            });

            // Close mobile on outside click
            document.addEventListener('click', (e) => {
                if (this.mobileMenu && this.mobileMenu.classList.contains('open') &&
                    !this.mobileMenu.contains(e.target) &&
                    !this.mobileBtn.contains(e.target)) {
                    this.closeMobile();
                }
            });

            // Close on Escape
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.mobileMenu.classList.contains('open')) {
                    this.closeMobile();
                }
            });

            // Close mobile menu on resize
            window.addEventListener('resize', debounce(() => {
                if (window.innerWidth >= 992) this.closeMobile();
            }, 200));

            // Smooth scroll for nav links
            document.querySelectorAll('a[href^="#"]').forEach(link => {
                link.addEventListener('click', (e) => {
                    const target = document.querySelector(link.getAttribute('href'));
                    if (target) {
                        e.preventDefault();
                        target.scrollIntoView({ behavior: 'smooth' });
                    }
                });
            });

            // Initial call
            this.onScroll();
        },

        onScroll() {
            // Sticky nav
            if (window.scrollY > 50) {
                this.nav.classList.add('scrolled');
            } else {
                this.nav.classList.remove('scrolled');
            }

            // Active link highlighting
            let currentSection = '';
            this.sections.forEach(section => {
                const sectionTop = section.offsetTop - 120;
                if (window.scrollY >= sectionTop) {
                    currentSection = section.getAttribute('id');
                }
            });

            this.navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSection}`) {
                    link.classList.add('active');
                }
            });
        },

        toggleMobile() {
            const isOpen = this.mobileMenu.classList.contains('open');
            if (isOpen) {
                this.closeMobile();
            } else {
                this.openMobile();
            }
        },

        openMobile() {
            this.mobileMenu.classList.add('open');
            this.mobileBtn.classList.add('active');
            this.mobileBtn.setAttribute('aria-expanded', 'true');
            this.mobileBtn.setAttribute('aria-label', 'Close menu');
            document.body.classList.add('no-scroll');
        },

        closeMobile() {
            this.mobileMenu.classList.remove('open');
            this.mobileBtn.classList.remove('active');
            this.mobileBtn.setAttribute('aria-expanded', 'false');
            this.mobileBtn.setAttribute('aria-label', 'Open menu');
            document.body.classList.remove('no-scroll');
        }
    };

    // ==========================================
    // 3. TYPING EFFECT
    // ==========================================
    const TypingEffect = {
        element: null,
        strings: [
            'Full Stack Developer',
            'UI/UX Designer',
            'Creative Technologist',
            'Problem Solver',
            'Open Source Contributor'
        ],
        typeSpeed: 80,
        deleteSpeed: 40,
        pauseDuration: 2000,
        currentString: 0,
        currentChar: 0,
        isDeleting: false,

        init() {
            this.element = document.getElementById('typing-text');
            if (!this.element) return;
            this.type();
        },

        type() {
            const current = this.strings[this.currentString];

            if (this.isDeleting) {
                this.element.textContent = current.substring(0, this.currentChar - 1);
                this.currentChar--;
            } else {
                this.element.textContent = current.substring(0, this.currentChar + 1);
                this.currentChar++;
            }

            let delay = this.isDeleting ? this.deleteSpeed : this.typeSpeed;

            if (!this.isDeleting && this.currentChar === current.length) {
                delay = this.pauseDuration;
                this.isDeleting = true;
            } else if (this.isDeleting && this.currentChar === 0) {
                this.isDeleting = false;
                this.currentString = (this.currentString + 1) % this.strings.length;
                delay = 300;
            }

            setTimeout(() => this.type(), delay);
        }
    };

    // ==========================================
    // 4. SCROLL ANIMATIONS
    // ==========================================
    const ScrollAnimations = {
        init() {
            // Respect reduced motion
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                document.querySelectorAll('[data-animate]').forEach(el => {
                    el.classList.add('animated');
                });
                return;
            }

            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            // Apply stagger delay if present
                            const delay = entry.target.style.transitionDelay || '0s';
                            entry.target.style.transitionDelay = delay;
                            entry.target.classList.add('animated');
                            observer.unobserve(entry.target);
                        }
                    });
                },
                { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
            );

            document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
        }
    };

    // ==========================================
    // 5. SKILL BARS ANIMATION
    // ==========================================
    const SkillBars = {
        init() {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            const fills = entry.target.querySelectorAll('.skill-bar__fill');
                            fills.forEach((fill, index) => {
                                setTimeout(() => {
                                    fill.style.width = fill.getAttribute('data-level') + '%';
                                }, index * 150);
                            });
                            observer.unobserve(entry.target);
                        }
                    });
                },
                { threshold: 0.2 }
            );

            document.querySelectorAll('.skill-category').forEach(cat => observer.observe(cat));
        }
    };

    // ==========================================
    // 6. COUNTER ANIMATION
    // ==========================================
    const CounterAnimation = {
        init() {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            this.animateCounter(entry.target);
                            observer.unobserve(entry.target);
                        }
                    });
                },
                { threshold: 0.5 }
            );

            document.querySelectorAll('[data-target]').forEach(el => observer.observe(el));
        },

        animateCounter(el) {
            const target = parseInt(el.getAttribute('data-target'), 10);
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            const update = () => {
                current += step;
                if (current < target) {
                    el.textContent = Math.floor(current) + '+';
                    requestAnimationFrame(update);
                } else {
                    el.textContent = target + '+';
                }
            };

            requestAnimationFrame(update);
        }
    };

    // ==========================================
    // 7. PROJECT FILTER
    // ==========================================
    const ProjectFilter = {
        init() {
            const filterBtns = document.querySelectorAll('[data-filter]');
            const cards = document.querySelectorAll('.project-card');

            if (!filterBtns.length || !cards.length) return;

            filterBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const filter = btn.getAttribute('data-filter');

                    // Update active button
                    filterBtns.forEach(b => {
                        b.classList.remove('active');
                        b.setAttribute('aria-pressed', 'false');
                    });
                    btn.classList.add('active');
                    btn.setAttribute('aria-pressed', 'true');

                    // Filter cards
                    cards.forEach(card => {
                        const category = card.getAttribute('data-category');
                        if (filter === 'all' || category === filter) {
                            card.classList.remove('hidden');
                            card.style.opacity = '0';
                            card.style.transform = 'scale(0.9)';
                            requestAnimationFrame(() => {
                                card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                                card.style.opacity = '1';
                                card.style.transform = 'scale(1)';
                            });
                        } else {
                            card.style.opacity = '0';
                            card.style.transform = 'scale(0.9)';
                            setTimeout(() => card.classList.add('hidden'), 300);
                        }
                    });
                });
            });
        }
    };

    // ==========================================
    // 8. CONTACT FORM
    // ==========================================
    const ContactForm = {
        form: null,

        init() {
            this.form = document.getElementById('contact-form');
            if (!this.form) return;

            // Real-time validation
            this.form.querySelectorAll('.form-group__input, .form-group__textarea').forEach(input => {
                input.addEventListener('blur', () => this.validateField(input));
                input.addEventListener('input', () => {
                    if (input.classList.contains('error')) {
                        this.validateField(input);
                    }
                });
            });

            // Submit
            this.form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSubmit();
            });
        },

        validateField(input) {
            const name = input.getAttribute('name');
            const value = input.value.trim();
            let isValid = true;

            switch (name) {
                case 'name':
                    isValid = value.length >= 2;
                    break;
                case 'email':
                    isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
                    break;
                case 'subject':
                    isValid = value.length >= 5;
                    break;
                case 'message':
                    isValid = value.length >= 20;
                    break;
            }

            if (isValid) {
                input.classList.remove('error');
                input.setAttribute('aria-invalid', 'false');
            } else {
                input.classList.add('error');
                input.setAttribute('aria-invalid', 'true');
            }

            return isValid;
        },

        handleSubmit() {
            // Honeypot check
            const honeypot = this.form.querySelector('[name="website"]');
            if (honeypot && honeypot.value) return;

            // Validate all fields
            const fields = this.form.querySelectorAll('.form-group__input, .form-group__textarea');
            let allValid = true;

            fields.forEach(field => {
                if (field.name !== 'website') {
                    if (!this.validateField(field)) allValid = false;
                }
            });

            if (!allValid) return;

            // Simulate submission
            const submitBtn = document.getElementById('submit-btn');
            submitBtn.classList.add('btn--loading');
            submitBtn.disabled = true;

            setTimeout(() => {
                submitBtn.classList.remove('btn--loading');
                submitBtn.disabled = false;
                this.form.reset();

                // Remove error states
                fields.forEach(f => {
                    f.classList.remove('error');
                    f.setAttribute('aria-invalid', 'false');
                });

                Toast.show('Message sent successfully! I\'ll get back to you soon.', 'success');
            }, 1500);
        }
    };

    // ==========================================
    // 9. MODAL
    // ==========================================
    const Modal = {
        modal: null,
        previousFocus: null,

        init() {
            this.modal = document.getElementById('project-modal');
            if (!this.modal) return;

            // Open modal from project cards
            document.querySelectorAll('[data-action="details"]').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const card = btn.closest('.project-card');
                    const data = JSON.parse(card.getAttribute('data-project'));
                    this.open(data, card);
                });
            });

            // Also open on card click
            document.querySelectorAll('.project-card').forEach(card => {
                card.addEventListener('click', () => {
                    const data = JSON.parse(card.getAttribute('data-project'));
                    this.open(data, card);
                });
            });

            // Close handlers
            document.querySelectorAll('[data-modal-close]').forEach(el => {
                el.addEventListener('click', () => this.close());
            });

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.modal.classList.contains('open')) {
                    this.close();
                }
            });
        },

        open(data, card) {
            this.previousFocus = document.activeElement;

            // Populate modal
            const image = card.querySelector('.project-card__img');
            const modalImage = document.getElementById('modal-image');
            modalImage.style.background = image.style.background;
            modalImage.style.display = 'flex';
            modalImage.style.alignItems = 'center';
            modalImage.style.justifyContent = 'center';
            modalImage.style.color = 'white';
            modalImage.style.fontSize = '4rem';
            modalImage.textContent = image.textContent;

            document.getElementById('modal-title').textContent = data.title;
            document.getElementById('modal-description').textContent = data.description;

            const techContainer = document.getElementById('modal-tech');
            techContainer.innerHTML = data.tech.map(t =>
                `<span class="project-card__tag">${t}</span>`
            ).join('');

            document.getElementById('modal-live-link').href = data.live;
            document.getElementById('modal-code-link').href = data.code;

            // Show modal
            this.modal.classList.add('open');
            this.modal.setAttribute('aria-hidden', 'false');
            document.body.classList.add('no-scroll');

            // Focus first focusable element
            const closeBtn = this.modal.querySelector('.modal__close');
            if (closeBtn) closeBtn.focus();
        },

        close() {
            this.modal.classList.remove('open');
            this.modal.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('no-scroll');

            if (this.previousFocus) {
                this.previousFocus.focus();
            }
        }
    };

    // ==========================================
    // 10. TOAST NOTIFICATIONS
    // ==========================================
    const Toast = {
        element: null,
        timeout: null,

        show(message, type = 'success') {
            this.element = document.getElementById('toast');
            if (!this.element) return;

            const messageEl = document.getElementById('toast-message');
            const iconEl = document.getElementById('toast-icon');

            messageEl.textContent = message;

            // Reset classes
            this.element.classList.remove('toast--success', 'toast--error');
            this.element.classList.add(`toast--${type}`);

            // Update icon
            if (type === 'success') {
                iconEl.innerHTML = '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>';
            } else {
                iconEl.innerHTML = '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>';
            }

            // Show
            this.element.classList.add('show');

            // Auto hide
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                this.element.classList.remove('show');
            }, 4000);
        }
    };

    // ==========================================
    // 11. BACK TO TOP
    // ==========================================
    const BackToTop = {
        init() {
            const btn = document.getElementById('back-to-top');
            if (!btn) return;

            window.addEventListener('scroll', throttle(() => {
                if (window.scrollY > 500) {
                    btn.classList.add('visible');
                } else {
                    btn.classList.remove('visible');
                }
            }, 100));

            btn.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
    };

    // ==========================================
    // INITIALIZATION
    // ==========================================
    document.addEventListener('DOMContentLoaded', () => {
        ThemeManager.init();
        Navigation.init();
        TypingEffect.init();
        ScrollAnimations.init();
        SkillBars.init();
        CounterAnimation.init();
        ProjectFilter.init();
        ContactForm.init();
        Modal.init();
        BackToTop.init();
    });

})();
