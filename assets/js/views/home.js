/* ============================================
   首页/仪表盘视图
   ============================================ */

const HomeView = {
  render() {
    Sidebar.hide();
    const contentArea = document.getElementById('contentArea');
    const contentArea2 = document.getElementById('contentArea');

    const progress = Store.getProgress();
    const practiceStats = Store.getPracticeStats();
    const wrongCount = Store.getWrongCount();
    const mockExams = Store.getMockExams();
    const totalKp = Helpers.getTotalKpCount();
    const learnedKp = progress.learnedKnowledgePoints.length;
    const learnPercent = totalKp > 0 ? Math.round((learnedKp / totalKp) * 100) : 0;

    // 学习热力图数据
    const studyDates = progress.studyDates || [];
    const heatmap = this.renderHeatmap(studyDates);

    // 模考趋势
    const mockTrend = this.renderMockTrend(mockExams);

    // 备考阶段建议
    const studyPlan = this.getStudyPlan(learnedKp, totalKp);

    contentArea.innerHTML = `
      <div class="page home-page">
        <div class="page-header">
          <h1 class="page-title">学习仪表盘</h1>
          <p class="page-subtitle">计算机二级MS Office · 选择题精练 · 距考试约2个月</p>
        </div>

        <!-- 总体概览 -->
        <div class="dashboard-overview grid grid-4">
          <div class="stat-card">
            <div class="stat-icon">${Helpers.icon('study', 24)}</div>
            <div class="stat-value">${learnedKp}/${totalKp}</div>
            <div class="stat-label">已学知识点</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">${Helpers.icon('target', 24)}</div>
            <div class="stat-value">${practiceStats.totalAttempted}</div>
            <div class="stat-label">练习题数</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">${Helpers.icon('chart', 24)}</div>
            <div class="stat-value">${practiceStats.accuracy}%</div>
            <div class="stat-label">正确率</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">${Helpers.icon('wrongbook', 24)}</div>
            <div class="stat-value">${wrongCount}</div>
            <div class="stat-label">错题待复习</div>
          </div>
        </div>

        <!-- 进度环和学习路径 -->
        <div class="dashboard-main grid grid-2">
          <div class="card">
            <h2 class="card-title">学习进度</h2>
            <div class="progress-overview">
              ${ProgressRing.render(learnPercent, 140, 10, '知识点完成率')}
              <div class="progress-details">
                ${this.renderChapterProgress()}
              </div>
            </div>
          </div>

          <div class="card">
            <h2 class="card-title">备考路径建议</h2>
            <div class="study-plan">
              ${studyPlan}
            </div>
          </div>
        </div>

        <!-- 学习热力图和模考趋势 -->
        <div class="dashboard-secondary grid grid-2">
          <div class="card">
            <h2 class="card-title">学习记录</h2>
            <div class="streak-info">
              <span class="streak-icon">${Helpers.icon('fire', 18)}</span>
              <span>连续学习 <strong>${progress.studyStreak || 0}</strong> 天</span>
              <span class="streak-time">累计 ${Helpers.formatDuration(progress.studyTime || 0)}</span>
            </div>
            ${heatmap}
          </div>

          <div class="card">
            <h2 class="card-title">模考成绩趋势</h2>
            ${mockTrend}
          </div>
        </div>

        <!-- 快速入口 -->
        <div class="quick-actions">
          <h2 class="card-title">快速开始</h2>
          <div class="grid grid-3">
            <button class="action-card" onclick="Router.navigate('study')">
              ${Helpers.icon('study', 28)}
              <div class="action-title">开始学习</div>
              <div class="action-desc">系统梳理知识点</div>
            </button>
            <button class="action-card" onclick="Router.navigate('mock')">
              ${Helpers.icon('mock', 28)}
              <div class="action-title">模拟测试</div>
              <div class="action-desc">20题全真模拟</div>
            </button>
            <button class="action-card" onclick="Router.navigate('flashcards')">
              ${Helpers.icon('flashcard', 28)}
              <div class="action-title">速记卡</div>
              <div class="action-desc">高频考点速记</div>
            </button>
          </div>
        </div>
      </div>
    `;
  },

  renderChapterProgress() {
    const chapters = window.NCRE2?.chapters || [];
    const progress = Store.getProgress();

    return chapters.map(ch => {
      const total = ch.knowledgePoints.length;
      const learned = ch.knowledgePoints.filter(kp => progress.learnedKnowledgePoints.includes(kp.id)).length;
      const percent = total > 0 ? Math.round((learned / total) * 100) : 0;
      return ProgressRing.renderBar(percent, `<span class="ch-name">${ch.title}</span><span class="ch-score">${ch.score}分</span>`);
    }).join('');
  },

  renderHeatmap(studyDates) {
    const days = 30;
    const today = new Date();
    let html = '<div class="heatmap">';

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = Helpers.formatDate(date);
      const studied = studyDates.includes(dateStr);
      html += `<div class="heatmap-cell ${studied ? 'active' : ''}" title="${dateStr}${studied ? ' (已学习)' : ''}"></div>`;
    }
    html += '</div>';
    html += '<div class="heatmap-legend"><span>30天前</span><div class="heatmap-cells"><div class="heatmap-cell"></div><div class="heatmap-cell active"></div></div><span>今天</span></div>';
    return html;
  },

  renderMockTrend(exams) {
    if (exams.length === 0) {
      return `<div class="empty-state">
        <p>暂无模考记录</p>
        <button class="btn btn-primary" onclick="Router.navigate('mock')">开始第一次模考</button>
      </div>`;
    }

    const recent = exams.slice(-5);
    const maxScore = 20;
    const chartHeight = 120;
    const barWidth = 100 / recent.length;

    let bars = '';
    recent.forEach((exam, i) => {
      const h = (exam.score / maxScore) * chartHeight;
      bars += `<div class="trend-bar" style="left:${i * barWidth}%;width:${barWidth * 0.6}%;">
        <div class="trend-bar-fill" style="height:${h}px;"></div>
        <div class="trend-bar-value">${exam.score}</div>
        <div class="trend-bar-label">${exam.date.slice(5)}</div>
      </div>`;
    });

    return `
      <div class="trend-chart">
        ${bars}
      </div>
      <div class="trend-summary">
        <span>共 ${exams.length} 次模考</span>
        <span>最高 ${Math.max(...exams.map(e => e.score))} 分</span>
        <span>平均 ${Math.round(exams.reduce((s, e) => s + e.score, 0) / exams.length)} 分</span>
      </div>
    `;
  },

  getStudyPlan(learned, total) {
    const percent = total > 0 ? (learned / total) * 100 : 0;
    let phase, desc, next;

    if (percent < 25) {
      phase = '第一阶段：公共基础知识';
      desc = '重点学习数据结构与算法、程序设计基础、软件工程和数据库基础。这是选择题的难点部分，也是10分公共基础知识的来源。';
      next = '数据结构与算法';
    } else if (percent < 55) {
      phase = '第二阶段：计算机基础';
      desc = '继续完成公共基础知识，然后进入计算机基础知识部分，包括计算机概述、信息表示、硬件系统等。';
      next = '计算机基础知识';
    } else if (percent < 80) {
      phase = '第三阶段：Office操作知识';
      desc = '学习Word、Excel、PPT的操作知识。这部分相对简单，是选择题中的得分点。';
      next = 'Office操作知识';
    } else if (percent < 100) {
      phase = '第四阶段：查漏补缺';
      desc = '完成剩余知识点，重点复习错题本中的错题，使用速记卡快速过一遍高频考点。';
      next = '错题本复习';
    } else {
      phase = '冲刺阶段：模拟测试';
      desc = '所有知识点已学完，建议每周2-3次模拟测试，查漏补缺，保持手感。';
      next = '模拟测试';
    }

    return `
      <div class="plan-phase">${phase}</div>
      <p class="plan-desc">${desc}</p>
      <div class="plan-progress">
        ${ProgressRing.renderBar(Math.round(percent), '整体进度')}
      </div>
      <button class="btn btn-primary" onclick="Router.navigate('study')">继续学习 ${next} ${Helpers.icon('arrowRight', 14)}</button>
    `;
  }
};
