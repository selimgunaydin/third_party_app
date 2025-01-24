(function(window) {
  // Store component data in global variable
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