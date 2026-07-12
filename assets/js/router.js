/* ============================================
   前端路由（Hash路由）
   ============================================ */

const Router = {
  routes: {},
  currentRoute: null,

  register(path, handler) {
    this.routes[path] = handler;
  },

  init() {
    window.addEventListener('hashchange', () => this.handle());
    this.handle();
  },

  handle() {
    const parts = Helpers.parseHash();
    const path = parts[0] || 'home';
    const params = parts.slice(1);

    this.currentRoute = { path, params };

    // 查找匹配的路由处理器
    const handler = this.routes[path] || this.routes['home'];
    if (handler) {
      handler(params);
    }

    // 更新导航栏激活状态
    this.updateNavActive(path);

    // 滚动到顶部
    document.getElementById('contentArea')?.scrollTo(0, 0);
    window.scrollTo(0, 0);
  },

  updateNavActive(path) {
    document.querySelectorAll('.navbar-item').forEach(item => {
      item.classList.toggle('active', item.dataset.route === path);
    });
  },

  navigate(path) {
    window.location.hash = path;
  },

  goHome() {
    this.navigate('');
  }
};
