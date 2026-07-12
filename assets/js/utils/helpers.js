/* ============================================
   通用辅助函数
   ============================================ */

const Helpers = {
  // DOM查询
  $(selector, parent = document) {
    return parent.querySelector(selector);
  },

  $$(selector, parent = document) {
    return parent.querySelectorAll(selector);
  },

  // 创建元素
  create(tag, className, content) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (content !== undefined) el.innerHTML = content;
    return el;
  },

  // HTML转义
  escape(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  },

  // 日期格式化
  formatDate(date) {
    if (typeof date === 'string') date = new Date(date);
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  },

  // 今天的日期字符串
  today() {
    return this.formatDate(new Date());
  },

  // 时间格式化（秒 -> mm:ss）
  formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  },

  // 时间格式化（秒 -> Xh Xm Xs）
  formatDuration(seconds) {
    if (seconds < 60) return `${seconds}秒`;
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h > 0) return `${h}小时${m}分钟`;
    return `${m}分钟`;
  },

  // Fisher-Yates 洗牌
  shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  },

  // 随机取n个
  sample(arr, n) {
    return this.shuffle(arr).slice(0, n);
  },

  // 防抖
  debounce(fn, delay = 300) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  },

  // 获取URL hash参数
  parseHash() {
    const hash = window.location.hash.slice(1) || '/';
    const parts = hash.split('/').filter(Boolean);
    return parts;
  },

  // 根据ID查找章节
  getChapter(chapterId) {
    return (window.NCRE2?.chapters || []).find(ch => ch.id === chapterId);
  },

  // 根据ID查找知识点
  getKnowledgePoint(kpId) {
    for (const ch of window.NCRE2?.chapters || []) {
      const kp = ch.knowledgePoints.find(kp => kp.id === kpId);
      if (kp) return { ...kp, chapter: ch };
    }
    return null;
  },

  // 根据ID查找题目
  getQuestion(questionId) {
    return (window.NCRE2?.questions || []).find(q => q.id === questionId);
  },

  // 获取章节的所有题目
  getQuestionsByChapter(chapterId) {
    return (window.NCRE2?.questions || []).filter(q => q.chapterId === chapterId);
  },

  // 获取知识点的所有题目
  getQuestionsByKp(kpId) {
    return (window.NCRE2?.questions || []).filter(q => q.knowledgePointId === kpId);
  },

  // 获取所有知识点数量
  getTotalKpCount() {
    return (window.NCRE2?.chapters || []).reduce((sum, ch) => sum + ch.knowledgePoints.length, 0);
  },

  // 难度文字
  difficultyText(d) {
    return ['', '简单', '中等', '困难'][d] || '';
  },

  // 难度class
  difficultyClass(d) {
    return ['', 'easy', 'medium', 'hard'][d] || '';
  },

  // 状态文字
  wrongStatusText(status) {
    return { unresolved: '未掌握', reviewed: '复习中', mastered: '已掌握' }[status] || '';
  },

  // 状态class
  wrongStatusClass(status) {
    return status || 'unresolved';
  },

  // SVG图标
  icon(name, size = 16) {
    const icons = {
      home: '<path d="M3 12L12 3l9 9M5 10v10h14V10"/>',
      study: '<path d="M4 19.5A2.5 2.5 0 016.5 17H20M4 4.5A2.5 2.5 0 016.5 2H20v15H6.5A2.5 2.5 0 004 19.5z"/>',
      wrongbook: '<path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>',
      mock: '<path d="M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>',
      flashcard: '<path d="M3 5h18v14H3zM3 10h18M7 15h6"/>',
      favorites: '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>',
      search: '<circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>',
      sun: '<circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>',
      moon: '<path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>',
      auto: '<circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 000 18z" fill="currentColor"/>',
      check: '<path d="M20 6L9 17l-5-5"/>',
      x: '<path d="M18 6L6 18M6 6l12 12"/>',
      star: '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>',
      starFilled: '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor"/>',
      chevronRight: '<path d="M9 18l6-6-6-6"/>',
      chevronLeft: '<path d="M15 18l-6-6 6-6"/>',
      chevronDown: '<path d="M6 9l6 6 6-6"/>',
      clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
      chart: '<path d="M3 3v18h18M7 16V8M12 16v-5M17 16v-3"/>',
      book: '<path d="M4 19.5A2.5 2.5 0 016.5 17H20M4 4.5A2.5 2.5 0 016.5 2H20v15H6.5A2.5 2.5 0 004 19.5z"/>',
      menu: '<path d="M3 12h18M3 6h18M3 18h18"/>',
      target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
      fire: '<path d="M12 2c1 3 4 5 4 9a4 4 0 11-8 0c0-2 1-3 2-4-1 0-2 1-2 2M12 22a8 8 0 100-16"/>',
      trophy: '<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 11-10 0V4zM7 4H4v3a3 3 0 003 3M17 4h3v3a3 3 0 01-3 3"/>',
      refresh: '<path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>',
      arrowRight: '<path d="M5 12h14M12 5l7 7-7 7"/>',
    };
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${icons[name] || ''}</svg>`;
  },

  // 显示通知
  notify(message, type = 'info', duration = 2500) {
    const toast = this.create('div', `toast toast-${type}`, message);
    toast.style.cssText = `
      position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
      padding: 10px 20px; border-radius: var(--radius-md); font-size: var(--fs-base);
      z-index: 9999; animation: fadeInUp var(--transition-base);
      box-shadow: var(--shadow-lg);
    `;
    if (type === 'success') {
      toast.style.background = 'var(--accent-secondary)';
      toast.style.color = '#fff';
    } else if (type === 'error') {
      toast.style.background = 'var(--accent-danger)';
      toast.style.color = '#fff';
    } else {
      toast.style.background = 'var(--bg-tertiary)';
      toast.style.color = 'var(--text-primary)';
      toast.style.border = '1px solid var(--border)';
    }
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 200ms';
      setTimeout(() => toast.remove(), 200);
    }, duration);
  },
};
