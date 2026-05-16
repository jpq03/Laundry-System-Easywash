// Easy Wash Laundry Services Interactions
document.addEventListener('DOMContentLoaded', () => {
    
    // Login Form Handling
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = loginForm.querySelector('.btn-primary');
            const originalText = btn.textContent;
            
            btn.textContent = 'Signing in...';
            btn.disabled = true;
            
            // Mock authentication delay
            setTimeout(() => {
                if (email === 'admin@easywash.com' && password === 'Admin123!') {
                    window.location.href = 'admin.html';
                } else {
                    window.location.href = 'dashboard.html';
                }
            }, 1000);
        });
    }

    // Register Form Handling
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = registerForm.querySelector('.btn-primary');
            
            btn.textContent = 'Creating Account...';
            btn.disabled = true;
            
            setTimeout(() => {
                alert('Welcome to Easy Wash! Your account has been created.');
                window.location.href = 'login.html';
            }, 1500);
        });
    }

    // Dashboard Interactions
    const orderRows = document.querySelectorAll('.order-table tr');
    // Dashboard Order Wizard Logic
    const orderModal = document.getElementById('order-modal');
    const newOrderBtns = document.querySelectorAll('.btn-primary, .menu-item, #mobile-new-order'); // Catch all New Order buttons
    const closeOrderBtn = document.getElementById('close-modal');
    const nextBtn = document.getElementById('next-step');
    const prevBtn = document.getElementById('prev-step');
    const steps = document.querySelectorAll('.wizard-step');
    const dots = document.querySelectorAll('.dot');
    let currentStep = 1;

    const openModal = () => {
        if(orderModal) {
            orderModal.style.display = 'flex';
            currentStep = 1;
            updateSteps();
        }
    };

    const closeModal = () => {
        if(orderModal) orderModal.style.display = 'none';
    };

    const updateSteps = () => {
        steps.forEach((step, index) => {
            step.classList.toggle('active', index + 1 === currentStep);
        });
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index + 1 === currentStep);
        });

        // Footer buttons
        prevBtn.style.visibility = currentStep === 1 ? 'hidden' : 'visible';
        nextBtn.textContent = currentStep === 4 ? 'Place Order' : 'Next Step';
    };

    newOrderBtns.forEach(btn => {
        if(btn.textContent.includes('New Order')) {
            btn.addEventListener('click', openModal);
        }
    });

    if(closeOrderBtn) closeOrderBtn.addEventListener('click', closeModal);

    if(nextBtn) nextBtn.addEventListener('click', () => {
        if (currentStep < 4) {
            currentStep++;
            updateSteps();
        } else {
            // Final Step: Place Order
            nextBtn.textContent = 'Processing...';
            nextBtn.disabled = true;
            setTimeout(() => {
                alert('Success! Your laundry order has been placed. We will see you at pickup!');
                closeModal();
                nextBtn.textContent = 'Place Order';
                nextBtn.disabled = false;
            }, 1500);
        }
    });

    if(prevBtn) prevBtn.addEventListener('click', () => {
        if (currentStep > 1) {
            currentStep--;
            updateSteps();
        }
    });

    // Service Selection
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('click', () => {
            serviceCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
        });
    });
});
