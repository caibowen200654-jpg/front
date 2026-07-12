/* ============================================
   搜索弹窗组件
   ============================================ */

const SearchModal = {
  isOpen: false,

  init() {
    // 构建搜索索引
    SearchEngine.buildIndex();

    // ESC关闭
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) this.close();
    });
  },

  open() {
    this.isOpen = true;
    const modal = document.getElementById('searchModal');
    modal.innerHTML = this.render();
    modal.classList.remove('hidden');

    // 聚焦输入框
    setTimeout(() => {
      const input = document.getElementById('searchInput');
      if (input) input.focus();
    }, 50);

    // 绑定输入事件（防抖）
    const input = document.getElementById('searchInput');
    if (input) {
      input.addEventListener('input', Helpers.debounce((e) => {
        this.search(e.target.value);
      }, 200));
    }

    // 点击遮罩关闭
    modal.querySelector('.search-modal-overlay').addEventListener('click', (e) => {
      if (e.target.classList.contains('search-modal-overlay')) this.close();
    });
  },

  close() {
    this.isOpen = false;
    const modal = document.getElementById('searchModal');
    modal.classList.add('hidden');
    modal.innerHTML = '';
  },

  render() {
    return `
      <div class="search-modal-overlay">
        <div class="search-modal-content">
          <div class="search-modal-header">
            ${Helpers.icon('search', 18)}
            <input type="text" id="searchInput" placeholder="搜索知识点、题目、速记卡..." autocomplete="off">
            <button class="icon-btn" onclick="SearchModal.close()" title="关闭 (ESC)">
              ${Helpers.icon('x', 18)}
            </button>
          </div>
          <div class="search-modal-results" id="searchResults">
            <div class="search-hint">
              输入关键词搜索，支持知识点、题目、速记卡
              <div class="search-hint-shortcut">按 ESC 关闭</div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  search(query) {
    const results = SearchEngine.search(query);
    const container = document.getElementById('searchResults');

    if (!query || query.trim().length === 0) {
      container.innerHTML = `<div class="search-hint">输入关键词搜索，支持知识点、题目、速记卡<div class="search-hint-shortcut">按 ESC 关闭</div></div>`;
      return;
    }

    if (results.length === 0) {
      container.innerHTML = `<div class="search-empty">未找到与 "${Helpers.escape(query)}" 相关的结果</div>`;
      return;
    }

    container.innerHTML = results.map(r => `
      <div class="search-result-item" onclick="SearchModal.goTo('${r.route}')">
        <div class="search-result-header">
          <span class="search-result-type">${r.type}</span>
          <span class="search-result-title">${r.highlightedTitle}</span>
        </div>
        <div class="search-result-snippet">${r.highlightedSnippet}</div>
      </div>
    `).join('');
  },

  goTo(route) {
    this.close();
    window.location.hash = route.replace('#', '');
  }
};
