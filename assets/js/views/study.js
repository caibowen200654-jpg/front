/* ============================================
   章节学习视图
   ============================================ */

const StudyView = {
  currentChapterId: null,
  currentKpId: null,

  render(params) {
    Sidebar.show();

    // 如果没有参数，显示章节列表
    if (!params || params.length === 0) {
      this.renderChapterList();
      return;
    }

    const chapterId = params[0];
    const kpId = params[1];
    this.currentChapterId = chapterId;
    this.currentKpId = kpId;

    if (kpId) {
      this.renderKnowledgePoint(chapterId, kpId);
    } else {
      this.renderChapterDetail(chapterId);
    }
  },

  // 渲染章节列表
  renderChapterList() {
    const chapters = window.NCRE2?.chapters || [];
    const progress = Store.getProgress();

    const contentArea = document.getElementById('contentArea');
    contentArea.innerHTML = `
      <div class="page">
        <div class="page-header">
          <h1 class="page-title">章节学习</h1>
          <p class="page-subtitle">选择题共20分，含公共基础知识10分 + 计算机基础4分 + Office操作6分</p>
        </div>
        <div class="chapter-list">
          ${chapters.map(ch => {
            const total = ch.knowledgePoints.length;
            const learned = ch.knowledgePoints.filter(kp => progress.learnedKnowledgePoints.includes(kp.id)).length;
            const percent = total > 0 ? Math.round((learned / total) * 100) : 0;
            return `
              <div class="chapter-card" onclick="Router.navigate('study/${ch.id}')">
                <div class="chapter-card-header">
                  <div class="chapter-card-title">
                    <span class="chapter-card-code">第${ch.id.replace('ch','')}章</span>
                    ${ch.title}
                  </div>
                  <span class="chapter-card-score">${ch.score}分</span>
                </div>
                <div class="chapter-card-info">
                  <span>${total}个知识点</span>
                  <span>·</span>
                  <span>${Helpers.getQuestionsByChapter(ch.id).length}道练习题</span>
                  <span>·</span>
                  <span class="${percent === 100 ? 'text-green' : ''}">已学${learned}/${total}</span>
                </div>
                <div class="chapter-card-progress">
                  <div class="progress-bar-track">
                    <div class="progress-bar-fill" style="width:${percent}%"></div>
                  </div>
                  <span>${percent}%</span>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  },

  // 渲染章节详情（知识点列表）
  renderChapterDetail(chapterId) {
    const chapter = Helpers.getChapter(chapterId);
    if (!chapter) return;

    const progress = Store.getProgress();
    Sidebar.setActive(chapterId, null);

    const contentArea = document.getElementById('contentArea');
    contentArea.innerHTML = `
      <div class="page">
        <div class="page-header">
          <div class="breadcrumb">
            <a href="#/study">章节学习</a>
            <span>${Helpers.icon('chevronRight', 12)}</span>
            <span>${chapter.title}</span>
          </div>
          <h1 class="page-title">${chapter.title}</h1>
          <p class="page-subtitle">${chapter.part} · ${chapter.score}分 · ${chapter.knowledgePoints.length}个知识点</p>
        </div>
        <div class="kp-list">
          ${chapter.knowledgePoints.map((kp, i) => {
            const isLearned = progress.learnedKnowledgePoints.includes(kp.id);
            const questions = Helpers.getQuestionsByKp(kp.id);
            return `
              <div class="kp-card ${isLearned ? 'learned' : ''}" onclick="Router.navigate('study/${chapterId}/${kp.id}')">
                <div class="kp-card-left">
                  <div class="kp-card-code">${kp.code}</div>
                  ${isLearned ? `<div class="kp-learned-icon">${Helpers.icon('check', 16)}</div>` : ''}
                </div>
                <div class="kp-card-body">
                  <div class="kp-card-title">${kp.title}</div>
                  <div class="kp-card-summary">${kp.summary || kp.content?.definition || ''}</div>
                  <div class="kp-card-meta">
                    <span>${questions.length}道练习题</span>
                    ${kp.examTips ? `<span class="kp-card-tip">${Helpers.icon('target', 12)} 有考试提示</span>` : ''}
                  </div>
                </div>
                <div class="kp-card-right">
                  ${Helpers.icon('chevronRight', 16)}
                </div>
              </div>
            `;
          }).join('')}
        </div>
        <div class="page-actions">
          <button class="btn btn-primary" onclick="Router.navigate('practice/${chapterId}')">
            ${Helpers.icon('target', 16)} 章节集中练习
          </button>
        </div>
      </div>
    `;
  },

  // 渲染知识点详情
  renderKnowledgePoint(chapterId, kpId) {
    const kpData = Helpers.getKnowledgePoint(kpId);
    if (!kpData) return;

    const { ...kp } = kpData;
    const chapter = kpData.chapter;
    const questions = Helpers.getQuestionsByKp(kpId);
    const isLearned = Store.isKpLearned(kpId);
    const isFavorited = Store.isFavorited('knowledgePoint', kpId);

    Sidebar.setActive(chapterId, kpId);

    // 找上一个和下一个知识点
    const allKps = chapter.knowledgePoints;
    const currentIndex = allKps.findIndex(k => k.id === kpId);
    const prevKp = currentIndex > 0 ? allKps[currentIndex - 1] : null;
    const nextKp = currentIndex < allKps.length - 1 ? allKps[currentIndex + 1] : null;

    const contentArea = document.getElementById('contentArea');
    contentArea.innerHTML = `
      <div class="page study-page">
        <div class="page-header">
          <div class="breadcrumb">
            <a href="#/study">章节学习</a>
            <span>${Helpers.icon('chevronRight', 12)}</span>
            <a href="#/study/${chapterId}">${chapter.title}</a>
            <span>${Helpers.icon('chevronRight', 12)}</span>
            <span>${kp.code} ${kp.title}</span>
          </div>
          <div class="kp-detail-header">
            <div>
              <h1 class="page-title"><span class="kp-code-badge">[${kp.code}]</span> ${kp.title}</h1>
              <p class="page-subtitle">${kp.summary || ''}</p>
            </div>
            <div class="kp-actions">
              <button class="icon-btn-sm ${isFavorited ? 'active' : ''}" onclick="StudyView.toggleFav('${kpId}', this)" title="收藏知识点">
                ${Helpers.icon(isFavorited ? 'starFilled' : 'star', 16)}
              </button>
              <button class="btn ${isLearned ? 'btn-success' : 'btn-primary'}" id="learnBtn" onclick="StudyView.toggleLearned('${kpId}')">
                ${isLearned ? Helpers.icon('check', 16) + ' 已学习' : '标记为已学'}
              </button>
            </div>
          </div>
        </div>

        <!-- 知识点内容 -->
        <div class="kp-content">
          ${kp.content?.definition ? `
            <div class="content-section">
              <h3 class="content-section-title">定义</h3>
              <p>${kp.content.definition}</p>
            </div>
          ` : ''}

          ${kp.content?.details ? `
            <div class="content-section">
              <h3 class="content-section-title">详细讲解</h3>
              <div class="content-details">${kp.content.details.split('\n\n').map(p => `<p>${p}</p>`).join('')}</div>
            </div>
          ` : ''}

          ${kp.content?.features && kp.content.features.length > 0 ? `
            <div class="content-section">
              <h3 class="content-section-title">基本特征</h3>
              <ul class="feature-list">
                ${kp.content.features.map(f => `<li>${f}</li>`).join('')}
              </ul>
            </div>
          ` : ''}

          ${kp.content?.keyPoints && kp.content.keyPoints.length > 0 ? `
            <div class="content-section">
              <h3 class="content-section-title">关键要点</h3>
              <div class="key-points">
                ${kp.content.keyPoints.map(p => `<div class="key-point-item">${Helpers.icon('check', 14)} ${p}</div>`).join('')}
              </div>
            </div>
          ` : ''}

          ${kp.examTips ? `
            <div class="content-section exam-tips-section">
              <h3 class="content-section-title">${Helpers.icon('target', 14)} 考试提示</h3>
              <div class="exam-tips">${kp.examTips}</div>
            </div>
          ` : ''}
        </div>

        <!-- 练习题 -->
        ${questions.length > 0 ? `
          <div class="kp-exercises">
            <h2 class="section-title">练习题 <span class="section-count">(${questions.length}题)</span></h2>
            <div class="exercise-list">
              ${questions.map((q, i) => QuestionCard.render(q, { index: i + 1 })).join('')}
            </div>
          </div>
        ` : ''}

        <!-- 翻页导航 -->
        <div class="page-nav">
          ${prevKp ? `<button class="btn btn-secondary" onclick="Router.navigate('study/${chapterId}/${prevKp.id}')">${Helpers.icon('chevronLeft', 14)} ${prevKp.code} ${prevKp.title}</button>` : '<div></div>'}
          ${nextKp ? `<button class="btn btn-secondary" onclick="Router.navigate('study/${chapterId}/${nextKp.id}')">${nextKp.code} ${nextKp.title} ${Helpers.icon('chevronRight', 14)}</button>` : '<div></div>'}
        </div>
      </div>
    `;
  },

  toggleLearned(kpId) {
    const isLearned = Store.isKpLearned(kpId);
    if (isLearned) {
      Store.unmarkKpLearned(kpId);
      Helpers.notify('已取消标记', 'info', 1200);
    } else {
      Store.markKpLearned(kpId);
      Helpers.notify('已标记为已学习', 'success', 1200);
    }
    // 重新渲染
    this.renderKnowledgePoint(this.currentChapterId, kpId);
  },

  toggleFav(kpId, btn) {
    const added = Store.toggleFavorite('knowledgePoint', kpId);
    btn.classList.toggle('active', added);
    btn.innerHTML = Helpers.icon(added ? 'starFilled' : 'star', 16);
    Helpers.notify(added ? '已收藏' : '已取消收藏', 'info', 1200);
  }
};
