// Dashboard functionality
// This file handles the dashboard charts and system stats display

// Chart objects
let cpuChart = null;
let memoryChart = null;
let diskChart = null;
let networkChart = null;

// Chart data history
const cpuHistory = [];
const memoryHistory = [];
const diskHistory = [];
const networkHistory = [];

// Maximum data points to show in charts
const MAX_DATA_POINTS = 20;

// Initialize dashboard charts
function initDashboard() {
  console.log('Initializing dashboard');
  
  // Initialize charts
  initCpuChart();
  initMemoryChart();
  initDiskChart();
  initNetworkChart();
  
  // Listen for system stats updates
  if (window.electron?.ipcRenderer) {
    window.electron.ipcRenderer.on('system-stats', (event, data) => {
      if (data) {
        updateDashboard(data);
      }
    });
  }
}

// Initialize CPU chart
function initCpuChart() {
  const ctx = document.getElementById('cpu-chart');
  if (!ctx) return;
  
  cpuChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: Array(MAX_DATA_POINTS).fill(''),
      datasets: [{
        label: 'CPU Usage',
        data: Array(MAX_DATA_POINTS).fill(0),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.2,
        fill: true,
        backgroundColor: 'rgba(75, 192, 192, 0.2)'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          title: {
            display: true,
            text: '%'
          }
        }
      },
      plugins: {
        legend: {
          display: false
        }
      },
      animation: {
        duration: 500
      }
    }
  });
}

// Initialize Memory chart
function initMemoryChart() {
  const ctx = document.getElementById('memory-chart');
  if (!ctx) return;
  
  memoryChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: Array(MAX_DATA_POINTS).fill(''),
      datasets: [{
        label: 'Memory Usage',
        data: Array(MAX_DATA_POINTS).fill(0),
        borderColor: 'rgb(153, 102, 255)',
        tension: 0.2,
        fill: true,
        backgroundColor: 'rgba(153, 102, 255, 0.2)'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: '%'
          }
        }
      },
      plugins: {
        legend: {
          display: false
        }
      },
      animation: {
        duration: 500
      }
    }
  });
}

// Initialize Disk chart
function initDiskChart() {
  const ctx = document.getElementById('disk-chart');
  if (!ctx) return;
  
  diskChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Used', 'Free'],
      datasets: [{
        data: [0, 100],
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(75, 192, 192, 0.7)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        }
      },
      animation: {
        duration: 500
      }
    }
  });
}

// Initialize Network chart
function initNetworkChart() {
  const ctx = document.getElementById('network-chart');
  if (!ctx) return;
  
  networkChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: Array(MAX_DATA_POINTS).fill(''),
      datasets: [
        {
          label: 'Download',
          data: Array(MAX_DATA_POINTS).fill(0),
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.2,
          fill: false
        },
        {
          label: 'Upload',
          data: Array(MAX_DATA_POINTS).fill(0),
          borderColor: 'rgb(255, 99, 132)',
          tension: 0.2,
          fill: false
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'KB/s'
          }
        }
      },
      plugins: {
        legend: {
          position: 'bottom'
        }
      },
      animation: {
        duration: 500
      }
    }
  });
}

// Update dashboard with new data
function updateDashboard(data) {
  updateCpuUsage(data.cpu);
  updateMemoryUsage(data.memory);
  updateDiskUsage(data.disk);
  updateNetworkUsage(data.network);
  
  // Update system uptime if element exists
  const systemUptimeElement = document.getElementById('system-uptime');
  if (systemUptimeElement && data.time && data.time.uptime) {
    const uptime = formatUptime(data.time.uptime);
    systemUptimeElement.textContent = `Uptime: ${uptime}`;
  }
}

// Update CPU usage
function updateCpuUsage(cpuData) {
  if (!cpuData) return;
  
  const cpuUsage = cpuData.currentLoad ? cpuData.currentLoad.toFixed(1) : 0;
  
  // Update CPU usage text
  const cpuUsageElement = document.getElementById('cpu-usage');
  if (cpuUsageElement) {
    cpuUsageElement.textContent = `${cpuUsage}%`;
    
    // Add warning class if CPU usage is high
    if (cpuUsage > 80) {
      cpuUsageElement.classList.add('warning');
    } else {
      cpuUsageElement.classList.remove('warning');
    }
  }
  
  // Update CPU chart
  if (cpuChart) {
    // Add new data point
    cpuHistory.push(cpuUsage);
    
    // Keep only the last MAX_DATA_POINTS data points
    if (cpuHistory.length > MAX_DATA_POINTS) {
      cpuHistory.shift();
    }
    
    // Update chart data
    cpuChart.data.datasets[0].data = [...cpuHistory];
    
    // Update chart
    cpuChart.update();
  }
}

// Update Memory usage
function updateMemoryUsage(memData) {
  if (!memData) return;
  
  const totalMemory = memData.total / (1024 * 1024 * 1024); // Convert to GB
  const usedMemory = memData.used / (1024 * 1024 * 1024); // Convert to GB
  const memoryPercentage = (usedMemory / totalMemory * 100).toFixed(1);
  
  // Update memory usage text
  const memoryUsageElement = document.getElementById('memory-usage');
  if (memoryUsageElement) {
    memoryUsageElement.textContent = `${usedMemory.toFixed(1)} GB / ${totalMemory.toFixed(1)} GB (${memoryPercentage}%)`;
    
    // Add warning class if memory usage is high
    if (memoryPercentage > 80) {
      memoryUsageElement.classList.add('warning');
    } else {
      memoryUsageElement.classList.remove('warning');
    }
  }
  
  // Update memory chart
  if (memoryChart) {
    // Add new data point
    memoryHistory.push(memoryPercentage);
    
    // Keep only the last MAX_DATA_POINTS data points
    if (memoryHistory.length > MAX_DATA_POINTS) {
      memoryHistory.shift();
    }
    
    // Update chart data
    memoryChart.data.datasets[0].data = [...memoryHistory];
    
    // Update chart
    memoryChart.update();
  }
}

// Update Disk usage
function updateDiskUsage(diskData) {
  if (!diskData || !diskData.length) return;
  
  // Sum up all disk sizes and used space
  let totalSize = 0;
  let totalUsed = 0;
  
  diskData.forEach(disk => {
    totalSize += disk.size;
    totalUsed += disk.used;
  });
  
  const totalSizeGB = totalSize / (1024 * 1024 * 1024); // Convert to GB
  const totalUsedGB = totalUsed / (1024 * 1024 * 1024); // Convert to GB
  const diskPercentage = (totalUsedGB / totalSizeGB * 100).toFixed(1);
  
  // Update disk usage text
  const diskUsageElement = document.getElementById('disk-usage');
  if (diskUsageElement) {
    diskUsageElement.textContent = `${totalUsedGB.toFixed(1)} GB / ${totalSizeGB.toFixed(1)} GB (${diskPercentage}%)`;
    
    // Add warning class if disk usage is high
    if (diskPercentage > 90) {
      diskUsageElement.classList.add('warning');
    } else {
      diskUsageElement.classList.remove('warning');
    }
  }
  
  // Update disk chart
  if (diskChart) {
    // Update chart data
    diskChart.data.datasets[0].data = [totalUsedGB, totalSizeGB - totalUsedGB];
    
    // Update chart
    diskChart.update();
  }
}

// Update Network usage
function updateNetworkUsage(networkData) {
  if (!networkData || !networkData.length) return;
  
  // Sum up all network interfaces
  let totalRx = 0;
  let totalTx = 0;
  
  networkData.forEach(interface => {
    totalRx += interface.rx_sec || 0;
    totalTx += interface.tx_sec || 0;
  });
  
  // Convert to KB/s
  const rxKBs = (totalRx / 1024).toFixed(1);
  const txKBs = (totalTx / 1024).toFixed(1);
  
  // Update network usage text
  const networkUsageElement = document.getElementById('network-usage');
  if (networkUsageElement) {
    networkUsageElement.textContent = `↓ ${rxKBs} KB/s | ↑ ${txKBs} KB/s`;
  }
  
  // Update network chart
  if (networkChart) {
    // Add new data points
    networkHistory.push({ rx: rxKBs, tx: txKBs });
    
    // Keep only the last MAX_DATA_POINTS data points
    if (networkHistory.length > MAX_DATA_POINTS) {
      networkHistory.shift();
    }
    
    // Update chart data
    networkChart.data.datasets[0].data = networkHistory.map(point => point.rx);
    networkChart.data.datasets[1].data = networkHistory.map(point => point.tx);
    
    // Update chart
    networkChart.update();
  }
}

// Format uptime in days, hours, minutes
function formatUptime(seconds) {
  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor((seconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  let result = '';
  if (days > 0) result += `${days}d `;
  if (hours > 0 || days > 0) result += `${hours}h `;
  result += `${minutes}m`;
  
  return result;
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initDashboard();
});

// Export functions to be used in other files
window.dashboardManager = {
  initDashboard,
  updateDashboard
};