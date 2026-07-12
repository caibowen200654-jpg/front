/* ============================================
   localStorage 数据管理层
   ============================================ */

const Store = {
  PREFIX: 'ncre2_',

  // 基础读写
  get(key, defaultValue = null) {
    try {
      const data = localStorage.getItem(this.PREFIX + key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (e) {
      console.error('Store.get error:', e);
      return defaultValue;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(this.PREFIX + key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error('Store.set error:', e);
      return false;
    }
  },

  remove(key) {
    localStorage.removeItem(this.PREFIX + key);
  },

  // === 学习进度 ===
  getProgress() {
    return this.get('progress', {
      learnedKnowledgePoints: [],
      studyTime: 0,
      lastStudyDate: null,
      studyDates: [],
      studyStreak: 0
    });
  },

  markKpLearned(kpId) {
    const progress = this.getProgress();
    if (!progress.learnedKnowledgePoints.includes(kpId)) {
      progress.learnedKnowledgePoints.push(kpId);
    }
    this.updateStudyDate(progress);
    this.set('progress', progress);
    return progress;
  },

  unmarkKpLearned(kpId) {
    const progress = this.getProgress();
    progress.learnedKnowledgePoints = progress.learnedKnowledgePoints.filter(id => id !== kpId);
    this.set('progress', progress);
    return progress;
  },

  isKpLearned(kpId) {
    return this.getProgress().learnedKnowledgePoints.includes(kpId);
  },

  addStudyTime(seconds) {
    const progress = this.getProgress();
    progress.studyTime += seconds;
    this.updateStudyDate(progress);
    this.set('progress', progress);
  },

  updateStudyDate(progress) {
    const today = Helpers.today();
    progress.lastStudyDate = today;
    if (!progress.studyDates) progress.studyDates = [];
    if (!progress.studyDates.includes(today)) {
      progress.studyDates.push(today);
      // 计算连续天数
      const yesterday = Helpers.formatDate(new Date(Date.now() - 86400000));
      if (progress.studyStreak === 0 || progress.studyDates.includes(yesterday)) {
        progress.studyStreak = (progress.studyStreak || 0) + 1;
      } else {
        progress.studyStreak = 1;
      }
    }
  },

  getStudyDates() {
    return this.getProgress().studyDates || [];
  },

  // === 错题本 ===
  getWrongBook() {
    return this.get('wrongbook', []);
  },

  addToWrongBook(questionId, wrongAnswer) {
    const wrongbook = this.getWrongBook();
    const existing = wrongbook.find(w => w.questionId === questionId);
    if (existing) {
      existing.wrongCount = (existing.wrongCount || 0) + 1;
      existing.lastWrongAnswer = wrongAnswer;
      existing.lastWrongDate = Helpers.today();
      // 答错则重置为未解决
      existing.status = 'unresolved';
    } else {
      wrongbook.push({
        questionId,
        wrongCount: 1,
        lastWrongAnswer: wrongAnswer,
        addedDate: Helpers.today(),
        lastWrongDate: Helpers.today(),
        lastReviewDate: null,
        status: 'unresolved'
      });
    }
    this.set('wrongbook', wrongbook);
    return wrongbook;
  },

  updateWrongStatus(questionId, isCorrect) {
    const wrongbook = this.getWrongBook();
    const item = wrongbook.find(w => w.questionId === questionId);
    if (!item) return wrongbook;

    if (isCorrect) {
      if (item.status === 'unresolved') {
        item.status = 'reviewed';
      } else if (item.status === 'reviewed') {
        item.status = 'mastered';
      }
      item.lastReviewDate = Helpers.today();
    } else {
      item.status = 'unresolved';
      item.wrongCount = (item.wrongCount || 0) + 1;
      item.lastWrongDate = Helpers.today();
    }
    this.set('wrongbook', wrongbook);
    return wrongbook;
  },

  removeFromWrongBook(questionId) {
    let wrongbook = this.getWrongBook();
    wrongbook = wrongbook.filter(w => w.questionId !== questionId);
    this.set('wrongbook', wrongbook);
    return wrongbook;
  },

  clearMastered() {
    let wrongbook = this.getWrongBook();
    wrongbook = wrongbook.filter(w => w.status !== 'mastered');
    this.set('wrongbook', wrongbook);
    return wrongbook;
  },

  getWrongCount() {
    return this.getWrongBook().filter(w => w.status !== 'mastered').length;
  },

  // === 练习记录 ===
  getPracticeRecords() {
    return this.get('practice_records', {});
  },

  recordPractice(kpId, isCorrect) {
    const records = this.getPracticeRecords();
    if (!records[kpId]) {
      records[kpId] = { totalAttempted: 0, correctCount: 0, lastAttemptDate: null };
    }
    records[kpId].totalAttempted++;
    if (isCorrect) records[kpId].correctCount++;
    records[kpId].lastAttemptDate = Helpers.today();
    this.set('practice_records', records);
    return records;
  },

  getPracticeStats() {
    const records = this.getPracticeRecords();
    let totalAttempted = 0, totalCorrect = 0;
    Object.values(records).forEach(r => {
      totalAttempted += r.totalAttempted;
      totalCorrect += r.correctCount;
    });
    return {
      totalAttempted,
      totalCorrect,
      accuracy: totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0
    };
  },

  // === 收藏夹 ===
  getFavorites() {
    return this.get('favorites', []);
  },

  toggleFavorite(type, id) {
    const favorites = this.getFavorites();
    const existing = favorites.find(f => f.type === type && f.id === id);
    if (existing) {
      const filtered = favorites.filter(f => !(f.type === type && f.id === id));
      this.set('favorites', filtered);
      return false; // 取消收藏
    } else {
      favorites.push({ type, id, addedDate: Helpers.today() });
      this.set('favorites', favorites);
      return true; // 添加收藏
    }
  },

  isFavorited(type, id) {
    return this.getFavorites().some(f => f.type === type && f.id === id);
  },

  getFavoritesByType(type) {
    return this.getFavorites().filter(f => f.type === type);
  },

  // === 模拟考试记录 ===
  getMockExams() {
    return this.get('mock_exams', []);
  },

  saveMockExam(examData) {
    const exams = this.getMockExams();
    const exam = {
      id: 'mock-' + Date.now(),
      date: Helpers.today(),
      ...examData
    };
    exams.push(exam);
    this.set('mock_exams', exams);
    return exam;
  },

  getMockExam(id) {
    return this.getMockExams().find(e => e.id === id);
  },

  // === 速记卡进度 ===
  getFlashcardProgress() {
    return this.get('flashcard_progress', {});
  },

  recordFlashcardReview(flashcardId, status) {
    const progress = this.getFlashcardProgress();
    if (!progress[flashcardId]) {
      progress[flashcardId] = { reviewCount: 0, lastReviewDate: null, status: 'unfamiliar' };
    }
    progress[flashcardId].reviewCount++;
    progress[flashcardId].lastReviewDate = Helpers.today();
    progress[flashcardId].status = status; // familiar / fuzzy / unfamiliar
    this.set('flashcard_progress', progress);
    return progress;
  },

  // === 主题 ===
  getTheme() {
    return this.get('theme', 'auto');
  },

  setTheme(theme) {
    this.set('theme', theme);
  },

  // === 模拟考试临时状态 ===
  getMockState() {
    return this.get('mock_state', null);
  },

  setMockState(state) {
    this.set('mock_state', state);
  },

  clearMockState() {
    this.remove('mock_state');
  }
};
