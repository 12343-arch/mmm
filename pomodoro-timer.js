// Pomodoro Timer System Implementation
class PomodoroTimer {
  constructor() {
    this.settings = {
      focusDuration: 25 * 60, // 25 minutes in seconds
      shortBreakDuration: 5 * 60, // 5 minutes in seconds
      longBreakDuration: 15 * 60, // 15 minutes in seconds
      sessionsBeforeLongBreak: 4,
      autoStartBreaks: true,
      autoStartPomodoros: false,
      soundEnabled: true,
      currentSubject: ''
    };
    
    this.state = {
      isRunning: false,
      currentMode: 'focus', // focus, shortBreak, longBreak
      timeRemaining: this.settings.focusDuration,
      sessionsCompleted: 0,
      startTime: null,
      timerInterval: null
    };
    
    this.loadSettings();
    this.createPomodoroUI();
    this.setupEventListeners();
    this.updateDisplay();
  }
  
  loadSettings() {
    const savedSettings = localStorage.getItem('pomodoroSettings');
    if (savedSettings) {
      this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
    }
  }
  
  saveSettings() {
    localStorage.setItem('pomodoroSettings', JSON.stringify(this.settings));
  }
  
  createPomodoroUI() {
    // Create container
    const pomodoroContainer = document.createElement('div');
    pomodoroContainer.className = 'pomodoro-container';
    pomodoroContainer.innerHTML = `
      <div class="pomodoro-widget">
        <div class="pomodoro-header">
          <h3>بوموردو</h3>
          <button class="pomodoro-toggle-settings">⚙️</button>
          <button class="pomodoro-toggle-expand">🔍</button>
        </div>
        <div class="pomodoro-timer">
          <div class="timer-display">
            <span class="minutes">25</span>:<span class="seconds">00</span>
          </div>
          <div class="timer-label">وقت التركيز</div>
        </div>
        <div class="pomodoro-controls">
          <button class="pomodoro-start-btn">ابدأ</button>
          <button class="pomodoro-pause-btn" disabled>إيقاف مؤقت</button>
          <button class="pomodoro-reset-btn">إعادة</button>
        </div>
        <div class="pomodoro-sessions">
          <span class="session-count">0</span>/<span class="session-goal">4</span> جلسات
        </div>
        <div class="pomodoro-subject">
          <select class="subject-select">
            <option value="">اختر المادة...</option>
          </select>
        </div>
      </div>
      
      <div class="pomodoro-settings" style="display: none;">
        <h3>إعدادات البوموردو</h3>
        <div class="settings-group">
          <label>مدة التركيز (دقائق)
            <input type="number" class="focus-duration" min="1" max="120" value="25">
          </label>
        </div>
        <div class="settings-group">
          <label>استراحة قصيرة (دقائق)
            <input type="number" class="short-break" min="1" max="30" value="5">
          </label>
        </div>
        <div class="settings-group">
          <label>استراحة طويلة (دقائق)
            <input type="number" class="long-break" min="5" max="60" value="15">
          </label>
        </div>
        <div class="settings-group">
          <label>جلسات قبل الاستراحة الطويلة
            <input type="number" class="sessions-count" min="1" max="10" value="4">
          </label>
        </div>
        <div class="settings-group checkbox">
          <label>
            <input type="checkbox" class="auto-start-breaks" checked>
            بدء الاستراحات تلقائيًا
          </label>
        </div>
        <div class="settings-group checkbox">
          <label>
            <input type="checkbox" class="auto-start-pomodoros">
            بدء جلسات التركيز تلقائيًا
          </label>
        </div>
        <div class="settings-group checkbox">
          <label>
            <input type="checkbox" class="sound-enabled" checked>
            تفعيل الصوت
          </label>
        </div>
        <div class="settings-buttons">
          <button class="save-settings">حفظ</button>
          <button class="cancel-settings">إلغاء</button>
        </div>
      </div>
      
      <div class="pomodoro-logs" style="display: none;">
        <h3>سجل جلسات البوموردو</h3>
        <div class="logs-list"></div>
      </div>
      
      <audio id="timer-complete" preload="auto">
        <source src="https://assets.mixkit.co/sfx/preview/mixkit-alert-bells-echo-765.mp3" type="audio/mpeg">
      </audio>
      
      <audio id="session-start" preload="auto">
        <source src="https://assets.mixkit.co/sfx/preview/mixkit-little-bell-notification-733.mp3" type="audio/mpeg">
      </audio>
    `;
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      .pomodoro-container {
        background: rgba(14, 12, 40, 0.6);
        backdrop-filter: blur(8px);
        border-radius: 15px;
        padding: 15px;
        margin: 20px auto;
        max-width: 350px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        border: 1px solid rgba(255,255,255,0.1);
        position: relative;
        overflow: hidden;
        color: white;
      }
      
      .pomodoro-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
      }
      
      .pomodoro-header h3 {
        color: gold;
        margin: 0;
      }
      
      .pomodoro-toggle-settings, .pomodoro-toggle-expand {
        background: none;
        border: none;
        font-size: 1.2rem;
        cursor: pointer;
        color: white;
        opacity: 0.7;
        transition: opacity 0.3s;
      }
      
      .pomodoro-toggle-settings:hover, .pomodoro-toggle-expand:hover {
        opacity: 1;
      }
      
      .pomodoro-timer {
        text-align: center;
        margin-bottom: 15px;
      }
      
      .timer-display {
        font-size: 3rem;
        font-weight: bold;
        color: white;
        text-shadow: 0 0 10px rgba(255,255,255,0.5);
      }
      
      .timer-label {
        font-size: 0.9rem;
        color: #ccc;
        margin-top: 5px;
      }
      
      .pomodoro-controls {
        display: flex;
        justify-content: center;
        gap: 10px;
        margin-bottom: 15px;
      }
      
      .pomodoro-controls button {
        background: linear-gradient(45deg, #4CAF50, #81C784);
        color: white;
        border: none;
        padding: 8px 15px;
        border-radius: 20px;
        cursor: pointer;
        font-weight: bold;
        transition: all 0.2s;
      }
      
      .pomodoro-controls button:hover {
        transform: scale(1.05);
        box-shadow: 0 0 10px rgba(76, 175, 80, 0.5);
      }
      
      .pomodoro-controls button:disabled {
        background: #585858;
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
      }
      
      .pomodoro-sessions {
        text-align: center;
        margin-bottom: 15px;
        color: #ddd;
      }
      
      .session-count {
        color: gold;
        font-weight: bold;
      }
      
      .pomodoro-subject {
        text-align: center;
        margin-bottom: 10px;
      }
      
      .subject-select {
        width: 100%;
        padding: 8px 15px;
        border-radius: 20px;
        border: 1px solid rgba(255,255,255,0.1);
        background: rgba(255,255,255,0.1);
        color: white;
        text-align: center;
      }
      
      .pomodoro-settings {
        background: rgba(14, 12, 40, 0.8);
        padding: 15px;
        border-radius: 10px;
        margin-top: 15px;
      }
      
      .pomodoro-settings h3 {
        color: gold;
        text-align: center;
        margin-top: 0;
      }
      
      .settings-group {
        margin-bottom: 10px;
      }
      
      .settings-group label {
        display: block;
        margin-bottom: 5px;
        color: #ddd;
      }
      
      .settings-group input[type="number"] {
        width: 100%;
        padding: 8px;
        border-radius: 5px;
        border: 1px solid rgba(255,255,255,0.1);
        background: rgba(255,255,255,0.1);
        color: white;
      }
      
      .settings-group.checkbox {
        display: flex;
        align-items: center;
      }
      
      .settings-group.checkbox label {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      
      .settings-buttons {
        display: flex;
        justify-content: center;
        gap: 10px;
        margin-top: 15px;
      }
      
      .settings-buttons button {
        background: linear-gradient(45deg, #4CAF50, #81C784);
        color: white;
        border: none;
        padding: 8px 15px;
        border-radius: 20px;
        cursor: pointer;
        font-weight: bold;
      }
      
      .settings-buttons button.cancel-settings {
        background: linear-gradient(45deg, #f44336, #e57373);
      }
      
      .pomodoro-logs {
        margin-top: 15px;
        max-height: 200px;
        overflow-y: auto;
      }
      
      .log-entry {
        background: rgba(255,255,255,0.05);
        padding: 10px;
        border-radius: 5px;
        margin-bottom: 5px;
      }
      
      .log-subject {
        font-weight: bold;
        color: gold;
      }
      
      .log-time {
        color: #ccc;
        font-size: 0.9rem;
      }
      
      /* Timer states */
      .pomodoro-container.focus-mode {
        border: 2px solid #4caf50;
      }
      
      .pomodoro-container.short-break-mode {
        border: 2px solid #2196f3;
      }
      
      .pomodoro-container.long-break-mode {
        border: 2px solid #9c27b0;
      }
      
      /* Expanded state */
      .pomodoro-container.expanded {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 400px;
        max-width: 90vw;
        z-index: 1000;
        box-shadow: 0 0 50px rgba(0,0,0,0.5);
      }
      
      /* Fullscreen overlay for focus mode */
      .focus-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.85);
        z-index: 999;
        display: none;
        align-items: center;
        justify-content: center;
        flex-direction: column;
      }
      
      .focus-overlay .timer-display {
        font-size: 6rem;
      }
      
      .focus-overlay .timer-label {
        font-size: 1.5rem;
        margin: 20px 0;
      }
      
      .focus-overlay .exit-focus-mode {
        position: absolute;
        top: 20px;
        right: 20px;
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        opacity: 0.5;
        transition: opacity 0.3s;
      }
      
      .focus-overlay .exit-focus-mode:hover {
        opacity: 1;
      }
      
      @media (max-width: 768px) {
        .pomodoro-container {
          max-width: 90%;
        }
      }
    `;
    document.head.appendChild(style);
    
    // Inject the Pomodoro container into the page
    const xpContainer = document.querySelector('.xp-container');
    if (xpContainer) {
      xpContainer.after(pomodoroContainer);
    } else {
      document.querySelector('.container').prepend(pomodoroContainer);
    }
    
    // Add focus overlay
    const focusOverlay = document.createElement('div');
    focusOverlay.className = 'focus-overlay';
    focusOverlay.innerHTML = `
      <div class="timer-display">
        <span class="minutes">25</span>:<span class="seconds">00</span>
      </div>
      <div class="timer-label">وقت التركيز</div>
      <button class="exit-focus-mode">✕</button>
    `;
    document.body.appendChild(focusOverlay);
    
    // Populate subject dropdown with study subjects from table
    this.populateSubjectDropdown();
  }
  
  setupEventListeners() {
    // Timer controls
    document.querySelector('.pomodoro-start-btn').addEventListener('click', () => this.startTimer());
    document.querySelector('.pomodoro-pause-btn').addEventListener('click', () => this.pauseTimer());
    document.querySelector('.pomodoro-reset-btn').addEventListener('click', () => this.resetTimer());
    
    // Settings toggle
    document.querySelector('.pomodoro-toggle-settings').addEventListener('click', () => {
      const settingsPanel = document.querySelector('.pomodoro-settings');
      if (settingsPanel.style.display === 'none') {
        settingsPanel.style.display = 'block';
        // Pre-fill settings inputs
        document.querySelector('.focus-duration').value = this.settings.focusDuration / 60;
        document.querySelector('.short-break').value = this.settings.shortBreakDuration / 60;
        document.querySelector('.long-break').value = this.settings.longBreakDuration / 60;
        document.querySelector('.sessions-count').value = this.settings.sessionsBeforeLongBreak;
        document.querySelector('.auto-start-breaks').checked = this.settings.autoStartBreaks;
        document.querySelector('.auto-start-pomodoros').checked = this.settings.autoStartPomodoros;
        document.querySelector('.sound-enabled').checked = this.settings.soundEnabled;
      } else {
        settingsPanel.style.display = 'none';
      }
    });
    
    // Save settings
    document.querySelector('.save-settings').addEventListener('click', () => {
      this.settings.focusDuration = parseInt(document.querySelector('.focus-duration').value) * 60;
      this.settings.shortBreakDuration = parseInt(document.querySelector('.short-break').value) * 60;
      this.settings.longBreakDuration = parseInt(document.querySelector('.long-break').value) * 60;
      this.settings.sessionsBeforeLongBreak = parseInt(document.querySelector('.sessions-count').value);
      this.settings.autoStartBreaks = document.querySelector('.auto-start-breaks').checked;
      this.settings.autoStartPomodoros = document.querySelector('.auto-start-pomodoros').checked;
      this.settings.soundEnabled = document.querySelector('.sound-enabled').checked;
      
      this.saveSettings();
      document.querySelector('.pomodoro-settings').style.display = 'none';
      
      // Update timer display if not running
      if (!this.state.isRunning) {
        this.resetTimer();
      }
    });
    
    // Cancel settings
    document.querySelector('.cancel-settings').addEventListener('click', () => {
      document.querySelector('.pomodoro-settings').style.display = 'none';
    });
    
    // Expand/minimize
    document.querySelector('.pomodoro-toggle-expand').addEventListener('click', () => {
      const container = document.querySelector('.pomodoro-container');
      container.classList.toggle('expanded');
      document.querySelector('.focus-overlay').style.display = 'none';
    });
    
    // Exit focus mode
    document.querySelector('.exit-focus-mode').addEventListener('click', () => {
      document.querySelector('.focus-overlay').style.display = 'none';
    });
    
    // Enter full focus mode from expanded state
    document.addEventListener('keydown', (e) => {
      if (e.key === 'f' && e.ctrlKey && this.state.isRunning) {
        const overlay = document.querySelector('.focus-overlay');
        overlay.style.display = overlay.style.display === 'flex' ? 'none' : 'flex';
      }
    });
    
    // Subject select
    document.querySelector('.subject-select').addEventListener('change', (e) => {
      this.settings.currentSubject = e.target.value;
    });
  }
  
  populateSubjectDropdown() {
    const select = document.querySelector('.subject-select');
    const subjects = new Set();
    
    // Collect subjects from the study table
    document.querySelectorAll('#study-table tbody tr td:nth-child(6)').forEach(cell => {
      const subject = cell.textContent.trim();
      if (subject && !subjects.has(subject)) {
        subjects.add(subject);
        const option = document.createElement('option');
        option.value = subject;
        option.textContent = subject;
        select.appendChild(option);
      }
    });
  }
  
  startTimer() {
    if (this.state.isRunning) return;
    
    this.state.isRunning = true;
    this.state.startTime = Date.now() - ((this.settings.focusDuration - this.state.timeRemaining) * 1000);
    
    // Play session start sound
    if (this.settings.soundEnabled && this.state.currentMode === 'focus') {
      document.getElementById('session-start').play();
    }
    
    // Update UI
    document.querySelector('.pomodoro-start-btn').disabled = true;
    document.querySelector('.pomodoro-pause-btn').disabled = false;
    
    // Change container border based on mode
    const container = document.querySelector('.pomodoro-container');
    container.classList.remove('focus-mode', 'short-break-mode', 'long-break-mode');
    container.classList.add(`${this.state.currentMode}-mode`);
    
    this.state.timerInterval = setInterval(() => this.updateTimer(), 1000);
  }
  
  pauseTimer() {
    if (!this.state.isRunning) return;
    
    clearInterval(this.state.timerInterval);
    this.state.isRunning = false;
    
    // Update UI
    document.querySelector('.pomodoro-start-btn').disabled = false;
    document.querySelector('.pomodoro-pause-btn').disabled = true;
  }
  
  resetTimer() {
    clearInterval(this.state.timerInterval);
    
    // Reset to focus mode time
    this.state.currentMode = 'focus';
    this.state.timeRemaining = this.settings.focusDuration;
    this.state.isRunning = false;
    
    // Update UI
    document.querySelector('.pomodoro-start-btn').disabled = false;
    document.querySelector('.pomodoro-pause-btn').disabled = true;
    document.querySelector('.timer-label').textContent = 'وقت التركيز';
    
    const container = document.querySelector('.pomodoro-container');
    container.classList.remove('focus-mode', 'short-break-mode', 'long-break-mode');
    container.classList.add('focus-mode');
    
    this.updateDisplay();
  }
  
  updateTimer() {
    const currentTime = Date.now();
    const elapsedSeconds = Math.floor((currentTime - this.state.startTime) / 1000);
    
    this.state.timeRemaining = Math.max(0, this.getCurrentModeDuration() - elapsedSeconds);
    
    this.updateDisplay();
    
    // Check if timer is complete
    if (this.state.timeRemaining <= 0) {
      this.handleTimerComplete();
    }
  }
  
  updateDisplay() {
    const minutes = Math.floor(this.state.timeRemaining / 60);
    const seconds = this.state.timeRemaining % 60;
    
    // Update main display
    const minutesDisplay = document.querySelector('.pomodoro-timer .minutes');
    const secondsDisplay = document.querySelector('.pomodoro-timer .seconds');
    
    minutesDisplay.textContent = String(minutes).padStart(2, '0');
    secondsDisplay.textContent = String(seconds).padStart(2, '0');
    
    // Update focus overlay display if visible
    const overlayMinutesDisplay = document.querySelector('.focus-overlay .minutes');
    const overlaySecondsDisplay = document.querySelector('.focus-overlay .seconds');
    
    if (overlayMinutesDisplay && overlaySecondsDisplay) {
      overlayMinutesDisplay.textContent = String(minutes).padStart(2, '0');
      overlaySecondsDisplay.textContent = String(seconds).padStart(2, '0');
    }
    
    // Update session counter
    document.querySelector('.session-count').textContent = this.state.sessionsCompleted;
    document.querySelector('.session-goal').textContent = this.settings.sessionsBeforeLongBreak;
    
    // Update document title
    document.title = `(${minutes}:${String(seconds).padStart(2, '0')}) جدول المذاكرة`;
  }
  
  getCurrentModeDuration() {
    switch (this.state.currentMode) {
      case 'focus':
        return this.settings.focusDuration;
      case 'shortBreak':
        return this.settings.shortBreakDuration;
      case 'longBreak':
        return this.settings.longBreakDuration;
      default:
        return this.settings.focusDuration;
    }
  }
  
  handleTimerComplete() {
    clearInterval(this.state.timerInterval);
    this.state.isRunning = false;
    
    // Play completion sound
    if (this.settings.soundEnabled) {
      document.getElementById('timer-complete').play();
    }
    
    // Update UI
    document.querySelector('.pomodoro-start-btn').disabled = false;
    document.querySelector('.pomodoro-pause-btn').disabled = true;
    
    // Record session if it was a focus session
    if (this.state.currentMode === 'focus') {
      this.recordSession();
      this.state.sessionsCompleted++;
      
      // Add XP for completing a focus session
      if (window.xpSystem) {
        window.xpSystem.addXP(15);
      }
    }
    
    // Determine next mode
    this.determineNextMode();
    
    // Auto-start next session if enabled
    if ((this.state.currentMode === 'shortBreak' || this.state.currentMode === 'longBreak') && this.settings.autoStartBreaks) {
      this.startTimer();
    } else if (this.state.currentMode === 'focus' && this.settings.autoStartPomodoros) {
      this.startTimer();
    }
    
    // Show notification
    this.showNotification();
  }
  
  determineNextMode() {
    if (this.state.currentMode === 'focus') {
      // After focus session, determine break type
      if (this.state.sessionsCompleted % this.settings.sessionsBeforeLongBreak === 0) {
        this.state.currentMode = 'longBreak';
        this.state.timeRemaining = this.settings.longBreakDuration;
        document.querySelector('.timer-label').textContent = 'استراحة طويلة';
      } else {
        this.state.currentMode = 'shortBreak';
        this.state.timeRemaining = this.settings.shortBreakDuration;
        document.querySelector('.timer-label').textContent = 'استراحة قصيرة';
      }
    } else {
      // After any break, go back to focus
      this.state.currentMode = 'focus';
      this.state.timeRemaining = this.settings.focusDuration;
      document.querySelector('.timer-label').textContent = 'وقت التركيز';
    }
    
    // Update container style
    const container = document.querySelector('.pomodoro-container');
    container.classList.remove('focus-mode', 'short-break-mode', 'long-break-mode');
    container.classList.add(`${this.state.currentMode}-mode`);
    
    this.updateDisplay();
  }
  
  recordSession() {
    // Only record if a subject is selected
    if (!this.settings.currentSubject) return;
    
    const sessionLog = {
      subject: this.settings.currentSubject,
      duration: this.settings.focusDuration / 60, // Convert to minutes
      timestamp: new Date().toISOString(),
      notes: ''
    };
    
    // Save to local storage
    const logs = JSON.parse(localStorage.getItem('pomodoroLogs') || '[]');
    logs.push(sessionLog);
    localStorage.setItem('pomodoroLogs', JSON.stringify(logs));
    
    // Add to visible log
    this.addLogEntry(sessionLog);
    
    // Track in achievement system if available
    if (window.achievementSystem) {
      window.achievementSystem.trackStudySession({
        subject: sessionLog.subject,
        duration: sessionLog.duration,
        period: 'بوموردو',
        date: new Date().toLocaleDateString('ar-EG')
      });
    }
  }
  
  addLogEntry(log) {
    const logsList = document.querySelector('.logs-list');
    const date = new Date(log.timestamp);
    const formattedTime = date.toLocaleTimeString('ar-EG');
    const formattedDate = date.toLocaleDateString('ar-EG');
    
    const logEntry = document.createElement('div');
    logEntry.className = 'log-entry';
    logEntry.innerHTML = `
      <div class="log-subject">${log.subject}</div>
      <div class="log-time">${formattedDate} - ${formattedTime}</div>
      <div class="log-duration">${log.duration} دقيقة</div>
    `;
    
    logsList.insertBefore(logEntry, logsList.firstChild);
  }
  
  showNotification() {
    // Only show if browser notifications are available
    if (!("Notification" in window)) return;
    
    let title, body;
    
    switch (this.state.currentMode) {
      case 'focus':
        title = 'حان وقت التركيز!';
        body = 'ابدأ جلسة تركيز جديدة الآن.';
        break;
      case 'shortBreak':
        title = 'استراحة قصيرة';
        body = 'خذ استراحة قصيرة لتجديد نشاطك.';
        break;
      case 'longBreak':
        title = 'استراحة طويلة';
        body = 'أحسنت! خذ استراحة طويلة الآن.';
        break;
    }
    
    if (Notification.permission === "granted") {
      new Notification(title, { body });
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          new Notification(title, { body });
        }
      });
    }
  }
}

// Initialize when the document is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  const pomodoroTimer = new PomodoroTimer();
  
  // Make it globally accessible
  window.pomodoroTimer = pomodoroTimer;
});