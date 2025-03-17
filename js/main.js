// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const nav = document.querySelector('.nav');

    // Mobile menu toggle
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target) && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
        }
    });

    // Navbar scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });
});

// Protection Calculator
class ProtectionCalculator {
    constructor(formId) {
        this.form = document.getElementById(formId);
        if (this.form) {
            this.form.addEventListener('submit', this.handleSubmit.bind(this));
            this.initializeInputs();
            this.initializeTooltips();
        }
    }

    initializeInputs() {
        const inputs = this.form.querySelectorAll('input[type="number"]');
        inputs.forEach(input => {
            // Format number with commas on blur
            input.addEventListener('blur', () => {
                if (input.value) {
                    const value = parseFloat(input.value.replace(/,/g, ''));
                    if (!isNaN(value)) {
                        input.value = value.toLocaleString();
                    }
                }
            });

            // Remove commas on focus
            input.addEventListener('focus', () => {
                input.value = input.value.replace(/,/g, '');
            });

            // Add real-time validation
            input.addEventListener('input', () => {
                this.validateInput(input);
            });
        });
    }

    initializeTooltips() {
        const tooltips = this.form.querySelectorAll('[data-tooltip]');
        tooltips.forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                const tooltip = document.createElement('div');
                tooltip.className = 'tooltip';
                tooltip.textContent = element.dataset.tooltip;
                document.body.appendChild(tooltip);

                const rect = element.getBoundingClientRect();
                tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`;
                tooltip.style.left = `${rect.left + (rect.width - tooltip.offsetWidth) / 2}px`;
            });

            element.addEventListener('mouseleave', () => {
                const tooltip = document.querySelector('.tooltip');
                if (tooltip) tooltip.remove();
            });
        });
    }

    validateInput(input) {
        const value = parseFloat(input.value.replace(/,/g, ''));
        const min = parseFloat(input.dataset.min) || 0;
        const max = parseFloat(input.dataset.max) || Infinity;
        const errorMessage = input.nextElementSibling;

        if (isNaN(value) || value < min || value > max) {
            input.setCustomValidity(`Value must be between ${min.toLocaleString()} and ${max.toLocaleString()}`);
            if (errorMessage) errorMessage.style.display = 'block';
        } else {
            input.setCustomValidity('');
            if (errorMessage) errorMessage.style.display = 'none';
        }
    }

    calculateProtection(propertyValue, currentCoverage, repairCosts) {
        // Calculate potential loss and coverage gap
        const potentialLoss = propertyValue - currentCoverage;
        const coverageGapPercentage = (potentialLoss / propertyValue) * 100;
        
        // Calculate risk factors
        const riskFactor = this.calculateRiskFactor(propertyValue, currentCoverage, repairCosts);
        
        // Calculate monthly premium with risk adjustment
        const baseMonthlyPremium = (potentialLoss * 0.0001);
        const riskAdjustedPremium = baseMonthlyPremium * (1 + riskFactor);
        
        // Calculate potential savings
        const annualSavings = repairCosts * 0.7; // 70% potential savings on repair costs
        const monthlyPremium = riskAdjustedPremium.toFixed(2);
        
        // Calculate additional benefits
        const emergencyResponse = (baseMonthlyPremium * 0.2).toFixed(2);
        const preventiveMeasures = (baseMonthlyPremium * 0.15).toFixed(2);
        const moldInspection = (baseMonthlyPremium * 0.1).toFixed(2);
        
        return {
            potentialLoss,
            coverageGapPercentage,
            monthlyPremium,
            annualSavings: annualSavings.toFixed(2),
            emergencyResponse,
            preventiveMeasures,
            moldInspection,
            riskFactor
        };
    }

    calculateRiskFactor(propertyValue, currentCoverage, repairCosts) {
        let riskFactor = 0;
        
        // Coverage gap risk
        const coverageRatio = currentCoverage / propertyValue;
        if (coverageRatio < 0.5) riskFactor += 0.3;
        else if (coverageRatio < 0.7) riskFactor += 0.2;
        else if (coverageRatio < 0.9) riskFactor += 0.1;
        
        // Property value risk
        if (propertyValue > 1000000) riskFactor += 0.15;
        else if (propertyValue > 500000) riskFactor += 0.1;
        
        // Repair costs risk
        const repairRatio = repairCosts / propertyValue;
        if (repairRatio > 0.2) riskFactor += 0.2;
        else if (repairRatio > 0.1) riskFactor += 0.1;
        
        return riskFactor;
    }

    handleSubmit(event) {
        event.preventDefault();
        
        // Get form values
        const propertyValue = parseFloat(this.form.querySelector('#propertyValue').value.replace(/,/g, '')) || 0;
        const currentCoverage = parseFloat(this.form.querySelector('#currentCoverage').value.replace(/,/g, '')) || 0;
        const repairCosts = parseFloat(this.form.querySelector('#repairCosts').value.replace(/,/g, '')) || 0;

        // Validate inputs
        if (propertyValue <= 0 || currentCoverage < 0 || repairCosts < 0) {
            alert('Please enter valid values for all fields');
            return;
        }
        
        const results = this.calculateProtection(propertyValue, currentCoverage, repairCosts);
        
        // Update results in the DOM with animation
        const resultsDiv = document.getElementById('calculatorResults');
        if (resultsDiv) {
            resultsDiv.style.opacity = '0';
            setTimeout(() => {
                resultsDiv.innerHTML = `
                    <div class="results-card">
                        <h3>Your Protection Analysis</h3>
                        <div class="results-grid">
                            <div class="result-item">
                                <h4>Coverage Gap</h4>
                                <p class="highlight">$${results.potentialLoss.toLocaleString()}</p>
                                <p class="subtext">${results.coverageGapPercentage.toFixed(1)}% of property value</p>
                            </div>
                            <div class="result-item">
                                <h4>Monthly Premium</h4>
                                <p class="highlight">$${results.monthlyPremium}</p>
                                <p class="subtext">Risk-adjusted rate</p>
                            </div>
                            <div class="result-item">
                                <h4>Annual Savings</h4>
                                <p class="highlight">$${results.annualSavings}</p>
                                <p class="subtext">Potential cost reduction</p>
                            </div>
                            <div class="result-item">
                                <h4>Total Protection</h4>
                                <p class="highlight">$${propertyValue.toLocaleString()}</p>
                                <p class="subtext">Full property coverage</p>
                            </div>
                        </div>
                        <div class="additional-benefits">
                            <h4>Additional Benefits Included</h4>
                            <ul>
                                <li>24/7 Emergency Response: $${results.emergencyResponse}/month</li>
                                <li>Preventive Measures: $${results.preventiveMeasures}/month</li>
                                <li>Annual Mold Inspection: $${results.moldInspection}/month</li>
                            </ul>
                        </div>
                        <a href="#subscribe" class="btn btn-primary btn-large">Get Protected Now</a>
                    </div>
                `;
                resultsDiv.style.opacity = '1';
            }, 300);
        }

        // Keep the form values
        this.form.querySelector('#propertyValue').value = propertyValue.toLocaleString();
        this.form.querySelector('#currentCoverage').value = currentCoverage.toLocaleString();
        this.form.querySelector('#repairCosts').value = repairCosts.toLocaleString();
    }
}

// Subscription Form Handler
class SubscriptionForm {
    constructor(formId) {
        this.form = document.getElementById(formId);
        if (this.form) {
            this.initializeStripe();
            this.form.addEventListener('submit', this.handleSubmit.bind(this));
        }
    }

    async initializeStripe() {
        try {
            // Initialize Stripe with your publishable key
            this.stripe = Stripe('your_publishable_key');
            const elements = this.stripe.elements();
            
            // Create card element
            this.card = elements.create('card', {
                style: {
                    base: {
                        fontSize: '16px',
                        color: '#1e293b',
                        '::placeholder': {
                            color: '#475569',
                        },
                    },
                },
            });
            
            // Mount card element
            this.card.mount('#card-element');
            
            // Handle validation errors
            this.card.addEventListener('change', ({error}) => {
                const displayError = document.getElementById('card-errors');
                if (error) {
                    displayError.textContent = error.message;
                } else {
                    displayError.textContent = '';
                }
            });
        } catch (error) {
            console.error('Stripe initialization error:', error);
        }
    }

    async handleSubmit(event) {
        event.preventDefault();
        
        const submitButton = this.form.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = 'Processing...';
        
        try {
            // Create payment method
            const {paymentMethod, error} = await this.stripe.createPaymentMethod({
                type: 'card',
                card: this.card,
                billing_details: {
                    name: `${this.form.querySelector('#firstName').value} ${this.form.querySelector('#lastName').value}`,
                    email: this.form.querySelector('#email').value,
                    phone: this.form.querySelector('#phone').value,
                    address: {
                        line1: this.form.querySelector('#address').value
                    }
                }
            });
            
            if (error) {
                throw error;
            }
            
            // Here you would typically send the paymentMethod.id to your server
            // and handle the subscription creation there
            
            // For demo purposes, show success message
            this.showSuccessMessage();
            
        } catch (error) {
            console.error('Payment error:', error);
            const errorElement = document.getElementById('card-errors');
            errorElement.textContent = error.message;
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Subscribe Now';
        }
    }

    showSuccessMessage() {
        const formContent = this.form.innerHTML;
        this.form.innerHTML = `
            <div class="success-message">
                <i class="fas fa-check-circle"></i>
                <h3>Thank You!</h3>
                <p>Your subscription has been processed successfully. You will receive your policy certificate via email shortly.</p>
                <div class="next-steps">
                    <h4>Next Steps:</h4>
                    <ol>
                        <li>Check your email for the policy certificate</li>
                        <li>Review your coverage details</li>
                        <li>Download our mobile app for easy access</li>
                    </ol>
                </div>
            </div>
        `;
    }
}

// Image Slider
class ImageSlider {
    constructor(sliderId) {
        this.slider = document.getElementById(sliderId);
        this.slides = this.slider?.querySelectorAll('.slide') || [];
        this.currentSlide = 0;
        this.isAnimating = false;
        
        if (this.slider && this.slides.length) {
            this.initializeSlider();
            this.startAutoSlide();
        }
    }

    initializeSlider() {
        const nextBtn = document.createElement('button');
        nextBtn.className = 'slider-btn next';
        nextBtn.innerHTML = '→';
        
        const prevBtn = document.createElement('button');
        prevBtn.className = 'slider-btn prev';
        prevBtn.innerHTML = '←';
        
        this.slider.appendChild(nextBtn);
        this.slider.appendChild(prevBtn);
        
        nextBtn.addEventListener('click', () => this.nextSlide());
        prevBtn.addEventListener('click', () => this.prevSlide());

        // Touch support
        let touchStartX = 0;
        let touchEndX = 0;

        this.slider.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        });

        this.slider.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].clientX;
            this.handleSwipe();
        });
        
        this.updateSlides();
    }

    handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
        }
    }

    startAutoSlide() {
        setInterval(() => this.nextSlide(), 5000);
    }

    updateSlides() {
        if (this.isAnimating) return;
        this.isAnimating = true;

        this.slides.forEach((slide, index) => {
            slide.style.transform = `translateX(${100 * (index - this.currentSlide)}%)`;
        });

        setTimeout(() => {
            this.isAnimating = false;
        }, 500);
    }

    nextSlide() {
        if (this.isAnimating) return;
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        this.updateSlides();
    }

    prevSlide() {
        if (this.isAnimating) return;
        this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.updateSlides();
    }
}

// Initialize all components
document.addEventListener('DOMContentLoaded', () => {
    // Initialize calculator
    new ProtectionCalculator('protectionCalculator');
    
    // Initialize subscription form
    new SubscriptionForm('subscriptionForm');
    
    // Initialize slider
    new ImageSlider('caseStudySlider');
    
    // Initialize smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                const navLinks = document.querySelector('.nav-links');
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                }
            }
        });
    });
    
    // Initialize intersection observer for animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        section.classList.add('fade-in-section');
        observer.observe(section);
    });
}); 