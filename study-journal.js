// Study Journal and Reflection System
class StudyJournal {
  constructor() {
    this.entries = this.loadEntries();
    this.createJournalUI();
    this.setupEventListeners();
    this.checkWeeklyReflectionPrompt();
  }
  
  loadEntries() {
    return JSON.parse(localStorage.getItem('studyJournalEntries') || '[]');
  }
  
  saveEntries() {
    localStorage.setItem('studyJournalEntries', JSON.stringify(this.entries));
  }
  
  createJournalUI() {
    const journalContainer = document.createElement('div');
    journalContainer.className = 'journal-container';
    journalContainer.innerHTML = `
      <div class="journal-header">
        <h3>يومياتي الدراسية</h3>
        <div class="journal-actions">
          <button class="new-entry-btn">✏️ مشاركة جديدة</button>
          <button class="toggle-journal-btn">📚</button>
        </div>
      </div>
      
      <div class="journal-form" style="display: none;">
        <h4>مشاركة جديدة في اليوميات</h4>
        <div class="form-group">
          <label>عنوان المشاركة</label>
          <input type="text" class="journal-title" placeholder="مثال: تحدي اليوم" required>
        </div>
        <div class="form-group">
          <label>ماذا أنجزت اليوم؟</label>
          <textarea class="journal-achievements" placeholder="اكتب ما أنجزته من مذاكرة ومهام..." rows="3" required></textarea>
        </div>
        <div class="form-group">
          <label>كيف كان شعورك؟</label>
          <textarea class="journal-feelings" placeholder="اكتب كيف شعرت أثناء المذاكرة..." rows="2"></textarea>
        </div>
        <div class="form-group">
          <label>ما الذي تعلمته أو تحسنت فيه؟</label>
          <textarea class="journal-learnings" placeholder="اكتب ما تعلمته الجديد..." rows="2"></textarea>
        </div>
        <div class="form-group">
          <label>خطة الغد</label>
          <textarea class="journal-tomorrow" placeholder="ما الذي تخطط لإنجازه غداً?" rows="2"></textarea>
        </div>
        <div class="form-group media-upload">
          <label>إضافة وسائط (اختياري)</label>
          <div class="media-buttons">
            <button type="button" class="record-audio-btn">🎤 تسجيل صوتي</button>
            <button type="button" class="take-picture-btn">📷 التقاط صورة</button>
          </div>
          <div class="media-preview" style="display: none;"></div>
        </div>
        <div class="journal-form-actions">
          <button type="button" class="save-journal-btn">حفظ المشاركة</button>
          <button type="button" class="cancel-journal-btn">إلغاء</button>
        </div>
      </div>
      
      <div class="journal-entries" style="display: none;">
        <div class="entries-filter">
          <label>تصفية: 
            <select class="filter-period">
              <option value="all">كل المشاركات</option>
              <option value="week">هذا الأسبوع</option>
              <option value="month">هذا الشهر</option>
            </select>
          </label>
          <div class="search-box">
            <input type="text" class="search-entries" placeholder="ابحث في اليوميات...">
          </div>
        </div>
        <div class="entries-list"></div>
      </div>
      
      <div class="reflection-prompt" style="display: none;">
        <h4>لحظة تفكر أسبوعي 🌟</h4>
        <p>لقد مر أسبوع على مشاركاتك السابقة. خذ وقتًا للتفكير فيما كتبته والتقدم الذي أحرزته.</p>
        <button class="view-past-entries-btn">عرض المشاركات السابقة</button>
      </div>
    `;
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      .journal-container {
        background: rgba(14, 12, 40, 0.6);
        backdrop-filter: blur(8px);
        border-radius: 15px;
        padding: 15px;
        margin: 20px auto;
        max-width: 700px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        border: 1px solid rgba(255,255,255,0.1);
        color: white;
      }
      
      .journal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      .journal-header h3 {
        color: gold;
        margin: 0;
      }
      
      .journal-actions {
        display: flex;
        gap: 10px;
      }
      
      .new-entry-btn, .toggle-journal-btn {
        background: linear-gradient(45deg, #4CAF50, #81C784);
        color: white;
        border: none;
        padding: 8px 15px;
        border-radius: 20px;
        cursor: pointer;
        font-weight: bold;
        transition: all 0.2s;
      }
      
      .toggle-journal-btn {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
      }
      
      .new-entry-btn:hover, .toggle-journal-btn:hover {
        transform: scale(1.05);
        box-shadow: 0 0 10px rgba(76, 175, 80, 0.5);
      }
      
      .journal-form {
        background: rgba(255,255,255,0.05);
        border-radius: 10px;
        padding: 15px;
        margin-top: 15px;
        animation: fade-in 0.5s ease;
      }
      
      .journal-form h4 {
        color: gold;
        margin-top: 0;
        text-align: center;
      }
      
      .form-group {
        margin-bottom: 15px;
      }
      
      .form-group label {
        display: block;
        margin-bottom: 5px;
        color: #ddd;
      }
      
      .form-group input, .form-group textarea, .form-group select {
        width: 100%;
        padding: 10px;
        border-radius: 5px;
        border: 1px solid rgba(255,255,255,0.1);
        background: rgba(255,255,255,0.1);
        color: white;
        font-family: 'Cairo', sans-serif;
      }
      
      .form-group textarea {
        resize: vertical;
      }
      
      .media-buttons {
        display: flex;
        gap: 10px;
        margin-top: 5px;
      }
      
      .record-audio-btn, .take-picture-btn {
        background: rgba(255,255,255,0.1);
        color: white;
        border: none;
        padding: 8px 15px;
        border-radius: 20px;
        cursor: pointer;
        transition: all 0.2s;
      }
      
      .record-audio-btn:hover, .take-picture-btn:hover {
        background: rgba(255,255,255,0.2);
      }
      
      .media-preview {
        margin-top: 10px;
        padding-top: 15px;
        border-top: 1px solid rgba(255,255,255,0.1);
        text-align: center;
      }
      
      .media-preview audio, .media-preview img {
        max-width: 100%;
        display: block;
        margin: 0 auto;
      }
      
      .journal-form-actions {
        display: flex;
        justify-content: center;
        gap: 10px;
        margin-top: 15px;
      }
      
      .save-journal-btn {
        background: linear-gradient(45deg, #4CAF50, #81C784);
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 20px;
        cursor: pointer;
        font-weight: bold;
      }
      
      .cancel-journal-btn {
        background: linear-gradient(45deg, #f44336, #e57373);
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 20px;
        cursor: pointer;
        font-weight: bold;
      }
      
      .journal-entries {
        margin-top: 15px;
        animation: fade-in 0.5s ease;
      }
      
      .entries-filter {
        display: flex;
        justify-content: space-between;
        margin-bottom: 15px;
        background: rgba(255,255,255,0.05);
        padding: 10px;
        border-radius: 5px;
      }
      
      .filter-period {
        background: rgba(255,255,255,0.1);
        color: white;
        border: 1px solid rgba(255,255,255,0.1);
        padding: 5px 10px;
        border-radius: 5px;
      }
      
      .search-box input {
        background: rgba(255,255,255,0.1);
        color: white;
        border: 1px solid rgba(255,255,255,0.1);
        padding: 5px 10px;
        border-radius: 5px;
      }
      
      .entries-list {
        max-height: 500px;
        overflow-y: auto;
      }
      
      .entry-item {
        background: rgba(255,255,255,0.05);
        border-radius: 5px;
        padding: 15px;
        margin-bottom: 15px;
        position: relative;
      }
      
      .entry-date {
        color: #bbb;
        font-size: 0.9em;
        margin-bottom: 10px;
      }
      
      .entry-title {
        color: gold;
        font-size: 1.2em;
        margin: 0 0 10px 0;
      }
      
      .entry-content {
        margin-bottom: 15px;
      }
      
      .entry-section {
        margin-bottom: 10px;
      }
      
      .entry-section h5 {
        color: #ddd;
        margin: 0 0 5px 0;
        font-size: 1em;
      }
      
      .entry-section p {
        margin: 0;
        color: white;
      }
      
      .entry-media {
        margin-top: 15px;
        padding-top: 15px;
        border-top: 1px solid rgba(255,255,255,0.1);
        text-align: center;
      }
      
      .entry-actions {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        margin-top: 10px;
      }
      
      .edit-entry-btn, .delete-entry-btn {
        background: none;
        border: none;
        color: #ccc;
        cursor: pointer;
        font-size: 1.2em;
        transition: color 0.3s;
      }
      
      .edit-entry-btn:hover {
        color: gold;
      }
      
      .delete-entry-btn:hover {
        color: #f44336;
      }
      
      .no-entries {
        text-align: center;
        padding: 20px;
        color: #ccc;
      }
      
      .reflection-prompt {
        background: rgba(255,215,0,0.1);
        border: 1px solid rgba(255,215,0,0.2);
        border-radius: 10px;
        padding: 15px;
        margin-top: 15px;
        text-align: center;
        animation: pulse 2s infinite;
      }
      
      .reflection-prompt h4 {
        color: gold;
        margin-top: 0;
      }
      
      .reflection-prompt p {
        color: #ddd;
      }
      
      .view-past-entries-btn {
        background: linear-gradient(45deg, #FF9800, #FFCA28);
        color: white;
        border: none;
        padding: 8px 15px;
        border-radius: 20px;
        cursor: pointer;
        font-weight: bold;
        margin-top: 10px;
      }
      
      @keyframes pulse {
        0% { box-shadow: 0 0 0 0 rgba(255,215,0,0.4); }
        70% { box-shadow: 0 0 0 10px rgba(255,215,0,0); }
        100% { box-shadow: 0 0 0 0 rgba(255,215,0,0); }
      }
      
      @keyframes fade-in {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      @media (max-width: 768px) {
        .journal-container {
          max-width: 90%;
        }
        
        .journal-header {
          flex-direction: column;
          align-items: flex-start;
        }
        
        .journal-actions {
          margin-top: 10px;
          width: 100%;
          justify-content: space-between;
        }
        
        .entries-filter {
          flex-direction: column;
          gap: 10px;
        }
        
        .search-box {
          width: 100%;
        }
        
        .search-box input {
          width: 100%;
        }
      }
    `;
    document.head.appendChild(style);
    
    // Inject the journal into the page
    const moodTracker = document.querySelector('.mood-tracker-container');
    if (moodTracker) {
      moodTracker.after(journalContainer);
    } else {
      document.querySelector('.container').prepend(journalContainer);
    }
  }
  
  setupEventListeners() {
    // Toggle journal entries view
    document.querySelector('.toggle-journal-btn').addEventListener('click', () => {
      const entriesView = document.querySelector('.journal-entries');
      if (entriesView.style.display === 'none') {
        entriesView.style.display = 'block';
        document.querySelector('.journal-form').style.display = 'none';
        this.loadEntriesList();
      } else {
        entriesView.style.display = 'none';
      }
    });
    
    // Show new entry form
    document.querySelector('.new-entry-btn').addEventListener('click', () => {
      const journalForm = document.querySelector('.journal-form');
      journalForm.style.display = 'block';
      document.querySelector('.journal-entries').style.display = 'none';
      // Clear form
      document.querySelector('.journal-title').value = '';
      document.querySelector('.journal-achievements').value = '';
      document.querySelector('.journal-feelings').value = '';
      document.querySelector('.journal-learnings').value = '';
      document.querySelector('.journal-tomorrow').value = '';
      document.querySelector('.media-preview').style.display = 'none';
      document.querySelector('.media-preview').innerHTML = '';
    });
    
    // Cancel new entry
    document.querySelector('.cancel-journal-btn').addEventListener('click', () => {
      document.querySelector('.journal-form').style.display = 'none';
    });
    
    // Save new entry
    document.querySelector('.save-journal-btn').addEventListener('click', () => {
      this.saveNewEntry();
    });
    
    // Filter entries
    document.querySelector('.filter-period').addEventListener('change', () => {
      this.loadEntriesList();
    });
    
    // Search entries
    document.querySelector('.search-entries').addEventListener('input', (e) => {
      this.searchEntries(e.target.value);
    });
    
    // Media recording
    document.querySelector('.record-audio-btn').addEventListener('click', () => {
      this.startAudioRecording();
    });
    
    document.querySelector('.take-picture-btn').addEventListener('click', () => {
      this.takePicture();
    });
    
    // View past entries from reflection prompt
    document.querySelector('.view-past-entries-btn').addEventListener('click', () => {
      document.querySelector('.journal-entries').style.display = 'block';
      document.querySelector('.reflection-prompt').style.display = 'none';
      document.querySelector('.filter-period').value = 'week';
      this.loadEntriesList();
    });
  }
  
  saveNewEntry() {
    const title = document.querySelector('.journal-title').value.trim();
    const achievements = document.querySelector('.journal-achievements').value.trim();
    
    if (!title || !achievements) {
      alert('يرجى ملء العنوان والإنجازات على الأقل');
      return;
    }
    
    const feelings = document.querySelector('.journal-feelings').value.trim();
    const learnings = document.querySelector('.journal-learnings').value.trim();
    const tomorrow = document.querySelector('.journal-tomorrow').value.trim();
    
    // Get media content if any
    let mediaContent = '';
    const mediaPreview = document.querySelector('.media-preview');
    if (mediaPreview.querySelector('audio')) {
      mediaContent = mediaPreview.querySelector('audio').src;
    } else if (mediaPreview.querySelector('img')) {
      mediaContent = mediaPreview.querySelector('img').src;
    }
    
    const newEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      title,
      achievements,
      feelings,
      learnings,
      tomorrow,
      mediaContent,
      mediaType: mediaContent ? (mediaContent.startsWith('data:audio') ? 'audio' : 'image') : ''
    };
    
    this.entries.push(newEntry);
    this.saveEntries();
    
    // Hide form and show success message
    document.querySelector('.journal-form').style.display = 'none';
    
    // Show temporary success message
    const successMsg = document.createElement('div');
    successMsg.className = 'success-message';
    successMsg.textContent = 'تم حفظ المشاركة بنجاح!';
    successMsg.style.cssText = `
      background: rgba(76, 175, 80, 0.2);
      color: white;
      padding: 10px;
      text-align: center;
      border-radius: 5px;
      margin-top: 15px;
    `;
    document.querySelector('.journal-container').appendChild(successMsg);
    
    setTimeout(() => {
      successMsg.remove();
    }, 3000);
    
    // Add XP for creating a journal entry
    if (window.xpSystem) {
      window.xpSystem.addXP(5);
    }
  }
  
  loadEntriesList() {
    const entriesList = document.querySelector('.entries-list');
    entriesList.innerHTML = '';
    
    const filter = document.querySelector('.filter-period').value;
    const filteredEntries = this.getFilteredEntries(filter);
    
    if (filteredEntries.length === 0) {
      entriesList.innerHTML = '<div class="no-entries">لا توجد مشاركات في اليوميات.</div>';
      return;
    }
    
    filteredEntries.forEach(entry => {
      const entryDate = new Date(entry.date);
      const formattedDate = entryDate.toLocaleDateString('ar-EG', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      
      const entryEl = document.createElement('div');
      entryEl.className = 'entry-item';
      entryEl.dataset.id = entry.id;
      
      let mediaElement = '';
      if (entry.mediaContent) {
        if (entry.mediaType === 'audio') {
          mediaElement = `
            <div class="entry-media">
              <audio controls src="${entry.mediaContent}"></audio>
            </div>
          `;
        } else if (entry.mediaType === 'image') {
          mediaElement = `
            <div class="entry-media">
              <img src="${entry.mediaContent}" alt="صورة المشاركة" style="max-width: 100%; max-height: 200px;">
            </div>
          `;
        }
      }
      
      entryEl.innerHTML = `
        <div class="entry-date">${formattedDate}</div>
        <h4 class="entry-title">${entry.title}</h4>
        <div class="entry-content">
          <div class="entry-section">
            <h5>الإنجازات:</h5>
            <p>${entry.achievements}</p>
          </div>
          ${entry.feelings ? `
            <div class="entry-section">
              <h5>المشاعر:</h5>
              <p>${entry.feelings}</p>
            </div>
          ` : ''}
          ${entry.learnings ? `
            <div class="entry-section">
              <h5>التعلم والتحسن:</h5>
              <p>${entry.learnings}</p>
            </div>
          ` : ''}
          ${entry.tomorrow ? `
            <div class="entry-section">
              <h5>خطة الغد:</h5>
              <p>${entry.tomorrow}</p>
            </div>
          ` : ''}
        </div>
        ${mediaElement}
        <div class="entry-actions">
          <button class="edit-entry-btn" data-id="${entry.id}">✏️</button>
          <button class="delete-entry-btn" data-id="${entry.id}">🗑️</button>
        </div>
      `;
      
      entriesList.appendChild(entryEl);
    });
    
    // Setup edit and delete buttons
    document.querySelectorAll('.edit-entry-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const entryId = e.target.dataset.id;
        this.editEntry(entryId);
      });
    });
    
    document.querySelectorAll('.delete-entry-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const entryId = e.target.dataset.id;
        this.deleteEntry(entryId);
      });
    });
  }
  
  getFilteredEntries(filter) {
    const now = new Date();
    const entries = [...this.entries].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    switch(filter) {
      case 'week':
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(now.getDate() - 7);
        return entries.filter(entry => {
          const entryDate = new Date(entry.date);
          return entryDate >= oneWeekAgo && entryDate <= new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        });
      case 'month':
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(now.getMonth() - 1);
        return entries.filter(entry => {
          const entryDate = new Date(entry.date);
          return entryDate >= oneMonthAgo;
        });
      default:
        return entries;
    }
  }
  
  searchEntries(query) {
    if (!query) {
      this.loadEntriesList();
      return;
    }
    
    query = query.toLowerCase();
    const entriesList = document.querySelector('.entries-list');
    
    document.querySelectorAll('.entry-item').forEach(entryEl => {
      const text = entryEl.textContent.toLowerCase();
      if (text.includes(query)) {
        entryEl.style.display = 'block';
      } else {
        entryEl.style.display = 'none';
      }
    });
    
    // Check if no entries visible
    const visibleEntries = document.querySelectorAll('.entry-item[style="display: block"]');
    if (visibleEntries.length === 0 && entriesList.querySelector('.no-search-results')) {
      entriesList.innerHTML += '<div class="no-search-results">لا توجد نتائج للبحث.</div>';
    } else {
      const noResults = entriesList.querySelector('.no-search-results');
      if (noResults) noResults.remove();
    }
  }
  
  editEntry(entryId) {
    const entry = this.entries.find(e => e.id === entryId);
    if (!entry) return;
    
    const journalForm = document.querySelector('.journal-form');
    journalForm.style.display = 'block';
    document.querySelector('.journal-entries').style.display = 'none';
    
    // Fill form with entry data
    document.querySelector('.journal-title').value = entry.title;
    document.querySelector('.journal-achievements').value = entry.achievements;
    document.querySelector('.journal-feelings').value = entry.feelings || '';
    document.querySelector('.journal-learnings').value = entry.learnings || '';
    document.querySelector('.journal-tomorrow').value = entry.tomorrow || '';
    
    const mediaPreview = document.querySelector('.media-preview');
    if (entry.mediaContent) {
      mediaPreview.style.display = 'block';
      if (entry.mediaType === 'audio') {
        mediaPreview.innerHTML = `<audio controls src="${entry.mediaContent}"></audio>`;
      } else if (entry.mediaType === 'image') {
        mediaPreview.innerHTML = `<img src="${entry.mediaContent}" alt="صورة المشاركة" style="max-width: 100%; max-height: 200px;">`;
      }
    } else {
      mediaPreview.style.display = 'none';
      mediaPreview.innerHTML = '';
    }
    
    // Change save button to update
    const saveBtn = document.querySelector('.save-journal-btn');
    saveBtn.textContent = 'تحديث المشاركة';
    saveBtn.dataset.editId = entryId;
    
    // Override save button click handler
    const oldClickHandler = saveBtn.onclick;
    saveBtn.onclick = () => {
      this.updateEntry(entryId);
      saveBtn.textContent = 'حفظ المشاركة';
      delete saveBtn.dataset.editId;
      saveBtn.onclick = oldClickHandler;
    };
  }
  
  updateEntry(entryId) {
    const index = this.entries.findIndex(e => e.id === entryId);
    if (index === -1) return;
    
    const title = document.querySelector('.journal-title').value.trim();
    const achievements = document.querySelector('.journal-achievements').value.trim();
    
    if (!title || !achievements) {
      alert('يرجى ملء العنوان والإنجازات على الأقل');
      return;
    }
    
    const feelings = document.querySelector('.journal-feelings').value.trim();
    const learnings = document.querySelector('.journal-learnings').value.trim();
    const tomorrow = document.querySelector('.journal-tomorrow').value.trim();
    
    // Get media content if any
    let mediaContent = '';
    let mediaType = '';
    const mediaPreview = document.querySelector('.media-preview');
    if (mediaPreview.querySelector('audio')) {
      mediaContent = mediaPreview.querySelector('audio').src;
      mediaType = 'audio';
    } else if (mediaPreview.querySelector('img')) {
      mediaContent = mediaPreview.querySelector('img').src;
      mediaType = 'image';
    }
    
    this.entries[index].title = title;
    this.entries[index].achievements = achievements;
    this.entries[index].feelings = feelings;
    this.entries[index].learnings = learnings;
    this.entries[index].tomorrow = tomorrow;
    this.entries[index].mediaContent = mediaContent;
    this.entries[index].mediaType = mediaType;
    
    this.saveEntries();
    
    // Hide form and show success message
    document.querySelector('.journal-form').style.display = 'none';
    
    // Show temporary success message
    const successMsg = document.createElement('div');
    successMsg.className = 'success-message';
    successMsg.textContent = 'تم تحديث المشاركة بنجاح!';
    successMsg.style.cssText = `
      background: rgba(76, 175, 80, 0.2);
      color: white;
      padding: 10px;
      text-align: center;
      border-radius: 5px;
      margin-top: 15px;
    `;
    document.querySelector('.journal-container').appendChild(successMsg);
    
    setTimeout(() => {
      successMsg.remove();
    }, 3000);
  }
  
  deleteEntry(entryId) {
    if (!confirm('هل أنت متأكد من حذف هذه المشاركة؟ لا يمكن التراجع عن هذا الإجراء.')) {
      return;
    }
    
    const index = this.entries.findIndex(e => e.id === entryId);
    if (index !== -1) {
      this.entries.splice(index, 1);
      this.saveEntries();
      this.loadEntriesList();
    }
  }
  
  startAudioRecording() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert('تسجيل الصوت غير مدعوم في متصفحك.');
      return;
    }
    
    const mediaButtons = document.querySelector('.media-buttons');
    const mediaPreview = document.querySelector('.media-preview');
    
    // Change button to recording state
    document.querySelector('.record-audio-btn').textContent = '⏺️ جاري التسجيل...';
    document.querySelector('.record-audio-btn').disabled = true;
    
    // Add stop button
    const stopBtn = document.createElement('button');
    stopBtn.type = 'button';
    stopBtn.className = 'stop-recording-btn';
    stopBtn.textContent = '⏹️ إيقاف التسجيل';
    stopBtn.style.cssText = `
      background: #f44336;
      color: white;
      border: none;
      padding: 8px 15px;
      border-radius: 20px;
      cursor: pointer;
      transition: all 0.2s;
    `;
    mediaButtons.appendChild(stopBtn);
    
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        const mediaRecorder = new MediaRecorder(stream);
        const audioChunks = [];
        
        mediaRecorder.addEventListener('dataavailable', event => {
          audioChunks.push(event.data);
        });
        
        mediaRecorder.addEventListener('stop', () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
          const audioUrl = URL.createObjectURL(audioBlob);
          
          mediaPreview.style.display = 'block';
          mediaPreview.innerHTML = `<audio controls src="${audioUrl}"></audio>`;
          
          // Reset UI
          document.querySelector('.record-audio-btn').textContent = '🎤 تسجيل صوتي';
          document.querySelector('.record-audio-btn').disabled = false;
          stopBtn.remove();
        });
        
        mediaRecorder.start();
        
        // Stop recording button
        stopBtn.addEventListener('click', () => {
          mediaRecorder.stop();
          stream.getTracks().forEach(track => track.stop());
        });
      })
      .catch(error => {
        alert('حدث خطأ أثناء محاولة التسجيل: ' + error.message);
        // Reset UI
        document.querySelector('.record-audio-btn').textContent = '🎤 تسجيل صوتي';
        document.querySelector('.record-audio-btn').disabled = false;
        stopBtn.remove();
      });
  }
  
  takePicture() {
    // Create temporary file input
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.capture = 'user'; // Prefer camera on mobile
    
    fileInput.addEventListener('change', () => {
      if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();
        
        reader.onload = e => {
          const mediaPreview = document.querySelector('.media-preview');
          mediaPreview.style.display = 'block';
          mediaPreview.innerHTML = `<img src="${e.target.result}" alt="صورة مرفقة" style="max-width: 100%; max-height: 200px;">`;
        };
        
        reader.readAsDataURL(fileInput.files[0]);
      }
    });
    
    fileInput.click();
  }
  
  checkWeeklyReflectionPrompt() {
    if (this.entries.length === 0) return;
    
    // Sort entries by date, newest first
    const sortedEntries = [...this.entries].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Get oldest entry in the last 2 weeks that hasn't been reflected on
    const today = new Date();
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(today.getDate() - 14);
    
    // Find entries between 7-14 days old
    const weekOldEntries = sortedEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= twoWeeksAgo && entryDate <= new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    });
    
    if (weekOldEntries.length > 0) {
      // Show reflection prompt
      document.querySelector('.reflection-prompt').style.display = 'block';
    }
  }
}

// Initialize when the document is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  const studyJournal = new StudyJournal();
  
  // Make it globally accessible
  window.studyJournal = studyJournal;
});