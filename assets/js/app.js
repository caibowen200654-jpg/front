/* ============================================
   主应用逻辑
   ============================================ */

const App = {
  init() {
    // 初始化主题
    ThemeToggle.init();

    // 初始化导航栏
    Navbar.init();

    // 初始化侧边栏
    Sidebar.init();

    // 初始化搜索
    SearchModal.init();

    // 注册路由
    Router.register('home', (params) => HomeView.render(params));
    Router.register('study', (params) => StudyView.render(params));
    Router.register('practice', (params) => PracticeView.render(params));
    Router.register('wrongbook', (params) => WrongBookView.render(params));
    Router.register('mock', (params) => MockExamView.render(params));
    Router.register('favorites', (params) => FavoritesView.render(params));
    Router.register('flashcards', (params) => FlashcardsView.render(params));
    Router.register('settings', (params) => SettingsView.render(params));

    // 初始化路由
    Router.init();

    // 检查URL同步参数（从二维码或同步链接进入）
    SyncManager.autoSyncFromURL();

    // 如果已配置Firebase，自动初始化
    if (SyncManager.isFirebaseEnabled()) {
      // Firebase SDK用defer加载，需要等一下
      setTimeout(async () => {
        const ok = await SyncManager.initFirebase();
        if (ok) {
          SyncManager.setupAutoSync();
          console.log('Firebase自动同步已启动');
        }
      }, 2000);
    }

    // 侧边栏遮罩点击关闭
    const overlay = document.getElementById('sidebarOverlay');
    if (overlay) {
      overlay.addEventListener('click', () => Sidebar.closeMobile());
    }

    console.log('%c计算机二级MS Office · 选择题精练', 'color: #8B4513; font-size: 16px; font-weight: bold;');
    console.log(`%c已加载: ${window.NCRE2?.chapters?.length || 0}个章节, ${window.NCRE2?.questions?.length || 0}道题目, ${window.NCRE2?.flashcards?.length || 0}张速记卡`, 'color: #6B5D52;');
  }
};

// 启动应用
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
