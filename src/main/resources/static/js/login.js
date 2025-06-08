document.addEventListener('DOMContentLoaded', function() {
    
    const animateElements = () => {
        const loginCard = document.querySelector('.login-card');
        const formElements = document.querySelectorAll('.login-header, .form-group, .form-options, .login-button, .signup-link');
        
        loginCard.style.opacity = '0';
        loginCard.style.transform = 'translateY(50px) scale(0.95)';
        loginCard.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        
        formElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'all 0.6s ease';
        });
        
        setTimeout(() => {
            loginCard.style.opacity = '1';
            loginCard.style.transform = 'translateY(0) scale(1)';
        }, 100);
        
        formElements.forEach((element, index) => {
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, 300 + (index * 100));
        });
    };
    
    const setupButtonAnimations = () => {
        const loginButton = document.querySelector('.login-button');
        const backButton = document.querySelector('.back-button');
        
        if (loginButton) {
            loginButton.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px) scale(1.02)';
                this.style.boxShadow = '0 8px 25px rgba(84, 9, 218, 0.3)';
            });
            
            loginButton.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
                this.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
            });
        }
        
        if (backButton) {
            backButton.addEventListener('mouseenter', function() {
                this.style.transform = 'translateX(-5px) scale(1.05)';
            });
            
            backButton.addEventListener('mouseleave', function() {
                this.style.transform = 'translateX(0) scale(1)';
            });
        }
    };
    
    const setupInputAnimations = () => {
        const inputs = document.querySelectorAll('input[type="email"], input[type="password"]');
        
        inputs.forEach(input => {
            input.addEventListener('focus', function() {
                this.style.transform = 'scale(1.02)';
                this.style.boxShadow = '0 0 0 3px rgba(78, 113, 255, 0.1), 0 0 0 2px rgba(78, 113, 255, 0.2)';
            });
            
            input.addEventListener('blur', function() {
                this.style.transform = 'scale(1)';
                this.style.boxShadow = 'none';
            });
        });
    };
    
    const showSuccessAnimation = () => {
        const loginCard = document.querySelector('.login-card');
        const loginButton = document.querySelector('.login-button');
        
        loginButton.innerHTML = '<i class="fas fa-check"></i> Success!';
        loginButton.style.background = 'linear-gradient(to right, #10B981, #34D399)';
        loginButton.style.transform = 'scale(0.95)';
        
        loginCard.style.boxShadow = '0 0 0 4px rgba(16, 185, 129, 0.3), 0 20px 25px -5px rgba(0, 0, 0, 0.1)';
        
        setTimeout(() => {
            loginButton.style.transform = 'scale(1)';
        }, 150);
        
        setTimeout(() => {
            showCustomAlert('Welcome back! Login successful.', 'success');
        }, 800);
    };

    const showErrorAnimation = () => {
        const loginCard = document.querySelector('.login-card');
        const loginButton = document.querySelector('.login-button');
        const inputs = document.querySelectorAll('input[type="email"], input[type="password"]');
        
        loginButton.innerHTML = 'Sign In';
        loginButton.style.background = 'linear-gradient(to right, #5409DA, #4E71FF)';
        loginButton.disabled = false;
        loginButton.style.opacity = '1';
        
        loginCard.style.transform = 'translateX(-10px)';
        setTimeout(() => loginCard.style.transform = 'translateX(10px)', 100);
        setTimeout(() => loginCard.style.transform = 'translateX(-5px)', 200);
        setTimeout(() => loginCard.style.transform = 'translateX(5px)', 300);
        setTimeout(() => loginCard.style.transform = 'translateX(0)', 400);
        
        inputs.forEach(input => {
            input.style.border = '2px solid #EF4444';
            input.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
            
            setTimeout(() => {
                input.style.border = '1px solid #e5e7eb';
                input.style.boxShadow = 'none';
            }, 3000);
        });
        
        showCustomAlert('Invalid email or password. Please try again.', 'error');
    };
    
    const showCustomAlert = (message, type = 'success') => {
        const existingAlert = document.querySelector('.custom-alert');
        if (existingAlert) {
            existingAlert.remove();
        }
        
        const alert = document.createElement('div');
        alert.className = 'custom-alert';
        alert.innerHTML = `
            <div class="alert-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
                <span>${message}</span>
                <button class="alert-close">&times;</button>
            </div>
        `;
        
        alert.style.cssText = `
            position: fixed;
            top: 2rem;
            right: 2rem;
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        `;
        
        const alertContent = alert.querySelector('.alert-content');
        alertContent.style.cssText = `
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 1rem 1.5rem;
            background: ${type === 'success' ? 'linear-gradient(135deg, #10B981, #34D399)' : 'linear-gradient(135deg, #EF4444, #F87171)'};
            color: white;
            border-radius: 0.75rem;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            font-family: 'Inter', sans-serif;
            font-weight: 500;
            min-width: 300px;
        `;
        
        const closeBtn = alert.querySelector('.alert-close');
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 1.2rem;
            cursor: pointer;
            padding: 0;
            margin-left: 0.5rem;
            opacity: 0.8;
            transition: opacity 0.2s ease;
        `;
        
        document.body.appendChild(alert);
        
        setTimeout(() => {
            alert.style.transform = 'translateX(0)';
        }, 100);
        
        closeBtn.addEventListener('click', () => {
            alert.style.transform = 'translateX(100%)';
            setTimeout(() => alert.remove(), 400);
        });
        
        closeBtn.addEventListener('mouseenter', () => {
            closeBtn.style.opacity = '1';
        });
        
        closeBtn.addEventListener('mouseleave', () => {
            closeBtn.style.opacity = '0.8';
        });
        
        setTimeout(() => {
            if (alert.parentNode) {
                alert.style.transform = 'translateX(100%)';
                setTimeout(() => alert.remove(), 400);
            }
        }, 4000);
    };
    
    const setupFormSubmission = () => {
        const loginForm = document.querySelector('.login-form');
        const loginButton = document.querySelector('.login-button');
        
        if (loginForm) {
            loginForm.addEventListener('submit', async function(e) {
                e.preventDefault();
                
                const email = document.querySelector('input[type="email"]').value;
                const password = document.querySelector('input[type="password"]').value;
                
                if (!email || !password) {
                    showCustomAlert('Please fill in all fields.', 'error');
                    return;
                }
                
                const originalText = loginButton.innerHTML;
                loginButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';
                loginButton.disabled = true;
                loginButton.style.opacity = '0.8';
                
                try {
                    const response = await fetch('/auth/login', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            email: email,
                            password: password
                        })
                    });
                    
                    if (response.ok) {
                        showSuccessAnimation();
                        setTimeout(() => {
                            window.location.href = '../templates/dashboard.html';
                        }, 2000);
                    } else {
                        showErrorAnimation();
                    }
                    
                } catch (error) {
                    console.error('Login error:', error);
                    
                    loginButton.innerHTML = originalText;
                    loginButton.disabled = false;
                    loginButton.style.opacity = '1';
                    
                    showCustomAlert('Network error. Please check your connection and try again.', 'error');
                }
            });
        }
    };
    
    const setupLoadingTransition = () => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('from')) {
            setTimeout(animateElements, 200);
        } else {
            animateElements();
        }
    };
    
    setupLoadingTransition();
    setupButtonAnimations();
    setupInputAnimations();
    setupFormSubmission();
    
    const footerText = document.querySelector('.footer-text');
    if (footerText) {
        footerText.style.opacity = '0';
        footerText.style.transform = 'translateY(20px)';
        footerText.style.transition = 'all 0.6s ease';
        
        setTimeout(() => {
            footerText.style.opacity = '1';
            footerText.style.transform = 'translateY(0)';
        }, 800);
    }
});