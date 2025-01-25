(function(window) {
  // Store component data in global variable
  'use strict';

  const ThirdPartyAnalytics = function(config) {
    if (!(this instanceof ThirdPartyAnalytics)) {
      return new ThirdPartyAnalytics(config);
    }

    this.apiKey = __API_KEY__;
    this.apiUrl = __API_URL__;
    this.sessionId = this.generateSessionId();
  };

  ThirdPartyAnalytics.prototype = {
    generateSessionId: function() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    },

    track: async function(eventName, eventData = {}, metadata = {}) {
      if (!eventName) {
        console.error('Event name is required');
        return;
      }

      try {
        const payload = {
          apiKey: this.apiKey,
          eventName,
          eventData,
          userId: this.userId,
          sessionId: this.sessionId,
          metadata: {
            ...metadata,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            language: navigator.language
          }
        };

        const response = await fetch(`${this.apiUrl}/api/analytics/track`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error(`Failed to track event: ${response.statusText}`);
        }

        return await response.json();
      } catch (error) {
        console.error('Analytics tracking error:', error);
        return { error: error.message };
      }
    },

    pageView: function(metadata = {}) {
      return this.track('page_view', {
        title: document.title,
        url: window.location.href,
        path: window.location.pathname,
        referrer: document.referrer
      }, metadata);
    },

    identify: function(userId, traits = {}) {
      if (!userId) {
        console.error('UserId is required for identify');
        return;
      }
      this.userId = userId;
      return this.track('identify', traits);
    },

    trackClick: function(element, eventName = 'element_click', metadata = {}) {
      if (!element) return;
      
      const handler = () => {
        const elementData = {
          element: element.tagName.toLowerCase(),
          id: element.id || undefined,
          class: element.className || undefined,
          text: element.innerText || undefined,
          href: element.href || undefined,
          path: this.getElementPath(element)
        };

        // Boş değerleri temizle
        Object.keys(elementData).forEach(key => {
          if (elementData[key] === undefined) {
            delete elementData[key];
          }
        });

        this.track(eventName, elementData, metadata);
      };

      element.addEventListener('click', handler);
      return () => element.removeEventListener('click', handler); // cleanup function
    },

    addToCart: function(productData, metadata = {}) {
      if (!productData || !productData.productId) {
        console.error('Product data with productId is required');
        return;
      }
      return this.track('add_to_cart', productData, metadata);
    },

    checkoutStarted: function(checkoutData, metadata = {}) {
      if (!checkoutData || !checkoutData.checkoutId) {
        console.error('Checkout data with checkoutId is required');
        return;
      }
      return this.track('checkout_started', checkoutData, metadata);
    },

    removeFromCart: function(productData, metadata = {}) {
      if (!productData || !productData.productId) {
        console.error('Product data with productId is required');
        return;
      }
      return this.track('remove_from_cart', productData, metadata);
    },

    productViewed: function(productData, metadata = {}) {
      if (!productData || !productData.productId) {
        console.error('Product data with productId is required');
        return;
      }
      return this.track('product_viewed', productData, metadata);
    },

    trackFormSubmission: function(form, eventName = 'form_submission', metadata = {}) {
      if (!form || !(form instanceof HTMLFormElement)) {
        console.error('Valid form element is required');
        return;
      }

      const handler = (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
          if (!key.toLowerCase().includes('password') && 
              !key.toLowerCase().includes('token') && 
              !key.toLowerCase().includes('secret')) {
            data[key] = value;
          }
        }
        
        this.track(eventName, {
          formId: form.id,
          formName: form.name,
          formAction: form.action,
          formMethod: form.method,
          data
        }, metadata);

        form.submit();
      };

      form.addEventListener('submit', handler);
      return () => form.removeEventListener('submit', handler);
    },

    checkoutCompleted: function(checkoutData, metadata = {}) {
      if (!checkoutData || !checkoutData.checkoutId) {
        console.error('Checkout data with checkoutId is required');
        return;
      }
      return this.track('checkout_completed', checkoutData, metadata);
    },

    checkoutCancelled: function(checkoutData, metadata = {}) {
      if (!checkoutData || !checkoutData.checkoutId) {
        console.error('Checkout data with checkoutId is required');
        return;
      }
      return this.track('checkout_cancelled', checkoutData, metadata);
    },

    login: function(authData, metadata = {}) {
      if (!authData || !authData.userId) {
        console.error('Auth data with userId is required');
        return;
      }
      return this.track('login', authData, metadata);
    },

    register: function(authData, metadata = {}) {
      if (!authData || !authData.userId) {
        console.error('Auth data with userId is required');
        return;
      }
      return this.track('register', authData, metadata);
    },

    addWishlist: function(wishlistData, metadata = {}) {
      if (!wishlistData || !wishlistData.productId || !wishlistData.userId) {
        console.error('Wishlist data with productId and userId is required');
        return;
      }
      return this.track('add_wishlist', wishlistData, metadata);
    },

    removeWishlist: function(wishlistData, metadata = {}) {
      if (!wishlistData || !wishlistData.productId || !wishlistData.userId) {
        console.error('Wishlist data with productId and userId is required');
        return;
      }
      return this.track('remove_wishlist', wishlistData, metadata);
    },

    forgotPassword: function(authData, metadata = {}) {
      if (!authData || !authData.userId) {
        console.error('Auth data with userId is required');
        return;
      }
      return this.track('forgot_password', authData, metadata);
    },

    // Utility function to get element's DOM path
    getElementPath: function(element) {
      const path = [];
      while (element && element.nodeType === Node.ELEMENT_NODE) {
        let selector = element.nodeName.toLowerCase();
        if (element.id) {
          selector += `#${element.id}`;
        } else if (element.className) {
          selector += `.${element.className.replace(/\s+/g, '.')}`;
        }
        path.unshift(selector);
        element = element.parentNode;
      }
      return path.join(' > ');
    }
  };

  window.ThirdPartyAnalytics = ThirdPartyAnalytics;

  window.__thirdPartyComponents = __COMPONENTS_DATA__;

  function initializeComponents() {
    const components = window.__thirdPartyComponents;
    if (!components || !Array.isArray(components)) return;

    // For each component
    components.forEach(component => {
      // Find target element for component
      const targetElements = document.querySelectorAll(component.selector);
      if (!targetElements.length) return;

      // Create component element
      const componentElement = document.createElement('div');
      componentElement.innerHTML = component.html;

      // Add component styles
      if (component.css) {
        const style = document.createElement('style');
        style.textContent = component.css;
        document.head.appendChild(style);
      }

      // Render component for each target element
      targetElements.forEach(targetElement => {
        const clonedElement = componentElement.cloneNode(true);

        // Add HTML content
        if (component.position === 'before') {
          targetElement.parentNode.insertBefore(clonedElement, targetElement);
        } else {
          // Add based on position
          targetElement.parentNode.insertBefore(clonedElement, targetElement.nextSibling);
        }

        // Execute JavaScript
        if (component.javascript) {
          const script = document.createElement('script');
          script.textContent = component.javascript;
          document.body.appendChild(script);
        }
      });
    });
  }

  // Show components when page loads
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeComponents);
  } else {
    initializeComponents();
  }
})(window);