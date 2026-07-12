/* ============================================
   章节练习视图
   ============================================ */

const PracticeView = {
  render(params) {
    Sidebar.show();
    const chapterId = params?.[0];
    if (!chapterId) {
      Router.navigate('study');
      return;
    }

    const chapter = Helpers.getChapter(chapterId);
    if (!chapter) return;

    const questions = Helpers.getQuestionsByChapter(chapterId);

    const contentArea = document.getElementById('contentArea');
    contentArea.innerHTML = `
      <div class="page">
        <div class="page-header">
          <div class="breadcrumb">
            <a href="#/study">章节学习</a>
            <span>${Helpers.icon('chevronRight', 12)}</span>
            <a href="#/study/${chapterId}">${chapter.title}</a>
            <span>${Helpers.icon('chevronRight', 12)}</span>
            <span>集中练习</span>
          </div>
          <h1 class="page-title">${chapter.title} · 集中练习</h1>
          <p class="page-subtitle">共 ${questions.length} 道题，点击选项即时查看答案和解析</p>
        </div>
        <div class="exercise-list">
          ${questions.map((q, i) => QuestionCard.render(q, { index: i + 1 })).join('')}
        </div>
      </div>
    `;
  }
};
