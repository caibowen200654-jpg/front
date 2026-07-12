/* ============================================
   错题本视图
   ============================================ */

const WrongBookView = {
  currentFilter: 'all',
  currentChapter: 'all',

  render() {
    Sidebar.hide();
    const wrongbook = Store.getWrongBook();

    // 合并题目数据
    const wrongQuestions = wrongbook.map(w => {
      const q = Helpers.getQuestion(w.questionId);
      return q ? { ...w, question: q } : null;
    }).filter(Boolean);

    // 统计
    const unresolved = wrongQuestions.filter(w => w.status === 'unresolved').length;
    const reviewed = wrongQuestions.filter(w => w.status === 'reviewed').length;
    const mastered = wrongQuestions.filter(w => w.status === 'mastered').length;

    const contentArea = document.getElementById('contentArea');
    contentArea.innerHTML = `
      <div class="page">
        <div class="page-header">
          <h1 class="page-title">错题本</h1>
          <p class="page-subtitle">做错的题目会自动收录，复习后可标记掌握状态</p>
        </div>

        <!-- 统计卡片 -->
        <div class="wrong-stats grid grid-4">
          <div class="stat-card">
            <div class="stat-value">${wrongQuestions.length}</div>
            <div class="stat-label">总错题</div>
          </div>
          <div class="stat-card stat-unresolved">
            <div class="stat-value">${unresolved}</div>
            <div class="stat-label">未掌握</div>
          </div>
          <div class="stat-card stat-reviewed">
            <div class="stat-value">${reviewed}</div>
            <div class="stat-label">复习中</div>
          </div>
          <div class="stat-card stat-mastered">
            <div class="stat-value">${mastered}</div>
            <div class="stat-label">已掌握</div>
          </div>
        </div>

        <!-- 筛选 -->
        <div class="wrong-filters">
          <div class="filter-group">
            <button class="filter-btn active" data-filter="all" onclick="WrongBookView.setFilter('all')">全部</button>
            <button class="filter-btn" data-filter="unresolved" onclick="WrongBookView.setFilter('unresolved')">未掌握</button>
            <button class="filter-btn" data-filter="reviewed" onclick="WrongBookView.setFilter('reviewed')">复习中</button>
            <button class="filter-btn" data-filter="mastered" onclick="WrongBookView.setFilter('mastered')">已掌握</button>
          </div>
          ${mastered > 0 ? `<button class="btn btn-secondary" onclick="WrongBookView.clearMastered()">${Helpers.icon('check', 14)} 清除已掌握</button>` : ''}
        </div>

        <!-- 错题列表 -->
        <div class="wrong-list" id="wrongList">
          ${this.renderWrongList(wrongQuestions)}
        </div>
      </div>
    `;
  },

  renderWrongList(wrongQuestions) {
    let filtered = wrongQuestions;
    if (this.currentFilter !== 'all') {
      filtered = wrongQuestions.filter(w => w.status === this.currentFilter);
    }

    if (filtered.length === 0) {
      return `<div class="empty-state">
        <p>${this.currentFilter === 'all' ? '错题本为空，继续练习吧！' : '该状态下暂无错题'}</p>
      </div>`;
    }

    // 按章节分组
    const grouped = {};
    filtered.forEach(w => {
      const ch = Helpers.getChapter(w.question.chapterId);
      const chName = ch ? ch.title : '其他';
      if (!grouped[chName]) grouped[chName] = [];
      grouped[chName].push(w);
    });

    return Object.entries(grouped).map(([chName, items]) => `
      <div class="wrong-group">
        <h3 class="wrong-group-title">${chName} <span class="wrong-group-count">(${items.length})</span></h3>
        ${items.map(w => `
          <div class="wrong-item ${w.status}" data-qid="${w.questionId}">
            <div class="wrong-item-header">
              <span class="badge badge-${Helpers.wrongStatusClass(w.status)}">${Helpers.wrongStatusText(w.status)}</span>
              <span class="wrong-item-count">错${w.wrongCount}次</span>
              <span class="wrong-item-date">${w.lastWrongDate || w.addedDate}</span>
            </div>
            <div class="wrong-item-question">${Helpers.escape(w.question.question)}</div>
            <div class="wrong-item-actions">
              <button class="btn btn-primary btn-sm" onclick="WrongBookView.redo('${w.questionId}')">${Helpers.icon('refresh', 14)} 重做</button>
              <button class="btn btn-secondary btn-sm" onclick="WrongBookView.showDetail('${w.questionId}')">查看详情</button>
              <button class="btn btn-danger btn-sm" onclick="WrongBookView.remove('${w.questionId}')">删除</button>
            </div>
          </div>
        `).join('')}
      </div>
    `).join('');
  },

  setFilter(filter) {
    this.currentFilter = filter;
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.filter === filter);
    });

    const wrongbook = Store.getWrongBook();
    const wrongQuestions = wrongbook.map(w => {
      const q = Helpers.getQuestion(w.questionId);
      return q ? { ...w, question: q } : null;
    }).filter(Boolean);

    document.getElementById('wrongList').innerHTML = this.renderWrongList(wrongQuestions);
  },

  redo(questionId) {
    const question = Helpers.getQuestion(questionId);
    if (!question) return;

    const contentArea = document.getElementById('contentArea');
    contentArea.innerHTML = `
      <div class="page">
        <div class="page-header">
          <button class="btn btn-secondary" onclick="WrongBookView.render()">${Helpers.icon('chevronLeft', 14)} 返回错题本</button>
          <h1 class="page-title">重做错题</h1>
        </div>
        ${QuestionCard.render(question, { index: 1, mode: 'redo' })}
        <div id="redoResult"></div>
      </div>
    `;

    // 监听答题完成
    setTimeout(() => {
      const observer = new MutationObserver(() => {
        const card = document.querySelector(`[data-question-id="${questionId}"]`);
        if (card && card.classList.contains('answered')) {
          const isCorrect = card.querySelector('.question-feedback.correct');
          Store.updateWrongStatus(questionId, !!isCorrect);
          Navbar.updateWrongBadge();
          observer.disconnect();
        }
      });
      const target = document.querySelector(`[data-question-id="${questionId}"]`);
      if (target) observer.observe(target, { attributes: true, attributeFilter: ['class'] });
    }, 100);
  },

  showDetail(questionId) {
    const question = Helpers.getQuestion(questionId);
    if (!question) return;

    const contentArea = document.getElementById('contentArea');
    contentArea.innerHTML = `
      <div class="page">
        <div class="page-header">
          <button class="btn btn-secondary" onclick="WrongBookView.render()">${Helpers.icon('chevronLeft', 14)} 返回错题本</button>
          <h1 class="page-title">题目详情</h1>
        </div>
        ${QuestionCard.render(question, { index: 1 })}
      </div>
    `;
  },

  remove(questionId) {
    Store.removeFromWrongBook(questionId);
    Helpers.notify('已删除', 'info', 1200);
    this.render();
    Navbar.updateWrongBadge();
  },

  clearMastered() {
    Store.clearMastered();
    Helpers.notify('已清除已掌握的错题', 'success', 1500);
    this.render();
    Navbar.updateWrongBadge();
  }
};
