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

    // Active link highlighting on scroll (only for index.html sections)
    const sections = document.querySelectorAll('section, header');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const currentPath = window.location.pathname;
    const isHomePage = currentPath.endsWith('index.html') || currentPath === '/' || currentPath.endsWith('/');

    window.addEventListener('scroll', () => {
        if (isHomePage) {
            let current = '';
            const scrollY = window.pageYOffset;

            sections.forEach(section => {
                const sectionHeight = section.offsetHeight;
                const sectionTop = section.offsetTop - 100;
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                const href = link.getAttribute('href');
                link.classList.remove('active');
                if (href === `#${current}` || (current === 'home' && (href === 'index.html' || href === '#' || href === ''))) {
                    link.classList.add('active');
                }
            });
        }
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
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
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

        const initGallerySwipers = () => {
            if (gallerySwiper) return; // Initialize only once

            const images = galleryMasonry.querySelectorAll('.gallery-card img');
            images.forEach(img => {
                const mainSlide = `<div class="swiper-slide d-flex align-items-center justify-content-center">
                    <img src="${img.src}" alt="${img.alt}">
                </div>`;
                const thumbSlide = `<div class="swiper-slide">
                    <img src="${img.src}" alt="${img.alt}">
                </div>`;
                mainWrapper.insertAdjacentHTML('beforeend', mainSlide);
                thumbsWrapper.insertAdjacentHTML('beforeend', thumbSlide);
            });

            thumbsSwiper = new Swiper('.gallery-thumbs-swiper', {
                spaceBetween: 10,
                slidesPerView: 3, // Default for very small screens
                freeMode: true,
                watchSlidesProgress: true,
                breakpoints: {
                    400: { slidesPerView: 4 },
                    576: { slidesPerView: 5 },
                    768: { slidesPerView: 7 },
                    1200: { slidesPerView: 10 }
                }
            });

            gallerySwiper = new Swiper('.gallery-main-swiper', {
                spaceBetween: 10,
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                keyboard: {
                    enabled: true,
                },
                thumbs: {
                    swiper: thumbsSwiper,
                },
            });
        };

        const cards = galleryMasonry.querySelectorAll('.gallery-card');
        cards.forEach((card, index) => {
            card.addEventListener('click', () => {
                initGallerySwipers();
                const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
                modal.show();
                
                modalElement.addEventListener('shown.bs.modal', () => {
                    gallerySwiper.update();
                    thumbsSwiper.update();
                    gallerySwiper.slideTo(index, 0);
                }, { once: true });
            });
        });
    }

    // Contact Form Validation
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (event) {
            if (!contactForm.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            } else {
                event.preventDefault();
                // Success logic could go here (e.g., AJAX submission)
            }
            contactForm.classList.add('was-validated');
        }, false);
    }
});
