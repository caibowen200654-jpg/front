/* ============================================
   进度环组件 (SVG)
   ============================================ */

const ProgressRing = {
  render(percent, size = 120, strokeWidth = 8, label = '') {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percent / 100) * circumference;

    return `
      <div class="progress-ring" style="width:${size}px;height:${size}px;">
        <svg width="${size}" height="${size}">
          <circle class="progress-ring-bg" cx="${size/2}" cy="${size/2}" r="${radius}"
            fill="none" stroke="var(--border)" stroke-width="${strokeWidth}"/>
          <circle class="progress-ring-fill" cx="${size/2}" cy="${size/2}" r="${radius}"
            fill="none" stroke="var(--accent-primary)" stroke-width="${strokeWidth}"
            stroke-linecap="round"
            stroke-dasharray="${circumference}"
            stroke-dashoffset="${offset}"
            transform="rotate(-90 ${size/2} ${size/2})"/>
        </svg>
        <div class="progress-ring-label">
          <span class="progress-ring-percent">${percent}%</span>
          ${label ? `<span class="progress-ring-text">${label}</span>` : ''}
        </div>
      </div>
    `;
  },

  // 水平进度条
  renderBar(percent, label = '') {
    return `
      <div class="progress-bar-container">
        ${label ? `<div class="progress-bar-label">${label}</div>` : ''}
        <div class="progress-bar-track">
          <div class="progress-bar-fill" style="width:${percent}%"></div>
        </div>
        <span class="progress-bar-percent">${percent}%</span>
      </div>
    `;
  }
};
