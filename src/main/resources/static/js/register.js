document.addEventListener('DOMContentLoaded', function() {
    
    const animateElements = () => {
        const registerCard = document.querySelector('.register-card');
        const formElements = document.querySelectorAll('.register-header, .form-group, .terms-checkbox, .register-button, .signin-link');
        
        registerCard.style.opacity = '0';
        registerCard.style.transform = 'translateY(50px) scale(0.95)';
        registerCard.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        
        formElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'all 0.6s ease';
        });
        
        setTimeout(() => {
            registerCard.style.opacity = '1';
            registerCard.style.transform = 'translateY(0) scale(1)';
        }, 100);
        
        formElements.forEach((element, index) => {
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, 300 + (index * 100));
        });
    };
    
    const setupButtonAnimations = () => {
        const registerButton = document.querySelector('.register-button');
        const backButton = document.querySelector('.back-button');
        
        if (registerButton) {
            registerButton.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px) scale(1.02)';
                this.style.boxShadow = '0 8px 25px rgba(84, 9, 218, 0.3)';
            });
            
            registerButton.addEventListener('mouseleave', function() {
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
        const inputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="password"]');
        
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
    
    const setupPasswordValidation = () => {
        const password = document.querySelector('#password');
        const confirmPassword = document.querySelector('#confirm_password');
        
        if (password && confirmPassword) {
            const validatePasswords = () => {
                if (confirmPassword.value && password.value !== confirmPassword.value) {
                    confirmPassword.style.borderColor = '#EF4444';
                    confirmPassword.style.boxShadow = '0 0 0 2px rgba(239, 68, 68, 0.2)';
                } else if (confirmPassword.value) {
                    confirmPassword.style.borderColor = '#10B981';
                    confirmPassword.style.boxShadow = '0 0 0 2px rgba(16, 185, 129, 0.2)';
                } else {
                    confirmPassword.style.borderColor = '#D1D5DB';
                    confirmPassword.style.boxShadow = 'none';
                }
            };
            
            password.addEventListener('input', validatePasswords);
            confirmPassword.addEventListener('input', validatePasswords);
        }
    };
    
    const showSuccessAnimation = () => {
        const registerCard = document.querySelector('.register-card');
        const registerButton = document.querySelector('.register-button');
        
        registerButton.innerHTML = '<i class="fas fa-check"></i> Account Created!';
        registerButton.style.background = 'linear-gradient(to right, #10B981, #34D399)';
        registerButton.style.transform = 'scale(0.95)';
        
        registerCard.style.boxShadow = '0 0 0 4px rgba(16, 185, 129, 0.3), 0 20px 25px -5px rgba(0, 0, 0, 0.1)';
        
        setTimeout(() => {
            registerButton.style.transform = 'scale(1)';
        }, 150);
        
        setTimeout(() => {
            showCustomAlert('Account created successfully! Welcome to Task Manager.', 'success');
        }, 800);
    };

    const showErrorAnimation = () => {
        const registerCard = document.querySelector('.register-card');
        const registerButton = document.querySelector('.register-button');
        
        registerButton.innerHTML = 'Create Account';
        registerButton.style.background = 'linear-gradient(to right, #5409DA, #4E71FF)';
        registerButton.disabled = false;
        registerButton.style.opacity = '1';
        
        registerCard.style.transform = 'translateX(-10px)';
        setTimeout(() => registerCard.style.transform = 'translateX(10px)', 100);
        setTimeout(() => registerCard.style.transform = 'translateX(-5px)', 200);
        setTimeout(() => registerCard.style.transform = 'translateX(5px)', 300);
        setTimeout(() => registerCard.style.transform = 'translateX(0)', 400);
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
        const registerForm = document.querySelector('.register-form');
        const registerButton = document.querySelector('.register-button');
        
        if (registerForm) {
            registerForm.addEventListener('submit', async function(e) {
                e.preventDefault();
                
                const formData = new FormData(this);
                const name = formData.get('nama_lengkap'); 
                const email = formData.get('email');
                const password = formData.get('password');
                const confirmPassword = formData.get('confirm_password');
                const terms = formData.get('terms');
                
                if (!name || !email || !password || !confirmPassword) {
                    showCustomAlert('Please fill in all fields.', 'error');
                    return;
                }
                
                if (password !== confirmPassword) {
                    showCustomAlert('Passwords do not match. Please try again.', 'error');
                    return;
                }
                
                if (!terms) {
                    showCustomAlert('Please accept the Terms of Service and Privacy Policy.', 'error');
                    return;
                }
                
                const originalText = registerButton.innerHTML;
                registerButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
                registerButton.disabled = true;
                registerButton.style.opacity = '0.8';
                
                try {
                    const response = await fetch('/auth/register', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            username: name,
                            email: email,
                            password: password
                        })
                    });
                    
                    if (response.ok) {
                        showSuccessAnimation();
                        
                        setTimeout(() => {
                            window.location.href = 'login.html';
                        }, 2500);
                    } else {
                        const errorMessage = await response.text();
                        
                        showErrorAnimation();
                        
                        showCustomAlert(errorMessage || 'Registration failed. Please try again.', 'error');
                    }
                    
                } catch (error) {
                    console.error('Registration error:', error);
                    
                    registerButton.innerHTML = originalText;
                    registerButton.disabled = false;
                    registerButton.style.opacity = '1';
                    
                    showCustomAlert('Network error. Please check your connection and try again.', 'error');
                }
            });
        }
    };
    
    const setupTermsAnimation = () => {
        const termsCheckbox = document.querySelector('#terms');
        if (termsCheckbox) {
            termsCheckbox.addEventListener('change', function() {
                const label = this.parentElement;
                if (this.checked) {
                    label.style.transform = 'scale(1.02)';
                    setTimeout(() => {
                        label.style.transform = 'scale(1)';
                    }, 150);
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
    setupPasswordValidation();
    setupFormSubmission();
    setupTermsAnimation();
    
    const footerText = document.querySelector('.footer-text');
    if (footerText) {
        footerText.style.opacity = '0';
        footerText.style.transform = 'translateY(20px)';
        footerText.style.transition = 'all 0.6s ease';
        
        setTimeout(() => {
            footerText.style.opacity = '1';
            footerText.style.transform = 'translateY(0)';
        }, 900);
    }
});