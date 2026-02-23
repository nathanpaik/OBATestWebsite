(async function() {
  OBA.renderNav('schedule');
  OBA.renderFooter();

  const [games, teams] = await Promise.all([OBA.getGames(), OBA.getTeams()]);
  const teamMap = Object.fromEntries(teams.map(t => [t.id, t]));

  // Group by week
  const weeks = {};
  games.forEach(g => {
    const w = g.week || 1;
    if (!weeks[w]) weeks[w] = [];
    weeks[w].push(g);
  });

  const container = document.getElementById('schedule-content');
  container.innerHTML = Object.keys(weeks).sort((a, b) => a - b).map(week => {
    const weekGames = weeks[week];
    return `
      <div class="week-group">
        <h3>Week ${week}</h3>
        <div class="schedule-list">
          ${weekGames.map(g => {
            const home = teamMap[g.homeTeam];
            const away = teamMap[g.awayTeam];
            const homeWin = g.homeScore > g.awayScore;
            return `
              <a href="game.html?id=${g.id}" class="game-row">
                <span class="game-date">${OBA.formatDate(g.date)}</span>
                <span class="game-matchup">
                  <span class="team-name home-team" style="color:${home.color}">${home.name}</span>
                  <span class="vs">vs</span>
                  <span class="team-name away-team" style="color:${away.color}">${away.name}</span>
                </span>
                <span class="game-score">
                  <span class="${homeWin ? 'winner' : ''}">${g.homeScore}</span> - <span class="${!homeWin ? 'winner' : ''}">${g.awayScore}</span>
                </span>
              </a>`;
          }).join('')}
        </div>
      </div>`;
  }).join('');
})();
