const { app, BrowserWindow, ipcMain, Menu, Tray, Notification } = require('electron');
const path = require('path');
const si = require('systeminformation');

let mainWindow;
let tray = null;

function createWindow() {
  // Remove the 'const' declaration to use the global mainWindow variable
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true, // Changed to true to enable contextBridge
      preload: path.join(__dirname, 'src/js/preload.js')
    }
  });

  Menu.setApplicationMenu(null);  // Remove the menu bar

  // Load the index.html file
  mainWindow.loadFile(path.join(__dirname, 'index.html'));
  
  // Open DevTools in development mode
  // mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.on('minimize', (event) => {
    event.preventDefault();
    mainWindow.hide();
    tray = createTray();
  });
}

function createTray() {
  const trayIcon = path.join(__dirname, 'src/assets/tray-icon.png');
  // Remove the 'const' declaration to use the global tray variable
  tray = new Tray(trayIcon);
  const contextMenu = Menu.buildFromTemplate([
    { 
      label: 'Open Task Manager', 
      click: () => {
        mainWindow.show();
      } 
    },
    { 
      label: 'Quit', 
      click: () => {
        app.quit();
      } 
    }
  ]);
  
  tray.setToolTip('Task Manager');
  tray.setContextMenu(contextMenu);
  
  tray.on('click', () => {
    mainWindow.show();
  });
  
  return tray;
}

app.whenReady().then(() => {
  createWindow();
  
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
  
  // Set up system monitoring
  setupSystemMonitoring();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// System monitoring setup
function setupSystemMonitoring() {
  // CPU monitoring
  setInterval(async () => {
    try {
      const cpuData = await si.currentLoad();
      const memData = await si.mem();
      const diskData = await si.fsSize();
      const networkData = await si.networkStats();
      const processes = await si.processes();
      
      // Add debug logging
      console.log('Sending system stats to renderer');
      console.log('Process data:', processes);
      
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('system-stats', {
          cpu: cpuData,
          memory: memData,
          disk: diskData,
          network: networkData,
          processes: processes
        });
      }
    } catch (error) {
      console.error('Error fetching system information:', error);
    }
  }, 1000); // Update every second
}

// IPC handlers for process management
ipcMain.on('kill-process', async (event, pid) => {
  try {
    process.kill(pid);
    event.reply('process-killed', { success: true, pid });
  } catch (error) {
    event.reply('process-killed', { success: false, error: error.message });
  }
});

ipcMain.on('set-process-priority', async (event, { pid, priority }) => {
  try {
    // This is a simplified version. In a real app, you'd use OS-specific methods
    // Windows: Use PowerShell or WMI to set priority
    // For now, we'll just acknowledge the request
    event.reply('priority-set', { success: true, pid });
  } catch (error) {
    event.reply('priority-set', { success: false, error: error.message });
  }
});

// Show notification
function showNotification(title, body) {
  new Notification({
    title: title,
    body: body,
    icon: path.join(__dirname, 'src/assets/icon.png')
  }).show();
}

// Listen for notification requests from renderer
ipcMain.on('show-notification', (event, { title, body }) => {
  showNotification(title, body);
});