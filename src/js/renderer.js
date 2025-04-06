// Remove the require statement and direct ipcRenderer reference
// const { ipcRenderer } = require('electron');
// window.ipcRenderer = ipcRenderer;

// Instead, use the exposed API from the preload script
const ipcRenderer = window.electron?.ipcRenderer;

// DOM Elements
const cpuUsageElement = document.getElementById('cpu-usage');
const memoryUsageElement = document.getElementById('memory-usage');
const diskUsageElement = document.getElementById('disk-usage');
const networkUsageElement = document.getElementById('network-usage');
const totalProcessesElement = document.getElementById('total-processes');
const systemUptimeElement = document.getElementById('system-uptime');
const themeToggleButton = document.getElementById('theme-toggle');
const refreshButton = document.getElementById('refresh-btn');

// App settings with default values
// Update the appSettings object to include the new performance settings
let appSettings = {
  darkMode: false,
  updateInterval: 1000,
  cpuWarningThreshold: 80,
  memoryWarningThreshold: 80,
  showSystemProcesses: true,
  graphHistory: 5,
  // Add new performance settings
  useWorkerThreads: false,
  throttleEvents: true,
  optimizeDataCollection: true,
  useAnimationFrame: true,
  limitGraphUpdates: true,
  pauseWhenInactive: true,
  batchUIUpdates: true,
  paginateProcesses: false,
  minimizeIPC: true,
  disableAnimationsUnderLoad: true
};

// Helper function to safely send IPC messages
function sendIpcMessage(channel, data) {
  if (window.electron && window.electron.ipcRenderer) {
    window.electron.ipcRenderer.send(channel, data);
  } else {
    console.error(`Cannot send IPC message: ${channel}. Electron API not available.`);
  }
}

// Update the loadSettings function to load the new settings
function loadSettings() {
  const savedSettings = localStorage.getItem('taskManagerSettings');
  if (savedSettings && savedSettings !== 'undefined') {
    try {
      appSettings = { ...appSettings, ...JSON.parse(savedSettings) };
    } catch (e) {
      console.error('Error parsing settings:', e);
      // If there's an error parsing, use default settings
      localStorage.removeItem('taskManagerSettings');
    }
  }
  
  // Apply theme based on settings
  if (appSettings.darkMode) {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }
  
  // Update UI elements to reflect current settings
  const darkModeToggle = document.getElementById('dark-mode-toggle');
  if (darkModeToggle) darkModeToggle.checked = appSettings.darkMode;
  
  const notificationsToggle = document.getElementById('notifications-toggle');
  if (notificationsToggle) notificationsToggle.checked = appSettings.notifications;
  
  const updateIntervalInput = document.getElementById('update-interval');
  if (updateIntervalInput) updateIntervalInput.value = appSettings.updateInterval;
  
  const cpuThresholdInput = document.getElementById('cpu-warning-threshold');
  if (cpuThresholdInput) cpuThresholdInput.value = appSettings.cpuWarningThreshold;
  
  const memoryThresholdInput = document.getElementById('memory-warning-threshold');
  if (memoryThresholdInput) memoryThresholdInput.value = appSettings.memoryWarningThreshold;
  
  const showSystemProcessesToggle = document.getElementById('show-system-processes');
  if (showSystemProcessesToggle) showSystemProcessesToggle.checked = appSettings.showSystemProcesses;
  
  const graphHistoryInput = document.getElementById('graph-history');
  if (graphHistoryInput) graphHistoryInput.value = appSettings.graphHistory;
  
  // Set performance settings UI
  const useWorkerThreadsToggle = document.getElementById('use-worker-threads');
  if (useWorkerThreadsToggle) useWorkerThreadsToggle.checked = appSettings.useWorkerThreads;
  
  const throttleEventsToggle = document.getElementById('throttle-events');
  if (throttleEventsToggle) throttleEventsToggle.checked = appSettings.throttleEvents;
  
  const optimizeDataCollectionToggle = document.getElementById('optimize-data-collection');
  if (optimizeDataCollectionToggle) optimizeDataCollectionToggle.checked = appSettings.optimizeDataCollection;
  
  const useAnimationFrameToggle = document.getElementById('use-animation-frame');
  if (useAnimationFrameToggle) useAnimationFrameToggle.checked = appSettings.useAnimationFrame;
  
  const limitGraphUpdatesToggle = document.getElementById('limit-graph-updates');
  if (limitGraphUpdatesToggle) limitGraphUpdatesToggle.checked = appSettings.limitGraphUpdates;
  
  const pauseWhenInactiveToggle = document.getElementById('pause-when-inactive');
  if (pauseWhenInactiveToggle) pauseWhenInactiveToggle.checked = appSettings.pauseWhenInactive;
  
  const batchUIUpdatesToggle = document.getElementById('batch-ui-updates');
  if (batchUIUpdatesToggle) batchUIUpdatesToggle.checked = appSettings.batchUIUpdates;
  
  const paginateProcessesToggle = document.getElementById('paginate-processes');
  if (paginateProcessesToggle) paginateProcessesToggle.checked = appSettings.paginateProcesses;
  
  const minimizeIPCToggle = document.getElementById('minimize-ipc');
  if (minimizeIPCToggle) minimizeIPCToggle.checked = appSettings.minimizeIPC;
  
  const disableAnimationsUnderLoadToggle = document.getElementById('disable-animations-under-load');
  if (disableAnimationsUnderLoadToggle) disableAnimationsUnderLoadToggle.checked = appSettings.disableAnimationsUnderLoad;
}

// Add this helper function at the top of your renderer.js file, before any calls to it
function safeAddEventListener(elementId, event, handler) {
  const element = document.getElementById(elementId);
  if (element) {
    element.addEventListener(event, handler);
  } else {
    console.warn(`Element with ID "${elementId}" not found for event listener`);
  }
}

// Save settings function
function saveSettings() {
  localStorage.setItem('taskManagerSettings', JSON.stringify(appSettings));
  console.log('Settings saved:', appSettings);
}

// Add event listener for save settings button
safeAddEventListener('save-settings', 'click', () => {
  // Existing settings
  const darkModeToggle = document.getElementById('dark-mode-toggle');
  const notificationsToggle = document.getElementById('notifications-toggle');
  const updateIntervalInput = document.getElementById('update-interval');
  const cpuThresholdInput = document.getElementById('cpu-warning-threshold');
  const memoryThresholdInput = document.getElementById('memory-warning-threshold');
  const showSystemProcessesToggle = document.getElementById('show-system-processes');
  const graphHistoryInput = document.getElementById('graph-history');
  
  // Performance settings
  const useWorkerThreadsToggle = document.getElementById('use-worker-threads');
  const throttleEventsToggle = document.getElementById('throttle-events');
  const optimizeDataCollectionToggle = document.getElementById('optimize-data-collection');
  const useAnimationFrameToggle = document.getElementById('use-animation-frame');
  const limitGraphUpdatesToggle = document.getElementById('limit-graph-updates');
  const pauseWhenInactiveToggle = document.getElementById('pause-when-inactive');
  const batchUIUpdatesToggle = document.getElementById('batch-ui-updates');
  const paginateProcessesToggle = document.getElementById('paginate-processes');
  const minimizeIPCToggle = document.getElementById('minimize-ipc');
  const disableAnimationsUnderLoadToggle = document.getElementById('disable-animations-under-load');
  
  // Save existing settings
  if (darkModeToggle) appSettings.darkMode = darkModeToggle.checked;
  if (notificationsToggle) appSettings.notifications = notificationsToggle.checked;
  if (updateIntervalInput) appSettings.updateInterval = parseInt(updateIntervalInput.value);
  if (cpuThresholdInput) appSettings.cpuWarningThreshold = parseInt(cpuThresholdInput.value);
  if (memoryThresholdInput) appSettings.memoryWarningThreshold = parseInt(memoryThresholdInput.value);
  if (showSystemProcessesToggle) appSettings.showSystemProcesses = showSystemProcessesToggle.checked;
  if (graphHistoryInput) appSettings.graphHistory = parseInt(graphHistoryInput.value);
  
  // Save performance settings
  if (useWorkerThreadsToggle) appSettings.useWorkerThreads = useWorkerThreadsToggle.checked;
  if (throttleEventsToggle) appSettings.throttleEvents = throttleEventsToggle.checked;
  if (optimizeDataCollectionToggle) appSettings.optimizeDataCollection = optimizeDataCollectionToggle.checked;
  if (useAnimationFrameToggle) appSettings.useAnimationFrame = useAnimationFrameToggle.checked;
  if (limitGraphUpdatesToggle) appSettings.limitGraphUpdates = limitGraphUpdatesToggle.checked;
  if (pauseWhenInactiveToggle) appSettings.pauseWhenInactive = pauseWhenInactiveToggle.checked;
  if (batchUIUpdatesToggle) appSettings.batchUIUpdates = batchUIUpdatesToggle.checked;
  if (paginateProcessesToggle) appSettings.paginateProcesses = paginateProcessesToggle.checked;
  if (minimizeIPCToggle) appSettings.minimizeIPC = minimizeIPCToggle.checked;
  if (disableAnimationsUnderLoadToggle) appSettings.disableAnimationsUnderLoad = disableAnimationsUnderLoadToggle.checked;
  
  saveSettings();
  applyPerformanceSettings();
  
  // Check if settings panel exists before trying to hide it
  const settingsPanel = document.getElementById('settings-section');
  if (settingsPanel) {
    settingsPanel.classList.remove('active');
    document.getElementById('dashboard-section').classList.add('active');
  }
});

// Add a function to apply performance settings
function applyPerformanceSettings() {
  // Apply update interval
  if (window.updateIntervalId) {
    clearInterval(window.updateIntervalId);
  }
  
  // Set up data refresh with the new interval
  if (!appSettings.pauseWhenInactive || document.visibilityState !== 'hidden') {
    if (appSettings.useAnimationFrame) {
      // Use requestAnimationFrame for smoother updates
      let lastUpdate = 0;
      const updateFrame = (timestamp) => {
        if (!lastUpdate || timestamp - lastUpdate >= appSettings.updateInterval) {
          sendIpcMessage('refresh-data');
          lastUpdate = timestamp;
        }
        window.updateFrameId = requestAnimationFrame(updateFrame);
      };
      window.updateFrameId = requestAnimationFrame(updateFrame);
    } else {
      // Use regular interval
      window.updateIntervalId = setInterval(() => {
        sendIpcMessage('refresh-data');
      }, appSettings.updateInterval);
    }
  }
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  loadSettings();
  applyPerformanceSettings();
  
  // Initial data request
  sendIpcMessage('refresh-data');
});

// Add this function to save settings to localStorage
function saveSettings() {
  localStorage.setItem('taskManagerSettings', JSON.stringify(appSettings));
  console.log('Settings saved:', appSettings);
}

// Add this function for layout updates
function updateLayout() {
  // Adjust layout based on window size
  const width = window.innerWidth;
  
  // Responsive adjustments for different screen sizes
  if (width < 768) {
    // Mobile layout adjustments
    document.body.classList.add('mobile-layout');
  } else {
    document.body.classList.remove('mobile-layout');
  }
  
  // Refresh charts if they exist
  if (window.cpuChart) window.cpuChart.resize();
  if (window.memoryChart) window.memoryChart.resize();
  if (window.diskChart) window.diskChart.resize();
  if (window.networkChart) window.networkChart.resize();
}

// Add throttle function definition
function throttle(func, delay) {
  let lastCall = 0;
  return function(...args) {
    const now = new Date().getTime();
    if (now - lastCall < delay) {
      return;
    }
    lastCall = now;
    return func(...args);
  };
}

// Update the throttling implementation
if (appSettings.throttleEvents) {
  // Remove any existing event listener first
  window.removeEventListener('resize', window.throttledResize);
  
  // Create a new throttled resize handler
  window.throttledResize = throttle(() => {
    updateLayout();
  }, 200);
  
  // Add the event listener
  window.addEventListener('resize', window.throttledResize);
}