const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  'electron',
  {
    ipcRenderer: {
      send: (channel, data) => {
        // whitelist channels
        const validChannels = ['refresh-data', 'kill-process', 'set-process-priority', 'show-notification'];
        if (validChannels.includes(channel)) {
          ipcRenderer.send(channel, data);
        }
      },
      on: (channel, func) => {
        const validChannels = ['system-stats', 'process-killed', 'priority-set'];
        if (validChannels.includes(channel)) {
          // Remove the event parameter stripping - this might be causing the data loss
          ipcRenderer.on(channel, (event, ...args) => func(event, ...args));
        }
      },
      once: (channel, func) => {
        const validChannels = ['system-stats', 'process-killed', 'priority-set'];
        if (validChannels.includes(channel)) {
          // Remove the event parameter stripping here too
          ipcRenderer.once(channel, (event, ...args) => func(event, ...args));
        }
      },
      removeListener: (channel, func) => {
        const validChannels = ['system-stats', 'process-killed', 'priority-set'];
        if (validChannels.includes(channel)) {
          ipcRenderer.removeListener(channel, func);
        }
      }
    }
  }
);