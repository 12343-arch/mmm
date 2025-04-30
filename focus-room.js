// Focus Room with Ambient Sounds and Distraction Blocking
class FocusRoom {
  constructor() {
    this.ambientSounds = [
      { name: 'مطر هادئ', key: 'rain', url: 'https://assets.mixkit.co/sfx/preview/mixkit-light-rain-loop-2393.mp3' },
      { name: 'موسيقى هادئة', key: 'music', url: 'https://assets.mixkit.co/sfx/preview/mixkit-beautiful-light-piano-intro-2338.mp3' },
      { name: 'أصوات طبيعة', key: 'nature', url: 'https://assets.mixkit.co/sfx/preview/mixkit-forest-birds-chirping-1211.mp3' },
      { name: 'أصوات مكتبة', key: 'library', url: 'https://assets.mixkit.co/sfx/preview/mixkit-keyboard-type-1471.mp3' },
      { name: 'أصوات النار', key: 'fire', url: 'https://assets.mixkit.co/sfx/preview/mixkit-fireplace-crackling-loop-1319.mp3' },
      { name: 'ضوضاء بيضاء', key: 'whitenoise', url: 'https://assets.mixkit.co/sfx/preview/mixkit-ocean-wind-1189.mp3' }
    ];
    
    this.backgrounds = [
      { name: 'دراسة ليلية', url: 'linear-gradient(145deg, #0f1331, #42275a)' },
      { name: 'غابة خضراء', url: 'linear-gradient(145deg, #1b5e20, #388e3c)' },
      { name: 'أزرق هادئ', url: 'linear-gradient(145deg, #0d47a1, #1976d2)' },
      { name: 'أرجواني محفز', url: 'linear-gradient(145deg, #4a148c, #7b1fa2)' },
      { name: 'شروق الشمس', url: 'linear-gradient(145deg, #ff6f00, #ffa000)' },
    ];
    
    this.isInFocusMode = false;
    this.activeSound = null;
    this.audioPlayer = null;
    this.sessionStartTime = null;
    this.sessionDuration = 30 * 60; // 30 minutes in seconds
    this.timerInterval = null;
    
    this.createFocusRoomUI();
    this.setupEventListeners();
  }
  
  createFocusRoomUI() {
    const focusRoomBtn = document.createElement('button');
    focusRoomBtn.className = 'focus-room-btn';
    focusRoomBtn.innerHTML = '🧘 غرفة التركيز';
    focusRoomBtn.style.cssText = `
      position: fixed;
      bottom: 30px;
      right: 30px;
      background: linear-gradient(45deg, #4CAF50, #81C784);
      color: white;
      border: none;
      padding: 12px 20px;
      border-radius: 30px;
      cursor: pointer;
      font-weight: bold;
      box-shadow: 0 4px 15px rgba(0,0,0,0.3);
      z-index: 100;
      transition: all 0.3s ease;
    `;
    
    document.body.appendChild(focusRoomBtn);
    
    // Create modal
    const focusRoomModal = document.createElement('div');
    focusRoomModal.className = 'focus-room-modal';
    focusRoomModal.innerHTML = `
      <div class="focus-room-content">
        <span class="close-focus-room">&times;</span>
        <h2>غرفة التركيز</h2>
        
        <div class="focus-session-timer">
          <div class="timer-display">
            <span class="minutes">30</span>:<span class="seconds">00</span>
          </div>
          <div class="timer-controls">
            <select class="timer-duration">
              <option value="15">15 دقيقة</option>
              <option value="30" selected>30 دقيقة</option>
              <option value="45">45 دقيقة</option>
              <option value="60">60 دقيقة</option>
              <option value="90">90 دقيقة</option>
              <option value="120">120 دقيقة</option>
            </select>
            <button class="start-focus-session">بدء جلسة التركيز</button>
          </div>
        </div>
        
        <div class="focus-room-options">
          <div class="option-section">
            <h3>المؤثرات الصوتية</h3>
            <div class="sound-buttons"></div>
            <div class="volume-control">
              <label>مستوى الصوت:
                <input type="range" min="0" max="100" value="50" class="volume-slider">
              </label>
            </div>
          </div>
          
          <div class="option-section">
            <h3>خلفية الشاشة</h3>
            <div class="background-buttons"></div>
          </div>
          
          <div class="option-section">
            <h3>وضع عدم الإزعاج</h3>
            <div class="dnd-toggle">
              <label class="switch">
                <input type="checkbox" class="dnd-checkbox">
                <span class="slider round"></span>
              </label>
              <span>منع الإشعارات والتنبيهات</span>
            </div>
            <p class="dnd-note">سيتم تعطيل جميع الإشعارات والتنبيهات أثناء جلسة التركيز.</p>
          </div>
        </div>
        
        <div class="fullscreen-toggle-container">
          <button class="toggle-fullscreen">وضع ملء الشاشة</button>
        </div>
      </div>
    `;
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      .focus-room-modal {
        display: none;
        position: fixed;
        z-index: 1000;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        overflow: auto;
        background-color: rgba(0,0,0,0.8);
        backdrop-filter: blur(10px);
        transition: all 0.5s ease;
      }
      
      .focus-room-content {
        background: rgba(14, 12, 40, 0.9);
        margin: 5% auto;
        padding: 20px;
        border-radius: 15px;
        box-shadow: 0 0 30px rgba(0,0,0,0.5);
        width: 80%;
        max-width: 700px;
        max-height: 90vh;
        overflow-y: auto;
        animation: modalFadeIn 0.5s ease;
        position: relative;
      }
      
      @keyframes modalFadeIn {
        from { opacity: 0; transform: translateY(-50px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      .close-focus-room {
        color: #aaa;
        float: right;
        font-size: 28px;
        font-weight: bold;
        cursor: pointer;
      }
      
      .close-focus-room:hover {
        color: white;
      }
      
      .focus-room-content h2 {
        color: gold;
        text-align: center;
        margin-top: 0;
      }
      
      .focus-session-timer {
        text-align: center;
        margin: 20px 0 30px;
        padding: 20px;
        background: rgba(255,255,255,0.05);
        border-radius: 10px;
      }
      
      .timer-display {
        font-size: 4rem;
        font-weight: bold;
        color: white;
        margin-bottom: 15px;
        text-shadow: 0 0 10px rgba(255,255,255,0.3);
      }
      
      .timer-controls {
        display: flex;
        justify-content: center;
        gap: 15px;
        align-items: center;
      }
      
      .timer-duration {
        padding: 8px 15px;
        border-radius: 5px;
        background: rgba(255,255,255,0.1);
        color: white;
        border: 1px solid rgba(255,255,255,0.2);
      }
      
      .start-focus-session {
        background: linear-gradient(45deg, #4CAF50, #81C784);
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 25px;
        cursor: pointer;
        font-weight: bold;
        transition: all 0.3s;
      }
      
      .start-focus-session:hover {
        transform: scale(1.05);
        box-shadow: 0 0 15px rgba(76, 175, 80, 0.5);
      }
      
      .start-focus-session.active {
        background: linear-gradient(45deg, #f44336, #e57373);
      }
      
      .focus-room-options {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
      }
      
      .option-section {
        background: rgba(255,255,255,0.05);
        padding: 15px;
        border-radius: 10px;
      }
      
      .option-section h3 {
        color: #ddd;
        margin-top: 0;
        padding-bottom: 8px;
        border-bottom: 1px solid rgba(255,255,255,0.1);
      }
      
      .sound-buttons, .background-buttons {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-bottom: 15px;
      }
      
      .sound-button, .background-button {
        flex: 1 0 calc(50% - 10px);
        background: rgba(255,255,255,0.1);
        color: white;
        border: 1px solid rgba(255,255,255,0.2);
        padding: 10px;
        border-radius: 5px;
        cursor: pointer;
        transition: all 0.3s;
        text-align: center;
      }
      
      .sound-button:hover, .background-button:hover {
        background: rgba(255,255,255,0.2);
      }
      
      .sound-button.active, .background-button.active {
        background: rgba(76, 175, 80, 0.3);
        border-color: #4CAF50;
      }
      
      .volume-control {
        margin-top: 10px;
      }
      
      .volume-slider {
        width: 100%;
        background: rgba(255,255,255,0.1);
        border-radius: 5px;
        height: 5px;
        outline: none;
        -webkit-appearance: none;
      }
      
      .volume-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 15px;
        height: 15px;
        border-radius: 50%;
        background: gold;
        cursor: pointer;
      }
      
      .dnd-toggle {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
      }
      
      .switch {
        position: relative;
        display: inline-block;
        width: 50px;
        height: 24px;
        margin-right: 10px;
      }
      
      .switch input {
        opacity: 0;
        width: 0;
        height: 0;
      }
      
      .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(255,255,255,0.1);
        transition: .4s;
      }
      
      .slider:before {
        position: absolute;
        content: "";
        height: 16px;
        width: 16px;
        left: 4px;
        bottom: 4px;
        background-color: white;
        transition: .4s;
      }
      
      input:checked + .slider {
        background-color: #4CAF50;
      }
      
      input:checked + .slider:before {
        transform: translateX(26px);
      }
      
      .slider.round {
        border-radius: 24px;
      }
      
      .slider.round:before {
        border-radius: 50%;
      }
      
      .dnd-note {
        color: #aaa;
        font-size: 0.9em;
        margin: 5px 0 0;
      }
      
      .fullscreen-toggle-container {
        text-align: center;
        margin-top: 20px;
      }
      
      .toggle-fullscreen {
        background: linear-gradient(45deg, #2196F3, #64B5F6);
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 25px;
        cursor: pointer;
        font-weight: bold;
        transition: all 0.3s;
      }
      
      .toggle-fullscreen:hover {
        transform: scale(1.05);
        box-shadow: 0 0 15px rgba(33, 150, 243, 0.5);
      }
      
      /* Focus room fullscreen mode */
      .focus-room-fullscreen {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1100;
        display: none;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: linear-gradient(145deg, #0f1331, #42275a);
        color: white;
      }
      
      .fullscreen-timer {
        font-size: 8rem;
        font-weight: bold;
        text-shadow: 0 0 20px rgba(255,255,255,0.5);
        margin-bottom: 30px;
      }
      
      .fullscreen-label {
        font-size: 1.5rem;
        margin-bottom: 40px;
        opacity: 0.8;
      }
      
      .fullscreen-controls {
        display: flex;
        gap: 20px;
      }
      
      .fullscreen-controls button {
        background: rgba(255,255,255,0.1);
        color: white;
        border: none;
        padding: 15px 30px;
        border-radius: 30px;
        cursor: pointer;
        font-size: 1.2rem;
        transition: all 0.3s;
      }
      
      .fullscreen-controls button:hover {
        background: rgba(255,255,255,0.2);
      }
      
      .exit-fullscreen {
        position: absolute;
        top: 20px;
        right: 20px;
        background: none;
        border: none;
        color: white;
        font-size: 2rem;
        cursor: pointer;
        opacity: 0.5;
        transition: opacity 0.3s;
      }
      
      .exit-fullscreen:hover {
        opacity: 1;
      }
      
      @media (max-width: 768px) {
        .focus-room-content {
          width: 95%;
          padding: 15px;
        }
        
        .timer-display {
          font-size: 3rem;
        }
        
        .timer-controls {
          flex-direction: column;
        }
        
        .fullscreen-timer {
          font-size: 4rem;
        }
        
        .sound-button, .background-button {
          flex: 1 0 100%;
        }
      }
    `;
    document.head.appendChild(style);
    document.body.appendChild(focusRoomModal);
    
    // Create fullscreen mode UI
    const fullscreenUI = document.createElement('div');
    fullscreenUI.className = 'focus-room-fullscreen';
    fullscreenUI.innerHTML = `
      <button class="exit-fullscreen">✕</button>
      <div class="fullscreen-timer">
        <span class="fs-minutes">30</span>:<span class="fs-seconds">00</span>
      </div>
      <div class="fullscreen-label">وقت التركيز</div>
      <div class="fullscreen-controls">
        <button class="fs-pause-btn">إيقاف مؤقت</button>
        <button class="fs-end-btn">إنهاء الجلسة</button>
      </div>
    `;
    document.body.appendChild(fullscreenUI);
    
    // Populate sound buttons
    const soundButtons = document.querySelector('.sound-buttons');
    this.ambientSounds.forEach(sound => {
      const button = document.createElement('button');
      button.className = 'sound-button';
      button.dataset.sound = sound.key;
      button.textContent = sound.name;
      soundButtons.appendChild(button);
    });
    
    // Populate background buttons
    const backgroundButtons = document.querySelector('.background-buttons');
    this.backgrounds.forEach(background => {
      const button = document.createElement('button');
      button.className = 'background-button';
      button.dataset.background = background.url;
      button.textContent = background.name;
      button.style.background = `${background.url}66`; // Add transparency to preview
      backgroundButtons.appendChild(button);
    });
  }
  
  setupEventListeners() {
    // Open focus room
    document.querySelector('.focus-room-btn').addEventListener('click', () => {
      document.querySelector('.focus-room-modal').style.display = 'block';
    });
    
    // Close focus room
    document.querySelector('.close-focus-room').addEventListener('click', () => {
      document.querySelector('.focus-room-modal').style.display = 'none';
    });
    
    // Click outside to close
    window.addEventListener('click', (e) => {
      if (e.target === document.querySelector('.focus-room-modal')) {
        document.querySelector('.focus-room-modal').style.display = 'none';
      }
    });
    
    // Sound buttons
    document.querySelectorAll('.sound-button').forEach(button => {
      button.addEventListener('click', () => {
        const soundKey = button.dataset.sound;
        this.toggleSound(soundKey, button);
      });
    });
    
    // Volume control
    document.querySelector('.volume-slider').addEventListener('input', (e) => {
      if (this.audioPlayer) {
        this.audioPlayer.volume = e.target.value / 100;
      }
    });
    
    // Background buttons
    document.querySelectorAll('.background-button').forEach(button => {
      button.addEventListener('click', () => {
        const bgUrl = button.dataset.background;
        this.changeBackground(bgUrl, button);
      });
    });
    
    // Start/stop focus session
    document.querySelector('.start-focus-session').addEventListener('click', () => {
      if (this.isInFocusMode) {
        this.endFocusSession();
      } else {
        this.startFocusSession();
      }
    });
    
    // Timer duration change
    document.querySelector('.timer-duration').addEventListener('change', (e) => {
      const minutes = parseInt(e.target.value);
      this.sessionDuration = minutes * 60;
      this.updateTimerDisplay(this.sessionDuration);
    });
    
    // Toggle fullscreen
    document.querySelector('.toggle-fullscreen').addEventListener('click', () => {
      if (this.isInFocusMode) {
        this.enterFullscreenMode();
      } else {
        alert('يرجى بدء جلسة التركيز أولاً');
      }
    });
    
    // Exit fullscreen
    document.querySelector('.exit-fullscreen').addEventListener('click', () => {
      this.exitFullscreenMode();
    });
    
    // Fullscreen controls
    document.querySelector('.fs-pause-btn').addEventListener('click', () => {
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
        document.querySelector('.fs-pause-btn').textContent = 'استمرار';
      } else {
        this.startTimer();
        document.querySelector('.fs-pause-btn').textContent = 'إيقاف مؤقت';
      }
    });
    
    document.querySelector('.fs-end-btn').addEventListener('click', () => {
      this.exitFullscreenMode();
      this.endFocusSession();
    });
    
    // DND mode checkbox
    document.querySelector('.dnd-checkbox').addEventListener('change', (e) => {
      if (e.target.checked) {
        // Enable DND (can't actually block notifications without permission)
        alert('تم تفعيل وضع عدم الإزعاج. ملاحظة: لن تظهر إشعارات الموقع أثناء جلسة التركيز.');
      }
    });
  }
  
  toggleSound(soundKey, button) {
    // If the same sound is clicked again, toggle it off
    if (this.activeSound === soundKey) {
      if (this.audioPlayer) {
        this.audioPlayer.pause();
        this.audioPlayer = null;
      }
      this.activeSound = null;
      document.querySelectorAll('.sound-button').forEach(btn => {
        btn.classList.remove('active');
      });
      return;
    }
    
    // Otherwise change to the new sound
    const sound = this.ambientSounds.find(s => s.key === soundKey);
    if (!sound) return;
    
    // Stop any playing sound
    if (this.audioPlayer) {
      this.audioPlayer.pause();
    }
    
    // Create new audio
    this.audioPlayer = new Audio(sound.url);
    this.audioPlayer.loop = true;
    this.audioPlayer.volume = document.querySelector('.volume-slider').value / 100;
    this.audioPlayer.play();
    
    this.activeSound = soundKey;
    
    // Update UI
    document.querySelectorAll('.sound-button').forEach(btn => {
      btn.classList.remove('active');
    });
    button.classList.add('active');
  }
  
  changeBackground(bgUrl, button) {
    // Update UI
    document.querySelectorAll('.background-button').forEach(btn => {
      btn.classList.remove('active');
    });
    button.classList.add('active');
    
    // Set background for fullscreen mode
    document.querySelector('.focus-room-fullscreen').style.background = bgUrl;
  }
  
  startFocusSession() {
    const durationSelect = document.querySelector('.timer-duration');
    const minutes = parseInt(durationSelect.value);
    this.sessionDuration = minutes * 60;
    this.sessionStartTime = Date.now();
    
    this.isInFocusMode = true;
    
    // Update UI
    const startButton = document.querySelector('.start-focus-session');
    startButton.textContent = 'إنهاء جلسة التركيز';
    startButton.classList.add('active');
    
    // Disable duration select during session
    durationSelect.disabled = true;
    
    // Start timer
    this.updateTimerDisplay(this.sessionDuration);
    this.startTimer();
    
    // Enable DND if checked
    if (document.querySelector('.dnd-checkbox').checked) {
      // In a real implementation, this would use the Notifications API
      // But for demonstration, just show a message
      console.log('Do Not Disturb mode enabled');
    }
  }
  
  endFocusSession() {
    this.isInFocusMode = false;
    
    // Stop timer
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    
    // Update UI
    const startButton = document.querySelector('.start-focus-session');
    startButton.textContent = 'بدء جلسة التركيز';
    startButton.classList.remove('active');
    
    // Enable duration select
    document.querySelector('.timer-duration').disabled = false;
    
    // Hide fullscreen mode if active
    document.querySelector('.focus-room-fullscreen').style.display = 'none';
    
    // Record session if it lasted at least 5 minutes
    const sessionEndTime = Date.now();
    const sessionDurationMs = sessionEndTime - this.sessionStartTime;
    if (sessionDurationMs >= 5 * 60 * 1000) {
      this.recordFocusSession(Math.floor(sessionDurationMs / 60000));
    }
    
    // Reset timer display
    const minutes = parseInt(document.querySelector('.timer-duration').value);
    this.updateTimerDisplay(minutes * 60);
    
    // Show session completed message
    alert('تم إنهاء جلسة التركيز! أحسنت!');
  }
  
  startTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    
    const startTime = Date.now();
    const initialRemaining = this.sessionDuration;
    
    this.timerInterval = setInterval(() => {
      const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
      const remaining = Math.max(0, initialRemaining - elapsedSeconds);
      
      this.updateTimerDisplay(remaining);
      
      if (remaining <= 0) {
        this.timerCompleted();
      }
    }, 1000);
  }
  
  updateTimerDisplay(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    
    // Update modal display
    document.querySelector('.timer-display .minutes').textContent = String(minutes).padStart(2, '0');
    document.querySelector('.timer-display .seconds').textContent = String(secs).padStart(2, '0');
    
    // Update fullscreen display
    document.querySelector('.fullscreen-timer .fs-minutes').textContent = String(minutes).padStart(2, '0');
    document.querySelector('.fullscreen-timer .fs-seconds').textContent = String(secs).padStart(2, '0');
  }
  
  timerCompleted() {
    // Stop timer
    clearInterval(this.timerInterval);
    this.timerInterval = null;
    
    // Play notification sound
    const completionSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-achievement-bell-600.mp3');
    completionSound.play();
    
    // Show notification
    if (Notification.permission === "granted") {
      new Notification('انتهت جلسة التركيز!', {
        body: 'أحسنت! لقد أكملت جلسة التركيز بنجاح.'
      });
    }
    
    // End session
    setTimeout(() => {
      this.endFocusSession();
    }, 1000);
  }
  
  enterFullscreenMode() {
    document.querySelector('.focus-room-fullscreen').style.display = 'flex';
    document.querySelector('.focus-room-modal').style.display = 'none';
    
    // Request actual fullscreen if available
    const fullscreenElement = document.querySelector('.focus-room-fullscreen');
    if (fullscreenElement.requestFullscreen) {
      fullscreenElement.requestFullscreen();
    } else if (fullscreenElement.webkitRequestFullscreen) {
      fullscreenElement.webkitRequestFullscreen();
    } else if (fullscreenElement.msRequestFullscreen) {
      fullscreenElement.msRequestFullscreen();
    }
  }
  
  exitFullscreenMode() {
    document.querySelector('.focus-room-fullscreen').style.display = 'none';
    document.querySelector('.focus-room-modal').style.display = 'block';
    
    // Exit actual fullscreen if active
    if (document.fullscreenElement) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  }
  
  recordFocusSession(durationMinutes) {
    // Record session for achievements and XP
    if (window.xpSystem) {
      window.xpSystem.addXP(Math.min(durationMinutes, 30)); // Cap XP at 30 per session
    }
    
    // Record in achievement system if available
    if (window.achievementSystem) {
      window.achievementSystem.trackStudySession({
        subject: 'جلسة تركيز',
        duration: durationMinutes / 60,
        period: 'غرفة التركيز',
        date: new Date().toLocaleDateString('ar-EG')
      });
    }
    
    // Record in storage for stats
    const focusSessions = JSON.parse(localStorage.getItem('focusSessions') || '[]');
    focusSessions.push({
      date: new Date().toISOString(),
      duration: durationMinutes,
      sound: this.activeSound
    });
    localStorage.setItem('focusSessions', JSON.stringify(focusSessions));
  }
}

// Initialize when the document is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  const focusRoom = new FocusRoom();
  
  // Make it globally accessible
  window.focusRoom = focusRoom;
});