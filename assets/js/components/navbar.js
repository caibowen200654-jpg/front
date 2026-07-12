/* ============================================
   导航栏组件
   ============================================ */

const Navbar = {
  navItems: [
    { route: 'home', label: '首页', icon: 'home' },
    { route: 'study', label: '章节学习', icon: 'study' },
    { route: 'wrongbook', label: '错题本', icon: 'wrongbook' },
    { route: 'mock', label: '模拟测试', icon: 'mock' },
    { route: 'flashcards', label: '速记卡', icon: 'flashcard' },
    { route: 'favorites', label: '收藏夹', icon: 'favorites' },
    { route: 'settings', label: '设置', icon: 'refresh' },
  ],

  init() {
    this.render();
  },

  render() {
    const navbar = document.getElementById('navbar');
    const wrongCount = Store.getWrongCount();
    const currentPath = Helpers.parseHash()[0] || 'home';

    navbar.innerHTML = `
      <div class="navbar-logo">
        <svg class="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M4 19.5A2.5 2.5 0 016.5 17H20M4 4.5A2.5 2.5 0 016.5 2H20v15H6.5A2.5 2.5 0 004 19.5z"/>
        </svg>
        <span>二级MS · 选择题精练</span>
      </div>
      <div class="navbar-nav">
        ${this.navItems.map(item => `
          <button class="navbar-item ${currentPath === item.route ? 'active' : ''}" data-route="${item.route}" onclick="Router.navigate('${item.route === 'home' ? '' : item.route}')">
            ${Helpers.icon(item.icon, 15)}
            <span class="nav-label">${item.label}</span>
            ${item.route === 'wrongbook' && wrongCount > 0 ? `<span class="badge">${wrongCount}</span>` : ''}
          </button>
        `).join('')}
      </div>
      <div class="navbar-right">
        <button class="icon-btn" id="searchBtn" title="搜索 (Ctrl+K)" onclick="SearchModal.open()">
          ${Helpers.icon('search', 18)}
        </button>
        ${ThemeToggle.render()}
        <button class="icon-btn mobile-menu-btn hidden" id="mobileMenuBtn" title="目录" onclick="Sidebar.toggleMobile()">
          ${Helpers.icon('menu', 18)}
        </button>
      </div>
    `;

    // 渲染移动端底部Tab栏
    this.renderMobileTabbar(currentPath, wrongCount);

    ThemeToggle.updateButton();

    // 全局快捷键 Ctrl+K
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        SearchModal.open();
      }
    });
  },

  renderMobileTabbar(currentPath, wrongCount) {
    let tabbar = document.getElementById('mobileTabbar');
    if (!tabbar) {
      tabbar = document.createElement('div');
      tabbar.id = 'mobileTabbar';
      tabbar.className = 'mobile-tabbar';
      document.body.appendChild(tabbar);
    }
    tabbar.innerHTML = this.navItems.map(item => `
      <button class="mobile-tabbar-item ${currentPath === item.route ? 'active' : ''}" onclick="Router.navigate('${item.route === 'home' ? '' : item.route}')">
        ${Helpers.icon(item.icon, 20)}
        <span>${item.label}</span>
        ${item.route === 'wrongbook' && wrongCount > 0 ? `<span class="badge">${wrongCount}</span>` : ''}
      </button>
    `).join('');
  },

  updateWrongBadge() {
    this.render();
  }
};
