// Theme Toggle - Dark/Light Mode
(function() {
  const STORAGE_KEY = 'theme-preference';

  // Get user's preference from localStorage or system preference
  function getThemePreference() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return stored;

    // Check system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'white';
  }

  // Apply theme by swapping stylesheet
  function applyTheme(theme) {
    const stylesheet = document.querySelector('link[href*="style-"]');
    if (stylesheet) {
      const currentHref = stylesheet.getAttribute('href');
      const newHref = currentHref.replace(/style-\w+\.css/, `style-${theme}.css`);
      stylesheet.setAttribute('href', newHref);
    }

    // Update toggle button icon
    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
      toggle.innerHTML = theme === 'dark'
        ? '<i class="fas fa-sun"></i>'
        : '<i class="fas fa-moon"></i>';
      toggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    }

    document.documentElement.setAttribute('data-theme', theme);
  }

  // Toggle between themes
  function toggleTheme() {
    const current = localStorage.getItem(STORAGE_KEY) || getThemePreference();
    const next = current === 'dark' ? 'white' : 'dark';
    localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
  }

  // Initialize on page load
  document.addEventListener('DOMContentLoaded', function() {
    const theme = getThemePreference();
    applyTheme(theme);

    // Add click handler to toggle button
    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
      toggle.addEventListener('click', toggleTheme);
    }
  });

  // Apply immediately to prevent flash
  const theme = getThemePreference();
  applyTheme(theme);
})();
