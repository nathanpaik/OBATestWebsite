# OBA Website - Claude Instructions

## Project Overview
Static website for the **Ordinary Basketball Association (OBA)**, a church basketball league. Retro 1950s diner / Johnny Rockets aesthetic. No frameworks, no build step — plain HTML/CSS/JS with JSON data files.

## Tech Stack
- HTML / CSS / JavaScript (vanilla, no frameworks)
- JSON files for all data (manually edited)
- URL query parameters for dynamic pages (`game.html?id=1`, `team.html?id=saints`, `player.html?id=p1`)
- Requires a local server for JSON fetching: `python3 -m http.server`

## File Structure
```
OBATestWebsite/
├── index.html              # Landing page (hero, quick links, latest games)
├── schedule.html           # Season schedule grouped by week
├── game.html               # Box score page (?id=gameNumber)
├── teams.html              # All teams grid overview
├── team.html               # Team profile (?id=teamId)
├── player.html             # Player profile (?id=playerId)
├── awards.html             # Season awards (MVP, 6th Man, MIP, All-OBA teams)
├── css/
│   └── style.css           # All styles — retro diner theme
├── js/
│   ├── data.js             # Shared data layer (OBA object): fetch, cache, helpers, nav/footer
│   ├── schedule.js         # Schedule page logic
│   ├── game.js             # Box score rendering
│   ├── teams.js            # Teams grid logic
│   ├── team.js             # Team profile + roster logic
│   ├── player.js           # Player profile + game log logic
│   └── awards.js           # Awards page logic
└── data/
    ├── teams.json           # 6 teams (id, name, color, colorSecondary)
    ├── players.json         # 48 players (8 per team)
    └── seasons/
        └── season1/
            ├── games.json   # Games with full box scores
            └── awards.json  # Season awards
```

## Color Palette
| Token | Hex | Usage |
|-------|-----|-------|
| Primary Red | `#C41E3A` | Nav, buttons, headings, accents |
| Cream | `#FFF8DC` | Page background |
| Black | `#1a1a1a` | Body text |
| Chrome/Silver | `#C0C0C0` | Borders, metallic accents |
| Neon accent | `#FF6B6B` | Hover states, highlights |
| Dark Red | `#8B0000` | Gradients, dark accents |

## Fonts
- **Headings**: "Righteous" (Google Fonts) — retro display font
- **Body**: "Roboto Slab" (Google Fonts) — serif body text

## Data Architecture

### Key IDs
- **Team IDs**: `saints`, `disciples`, `shepherds`, `lions`, `eagles`, `kings`
- **Player IDs**: `p1` through `p48` (8 per team, sequential)
- **Game IDs**: integers starting at 1

### Data Schemas
- `teams.json`: `{ id, name, color, colorSecondary }`
- `players.json`: `{ id, name, teamId, number, position, height }`
- `games.json`: `{ id, week, date, homeTeam, awayTeam, homeScore, awayScore, boxScore: { [teamId]: [playerStatLines] } }`
- `awards.json`: `{ mvp, sixthMan, mip, allOBA, allDefense }`
- **Player stat line**: `{ playerId, min, pts, reb, ast, stl, blk, to, fgm, fga, tpm, tpa, ftm, fta }`

### Data Integrity Rules
- Box score player points must sum to game score (`homeScore` / `awayScore`)
- Individual points must satisfy: `pts = (fgm - tpm) * 2 + tpm * 3 + ftm`
- Every `playerId` in box scores must exist in `players.json`
- Every `teamId` in games must exist in `teams.json`

## Shared JS API (`js/data.js`)
The global `OBA` object provides:
- `OBA.getTeams()`, `OBA.getPlayers()`, `OBA.getGames(season)`, `OBA.getAwards(season)` — async, cached
- `OBA.getTeam(id)`, `OBA.getPlayer(id)`, `OBA.getTeamPlayers(teamId)` — async lookups
- `OBA.getTeamRecord(teamId, season)` — returns `{ wins, losses }`
- `OBA.getPlayerSeasonStats(playerId, season)` — returns `{ totals, gameLogs }`
- `OBA.calcAverages(totals)` — returns per-game averages and shooting percentages
- `OBA.formatDate(dateStr)` — formats `YYYY-MM-DD` to readable date
- `OBA.getParam(name)` — reads URL query parameter
- `OBA.renderNav(activePage)`, `OBA.renderFooter()` — shared navigation

## Conventions
- Each page includes `<nav id="site-nav">` and `<footer id="site-footer">` populated by `data.js`
- Page-specific JS files use an async IIFE pattern: `(async function() { ... })();`
- All pages load `data.js` first, then their own JS file
- CSS uses BEM-lite naming; no CSS-in-JS
- Mobile responsive via `@media (max-width: 768px)` breakpoint
- Season support: `OBA.currentSeason` defaults to `'season1'`; add `data/seasons/season2/` for future seasons

## Current State (Season 1)
- 6 teams, 48 players
- 6 games across 2 weeks (Week 1: Jan 11, Week 2: Jan 18)
- All box scores verified mathematically consistent
- Awards assigned for Season 1

## How to Run
```bash
cd OBATestWebsite
python3 -m http.server
# Open http://localhost:8000
```
