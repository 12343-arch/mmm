// Achievement Panel and Statistics Tracker
class AchievementPanel {
  constructor() {
    this.stats = this.loadStats();
    this.createPanel();
    this.updateStats();
  }
  
  loadStats() {
    const defaultStats = {
      totalHours: 0,
      totalSessions: 0,
      consecutiveDays: 0,
      maxConsecutiveDays: 0,
      lastStudyDate: null,
      subjectEffort: {},
      startDate: new Date().toISOString()
    };
    
    const savedStats = localStorage.getItem('studyStats');
    return savedStats ? JSON.parse(savedStats) : defaultStats;
  }
  
  saveStats() {
    localStorage.setItem('studyStats', JSON.stringify(this.stats));
  }
  
  createPanel() {
    const container = document.createElement('div');
    container.className = 'stats-panel';
    container.innerHTML = `
      <div class="stats-header">
        <h2>لوحة الإنجازات والإحصائيات</h2>
        <button class="stats-toggle">عرض/إخفاء</button>
      </div>
      <div class="stats-content" style="display: none;">
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-icon">⏱️</div>
            <div class="stat-value" id="total-hours">0</div>
            <div class="stat-label">ساعات المذاكرة</div>
          </div>
          <div class="stat-item">
            <div class="stat-icon">📚</div>
            <div class="stat-value" id="total-sessions">0</div>
            <div class="stat-label">جلسات المذاكرة</div>
          </div>
          <div class="stat-item">
            <div class="stat-icon">🔥</div>
            <div class="stat-value" id="consecutive-days">0</div>
            <div class="stat-label">أيام متواصلة</div>
          </div>
          <div class="stat-item">
            <div class="stat-icon">🏆</div>
            <div class="stat-value" id="max-streak">0</div>
            <div class="stat-label">أطول سلسلة أيام</div>
          </div>
        </div>
        <div class="subjects-effort">
          <h3>المواد الأكثر جهداً</h3>
          <div id="subjects-chart"></div>
        </div>
        <div class="study-journey">
          <h3>مسيرة المذاكرة</h3>
          <div class="journey-timeline" id="journey-timeline"></div>
        </div>
      </div>
    `;
    
    // Insert before the achievements section
    const achievementsSection = document.querySelector('.achievements-section');
    if (achievementsSection) {
      achievementsSection.before(container);
    } else {
      document.querySelector('.container').appendChild(container);
    }
    
    // Add CSS styles
    const style = document.createElement('style');
    style.textContent = `
      .stats-panel {
        background: rgba(14, 12, 40, 0.6);
        backdrop-filter: blur(8px);
        border-radius: 15px;
        margin: 20px auto;
        max-width: 1000px;
        overflow: hidden;
        box-shadow: 0 0 20px rgba(0,0,0,0.3);
        border: 1px solid rgba(255,255,255,0.1);
      }
      
      .stats-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px 20px;
        background: rgba(0,0,0,0.2);
        border-bottom: 1px solid rgba(255,255,255,0.1);
      }
      
      .stats-header h2 {
        color: gold;
        margin: 0;
        font-size: 1.5rem;
      }
      
      .stats-toggle {
        background: linear-gradient(45deg, #f57c00, #fbc02d);
        color: white;
        border: none;
        padding: 8px 15px;
        border-radius: 20px;
        cursor: pointer;
        font-weight: bold;
        box-shadow: 0 0 10px rgba(255,215,0,0.3);
        transition: all 0.2s;
      }
      
      .stats-toggle:hover {
        transform: scale(1.05);
        box-shadow: 0 0 15px rgba(255,215,0,0.5);
      }
      
      .stats-content {
        padding: 20px;
      }
      
      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 20px;
        margin-bottom: 30px;
      }
      
      .stat-item {
        background: rgba(255,255,255,0.05);
        border-radius: 10px;
        padding: 15px;
        text-align: center;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
        transition: transform 0.3s ease;
      }
      
      .stat-item:hover {
        transform: translateY(-5px);
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
      }
      
      .stat-icon {
        font-size: 2rem;
        margin-bottom: 10px;
      }
      
      .stat-value {
        font-size: 2rem;
        font-weight: bold;
        color: #fff;
        text-shadow: 0 0 5px rgba(255,255,255,0.5);
      }
      
      .stat-label {
        color: #ccc;
        margin-top: 5px;
      }
      
      .subjects-effort, .study-journey {
        background: rgba(255,255,255,0.05);
        border-radius: 10px;
        padding: 20px;
        margin-bottom: 20px;
      }
      
      .subjects-effort h3, .study-journey h3 {
        color: #fff;
        margin-top: 0;
        border-bottom: 1px solid rgba(255,255,255,0.1);
        padding-bottom: 10px;
      }
      
      #subjects-chart {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-top: 15px;
      }
      
      .subject-bar {
        flex-grow: 1;
        min-width: 200px;
        background: rgba(255,255,255,0.1);
        border-radius: 5px;
        overflow: hidden;
        margin-bottom: 10px;
      }
      
      .subject-bar-inner {
        height: 30px;
        background: linear-gradient(to right, #4CAF50, #81C784);
        text-align: right;
        padding-right: 10px;
        line-height: 30px;
        color: white;
        font-weight: bold;
        transition: width 1s ease-out;
      }
      
      .subject-name {
        margin-bottom: 5px;
        color: #fff;
      }
      
      .journey-timeline {
        display: flex;
        overflow-x: auto;
        padding: 20px 0;
        gap: 5px;
      }
      
      .timeline-day {
        min-width: 30px;
        height: 20px;
        background: rgba(255,255,255,0.1);
        border-radius: 3px;
        position: relative;
      }
      
      .timeline-day.active {
        background: #4CAF50;
      }
      
      .timeline-day:hover::after {
        content: attr(data-date);
        position: absolute;
        bottom: 25px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 3px 8px;
        border-radius: 3px;
        font-size: 0.8rem;
        white-space: nowrap;
      }
      
      @media (max-width: 768px) {
        .stats-grid {
          grid-template-columns: repeat(2, 1fr);
        }
      }
      
      @media (max-width: 480px) {
        .stats-grid {
          grid-template-columns: 1fr;
        }
      }
    `;
    document.head.appendChild(style);
    
    // Add event listeners
    document.querySelector('.stats-toggle').addEventListener('click', () => {
      const content = document.querySelector('.stats-content');
      if (content.style.display === 'none') {
        content.style.display = 'block';
      } else {
        content.style.display = 'none';
      }
    });
  }
  
  updateStats() {
    document.getElementById('total-hours').textContent = this.stats.totalHours;
    document.getElementById('total-sessions').textContent = this.stats.totalSessions;
    document.getElementById('consecutive-days').textContent = this.stats.consecutiveDays;
    document.getElementById('max-streak').textContent = this.stats.maxConsecutiveDays;
    
    this.updateSubjectsChart();
    this.updateJourneyTimeline();
  }
  
  updateSubjectsChart() {
    const subjectsChart = document.getElementById('subjects-chart');
    subjectsChart.innerHTML = '';
    
    // Get top subjects by effort
    const subjects = Object.entries(this.stats.subjectEffort)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5); // Top 5 subjects
    
    if (subjects.length === 0) {
      subjectsChart.innerHTML = '<div class="no-data">لم يتم تسجيل جلسات مذاكرة بعد</div>';
      return;
    }
    
    const maxEffort = subjects[0][1]; // Maximum effort value
    
    subjects.forEach(([subject, effort]) => {
      const percentage = Math.min((effort / maxEffort) * 100, 100);
      
      const subjectElem = document.createElement('div');
      subjectElem.className = 'subject-item';
      subjectElem.innerHTML = `
        <div class="subject-name">${subject} (${effort} جلسة)</div>
        <div class="subject-bar">
          <div class="subject-bar-inner" style="width: 0%">${effort}</div>
        </div>
      `;
      subjectsChart.appendChild(subjectElem);
      
      // Animate the bar
      setTimeout(() => {
        subjectElem.querySelector('.subject-bar-inner').style.width = `${percentage}%`;
      }, 100);
    });
  }
  
  updateJourneyTimeline() {
    const timeline = document.getElementById('journey-timeline');
    timeline.innerHTML = '';
    
    // Create a timeline of the last 30 days
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Get all study days from marked tasks
    const studyDays = new Set();
    document.querySelectorAll('#study-table tbody tr.done-cell, #study-table tbody tr.done-day').forEach(row => {
      if (row.children.length >= 2 && row.children[1]) {
        const dateStr = row.children[1].textContent;
        if (dateStr) studyDays.add(dateStr);
      }
    });
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const dateStr = date.toLocaleDateString('ar-EG');
      
      const dayElem = document.createElement('div');
      dayElem.className = `timeline-day${studyDays.has(dateStr) ? ' active' : ''}`;
      dayElem.setAttribute('data-date', dateStr);
      timeline.appendChild(dayElem);
    }
  }
  
  recordStudySession(data) {
    const { subject, duration, date } = data;
    
    // Update total hours
    this.stats.totalHours += duration;
    
    // Update total sessions
    this.stats.totalSessions++;
    
    // Update subject effort
    if (!this.stats.subjectEffort[subject]) {
      this.stats.subjectEffort[subject] = 0;
    }
    this.stats.subjectEffort[subject]++;
    
    // Update consecutive days
    this.updateConsecutiveDays(date);
    
    this.saveStats();
    this.updateStats();
  }
  
  updateConsecutiveDays(dateStr) {
    // Convert Arabic date format to Date object for comparison
    const dateParts = dateStr.split('/');
    if (dateParts.length !== 3) return;
    
    // Arabic date format: day/month/year
    const day = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]) - 1; // Months are 0-indexed
    const year = parseInt(dateParts[2]);
    
    const studyDate = new Date(year, month, day);
    studyDate.setHours(0, 0, 0, 0);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // First study session ever
    if (!this.stats.lastStudyDate) {
      this.stats.lastStudyDate = studyDate.toISOString();
      this.stats.consecutiveDays = 1;
      this.stats.maxConsecutiveDays = 1;
      return;
    }
    
    const lastStudyDate = new Date(this.stats.lastStudyDate);
    const timeDiff = Math.abs(studyDate - lastStudyDate);
    const dayDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    
    if (dayDiff === 1) {
      // Next consecutive day
      this.stats.consecutiveDays++;
      if (this.stats.consecutiveDays > this.stats.maxConsecutiveDays) {
        this.stats.maxConsecutiveDays = this.stats.consecutiveDays;
      }
    } else if (dayDiff > 1) {
      // Streak broken
      this.stats.consecutiveDays = 1;
    }
    
    this.stats.lastStudyDate = studyDate.toISOString();
  }
  
  getStats() {
    return this.stats;
  }
}

// Initialize the Achievement Panel when the document is loaded
let achievementPanel;
document.addEventListener('DOMContentLoaded', () => {
  achievementPanel = new AchievementPanel();
  
  // Override markDone to record study sessions
  const originalMarkDone = window.markDone;
  if (typeof originalMarkDone === 'function' && !window.isAchievementPanelInitialized) {
    window.markDone = function(button) {
      originalMarkDone(button);
      
      // Record study session
      const row = button.parentElement.parentElement;
      const subject = row.children[5].textContent;
      const dateStr = row.children[1].textContent;
      const fromTime = row.children[3].textContent;
      const toTime = row.children[4].textContent;
      
      const duration = estimateSessionDuration(fromTime, toTime);
      
      achievementPanel.recordStudySession({
        subject,
        duration,
        date: dateStr
      });
    };
    
    window.isAchievementPanelInitialized = true;
  }
});

// Utility function (duplicated to ensure this file can work independently)
function estimateSessionDuration(fromTime, toTime) {
  const fromHour = parseInt(fromTime.split(':')[0]);
  const toHour = parseInt(toTime.split(':')[0]);
  
  return toHour >= fromHour ? toHour - fromHour : (toHour + 12) - fromHour;
}