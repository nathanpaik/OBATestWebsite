(async function() {
  OBA.renderNav('awards');
  OBA.renderFooter();

  const [awards, players, teams] = await Promise.all([OBA.getAwards(), OBA.getPlayers(), OBA.getTeams()]);
  const playerMap = Object.fromEntries(players.map(p => [p.id, p]));
  const teamMap = Object.fromEntries(teams.map(t => [t.id, t]));

  function playerCard(playerId) {
    const p = playerMap[playerId];
    if (!p) return { name: 'Unknown', teamName: '' };
    const t = teamMap[p.teamId];
    return { name: p.name, teamName: t ? t.name : '', id: p.id };
  }

  function renderAward(title, icon, awardData) {
    const p = playerCard(awardData.playerId);
    return `
      <div class="award-card">
        <div class="award-header">${title}</div>
        <div class="award-body">
          <div class="award-icon">${icon}</div>
          <div class="player-name"><a href="player.html?id=${p.id}">${p.name}</a></div>
          <div class="player-team">${p.teamName}</div>
          <div class="highlights">${awardData.highlights}</div>
        </div>
      </div>`;
  }

  function renderAllTeam(title, playerIds) {
    return `
      <div class="all-team-section">
        <h2>${title}</h2>
        <div class="all-team-list">
          ${playerIds.map(id => {
            const p = playerCard(id);
            return `
              <a href="player.html?id=${p.id}" class="all-team-player">
                <div class="name">${p.name}</div>
                <div class="team">${p.teamName}</div>
              </a>`;
          }).join('')}
        </div>
      </div>`;
  }

  document.getElementById('awards-content').innerHTML = `
    <div class="awards-grid">
      ${renderAward('Most Valuable Player', '\u{1F3C6}', awards.mvp)}
      ${renderAward('6th Man of the Year', '\u{1F4AA}', awards.sixthMan)}
      ${renderAward('Most Improved Player', '\u{1F4C8}', awards.mip)}
    </div>
    ${renderAllTeam('All-OBA First Team', awards.allOBA)}
    ${renderAllTeam('All-OBA Defensive Team', awards.allDefense)}
  `;
})();
