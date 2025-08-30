document.addEventListener('DOMContentLoaded', function() {
    
    // Sticky Navbar on Scroll
    const navbar = document.getElementById('navbar');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add/remove scrolled class for styling
        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Prevent navbar from hiding (always visible)
        navbar.style.top = '0';
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });

    // Navbar Navigation
    const navItems = document.querySelectorAll('.navbar ul li');
    navItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            navItems.forEach(navItem => navItem.classList.remove('active'));
            // Add active class to clicked item
            this.classList.add('active');
        });
    });

    // Recommendations Carousel
    const track = document.querySelector('.carousel-track');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    const indicators = document.querySelectorAll('.indicator');

    if (track && prevBtn && nextBtn) {
        const originalCards = 3; // Number of original recommendation cards
        const cards = track.querySelectorAll('.rec-card');
        const totalCards = cards.length;
        
        // Get card width dynamically
        let cardWidth = 0;
        if (cards[0]) {
            const cardStyle = getComputedStyle(cards[0]);
            cardWidth = cards[0].offsetWidth + 30; // 30px gap
        } else {
            cardWidth = 350; // fallback
        }

        let currentIndex = 1; // Start at position 1
        
        function updateCarousel(smooth = true) {
            if (smooth) {
                track.style.transition = 'transform 0.5s ease';
            } else {
                track.style.transition = 'none';
            }
            
            track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
            
            // Update indicators
            const actualProfile = (currentIndex - 1) % originalCards;
            indicators.forEach((indicator, i) => {
                indicator.classList.toggle('active', i === actualProfile);
            });
        }

        function nextSlide() {
            currentIndex++;
            updateCarousel();
            
            // Reset to beginning if at end
            setTimeout(() => {
                if (currentIndex >= totalCards - 2) {
                    currentIndex = 1;
                    updateCarousel(false);
                }
            }, 500);
        }

        function prevSlide() {
            currentIndex--;
            updateCarousel();
            
            // Reset to end if at beginning
            setTimeout(() => {
                if (currentIndex <= 0) {
                    currentIndex = originalCards;
                    updateCarousel(false);
                }
            }, 500);
        }

        // Button event listeners
        nextBtn.addEventListener('click', nextSlide);
        prevBtn.addEventListener('click', prevSlide);

        // Indicator click handlers
        indicators.forEach((indicator, i) => {
            indicator.addEventListener('click', () => {
                currentIndex = i + 1;
                updateCarousel();
            });
        });

        // Auto-play functionality
        let autoPlayInterval = setInterval(() => {
            nextSlide();
        }, 5000);

        // Pause auto-play on hover
        const carousel = document.querySelector('.carousel');
        if (carousel) {
            carousel.addEventListener('mouseenter', () => {
                clearInterval(autoPlayInterval);
            });

            carousel.addEventListener('mouseleave', () => {
                autoPlayInterval = setInterval(() => {
                    nextSlide();
                }, 5000);
            });
        }

        // Initialize carousel position
        updateCarousel(false);

        // Update card width on window resize
        window.addEventListener('resize', () => {
            if (cards[0]) {
                cardWidth = cards[0].offsetWidth + 30;
                updateCarousel(false);
            }
        });
    }

    // Contact Form Handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formFields = contactForm.querySelectorAll('input, textarea');
            
            // Basic form validation
            let isValid = true;
            formFields.forEach(field => {
                if (field.hasAttribute('required') && !field.value.trim()) {
                    field.style.borderColor = '#ef4444';
                    field.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
                    isValid = false;
                } else {
                    field.style.borderColor = '#e5e7eb';
                    field.style.boxShadow = 'none';
                }
            });
            
            // Email validation
            const emailField = contactForm.querySelector('input[type="email"]');
            if (emailField && emailField.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(emailField.value)) {
                    emailField.style.borderColor = '#ef4444';
                    emailField.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
                    isValid = false;
                }
            }
            
            if (isValid) {
                // Form submission success feedback
                const submitBtn = contactForm.querySelector('.btn');
                const originalText = submitBtn.textContent;
                
                submitBtn.textContent = 'SENDING...';
                submitBtn.disabled = true;
                submitBtn.style.background = '#9ca3af';
                submitBtn.style.cursor = 'not-allowed';
                
                // Simulate form submission
                setTimeout(() => {
                    submitBtn.textContent = 'MESSAGE SENT!';
                    submitBtn.style.background = '#10b981';
                    
                    // Reset form after success
                    setTimeout(() => {
                        contactForm.reset();
                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;
                        submitBtn.style.background = '#fbbf24';
                        submitBtn.style.cursor = 'pointer';
                        
                        // Reset all field styles
                        formFields.forEach(field => {
                            field.style.borderColor = '#e5e7eb';
                            field.style.boxShadow = 'none';
                        });
                    }, 2000);
                }, 1500);
            } else {
                // Shake animation for invalid form
                contactForm.style.animation = 'shake 0.5s ease-in-out';
                setTimeout(() => {
                    contactForm.style.animation = '';
                }, 500);
            }
        });
    }

    // Enhanced form interactions
    document.querySelectorAll('.contact-left input, .contact-left textarea').forEach(input => {
        input.addEventListener('focus', function() {
            this.style.transform = 'scale(1.02)';
            this.parentElement.style.position = 'relative';
            this.parentElement.style.zIndex = '10';
        });
        
        input.addEventListener('blur', function() {
            this.style.transform = 'scale(1)';
            this.parentElement.style.zIndex = '1';
        });

        // Real-time validation feedback
        input.addEventListener('input', function() {
            if (this.hasAttribute('required') && this.value.trim()) {
                this.style.borderColor = '#10b981';
                this.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
            } else if (this.hasAttribute('required')) {
                this.style.borderColor = '#e5e7eb';
                this.style.boxShadow = 'none';
            }
        });
    });

    // Footer Interactive Elements
    
    // Rating card hover animations
    const ratingCards = document.querySelectorAll('.rating-card');
    ratingCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.02)';
            this.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
        });
    });

    // Footer link hover effects
    const linkItems = document.querySelectorAll('.links-list li');
    linkItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(5px)';
            this.style.color = '#667eea';
            this.style.fontWeight = '600';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
            this.style.color = '#666';
            this.style.fontWeight = '500';
        });
    });

    // Social link hover effects
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(5px) scale(1.05)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0) scale(1)';
        });
    });

    // Logo hover effects
    const logoItems = document.querySelectorAll('.logo-item');
    logoItems.forEach(logo => {
        logo.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.05)';
        });
        
        logo.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Glasses hover animation
    const glasses = document.querySelector('.glasses');
    if (glasses) {
        glasses.addEventListener('mouseenter', function() {
            const img = this.querySelector('img');
            if (img) {
                img.style.animation = 'none';
                img.style.transform = 'scale(1.1) rotate(5deg)';
                img.style.transition = 'all 0.3s ease';
            }
        });
        
        glasses.addEventListener('mouseleave', function() {
            const img = this.querySelector('img');
            if (img) {
                img.style.transform = 'scale(1) rotate(0deg)';
                setTimeout(() => {
                    img.style.animation = 'float 4s ease-in-out infinite';
                }, 300);
            }
        });
    }

    // Project card animations
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
            this.style.boxShadow = '0 12px 50px rgba(0, 0, 0, 0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
        });
    });

    // Smooth scrolling for navigation
    navItems.forEach((item, index) => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            const sections = ['hero', 'projects', 'recommendations', 'contact'];
            const targetSection = sections[index] || 'hero';
            const targetElement = document.querySelector(`.${targetSection}`) || document.querySelector(`#${targetSection}`);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add CSS for shake animation
    const shakeStyle = document.createElement('style');
    shakeStyle.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
    `;
    document.head.appendChild(shakeStyle);

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe sections for animations
    const sections = document.querySelectorAll('.projects, .recommendations, .contact, .footer-container');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'all 0.6s ease';
        observer.observe(section);
    });

    // Handle image loading errors with fallbacks
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', function() {
            // Create a simple colored placeholder
            const canvas = document.createElement('canvas');
            canvas.width = 200;
            canvas.height = 150;
            const ctx = canvas.getContext('2d');
            
            // Random color background
            const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#43e97b'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            
            ctx.fillStyle = randomColor;
            ctx.fillRect(0, 0, 200, 150);
            ctx.fillStyle = 'white';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Image', 100, 80);
            
            this.src = canvas.toDataURL();
            this.alt = 'Placeholder image';
        });
    });

    console.log('Portfolio website initialized successfully!');
});