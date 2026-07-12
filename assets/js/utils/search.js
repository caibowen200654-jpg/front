/* ============================================
   搜索引擎
   ============================================ */

const SearchEngine = {
  index: [],

  // 构建索引
  buildIndex() {
    this.index = [];
    const chapters = window.NCRE2?.chapters || [];
    const questions = window.NCRE2?.questions || [];
    const flashcards = window.NCRE2?.flashcards || [];

    // 知识点索引
    chapters.forEach(ch => {
      ch.knowledgePoints.forEach(kp => {
        const contentText = [
          kp.summary || '',
          kp.content?.definition || '',
          kp.content?.details || '',
          (kp.content?.features || []).join(' '),
          (kp.content?.keyPoints || []).join(' '),
          kp.examTips || ''
        ].join(' ');
        this.index.push({
          type: '知识点',
          typeIcon: 'book',
          id: kp.id,
          chapterId: ch.id,
          title: `${kp.code} ${kp.title}`,
          snippet: (kp.summary || kp.content?.definition || '').substring(0, 80),
          content: contentText,
          keywords: `${kp.code} ${kp.title} ${ch.title}`,
          route: `#/study/${ch.id}/${kp.id}`
        });
      });
    });

    // 题目索引
    questions.forEach(q => {
      this.index.push({
        type: '题目',
        typeIcon: 'target',
        id: q.id,
        chapterId: q.chapterId,
        title: q.question.substring(0, 60),
        snippet: q.options.join(' ').substring(0, 80),
        content: `${q.question} ${q.options.join(' ')} ${q.analysis}`,
        keywords: (q.tags || []).join(' '),
        route: `#/study/${q.chapterId}/${q.knowledgePointId}`
      });
    });

    // 速记卡索引
    flashcards.forEach(fc => {
      this.index.push({
        type: '速记卡',
        typeIcon: 'flashcard',
        id: fc.id,
        chapterId: fc.chapterId,
        title: fc.front,
        snippet: fc.back.substring(0, 80),
        content: `${fc.front} ${fc.back} ${fc.hint || ''}`,
        keywords: fc.front,
        route: `#/flashcards`
      });
    });
  },

  // 搜索
  search(query) {
    if (!query || query.trim().length === 0) return [];
    const q = query.trim().toLowerCase();

    return this.index
      .map(item => {
        const titleMatch = item.title.toLowerCase().includes(q);
        const contentMatch = item.content.toLowerCase().includes(q);
        const keywordMatch = item.keywords.toLowerCase().includes(q);

        let score = 0;
        if (titleMatch) score += 3;
        if (keywordMatch) score += 2;
        if (contentMatch) score += 1;

        if (score === 0) return null;

        // 高亮匹配
        const highlightedSnippet = this.highlight(item.snippet, q);
        const highlightedTitle = this.highlight(item.title, q);

        return { ...item, score, highlightedTitle, highlightedSnippet };
      })
      .filter(Boolean)
      .sort((a, b) => b.score - a.score)
      .slice(0, 20);
  },

  // 高亮关键词
  highlight(text, query) {
    if (!query) return Helpers.escape(text);
    const escaped = Helpers.escape(text);
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return escaped.replace(regex, '<mark>$1</mark>');
  }
};
