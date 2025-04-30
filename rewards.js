// Study Rewards and Motivational System
class RewardsSystem {
  constructor() {
    this.rewards = [
      { 
        type: 'video', 
        title: 'فيديو تحفيزي', 
        description: 'شاهد فيديو تحفيزي قصير للاستمتاع بوقت راحة',
        links: [
          'https://www.youtube.com/watch?v=ZXsQAXx_ao0', // Just Do It
          'https://www.youtube.com/watch?v=g-jwWYX7Jlo', // Study Motivation
          'https://www.youtube.com/watch?v=6vuetQSwFW8'  // Arabic motivation
        ]
      },
      { 
        type: 'break', 
        title: 'استراحة خاصة', 
        description: 'خذ استراحة 15 دقيقة للاسترخاء وتجديد نشاطك',
        activities: [
          'تمشية قصيرة في الهواء الطلق',
          'تمارين تمدد بسيطة',
          'استمع إلى أغنية مفضلة'
        ]
      },
      { 
        type: 'game', 
        title: 'لعبة سريعة', 
        description: 'العب لعبة سريعة لتنشيط ذهنك',
        games: [
          { name: '2048', url: 'https://play2048.co/' },
          { name: 'Tetris', url: 'https://tetris.com/play-tetris' },
          { name: 'Wordle', url: 'https://www.nytimes.com/games/wordle/index.html' }
        ]
      },
      { 
        type: 'treat', 
        title: 'وجبة خفيفة', 
        description: 'استمتع بوجبة خفيفة مفضلة (فاكهة، شوكولاتة، مكسرات)',
        suggestions: [
          'قطعة من الشوكولاتة الداكنة',
          'كوب من العصير الطازج',
          'حفنة من المكسرات الصحية'
        ]
      },
      { 
        type: 'social', 
        title: 'تواصل اجتماعي', 
        description: 'اتصل بصديق أو قريب للتحدث لمدة 10 دقائق',
        benefits: [
          'يخفف التوتر',
          'يعزز الروح المعنوية',
          'يوفر فرصة للمشاركة والحصول على الدعم'
        ]
      }
    ];
    
    this.streak = 0;
    this.todayRewards = 0;
    this.maxDailyRewards = 3;
    
    this.createRewardPanel();
  }
  
  createRewardPanel() {
    const rewardsContainer = document.createElement('div');
    rewardsContainer.className = 'rewards-container';
    rewardsContainer.innerHTML = `
      <div class="rewards-panel">
        <div class="rewards-header">
          <h3>المكافآت اليومية</h3>
          <span class="rewards-count">0/${this.maxDailyRewards}</span>
        </div>
        <div class="reward-content"></div>
      </div>
    `;
    
    // Insert after the xp system
    const xpContainer = document.querySelector('.xp-container');
    if (xpContainer) {
      xpContainer.after(rewardsContainer);
    } else {
      const container = document.querySelector('.container');
      if (container) {
        container.prepend(rewardsContainer);
      }
    }
    
    // Add CSS styles
    const style = document.createElement('style');
    style.textContent = `
      .rewards-container {
        margin: 20px auto;
        max-width: 600px;
      }
      
      .rewards-panel {
        background: rgba(14, 12, 40, 0.6);
        backdrop-filter: blur(8px);
        border-radius: 10px;
        padding: 15px;
        box-shadow: 0 0 20px rgba(0,0,0,0.3);
        border: 1px solid rgba(255,255,255,0.1);
      }
      
      .rewards-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
        padding-bottom: 10px;
        border-bottom: 1px solid rgba(255,255,255,0.1);
      }
      
      .rewards-header h3 {
        color: gold;
        margin: 0;
      }
      
      .rewards-count {
        background: rgba(255,255,255,0.1);
        padding: 5px 10px;
        border-radius: 20px;
        font-weight: bold;
      }
      
      .reward-content {
        min-height: 100px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }
      
      .reward-placeholder {
        color: #aaa;
        text-align: center;
        padding: 20px;
      }
      
      .reward-item {
        background: rgba(255,255,255,0.05);
        border-radius: 8px;
        padding: 15px;
        margin-bottom: 10px;
        width: 100%;
        animation: reward-appear 0.5s ease-out;
      }
      
      .reward-title {
        font-size: 1.2rem;
        font-weight: bold;
        color: white;
        margin-bottom: 5px;
      }
      
      .reward-description {
        color: #ddd;
        margin-bottom: 10px;
      }
      
      .reward-action {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      .reward-button {
        background: linear-gradient(45deg, #4CAF50, #81C784);
        color: white;
        border: none;
        padding: 8px 15px;
        border-radius: 20px;
        cursor: pointer;
        font-weight: bold;
        transition: all 0.2s;
      }
      
      .reward-button:hover {
        transform: scale(1.05);
        box-shadow: 0 0 10px rgba(76, 175, 80, 0.5);
      }
      
      .reward-icon {
        font-size: 1.8rem;
        margin-right: 15px;
      }
      
      .reward-details {
        background: rgba(255,255,255,0.05);
        border-radius: 5px;
        padding: 10px;
        margin-top: 10px;
      }
      
      .reward-details ul {
        margin: 0;
        padding-right: 20px;
      }
      
      .reward-details li {
        margin-bottom: 5px;
      }
      
      .reward-link {
        color: #90CAF9;
        text-decoration: none;
      }
      
      .reward-link:hover {
        text-decoration: underline;
      }
      
      @keyframes reward-appear {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(style);
    
    // Set initial placeholder
    this.updatePlaceholder();
  }
  
  updatePlaceholder() {
    const content = document.querySelector('.reward-content');
    if (!content) return;
    
    if (this.todayRewards >= this.maxDailyRewards) {
      content.innerHTML = `
        <div class="reward-placeholder">
          <p>لقد حصلت على جميع مكافآتك اليوم! عد غداً للمزيد.</p>
        </div>
      `;
    } else {
      content.innerHTML = `
        <div class="reward-placeholder">
          <p>أكمل جلسة مذاكرة واحصل على مكافأة </p>
        </div>
      `;
    }
  }
  
  getRandomReward() {
    return this.rewards[Math.floor(Math.random() * this.rewards.length)];
  }
  
  displayReward() {
    if (this.todayRewards >= this.maxDailyRewards) {
      return false;
    }
    
    const content = document.querySelector('.reward-content');
    if (!content) return false;
    
    const reward = this.getRandomReward();
    let rewardDetails = '';
    let rewardIcon = '';
    
    switch (reward.type) {
      case 'video':
        rewardIcon = '';
        const videoLink = reward.links[Math.floor(Math.random() * reward.links.length)];
        rewardDetails = `
          <div class="reward-details">
            <p>فيديو تحفيزي للمشاهدة:</p>
            <a href="${videoLink}" class="reward-link" target="_blank">افتح الفيديو</a>
          </div>
        `;
        break;
      
      case 'break':
        rewardIcon = '';
        const activity = reward.activities[Math.floor(Math.random() * reward.activities.length)];
        rewardDetails = `
          <div class="reward-details">
            <p>اقتراح للاستراحة:</p>
            <p>${activity}</p>
          </div>
        `;
        break;
      
      case 'game':
        rewardIcon = '';
        const game = reward.games[Math.floor(Math.random() * reward.games.length)];
        rewardDetails = `
          <div class="reward-details">
            <p>العب لعبة سريعة:</p>
            <a href="${game.url}" class="reward-link" target="_blank">${game.name}</a>
          </div>
        `;
        break;
      
      case 'treat':
        rewardIcon = '';
        const treat = reward.suggestions[Math.floor(Math.random() * reward.suggestions.length)];
        rewardDetails = `
          <div class="reward-details">
            <p>اقتراح وجبة خفيفة:</p>
            <p>${treat}</p>
          </div>
        `;
        break;
      
      case 'social':
        rewardIcon = '';
        rewardDetails = `
          <div class="reward-details">
            <p>فوائد التواصل الاجتماعي:</p>
            <ul>
              ${reward.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
            </ul>
          </div>
        `;
        break;
    }
    
    content.innerHTML = `
      <div class="reward-item">
        <div class="reward-title">${reward.title}</div>
        <div class="reward-description">${reward.description}</div>
        <div class="reward-action">
          <button class="reward-button" onclick="rewardsSystem.claimReward()">استلام المكافأة</button>
          <div class="reward-icon">${rewardIcon}</div>
        </div>
        ${rewardDetails}
      </div>
    `;
    
    return true;
  }
  
  claimReward() {
    this.todayRewards++;
    
    // Update the rewards counter
    const rewardsCount = document.querySelector('.rewards-count');
    if (rewardsCount) {
      rewardsCount.textContent = `${this.todayRewards}/${this.maxDailyRewards}`;
    }
    
    // Update placeholder for next reward
    this.updatePlaceholder();
    
    // Add XP for claiming a reward
    if (window.xpSystem) {
      window.xpSystem.addXP(5);
    }
  }
  
  earnReward() {
    if (this.todayRewards < this.maxDailyRewards) {
      this.streak++;
      this.displayReward();
      return true;
    }
    return false;
  }
  
  resetDailyRewards() {
    const today = new Date().toLocaleDateString();
    const lastReset = localStorage.getItem('lastRewardReset');
    
    if (lastReset !== today) {
      this.todayRewards = 0;
      localStorage.setItem('lastRewardReset', today);
      
      // Update the rewards counter
      const rewardsCount = document.querySelector('.rewards-count');
      if (rewardsCount) {
        rewardsCount.textContent = `${this.todayRewards}/${this.maxDailyRewards}`;
      }
      
      this.updatePlaceholder();
    }
  }
}

// Initialize the Rewards System when the document is loaded
let rewardsSystem;
document.addEventListener('DOMContentLoaded', () => {
  rewardsSystem = new RewardsSystem();
  
  // Check for daily reset
  rewardsSystem.resetDailyRewards();
  
  // Override original markDone function to give rewards
  const originalMarkDone = window.markDone;
  if (typeof originalMarkDone === 'function' && !window.isRewardsSystemInitialized) {
    window.markDone = function(button) {
      originalMarkDone(button);
      
      // Give reward with 50% chance
      if (Math.random() > 0.5) {
        rewardsSystem.earnReward();
      }
    };
    
    window.isRewardsSystemInitialized = true;
  }
  
  // Make rewards system globally accessible
  window.rewardsSystem = rewardsSystem;
  
  // Setup daily reset interval
  setInterval(() => {
    rewardsSystem.resetDailyRewards();
  }, 60 * 60 * 1000); // Check every hour
});