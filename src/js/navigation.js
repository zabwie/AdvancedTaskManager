// Navigation and settings functionality
document.addEventListener('DOMContentLoaded', () => {
  // Navigation tabs
  const navLinks = document.querySelectorAll('.nav-tabs a');
  const sections = document.querySelectorAll('.app-section');
  
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Remove active class from all links and sections
      navLinks.forEach(l => l.classList.remove('active'));
      sections.forEach(s => s.classList.remove('active'));
      
      // Add active class to clicked link and corresponding section
      link.classList.add('active');
      const sectionId = link.getAttribute('data-section');
      document.getElementById(sectionId).classList.add('active');
    });
  });
  
  // Settings functionality
  const notificationsToggle = document.getElementById('notifications-toggle');
  const darkModeToggle = document.getElementById('dark-mode-toggle');
  const cpuThreshold = document.getElementById('cpu-threshold');
  const memoryThreshold = document.getElementById('memory-threshold');
  const cpuThresholdValue = document.getElementById('cpu-threshold-value');
  const memoryThresholdValue = document.getElementById('memory-threshold-value');
  const updateInterval = document.getElementById('update-interval');
  const showSystemProcesses = document.getElementById('show-system-processes');
  const graphHistory = document.getElementById('graph-history');
  
  // Load saved settings
  const settings = loadSettings();
  
  // Initialize settings UI
  if (notificationsToggle) {
    notificationsToggle.checked = settings.notifications;
    notificationsToggle.addEventListener('change', () => {
      settings.notifications = notificationsToggle.checked;
      saveSettings(settings);
      window.notificationsEnabled = settings.notifications;
    });
  }
  
  if (darkModeToggle) {
    darkModeToggle.checked = settings.darkMode;
    if (settings.darkMode) {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
    }
    
    darkModeToggle.addEventListener('change', () => {
      settings.darkMode = darkModeToggle.checked;
      saveSettings(settings);
      if (settings.darkMode) {
        document.body.classList.add('dark-mode');
        document.body.classList.remove('light-mode');
      } else {
        document.body.classList.add('light-mode');
        document.body.classList.remove('dark-mode');
      }
    });
  }
  
  if (cpuThreshold) {
    cpuThreshold.value = settings.cpuThreshold;
    cpuThresholdValue.textContent = `${settings.cpuThreshold}%`;
    
    cpuThreshold.addEventListener('input', () => {
      settings.cpuThreshold = cpuThreshold.value;
      cpuThresholdValue.textContent = `${settings.cpuThreshold}%`;
      saveSettings(settings);
      window.notificationThreshold = settings.cpuThreshold;
    });
  }
  
  if (memoryThreshold) {
    memoryThreshold.value = settings.memoryThreshold;
    memoryThresholdValue.textContent = `${settings.memoryThreshold}%`;
    
    memoryThreshold.addEventListener('input', () => {
      settings.memoryThreshold = memoryThreshold.value;
      memoryThresholdValue.textContent = `${settings.memoryThreshold}%`;
      saveSettings(settings);
    });
  }
  
  if (updateInterval) {
    updateInterval.value = settings.updateInterval;
    updateInterval.addEventListener('change', () => {
      settings.updateInterval = updateInterval.value;
      saveSettings(settings);
      if (window.setUpdateFrequency) {
        window.setUpdateFrequency(settings.updateInterval);
      }
    });
  }
  
  if (showSystemProcesses) {
    showSystemProcesses.checked = settings.showSystemProcesses;
    showSystemProcesses.addEventListener('change', () => {
      settings.showSystemProcesses = showSystemProcesses.checked;
      saveSettings(settings);
      if (window.setShowSystemProcesses) {
        window.setShowSystemProcesses(settings.showSystemProcesses);
      }
    });
  }
  
  if (graphHistory) {
    graphHistory.value = settings.graphHistory;
    graphHistory.addEventListener('change', () => {
      settings.graphHistory = graphHistory.value;
      saveSettings(settings);
      // Update graph history if needed
    });
  }
  
  // Make settings available globally
  window.notificationsEnabled = settings.notifications;
  window.notificationThreshold = settings.cpuThreshold;
});

// Load settings from localStorage
function loadSettings() {
  const defaultSettings = {
    notifications: false, // Notifications disabled by default
    darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
    cpuThreshold: 80,
    memoryThreshold: 80,
    updateInterval: 1000,
    showSystemProcesses: true,
    graphHistory: 5
  };
  
  const savedSettings = localStorage.getItem('taskManagerSettings');
  if (savedSettings && savedSettings !== 'undefined') {
    try {
      return { ...defaultSettings, ...JSON.parse(savedSettings) };
    } catch (e) {
      console.error('Error parsing settings:', e);
      // If there's an error parsing, use default settings
      localStorage.removeItem('taskManagerSettings');
      return defaultSettings;
    }
  }
  return defaultSettings;
}

// Save settings to localStorage
function saveSettings(settings) {
  localStorage.setItem('taskManagerSettings', JSON.stringify(settings));
}