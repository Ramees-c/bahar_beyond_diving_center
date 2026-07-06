document.addEventListener('DOMContentLoaded', function () {
    // Helper function to build lists in modals
    const buildList = (modal, containerId, items) => {
        const container = modal.querySelector(`#${containerId}`);
        if (container) {
            container.innerHTML = items ? items.map(item =>
                `<li class="mb-2"><i class="bi bi-check2-circle text-accent me-2"></i>${item}</li>`
            ).join('') : '';
        }
    };

    // Course Modal Logic
    const courseModal = document.getElementById('courseDetailModal');
    if (courseModal) {
        courseModal.addEventListener('show.bs.modal', function (event) {
            const button = event.relatedTarget;
            const courseId = button.getAttribute('data-course');
            const data = window.courseData ? window.courseData[courseId] : null;
    // Course and Package Modal Logic is now handled by inline scripts in their respective Blade files
    // to allow for dynamic content and conditional display based on data presence.

            if (!data) return;

            // Update content
            courseModal.querySelector('#modalCourseTitle').textContent = data.title;
            courseModal.querySelector('#modalCoursePrice').textContent = data.price;
            courseModal.querySelector('#modalCourseLevel').textContent = data.level;
            courseModal.querySelector('#modalCourseDuration').textContent = data.duration;
            courseModal.querySelector('#modalCourseDepth').textContent = data.depth;
            courseModal.querySelector('#modalCourseAge').textContent = data.age;
            courseModal.querySelector('#modalCourseOverview').textContent = data.overview;

            buildList(courseModal, 'modalCourseIncludes', data.includes);
            buildList(courseModal, 'modalCourseRequirements', data.requirements);
            buildList(courseModal, 'modalCourseWillLearn', data.willLearn);
            buildList(courseModal, 'modalCourseBenefits', data.benefits);
        });
    }

    // Package Modal Logic
    const packageModal = document.getElementById('packageDetailModal');
    if (packageModal) {
        packageModal.addEventListener('show.bs.modal', function (event) {
            const button = event.relatedTarget;
            const packageId = button.getAttribute('data-package');
            const data = window.packageData ? window.packageData[packageId] : null;

            if (!data) return;

            // Update content
            packageModal.querySelector('#modalPackageTitle').textContent = data.title;
            packageModal.querySelector('#modalPackagePrice').textContent = data.price;
            packageModal.querySelector('#modalPackageLevel').textContent = data.level;
            packageModal.querySelector('#modalPackageDuration').textContent = data.duration;
            packageModal.querySelector('#modalPackageLocation').textContent = data.location;
            packageModal.querySelector('#modalPackageGroup').textContent = data.groupSize;
            packageModal.querySelector('#modalPackageOverview').textContent = data.overview;

            buildList(packageModal, 'modalPackageIncludes', data.includes);
            buildList(packageModal, 'modalPackageItinerary', data.itinerary);
            buildList(packageModal, 'modalPackageRequirements', data.requirements);
        });
    }

    // Page Loader Logic
    window.addEventListener('load', function() {
        const loader = document.getElementById('loader-wrapper');
        if (loader) {
            loader.classList.add('loader-hidden');
        }
    });

    // Navbar scroll effect
    const navbar = document.getElementById('mainNav');

    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Check initial scroll position
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if open
                const navbarToggler = document.querySelector('.navbar-toggler');
                const navbarCollapse = document.querySelector('.navbar-collapse');

                const offset = 80;
                const scrollToTarget = () => {
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - offset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                };

                if (navbarCollapse.classList.contains('show')) {
                    // If menu is open, close it and then scroll after it's hidden
                    navbarCollapse.addEventListener('hidden.bs.collapse', function handler() {
                        scrollToTarget();
                        navbarCollapse.removeEventListener('hidden.bs.collapse', handler); // Remove listener after use
                    });
                    navbarToggler.click(); // Trigger collapse
                } else {
                    // If menu is not open, scroll immediately
                    scrollToTarget();
                }
            }
        });
    });


    // Add smooth reveal animations with stagger effect
    const animateElements = document.querySelectorAll('.card, .icon-box, .img-wrapper, .accordion-item, .how-card, .cert-card, .contact-method-card, .contact-glass-form, .subtitle, h2, .journey-card, .journey-stat-card, .cert-glass-panel, .gallery-card, .animateElements');

    // Set initial state
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px)';
        el.style.transition = 'opacity 1.2s cubic-bezier(0.165, 0.84, 0.44, 1), transform 1.2s cubic-bezier(0.165, 0.84, 0.44, 1)';
    });

    let delayCounter = 0;
    let delayTimer = null;

    function startCounter(el) {
        if (el.dataset.started) return;
        el.dataset.started = 'true';

        const target = +el.getAttribute('data-target');
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 1500; // Animation duration in ms
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const value = Math.floor(progress * target);

            el.textContent = value + suffix;

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = target + suffix;
            }
        }
        requestAnimationFrame(update);
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Apply a stagger delay for elements that appear at the same time
                const delay = delayCounter * 100; // 100ms stagger between elements
                entry.target.style.transitionDelay = `${delay}ms`;

                // Trigger the reveal animation
                requestAnimationFrame(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';

                    // Start counter for any .counter elements found within the revealing container
                    entry.target.querySelectorAll('.counter').forEach(counter => {
                        startCounter(counter);
                    });
                });

                observer.unobserve(entry.target);

                delayCounter++;

                // Reset the counter when the burst of intersections is over
                clearTimeout(delayTimer);
                delayTimer = setTimeout(() => {
                    delayCounter = 0;
                }, 100);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });

    animateElements.forEach(el => {
        observer.observe(el);
    });

    // Testimonials Slider Initialization
    if (document.querySelector('.testimonials-swiper')) {
        new Swiper('.testimonials-swiper', {
            slidesPerView: 1,
            spaceBetween: 20,
            loop: true,
            speed: 800,
            autoplay: {
                delay: 4000,
                disableOnInteraction: false,
            },
            breakpoints: {
                992: {
                    slidesPerView: 2,
                }
            }
        });
    }

    // Gallery Lightbox Logic
    const galleryMasonry = document.querySelector('.gallery-masonry-container');
    if (galleryMasonry) {
        const modalElement = document.getElementById('galleryModal');
        const mainWrapper = document.getElementById('gallery-wrapper-main');
        const thumbsWrapper = document.getElementById('gallery-wrapper-thumbs');
        let gallerySwiper = null;
        let thumbsSwiper = null;

        // Destroy existing swipers and rebuild slides from current DOM images.
        // Called every time the modal opens so lazy-loaded images are included.
        const buildSwipers = (startIndex) => {
            // Destroy old instances
            if (gallerySwiper) { gallerySwiper.destroy(true, true); gallerySwiper = null; }
            if (thumbsSwiper)  { thumbsSwiper.destroy(true, true);  thumbsSwiper  = null; }

            // Clear wrappers
            mainWrapper.innerHTML  = '';
            thumbsWrapper.innerHTML = '';

            // Build slides from every visible gallery image
            const images = galleryMasonry.querySelectorAll('.gallery-card img');
            images.forEach(img => {
                mainWrapper.insertAdjacentHTML('beforeend',
                    `<div class="swiper-slide d-flex align-items-center justify-content-center">
                        <img src="${img.src}" alt="${img.alt}">
                    </div>`
                );
                thumbsWrapper.insertAdjacentHTML('beforeend',
                    `<div class="swiper-slide"><img src="${img.src}" alt="${img.alt}"></div>`
                );
            });

            thumbsSwiper = new Swiper('.gallery-thumbs-swiper', {
                spaceBetween: 8,
                slidesPerView: 4,
                centeredSlides: false,
                watchSlidesProgress: true,
                slideToClickedSlide: true,
                breakpoints: {
                    400:  { slidesPerView: 5  },
                    576:  { slidesPerView: 6  },
                    768:  { slidesPerView: 8  },
                    1200: { slidesPerView: 11 }
                }
            });

            gallerySwiper = new Swiper('.gallery-main-swiper', {
                spaceBetween: 10,
                initialSlide: startIndex,   // ← start on the correct slide, no flash
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                keyboard: { enabled: true },
                thumbs: { swiper: thumbsSwiper },
            });
        };

        // Use event delegation so dynamically injected (lazy-loaded) cards also work
        galleryMasonry.addEventListener('click', function (e) {
            const card = e.target.closest('.gallery-card');
            if (!card) return;

            // Determine clicked index among ALL current cards
            const allCards = Array.from(galleryMasonry.querySelectorAll('.gallery-card'));
            const index = allCards.indexOf(card);
            if (index === -1) return;

            // Build swipers with correct starting slide BEFORE modal opens → no flash
            buildSwipers(index);

            bootstrap.Modal.getOrCreateInstance(modalElement).show();

            // After the modal finishes opening, update layout (handles hidden-container sizing)
            modalElement.addEventListener('shown.bs.modal', () => {
                gallerySwiper.update();
                thumbsSwiper.update();
            }, { once: true });
        });

        // Clean up on modal close so next open always rebuilds fresh
        modalElement.addEventListener('hidden.bs.modal', () => {
            if (gallerySwiper) { gallerySwiper.destroy(true, true); gallerySwiper = null; }
            if (thumbsSwiper)  { thumbsSwiper.destroy(true, true);  thumbsSwiper  = null; }
            mainWrapper.innerHTML  = '';
            thumbsWrapper.innerHTML = '';
        });
    }

    // Popup Alert (centered, styled, with OK button)
    window.showPopupAlert = function(type, message, options = {}) {
        const existing = document.getElementById('custom-popup-alert');
        if (existing) existing.remove();

        const overlay = document.createElement('div');
        overlay.id = 'custom-popup-alert';
        overlay.style.position = 'fixed';
        overlay.style.inset = '0';
        overlay.style.display = 'flex';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';
        overlay.style.zIndex = '2000';
        overlay.style.background = 'rgba(var(--bg-darker-rgb, 6, 11, 15), 0)';
        overlay.style.transition = 'background 300ms cubic-bezier(0.4, 0, 0.2, 1)';

        const panel = document.createElement('div');
        panel.setAttribute('role', 'alertdialog');
        panel.setAttribute('aria-modal', 'true');
        panel.style.minWidth = '280px';
        panel.style.maxWidth = '480px';
        panel.style.background = 'rgba(var(--bg-card-rgb, 20, 56, 64), 0.6)';
        panel.style.backdropFilter = 'blur(20px) saturate(150%)';
        panel.style.webkitBackdropFilter = 'blur(20px) saturate(150%)';
        panel.style.borderRadius = '1.5rem'; // 24px
        panel.style.padding = '2rem';
        panel.style.border = '1px solid rgba(var(--accent-rgb, 93, 211, 232), 0.15)';
        panel.style.boxShadow = '0 20px 50px rgba(0,0,0,0.4)';
        panel.style.textAlign = 'center';
        panel.style.transform = 'translateY(20px)';
        panel.style.opacity = '0';
        panel.style.transition = 'opacity 300ms cubic-bezier(0.4, 0, 0.2, 1), transform 300ms cubic-bezier(0.4, 0, 0.2, 1)';

        const colors = {
            success: {bg: 'rgba(var(--accent-rgb, 93, 211, 232), 0.1)', color: 'var(--text-primary, #f0f4f7)', accent: 'var(--accent, #5dd3e8)'},
            error: {bg: 'rgba(255, 107, 107, 0.1)', color: 'var(--text-primary, #f0f4f7)', accent: '#ff6b6b'},
            info: {bg: 'rgba(var(--accent-secondary-rgb, 42, 157, 181), 0.1)', color: 'var(--text-primary, #f0f4f7)', accent: 'var(--accent-secondary, #2a9db5)'}
        };

        const cfg = colors[type] || colors.info;

        const iconWrap = document.createElement('div');
        iconWrap.style.width = '56px';
        iconWrap.style.height = '56px';
        iconWrap.style.margin = '0 auto 1rem auto';
        iconWrap.style.display = 'flex';
        iconWrap.style.alignItems = 'center';
        iconWrap.style.justifyContent = 'center';
        iconWrap.style.borderRadius = '50%';
        iconWrap.style.background = cfg.bg;
        iconWrap.style.border = `1px solid ${cfg.accent}`;

        const icon = document.createElement('div');
        icon.innerHTML = type === 'success' ?
            `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 12.5l2 2 4-5" stroke="${cfg.accent}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>` :
            `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 9v4" stroke="${cfg.accent}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 17h.01" stroke="${cfg.accent}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
        iconWrap.appendChild(icon);

        const title = document.createElement('h4');
        title.className = 'font-outfit';
        title.style.margin = '0 0 0.5rem 0';
        title.style.fontSize = '1.5rem';
        title.style.fontWeight = '600';
        title.style.color = 'var(--text-primary, #f0f4f7)';
        title.textContent = type === 'success' ? 'Success' : (type === 'error' ? 'Error' : 'Info');

        const text = document.createElement('p');
        text.style.margin = '0 0 0 0';
        text.style.fontSize = '1rem';
        text.style.color = 'var(--text-muted, #8fa8b5)';
        text.style.lineHeight = '1.6';
        text.textContent = message || '';

        const actions = document.createElement('div');
        actions.style.marginTop = '18px';

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = options.okText || 'OK';
        btn.className = 'btn btn-accent mt-2 px-4'; // Use the existing .btn-accent style
        actions.appendChild(btn);

        panel.appendChild(iconWrap);
        panel.appendChild(title);
        panel.appendChild(text);
        panel.appendChild(actions);
        overlay.appendChild(panel);
        document.body.appendChild(overlay);

        // Trigger animation
        requestAnimationFrame(() => {
            overlay.style.background = 'rgba(var(--bg-darker-rgb, 6, 11, 15), 0.6)';
            panel.style.opacity = '1';
            panel.style.transform = 'translateY(0)';
        });

        // Focus and interactions
        btn.focus();

        const cleanup = () => {
            panel.style.opacity = '0';
            panel.style.transform = 'translateY(20px)';
            overlay.style.background = 'rgba(var(--bg-darker-rgb, 6, 11, 15), 0)';
            setTimeout(() => {
                if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
            }, 300);
        };

        btn.addEventListener('click', () => {
            cleanup();
            if (typeof options.onClose === 'function') options.onClose();
        });

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay && options.dismissible !== false) {
                cleanup();
                if (typeof options.onClose === 'function') options.onClose();
            }
        });

        const escHandler = (e) => {
            if (e.key === 'Escape') {
                cleanup();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);
    };

    // Contact Form Validation
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (event) {
            event.preventDefault();
            event.stopPropagation();

            if (!contactForm.checkValidity()) {
                contactForm.classList.add('was-validated');
            } else {
                const btn = contactForm.querySelector('button[type="submit"]');
                const originalText = btn.innerHTML;

                // Set loading state
                btn.disabled = true;
                btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>SENDING...';

                const formData = new FormData(contactForm);
                const action = contactForm.getAttribute('action') || '/contact-send';

                fetch(action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'Accept': 'application/json'
                    }
                })
                .then(async response => {
                    const data = await response.json();
                    if (!response.ok) throw new Error(data.message || 'Something went wrong');
                    return data;
                })
                .then(data => {
                    if (window.showPopupAlert) {
                        window.showPopupAlert('success', data.message || 'Your message has been sent successfully!');
                    }
                    contactForm.reset();
                    contactForm.classList.remove('was-validated');
                })
                .catch(error => {
                    if (window.showPopupAlert) {
                        window.showPopupAlert('error', error.message || 'Failed to send message. Please try again later.');
                    }
                })
                .finally(() => {
                    btn.disabled = false;
                    btn.innerHTML = originalText;
                });
            }
        }, false);
    }
});
