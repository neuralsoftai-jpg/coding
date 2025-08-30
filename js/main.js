// Initialize particles.js
document.addEventListener('DOMContentLoaded', function() {
    // Particle.js configuration
    particlesJS('particles-js', {
        particles: {
            number: {
                value: 80,
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: ['#00f7ff', '#a200ff', '#ff00a2']
            },
            shape: {
                type: 'circle',
                stroke: {
                    width: 0,
                    color: '#000000'
                }
            },
            opacity: {
                value: 0.5,
                random: true,
                anim: {
                    enable: true,
                    speed: 1,
                    opacity_min: 0.1,
                    sync: false
                }
            },
            size: {
                value: 3,
                random: true,
                anim: {
                    enable: true,
                    speed: 2,
                    size_min: 0.1,
                    sync: false
                }
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: '#00f7ff',
                opacity: 0.4,
                width: 1
            },
            move: {
                enable: true,
                speed: 2,
                direction: 'none',
                random: true,
                straight: false,
                out_mode: 'out',
                bounce: false,
                attract: {
                    enable: true,
                    rotateX: 600,
                    rotateY: 1200
                }
            }
        },
        interactivity: {
            detect_on: 'canvas',
            events: {
                onhover: {
                    enable: true,
                    mode: 'grab'
                },
                onclick: {
                    enable: true,
                    mode: 'push'
                },
                resize: true
            },
            modes: {
                grab: {
                    distance: 140,
                    line_linked: {
                        opacity: 1
                    }
                },
                push: {
                    particles_nb: 4
                }
            }
        },
        retina_detect: true
    });

    // Initialize animations and functionality
    initAnimations();
    initNavigation();
    initForm();
    initCounters();
    initScrollAnimations();
    initServiceSelection();
});

// Navigation functionality
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Hamburger menu toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Navbar background on scroll
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(10, 10, 10, 0.98)';
            navbar.style.backdropFilter = 'blur(15px)';
        } else {
            navbar.style.background = 'rgba(10, 10, 10, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        }
    });
}

// Form handling
function initForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            try {
                const button = contactForm.querySelector('button[type="submit"]');
                const originalText = button.textContent;
                
                button.textContent = 'Sending...';
                button.disabled = true;
                
                // Send data to backend API
                const response = await fetch('http://localhost:8080/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });
                
                if (response.ok) {
                    const result = await response.json();
                    showNotification(result.message || 'Message sent successfully! We\'ll get back to you soon.', 'success');
                    contactForm.reset();
                } else {
                    const errorData = await response.json();
                    showNotification(errorData.message || 'Error sending message. Please try again.', 'error');
                }
                
            } catch (error) {
                console.error('Error:', error);
                showNotification('Network error. Please check if the backend server is running.', 'error');
            } finally {
                const button = contactForm.querySelector('button[type="submit"]');
                button.textContent = originalText;
                button.disabled = false;
            }
        });
    }
}

// Counter animation
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const speed = 2000; // The lower the slower
    
    counters.forEach(counter => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-count');
            const count = +counter.innerText;
            
            // Lower value to make counting faster
            const inc = target / speed;
            
            if (count < target) {
                counter.innerText = Math.ceil(count + inc);
                setTimeout(updateCount, 1);
            } else {
                counter.innerText = target;
            }
        };
        
        // Start counter when section is in view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCount();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(counter);
    });
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all sections and cards
    const animatedElements = document.querySelectorAll(
        '.service-card, .feature, .portfolio-item, .pricing-card, .about-content > *'
    );
    
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// General animations
function initAnimations() {
    // Hero text animation
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        heroTitle.style.opacity = '0';
        heroTitle.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            heroTitle.style.transition = 'all 1s ease-out';
            heroTitle.style.opacity = '1';
            heroTitle.style.transform = 'translateY(0)';
        }, 500);
    }

    // Floating cube animation
    const cube = document.querySelector('.floating-cube');
    if (cube) {
        setInterval(() => {
            cube.style.transform = `rotate(${Math.random() * 360}deg)`;
        }, 6000);
    }

    // Typewriter effect for hero subtitle
    const subtitle = document.querySelector('.hero-subtitle');
    if (subtitle) {
        const text = subtitle.textContent;
        subtitle.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                subtitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        };
        
        setTimeout(typeWriter, 1000);
    }
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 10px;
        max-width: 400px;
        animation: slideIn 0.3s ease;
    `;
    
    if (type === 'success') {
        notification.style.background = 'linear-gradient(135deg, #00f7ff, #00b3b8)';
    } else if (type === 'error') {
        notification.style.background = 'linear-gradient(135deg, #ff4757, #ff6b81)';
    } else {
        notification.style.background = 'linear-gradient(135deg, #a200ff, #7d00c8)';
    }
    
    notification.querySelector('button').style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        padding: 0;
        margin-left: 10px;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Add CSS for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .notification {
        animation: slideIn 0.3s ease;
    }
`;
document.head.appendChild(notificationStyles);

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    
    if (hero) {
        hero.style.backgroundPosition = `center ${rate}px`;
    }
});

// Mouse move effects
document.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('.service-card, .feature, .portfolio-item');
    
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        if (x > 0 && x < rect.width && y > 0 && y < rect.height) {
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `
                perspective(1000px) 
                rotateX(${rotateX}deg) 
                rotateY(${rotateY}deg) 
                translateZ(10px)
            `;
        } else {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        }
    });
});

// Preloader (optional)
window.addEventListener('load', () => {
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 1000);
});

// Add some utility functions
function debounce(func, wait) {
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

// Service selection functionality
let selectedServices = new Set();

function toggleService(serviceId) {
    const serviceCard = document.querySelector(`[data-service="${serviceId}"]`);
    const button = serviceCard.querySelector('.service-select-btn');
    
    if (selectedServices.has(serviceId)) {
        // Deselect service
        selectedServices.delete(serviceId);
        button.textContent = '';
        button.style.background = '';
        button.style.boxShadow = '';
        serviceCard.style.borderColor = 'rgba(255, 255, 255, 0.1)';
    } else {
        // Select service
        selectedServices.add(serviceId);
        button.textContent = 'Selected ✓';
        button.style.background = 'var(--gradient-primary)';
        button.style.boxShadow = 'var(--glow-blue)';
        serviceCard.style.borderColor = 'var(--accent-blue)';
    }
    
    updateSelectedServicesList();
    updateGetQuoteButton();
}

function updateSelectedServicesList() {
    const selectedList = document.getElementById('selectedList');
    const noSelection = selectedList.querySelector('.no-selection');
    
    if (selectedServices.size === 0) {
        noSelection.style.display = 'block';
        selectedList.innerHTML = '<p class="no-selection">No services selected yet</p>';
        return;
    }
    
    noSelection.style.display = 'none';
    selectedList.innerHTML = '';
    
    selectedServices.forEach(serviceId => {
        const serviceCard = document.querySelector(`[data-service="${serviceId}"]`);
        const serviceName = serviceCard.querySelector('h3').textContent;
        
        const serviceItem = document.createElement('div');
        serviceItem.className = 'selected-service-item';
        serviceItem.innerHTML = `
            <span>${serviceName}</span>
            <button onclick="removeService('${serviceId}')" class="remove-service-btn">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        selectedList.appendChild(serviceItem);
    });
}

function removeService(serviceId) {
    selectedServices.delete(serviceId);
    const serviceCard = document.querySelector(`[data-service="${serviceId}"]`);
    const button = serviceCard.querySelector('.service-select-btn');
    
    button.textContent = '';
    button.style.background = '';
    button.style.boxShadow = '';
    serviceCard.style.borderColor = 'rgba(255, 255, 255, 0.1)';
    
    updateSelectedServicesList();
    updateGetQuoteButton();
}

function updateGetQuoteButton() {
    const getQuoteBtn = document.getElementById('getQuoteBtn');
    
    if (selectedServices.size > 0) {
        getQuoteBtn.style.display = 'block';
    } else {
        getQuoteBtn.style.display = 'none';
    }
}

// Initialize service selection on page load
function initServiceSelection() {
    const getQuoteBtn = document.getElementById('getQuoteBtn');
    
    getQuoteBtn.addEventListener('click', () => {
        if (selectedServices.size > 0) {
            const servicesArray = Array.from(selectedServices);
            const servicesList = servicesArray.map(serviceId => {
                const serviceCard = document.querySelector(`[data-service="${serviceId}"]`);
                return serviceCard.querySelector('h3').textContent;
            }).join(', ');
            
            showNotification(`Quote request sent for: ${servicesList}`, 'success');
            
            // Scroll to contact form
            document.getElementById('contact').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
}

// Make functions globally available for debugging
window.showNotification = showNotification;
window.toggleService = toggleService;
window.removeService = removeService;
