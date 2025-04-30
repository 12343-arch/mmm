function updateAchievementCrystal() {
  const totalSessions = document.querySelectorAll('#study-table tbody tr:not([data-header])');
  const completedSessions = document.querySelectorAll('#study-table tbody tr.done-cell');
  
  const achievementPercentage = (completedSessions.length / totalSessions.length) * 100;
  
  const crystalFill = document.getElementById('achievement-fill');
  if (crystalFill) {
    // Use a green gradient from light to dark
    crystalFill.style.background = `linear-gradient(to top, #4CAF50, #81C784)`;
    crystalFill.style.height = `${achievementPercentage}%`;
  }
}

// Update achievement crystal when a task is marked done
function setupAchievementCrystalTracking() {
  const markDoneButtons = document.querySelectorAll('.mark-done');
  markDoneButtons.forEach(button => {
    button.addEventListener('click', () => {
      setTimeout(updateAchievementCrystal, 100);
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  updateAchievementCrystal();
  setupAchievementCrystalTracking();
});