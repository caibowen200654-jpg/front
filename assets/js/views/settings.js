/* ============================================
   设置/同步管理视图
   ============================================ */

const SettingsView = {
  render() {
    Sidebar.hide();
    const cloudInfo = SyncManager.getCloudSyncInfo();
    const fbConfig = SyncManager.getFirebaseConfig();
    const fbEnabled = SyncManager.isFirebaseEnabled();
    const fbUID = SyncManager.getFirebaseUID();
    const dataCount = Object.keys(localStorage).filter(k => k.startsWith('ncre2_')).length;
    const dataSize = new Blob(Object.values(localStorage).map(v => v)).size;

    const contentArea = document.getElementById('contentArea');
    contentArea.innerHTML = `
      <div class="page settings-page">
        <div class="page-header">
          <h1 class="page-title">设置 · 数据同步</h1>
          <p class="page-subtitle">多设备同步方案，让学习进度在手机和电脑间无缝衔接</p>
        </div>

        <!-- 数据概览 -->
        <div class="card sync-overview-card">
          <h2 class="card-title">本地数据</h2>
          <div class="sync-overview">
            <div class="sync-stat">
              <span class="sync-stat-label">数据条目</span>
              <span class="sync-stat-value">${dataCount} 项</span>
            </div>
            <div class="sync-stat">
              <span class="sync-stat-label">数据大小</span>
              <span class="sync-stat-value">${(dataSize / 1024).toFixed(1)} KB</span>
            </div>
            <div class="sync-stat">
              <span class="sync-stat-label">上次备份</span>
              <span class="sync-stat-value">${cloudInfo.date ? Helpers.formatDate(cloudInfo.date) + ' ' + new Date(cloudInfo.date).toLocaleTimeString('zh-CN', {hour:'2-digit',minute:'2-digit'}) : '从未'}</span>
            </div>
          </div>
        </div>

        <!-- 方案1: 导出/导入JSON -->
        <div class="card sync-method-card">
          <div class="sync-method-header">
            <div class="sync-method-icon">${Helpers.icon('book', 24)}</div>
            <div>
              <h2 class="sync-method-title">方案一 · 导出/导入文件</h2>
              <p class="sync-method-desc">将学习数据导出为JSON文件，传输到其他设备后导入。完全离线，无需网络。</p>
            </div>
          </div>
          <div class="sync-method-actions">
            <button class="btn btn-primary" onclick="SyncManager.exportToFile()">
              ${Helpers.icon('arrowRight', 14)} 导出数据为文件
            </button>
            <label class="btn btn-secondary">
              ${Helpers.icon('refresh', 14)} 从文件导入
              <input type="file" accept=".json" style="display:none" onchange="SettingsView.handleImportFile(this)">
            </label>
          </div>
        </div>

        <!-- 方案2: 云端同步码 -->
        <div class="card sync-method-card">
          <div class="sync-method-header">
            <div class="sync-method-icon">${Helpers.icon('mock', 24)}</div>
            <div>
              <h2 class="sync-method-title">方案二 · 云端同步码（免注册）</h2>
              <p class="sync-method-desc">上传数据到云端获取同步码，在其他设备输入同步码即可拉取数据。使用 jsonblob.com 免费服务，无需注册。同步码有效期为24小时，过期后需重新上传获取新码。</p>
            </div>
          </div>
          <div class="sync-method-body">
            ${cloudInfo.id ? `
              <div class="sync-code-display">
                <label>当前同步码${cloudInfo.expired ? '<span class="badge badge-hard">已过期</span>' : ''}</label>
                <div class="sync-code-value" onclick="SettingsView.copyText('${cloudInfo.id}')">${cloudInfo.id}</div>
                <span class="sync-code-hint">点击复制${cloudInfo.expires && !cloudInfo.expired ? ' · 有效期至 ' + Helpers.formatDate(cloudInfo.expires) + ' ' + new Date(cloudInfo.expires).toLocaleTimeString('zh-CN', {hour:'2-digit',minute:'2-digit'}) : ''}</span>
              </div>
              ${cloudInfo.expired ? '<p class="sync-hint" style="color:var(--accent-danger)">此同步码已过期，请重新上传以获取新同步码。</p>' : ''}
            ` : ''}
            <div class="sync-method-actions">
              <button class="btn btn-primary" onclick="SettingsView.uploadToCloud()">
                ${Helpers.icon('arrowRight', 14)} 上传获取同步码
              </button>
              ${cloudInfo.id && !cloudInfo.expired ? `
                <button class="btn btn-secondary" onclick="SettingsView.updateToCloud()">
                  ${Helpers.icon('refresh', 14)} 更新云端数据
                </button>
              ` : ''}
              <div class="sync-code-input-group">
                <input type="text" id="cloudSyncInput" placeholder="输入同步码..." value="">
                <button class="btn btn-secondary" onclick="SettingsView.downloadFromCloud()">
                  ${Helpers.icon('refresh', 14)} 从云端恢复
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 方案3: 二维码同步 -->
        <div class="card sync-method-card">
          <div class="sync-method-header">
            <div class="sync-method-icon">${Helpers.icon('flashcard', 24)}</div>
            <div>
              <h2 class="sync-method-title">方案三 · 二维码同步</h2>
              <p class="sync-method-desc">生成二维码，用手机扫码直接打开带数据的网页。适合快速将电脑数据传到手机。</p>
            </div>
          </div>
          <div class="sync-method-actions">
            <button class="btn btn-primary" onclick="SettingsView.generateQR()">
              ${Helpers.icon('flashcard', 14)} 生成同步二维码
            </button>
          </div>
          <div class="qr-container hidden" id="qrContainer">
            <div id="qrCodeArea"></div>
            <div id="qrSyncInfo"></div>
          </div>
        </div>

        <!-- 方案4: Firebase自动同步 -->
        <div class="card sync-method-card">
          <div class="sync-method-header">
            <div class="sync-method-icon">${Helpers.icon('refresh', 24)}</div>
            <div>
              <h2 class="sync-method-title">方案四 · Firebase自动云同步${fbEnabled ? '<span class="badge badge-easy">已启用</span>' : ''}</h2>
              <p class="sync-method-desc">配置Google Firebase后，数据变更自动同步到云端，打开网页自动拉取最新数据。最省心的方案。</p>
            </div>
          </div>
          <div class="sync-method-body">
            ${fbEnabled && fbUID ? `
              <div class="firebase-status">
                <span class="badge badge-easy">已连接</span>
                <span class="text-secondary">UID: ${fbUID.substring(0, 12)}...</span>
                <button class="btn btn-secondary btn-sm" onclick="SettingsView.fbSyncNow()">立即同步</button>
                <button class="btn btn-secondary btn-sm" onclick="SettingsView.fbDownload()">从云端恢复</button>
              </div>
            ` : `
              <div class="firebase-setup">
                <p class="firebase-setup-hint">配置步骤：</p>
                <ol class="firebase-steps">
                  <li>访问 <a href="https://console.firebase.google.com" target="_blank">Firebase控制台</a>，创建新项目（免费）</li>
                  <li>在项目中添加"Web应用"，复制配置信息</li>
                  <li>在"Authentication"中启用"匿名"登录方式</li>
                  <li>在"Realtime Database"中创建数据库，规则设为 <code>{"rules": {".read": "auth != null", ".write": "auth != null"}}</code></li>
                  <li>将配置粘贴到下方</li>
                </ol>
                <div class="firebase-config-input">
                  <textarea id="firebaseConfigInput" placeholder='粘贴Firebase配置，格式如：
{
  "apiKey": "AIza...",
  "authDomain": "your-app.firebaseapp.com",
  "databaseURL": "https://your-app-default-rtdb.firebaseio.com",
  "projectId": "your-app",
  "storageBucket": "your-app.appspot.com",
  "messagingSenderId": "1234567890",
  "appId": "1:1234567890:web:abc123"
}' rows="8"></textarea>
                  <button class="btn btn-primary" onclick="SettingsView.saveFirebaseConfig()">保存并连接</button>
                </div>
              </div>
            `}
          </div>
        </div>

        <!-- 清除数据 -->
        <div class="card danger-card">
          <h2 class="card-title">危险操作</h2>
          <p class="text-secondary" style="margin-bottom:16px;">清除所有本地学习数据（不会影响已上传的云端数据）</p>
          <button class="btn btn-danger" onclick="SettingsView.clearAllData()">
            ${Helpers.icon('x', 14)} 清除所有本地数据
          </button>
        </div>
      </div>
    `;
  },

  // 导入文件处理
  handleImportFile(input) {
    const file = input.files[0];
    if (!file) return;
    if (confirm(`确认从文件 "${file.name}" 导入数据？这将覆盖当前的学习进度。`)) {
      SyncManager.importFromFile(file);
    }
    input.value = '';
  },

  // 上传到云端
  async uploadToCloud() {
    const id = await SyncManager.uploadToCloud();
    if (id) {
      setTimeout(() => this.render(), 500);
    }
  },

  // 更新云端数据（PUT，同步码不变）
  async updateToCloud() {
    const id = await SyncManager.updateToCloud();
    if (id) {
      setTimeout(() => this.render(), 500);
    }
  },

  // 从云端下载
  async downloadFromCloud() {
    const syncId = document.getElementById('cloudSyncInput')?.value.trim();
    if (!syncId) {
      Helpers.notify('请输入同步码', 'error');
      return;
    }
    if (confirm('确认从云端恢复数据？这将覆盖当前的学习进度。')) {
      await SyncManager.downloadFromCloud(syncId);
    }
  },

  // 生成二维码
  async generateQR() {
    const container = document.getElementById('qrContainer');
    container.classList.remove('hidden');
    container.innerHTML = '<div class="qr-loading">正在生成二维码...</div>';

    // 重新创建二维码区域
    const qrCodeArea = document.createElement('div');
    qrCodeArea.id = 'qrCodeArea';
    const qrSyncInfo = document.createElement('div');
    qrSyncInfo.id = 'qrSyncInfo';
    container.innerHTML = '';
    container.appendChild(qrCodeArea);
    container.appendChild(qrSyncInfo);

    await SyncManager.generateQRCode('qrCodeArea');
  },

  // Firebase配置保存
  async saveFirebaseConfig() {
    const text = document.getElementById('firebaseConfigInput').value.trim();
    if (!text) {
      Helpers.notify('请粘贴Firebase配置', 'error');
      return;
    }

    try {
      const config = JSON.parse(text);
      const required = ['apiKey', 'authDomain', 'databaseURL', 'projectId', 'appId'];
      const missing = required.filter(k => !config[k]);
      if (missing.length > 0) {
        Helpers.notify('配置缺少字段: ' + missing.join(', '), 'error');
        return;
      }

      SyncManager.setFirebaseConfig(config);
      Helpers.notify('配置已保存，正在连接Firebase...', 'info', 2000);

      const success = await SyncManager.initFirebase();
      if (success) {
        Helpers.notify('Firebase连接成功！', 'success');
        SyncManager.setupAutoSync();
        // 立即上传一次
        await SyncManager.syncToFirebase();
        this.render();
      }
    } catch (e) {
      Helpers.notify('配置格式错误，请粘贴有效的JSON: ' + e.message, 'error');
    }
  },

  // Firebase立即同步
  async fbSyncNow() {
    await SyncManager.syncToFirebase();
  },

  // Firebase从云端恢复
  async fbDownload() {
    if (confirm('确认从Firebase云端恢复数据？这将覆盖当前的学习进度。')) {
      await SyncManager.syncFromFirebase();
    }
  },

  // 复制文本
  copyText(text) {
    navigator.clipboard.writeText(text).then(() => {
      Helpers.notify('已复制到剪贴板', 'success', 1500);
    }).catch(() => {
      // 降级方案
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      Helpers.notify('已复制到剪贴板', 'success', 1500);
    });
  },

  // 清除所有数据
  clearAllData() {
    if (!confirm('警告：这将永久删除所有本地学习数据，包括进度、错题、收藏等。确定继续吗？')) {
      return;
    }
    if (!confirm('再次确认：此操作不可撤销！是否真的要清除所有数据？')) {
      return;
    }
    Object.keys(localStorage).filter(k => k.startsWith('ncre2_')).forEach(k => {
      localStorage.removeItem(k);
    });
    Helpers.notify('所有数据已清除，页面将刷新...', 'success', 2000);
    setTimeout(() => window.location.reload(), 1500);
  }
};
