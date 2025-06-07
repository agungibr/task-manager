document.addEventListener('DOMContentLoaded', function() {
    const mainHeading = document.querySelector('.left h1');
    if (mainHeading) {
        const originalText = mainHeading.textContent.trim();
        
        mainHeading.innerHTML = '';
        mainHeading.style.opacity = '1';
        mainHeading.style.transform = 'translateY(0)';
        
        const textContainer = document.createElement('span');
        const cursor = document.createElement('span');
        cursor.textContent = '|';
        cursor.style.animation = 'blink 1s infinite';
        cursor.style.color = '#1E90FF';
        cursor.style.fontWeight = 'normal';
        
        mainHeading.appendChild(textContainer);
        mainHeading.appendChild(cursor);
        
        let charIndex = 0;
        const typeChar = () => {
            if (charIndex < originalText.length) {
                textContainer.textContent = originalText.substring(0, charIndex + 1);
                charIndex++;
                
                const randomDelay = Math.random() * 50 + 80; 
                setTimeout(typeChar, randomDelay);
            } else {
                setTimeout(() => {
                    cursor.style.opacity = '0';
                    cursor.style.transition = 'opacity 0.5s ease';
                }, 800);
            }
        };
        
        setTimeout(typeChar, 300);
    }

    const fadeInElements = document.querySelectorAll('.left .tagline, .left .cta, .task-card');
    fadeInElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 1500 + (index * 300));
    });

    document.querySelectorAll('nav a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.about-section, .info-section, .feature-card').forEach(section => {
        observer.observe(section);
    });

    const taskCard = document.querySelector('.task-card');
    if (taskCard) {
        setInterval(() => {
            taskCard.style.transform = 'translateY(-5px)';
            setTimeout(() => {
                taskCard.style.transform = 'translateY(0)';
            }, 1000);
        }, 3000);
    }

    const ctaButton = document.querySelector('.cta');
    if (ctaButton) {
        ctaButton.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.02)';
        });
        
        ctaButton.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    }

    const animateCounters = () => {
        const counters = document.querySelectorAll('.stat-number');
        counters.forEach(counter => {
            const target = counter.textContent;
            const isPercentage = target.includes('%');
            const isMultiplier = target.includes('x');
            const numericValue = parseFloat(target);
            
            let current = 0;
            const increment = numericValue / 50;
            
            const updateCounter = () => {
                if (current < numericValue) {
                    current += increment;
                    if (isPercentage) {
                        counter.textContent = Math.floor(current) + '%';
                    } else if (isMultiplier) {
                        counter.textContent = current.toFixed(1) + 'x';
                    } else {
                        counter.textContent = Math.floor(current);
                    }
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };
            
            updateCounter();
        });
    };

    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        statsObserver.observe(statsSection);
    }

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const aboutImage = document.querySelector('.about-image');
        if (aboutImage) {
            const rate = scrolled * -0.2;
            aboutImage.style.transform = `translateY(${rate}px)`;
        }
    });

    const signInButton = document.querySelector('.register-btn');
    if (signInButton) {
        signInButton.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 4px 12px rgba(30, 144, 255, 0.2)';
        });
        
        signInButton.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
    }

});