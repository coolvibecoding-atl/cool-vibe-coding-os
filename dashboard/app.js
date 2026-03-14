// CVB Dashboard App
const API_BASE = window.location.origin;

// Update clock
function updateClock() {
    const now = new Date();
    document.getElementById('current-time').textContent = now.toLocaleTimeString();
}
setInterval(updateClock, 1000);
updateClock();

// Load status from state files
async function loadStatus() {
    try {
        // In production, this would fetch from an API endpoint
        // For now, we'll simulate with localStorage or mock data
        const status = {
            trends: {
                lastRun: localStorage.getItem('trends-last') || 'Never',
                count: parseInt(localStorage.getItem('trends-count')) || 0,
                healthy: true
            },
            jobs: {
                lastRun: localStorage.getItem('jobs-last') || 'Never',
                count: parseInt(localStorage.getItem('jobs-count')) || 0,
                companies: parseInt(localStorage.getItem('jobs-companies')) || 0,
                healthy: true
            },
            github: {
                lastRun: localStorage.getItem('github-last') || 'Never',
                count: parseInt(localStorage.getItem('github-count')) || 0,
                trending: parseInt(localStorage.getItem('github-trending')) || 0,
                healthy: true
            }
        };

        updateDashboard(status);
    } catch (e) {
        console.error('Failed to load status:', e);
        showError('Failed to load status');
    }
}

// Update dashboard with status
function updateDashboard(status) {
    // AI Trend Tracker
    document.getElementById('trend-last').textContent = formatTime(status.trends.lastRun);
    document.getElementById('trend-count').textContent = status.trends.count;
    
    // Job Radar
    document.getElementById('job-last').textContent = formatTime(status.jobs.lastRun);
    document.getElementById('job-count').textContent = status.jobs.count;
    document.getElementById('job-companies').textContent = status.jobs.companies;
    
    // GitHub Monitor
    document.getElementById('github-last').textContent = formatTime(status.github.lastRun);
    document.getElementById('github-count').textContent = status.github.count;
    document.getElementById('github-trending').textContent = status.github.trending;
    
    // Summary
    const totalFindings = status.trends.count + status.jobs.count + status.github.count;
    document.getElementById('today-findings').textContent = totalFindings;
    
    // Last run (most recent)
    const runs = [status.trends.lastRun, status.jobs.lastRun, status.github.lastRun]
        .filter(r => r !== 'Never');
    if (runs.length > 0) {
        const lastRun = new Date(Math.max(...runs.map(r => new Date(r).getTime())));
        const minutesAgo = Math.floor((Date.now() - lastRun.getTime()) / 60000);
        document.getElementById('last-run').textContent = minutesAgo < 1 ? '< 1' : minutesAgo;
    }
    
    document.getElementById('dash-update').textContent = new Date().toLocaleString();
}

// Format time display
function formatTime(timeStr) {
    if (timeStr === 'Never') return 'Never';
    const date = new Date(timeStr);
    const now = new Date();
    const diff = Math.floor((now - date) / 60000); // minutes
    
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff/60)}h ago`;
    return date.toLocaleDateString();
}

// Trigger tool run
async function triggerTool(tool) {
    const button = event.target;
    const originalText = button.textContent;
    button.textContent = '⏳ Running...';
    button.disabled = true;
    
    try {
        // In production, this would call a webhook or API
        // For now, simulate with localStorage
        await simulateToolRun(tool);
        
        // Update timestamp
        localStorage.setItem(`${tool}-last`, new Date().toISOString());
        
        // Add activity log
        addActivity(`Manually triggered ${tool} tracker`);
        
        showSuccess(`${tool} tracker started!`);
    } catch (e) {
        showError(`Failed to start ${tool}: ${e.message}`);
    } finally {
        button.textContent = originalText;
        button.disabled = false;
        loadStatus();
    }
}

// Simulate tool run (replace with actual API call)
async function simulateToolRun(tool) {
    return new Promise(resolve => {
        setTimeout(() => {
            // Simulate finding items
            const count = Math.floor(Math.random() * 10) + 1;
            localStorage.setItem(`${tool}-count`, count);
            
            if (tool === 'jobs') {
                localStorage.setItem('jobs-companies', Math.floor(Math.random() * 5) + 1);
            }
            if (tool === 'github') {
                localStorage.setItem('github-trending', Math.floor(Math.random() * 3));
            }
            
            resolve();
        }, 2000);
    });
}

// Add activity log entry
function addActivity(message) {
    const log = document.getElementById('activity-log');
    const entry = document.createElement('div');
    entry.className = 'flex items-center gap-2 py-2 border-b border-gray-700 last:border-0';
    entry.innerHTML = `
        <span class="text-gray-500">${new Date().toLocaleTimeString()}</span>
        <span>${message}</span>
    `;
    log.insertBefore(entry, log.firstChild);
    
    // Keep only last 10 entries
    while (log.children.length > 10) {
        log.removeChild(log.lastChild);
    }
}

// Show success/error messages
function showSuccess(message) {
    // Could add toast notification
    console.log('✅', message);
}

function showError(message) {
    console.error('❌', message);
    alert(message);
}

// Initialize
loadStatus();
setInterval(loadStatus, 30000); // Refresh every 30 seconds

// Add initial activity
addActivity('Dashboard loaded');
