/* ============================================
   题目卡片组件
   ============================================ */

const QuestionCard = {
  // 渲染单道题（带交互）
  render(question, options = {}) {
    const { showAnalysis = false, mode = 'practice', index = 0 } = options;
    const isFavorited = Store.isFavorited('question', question.id);
    const diffClass = Helpers.difficultyClass(question.difficulty);
    const diffText = Helpers.difficultyText(question.difficulty);

    return `
      <div class="question-card" data-question-id="${question.id}" data-mode="${mode}">
        <div class="question-header">
          <span class="question-num">${index > 0 ? `第${index}题` : ''}</span>
          <span class="badge badge-${diffClass}">${diffText}</span>
          ${question.tags ? question.tags.map(t => `<span class="tag">${t}</span>`).join('') : ''}
          <button class="icon-btn-sm fav-btn ${isFavorited ? 'active' : ''}" onclick="QuestionCard.toggleFav('${question.id}', this)" title="收藏">
            ${Helpers.icon(isFavorited ? 'starFilled' : 'star', 14)}
          </button>
        </div>
        <div class="question-body">${Helpers.escape(question.question)}</div>
        <div class="question-options" id="options-${question.id}">
          ${question.options.map((opt, i) => `
            <div class="option" data-index="${i}" onclick="QuestionCard.select('${question.id}', ${i})">
              <span class="option-letter">${String.fromCharCode(65 + i)}</span>
              <span class="option-text">${Helpers.escape(opt.replace(/^[A-D][.、]\s*/, ''))}</span>
            </div>
          `).join('')}
        </div>
        <div class="question-feedback hidden" id="feedback-${question.id}"></div>
        <div class="question-analysis hidden" id="analysis-${question.id}">
          <div class="analysis-header">${Helpers.icon('check', 14)} <span>解析</span></div>
          <div class="analysis-body">${Helpers.escape(question.analysis)}</div>
        </div>
      </div>
    `;
  },

  // 选择答案
  select(questionId, index) {
    const question = Helpers.getQuestion(questionId);
    if (!question) return;

    const card = document.querySelector(`[data-question-id="${questionId}"]`);
    if (!card || card.classList.contains('answered')) return;

    card.classList.add('answered');
    const isCorrect = index === question.answer;

    // 标记选项
    const options = card.querySelectorAll('.option');
    options.forEach((opt, i) => {
      opt.classList.add('disabled');
      if (i === question.answer) {
        opt.classList.add('correct');
      }
      if (i === index && !isCorrect) {
        opt.classList.add('wrong');
      }
    });

    // 显示反馈
    const feedback = document.getElementById('feedback-' + questionId);
    feedback.className = `question-feedback ${isCorrect ? 'correct' : 'wrong'}`;
    feedback.innerHTML = isCorrect
      ? `<span class="feedback-icon">${Helpers.icon('check', 16)}</span> 回答正确`
      : `<span class="feedback-icon">${Helpers.icon('x', 16)}</span> 回答错误，正确答案是 ${String.fromCharCode(65 + question.answer)}`;
    feedback.classList.remove('hidden');

    // 错误时震动
    if (!isCorrect) {
      card.querySelector(`.option[data-index="${index}"]`).classList.add('shake');
    }

    // 显示解析
    const analysis = document.getElementById('analysis-' + questionId);
    setTimeout(() => {
      analysis.classList.remove('hidden');
      analysis.classList.add('fade-in');
    }, 300);

    // 记录答题
    Store.recordPractice(question.knowledgePointId, isCorrect);

    if (!isCorrect) {
      Store.addToWrongBook(questionId, index);
      Navbar.updateWrongBadge();
    } else {
      // 如果在错题本中，更新状态
      Store.updateWrongStatus(questionId, true);
    }
  },

  // 切换收藏
  toggleFav(questionId, btn) {
    const added = Store.toggleFavorite('question', questionId);
    btn.classList.toggle('active', added);
    btn.innerHTML = Helpers.icon(added ? 'starFilled' : 'star', 14);
    Helpers.notify(added ? '已收藏' : '已取消收藏', 'info', 1200);
  },

  // 渲染只读题目（用于模考回顾等）
  renderReadOnly(question, selectedAnswer) {
    const isCorrect = selectedAnswer === question.answer;
    return `
      <div class="question-card answered">
        <div class="question-header">
          <span class="badge ${isCorrect ? 'badge-easy' : 'badge-hard'}">${isCorrect ? '正确' : '错误'}</span>
        </div>
        <div class="question-body">${Helpers.escape(question.question)}</div>
        <div class="question-options">
          ${question.options.map((opt, i) => {
            let cls = 'disabled';
            if (i === question.answer) cls += ' correct';
            if (i === selectedAnswer && !isCorrect) cls += ' wrong';
            return `<div class="option ${cls}"><span class="option-letter">${String.fromCharCode(65 + i)}</span><span class="option-text">${Helpers.escape(opt.replace(/^[A-D][.、]\s*/, ''))}</span></div>`;
          }).join('')}
        </div>
        <div class="question-analysis">
          <div class="analysis-header">${Helpers.icon('check', 14)} <span>解析</span></div>
          <div class="analysis-body">${Helpers.escape(question.analysis)}</div>
        </div>
      </div>
    `;
  }
};
