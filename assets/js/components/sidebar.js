/* ============================================
   侧边栏组件 - 章节目录
   ============================================ */

const Sidebar = {
  init() {
    this.render();
  },

  render() {
    const sidebar = document.getElementById('sidebar');
    const chapters = window.NCRE2?.chapters || [];

    // 按部分分组
    const parts = {};
    chapters.forEach(ch => {
      if (!parts[ch.part]) parts[ch.part] = [];
      parts[ch.part].push(ch);
    });

    sidebar.innerHTML = Object.entries(parts).map(([partName, chapters]) => `
      <div class="sidebar-section">
        <div class="sidebar-section-title">${partName}</div>
        ${chapters.map(ch => `
          <div class="sidebar-chapter">
            <div class="sidebar-item sidebar-chapter-title" onclick="Sidebar.toggleChapter('${ch.id}')">
              <span class="chapter-code">[${ch.score}分]</span> ${ch.title}
            </div>
            <div class="sidebar-sub-items" id="sub-${ch.id}" style="display:none;">
              ${ch.knowledgePoints.map(kp => `
                <div class="sidebar-item sidebar-sub-item" onclick="Router.navigate('study/${ch.id}/${kp.id}')">
                  ${kp.code} ${kp.title}
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    `).join('');
  },

  toggleChapter(chapterId) {
    const sub = document.getElementById('sub-' + chapterId);
    if (sub) {
      sub.style.display = sub.style.display === 'none' ? 'block' : 'none';
    }
  },

  setActive(chapterId, kpId) {
    // 清除所有active
    document.querySelectorAll('.sidebar-item').forEach(el => el.classList.remove('active'));
    // 设置当前active
    if (chapterId) {
      const sub = document.getElementById('sub-' + chapterId);
      if (sub) {
        sub.style.display = 'block';
        if (kpId) {
          const items = sub.querySelectorAll('.sidebar-sub-item');
          // 找到匹配的item
          items.forEach(item => {
            if (item.textContent.includes(kpId.replace('kp-', '').replace('-', '.'))) {
              item.classList.add('active');
            }
          });
        }
      }
    }
  },

  toggleMobile() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    sidebar.classList.toggle('mobile-open');
    overlay.classList.toggle('show');
  },

  closeMobile() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    sidebar.classList.remove('mobile-open');
    overlay.classList.remove('show');
  },

  show() {
    document.getElementById('sidebar').style.display = 'block';
    document.getElementById('contentArea').classList.remove('no-sidebar');
    document.getElementById('contentArea').style.marginLeft = 'var(--sidebar-width)';
  },

  hide() {
    document.getElementById('sidebar').style.display = 'none';
    document.getElementById('contentArea').classList.add('no-sidebar');
    document.getElementById('contentArea').style.marginLeft = '0';
  }
};
