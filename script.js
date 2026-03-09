// script.js - Dashboard Functions with Complete Excel Export

// Global variables
let teams = [];
let players = [];
let batsmen = [];
let bowlers = [];
let allrounders = [];
let teamWins = {};
let playerAchievements = {};
let socialLinks = {};

// Refresh data from SoftballData
function refreshData() {
    teams = SoftballData.teams || [];
    players = SoftballData.players || [];
    batsmen = SoftballData.batsmen || [];
    bowlers = SoftballData.bowlers || [];
    allrounders = SoftballData.allrounders || [];
    teamWins = SoftballData.teamWins || {};
    playerAchievements = SoftballData.playerAchievements || {};
    socialLinks = SoftballData.socialLinks || { facebook: "#", instagram: "#", youtube: "#" };
}

// Initialize page
window.onload = function() {
    refreshData();
    updateAllDisplays();
    populateTeamSelect();
    populatePlayerSelect();
    updateSocialLinks();
    
    // Auto-refresh every 2 seconds
    setInterval(function() {
        refreshData();
        updateAllDisplays();
        populateTeamSelect();
        populatePlayerSelect();
    }, 2000);
};

// Update all displays
function updateAllDisplays() {
    savePreviousRanks();
    updateTeamRankings();
    updateBatsmen();
    updateBowlers();
    updateAllrounders();
}

// Save previous ranks before updating
function savePreviousRanks() {
    // Store current ranks as previous ranks before we re-sort
    teams.forEach(team => {
        // If prevRank doesn't exist or we're doing a fresh sort, keep existing prevRank
        if (!team.prevRank) team.prevRank = team.rank;
    });
    batsmen.forEach(p => {
        if (!p.prevRank) p.prevRank = p.rank;
    });
    bowlers.forEach(p => {
        if (!p.prevRank) p.prevRank = p.rank;
    });
    allrounders.forEach(p => {
        if (!p.prevRank) p.prevRank = p.rank;
    });
}

// Get rank change icon
function getRankChangeIcon(current, previous) {
    if (!previous) return '<span class="rank-same"><i class="fas fa-minus"></i></span>';
    if (current < previous) {
        let improvement = previous - current;
        return `<span class="rank-up"><i class="fas fa-arrow-up"></i> ${improvement}</span>`;
    }
    if (current > previous) {
        let drop = current - previous;
        return `<span class="rank-down"><i class="fas fa-arrow-down"></i> ${drop}</span>`;
    }
    return '<span class="rank-same"><i class="fas fa-minus"></i></span>';
}

// Update team rankings
function updateTeamRankings() {
    if (!teams || teams.length === 0) {
        document.getElementById('rankingsBody').innerHTML = '<tr><td colspan="7" style="text-align: center;">No teams found</td></tr>';
        return;
    }
    
    // Sort by points (highest first)
    let sortedTeams = [...teams].sort((a, b) => b.points - a.points);
    
    // Update ranks and calculate changes
    sortedTeams.forEach((team, index) => {
        let newRank = index + 1;
        team.rank = newRank;
    });
    
    let html = '';
    sortedTeams.forEach(team => {
        html += `<tr class="team-row">
            <td>${team.rank.toString().padStart(2, '0')}</td>
            <td>${team.name}</td>
            <td>${(team.champs || 0).toString().padStart(2, '0')}</td>
            <td>${(team.runnersUp || 0).toString().padStart(2, '0')}</td>
            <td>Rs ${(team.cashTotal || 0).toLocaleString()}</td>
            <td>${(team.points || 0).toString().padStart(2, '0')}</td>
            <td>${getRankChangeIcon(team.rank, team.prevRank)}</td>
        </tr>`;
    });
    document.getElementById('rankingsBody').innerHTML = html;
}

// Update batsmen
function updateBatsmen() {
    if (!batsmen) {
        document.getElementById('batsmenBody').innerHTML = '<tr><td colspan="7" style="text-align: center;">No batsmen data</td></tr>';
        return;
    }
    
    let rankedBatsmen = batsmen.filter(b => b.points > 0);
    let sortedBatsmen = [...rankedBatsmen].sort((a, b) => b.points - a.points);
    
    sortedBatsmen.forEach((p, i) => {
        let newRank = i + 1;
        p.rank = newRank;
    });
    
    let html = '';
    if (sortedBatsmen.length === 0) {
        html = '<tr><td colspan="7" style="text-align: center;">No batsmen with points</td></tr>';
    } else {
        sortedBatsmen.forEach(p => {
            html += `<tr class="batsman-row">
                <td>${p.rank.toString().padStart(2, '0')}</td>
                <td>${p.regNo || ''}</td>
                <td>${p.name || ''}</td>
                <td>${p.team || ''}</td>
                <td>${p.awards || 0}</td>
                <td>${p.points || 0}</td>
                <td>${getRankChangeIcon(p.rank, p.prevRank)}</td>
            </tr>`;
        });
    }
    document.getElementById('batsmenBody').innerHTML = html;
}

// Update bowlers
function updateBowlers() {
    if (!bowlers) {
        document.getElementById('bowlersBody').innerHTML = '<tr><td colspan="7" style="text-align: center;">No bowlers data</td></tr>';
        return;
    }
    
    let rankedBowlers = bowlers.filter(b => b.points > 0);
    let sortedBowlers = [...rankedBowlers].sort((a, b) => b.points - a.points);
    
    sortedBowlers.forEach((p, i) => {
        let newRank = i + 1;
        p.rank = newRank;
    });
    
    let html = '';
    if (sortedBowlers.length === 0) {
        html = '<tr><td colspan="7" style="text-align: center;">No bowlers with points</td></tr>';
    } else {
        sortedBowlers.forEach(p => {
            html += `<tr class="bowler-row">
                <td>${p.rank.toString().padStart(2, '0')}</td>
                <td>${p.regNo || ''}</td>
                <td>${p.name || ''}</td>
                <td>${p.team || ''}</td>
                <td>${p.awards || 0}</td>
                <td>${p.points || 0}</td>
                <td>${getRankChangeIcon(p.rank, p.prevRank)}</td>
            </tr>`;
        });
    }
    document.getElementById('bowlersBody').innerHTML = html;
}

// Update allrounders
function updateAllrounders() {
    if (!allrounders) {
        document.getElementById('allroundersBody').innerHTML = '<tr><td colspan="7" style="text-align: center;">No all rounders data</td></tr>';
        return;
    }
    
    let rankedAllrounders = allrounders.filter(a => a.points > 0);
    let sortedAllrounders = [...rankedAllrounders].sort((a, b) => b.points - a.points);
    
    sortedAllrounders.forEach((p, i) => {
        let newRank = i + 1;
        p.rank = newRank;
    });
    
    let html = '';
    if (sortedAllrounders.length === 0) {
        html = '<tr><td colspan="7" style="text-align: center;">No all rounders with points</td></tr>';
    } else {
        sortedAllrounders.forEach(p => {
            html += `<tr class="allrounder-row">
                <td>${p.rank.toString().padStart(2, '0')}</td>
                <td>${p.regNo || ''}</td>
                <td>${p.name || ''}</td>
                <td>${p.team || ''}</td>
                <td>${p.awards || 0}</td>
                <td>${p.points || 0}</td>
                <td>${getRankChangeIcon(p.rank, p.prevRank)}</td>
            </tr>`;
        });
    }
    document.getElementById('allroundersBody').innerHTML = html;
}

// Search functions
window.searchTeams = function() {
    let term = document.getElementById('teamSearch').value.toLowerCase();
    document.querySelectorAll('.team-row').forEach(r => {
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

// Populate selects
function populateTeamSelect() {
    let select = document.getElementById('teamSelect');
    if (!select) return;
    select.innerHTML = '<option value="">Select a Team</option>';
    if (teams && teams.length > 0) {
        teams.forEach(t => select.innerHTML += `<option value="${t.name}">${t.name}</option>`);
    }
}

function populatePlayerSelect() {
    let select = document.getElementById('playerSelect');
    if (!select) return;
    select.innerHTML = '<option value="">Select a Player</option>';
    if (players && players.length > 0) {
        let allPlayers = [...new Set(players.map(p => p.name))];
        allPlayers.forEach(name => 
            select.innerHTML += `<option value="${name}">${name}</option>`
        );
    }
}

// Show team wins
window.showTeamWins = function() {
    let team = document.getElementById('teamSelect').value;
    let display = document.getElementById('teamWinsDisplay');
    if (!team) { display.innerHTML = ''; return; }
    
    let wins = teamWins[team] || [];
    if (wins.length === 0) {
        display.innerHTML = `<h3>${team}</h3><p>No tournament wins yet</p>`;
        return;
    }
    
    let html = `<h3>${team} - Tournament Wins</h3>`;
    wins.forEach(w => {
        html += `<div class="win-item">
            <strong>${w.tournament}</strong><br>
            <i class="fas fa-calendar"></i> Date: ${w.date}<br>
            <i class="fas fa-trophy"></i> Prize: ${w.prize}
        </div>`;
    });
    display.innerHTML = html;
};

// Show player achievements
window.showPlayerAchievements = function() {
    let player = document.getElementById('playerSelect').value;
    let display = document.getElementById('playerAchievementsDisplay');
    if (!player) { display.innerHTML = ''; return; }
    
    let achievements = playerAchievements[player] || [];
    if (achievements.length === 0) {
        display.innerHTML = `<h3>${player}</h3><p>No achievements yet</p>`;
        return;
    }
    
    let html = `<h3>${player} - Achievements</h3>`;
    achievements.forEach(a => {
        let badge = `achievement-badge ${a.category === 'Batsman' ? 'batsman' : a.category === 'Bowler' ? 'bowler' : 'allrounder'}`;
        html += `<div class="achievement-item">
            <strong>${a.tournament}</strong> <span class="${badge}">${a.category}</span><br>
            <i class="fas fa-medal"></i> ${a.achievement}<br>
            <i class="fas fa-calendar"></i> Date: ${a.date}<br>
            <i class="fas fa-users"></i> Team: ${a.team}
        </div>`;
    });
    display.innerHTML = html;
};

// Update social links
function updateSocialLinks() {
    let fb = document.getElementById('facebookLinkDisplay');
    let ig = document.getElementById('instagramLinkDisplay');
    let yt = document.getElementById('youtubeLinkDisplay');
    
    if (fb) fb.href = socialLinks.facebook || '#';
    if (ig) ig.href = socialLinks.instagram || '#';
    if (yt) yt.href = socialLinks.youtube || '#';
}

// ============== FIXED: Download Excel with ALL DATA ==============
window.downloadExcel = function() {
    const wb = XLSX.utils.book_new();
    
    // 1. Teams Rankings Sheet
    const teamsData = [
        ['RANK', 'TEAM NAME', 'CHAMPIONS', 'RUNNERS UP', 'CASH TOTAL (Rs)', 'POINTS'],
        ...teams.map(t => [
            t.rank || '',
            t.name || '',
            t.champs || 0,
            t.runnersUp || 0,
            t.cashTotal || 0,
            t.points || 0
        ])
    ];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(teamsData), "Team Rankings");
    
    // 2. Batsmen Rankings Sheet
    const batsmenData = [
        ['RANK', 'REG NO', 'PLAYER NAME', 'TEAM', 'AWARDS', 'POINTS'],
        ...batsmen.filter(b => b.points > 0).map(p => [
            p.rank || '',
            p.regNo || '',
            p.name || '',
            p.team || '',
            p.awards || 0,
            p.points || 0
        ])
    ];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(batsmenData), "Batsmen Rankings");
    
    // 3. Bowlers Rankings Sheet
    const bowlersData = [
        ['RANK', 'REG NO', 'PLAYER NAME', 'TEAM', 'AWARDS', 'POINTS'],
        ...bowlers.filter(b => b.points > 0).map(p => [
            p.rank || '',
            p.regNo || '',
            p.name || '',
            p.team || '',
            p.awards || 0,
            p.points || 0
        ])
    ];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(bowlersData), "Bowlers Rankings");
    
    // 4. All Rounders Rankings Sheet
    const allroundersData = [
        ['RANK', 'REG NO', 'PLAYER NAME', 'TEAM', 'AWARDS', 'POINTS'],
        ...allrounders.filter(a => a.points > 0).map(p => [
            p.rank || '',
            p.regNo || '',
            p.name || '',
            p.team || '',
            p.awards || 0,
            p.points || 0
        ])
    ];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(allroundersData), "All Rounders Rankings");
    
    // 5. Team Tournament Wins Sheet
    let teamWinsData = [['TEAM NAME', 'TOURNAMENT', 'DATE', 'PRIZE']];
    for (let teamName in teamWins) {
        if (teamWins[teamName] && teamWins[teamName].length > 0) {
            teamWins[teamName].forEach(win => {
                teamWinsData.push([
                    teamName,
                    win.tournament || '',
                    win.date || '',
                    win.prize || ''
                ]);
            });
        }
    }
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(teamWinsData), "Team Tournament Wins");
    
    // 6. Player Achievements Sheet
    let achievementsData = [['PLAYER NAME', 'TOURNAMENT', 'DATE', 'ACHIEVEMENT', 'CATEGORY', 'TEAM']];
    for (let playerName in playerAchievements) {
        if (playerAchievements[playerName] && playerAchievements[playerName].length > 0) {
            playerAchievements[playerName].forEach(ach => {
                achievementsData.push([
                    playerName,
                    ach.tournament || '',
                    ach.date || '',
                    ach.achievement || '',
                    ach.category || '',
                    ach.team || ''
                ]);
            });
        }
    }
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(achievementsData), "Player Achievements");
    
    // 7. All Players Database Sheet (for reference)
    const playersData = [
        ['PLAYER ID', 'REG NO', 'PLAYER NAME', 'TEAM'],
        ...players.map(p => [
            p.id || '',
            p.regNo || '',
            p.name || '',
            p.team || ''
        ])
    ];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(playersData), "All Players");
    
    // Save the file
    XLSX.writeFile(wb, "Softball_Complete_Data_2026.xlsx");
    
    // Show success message
    alert("✅ Excel downloaded with complete data!\n\nIncludes:\n- Team Rankings\n- Batsmen Rankings\n- Bowlers Rankings\n- All Rounders Rankings\n- Team Tournament Wins\n- Player Achievements\n- All Players Database");
};

// Open admin page
window.openAdminPage = function() {
    let pwd = prompt("Enter admin password:");
    if (pwd === "admin123") window.location.href = "admin.html";
    else alert("Wrong password!");
};

// Backup functions
window.exportBackup = function() { 
    if (typeof exportData === 'function') exportData(); 
};

window.importBackup = function() { 
    document.getElementById('importFile').click(); 
};