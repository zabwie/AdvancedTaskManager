// Process management functionality
// This file handles process listing, filtering, and actions

// Function to update the process table with data
function updateProcessTable(processes) {
  const processTable = document.getElementById('process-table-body');
  if (!processTable) {
    console.error('Process table body element not found');
    return;
  }
  
  // Clear existing rows
  processTable.innerHTML = '';
  
  // Get search filter
  const searchInput = document.getElementById('process-search');
  const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
  
  // Get sort option
  const sortSelect = document.getElementById('process-sort');
  const sortBy = sortSelect ? sortSelect.value : 'cpu';
  
  // Filter and sort processes
  if (!processes || !processes.list) {
    console.error('Invalid process data:', processes);
    return;
  }
  
  let filteredProcesses = processes.list.filter(process => {
    return process.name.toLowerCase().includes(searchTerm) || 
           (process.command && process.command.toLowerCase().includes(searchTerm));
  });
  
  // Sort processes
  filteredProcesses.sort((a, b) => {
    if (sortBy === 'cpu') return b.cpu - a.cpu;
    if (sortBy === 'memory') return b.memRss - a.memRss;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'pid') return a.pid - b.pid;
    return 0;
  });
  
  // Limit the number of processes to display to reduce CPU usage
  const MAX_PROCESSES = 100; // Limit to 100 processes
  filteredProcesses = filteredProcesses.slice(0, MAX_PROCESSES);
  
  // Add rows for each process
  filteredProcesses.forEach(process => {
    const row = document.createElement('tr');
    
    // Process name
    const nameCell = document.createElement('td');
    nameCell.textContent = process.name;
    row.appendChild(nameCell);
    
    // Process ID
    const pidCell = document.createElement('td');
    pidCell.textContent = process.pid;
    row.appendChild(pidCell);
    
    // CPU usage
    const cpuCell = document.createElement('td');
    cpuCell.textContent = process.cpu ? process.cpu.toFixed(1) + '%' : '0%';
    row.appendChild(cpuCell);
    
    // Memory usage
    const memoryCell = document.createElement('td');
    const memoryMB = process.memRss / 1024 / 1024;
    memoryCell.textContent = memoryMB.toFixed(1) + ' MB';
    row.appendChild(memoryCell);
    
    // Disk I/O (placeholder)
    const diskCell = document.createElement('td');
    diskCell.textContent = 'N/A';
    row.appendChild(diskCell);
    
    // Network (placeholder)
    const networkCell = document.createElement('td');
    networkCell.textContent = 'N/A';
    row.appendChild(networkCell);
    
    // Health (placeholder)
    const healthCell = document.createElement('td');
    healthCell.textContent = 'Normal';
    row.appendChild(healthCell);
    
    // Actions
    const actionsCell = document.createElement('td');
    
    // End process button
    const endButton = document.createElement('button');
    endButton.className = 'btn btn-danger btn-sm';
    endButton.textContent = 'End';
    endButton.addEventListener('click', () => {
      if (window.electron?.ipcRenderer) {
        window.electron.ipcRenderer.send('kill-process', process.pid);
      }
    });
    actionsCell.appendChild(endButton);
    
    row.appendChild(actionsCell);
    processTable.appendChild(row);
  });
  
  // Update total processes count
  const totalProcessesElement = document.getElementById('total-processes');
  if (totalProcessesElement) {
    totalProcessesElement.textContent = `Processes: ${processes.all}`;
  }
  
  console.log(`Updated process table with ${filteredProcesses.length} processes`);
}

// Process table functionality
function initProcessTable() {
  console.log('Initializing process table');
  
  // Add event listener for process search
  const searchInput = document.getElementById('process-search');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      // Request a refresh to update the table with the search filter
      if (window.electron?.ipcRenderer) window.electron.ipcRenderer.send('refresh-data');
    });
  }

  // Add event listener for process sort
  const sortSelect = document.getElementById('process-sort');
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      // Request a refresh to update the table with the new sort
      if (window.electron?.ipcRenderer) window.electron.ipcRenderer.send('refresh-data');
    });
  }
  
  // Listen for system stats updates
  if (window.electron?.ipcRenderer) {
    console.log('Setting up system-stats listener');
    window.electron.ipcRenderer.on('system-stats', (event, data) => {
      console.log('Received system stats event:', event);
      console.log('Received system stats data:', data);
      if (data && data.processes) {
        updateProcessTable(data.processes);
      } else {
        console.error('Invalid data received:', data);
      }
    });
    
    // Initial data request
    console.log('Sending initial refresh-data request');
    window.electron.ipcRenderer.send('refresh-data');
  } else {
    console.error('Electron IPC renderer not available');
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, initializing process table');
  initProcessTable();
});

// Export functions to be used in other files
window.processManager = {
  initProcessTable,
  updateProcessTable
};