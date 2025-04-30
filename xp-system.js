// XP System and Levels Management
class XPSystem {
  constructor() {
    // First initialize level thresholds
    this.levelThresholds = [
      0, 100, 250, 450, 700, 1000, 1400, 1900, 2500, 3200, 4000
    ];
    
    // Then load XP and level
    const xp = parseInt(localStorage.getItem('userXP'));
    this.xp = isNaN(xp) ? 0 : xp;
    
    // Level calculation after thresholds are set
    this.level = this.calculateLevel();
    
    // Rest of code remains the same
    this.levelRewards = [
      { title: "مبتدئ", icon: "🌱", background: "linear-gradient(145deg, #0f1331, #42275a)" },
      { title: "متحمس", icon: "🔥", background: "linear-gradient(145deg, #1a237e, #512da8)" },
      { title: "مثابر", icon: "⭐", background: "linear-gradient(145deg, #2e355a, #512da8)" },
      { title: "متقدم", icon: "🌟", background: "linear-gradient(145deg, #1a472e, #2e7d32)" },
      { title: "متميز", icon: "💫", background: "linear-gradient(145deg, #4a148c, #6a1b9a)" },
      { title: "محترف", icon: "🏆", background: "linear-gradient(145deg, #bf360c, #e64a19)" },
      { title: "خبير", icon: "👑", background: "linear-gradient(145deg, #ff6f00, #ffa000)" },
      { title: "عبقري", icon: "🧠", background: "linear-gradient(145deg, #1565c0, #0288d1)" },
      { title: "أسطورة", icon: "🔱", background: "linear-gradient(145deg, #880e4f, #c2185b)" },
      { title: "حكيم", icon: "📚", background: "linear-gradient(145deg, #004d40, #00796b)" }
    ];
    
    this.lastSessionXP = 0;
    this.initUI();    
  
    if (this.level >= this.levelRewards.length) {
      this.level = this.levelRewards.length - 1;
    }
  }
  
  initUI() {
    const xpContainer = document.createElement('div');
    xpContainer.className = 'xp-container';
    xpContainer.innerHTML = `
      <div class="xp-level">
        <span class="level-icon"></span>
        <span class="level-title"></span>
        <span class="level-number"></span>
      </div>
      <div class="xp-bar-container">
        <div class="xp-bar"></div>
        <div class="xp-text"></div>
      </div>
      <div class="xp-notification" style="display:none"></div>
    `;
    
    // Insert after header
    const header = document.querySelector('header');
    header.after(xpContainer);
    
    // Add CSS styles
    const style = document.createElement('style');
    style.textContent = `
      .xp-container {
        background: rgba(14, 12, 40, 0.6);
        backdrop-filter: blur(8px);
        padding: 10px 15px;
        border-radius: 10px;
        margin: 10px auto;
        max-width: 500px;
        display: flex;
        flex-direction: column;
        align-items: center;
        box-shadow: 0 0 15px rgba(0,0,0,0.2);
        border: 1px solid rgba(255,255,255,0.1);
        position: relative;
        z-index: 90;
      }
      
      .xp-level {
        display: flex;
        align-items: center;
        margin-bottom: 5px;
        width: 100%;
        justify-content: center;
      }
      
      .level-icon {
        font-size: 1.5rem;
        margin-left: 10px;
        text-shadow: 0 0 10px rgba(255,255,255,0.5);
      }
      
      .level-title {
        font-weight: bold;
        color: gold;
        margin-left: 5px;
      }
      
      .level-number {
        background: rgba(255,215,0,0.2);
        border-radius: 50%;
        width: 25px;
        height: 25px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        color: white;
        margin-right: 5px;
      }
      
      .xp-bar-container {
        width: 100%;
        height: 15px;
        background: rgba(255,255,255,0.1);
        border-radius: 10px;
        overflow: hidden;
        position: relative;
      }
      
      .xp-bar {
        height: 100%;
        background: linear-gradient(to right, gold, #ffd700);
        width: 0%;
        transition: width 1s ease-in-out;
        border-radius: 10px;
      }
      
      .xp-text {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        text-align: center;
        font-size: 0.8rem;
        line-height: 15px;
        color: white;
        text-shadow: 0 0 2px black;
      }
      
      .xp-notification {
        position: fixed;
        top: 20%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(14, 12, 40, 0.9);
        color: white;
        padding: 15px 30px;
        border-radius: 50px;
        box-shadow: 0 0 20px rgba(255,215,0,0.5);
        z-index: 1000;
        display: flex;
        align-items: center;
        animation: xp-notification-anim 3s ease-in-out forwards;
      }
      
      .xp-notification .xp-value {
        color: gold;
        font-weight: bold;
        font-size: 1.2rem;
        margin: 0 5px;
      }
      
      @keyframes xp-notification-anim {
        0% { opacity: 0; transform: translate(-50%, -30%); }
        20% { opacity: 1; transform: translate(-50%, -50%); }
        80% { opacity: 1; transform: translate(-50%, -50%); }
        100% { opacity: 0; transform: translate(-50%, -70%); }
      }
      
      .level-up-animation {
        animation: level-up-glow 2s ease-in-out;
      }
      
      @keyframes level-up-glow {
        0%, 100% { box-shadow: 0 0 5px gold; }
        50% { box-shadow: 0 0 30px gold, 0 0 50px gold; }
      }
    `;
    document.head.appendChild(style);
  }
  
  addXP(amount) {
    if (isNaN(amount)) {
      amount = 10; // Default
    }
    this.lastSessionXP = amount;
    this.xp += amount;
    localStorage.setItem('userXP', this.xp.toString());
    
    const oldLevel = this.level;
    this.level = this.calculateLevel();
    
    this.updateUI();
    this.showXPNotification(amount);
    
    if (this.level > oldLevel) {
      this.handleLevelUp();
    }
    
    return this.level;
  }
  
  calculateLevel() {
    for (let i = this.levelThresholds.length - 1; i >= 0; i--) {
      if (this.xp >= this.levelThresholds[i]) {
        return i;
      }
    }
    return 0;
  }
  
  getProgress() {
    if (this.level >= this.levelThresholds.length - 1) {
      return 100; // Max level
    }
    
    const currentLevelXP = this.levelThresholds[this.level];
    const nextLevelXP = this.levelThresholds[this.level + 1];
    const xpForNextLevel = nextLevelXP - currentLevelXP;
    const progress = ((this.xp - currentLevelXP) / xpForNextLevel) * 100;
    
    return Math.min(Math.max(progress, 0), 100);
  }
  
  updateUI() {
    const levelIcon = document.querySelector('.level-icon');
    const levelTitle = document.querySelector('.level-title');
    const levelNumber = document.querySelector('.level-number');
    const xpBar = document.querySelector('.xp-bar');
    const xpText = document.querySelector('.xp-text');
    
    if (this.level < this.levelRewards.length) {
      const reward = this.levelRewards[this.level];
      levelIcon.textContent = reward.icon;
      levelTitle.textContent = reward.title;
      
      // Apply background change based on level
      document.body.style.background = reward.background;
      document.body.style.backgroundAttachment = "fixed";
    }
    
    levelNumber.textContent = this.level;
    
    const progress = this.getProgress();
    xpBar.style.width = `${progress}%`;
    
    if (this.level >= this.levelThresholds.length - 1) {
      xpText.textContent = `${this.xp} XP - المستوى الأقصى`;
    } else {
      const nextLevelXP = this.levelThresholds[this.level + 1];
      xpText.textContent = `${this.xp} / ${nextLevelXP} XP`;
    }
  }
  
  showXPNotification(amount) {
    const notification = document.querySelector('.xp-notification');
    notification.innerHTML = `<span>+</span><span class="xp-value">${amount}</span><span>XP</span>`;
    notification.style.display = 'flex';
    
    // Reset the animation by removing and re-adding the element
    notification.style.animation = 'none';
    notification.offsetHeight; // Trigger reflow
    notification.style.animation = 'xp-notification-anim 3s ease-in-out forwards';
    
    setTimeout(() => {
      notification.style.display = 'none';
    }, 3000);
  }
  
  handleLevelUp() {
    const xpContainer = document.querySelector('.xp-container');
    xpContainer.classList.add('level-up-animation');
    
    // Show level up message
    const notification = document.querySelector('.xp-notification');
    notification.innerHTML = `
      <span>🎉</span>
      <span class="xp-value">مستوى جديد! ${this.level}</span>
      <span>${this.levelRewards[this.level].icon}</span>
    `;
    notification.style.display = 'flex';
    
    // Reset the animation
    notification.style.animation = 'none';
    notification.offsetHeight; // Trigger reflow
    notification.style.animation = 'xp-notification-anim 4s ease-in-out forwards';
    
    setTimeout(() => {
      notification.style.display = 'none';
      xpContainer.classList.remove('level-up-animation');
    }, 4000);
    
    // Create confetti effect on level up
    this.createLevelUpConfetti();
  }
  
  createLevelUpConfetti() {
    const confettiContainer = document.createElement('div');
    confettiContainer.className = 'level-up-confetti';
    
    confettiContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 999;
    `;
    
    document.body.appendChild(confettiContainer);
    
    for (let i = 0; i < 150; i++) {
      const confetti = document.createElement('div');
      const color = this.getRandomConfettiColor();
      const size = Math.random() * 10 + 5;
      
      confetti.style.cssText = `
        position: absolute;
        top: -10%;
        left: ${Math.random() * 100}%;
        width: ${size}px;
        height: ${size}px;
        background-color: ${color};
        border-radius: 50%;
        opacity: ${Math.random() * 0.8 + 0.2};
        transform: rotate(${Math.random() * 360}deg);
        animation: confetti-fall ${Math.random() * 3 + 2}s linear forwards;
      `;
      
      confettiContainer.appendChild(confetti);
    }
    
    // Add animation keyframes
    const style = document.createElement('style');
    style.textContent = `
      @keyframes confetti-fall {
        to {
          top: 110%;
          transform: rotate(${Math.random() * 360 + 720}deg);
        }
      }
    `;
    document.head.appendChild(style);
    
    // Remove confetti after animation completes
    setTimeout(() => {
      confettiContainer.remove();
    }, 5000);
  }
  
  getRandomConfettiColor() {
    const colors = ['#ffd700', '#ffb300', '#ff8f00', '#ff6f00', '#c0ca33', '#7cb342', '#43a047'];
    return colors[Math.floor(Math.random() * colors.length)];
  }
  
  getCurrentLevel() {
    return this.level;
  }
  
  getTotalXP() {
    return this.xp;
  }
}

// Initialize the XP System when the document is loaded
let xpSystem;
document.addEventListener('DOMContentLoaded', () => {
  xpSystem = new XPSystem();
  
  // Override original markDone function to add XP
  const originalMarkDone = window.markDone;
  window.markDone = function(button) {
    originalMarkDone(button);
    
    // Add XP when marking a task as done
    xpSystem.addXP(10);
    
    // Track for achievements
    const row = button.parentElement.parentElement;
    const subject = row.children[5].textContent;
    const dateStr = row.children[1].textContent;
    const periodName = row.children[2].textContent;
    
    // Calculate approximate session duration from time cells
    const fromTime = row.children[3].textContent;
    const toTime = row.children[4].textContent;
    const duration = estimateSessionDuration(fromTime, toTime);
    
    // Pass data to achievement system
    if (window.achievementSystem) {
      window.achievementSystem.trackStudySession({
        subject,
        duration,
        period: periodName,
        date: dateStr
      });
    }
  };
});

// Utility function to estimate session duration based on time strings
function estimateSessionDuration(fromTime, toTime) {
  // Simple estimation - extract hours
  const fromHour = parseInt(fromTime.split(':')[0]);
  const toHour = parseInt(toTime.split(':')[0]);
  
  // Basic calculation, can be improved with proper time parsing
  return toHour >= fromHour ? toHour - fromHour : (toHour + 12) - fromHour;
}