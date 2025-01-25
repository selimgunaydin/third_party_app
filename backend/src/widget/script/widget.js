(function(window) {
  // Store component data in global variable
  'use strict';

  const ThirdPartyAnalytics = function(config) {
    if (!(this instanceof ThirdPartyAnalytics)) {
      return new ThirdPartyAnalytics(config);
    }

    this.apiKey = config.apiKey;
    this.apiUrl = config.apiUrl || 'http://localhost:3000';
    this.sessionId = this.generateSessionId();
    this.userId = config.userId;
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
      try {
        const response = await fetch(`${this.apiUrl}/analytics/track`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            apiKey: this.apiKey,
            eventName,
            eventData,
            userId: this.userId,
            sessionId: this.sessionId,
            metadata
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to track event');
        }

        return await response.json();
      } catch (error) {
        console.error('Analytics tracking error:', error);
      }
    },

    pageView: function(metadata = {}) {
      return this.track('page_view', {
        title: document.title,
        url: window.location.href,
        path: window.location.pathname
      }, metadata);
    },

    identify: function(userId, traits = {}) {
      this.userId = userId;
      return this.track('identify', traits);
    },

    trackClick: function(element, eventName = 'element_click', metadata = {}) {
      element.addEventListener('click', () => {
        this.track(eventName, {
          element: element.tagName,
          id: element.id,
          class: element.className,
          text: element.innerText
        }, metadata);
      });
    },

    trackFormSubmission: function(form, eventName = 'form_submission', metadata = {}) {
      form.addEventListener('submit', (e) => {
        const formData = new FormData(form);
        const data = {};
        for (let [key, value] of formData.entries()) {
          if (!key.toLowerCase().includes('password')) {
            data[key] = value;
          }
        }
        
        this.track(eventName, {
          formId: form.id,
          formName: form.name,
          data
        }, metadata);
      });
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