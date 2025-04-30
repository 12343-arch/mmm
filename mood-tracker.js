// Mood Tracking System Implementation
class MoodTrackingSystem {
  constructor() {
    this.moods = [
      { name: 'سعيد', icon: '😊', color: '#4CAF50', suggestions: {
        video: 'https://www.youtube.com/watch?v=ZXsQAXx_ao0',
        article: 'https://www.arageek.com/2018/12/15/full-confidence-tips.html',
        task: 'استغل طاقتك الإيجابية في مذاكرة مادة صعبة.'
      }},
      { name: 'متحمس', icon: '🔥', color: '#FF9800', suggestions: {
        video: 'https://www.youtube.com/watch?v=B18p5GFER0A',
        article: 'https://gamefli.com/ar/articles/study-motivation-techniques',
        task: 'اكتب قائمة بأهدافك واستغل حماسك.'
      }},
      { name: 'هادئ', icon: '😌', color: '#2196F3', suggestions: {
        video: 'https://www.youtube.com/watch?v=6vuetQSwFW8',
        article: 'https://www.nefsy.com/blog/study-focus/',
        task: 'جلسة مذاكرة طويلة مع استراحات منتظمة.'
      }},
      { name: 'قلق', icon: '😰', color: '#9C27B0', suggestions: {
        video: 'https://www.youtube.com/watch?v=wwDKGP9zaJ4',
        article: 'https://www.supermama.me/posts/كيف-تتخلص-من-قلق-الامتحانات',
        task: 'خذ نفسًا عميقًا وابدأ بمهمة سهلة لاستعادة الثقة.'
      }},
      { name: 'محبط', icon: '😔', color: '#F44336', suggestions: {
        video: 'https://www.youtube.com/watch?v=TFbv757kup4',
        article: 'https://www.alittihad.ae/opinion/صناعة-الأمل-في-مواجهة-الإحباط',
        task: 'اكتب أفكارك السلبية ثم اكتب الرد الإيجابي عليها.'
      }},
      { name: 'مشتت', icon: '🤯', color: '#FF5722', suggestions: {
        video: 'https://www.youtube.com/watch?v=Qwe6qXFTdgc',
        article: 'https://www.arageek.com/2022/12/07/ways-to-concentrate-when-studying',
        task: 'استخدم تقنية بوموردو: 25 دقيقة تركيز ثم 5 دقائق راحة.'
      }},
      { name: 'متعب', icon: '😴', color: '#795548', suggestions: {
        video: 'https://www.youtube.com/watch?v=3QiQwrlFY-I',
        article: 'https://www.aljazeera.net/news/healthmedicine/2022/6/3/10-أشياء-احرص-على-عملها-ليبقى',
        task: 'خذ قيلولة قصيرة 20 دقيقة ثم ابدأ بمهمة خفيفة.'
      }}
    ];
    
    this.currentMood = null;
    this.moodHistory = this.loadMoodHistory();
    
    this.createMoodTrackerUI();
    this.checkDailyMoodPrompt();
  }
  
  loadMoodHistory() {
    return JSON.parse(localStorage.getItem('moodHistory') || '[]');
  }
  
  saveMoodHistory() {
    localStorage.setItem('moodHistory', JSON.stringify(this.moodHistory));
  }
  
  createMoodTrackerUI() {
    const moodContainer = document.createElement('div');
    moodContainer.className = 'mood-tracker-container';
    moodContainer.innerHTML = `
      <div class="mood-tracker-widget">
        <div class="mood-header">
          <h3>متابعة الحالة النفسية</h3>
          <button class="toggle-mood-details">📊</button>
        </div>
        <div class="current-mood">
          <div class="mood-question">كيف تشعر اليوم؟</div>
          <div class="mood-options"></div>
        </div>
        <div class="mood-suggestion" style="display: none;">
          <div class="suggestion-header"></div>
          <div class="suggestion-content">
            <div class="suggestion-item">
              <h4>فيديو تحفيزي</h4>
              <a href="#" target="_blank" class="suggestion-video">مشاهدة الفيديو</a>
            </div>
            <div class="suggestion-item">
              <h4>مقال مفيد</h4>
              <a href="#" target="_blank" class="suggestion-article">قراءة المقال</a>
            </div>
            <div class="suggestion-item">
              <h4>نشاط مقترح</h4>
              <p class="suggestion-task"></p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="mood-details" style="display: none;">
        <h3>سجل حالتك النفسية</h3>
        <div class="mood-chart-container">
          <canvas id="mood-chart"></canvas>
        </div>
        <div class="mood-history-container">
          <h4>السجل اليومي</h4>
          <div class="mood-history-list"></div>
        </div>
        <div class="mood-insights">
          <h4>تحليل الحالة النفسية</h4>
          <div class="insight-content"></div>
        </div>
      </div>
    `;
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      .mood-tracker-container {
        background: rgba(14, 12, 40, 0.6);
        backdrop-filter: blur(8px);
        border-radius: 15px;
        padding: 15px;
        margin: 20px auto;
        max-width: 550px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        border: 1px solid rgba(255,255,255,0.1);
        position: relative;
        color: white;
      }
      
      .mood-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
      }
      
      .mood-header h3 {
        color: gold;
        margin: 0;
      }
      
      .toggle-mood-details {
        background: none;
        border: none;
        font-size: 1.2rem;
        cursor: pointer;
        color: white;
        opacity: 0.7;
        transition: opacity 0.3s;
      }
      
      .toggle-mood-details:hover {
        opacity: 1;
      }
      
      .mood-question {
        text-align: center;
        font-size: 1.2rem;
        margin-bottom: 15px;
      }
      
      .mood-options {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        gap: 10px;
        margin-bottom: 15px;
      }
      
      .mood-option {
        display: flex;
        flex-direction: column;
        align-items: center;
        background: rgba(255,255,255,0.1);
        border-radius: 10px;
        padding: 10px;
        cursor: pointer;
        transition: all 0.3s;
        width: 70px;
      }
      
      .mood-option:hover {
        transform: translateY(-5px);
        background: rgba(255,255,255,0.2);
      }
      
      .mood-option.selected {
        box-shadow: 0 0 15px rgba(255,255,255,0.3);
        background: rgba(255,255,255,0.25);
      }
      
      .mood-icon {
        font-size: 2rem;
        margin-bottom: 5px;
      }
      
      .mood-name {
        font-size: 0.9rem;
        text-align: center;
      }
      
      .mood-suggestion {
        background: rgba(255,255,255,0.05);
        border-radius: 10px;
        padding: 15px;
        margin-top: 15px;
        animation: fade-in 0.5s ease;
      }
      
      .suggestion-header {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 15px;
      }
      
      .suggestion-header .mood-icon {
        font-size: 2.5rem;
      }
      
      .suggestion-title {
        font-size: 1.2rem;
        color: white;
      }
      
      .suggestion-content {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 15px;
      }
      
      .suggestion-item {
        background: rgba(255,255,255,0.05);
        padding: 10px;
        border-radius: 5px;
      }
      
      .suggestion-item h4 {
        color: gold;
        margin-top: 0;
        margin-bottom: 10px;
      }
      
      .suggestion-item a {
        color: #90CAF9;
        text-decoration: none;
        display: inline-block;
        margin-top: 5px;
      }
      
      .suggestion-item a:hover {
        text-decoration: underline;
      }
      
      .suggestion-task {
        margin: 0;
        color: #eee;
      }
      
      .mood-details {
        margin-top: 15px;
        animation: fade-in 0.5s ease;
      }
      
      .mood-details h3 {
        color: gold;
        text-align: center;
      }
      
      .mood-chart-container {
        margin: 20px 0;
        height: 250px;
      }
      
      .mood-history-container {
        margin-bottom: 20px;
      }
      
      .mood-history-container h4 {
        color: #ddd;
        border-bottom: 1px solid rgba(255,255,255,0.1);
        padding-bottom: 5px;
      }
      
      .mood-history-list {
        max-height: 200px;
        overflow-y: auto;
      }
      
      .mood-history-item {
        display: flex;
        align-items: center;
        padding: 8px;
        border-bottom: 1px solid rgba(255,255,255,0.05);
      }
      
      .history-date {
        min-width: 100px;
        color: #ccc;
      }
      
      .history-mood {
        display: flex;
        align-items: center;
        gap: 5px;
      }
      
      .history-icon {
        font-size: 1.2rem;
      }
      
      .history-name {
        color: white;
      }
      
      .mood-insights h4 {
        color: #ddd;
        border-bottom: 1px solid rgba(255,255,255,0.1);
        padding-bottom: 5px;
      }
      
      .insight-content {
        background: rgba(255,255,255,0.05);
        padding: 10px;
        border-radius: 5px;
      }
      
      .insight-item {
        margin-bottom: 10px;
      }
      
      .insight-item strong {
        color: gold;
      }
      
      @keyframes fade-in {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      @media (max-width: 768px) {
        .mood-tracker-container {
          max-width: 90%;
        }
        
        .suggestion-content {
          grid-template-columns: 1fr;
        }
      }
    `;
    document.head.appendChild(style);
    
    // Inject the mood tracker into the page
    const pomodoroContainer = document.querySelector('.pomodoro-container');
    if (pomodoroContainer) {
      pomodoroContainer.after(moodContainer);
    } else {
      document.querySelector('.container').prepend(moodContainer);
    }
    
    // Populate mood options
    const moodOptionsContainer = document.querySelector('.mood-options');
    this.moods.forEach(mood => {
      const moodOption = document.createElement('div');
      moodOption.className = 'mood-option';
      moodOption.dataset.mood = mood.name;
      moodOption.innerHTML = `
        <div class="mood-icon">${mood.icon}</div>
        <div class="mood-name">${mood.name}</div>
      `;
      moodOption.addEventListener('click', () => this.selectMood(mood));
      moodOptionsContainer.appendChild(moodOption);
    });
    
    // Setup toggle details button
    document.querySelector('.toggle-mood-details').addEventListener('click', () => {
      const detailsPanel = document.querySelector('.mood-details');
      if (detailsPanel.style.display === 'none') {
        detailsPanel.style.display = 'block';
        this.initMoodChart();
        this.displayMoodHistory();
        this.generateInsights();
      } else {
        detailsPanel.style.display = 'none';
      }
    });
  }
  
  selectMood(mood) {
    this.currentMood = mood;
    
    // Update UI
    document.querySelectorAll('.mood-option').forEach(option => {
      option.classList.remove('selected');
      if (option.dataset.mood === mood.name) {
        option.classList.add('selected');
      }
    });
    
    // Record mood
    const today = new Date().toISOString().split('T')[0];
    
    // Check if we already have a mood for today
    const existingIndex = this.moodHistory.findIndex(entry => entry.date === today);
    if (existingIndex !== -1) {
      this.moodHistory[existingIndex].mood = mood.name;
    } else {
      this.moodHistory.push({
        date: today,
        mood: mood.name,
        timestamp: new Date().toISOString()
      });
    }
    
    this.saveMoodHistory();
    
    // Show suggestions
    this.showSuggestions(mood);
    
    // Update chart and insights if visible
    if (document.querySelector('.mood-details').style.display !== 'none') {
      this.initMoodChart();
      this.displayMoodHistory();
      this.generateInsights();
    }
  }
  
  showSuggestions(mood) {
    const suggestionPanel = document.querySelector('.mood-suggestion');
    suggestionPanel.style.display = 'block';
    
    document.querySelector('.suggestion-header').innerHTML = `
      <div class="mood-icon">${mood.icon}</div>
      <div class="suggestion-title">اقتراحات لحالة "${mood.name}"</div>
    `;
    
    document.querySelector('.suggestion-video').href = mood.suggestions.video;
    document.querySelector('.suggestion-article').href = mood.suggestions.article;
    document.querySelector('.suggestion-task').textContent = mood.suggestions.task;
    
    // Add style with mood color
    const style = document.querySelector('#mood-style') || document.createElement('style');
    style.id = 'mood-style';
    style.textContent = `
      .mood-option[data-mood="${mood.name}"] {
        border: 2px solid ${mood.color};
      }
      .mood-option.selected[data-mood="${mood.name}"] {
        background: ${mood.color}50;
      }
    `;
    document.head.appendChild(style);
  }
  
  checkDailyMoodPrompt() {
    const today = new Date().toISOString().split('T')[0];
    const hasTodayMood = this.moodHistory.some(entry => entry.date === today);
    
    if (!hasTodayMood) {
      // Show prompt immediately on first page load
      this.showDailyMoodPrompt();
    }
  }
  
  showDailyMoodPrompt() {
    // Make sure the mood container is visible
    document.querySelector('.mood-tracker-container').style.display = 'block';
    
    // Highlight the mood question
    const moodQuestion = document.querySelector('.mood-question');
    moodQuestion.style.animation = 'pulse 2s infinite';
    moodQuestion.textContent = 'كيف تشعر اليوم؟ 👋 حدد حالتك النفسية!';
    
    // Add pulse animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
      }
    `;
    document.head.appendChild(style);
    
    // Reset animation after selection
    document.querySelectorAll('.mood-option').forEach(option => {
      option.addEventListener('click', () => {
        moodQuestion.style.animation = 'none';
        moodQuestion.textContent = 'كيف تشعر اليوم؟';
      }, { once: true });
    });
  }
  
  initMoodChart() {
    // Only proceed if Chart.js is available
    if (typeof Chart === 'undefined') {
      // Load Chart.js dynamically
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
      script.onload = () => this.renderMoodChart();
      document.head.appendChild(script);
    } else {
      this.renderMoodChart();
    }
  }
  
  renderMoodChart() {
    if (typeof Chart === 'undefined') return;
    
    const ctx = document.getElementById('mood-chart');
    
    // Destroy existing chart if any
    if (window.moodChart) {
      window.moodChart.destroy();
    }
    
    // Get last 7 days of mood data
    const lastSevenDays = this.getLast7DaysMoodData();
    
    // Create chart
    window.moodChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: lastSevenDays.dates,
        datasets: [{
          label: 'الحالة النفسية',
          data: lastSevenDays.values,
          borderColor: 'gold',
          backgroundColor: 'rgba(255, 215, 0, 0.1)',
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            max: 6,
            ticks: {
              callback: function(value) {
                const moodLabels = ['محبط', 'قلق', 'متعب', 'مشتت', 'هادئ', 'سعيد', 'متحمس'];
                return moodLabels[value] || '';
              },
              color: '#ddd'
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            }
          },
          x: {
            ticks: {
              color: '#ddd'
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            }
          }
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const moodLabels = ['محبط', 'قلق', 'متعب', 'مشتت', 'هادئ', 'سعيد', 'متحمس'];
                const value = context.parsed.y;
                return moodLabels[value] || '';
              }
            }
          }
        }
      }
    });
  }
  
  getLast7DaysMoodData() {
    const dates = [];
    const values = [];
    const moodValues = {
      'محبط': 0,
      'قلق': 1,
      'متعب': 2,
      'هادئ': 3,
      'سعيد': 4,
      'متحمس': 5
    };
    
    // Generate the last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      dates.push(date.toLocaleDateString('ar-EG', { weekday: 'short' }));
      
      // Find mood for this date
      const moodEntry = this.moodHistory.find(entry => entry.date === dateStr);
      if (moodEntry && moodEntry.mood in moodValues) {
        values.push(moodValues[moodEntry.mood]);
      } else {
        values.push(null); // No mood recorded
      }
    }
    
    return { dates, values };
  }
  
  displayMoodHistory() {
    const historyList = document.querySelector('.mood-history-list');
    historyList.innerHTML = '';
    
    // Sort by date, newest first
    const sortedHistory = [...this.moodHistory].sort((a, b) => 
      new Date(b.date) - new Date(a.date)
    );
    
    if (sortedHistory.length === 0) {
      historyList.innerHTML = '<div class="no-data">لم يتم تسجيل أي حالة مزاجية بعد</div>';
      return;
    }
    
    sortedHistory.forEach(entry => {
      const mood = this.moods.find(m => m.name === entry.mood);
      if (!mood) return;
      
      const date = new Date(entry.date);
      const formattedDate = date.toLocaleDateString('ar-EG', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      
      const historyItem = document.createElement('div');
      historyItem.className = 'mood-history-item';
      historyItem.innerHTML = `
        <div class="history-date">${formattedDate}</div>
        <div class="history-mood">
          <span class="history-icon">${mood.icon}</span>
          <span class="history-name">${mood.name}</span>
        </div>
      `;
      
      historyList.appendChild(historyItem);
    });
  }
  
  generateInsights() {
    const insightContent = document.querySelector('.insight-content');
    insightContent.innerHTML = '';
    
    if (this.moodHistory.length < 3) {
      insightContent.innerHTML = '<p>سجّل حالتك النفسية لعدة أيام للحصول على تحليل مفصل.</p>';
      return;
    }
    
    // Count mood frequencies
    const moodCounts = {};
    this.moodHistory.forEach(entry => {
      moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
    });
    
    // Find most frequent mood
    let mostFrequentMood = '';
    let maxCount = 0;
    
    Object.entries(moodCounts).forEach(([mood, count]) => {
      if (count > maxCount) {
        mostFrequentMood = mood;
        maxCount = count;
      }
    });
    
    // Get mood streaks
    const currentStreak = this.getCurrentMoodStreak();
    
    // Generate insights
    const insights = [];
    
    if (mostFrequentMood) {
      const mood = this.moods.find(m => m.name === mostFrequentMood);
      insights.push(`<div class="insight-item">
        <strong>المزاج الغالب:</strong> ${mood.icon} ${mostFrequentMood} (${maxCount} أيام)
      </div>`);
    }
    
    if (currentStreak.mood && currentStreak.count > 1) {
      const mood = this.moods.find(m => m.name === currentStreak.mood);
      insights.push(`<div class="insight-item">
        <strong>الحالة المتكررة:</strong> ${mood.icon} ${currentStreak.mood} لمدة ${currentStreak.count} أيام متتالية
      </div>`);
      
      if (currentStreak.mood === 'محبط' || currentStreak.mood === 'قلق') {
        insights.push(`<div class="insight-item">
          <strong>نصيحة:</strong> 
          أنت تشعر بالـ ${currentStreak.mood} لعدة أيام. تحدث مع شخص تثق به أو جرب تغيير روتينك اليومي.
        </div>`);
      }
    }
    
    // Add mood patterns
    if (this.moodHistory.length >= 5) {
      const moodPattern = this.detectMoodPatterns();
      if (moodPattern) {
        insights.push(`<div class="insight-item">
          <strong>نمط ملحوظ:</strong> ${moodPattern}
        </div>`);
      }
    }
    
    // Add motivational message based on recent mood
    const recentMood = this.getRecentMood();
    if (recentMood) {
      let message = '';
      switch (recentMood) {
        case 'سعيد':
        case 'متحمس':
          message = 'استغل طاقتك الإيجابية لتحقيق تقدم في دراستك!';
          break;
        case 'هادئ':
          message = 'حالتك المتوازنة مثالية للتركيز على المهام الصعبة.';
          break;
        case 'متعب':
          message = 'خذ قسطاً من الراحة، ثم قسم مهامك إلى أجزاء صغيرة.';
          break;
        case 'قلق':
        case 'محبط':
        case 'مشتت':
          message = 'ركز على التنفس العميق وابدأ بخطوات صغيرة. كل تقدم مهم!';
          break;
      }
      
      insights.push(`<div class="insight-item">
        <strong>نصيحة اليوم:</strong> ${message}
      </div>`);
    }
    
    // Display insights
    if (insights.length > 0) {
      insightContent.innerHTML = insights.join('');
    } else {
      insightContent.innerHTML = '<p>سجّل المزيد من الحالات النفسية للحصول على تحليل أفضل.</p>';
    }
  }
  
  getCurrentMoodStreak() {
    if (this.moodHistory.length === 0) {
      return { mood: null, count: 0 };
    }
    
    // Sort by date, newest first
    const sortedHistory = [...this.moodHistory].sort((a, b) => 
      new Date(b.date) - new Date(a.date)
    );
    
    const recentMood = sortedHistory[0].mood;
    let streak = 1;
    
    for (let i = 1; i < sortedHistory.length; i++) {
      if (sortedHistory[i].mood === recentMood) {
        streak++;
      } else {
        break;
      }
    }
    
    return { mood: recentMood, count: streak };
  }
  
  detectMoodPatterns() {
    // Sort by date, oldest first
    const sortedHistory = [...this.moodHistory].sort((a, b) => 
      new Date(a.date) - new Date(b.date)
    );
    
    // Check for alternating positive/negative patterns
    let alternatingCount = 0;
    const positiveModds = ['سعيد', 'متحمس', 'هادئ'];
    const negativeModds = ['محبط', 'قلق', 'متعب', 'مشتت'];
    
    for (let i = 1; i < sortedHistory.length; i++) {
      const prevIsPositive = positiveModds.includes(sortedHistory[i-1].mood);
      const currentIsPositive = positiveModds.includes(sortedHistory[i].mood);
      
      if (prevIsPositive !== currentIsPositive) {
        alternatingCount++;
      }
    }
    
    if (alternatingCount >= sortedHistory.length * 0.6) {
      return 'تتغير حالتك النفسية بشكل متكرر بين الإيجابية والسلبية.';
    }
    
    // Check for consistent improvement
    let improvementCount = 0;
    const moodValues = {
      'محبط': 0,
      'قلق': 1,
      'متعب': 2,
      'مشتت': 3,
      'هادئ': 4,
      'سعيد': 5,
      'متحمس': 6
    };
    
    for (let i = 1; i < sortedHistory.length; i++) {
      const prevValue = moodValues[sortedHistory[i-1].mood] || 0;
      const currentValue = moodValues[sortedHistory[i].mood] || 0;
      
      if (currentValue > prevValue) {
        improvementCount++;
      }
    }
    
    if (improvementCount >= sortedHistory.length * 0.7) {
      return 'يوجد تحسن ملحوظ في حالتك النفسية مع مرور الوقت!';
    }
    
    return null;
  }
  
  getRecentMood() {
    if (this.moodHistory.length === 0) return null;
    
    // Sort by date, newest first
    const sortedHistory = [...this.moodHistory].sort((a, b) => 
      new Date(b.date) - new Date(a.date)
    );
    
    return sortedHistory[0].mood;
  }
}

// Initialize when the document is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  const moodTracker = new MoodTrackingSystem();
  
  // Make it globally accessible
  window.moodTracker = moodTracker;
});