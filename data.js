// data.js - LOADS FROM CMS JSON FILES

// Global data store
let SoftballData = {
    teams: [],
    players: [],
    batsmen: [],
    bowlers: [],
    allrounders: [],
    teamWins: {},
    playerAchievements: {},
    socialLinks: {
        facebook: "#",
        instagram: "#",
        youtube: "#"
    }
};

// Load data from CMS JSON files
async function loadCMSData() {
    console.log("Loading data from CMS files...");
    
    try {
        // Try to load each data file from the CMS
        const [teamsRes, playersRes, batsmenRes, bowlersRes, allroundersRes, winsRes, achievementsRes] = await Promise.all([
            fetch('/_data/teams.json').catch(() => null),
            fetch('/_data/players.json').catch(() => null),
            fetch('/_data/batsmen.json').catch(() => null),
            fetch('/_data/bowlers.json').catch(() => null),
            fetch('/_data/allrounders.json').catch(() => null),
            fetch('/_data/teamWins.json').catch(() => null),
            fetch('/_data/achievements.json').catch(() => null)
        ]);
        
        // Update SoftballData if files exist
        if (teamsRes && teamsRes.ok) {
            SoftballData.teams = await teamsRes.json();
            console.log("Teams loaded:", SoftballData.teams);
        }
        
        if (playersRes && playersRes.ok) {
            SoftballData.players = await playersRes.json();
            console.log("Players loaded:", SoftballData.players);
        }
        
        if (batsmenRes && batsmenRes.ok) {
            SoftballData.batsmen = await batsmenRes.json();
            console.log("Batsmen loaded:", SoftballData.batsmen);
        }
        
        if (bowlersRes && bowlersRes.ok) {
            SoftballData.bowlers = await bowlersRes.json();
            console.log("Bowlers loaded:", SoftballData.bowlers);
        }
        
        if (allroundersRes && allroundersRes.ok) {
            SoftballData.allrounders = await allroundersRes.json();
            console.log("Allrounders loaded:", SoftballData.allrounders);
        }
        
        if (winsRes && winsRes.ok) {
            SoftballData.teamWins = await winsRes.json();
            console.log("Team wins loaded:", SoftballData.teamWins);
        }
        
        if (achievementsRes && achievementsRes.ok) {
            SoftballData.playerAchievements = await achievementsRes.json();
            console.log("Achievements loaded:", SoftballData.playerAchievements);
        }
        
        console.log("✅ CMS Data loaded successfully:", SoftballData);
        
        // Also save to localStorage as backup
        localStorage.setItem('softballData', JSON.stringify(SoftballData));
        
        // Trigger page update if function exists
        if (typeof window.updateAllDisplays === 'function') {
            window.updateAllDisplays();
        }
        
        return true;
    } catch (error) {
        console.error("❌ Error loading CMS data:", error);
        
        // Fallback to localStorage
        const savedData = localStorage.getItem('softballData');
        if (savedData) {
            SoftballData = JSON.parse(savedData);
            console.log("Using localStorage backup:", SoftballData);
        }
        return false;
    }
}

// Initialize
loadCMSData();

// Refresh data every 30 seconds (so audience sees updates)
setInterval(loadCMSData, 30000);

// Save data to localStorage
function saveData() {
    try {
        localStorage.setItem('softballData', JSON.stringify(SoftballData));
        console.log("Data saved to localStorage");
        showMessage("Data saved successfully!", "success");
        return true;
    } catch (error) {
        console.error("Error saving data:", error);
        showMessage("Error saving data!", "error");
        return false;
    }
}

// Show message
function showMessage(text, type) {
    const msgDiv = document.createElement('div');
    msgDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : '#dc3545'};
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 3px 10px rgba(0,0,0,0.2);
        z-index: 10000;
        font-size: 14px;
        animation: slideIn 0.3s ease-out;
    `;
    msgDiv.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}" style="margin-right: 8px;"></i>
        ${text}
    `;
    
    document.body.appendChild(msgDiv);
    
    setTimeout(() => {
        msgDiv.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => msgDiv.remove(), 300);
    }, 3000);
}

// Add animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Export data to JSON file
function exportData() {
    const dataStr = JSON.stringify(SoftballData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'softball_backup.json';
    a.click();
    
    setTimeout(() => URL.revokeObjectURL(url), 100);
    showMessage("Backup downloaded!", "success");
}

// Import data from JSON file
function importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const imported = JSON.parse(e.target.result);
            
            // Update SoftballData with imported data
            SoftballData.teams = imported.teams || SoftballData.teams;
            SoftballData.players = imported.players || SoftballData.players;
            SoftballData.batsmen = imported.batsmen || SoftballData.batsmen;
            SoftballData.bowlers = imported.bowlers || SoftballData.bowlers;
            SoftballData.allrounders = imported.allrounders || SoftballData.allrounders;
            SoftballData.teamWins = imported.teamWins || SoftballData.teamWins;
            SoftballData.playerAchievements = imported.playerAchievements || SoftballData.playerAchievements;
            SoftballData.socialLinks = imported.socialLinks || SoftballData.socialLinks;
            
            saveData();
            showMessage("Data imported successfully! Refreshing...", "success");
            setTimeout(() => location.reload(), 1500);
        } catch (error) {
            showMessage("Invalid backup file!", "error");
        }
    };
    reader.readAsText(file);
}

// Handle file input
function handleFileImport(event) {
    importData(event);
}

// Make functions and data globally available
window.SoftballData = SoftballData;
window.saveData = saveData;
window.exportData = exportData;
window.importData = importData;
window.handleFileImport = handleFileImport;
window.loadCMSData = loadCMSData;// data.js - CENTRAL DATA MANAGEMENT - COMPLETELY EMPTY START

// Global data store - ALL EMPTY
const SoftballData = {
    teams: [],
    players: [],
    batsmen: [],
    bowlers: [],
    allrounders: [],
    teamWins: {},
    playerAchievements: {},
    socialLinks: {
        facebook: "#",
        instagram: "#",
        youtube: "#"
    }
};

// Initialize with COMPLETELY EMPTY data
function initializeDefaultData() {
    console.log("Starting with empty data...");
    // ALL ARRAYS ARE EMPTY - NO DEFAULT DATA
    SoftballData.teams = [];
    SoftballData.players = [];
    SoftballData.batsmen = [];
    SoftballData.bowlers = [];
    SoftballData.allrounders = [];
    SoftballData.teamWins = {};
    SoftballData.playerAchievements = {};
    // Keep default social links
    SoftballData.socialLinks = {
        facebook: "#",
        instagram: "#",
        youtube: "#"
    };
}

// Load data from localStorage
function loadData() {
    console.log("Loading data from localStorage...");
    try {
        const savedData = localStorage.getItem('softballData');
        if (savedData) {
            const parsed = JSON.parse(savedData);
            
            // Update SoftballData with saved data
            SoftballData.teams = parsed.teams || [];
            SoftballData.players = parsed.players || [];
            SoftballData.batsmen = parsed.batsmen || [];
            SoftballData.bowlers = parsed.bowlers || [];
            SoftballData.allrounders = parsed.allrounders || [];
            SoftballData.teamWins = parsed.teamWins || {};
            SoftballData.playerAchievements = parsed.playerAchievements || {};
            SoftballData.socialLinks = parsed.socialLinks || { facebook: "#", instagram: "#", youtube: "#" };
            
            console.log("Data loaded from localStorage:", SoftballData);
        } else {
            console.log("No saved data found, starting with empty data");
            initializeDefaultData();
            saveData();
        }
        
        // Make sure data is accessible globally
        window.SoftballData = SoftballData;
        
        return true;
    } catch (error) {
        console.error("Error loading data:", error);
        initializeDefaultData();
        return false;
    }
}

// Save data to localStorage
function saveData() {
    try {
        localStorage.setItem('softballData', JSON.stringify(SoftballData));
        console.log("Data saved to localStorage:", SoftballData);
        showMessage("Data saved successfully!", "success");
        return true;
    } catch (error) {
        console.error("Error saving data:", error);
        showMessage("Error saving data!", "error");
        return false;
    }
}

// Show message
function showMessage(text, type) {
    const msgDiv = document.createElement('div');
    msgDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : '#dc3545'};
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 3px 10px rgba(0,0,0,0.2);
        z-index: 10000;
        font-size: 14px;
        animation: slideIn 0.3s ease-out;
    `;
    msgDiv.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}" style="margin-right: 8px;"></i>
        ${text}
    `;
    
    document.body.appendChild(msgDiv);
    
    setTimeout(() => {
        msgDiv.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => msgDiv.remove(), 300);
    }, 3000);
}

// Add animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Export data to JSON file
function exportData() {
    const dataStr = JSON.stringify(SoftballData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'softball_backup.json';
    a.click();
    
    setTimeout(() => URL.revokeObjectURL(url), 100);
    showMessage("Backup downloaded!", "success");
}

// Import data from JSON file
function importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const imported = JSON.parse(e.target.result);
            
            // Update SoftballData with imported data
            SoftballData.teams = imported.teams || [];
            SoftballData.players = imported.players || [];
            SoftballData.batsmen = imported.batsmen || [];
            SoftballData.bowlers = imported.bowlers || [];
            SoftballData.allrounders = imported.allrounders || [];
            SoftballData.teamWins = imported.teamWins || {};
            SoftballData.playerAchievements = imported.playerAchievements || {};
            SoftballData.socialLinks = imported.socialLinks || { facebook: "#", instagram: "#", youtube: "#" };
            
            saveData();
            showMessage("Data imported successfully! Refreshing...", "success");
            setTimeout(() => location.reload(), 1500);
        } catch (error) {
            showMessage("Invalid backup file!", "error");
        }
    };
    reader.readAsText(file);
}

// Handle file input
function handleFileImport(event) {
    importData(event);
}

// Initialize on load
loadData();

// Make functions and data globally available
window.SoftballData = SoftballData;
window.saveData = saveData;
window.exportData = exportData;
window.importData = importData;
window.handleFileImport = handleFileImport;
