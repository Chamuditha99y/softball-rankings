// admin.js - Complete Admin Panel - SIMPLIFIED: All players appear in all rankings

// Get data from global store - always fresh
let teams = SoftballData.teams;
let players = SoftballData.players;
let batsmen = SoftballData.batsmen;
let bowlers = SoftballData.bowlers;
let allrounders = SoftballData.allrounders;
let teamWins = SoftballData.teamWins;
let playerAchievements = SoftballData.playerAchievements;
let socialLinks = SoftballData.socialLinks;

// Initialize page
window.onload = function() {
    refreshData();
    loadAllEdits();
    updateStats();
    populateTeamFilter();
    populatePlayerSelect();
    
    setTimeout(function() {
        populateTeamFilter();
        populatePlayerSelect();
    }, 500);
};

// Refresh data from SoftballData
function refreshData() {
    teams = SoftballData.teams;
    players = SoftballData.players;
    batsmen = SoftballData.batsmen;
    bowlers = SoftballData.bowlers;
    allrounders = SoftballData.allrounders;
    teamWins = SoftballData.teamWins;
    playerAchievements = SoftballData.playerAchievements;
    socialLinks = SoftballData.socialLinks;
}

// Update stats
function updateStats() {
    document.getElementById('totalTeams').textContent = teams.length;
    document.getElementById('totalPlayers').textContent = players.length;
    
    let total = 0;
    for (let t in teamWins) total += teamWins[t]?.length || 0;
    document.getElementById('totalTournaments').textContent = total;
}

// Populate filters
function populateTeamFilter() {
    let select = document.getElementById('teamFilterSelect');
    if (!select) return;
    select.innerHTML = '<option value="">All Teams</option>';
    if (teams && teams.length > 0) {
        teams.forEach(t => select.innerHTML += `<option value="${t.name}">${t.name}</option>`);
    }
}

function populatePlayerSelect() {
    let select = document.getElementById('playerForAchievement');
    if (!select) return;
    select.innerHTML = '<option value="">Select Player</option>';
    if (players && players.length > 0) {
        players.forEach(p => select.innerHTML += `<option value="${p.name}">${p.name}</option>`);
    }
}

// Tab switching
window.openTab = function(tabName) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(tabName + 'Tab').classList.add('active');
    if (event) event.target.classList.add('active');
};

// Load all edits
function loadAllEdits() {
    loadTeamsEdit();
    loadPlayersEdit();
    loadBatsmenEdit();
    loadBowlersEdit();
    loadAllroundersEdit();
    loadTeamWinsEdit();
    loadSocialLinks();
}

// Load teams edit
function loadTeamsEdit() {
    let html = '';
    if (teams && teams.length > 0) {
        teams.forEach((t, i) => {
            html += `<tr>
                <td><input type="text" class="admin-input" value="${t.name}" id="teamName${i}"></td>
                <td><input type="number" class="admin-input" value="${t.champs}" id="teamChamps${i}" style="width:80px"></td>
                <td><input type="number" class="admin-input" value="${t.runnersUp}" id="teamRunners${i}" style="width:80px"></td>
                <td><input type="number" class="admin-input" value="${t.cashTotal}" id="teamCash${i}" style="width:100px"></td>
                <td><input type="number" class="admin-input" value="${t.points}" id="teamPoints${i}" style="width:80px"></td>
                <td><button onclick="deleteTeam(${i})" class="delete-btn"><i class="fas fa-trash"></i></button></td>
            </tr>`;
        });
    } else {
        html = '<tr><td colspan="6" style="text-align: center;">No teams found. Add a team first.</td></tr>';
    }
    let tableBody = document.getElementById('teamsEditTable');
    if (tableBody) tableBody.innerHTML = html;
}

// Load players edit
function loadPlayersEdit(filter = '') {
    let html = '';
    let filtered = filter ? players.filter(p => p.team === filter) : players;
    
    if (filtered && filtered.length > 0) {
        filtered.forEach((p) => {
            html += `<tr class="player-row" data-player-id="${p.id}">
                <td><input type="text" class="admin-input" value="${p.regNo || ''}" id="playerReg_${p.id}" placeholder="Enter Reg No" style="width:80px"></td>
                <td><input type="text" class="admin-input" value="${p.name || ''}" id="playerName_${p.id}" placeholder="Enter Name"></td>
                <td>
                    <select class="admin-input" id="playerTeam_${p.id}" onchange="updatePlayerTeamById('${p.id}', this.value)">
                        ${generateTeamOptions(p.team)}
                    </select>
                </td>
                <td>All Rounder</td>
                <td><button onclick="deletePlayerById('${p.id}')" class="delete-btn"><i class="fas fa-trash"></i></button></td>
            </tr>`;
        });
    } else {
        html = '<tr><td colspan="5" style="text-align: center;">No players found</td></tr>';
    }
    let tableBody = document.getElementById('playersEditTable');
    if (tableBody) tableBody.innerHTML = html;
}

// Helper function to generate team options
function generateTeamOptions(selectedTeam) {
    let options = '';
    if (teams && teams.length > 0) {
        teams.forEach(t => {
            options += `<option value="${t.name}" ${t.name === selectedTeam ? 'selected' : ''}>${t.name}</option>`;
        });
    } else {
        options += `<option value="">No teams available</option>`;
    }
    return options;
}

// Update player team by ID - Updates in ALL ranking arrays
window.updatePlayerTeamById = function(playerId, newTeam) {
    let playerIndex = players.findIndex(p => p.id === playerId);
    if (playerIndex === -1) return;
    
    let player = players[playerIndex];
    let oldTeam = player.team;
    player.team = newTeam;
    
    // Update in ALL ranking arrays by matching name AND regNo
    // Update batsmen
    let batsmanIndex = batsmen.findIndex(p => p.name === player.name && p.regNo === player.regNo);
    if (batsmanIndex !== -1) {
        batsmen[batsmanIndex].team = newTeam;
    }
    
    // Update bowlers
    let bowlerIndex = bowlers.findIndex(p => p.name === player.name && p.regNo === player.regNo);
    if (bowlerIndex !== -1) {
        bowlers[bowlerIndex].team = newTeam;
    }
    
    // Update allrounders
    let allrounderIndex = allrounders.findIndex(p => p.name === player.name && p.regNo === player.regNo);
    if (allrounderIndex !== -1) {
        allrounders[allrounderIndex].team = newTeam;
    }
    
    // Update achievements if they exist
    if (playerAchievements[player.name]) {
        playerAchievements[player.name].forEach(a => {
            if (a.team === oldTeam) {
                a.team = newTeam;
            }
        });
    }
    
    // Update global object
    SoftballData.players = players;
    SoftballData.batsmen = batsmen;
    SoftballData.bowlers = bowlers;
    SoftballData.allrounders = allrounders;
    SoftballData.playerAchievements = playerAchievements;
    
    saveData();
    
    // Reload ALL displays
    loadPlayersEdit();
    loadBatsmenEdit();
    loadBowlersEdit();
    loadAllroundersEdit();
};

// Delete player by ID
window.deletePlayerById = function(playerId) {
    let playerIndex = players.findIndex(p => p.id === playerId);
    if (playerIndex === -1) return;
    
    if (confirm("⚠️ Delete this player permanently?")) {
        let player = players[playerIndex];
        let playerName = player.name;
        let playerReg = player.regNo;
        
        // Remove from all places
        players.splice(playerIndex, 1);
        batsmen = batsmen.filter(p => !(p.name === playerName && p.regNo === playerReg));
        bowlers = bowlers.filter(p => !(p.name === playerName && p.regNo === playerReg));
        allrounders = allrounders.filter(p => !(p.name === playerName && p.regNo === playerReg));
        
        // Remove achievements
        delete playerAchievements[playerName];
        
        SoftballData.players = players;
        SoftballData.batsmen = batsmen;
        SoftballData.bowlers = bowlers;
        SoftballData.allrounders = allrounders;
        SoftballData.playerAchievements = playerAchievements;
        
        saveData();
        loadPlayersEdit();
        loadBatsmenEdit();
        loadBowlersEdit();
        loadAllroundersEdit();
        populatePlayerSelect();
        updateStats();
        
        alert(`✅ Player "${playerName}" deleted permanently`);
    }
};

// Load batsmen edit
function loadBatsmenEdit() {
    let html = '';
    if (batsmen && batsmen.length > 0) {
        batsmen.forEach((p, i) => {
            html += `<tr class="batsman-row">
                <td><input type="checkbox" class="player-select" onchange="selectPlayer('batsman', ${i})"></td>
                <td><input type="text" class="admin-input" value="${p.regNo || ''}" id="batsmanReg${i}" placeholder="Reg No" style="width:80px"></td>
                <td><input type="text" class="admin-input" value="${p.name || ''}" id="batsmanName${i}" placeholder="Name"></td>
                <td>
                    <select class="admin-input" id="batsmanTeam${i}" onchange="updateBatsmanTeam(${i}, this.value)">
                        ${generateTeamOptions(p.team)}
                    </select>
                </td>
                <td><input type="number" class="admin-input" value="${p.awards || 0}" id="batsmanAwards${i}" style="width:70px"></td>
                <td><input type="number" class="admin-input" value="${p.points || 0}" id="batsmanPoints${i}" style="width:70px"></td>
                <td><button onclick="deleteBatsman(${i})" class="delete-btn"><i class="fas fa-trash"></i></button></td>
            </tr>`;
        });
    } else {
        html = '<tr><td colspan="7" style="text-align: center;">No batsmen found</td></tr>';
    }
    let tableBody = document.getElementById('batsmenEditTable');
    if (tableBody) tableBody.innerHTML = html;
}

// Load bowlers edit
function loadBowlersEdit() {
    let html = '';
    if (bowlers && bowlers.length > 0) {
        bowlers.forEach((p, i) => {
            html += `<tr class="bowler-row">
                <td><input type="checkbox" class="player-select" onchange="selectPlayer('bowler', ${i})"></td>
                <td><input type="text" class="admin-input" value="${p.regNo || ''}" id="bowlerReg${i}" placeholder="Reg No" style="width:80px"></td>
                <td><input type="text" class="admin-input" value="${p.name || ''}" id="bowlerName${i}" placeholder="Name"></td>
                <td>
                    <select class="admin-input" id="bowlerTeam${i}" onchange="updateBowlerTeam(${i}, this.value)">
                        ${generateTeamOptions(p.team)}
                    </select>
                </td>
                <td><input type="number" class="admin-input" value="${p.awards || 0}" id="bowlerAwards${i}" style="width:70px"></td>
                <td><input type="number" class="admin-input" value="${p.points || 0}" id="bowlerPoints${i}" style="width:70px"></td>
                <td><button onclick="deleteBowler(${i})" class="delete-btn"><i class="fas fa-trash"></i></button></td>
            </tr>`;
        });
    } else {
        html = '<tr><td colspan="7" style="text-align: center;">No bowlers found</td></tr>';
    }
    let tableBody = document.getElementById('bowlersEditTable');
    if (tableBody) tableBody.innerHTML = html;
}

// Load allrounders edit
function loadAllroundersEdit() {
    let html = '';
    if (allrounders && allrounders.length > 0) {
        allrounders.forEach((p, i) => {
            html += `<tr class="allrounder-row">
                <td><input type="checkbox" class="player-select" onchange="selectPlayer('allrounder', ${i})"></td>
                <td><input type="text" class="admin-input" value="${p.regNo || ''}" id="allrounderReg${i}" placeholder="Reg No" style="width:80px"></td>
                <td><input type="text" class="admin-input" value="${p.name || ''}" id="allrounderName${i}" placeholder="Name"></td>
                <td>
                    <select class="admin-input" id="allrounderTeam${i}" onchange="updateAllrounderTeam(${i}, this.value)">
                        ${generateTeamOptions(p.team)}
                    </select>
                </td>
                <td><input type="number" class="admin-input" value="${p.awards || 0}" id="allrounderAwards${i}" style="width:70px"></td>
                <td><input type="number" class="admin-input" value="${p.points || 0}" id="allrounderPoints${i}" style="width:70px"></td>
                <td><button onclick="deleteAllrounder(${i})" class="delete-btn"><i class="fas fa-trash"></i></button></td>
            </tr>`;
        });
    } else {
        html = '<tr><td colspan="7" style="text-align: center;">No all rounders found</td></tr>';
    }
    let tableBody = document.getElementById('allroundersEditTable');
    if (tableBody) tableBody.innerHTML = html;
}

// Update batsman team - sync with player
window.updateBatsmanTeam = function(index, newTeam) {
    let batsman = batsmen[index];
    if (!batsman) return;
    
    batsman.team = newTeam;
    
    // Update in players array
    let player = players.find(p => p.name === batsman.name && p.regNo === batsman.regNo);
    if (player) {
        player.team = newTeam;
    }
    
    // Update in other ranking arrays
    let bowlerIndex = bowlers.findIndex(p => p.name === batsman.name && p.regNo === batsman.regNo);
    if (bowlerIndex !== -1) {
        bowlers[bowlerIndex].team = newTeam;
    }
    
    let allrounderIndex = allrounders.findIndex(p => p.name === batsman.name && p.regNo === batsman.regNo);
    if (allrounderIndex !== -1) {
        allrounders[allrounderIndex].team = newTeam;
    }
    
    SoftballData.batsmen = batsmen;
    SoftballData.players = players;
    SoftballData.bowlers = bowlers;
    SoftballData.allrounders = allrounders;
    
    saveData();
    
    loadPlayersEdit();
    loadBatsmenEdit();
    loadBowlersEdit();
    loadAllroundersEdit();
};

// Update bowler team - sync with player
window.updateBowlerTeam = function(index, newTeam) {
    let bowler = bowlers[index];
    if (!bowler) return;
    
    bowler.team = newTeam;
    
    // Update in players array
    let player = players.find(p => p.name === bowler.name && p.regNo === bowler.regNo);
    if (player) {
        player.team = newTeam;
    }
    
    // Update in other ranking arrays
    let batsmanIndex = batsmen.findIndex(p => p.name === bowler.name && p.regNo === bowler.regNo);
    if (batsmanIndex !== -1) {
        batsmen[batsmanIndex].team = newTeam;
    }
    
    let allrounderIndex = allrounders.findIndex(p => p.name === bowler.name && p.regNo === bowler.regNo);
    if (allrounderIndex !== -1) {
        allrounders[allrounderIndex].team = newTeam;
    }
    
    SoftballData.bowlers = bowlers;
    SoftballData.players = players;
    SoftballData.batsmen = batsmen;
    SoftballData.allrounders = allrounders;
    
    saveData();
    
    loadPlayersEdit();
    loadBatsmenEdit();
    loadBowlersEdit();
    loadAllroundersEdit();
};

// Update allrounder team - sync with player
window.updateAllrounderTeam = function(index, newTeam) {
    let allrounder = allrounders[index];
    if (!allrounder) return;
    
    allrounder.team = newTeam;
    
    // Update in players array
    let player = players.find(p => p.name === allrounder.name && p.regNo === allrounder.regNo);
    if (player) {
        player.team = newTeam;
    }
    
    // Update in other ranking arrays
    let batsmanIndex = batsmen.findIndex(p => p.name === allrounder.name && p.regNo === allrounder.regNo);
    if (batsmanIndex !== -1) {
        batsmen[batsmanIndex].team = newTeam;
    }
    
    let bowlerIndex = bowlers.findIndex(p => p.name === allrounder.name && p.regNo === allrounder.regNo);
    if (bowlerIndex !== -1) {
        bowlers[bowlerIndex].team = newTeam;
    }
    
    SoftballData.allrounders = allrounders;
    SoftballData.players = players;
    SoftballData.batsmen = batsmen;
    SoftballData.bowlers = bowlers;
    
    saveData();
    
    loadPlayersEdit();
    loadBatsmenEdit();
    loadBowlersEdit();
    loadAllroundersEdit();
};

// Load team wins edit
function loadTeamWinsEdit() {
    let html = '';
    if (teams && teams.length > 0) {
        teams.forEach(team => {
            html += `<h4 style="margin:20px 0 10px;">${team.name}</h4>`;
            let wins = teamWins[team.name] || [];
            if (wins.length > 0) {
                wins.forEach((w, i) => {
                    html += `
                        <div class="win-row" style="display: grid; grid-template-columns: 1fr auto 1fr auto; gap: 10px; margin-bottom: 10px;">
                            <input type="text" class="admin-input" value="${w.tournament}" id="winTournament${team.name}${i}" placeholder="Tournament">
                            <input type="date" class="admin-input" value="${w.date}" id="winDate${team.name}${i}" style="width:140px">
                            <input type="text" class="admin-input" value="${w.prize}" id="winPrize${team.name}${i}" placeholder="Prize">
                            <button onclick="deleteWin('${team.name}', ${i})" class="delete-btn"><i class="fas fa-trash"></i></button>
                        </div>
                    `;
                });
            } else {
                html += `<p>No wins for this team yet.</p>`;
            }
            html += `<button onclick="addNewWin('${team.name}')" class="add-btn">+ Add Win</button>`;
        });
    } else {
        html = '<p>No teams found. Add a team first.</p>';
    }
    let container = document.getElementById('teamWinsEdit');
    if (container) container.innerHTML = html;
}

// Load social links
function loadSocialLinks() {
    document.getElementById('facebookLink').value = socialLinks.facebook || '';
    document.getElementById('instagramLink').value = socialLinks.instagram || '';
    document.getElementById('youtubeLink').value = socialLinks.youtube || '';
}

// Load player achievements
window.loadPlayerAchievements = function() {
    let player = document.getElementById('playerForAchievement').value;
    let display = document.getElementById('playerAchievementsEdit');
    if (!player) { display.innerHTML = ''; return; }
    
    let list = playerAchievements[player] || [];
    let html = `<h4>${player}</h4>`;
    
    if (list.length > 0) {
        list.forEach((a, i) => {
            html += `
                <div class="achievement-row" style="display: grid; grid-template-columns: 1fr auto 1fr auto auto auto; gap: 10px; margin-bottom: 10px;">
                    <input type="text" class="admin-input" value="${a.tournament}" id="achTournament${player}${i}" placeholder="Tournament">
                    <input type="date" class="admin-input" value="${a.date}" id="achDate${player}${i}" style="width:140px">
                    <input type="text" class="admin-input" value="${a.achievement}" id="achAchievement${player}${i}" placeholder="Achievement">
                    <select class="admin-input" id="achCategory${player}${i}" style="width:100px">
                        <option value="Batsman" ${a.category === 'Batsman' ? 'selected' : ''}>Batsman</option>
                        <option value="Bowler" ${a.category === 'Bowler' ? 'selected' : ''}>Bowler</option>
                        <option value="All Rounder" ${a.category === 'All Rounder' ? 'selected' : ''}>All Rounder</option>
                    </select>
                    <select class="admin-input" id="achTeam${player}${i}" style="width:150px">
                        ${generateTeamOptions(a.team)}
                    </select>
                    <button onclick="deleteAchievement('${player}', ${i})" class="delete-btn"><i class="fas fa-trash"></i></button>
                </div>
            `;
        });
    } else {
        html += `<p>No achievements for this player yet.</p>`;
    }
    display.innerHTML = html;
};

// ============== FIXED: Add player row - REMOVED category selection ==============
window.addPlayerRow = function() {
    let container = document.getElementById('playersRowsContainer');
    let count = container.children.length;
    let row = document.createElement('div');
    row.className = 'player-row';
    row.style.cssText = 'display: grid; grid-template-columns: 100px 1fr 100px; gap: 10px; margin-bottom: 10px; align-items: center;';
    row.innerHTML = `
        <input type="text" class="admin-input" placeholder="Reg No" id="playerReg${count}" value="" style="background: white;">
        <input type="text" class="admin-input" placeholder="Player Name" id="playerName${count}" value="" style="background: white;">
        <button type="button" onclick="removePlayerRow(this)" class="delete-btn-small"><i class="fas fa-trash"></i></button>
    `;
    container.appendChild(row);
};

// Remove player row
window.removePlayerRow = function(btn) {
    let container = document.getElementById('playersRowsContainer');
    if (container.children.length <= 3) {
        alert("Minimum 3 players required!");
        return;
    }
    btn.closest('.player-row').remove();
};

// ============== FIXED: Add team and players - NOW adds to ALL rankings ==============
window.addTeamAndPlayers = function() {
    let teamName = document.getElementById('newTeamName').value.trim();
    if (!teamName) { alert("Enter team name!"); return; }
    if (teams.some(t => t.name === teamName)) { alert("Team already exists!"); return; }
    
    let playersList = [];
    let rows = document.querySelectorAll('#playersRowsContainer .player-row');
    
    for (let i = 0; i < rows.length; i++) {
        let reg = document.getElementById(`playerReg${i}`)?.value.trim();
        let name = document.getElementById(`playerName${i}`)?.value.trim();
        
        if (reg && name) playersList.push({ reg, name });
        else if (reg || name) { alert(`Player ${i+1}: Please fill both Reg No and Name`); return; }
    }
    
    if (playersList.length < 3) { alert("Need at least 3 players!"); return; }
    
    // Add team
    let newTeam = { 
        name: teamName, 
        champs: 0, 
        runnersUp: 0, 
        cashTotal: 0, 
        points: 0,
        rank: teams.length + 1, 
        prevRank: teams.length + 1
    };
    teams.push(newTeam);
    
    // Add players to ALL rankings
    playersList.forEach(p => {
        let newId = "P" + String(players.length + 1).padStart(3, '0');
        let newPlayer = {
            id: newId,
            regNo: p.reg, 
            name: p.name, 
            team: teamName
        };
        players.push(newPlayer);
        
        // Add to batsmen
        batsmen.push({ 
            regNo: p.reg, 
            name: p.name, 
            team: teamName,
            awards: 0, 
            points: 0, 
            rank: batsmen.length + 1, 
            prevRank: batsmen.length + 1 
        });
        
        // Add to bowlers
        bowlers.push({ 
            regNo: p.reg, 
            name: p.name, 
            team: teamName,
            awards: 0, 
            points: 0, 
            rank: bowlers.length + 1, 
            prevRank: bowlers.length + 1 
        });
        
        // Add to allrounders
        allrounders.push({ 
            regNo: p.reg, 
            name: p.name, 
            team: teamName,
            awards: 0, 
            points: 0, 
            rank: allrounders.length + 1, 
            prevRank: allrounders.length + 1 
        });
    });
    
    // Update global object
    SoftballData.teams = teams;
    SoftballData.players = players;
    SoftballData.batsmen = batsmen;
    SoftballData.bowlers = bowlers;
    SoftballData.allrounders = allrounders;
    
    // Save to localStorage
    saveData();
    
    // Clear form and reload
    document.getElementById('newTeamName').value = '';
    let container = document.getElementById('playersRowsContainer');
    container.innerHTML = '';
    
    // Reset with 3 empty rows
    for (let i = 0; i < 3; i++) {
        let row = document.createElement('div');
        row.className = 'player-row';
        row.style.cssText = 'display: grid; grid-template-columns: 100px 1fr 100px; gap: 10px; margin-bottom: 10px; align-items: center;';
        row.innerHTML = `
            <input type="text" class="admin-input" placeholder="Reg No" id="playerReg${i}" value="" style="background: white;">
            <input type="text" class="admin-input" placeholder="Player Name" id="playerName${i}" value="" style="background: white;">
            <button type="button" onclick="removePlayerRow(this)" class="delete-btn-small" ${i === 0 ? 'style="display: none;"' : ''}><i class="fas fa-trash"></i></button>
        `;
        container.appendChild(row);
    }
    
    loadTeamsEdit();
    loadPlayersEdit();
    loadBatsmenEdit();
    loadBowlersEdit();
    loadAllroundersEdit();
    populateTeamFilter();
    populatePlayerSelect();
    updateStats();
    
    alert(`✅ Team "${teamName}" created with ${playersList.length} players! Each player appears in Batsmen, Bowlers, and All Rounders tabs.`);
};

// Add new team
window.addNewTeam = function() {
    teams.push({ 
        name: "NEW TEAM", 
        champs: 0, 
        runnersUp: 0, 
        cashTotal: 0, 
        points: 0,
        rank: teams.length + 1, 
        prevRank: teams.length + 1 
    });
    SoftballData.teams = teams;
    saveData();
    loadTeamsEdit(); 
    populateTeamFilter(); 
    updateStats();
};

// Add new player - Adds to ALL rankings
window.addNewPlayer = function() {
    if (!teams || teams.length === 0) {
        alert("Please add a team first before adding players!");
        return;
    }
    
    let teamName = teams[0].name;
    
    let newId = "P" + String(players.length + 1).padStart(3, '0');
    
    let newPlayer = {
        id: newId,
        regNo: "",
        name: "",
        team: teamName
    };
    players.push(newPlayer);
    
    // Add to ALL rankings
    batsmen.push({ 
        regNo: "", 
        name: "", 
        team: teamName,
        awards: 0, 
        points: 0, 
        rank: batsmen.length + 1, 
        prevRank: batsmen.length + 1 
    });
    
    bowlers.push({ 
        regNo: "", 
        name: "", 
        team: teamName,
        awards: 0, 
        points: 0, 
        rank: bowlers.length + 1, 
        prevRank: bowlers.length + 1 
    });
    
    allrounders.push({ 
        regNo: "", 
        name: "", 
        team: teamName,
        awards: 0, 
        points: 0, 
        rank: allrounders.length + 1, 
        prevRank: allrounders.length + 1 
    });
    
    SoftballData.players = players;
    SoftballData.batsmen = batsmen;
    SoftballData.bowlers = bowlers;
    SoftballData.allrounders = allrounders;
    
    saveData(); 
    
    loadPlayersEdit(); 
    loadBatsmenEdit();
    loadBowlersEdit();
    loadAllroundersEdit();
    populatePlayerSelect(); 
    updateStats();
    
    alert("✅ New player added to Players DB and all ranking tabs!");
};

// Add new batsman
window.addNewBatsman = function() {
    if (!teams || teams.length === 0) {
        alert("Please add a team first!");
        return;
    }
    
    let teamName = teams[0].name;
    
    let newBatsman = { 
        regNo: "", 
        name: "", 
        team: teamName,
        awards: 0, 
        points: 0, 
        rank: batsmen.length + 1, 
        prevRank: batsmen.length + 1 
    };
    batsmen.push(newBatsman);
    
    // Also add to players and other rankings
    let newId = "P" + String(players.length + 1).padStart(3, '0');
    players.push({
        id: newId,
        regNo: "",
        name: "",
        team: teamName
    });
    
    bowlers.push({ 
        regNo: "", 
        name: "", 
        team: teamName,
        awards: 0, 
        points: 0, 
        rank: bowlers.length + 1, 
        prevRank: bowlers.length + 1 
    });
    
    allrounders.push({ 
        regNo: "", 
        name: "", 
        team: teamName,
        awards: 0, 
        points: 0, 
        rank: allrounders.length + 1, 
        prevRank: allrounders.length + 1 
    });
    
    SoftballData.batsmen = batsmen;
    SoftballData.players = players;
    SoftballData.bowlers = bowlers;
    SoftballData.allrounders = allrounders;
    
    saveData(); 
    loadBatsmenEdit();
    loadPlayersEdit();
    loadBowlersEdit();
    loadAllroundersEdit();
    populatePlayerSelect();
};

// Add new bowler
window.addNewBowler = function() {
    if (!teams || teams.length === 0) {
        alert("Please add a team first!");
        return;
    }
    
    let teamName = teams[0].name;
    
    let newBowler = { 
        regNo: "", 
        name: "", 
        team: teamName,
        awards: 0, 
        points: 0, 
        rank: bowlers.length + 1, 
        prevRank: bowlers.length + 1 
    };
    bowlers.push(newBowler);
    
    // Also add to players and other rankings
    let newId = "P" + String(players.length + 1).padStart(3, '0');
    players.push({
        id: newId,
        regNo: "",
        name: "",
        team: teamName
    });
    
    batsmen.push({ 
        regNo: "", 
        name: "", 
        team: teamName,
        awards: 0, 
        points: 0, 
        rank: batsmen.length + 1, 
        prevRank: batsmen.length + 1 
    });
    
    allrounders.push({ 
        regNo: "", 
        name: "", 
        team: teamName,
        awards: 0, 
        points: 0, 
        rank: allrounders.length + 1, 
        prevRank: allrounders.length + 1 
    });
    
    SoftballData.bowlers = bowlers;
    SoftballData.players = players;
    SoftballData.batsmen = batsmen;
    SoftballData.allrounders = allrounders;
    
    saveData(); 
    loadBowlersEdit();
    loadPlayersEdit();
    loadBatsmenEdit();
    loadAllroundersEdit();
    populatePlayerSelect();
};

// Add new allrounder
window.addNewAllrounder = function() {
    if (!teams || teams.length === 0) {
        alert("Please add a team first!");
        return;
    }
    
    let teamName = teams[0].name;
    
    let newAllrounder = { 
        regNo: "", 
        name: "", 
        team: teamName,
        awards: 0, 
        points: 0, 
        rank: allrounders.length + 1, 
        prevRank: allrounders.length + 1 
    };
    allrounders.push(newAllrounder);
    
    // Also add to players and other rankings
    let newId = "P" + String(players.length + 1).padStart(3, '0');
    players.push({
        id: newId,
        regNo: "",
        name: "",
        team: teamName
    });
    
    batsmen.push({ 
        regNo: "", 
        name: "", 
        team: teamName,
        awards: 0, 
        points: 0, 
        rank: batsmen.length + 1, 
        prevRank: batsmen.length + 1 
    });
    
    bowlers.push({ 
        regNo: "", 
        name: "", 
        team: teamName,
        awards: 0, 
        points: 0, 
        rank: bowlers.length + 1, 
        prevRank: bowlers.length + 1 
    });
    
    SoftballData.allrounders = allrounders;
    SoftballData.players = players;
    SoftballData.batsmen = batsmen;
    SoftballData.bowlers = bowlers;
    
    saveData(); 
    loadAllroundersEdit();
    loadPlayersEdit();
    loadBatsmenEdit();
    loadBowlersEdit();
    populatePlayerSelect();
};

// Add new win
window.addNewWin = function(team) {
    if (!teamWins[team]) teamWins[team] = [];
    teamWins[team].push({ 
        date: new Date().toISOString().split('T')[0],
        tournament: "New Tournament", 
        prize: "Rs 0" 
    });
    SoftballData.teamWins = teamWins;
    saveData(); 
    loadTeamWinsEdit(); 
    updateStats();
};

// Add new player achievement
window.addNewPlayerAchievement = function() {
    let player = document.getElementById('playerForAchievement').value;
    if (!player) { alert("Select player!"); return; }
    if (!playerAchievements[player]) playerAchievements[player] = [];
    
    let playerData = players.find(p => p.name === player);
    let currentTeam = playerData ? playerData.team : (teams[0]?.name || "");
    
    playerAchievements[player].push({
        date: new Date().toISOString().split('T')[0], 
        tournament: "New Tournament",
        achievement: "New Achievement", 
        category: "All Rounder", 
        team: currentTeam
    });
    SoftballData.playerAchievements = playerAchievements;
    saveData(); 
    loadPlayerAchievements();
};

// ============== DELETE FUNCTIONS ==============

window.deleteTeam = function(i) {
    if (confirm("⚠️ Delete team and ALL its players permanently?")) {
        let teamName = teams[i].name;
        
        // Filter out all players from this team
        SoftballData.players = players.filter(p => p.team !== teamName);
        SoftballData.batsmen = batsmen.filter(p => p.team !== teamName);
        SoftballData.bowlers = bowlers.filter(p => p.team !== teamName);
        SoftballData.allrounders = allrounders.filter(p => p.team !== teamName);
        
        // Delete team wins
        delete SoftballData.teamWins[teamName];
        
        // Delete player achievements for these players
        let teamPlayers = players.filter(p => p.team === teamName);
        teamPlayers.forEach(p => {
            delete SoftballData.playerAchievements[p.name];
        });
        
        // Remove team
        teams.splice(i, 1);
        
        // Update references
        players = SoftballData.players;
        batsmen = SoftballData.batsmen;
        bowlers = SoftballData.bowlers;
        allrounders = SoftballData.allrounders;
        teamWins = SoftballData.teamWins;
        playerAchievements = SoftballData.playerAchievements;
        SoftballData.teams = teams;
        
        saveData(); 
        loadTeamsEdit(); 
        loadPlayersEdit(); 
        loadBatsmenEdit();
        loadBowlersEdit();
        loadAllroundersEdit();
        loadTeamWinsEdit();
        populateTeamFilter(); 
        populatePlayerSelect(); 
        updateStats();
        
        alert(`✅ Team "${teamName}" and all associated data deleted permanently`);
    }
};

window.deletePlayer = function(i) {
    if (confirm("⚠️ Delete this player permanently?")) {
        let player = players[i];
        let playerName = player.name;
        let playerReg = player.regNo;
        
        // Remove from all places
        SoftballData.players.splice(i, 1);
        SoftballData.batsmen = batsmen.filter(p => !(p.name === playerName && p.regNo === playerReg));
        SoftballData.bowlers = bowlers.filter(p => !(p.name === playerName && p.regNo === playerReg));
        SoftballData.allrounders = allrounders.filter(p => !(p.name === playerName && p.regNo === playerReg));
        
        // Remove achievements
        delete SoftballData.playerAchievements[playerName];
        
        // Update references
        players = SoftballData.players;
        batsmen = SoftballData.batsmen;
        bowlers = SoftballData.bowlers;
        allrounders = SoftballData.allrounders;
        playerAchievements = SoftballData.playerAchievements;
        
        saveData(); 
        loadPlayersEdit(); 
        loadBatsmenEdit();
        loadBowlersEdit();
        loadAllroundersEdit();
        populatePlayerSelect(); 
        updateStats();
        
        alert(`✅ Player "${playerName}" deleted permanently from all places`);
    }
};

window.deleteBatsman = function(i) {
    if (confirm("Delete this batsman?")) {
        let batsman = batsmen[i];
        batsmen.splice(i, 1);
        
        // Also remove from players if exists
        let playerIndex = players.findIndex(p => p.name === batsman.name && p.regNo === batsman.regNo);
        if (playerIndex !== -1) {
            players.splice(playerIndex, 1);
        }
        
        // Remove from other rankings
        bowlers = bowlers.filter(p => !(p.name === batsman.name && p.regNo === batsman.regNo));
        allrounders = allrounders.filter(p => !(p.name === batsman.name && p.regNo === batsman.regNo));
        
        SoftballData.batsmen = batsmen;
        SoftballData.players = players;
        SoftballData.bowlers = bowlers;
        SoftballData.allrounders = allrounders;
        
        saveData(); 
        loadBatsmenEdit();
        loadPlayersEdit();
        loadBowlersEdit();
        loadAllroundersEdit();
        populatePlayerSelect();
    }
};

window.deleteBowler = function(i) {
    if (confirm("Delete this bowler?")) {
        let bowler = bowlers[i];
        bowlers.splice(i, 1);
        
        // Also remove from players if exists
        let playerIndex = players.findIndex(p => p.name === bowler.name && p.regNo === bowler.regNo);
        if (playerIndex !== -1) {
            players.splice(playerIndex, 1);
        }
        
        // Remove from other rankings
        batsmen = batsmen.filter(p => !(p.name === bowler.name && p.regNo === bowler.regNo));
        allrounders = allrounders.filter(p => !(p.name === bowler.name && p.regNo === bowler.regNo));
        
        SoftballData.bowlers = bowlers;
        SoftballData.players = players;
        SoftballData.batsmen = batsmen;
        SoftballData.allrounders = allrounders;
        
        saveData(); 
        loadBowlersEdit();
        loadPlayersEdit();
        loadBatsmenEdit();
        loadAllroundersEdit();
        populatePlayerSelect();
    }
};

window.deleteAllrounder = function(i) {
    if (confirm("Delete this all rounder?")) {
        let allrounder = allrounders[i];
        allrounders.splice(i, 1);
        
        // Also remove from players if exists
        let playerIndex = players.findIndex(p => p.name === allrounder.name && p.regNo === allrounder.regNo);
        if (playerIndex !== -1) {
            players.splice(playerIndex, 1);
        }
        
        // Remove from other rankings
        batsmen = batsmen.filter(p => !(p.name === allrounder.name && p.regNo === allrounder.regNo));
        bowlers = bowlers.filter(p => !(p.name === allrounder.name && p.regNo === allrounder.regNo));
        
        SoftballData.allrounders = allrounders;
        SoftballData.players = players;
        SoftballData.batsmen = batsmen;
        SoftballData.bowlers = bowlers;
        
        saveData(); 
        loadAllroundersEdit();
        loadPlayersEdit();
        loadBatsmenEdit();
        loadBowlersEdit();
        populatePlayerSelect();
    }
};

window.deleteWin = function(team, idx) {
    if (confirm("Delete this win?")) {
        teamWins[team].splice(idx, 1);
        if (teamWins[team].length === 0) delete teamWins[team];
        SoftballData.teamWins = teamWins;
        saveData(); 
        loadTeamWinsEdit(); 
        updateStats();
    }
};

window.deleteAchievement = function(player, idx) {
    if (confirm("Delete this achievement?")) {
        playerAchievements[player].splice(idx, 1);
        if (playerAchievements[player].length === 0) delete playerAchievements[player];
        SoftballData.playerAchievements = playerAchievements;
        saveData(); 
        loadPlayerAchievements();
    }
};

// ============== FILTER AND SEARCH ==============

window.filterPlayersByTeam = function() {
    loadPlayersEdit(document.getElementById('teamFilterSelect').value);
};

window.searchPlayers = function() {
    let term = document.getElementById('playerSearch').value.toLowerCase();
    document.querySelectorAll('.player-row').forEach(r => {
        r.style.display = r.textContent.toLowerCase().includes(term) ? '' : 'none';
    });
};

window.searchBatsmen = function() {
    let term = document.getElementById('batsmanSearch').value.toLowerCase();
    document.querySelectorAll('.batsman-row').forEach(r => {
        r.style.display = r.textContent.toLowerCase().includes(term) ? '' : 'none';
    });
};

window.searchBowlers = function() {
    let term = document.getElementById('bowlerSearch').value.toLowerCase();
    document.querySelectorAll('.bowler-row').forEach(r => {
        r.style.display = r.textContent.toLowerCase().includes(term) ? '' : 'none';
    });
};

window.searchAllrounders = function() {
    let term = document.getElementById('allrounderSearch').value.toLowerCase();
    document.querySelectorAll('.allrounder-row').forEach(r => {
        r.style.display = r.textContent.toLowerCase().includes(term) ? '' : 'none';
    });
};

window.searchWins = function() {
    let term = document.getElementById('winSearch').value.toLowerCase();
    document.querySelectorAll('.win-row').forEach(r => {
        r.style.display = r.textContent.toLowerCase().includes(term) ? '' : 'none';
    });
};

window.searchAchievements = function() {
    let term = document.getElementById('achievementSearch').value.toLowerCase();
    document.querySelectorAll('.achievement-row').forEach(r => {
        r.style.display = r.textContent.toLowerCase().includes(term) ? '' : 'none';
    });
};

// Select player
window.selectPlayer = function(type, index) {
    console.log(`Selected ${type} at ${index}`);
};

// Save all changes
window.saveAllChanges = function() {
    // Update teams
    teams.forEach((t, i) => {
        let nameInput = document.getElementById(`teamName${i}`);
        let champsInput = document.getElementById(`teamChamps${i}`);
        let runnersInput = document.getElementById(`teamRunners${i}`);
        let cashInput = document.getElementById(`teamCash${i}`);
        let pointsInput = document.getElementById(`teamPoints${i}`);
        
        if (nameInput) t.name = nameInput.value;
        if (champsInput) t.champs = parseInt(champsInput.value) || 0;
        if (runnersInput) t.runnersUp = parseInt(runnersInput.value) || 0;
        if (cashInput) t.cashTotal = parseInt(cashInput.value) || 0;
        if (pointsInput) t.points = parseInt(pointsInput.value) || 0;
    });
    
    // Update players
    players.forEach(p => {
        let regInput = document.getElementById(`playerReg_${p.id}`);
        let nameInput = document.getElementById(`playerName_${p.id}`);
        let teamInput = document.getElementById(`playerTeam_${p.id}`);
        
        if (regInput) p.regNo = regInput.value;
        if (nameInput) p.name = nameInput.value;
        if (teamInput) p.team = teamInput.value;
    });
    
    // Update batsmen
    batsmen.forEach((p, i) => {
        let regInput = document.getElementById(`batsmanReg${i}`);
        let nameInput = document.getElementById(`batsmanName${i}`);
        let teamInput = document.getElementById(`batsmanTeam${i}`);
        let awdInput = document.getElementById(`batsmanAwards${i}`);
        let ptsInput = document.getElementById(`batsmanPoints${i}`);
        
        if (regInput) p.regNo = regInput.value;
        if (nameInput) p.name = nameInput.value;
        if (teamInput) p.team = teamInput.value;
        if (awdInput) p.awards = parseInt(awdInput.value) || 0;
        if (ptsInput) p.points = parseInt(ptsInput.value) || 0;
    });
    
    // Update bowlers
    bowlers.forEach((p, i) => {
        let regInput = document.getElementById(`bowlerReg${i}`);
        let nameInput = document.getElementById(`bowlerName${i}`);
        let teamInput = document.getElementById(`bowlerTeam${i}`);
        let awdInput = document.getElementById(`bowlerAwards${i}`);
        let ptsInput = document.getElementById(`bowlerPoints${i}`);
        
        if (regInput) p.regNo = regInput.value;
        if (nameInput) p.name = nameInput.value;
        if (teamInput) p.team = teamInput.value;
        if (awdInput) p.awards = parseInt(awdInput.value) || 0;
        if (ptsInput) p.points = parseInt(ptsInput.value) || 0;
    });
    
    // Update allrounders
    allrounders.forEach((p, i) => {
        let regInput = document.getElementById(`allrounderReg${i}`);
        let nameInput = document.getElementById(`allrounderName${i}`);
        let teamInput = document.getElementById(`allrounderTeam${i}`);
        let awdInput = document.getElementById(`allrounderAwards${i}`);
        let ptsInput = document.getElementById(`allrounderPoints${i}`);
        
        if (regInput) p.regNo = regInput.value;
        if (nameInput) p.name = nameInput.value;
        if (teamInput) p.team = teamInput.value;
        if (awdInput) p.awards = parseInt(awdInput.value) || 0;
        if (ptsInput) p.points = parseInt(ptsInput.value) || 0;
    });
    
    // Update team wins
    teams.forEach(team => {
        let wins = teamWins[team.name] || [];
        wins.forEach((w, i) => {
            let tInput = document.getElementById(`winTournament${team.name}${i}`);
            let dInput = document.getElementById(`winDate${team.name}${i}`);
            let pInput = document.getElementById(`winPrize${team.name}${i}`);
            
            if (tInput) w.tournament = tInput.value;
            if (dInput) w.date = dInput.value;
            if (pInput) w.prize = pInput.value;
        });
    });
    
    // Update achievements
    let player = document.getElementById('playerForAchievement')?.value;
    if (player && playerAchievements[player]) {
        playerAchievements[player].forEach((a, i) => {
            let tInput = document.getElementById(`achTournament${player}${i}`);
            let dInput = document.getElementById(`achDate${player}${i}`);
            let aInput = document.getElementById(`achAchievement${player}${i}`);
            let cInput = document.getElementById(`achCategory${player}${i}`);
            let tmInput = document.getElementById(`achTeam${player}${i}`);
            
            if (tInput) a.tournament = tInput.value;
            if (dInput) a.date = dInput.value;
            if (aInput) a.achievement = aInput.value;
            if (cInput) a.category = cInput.value;
            if (tmInput) a.team = tmInput.value;
        });
    }
    
    // Update social
    let fbInput = document.getElementById('facebookLink');
    let igInput = document.getElementById('instagramLink');
    let ytInput = document.getElementById('youtubeLink');
    
    if (fbInput) socialLinks.facebook = fbInput.value;
    if (igInput) socialLinks.instagram = igInput.value;
    if (ytInput) socialLinks.youtube = ytInput.value;
    
    // Update global object
    SoftballData.teams = teams;
    SoftballData.players = players;
    SoftballData.batsmen = batsmen;
    SoftballData.bowlers = bowlers;
    SoftballData.allrounders = allrounders;
    SoftballData.teamWins = teamWins;
    SoftballData.playerAchievements = playerAchievements;
    SoftballData.socialLinks = socialLinks;
    
    saveData();
    alert("✅ All changes saved permanently!");
};

// Go to dashboard
window.goToDashboard = function() {
    window.location.href = "index.html";
};