/* ============================================
   收藏夹视图
   ============================================ */

const FavoritesView = {
  currentTab: 'knowledgePoint',

  render() {
    Sidebar.hide();
    const contentArea = document.getElementById('contentArea');

    contentArea.innerHTML = `
      <div class="page">
        <div class="page-header">
          <h1 class="page-title">收藏夹</h1>
          <p class="page-subtitle">收藏的知识点、题目和速记卡都在这里</p>
        </div>

        <div class="fav-tabs">
          <button class="fav-tab active" data-tab="knowledgePoint" onclick="FavoritesView.setTab('knowledgePoint')">
            ${Helpers.icon('book', 14)} 知识点
            <span class="fav-tab-count">${Store.getFavoritesByType('knowledgePoint').length}</span>
          </button>
          <button class="fav-tab" data-tab="question" onclick="FavoritesView.setTab('question')">
            ${Helpers.icon('target', 14)} 题目
            <span class="fav-tab-count">${Store.getFavoritesByType('question').length}</span>
          </button>
          <button class="fav-tab" data-tab="flashcard" onclick="FavoritesView.setTab('flashcard')">
            ${Helpers.icon('flashcard', 14)} 速记卡
            <span class="fav-tab-count">${Store.getFavoritesByType('flashcard').length}</span>
          </button>
        </div>

        <div id="favContent">
          ${this.renderContent()}
        </div>
      </div>
    `;
  },

  setTab(tab) {
    this.currentTab = tab;
    document.querySelectorAll('.fav-tab').forEach(t => {
      t.classList.toggle('active', t.dataset.tab === tab);
    });
    document.getElementById('favContent').innerHTML = this.renderContent();
  },

  renderContent() {
    const favorites = Store.getFavoritesByType(this.currentTab);

    if (favorites.length === 0) {
      return `<div class="empty-state">
        <p>暂无收藏</p>
        <p class="text-secondary">在学习过程中点击星标按钮即可收藏</p>
      </div>`;
    }

    if (this.currentTab === 'knowledgePoint') {
      return favorites.map(fav => {
        const kp = Helpers.getKnowledgePoint(fav.id);
        if (!kp) return '';
        return `
          <div class="fav-item" onclick="Router.navigate('study/${kp.chapter.id}/${kp.id}')">
            <div class="fav-item-header">
              <span class="fav-item-code">[${kp.code}]</span>
              <span class="fav-item-chapter">${kp.chapter.title}</span>
            </div>
            <div class="fav-item-title">${kp.title}</div>
            <div class="fav-item-summary">${kp.summary || ''}</div>
            <div class="fav-item-actions">
              <button class="btn btn-secondary btn-sm" onclick="event.stopPropagation(); FavoritesView.remove('knowledgePoint', '${fav.id}')">取消收藏</button>
            </div>
          </div>
        `;
      }).join('');
    }

    if (this.currentTab === 'question') {
      return favorites.map(fav => {
        const q = Helpers.getQuestion(fav.id);
        if (!q) return '';
        const ch = Helpers.getChapter(q.chapterId);
        return `
          <div class="fav-item">
            <div class="fav-item-header">
              <span class="fav-item-chapter">${ch ? ch.title : ''}</span>
              <span class="badge badge-${Helpers.difficultyClass(q.difficulty)}">${Helpers.difficultyText(q.difficulty)}</span>
            </div>
            <div class="fav-item-title">${Helpers.escape(q.question)}</div>
            <div class="fav-item-actions">
              <button class="btn btn-primary btn-sm" onclick="FavoritesView.viewQuestion('${q.id}')">查看题目</button>
              <button class="btn btn-secondary btn-sm" onclick="FavoritesView.remove('question', '${q.id}')">取消收藏</button>
            </div>
          </div>
        `;
      }).join('');
    }

    if (this.currentTab === 'flashcard') {
      return favorites.map(fav => {
        const fc = (window.NCRE2?.flashcards || []).find(f => f.id === fav.id);
        if (!fc) return '';
        return `
          <div class="fav-item">
            <div class="fav-item-header">
              <span class="fav-item-chapter">速记卡</span>
            </div>
            <div class="fav-item-title">${Helpers.escape(fc.front)}</div>
            <div class="fav-item-summary">${Helpers.escape(fc.back).substring(0, 80)}...</div>
            <div class="fav-item-actions">
              <button class="btn btn-secondary btn-sm" onclick="FavoritesView.remove('flashcard', '${fc.id}')">取消收藏</button>
            </div>
          </div>
        `;
      }).join('');
    }

    return '';
  },

  remove(type, id) {
    Store.toggleFavorite(type, id);
    this.render();
    Helpers.notify('已取消收藏', 'info', 1200);
  },

  viewQuestion(questionId) {
    const q = Helpers.getQuestion(questionId);
    if (!q) return;
    const contentArea = document.getElementById('contentArea');
    contentArea.innerHTML = `
      <div class="page">
        <div class="page-header">
          <button class="btn btn-secondary" onclick="FavoritesView.render()">${Helpers.icon('chevronLeft', 14)} 返回收藏夹</button>
        </div>
        ${QuestionCard.render(q, { index: 1 })}
      </div>
    `;
  }
};
