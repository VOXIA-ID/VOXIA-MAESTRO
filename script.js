// Trading Assistant - Simple & Direct Version
class TradingAssistant {
    constructor() {
        this.initializeElements();
        this.bindEvents();
        this.initializeAnimations();
    }

    initializeElements() {
        // Navigation elements
        this.backToTopBtn = document.getElementById('backToTop');
        
        // Smooth scroll for anchor links
        this.anchorLinks = document.querySelectorAll('a[href^="#"]');
    }

    bindEvents() {
        // Back to top button
        if (this.backToTopBtn) {
            window.addEventListener('scroll', () => this.toggleBackToTop());
            this.backToTopBtn.addEventListener('click', () => this.scrollToTop());
        }

        // Smooth scrolling for anchor links
        this.anchorLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleSmoothScroll(e));
        });

        // Add hover effects to cards
        this.addCardHoverEffects();
        
        // Initialize intersection observer for animations
        this.initializeIntersectionObserver();
    }

    initializeAnimations() {
        // Add entrance animations to elements
        this.animateOnScroll();
        
        // Add parallax effect to hero section
        this.addParallaxEffect();
    }

    toggleBackToTop() {
        if (window.pageYOffset > 300) {
            this.backToTopBtn.classList.add('visible');
        } else {
            this.backToTopBtn.classList.remove('visible');
        }
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    handleSmoothScroll(e) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80; // Account for sticky header
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }

    addCardHoverEffects() {
        const cards = document.querySelectorAll('.feature-card, .market-card, .testimonial-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-5px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
            });
        });
    }

    initializeIntersectionObserver() {
        const options = {
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
        }, options);

        // Observe all cards and sections
        const elementsToObserve = document.querySelectorAll(
            '.feature-card, .market-card, .testimonial-card, .step'
        );
        
        elementsToObserve.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }

    animateOnScroll() {
        // Add stagger animation to hero stats
        const stats = document.querySelectorAll('.stat');
        stats.forEach((stat, index) => {
            setTimeout(() => {
                stat.style.opacity = '1';
                stat.style.transform = 'translateY(0)';
            }, index * 200);
        });

        // Animate hero CTA buttons
        const ctaButtons = document.querySelectorAll('.hero-cta a');
        ctaButtons.forEach((btn, index) => {
            setTimeout(() => {
                btn.style.opacity = '1';
                btn.style.transform = 'translateY(0)';
            }, 1000 + (index * 200));
        });
    }

    addParallaxEffect() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const hero = document.querySelector('.hero');
            
            if (hero) {
                hero.style.transform = `translateY(${scrolled * 0.5}px)`;
            }
        });
    }

    // Utility functions
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Add typing effect to hero title
    addTypingEffect() {
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
            const text = heroTitle.textContent;
            heroTitle.textContent = '';
            heroTitle.style.borderRight = '3px solid #fbbf24';
            
            let index = 0;
            const typeWriter = () => {
                if (index < text.length) {
                    heroTitle.textContent += text.charAt(index);
                    index++;
                    setTimeout(typeWriter, 50);
                } else {
                    heroTitle.style.borderRight = 'none';
                }
            };
            
            setTimeout(typeWriter, 500);
        }
    }

    // Add counter animation for stats
    animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        
        counters.forEach(counter => {
            const target = counter.textContent;
            const isNumber = /^\d+$/.test(target);
            
            if (isNumber) {
                const targetNum = parseInt(target);
                let current = 0;
                const increment = targetNum / 50;
                
                const updateCounter = () => {
                    if (current < targetNum) {
                        current += increment;
                        counter.textContent = Math.ceil(current);
                        setTimeout(updateCounter, 30);
                    } else {
                        counter.textContent = target;
                    }
                };
                
                updateCounter();
            }
        });
    }

    // Add ripple effect to buttons
    addRippleEffect() {
        const buttons = document.querySelectorAll('.cta-primary, .cta-secondary');
        
        buttons.forEach(button => {
            button.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.classList.add('ripple');
                
                this.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
    }

    // Initialize all effects when DOM is loaded
    initializeAllEffects() {
        this.addTypingEffect();
        this.animateCounters();
        this.addRippleEffect();
    }

    // Track user interactions (optional analytics)
    trackInteraction(action, element) {
        // Simple tracking for analytics
        console.log(`User ${action}:`, element);
        
        // You can add actual analytics here
        // gtag('event', action, { 'element': element });
    }

    // Add keyboard navigation
    addKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Press 'T' to scroll to top
            if (e.key === 't' || e.key === 'T') {
                this.scrollToTop();
            }
            
            // Press 'Escape' to close any modals (if added later)
            if (e.key === 'Escape') {
                // Handle modal closing
            }
        });
    }

    // Performance optimization
    optimizeImages() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            img.loading = 'lazy';
        });
    }

    // Add loading states
    addLoadingStates() {
        const buttons = document.querySelectorAll('a[target="_blank"]');
        
        buttons.forEach(button => {
            button.addEventListener('click', function() {
                this.classList.add('loading');
                setTimeout(() => {
                    this.classList.remove('loading');
                }, 2000);
            });
        });
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new TradingAssistant();
    
    // Initialize all effects after a short delay
    setTimeout(() => {
        app.initializeAllEffects();
        app.addKeyboardNavigation();
        app.optimizeImages();
        app.addLoadingStates();
    }, 100);
    
    // Add loading complete class to body
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 500);
});

// Add CSS for ripple effect
const style = document.createElement('style');
style.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .loading {
        opacity: 0.7;
        pointer-events: none;
    }
    
    .loaded {
        overflow-x: hidden;
    }
    
    .hero-title {
        overflow: hidden;
        white-space: nowrap;
        animation: typing 3s steps(40, end);
    }
    
    @keyframes typing {
        from { width: 0 }
        to { width: 100% }
    }
    
    .stat {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .hero-cta a {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
`;
document.head.appendChild(style);

// Add smooth reveal for sections
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

// Preload critical resources
window.addEventListener('DOMContentLoaded', () => {
    // Preload font awesome
    const fontAwesome = document.createElement('link');
    fontAwesome.rel = 'preload';
    fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
    fontAwesome.as = 'style';
    document.head.appendChild(fontAwesome);
    
    // Preload Google Fonts
    const googleFonts = document.createElement('link');
    googleFonts.rel = 'preload';
    googleFonts.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap';
    googleFonts.as = 'style';
    document.head.appendChild(googleFonts);
});