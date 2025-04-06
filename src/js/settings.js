// Settings management
document.addEventListener('DOMContentLoaded', () => {
  // This file is intentionally left minimal as most settings functionality
  // is handled in navigation.js to avoid duplication
  
  // Initialize theme based on system preference
  const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (prefersDarkMode) {
    document.body.classList.add('dark-mode');
    document.body.classList.remove('light-mode');
  }
  
  // Handle theme toggle button (separate from settings panel)
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      document.body.classList.toggle('light-mode');
      
      // Save preference
      const isDarkMode = document.body.classList.contains('dark-mode');
      const settings = JSON.parse(localStorage.getItem('taskManagerSettings') || '{}');
      settings.darkMode = isDarkMode;
      localStorage.setItem('taskManagerSettings', JSON.stringify(settings));
    });
  }
});