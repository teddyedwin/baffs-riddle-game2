const leaderboardStorageKey = 'justAskLeaderboard';
const leaderboardEntries = document.getElementById('leaderboardEntries');
const leaderboardStatus = document.getElementById('leaderboardStatus');

function createCell(text, className) {
  const cell = document.createElement('td');
  cell.textContent = text;
  if (className) cell.className = className;
  return cell;
}

function loadLeaderboard() {
  let results;
  try {
    results = JSON.parse(localStorage.getItem(leaderboardStorageKey) || '[]');
  } catch (error) {
    console.error('Could not read the leaderboard from this browser.', error);
    leaderboardStatus.textContent = 'Leaderboard scores could not be read from this browser.';
    return;
  }

  if (!Array.isArray(results)) {
    leaderboardStatus.textContent = 'Leaderboard data is invalid. Scores cannot be displayed.';
    return;
  }

  const sortedResults = results
    .filter((result) => result
      && typeof result.name === 'string'
      && Number.isFinite(result.score)
      && typeof result.difficulty === 'string'
      && typeof result.completedAt === 'string')
    .sort((first, second) => second.score - first.score
      || new Date(first.completedAt) - new Date(second.completedAt))
    .slice(0, 50);

  if (sortedResults.length === 0) {
    leaderboardStatus.textContent = 'No scores yet. Finish a game to appear here!';
    return;
  }

  sortedResults.forEach((result, index) => {
    const row = document.createElement('tr');
    row.append(
      createCell(String(index + 1), 'leaderboard-rank'),
      createCell(result.name),
      createCell(result.difficulty.charAt(0).toUpperCase() + result.difficulty.slice(1)),
      createCell(String(result.score), 'leaderboard-score'),
      createCell(new Date(result.completedAt).toLocaleDateString())
    );
    leaderboardEntries.appendChild(row);
  });
}

loadLeaderboard();
