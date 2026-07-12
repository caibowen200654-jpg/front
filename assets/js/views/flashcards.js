/* ============================================
   速记卡视图
   ============================================ */

const FlashcardsView = {
  currentIndex: 0,
  currentChapter: 'all',
  cards: [],

  init() {
    // 暴露给Flashcard组件调用
    window.FlashcardsView = this;
  },

  render() {
    Sidebar.hide();
    this.currentIndex = 0;
    this.filterCards();

    const contentArea = document.getElementById('contentArea');
    const chapters = window.NCRE2?.chapters || [];

    contentArea.innerHTML = `
      <div class="page flashcards-page">
        <div class="page-header">
          <h1 class="page-title">考点速记卡</h1>
          <p class="page-subtitle">点击卡片翻转查看答案，左右键切换上一张/下一张</p>
        </div>

        <div class="flashcard-filters">
          <button class="filter-btn ${this.currentChapter === 'all' ? 'active' : ''}" onclick="FlashcardsView.setChapter('all')">全部</button>
          ${chapters.map(ch => `
            <button class="filter-btn ${this.currentChapter === ch.id ? 'active' : ''}" onclick="FlashcardsView.setChapter('${ch.id}')">${ch.title}</button>
          `).join('')}
        </div>

        <div id="flashcardContainer">
          ${this.renderCard()}
        </div>

        <div class="flashcard-nav">
          <button class="btn btn-secondary" onclick="FlashcardsView.prev()" id="prevBtn">
            ${Helpers.icon('chevronLeft', 14)} 上一张
          </button>
          <span class="flashcard-position">${this.currentIndex + 1} / ${this.cards.length}</span>
          <button class="btn btn-secondary" onclick="FlashcardsView.next()" id="nextBtn">
            下一张 ${Helpers.icon('chevronRight', 14)}
          </button>
        </div>
      </div>
    `;

    // 键盘导航
    document.addEventListener('keydown', this.handleKeydown);
  },

  handleKeydown(e) {
    if (Router.currentRoute?.path !== 'flashcards') {
      document.removeEventListener('keydown', FlashcardsView.handleKeydown);
      return;
    }
    if (e.key === 'ArrowLeft') FlashcardsView.prev();
    if (e.key === 'ArrowRight') FlashcardsView.next();
  },

  filterCards() {
    const allCards = window.NCRE2?.flashcards || [];
    if (this.currentChapter === 'all') {
      this.cards = allCards;
    } else {
      this.cards = allCards.filter(fc => fc.chapterId === this.currentChapter);
    }
    this.currentIndex = 0;
  },

  setChapter(chapterId) {
    this.currentChapter = chapterId;
    this.filterCards();
    this.render();
  },

  renderCard() {
    if (this.cards.length === 0) {
      return `<div class="empty-state"><p>该章节暂无速记卡</p></div>`;
    }
    const card = this.cards[this.currentIndex];
    return Flashcard.render(card, this.currentIndex, this.cards.length);
  },

  prev() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.updateCard();
    }
  },

  next() {
    if (this.currentIndex < this.cards.length - 1) {
      this.currentIndex++;
      this.updateCard();
    }
  },

  updateCard() {
    const container = document.getElementById('flashcardContainer');
    if (container) {
      container.innerHTML = this.renderCard();
      container.classList.add('fade-in');
      setTimeout(() => container.classList.remove('fade-in'), 200);
    }
    // 更新位置
    const pos = document.querySelector('.flashcard-position');
    if (pos) pos.textContent = `${this.currentIndex + 1} / ${this.cards.length}`;
  }
};

// 初始化
FlashcardsView.init();
