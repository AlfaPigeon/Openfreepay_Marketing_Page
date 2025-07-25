// OpenFreePay Localization and UI Script

class OpenFreePayApp {
  constructor() {
    this.currentLanguage = 'en';
    this.defaultLanguage = 'en';
    this.init();
  }

  init() {
    this.detectLanguage();
    this.initializeLanguageSelector();
    this.initializeMobileMenu();
    this.initializeWaitlist();
    this.initializeModal();
    this.translatePage();
  }

  // Detect user's preferred language
  detectLanguage() {
    // Check if language is stored in localStorage
    const savedLanguage = localStorage.getItem('openfreepay-language');
    if (savedLanguage && translations[savedLanguage]) {
      this.currentLanguage = savedLanguage;
      return;
    }

    // Detect browser language
    const browserLanguage = navigator.language || navigator.userLanguage;
    const languageCode = browserLanguage.split('-')[0].toLowerCase();
    
    // Check if we support this language
    if (translations[languageCode]) {
      this.currentLanguage = languageCode;
    } else {
      this.currentLanguage = this.defaultLanguage;
    }
  }

  // Initialize language selector dropdown
  initializeLanguageSelector() {
    const languageSelect = document.getElementById('languageSelect');
    const mobileLanguageSelect = document.getElementById('mobileLanguageSelect');
    
    // Set current language in both dropdowns
    if (languageSelect) {
      languageSelect.value = this.currentLanguage;
      languageSelect.addEventListener('change', (e) => {
        this.switchLanguage(e.target.value);
      });
    }
    
    if (mobileLanguageSelect) {
      mobileLanguageSelect.value = this.currentLanguage;
      mobileLanguageSelect.addEventListener('change', (e) => {
        this.switchLanguage(e.target.value);
      });
    }
  }

  // Initialize mobile menu functionality
  initializeMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const body = document.body;
    
    if (!mobileMenuToggle || !mobileMenu) return;
    
    // Toggle mobile menu
    mobileMenuToggle.addEventListener('click', () => {
      const isActive = mobileMenuToggle.classList.contains('active');
      
      if (isActive) {
        this.closeMobileMenu();
      } else {
        this.openMobileMenu();
      }
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!mobileMenuToggle.contains(e.target) && !mobileMenu.contains(e.target)) {
        this.closeMobileMenu();
      }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeMobileMenu();
      }
    });
    
    // Close menu when window resizes to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        this.closeMobileMenu();
      }
    });
  }

  // Open mobile menu
  openMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (mobileMenuToggle && mobileMenu) {
      mobileMenuToggle.classList.add('active');
      mobileMenuToggle.setAttribute('aria-expanded', 'true');
      mobileMenu.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  // Close mobile menu
  closeMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (mobileMenuToggle && mobileMenu) {
      mobileMenuToggle.classList.remove('active');
      mobileMenuToggle.setAttribute('aria-expanded', 'false');
      mobileMenu.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  }

  // Switch to a different language
  switchLanguage(languageCode) {
    if (!translations[languageCode]) {
      console.warn(`Language ${languageCode} not supported`);
      return;
    }

    this.currentLanguage = languageCode;
    localStorage.setItem('openfreepay-language', languageCode);
    
    // Update both language selectors
    const languageSelect = document.getElementById('languageSelect');
    const mobileLanguageSelect = document.getElementById('mobileLanguageSelect');
    
    if (languageSelect) {
      languageSelect.value = languageCode;
    }
    
    if (mobileLanguageSelect) {
      mobileLanguageSelect.value = languageCode;
    }

    // Update page direction for RTL languages
    this.updatePageDirection();
    
    // Translate all elements
    this.translatePage();
    
    // Close mobile menu if open
    this.closeMobileMenu();
  }

  // Update page direction for RTL languages
  updatePageDirection() {
    const rtlLanguages = ['ar'];
    const isRTL = rtlLanguages.includes(this.currentLanguage);
    
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = this.currentLanguage;
  }

  // Translate all elements on the page
  translatePage() {
    const elementsToTranslate = document.querySelectorAll('[data-translate]');
    const currentTranslations = translations[this.currentLanguage] || translations[this.defaultLanguage];

    elementsToTranslate.forEach(element => {
      const key = element.getAttribute('data-translate');
      const translation = this.getNestedTranslation(currentTranslations, key);
      
      if (translation) {
        element.textContent = translation;
      }
    });

    // Update page title
    if (currentTranslations.hero && currentTranslations.hero.title) {
      document.title = `OpenFreePay - ${currentTranslations.hero.title}`;
    }

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription && currentTranslations.hero && currentTranslations.hero.subtitle) {
      metaDescription.setAttribute('content', currentTranslations.hero.subtitle);
    }
  }

  // Get nested translation using dot notation (e.g., "hero.title")
  getNestedTranslation(translations, key) {
    return key.split('.').reduce((obj, prop) => obj && obj[prop], translations);
  }

  // Initialize waitlist functionality
  initializeWaitlist() {
    const waitlistButtons = document.querySelectorAll('[data-waitlist-id]');
    
    waitlistButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleWaitlistSignup(e.target);
      });
    });
  }

  // Handle waitlist signup
  handleWaitlistSignup(button) {
    const waitlistId = button.getAttribute('data-waitlist-id');
    const url = button.getAttribute('href');
    
    if (url) {
      // Open the waitlist form in a new window
      window.open(url, '_blank', 'width=500,height=600,scrollbars=yes,resizable=yes');
      
      // Show success modal after a delay (simulate form completion)
      setTimeout(() => {
        this.showSuccessModal();
      }, 2000);
    }
  }

  // Initialize modal functionality
  initializeModal() {
    const modal = document.getElementById('successModal');
    const closeBtn = document.querySelector('.modal .close');
    
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.hideSuccessModal();
      });
    }

    // Close modal when clicking outside
    if (modal) {
      window.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.hideSuccessModal();
        }
      });
    }
  }

  // Show success modal
  showSuccessModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
      modal.style.display = 'block';
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
  }

  // Hide success modal
  hideSuccessModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
      modal.style.display = 'none';
      document.body.style.overflow = 'auto'; // Restore scrolling
    }
  }

  // Smooth scrolling for anchor links
  initializeSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  // Add loading animation for better UX
  showLoadingState(element) {
    if (element) {
      element.style.opacity = '0.7';
      element.style.pointerEvents = 'none';
    }
  }

  hideLoadingState(element) {
    if (element) {
      element.style.opacity = '1';
      element.style.pointerEvents = 'auto';
    }
  }

  // Analytics helper (can be extended for tracking)
  trackEvent(eventName, properties = {}) {
    // Placeholder for analytics tracking
    console.log('Event tracked:', eventName, properties);
    
    // You can integrate with analytics services here
    // Example: gtag('event', eventName, properties);
  }

  // Get current language for external use
  getCurrentLanguage() {
    return this.currentLanguage;
  }

  // Get available languages
  getAvailableLanguages() {
    return Object.keys(translations);
  }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.openFreePayApp = new OpenFreePayApp();
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = OpenFreePayApp;
}
