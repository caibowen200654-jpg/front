/* ============================================
   模拟测试视图
   ============================================ */

const MockExamView = {
  state: null,
  timer: null,

  render(params) {
    Sidebar.hide();

    // 根据参数决定渲染哪个阶段
    if (!params || params.length === 0) {
      this.renderConfig();
    } else if (params[0] === 'exam') {
      this.renderExam();
    } else if (params[0] === 'result' && params[1]) {
      this.renderResult(params[1]);
    }
  },

  // 配置页
  renderConfig() {
    const mockExams = Store.getMockExams();
    const contentArea = document.getElementById('contentArea');

    contentArea.innerHTML = `
      <div class="page">
        <div class="page-header">
          <h1 class="page-title">模拟测试</h1>
          <p class="page-subtitle">全真模拟考试环境，20题限时40分钟，按真实考试比例出题</p>
        </div>

        <div class="mock-config-card">
          <h2 class="card-title">考试信息</h2>
          <div class="mock-info-grid">
            <div class="mock-info-item">
              <span class="mock-info-label">题量</span>
              <span class="mock-info-value">20题</span>
            </div>
            <div class="mock-info-item">
              <span class="mock-info-label">时间</span>
              <span class="mock-info-value">40分钟</span>
            </div>
            <div class="mock-info-item">
              <span class="mock-info-label">分值</span>
              <span class="mock-info-value">每题1分，共20分</span>
            </div>
            <div class="mock-info-item">
              <span class="mock-info-label">题型</span>
              <span class="mock-info-value">单项选择题</span>
            </div>
          </div>

          <div class="mock-distribution">
            <h3 class="section-title">出题分布</h3>
            <div class="distribution-list">
              <div class="distribution-item"><span>数据结构与算法</span><span>3题</span></div>
              <div class="distribution-item"><span>程序设计基础</span><span>2题</span></div>
              <div class="distribution-item"><span>软件工程基础</span><span>3题</span></div>
              <div class="distribution-item"><span>数据库设计基础</span><span>2题</span></div>
              <div class="distribution-item"><span>计算机基础知识</span><span>4题</span></div>
              <div class="distribution-item"><span>Office操作</span><span>6题</span></div>
            </div>
          </div>

          <button class="btn btn-primary btn-large" onclick="MockExamView.startExam()">
            ${Helpers.icon('mock', 20)} 开始模拟测试
          </button>
        </div>

        ${mockExams.length > 0 ? `
          <div class="mock-history">
            <h2 class="card-title">历史成绩</h2>
            <div class="mock-history-list">
              ${mockExams.slice(-5).reverse().map(exam => `
                <div class="mock-history-item" onclick="Router.navigate('mock/result/${exam.id}')">
                  <div class="mock-history-score ${exam.score >= 15 ? 'good' : exam.score >= 10 ? 'ok' : 'bad'}">${exam.score}</div>
                  <div class="mock-history-info">
                    <div>${exam.date}</div>
                    <div class="text-secondary">用时 ${Helpers.formatTime(exam.duration)} · 正确 ${exam.correctCount}/${exam.totalQuestions}</div>
                  </div>
                  <div class="mock-history-arrow">${Helpers.icon('chevronRight', 16)}</div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    `;
  },

  // 开始考试
  startExam() {
    // 生成题目
    const config = [
      { chapterId: 'ch1', count: 3 },
      { chapterId: 'ch2', count: 2 },
      { chapterId: 'ch3', count: 3 },
      { chapterId: 'ch4', count: 2 },
      { chapterId: 'ch5', count: 4 },
      { chapterId: 'ch6', count: 6 },
    ];

    let examQuestions = [];
    config.forEach(c => {
      const pool = Helpers.getQuestionsByChapter(c.chapterId);
      examQuestions.push(...Helpers.sample(pool, c.count));
    });
    examQuestions = Helpers.shuffle(examQuestions);

    this.state = {
      questions: examQuestions,
      answers: new Array(examQuestions.length).fill(null),
      currentIndex: 0,
      startTime: Date.now(),
      duration: 40 * 60 // 40分钟
    };

    Store.setMockState({
      questionIds: examQuestions.map(q => q.id),
      startTime: this.state.startTime,
      duration: this.state.duration
    });

    Router.navigate('mock/exam');
  },

  // 渲染考试界面
  renderExam() {
    // 恢复或检查状态
    if (!this.state) {
      const saved = Store.getMockState();
      if (saved) {
        this.state = {
          questions: saved.questionIds.map(id => Helpers.getQuestion(id)).filter(Boolean),
          answers: saved.answers || new Array(saved.questionIds.length).fill(null),
          currentIndex: 0,
          startTime: saved.startTime,
          duration: saved.duration
        };
      } else {
        Router.navigate('mock');
        return;
      }
    }

    const contentArea = document.getElementById('contentArea');
    const q = this.state.questions[this.state.currentIndex];
    const total = this.state.questions.length;
    const answered = this.state.answers.filter(a => a !== null).length;

    contentArea.innerHTML = `
      <div class="page mock-exam-page">
        <div class="mock-exam-header">
          <div class="mock-exam-timer" id="mockTimer">
            ${Helpers.icon('clock', 18)}
            <span id="timerDisplay">40:00</span>
          </div>
          <div class="mock-exam-progress">
            第 ${this.state.currentIndex + 1} / ${total} 题 · 已答 ${answered} 题
          </div>
          <button class="btn btn-danger" onclick="MockExamView.submitExam()">交卷</button>
        </div>

        <div class="mock-exam-question" id="mockQuestion">
          ${QuestionCard.render(q, { index: this.state.currentIndex + 1, mode: 'mock' })}
        </div>

        <div class="mock-exam-nav">
          <button class="btn btn-secondary" onclick="MockExamView.prevQuestion()" ${this.state.currentIndex === 0 ? 'disabled' : ''}>
            ${Helpers.icon('chevronLeft', 14)} 上一题
          </button>
          <div class="mock-question-grid">
            ${this.state.questions.map((_, i) => `
              <button class="mock-grid-btn ${this.state.answers[i] !== null ? 'answered' : ''} ${i === this.state.currentIndex ? 'current' : ''}"
                onclick="MockExamView.goToQuestion(${i})">${i + 1}</button>
            `).join('')}
          </div>
          ${this.state.currentIndex < total - 1
            ? `<button class="btn btn-primary" onclick="MockExamView.nextQuestion()">下一题 ${Helpers.icon('chevronRight', 14)}</button>`
            : `<button class="btn btn-primary" onclick="MockExamView.submitExam()">交卷</button>`
          }
        </div>
      </div>
    `;

    // 如果已答过，恢复状态
    if (this.state.answers[this.state.currentIndex] !== null) {
      this.restoreAnswer(this.state.currentIndex);
    }

    // 启动计时器
    this.startTimer();
  },

  startTimer() {
    if (this.timer) this.timer.stop();

    const elapsed = Math.floor((Date.now() - this.state.startTime) / 1000);
    const remaining = this.state.duration - elapsed;

    this.timer = new Timer({
      duration: remaining,
      onTick: (remaining) => {
        const display = document.getElementById('timerDisplay');
        if (display) {
          display.textContent = Helpers.formatTime(remaining);
          if (remaining <= 300) {
            document.getElementById('mockTimer').classList.add('timer-warning');
          }
        }
      },
      onEnd: () => {
        Helpers.notify('时间到，自动交卷', 'error', 2000);
        this.submitExam();
      }
    });
    this.timer.start();
  },

  // 恢复已答题目的选项状态
  restoreAnswer(index) {
    const question = this.state.questions[index];
    const selected = this.state.answers[index];
    if (selected === null) return;

    const card = document.querySelector(`[data-question-id="${question.id}"]`);
    if (!card || card.classList.contains('answered')) return;

    // 模拟选择
    card.classList.add('answered');
    const options = card.querySelectorAll('.option');
    options.forEach((opt, i) => {
      opt.classList.add('disabled');
      if (i === question.answer) opt.classList.add('correct');
      if (i === selected && i !== question.answer) opt.classList.add('wrong');
    });

    const feedback = document.getElementById('feedback-' + question.id);
    const isCorrect = selected === question.answer;
    feedback.className = `question-feedback ${isCorrect ? 'correct' : 'wrong'}`;
    feedback.innerHTML = isCorrect
      ? `<span class="feedback-icon">${Helpers.icon('check', 16)}</span> 回答正确`
      : `<span class="feedback-icon">${Helpers.icon('x', 16)}</span> 回答错误，正确答案是 ${String.fromCharCode(65 + question.answer)}`;
    feedback.classList.remove('hidden');

    const analysis = document.getElementById('analysis-' + question.id);
    analysis.classList.remove('hidden');
  },

  // 监听选项选择
  selectAnswer(questionId, index) {
    const qIndex = this.state.questions.findIndex(q => q.id === questionId);
    if (qIndex === -1) return;

    // 如果已经答过，不允许更改
    if (this.state.answers[qIndex] !== null) return;

    this.state.answers[qIndex] = index;

    // 调用QuestionCard的选择逻辑
    QuestionCard.select(questionId, index);
  },

  prevQuestion() {
    if (this.state.currentIndex > 0) {
      this.state.currentIndex--;
      this.renderExam();
    }
  },

  nextQuestion() {
    if (this.state.currentIndex < this.state.questions.length - 1) {
      this.state.currentIndex++;
      this.renderExam();
    }
  },

  goToQuestion(index) {
    this.state.currentIndex = index;
    this.renderExam();
  },

  // 交卷
  submitExam() {
    if (this.timer) this.timer.stop();

    const total = this.state.questions.length;
    let correct = 0;
    const answers = this.state.questions.map((q, i) => {
      const selected = this.state.answers[i];
      const isCorrect = selected === q.answer;
      if (isCorrect) correct++;
      return { questionId: q.id, selected, correct: isCorrect };
    });

    const duration = Math.floor((Date.now() - this.state.startTime) / 1000);
    const exam = Store.saveMockExam({
      duration,
      totalQuestions: total,
      correctCount: correct,
      score: correct,
      answers
    });

    Store.clearMockState();
    this.state = null;

    Router.navigate(`mock/result/${exam.id}`);
  },

  // 渲染结果
  renderResult(examId) {
    const exam = Store.getMockExam(examId);
    if (!exam) {
      Router.navigate('mock');
      return;
    }

    const score = exam.score;
    const total = exam.totalQuestions;
    const percent = Math.round((score / total) * 100);
    const passed = score >= 12; // 60%及格

    // 分类统计
    const categoryStats = {};
    exam.answers.forEach(a => {
      const q = Helpers.getQuestion(a.questionId);
      if (!q) return;
      const ch = Helpers.getChapter(q.chapterId);
      const chName = ch ? ch.title : '其他';
      if (!categoryStats[chName]) categoryStats[chName] = { total: 0, correct: 0 };
      categoryStats[chName].total++;
      if (a.correct) categoryStats[chName].correct++;
    });

    const contentArea = document.getElementById('contentArea');
    contentArea.innerHTML = `
      <div class="page mock-result-page">
        <div class="result-summary">
          ${ProgressRing.render(percent, 160, 12, score + '/' + total)}
          <div class="result-info">
            <h1 class="result-score ${passed ? 'pass' : 'fail'}">${score} 分</h1>
            <p class="result-label">${passed ? '恭喜通过！' : '继续努力！'}</p>
            <div class="result-meta">
              <span>${Helpers.icon('clock', 14)} 用时 ${Helpers.formatTime(exam.duration)}</span>
              <span>${Helpers.icon('check', 14)} 正确 ${score} 题</span>
              <span>${Helpers.icon('x', 14)} 错误 ${total - score} 题</span>
            </div>
          </div>
        </div>

        <div class="result-categories">
          <h2 class="card-title">分类得分</h2>
          <div class="category-list">
            ${Object.entries(categoryStats).map(([name, stats]) => {
              const catPercent = Math.round((stats.correct / stats.total) * 100);
              return `
                <div class="category-item">
                  <div class="category-name">${name}</div>
                  <div class="category-bar">
                    <div class="progress-bar-track">
                      <div class="progress-bar-fill ${catPercent >= 60 ? '' : 'danger'}" style="width:${catPercent}%"></div>
                    </div>
                  </div>
                  <div class="category-score">${stats.correct}/${stats.total}</div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <div class="result-review">
          <h2 class="card-title">答题回顾</h2>
          <div class="review-list">
            ${exam.answers.map((a, i) => {
              const q = Helpers.getQuestion(a.questionId);
              if (!q) return '';
              return `
                <div class="review-item">
                  <div class="review-item-header">
                    <span class="badge ${a.correct ? 'badge-easy' : 'badge-hard'}">${a.correct ? '正确' : '错误'}</span>
                    <span class="review-item-num">第${i + 1}题</span>
                    ${a.selected === null ? '<span class="badge badge-medium">未作答</span>' : ''}
                  </div>
                  ${QuestionCard.renderReadOnly(q, a.selected === null ? -1 : a.selected)}
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <div class="result-actions">
          <button class="btn btn-primary" onclick="Router.navigate('mock')">${Helpers.icon('refresh', 14)} 再考一次</button>
          <button class="btn btn-secondary" onclick="Router.navigate('home')">${Helpers.icon('home', 14)} 返回首页</button>
        </div>
      </div>
    `;
  }
};

// 监听模考中的选项点击
document.addEventListener('click', (e) => {
  const option = e.target.closest('.option');
  if (!option) return;
  const card = option.closest('.question-card');
  if (!card || card.dataset.mode !== 'mock') return;
  const questionId = card.dataset.questionId;
  const index = parseInt(option.dataset.index);
  if (MockExamView.state && !card.classList.contains('answered')) {
    MockExamView.selectAnswer(questionId, index);
  }
});
