// Enhanced Achievements System with Special Badges
const achievementCategories = {
  study: {
    title: "الدراسة والمثابرة",
    achievements: [
      {
        id: 'first_week',
        title: 'أول أسبوع دراسي',
        description: 'أكملت أول أسبوع من الدراسة بنجاح',
        icon: '🌟',
        requiredProgress: 7,
        reward: {
          type: 'motivation',
          content: 'كوبون تخفيض على كتب مدرسية'
        }
      },
      {
        id: 'consistency_master',
        title: 'ملك الاستمرارية',
        description: 'ذاكرت 7 أيام متتالية بدون انقطاع',
        icon: '👑',
        requiredProgress: 7,
        reward: {
          type: 'digital',
          content: 'خلفية شاشة خاصة'
        }
      },
      {
        id: 'night_owl',
        title: 'سهران العلم',
        description: 'أكملت 10 جلسات مسائية',
        icon: '🌙',
        requiredProgress: 10,
        reward: {
          type: 'physical',
          content: 'مصباح مكتب LED'
        }
      }
    ]
  },
  subjects: {
    title: "التفوق في المواد الدراسية",
    achievements: [
      {
        id: 'physics_lion',
        title: 'أسد الفيزياء',
        description: 'أنهيت 5 جلسات في مادة الفيزياء',
        icon: '🦁',
        requiredProgress: 5,
        reward: {
          type: 'motivation',
          content: 'شهادة إنجاز ملك الفيزياء'
        }
      },
      {
        id: 'science_champion',
        title: 'أمير العلوم',
        description: 'أكملت 10 جلسات في العلوم',
        icon: '🔬',
        requiredProgress: 10,
        reward: {
          type: 'digital',
          content: 'كتاب إلكتروني علمي مجاني'
        }
      },
      {
        id: 'math_genius',
        title: 'عبقري الرياضيات',
        description: 'أنهيت 5 جلسات في مادة الرياضيات',
        icon: '📐',
        requiredProgress: 5,
        reward: {
          type: 'digital',
          content: 'أداة حاسبة متقدمة'
        }
      }
    ]
  },
  time_management: {
    title: "إدارة الوقت",
    achievements: [
      {
        id: 'time_ninja',
        title: 'نينجا الوقت',
        description: 'درست لأكثر من 4 ساعات متواصلة',
        icon: '⏰',
        requiredProgress: 4,
        reward: {
          type: 'physical',
          content: 'مذكرة تخطيط فاخرة'
        }
      },
      {
        id: 'balanced_learner',
        title: 'المتعلم المتوازن',
        description: 'حققت توازن بين الفترات الدراسية', 
        icon: '⚖️',
        requiredProgress: 3,
        reward: {
          type: 'motivation',
          content: 'استشارة تعليمية مجانية'
        }
      },
      {
        id: 'morning_person',
        title: 'طالب الصباح',
        description: 'أكملت 5 جلسات صباحية',
        icon: '☀️',
        requiredProgress: 5,
        reward: {
          type: 'treat',
          content: 'كوبون مشروب قهوة مجاني'
        }
      }
    ]
  }
};

class AdvancedAchievementSystem {
  constructor() {
    this.achievements = this.flattenAchievements(achievementCategories);
    this.unlockedAchievements = JSON.parse(localStorage.getItem('unlockedAchievements') || '[]');
    this.achievementProgress = JSON.parse(localStorage.getItem('achievementProgress') || '{}');
    this.sessionsBySubject = JSON.parse(localStorage.getItem('sessionsBySubject') || '{}');
    this.consecutiveDays = JSON.parse(localStorage.getItem('consecutiveDays') || '{"count": 0, "lastDate": null}');
    
    this.initializeAchievementsUI();
    this.setupBadgesDisplay();
  }

  flattenAchievements(categories) {
    let flatList = [];
    Object.values(categories).forEach(category => {
      flatList = flatList.concat(category.achievements);
    });
    return flatList;
  }

  initializeAchievementsUI() {
    const container = document.getElementById('achievements-container');
    if (!container) return;

    container.innerHTML = ''; 

    Object.entries(achievementCategories).forEach(([categoryKey, category]) => {
      const categoryEl = document.createElement('div');
      categoryEl.classList.add('achievement-category');

      const categoryTitle = document.createElement('h3');
      categoryTitle.textContent = category.title;
      categoryTitle.classList.add('category-title');
      categoryEl.appendChild(categoryTitle);

      const categoryGrid = document.createElement('div');
      categoryGrid.classList.add('achievements-grid');

      category.achievements.forEach(achievement => {
        const achievementEl = this.createAchievementElement(achievement);
        categoryGrid.appendChild(achievementEl);
      });

      categoryEl.appendChild(categoryGrid);
      container.appendChild(categoryEl);
    });
  }

  setupBadgesDisplay() {
    // Create a badge container element in the header
    const header = document.querySelector('header');
    if (!header) return;
    
    const badgesContainer = document.createElement('div');
    badgesContainer.className = 'active-badges';
    badgesContainer.innerHTML = '<div class="badges-inner"></div>';
    
    header.appendChild(badgesContainer);
    
    // Add CSS styles for badges
    const style = document.createElement('style');
    style.textContent = `
      .active-badges {
        display: flex;
        align-items: center;
        margin-left: 15px;
        position: relative;
      }
      
      .badges-inner {
        display: flex;
        gap: 5px;
        overflow-x: auto;
        max-width: 150px;
        scrollbar-width: none; /* Firefox */
      }
      
      .badges-inner::-webkit-scrollbar {
        display: none; /* Chrome, Safari, Edge */
      }
      
      .badge-icon {
        font-size: 1.2rem;
        background: rgba(255,255,255,0.1);
        border-radius: 50%;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        transition: transform 0.3s ease;
      }
      
      .badge-icon:hover {
        transform: scale(1.2);
      }
      
      .badge-icon::after {
        content: attr(data-title);
        position: absolute;
        bottom: -30px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 3px 8px;
        border-radius: 3px;
        font-size: 0.7rem;
        white-space: nowrap;
        opacity: 0;
        transition: opacity 0.3s;
        pointer-events: none;
        z-index: 100;
      }
      
      .badge-icon:hover::after {
        opacity: 1;
      }
    `;
    document.head.appendChild(style);
    
    // Update badges display
    this.updateBadgesDisplay();
  }
  
  updateBadgesDisplay() {
    const badgesContainer = document.querySelector('.badges-inner');
    if (!badgesContainer) return;
    
    badgesContainer.innerHTML = '';
    
    // Show icons for unlocked achievements (badges)
    this.unlockedAchievements.forEach(achievementId => {
      const achievement = this.achievements.find(a => a.id === achievementId);
      if (achievement) {
        const badgeIcon = document.createElement('div');
        badgeIcon.className = 'badge-icon';
        badgeIcon.innerHTML = achievement.icon;
        badgeIcon.setAttribute('data-title', achievement.title);
        badgesContainer.appendChild(badgeIcon);
      }
    });
  }

  createAchievementElement(achievement) {
    const achievementEl = document.createElement('div');
    achievementEl.classList.add('achievement-item');
    achievementEl.dataset.id = achievement.id;

    const isUnlocked = this.unlockedAchievements.includes(achievement.id);
    achievementEl.classList.toggle('unlocked', isUnlocked);

    if (!isUnlocked) {
      achievementEl.classList.add('locked'); 
    }

    const progress = this.achievementProgress[achievement.id] || 0;
    const progressPercentage = Math.min((progress / achievement.requiredProgress) * 100, 100);

    achievementEl.innerHTML = `
      <div class="achievement-icon ${isUnlocked ? '' : 'locked-icon'}">${achievement.icon}</div>
      <div class="achievement-details">
        <h3>${achievement.title}</h3>
        <p>${achievement.description}</p>
        <div class="achievement-progress">
          <div class="progress-bar" style="width: ${progressPercentage}%;"></div>
        </div>
        <div class="progress-text">${progress}/${achievement.requiredProgress}</div>
        ${isUnlocked ? `
          <div class="unlock-details">
            <span class="unlock-badge">✨ تم فتحها</span>
            <div class="reward-info">
              <strong>المكافأة:</strong> ${this.getRewardDescription(achievement.reward)}
            </div>
          </div>
        ` : ''}
      </div>
      ${!isUnlocked ? '<div class="lock-overlay">🔒</div>' : ''}
    `;

    return achievementEl;
  }

  getRewardDescription(reward) {
    switch(reward.type) {
      case 'motivation': return `خطاب تحفيزي: ${reward.content}`;
      case 'digital': return `مكافأة رقمية: ${reward.content}`;
      case 'physical': return `هدية: ${reward.content}`;
      case 'treat': return `مكافأة: ${reward.content}`;
      default: return 'مكافأة غير محددة';
    }
  }

  updateAchievementProgress(achievementId, incrementValue = 1) {
    if (!this.achievementProgress[achievementId]) {
      this.achievementProgress[achievementId] = 0;
    }
    this.achievementProgress[achievementId] += incrementValue;
    localStorage.setItem('achievementProgress', JSON.stringify(this.achievementProgress));
    this.updateAchievementProgressBar(achievementId); 
  }

  updateAchievementProgressBar(achievementId) {
    const achievementEl = document.querySelector(`.achievement-item[data-id="${achievementId}"]`);
    if (achievementEl) {
      const achievement = this.achievements.find(a => a.id === achievementId);
      if (!achievement) return;
      
      const progress = this.achievementProgress[achievementId] || 0;
      const progressPercentage = Math.min((progress / achievement.requiredProgress) * 100, 100);
      
      const progressBar = achievementEl.querySelector('.progress-bar');
      if (progressBar) {
        progressBar.style.width = `${progressPercentage}%`;
      }
      
      const progressText = achievementEl.querySelector('.progress-text');
      if (progressText) {
        progressText.textContent = `${progress}/${achievement.requiredProgress}`;
      }
    }
  }

  checkAchievements() {
    this.achievements.forEach(achievement => {
      if (this.unlockedAchievements.includes(achievement.id)) return;

      const currentProgress = this.achievementProgress[achievement.id] || 0;
      if (currentProgress >= achievement.requiredProgress) {
        this.unlockAchievement(achievement);
      }
    });

    this.initializeAchievementsUI();
    this.updateBadgesDisplay();
  }

  unlockAchievement(achievement) {
    if (!this.unlockedAchievements.includes(achievement.id)) {
      this.unlockedAchievements.push(achievement.id);
      localStorage.setItem('unlockedAchievements', JSON.stringify(this.unlockedAchievements));

      this.updateAchievementUI(achievement.id); 
      this.showCelebrationAnimation(achievement); 
      
      // Give XP for unlocking an achievement
      if (window.xpSystem) {
        window.xpSystem.addXP(25);
      }
    }
  }

  updateAchievementUI(achievementId) {
    const achievementEl = document.querySelector(`.achievement-item[data-id="${achievementId}"]`);
    if (!achievementEl) return;
    
    const achievement = this.achievements.find(a => a.id === achievementId);
    if (!achievement) return;
    
    achievementEl.classList.add('unlocked');
    achievementEl.classList.remove('locked');
    
    const iconElement = achievementEl.querySelector('.achievement-icon');
    if (iconElement) {
      iconElement.classList.remove('locked-icon');
    }
    
    const lockOverlay = achievementEl.querySelector('.lock-overlay');
    if (lockOverlay) {
      lockOverlay.remove();
    }
    
    const detailsElement = achievementEl.querySelector('.achievement-details');
    if (detailsElement) {
      const unlockDetails = document.createElement('div');
      unlockDetails.className = 'unlock-details';
      unlockDetails.innerHTML = `
        <span class="unlock-badge">✨ تم فتحها</span>
        <div class="reward-info">
          <strong>المكافأة:</strong> ${this.getRewardDescription(achievement.reward)}
        </div>
      `;
      
      // Check if unlock details already exist
      if (!achievementEl.querySelector('.unlock-details')) {
        detailsElement.appendChild(unlockDetails);
      }
    }
  }

  showCelebrationAnimation(achievement) {
    const celebrationContainer = document.createElement('div');
    celebrationContainer.classList.add('celebration-container');
    celebrationContainer.innerHTML = `
      <div class="confetti"></div>
      <div class="achievement-unlock-popup">
        <div class="achievement-icon">${achievement.icon}</div>
        <h2>تم فتح الإنجاز!</h2>
        <h3>${achievement.title}</h3>
        <p>${achievement.description}</p>
        <p class="reward-text">المكافأة: ${this.getRewardDescription(achievement.reward)}</p>
      </div>
    `;
    document.body.appendChild(celebrationContainer);

    const confettiDiv = celebrationContainer.querySelector('.confetti');
    for (let i = 0; i < 100; i++) {
      const confettiPiece = document.createElement('div');
      confettiPiece.classList.add('confetti-piece');
      confettiPiece.style.left = `${Math.random() * 100}vw`;
      confettiPiece.style.animationDelay = `${Math.random()}s`;
      confettiDiv.appendChild(confettiPiece);
    }

    setTimeout(() => {
      celebrationContainer.remove();
    }, 5000); 
  }

  updateConsecutiveDays(dateStr) {
    if (!dateStr) return;
    
    const dateParts = dateStr.split('/');
    if (dateParts.length !== 3) return;
    
    // Convert Arabic date format to Date object
    const day = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]) - 1; // Months are 0-indexed
    const year = parseInt(dateParts[2]);
    
    const currentDate = new Date(year, month, day);
    currentDate.setHours(0, 0, 0, 0);
    
    if (!this.consecutiveDays.lastDate) {
      // First study day
      this.consecutiveDays = {
        count: 1,
        lastDate: currentDate.toISOString()
      };
    } else {
      const lastDate = new Date(this.consecutiveDays.lastDate);
      lastDate.setDate(lastDate.getDate() + 1);
      lastDate.setHours(0, 0, 0, 0);
      
      if (currentDate.getTime() === lastDate.getTime()) {
        // Next consecutive day
        this.consecutiveDays.count++;
        this.consecutiveDays.lastDate = currentDate.toISOString();
      } else if (currentDate > lastDate) {
        // Missed days, streak broken
        this.consecutiveDays = {
          count: 1,
          lastDate: currentDate.toISOString()
        };
      }
      // If current date is before last date, ignore it (old entry)
    }
    
    localStorage.setItem('consecutiveDays', JSON.stringify(this.consecutiveDays));
    
    // Update consistency_master achievement
    if (this.consecutiveDays.count >= 7) {
      this.updateAchievementProgress('consistency_master', this.consecutiveDays.count);
    }
  }

  trackStudySession(data) {
    const { subject, duration, period, date } = data;

    // Track first week achievement (each unique date counts)
    this.updateAchievementProgress('first_week');
    
    // Update consecutive days
    this.updateConsecutiveDays(date);

    // Track subject-specific sessions
    if (!this.sessionsBySubject[subject]) {
      this.sessionsBySubject[subject] = 0;
    }
    this.sessionsBySubject[subject]++;
    localStorage.setItem('sessionsBySubject', JSON.stringify(this.sessionsBySubject));

    // Check for physics lion achievement
    if (subject.includes('فيزياء')) {
      this.updateAchievementProgress('physics_lion');
    }
    
    // Check for science champion achievement
    const scienceSubjects = ['فيزياء', 'كيمياء', 'أحياء', 'علوم'];
    if (scienceSubjects.some(s => subject.includes(s))) {
      this.updateAchievementProgress('science_champion');
    }
    
    // Check for math genius achievement
    if (subject.includes('رياضيات') || subject.includes('حساب')) {
      this.updateAchievementProgress('math_genius');
    }

    // Track time ninja achievement (for long sessions)
    if (duration >= 4) { 
      this.updateAchievementProgress('time_ninja');
    }

    // Track night owl achievement
    if (period.includes('مسائية')) {
      this.updateAchievementProgress('night_owl');
    }
    
    // Track morning person achievement
    if (period.includes('صباحية')) {
      this.updateAchievementProgress('morning_person');
    }
    
    // Track balanced learner achievement
    // Assuming the achievement is for studying in all three periods (morning, afternoon, evening)
    const periodsStudied = new Set();
    document.querySelectorAll('#study-table tbody tr.done-cell').forEach(row => {
      if (row.children.length >= 3 && row.children[2]) {
        const periodText = row.children[2].textContent;
        periodsStudied.add(periodText);
      }
    });
    
    if (periodsStudied.size >= 3) {
      this.updateAchievementProgress('balanced_learner', periodsStudied.size);
    }

    this.checkAchievements();
  }
  
  getSubjectWithMostEffort() {
    let maxEffort = 0;
    let topSubject = '';
    
    Object.entries(this.sessionsBySubject).forEach(([subject, count]) => {
      if (count > maxEffort) {
        maxEffort = count;
        topSubject = subject;
      }
    });
    
    return { subject: topSubject, count: maxEffort };
  }
  
  getConsecutiveDaysCount() {
    return this.consecutiveDays.count;
  }
}

// Initialize the Advanced Achievement System when the document is loaded
let advancedAchievementSystem;
document.addEventListener('DOMContentLoaded', () => {
  advancedAchievementSystem = new AdvancedAchievementSystem();
  
  // Make it globally accessible
  window.achievementSystem = advancedAchievementSystem;
});