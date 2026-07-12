/* ============================================
   主题切换组件
   ============================================ */

const ThemeToggle = {
  currentMode: 'auto',

  init() {
    this.currentMode = Store.getTheme();
    this.apply(this.currentMode);

    // 监听系统主题变化
    window.matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', () => {
        if (this.currentMode === 'auto') this.apply('auto');
      });
  },

  apply(mode) {
    this.currentMode = mode;
    Store.setTheme(mode);

    let actualTheme = mode;
    if (mode === 'auto') {
      actualTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    document.documentElement.setAttribute('data-theme', actualTheme);

    // 更新按钮
    this.updateButton();
  },

  toggle() {
    const modes = ['auto', 'light', 'dark'];
    const currentIndex = modes.indexOf(this.currentMode);
    const nextMode = modes[(currentIndex + 1) % 3];
    this.apply(nextMode);

    const labels = { auto: '跟随系统', light: '浅色模式', dark: '深色模式' };
    Helpers.notify(labels[nextMode], 'info', 1500);
  },

  updateButton() {
    const btn = document.getElementById('themeToggle');
    if (!btn) return;
    const icons = { auto: 'auto', light: 'sun', moon: 'moon' };
    const iconMap = { auto: 'auto', light: 'sun', dark: 'moon' };
    btn.innerHTML = Helpers.icon(iconMap[this.currentMode], 18);
    btn.title = `主题：${this.currentMode === 'auto' ? '跟随系统' : this.currentMode === 'light' ? '浅色' : '深色'}`;
  },

  render() {
    return `<button class="icon-btn" id="themeToggle" title="切换主题" onclick="ThemeToggle.toggle()">
      ${Helpers.icon('auto', 18)}
    </button>`;
  }
};
