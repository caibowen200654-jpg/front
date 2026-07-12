/* ============================================
   数据同步管理器 - 四种同步方案
//   1. 导出/导入JSON文件
//   2. jsonblob云端同步（同步码，24小时有效期）
//   3. 二维码同步
//   4. Firebase自动云同步
//   ============================================ */

const SyncManager = {
  // === 收集所有学习数据 ===
  collectData() {
    const data = {};
    const keys = Object.keys(localStorage).filter(k => k.startsWith('ncre2_'));
    keys.forEach(k => {
      try {
        data[k] = JSON.parse(localStorage.getItem(k));
      } catch (e) {
        data[k] = localStorage.getItem(k);
      }
    });
    return {
      version: '1.0',
      exportDate: new Date().toISOString(),
      data: data
    };
  },

  // === 恢复学习数据 ===
  restoreData(packageData) {
    if (!packageData || !packageData.data) {
      Helpers.notify('数据格式错误', 'error');
      return false;
    }

    if (packageData.version !== '1.0') {
      console.warn('数据版本不匹配:', packageData.version);
    }

    try {
      Object.entries(packageData.data).forEach(([key, value]) => {
        if (key.startsWith('ncre2_')) {
          localStorage.setItem(key, JSON.stringify(value));
        }
      });
      Helpers.notify('数据恢复成功！页面将刷新...', 'success', 2000);
      setTimeout(() => window.location.reload(), 1500);
      return true;
    } catch (e) {
      console.error('Restore error:', e);
      Helpers.notify('数据恢复失败: ' + e.message, 'error');
      return false;
    }
  },

  // ============================================
  // 方案1: 导出/导入JSON文件
  // ============================================
  exportToFile() {
    const data = this.collectData();
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ncre2_backup_${Helpers.today()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    Helpers.notify('数据已导出为文件', 'success');
  },

  importFromFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        this.restoreData(data);
      } catch (err) {
        Helpers.notify('文件解析失败，请检查文件格式', 'error');
      }
    };
    reader.readAsText(file);
  },

  // ============================================
  // 方案2: jsonblob云端同步（免注册，同步码，24小时有效期）
  // ============================================
  async uploadToCloud() {
    const data = this.collectData();
    try {
      Helpers.notify('正在上传数据...', 'info', 1500);
      const response = await fetch('https://api.jsonblob.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (response.status === 429) {
        Helpers.notify('操作过于频繁，请稍后再试（匿名限制：6次写入/60秒）', 'error', 4000);
        return null;
      }
      if (!response.ok) throw new Error('Upload failed: ' + response.status);

      // blobId 在响应头中（响应体只回显原始数据，不含 id）
      let blobId = response.headers.get('X-jsonblob-id');
      if (!blobId) {
        const location = response.headers.get('Location') || '';
        blobId = location.replace(/^\//, '').trim();
      }
      const expiresAt = response.headers.get('X-jsonblob-expires-at');

      if (blobId) {
        Store.set('cloud_sync_id', blobId);
        Store.set('cloud_sync_date', new Date().toISOString());
        if (expiresAt) Store.set('cloud_sync_expires', expiresAt);
        Helpers.notify('上传成功！同步码: ' + blobId, 'success', 4000);
        return blobId;
      }
      throw new Error('未获取到同步码');
    } catch (e) {
      console.error('Upload error:', e);
      Helpers.notify('上传失败: ' + e.message + '，请检查网络连接', 'error', 3000);
      return null;
    }
  },

  async updateToCloud() {
    const blobId = Store.get('cloud_sync_id');
    if (!blobId) {
      Helpers.notify('尚无同步码，请先点击"上传获取同步码"', 'error');
      return null;
    }
    const data = this.collectData();
    try {
      Helpers.notify('正在更新云端数据...', 'info', 1500);
      const response = await fetch(`https://api.jsonblob.com/${blobId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (response.status === 404) {
        // blob 已过期（24小时），自动重新上传获取新同步码
        Helpers.notify('原同步码已过期，正在重新上传...', 'info', 2500);
        return await this.uploadToCloud();
      }
      if (response.status === 429) {
        Helpers.notify('操作过于频繁，请稍后再试（匿名限制：6次写入/60秒）', 'error', 4000);
        return null;
      }
      if (!response.ok) throw new Error('Update failed: ' + response.status);

      Store.set('cloud_sync_date', new Date().toISOString());
      // PUT 不刷新 TTL，读取并保存过期时间用于展示
      const expiresAt = response.headers.get('X-jsonblob-expires-at');
      if (expiresAt) Store.set('cloud_sync_expires', expiresAt);
      Helpers.notify('云端数据已更新（同步码不变，有效期不变）', 'success', 3000);
      return blobId;
    } catch (e) {
      console.error('Update error:', e);
      Helpers.notify('更新失败: ' + e.message, 'error', 3000);
      return null;
    }
  },

  async downloadFromCloud(syncId) {
    if (!syncId) {
      syncId = Store.get('cloud_sync_id');
    }
    if (!syncId) {
      Helpers.notify('请输入同步码', 'error');
      return false;
    }

    try {
      Helpers.notify('正在下载数据...', 'info', 1500);
      const response = await fetch(`https://api.jsonblob.com/${syncId}`);

      if (response.status === 404) {
        Helpers.notify('同步码无效或数据已过期（同步码有效期为24小时）', 'error', 4000);
        return false;
      }
      if (response.status === 429) {
        Helpers.notify('读取过于频繁，请稍后再试', 'error', 4000);
        return false;
      }
      if (!response.ok) throw new Error('Download failed: ' + response.status);

      const data = await response.json();
      this.restoreData(data);
      Store.set('cloud_sync_id', syncId);
      Store.set('cloud_sync_date', new Date().toISOString());
      const expiresAt = response.headers.get('X-jsonblob-expires-at');
      if (expiresAt) Store.set('cloud_sync_expires', expiresAt);
      return true;
    } catch (e) {
      console.error('Download error:', e);
      Helpers.notify('下载失败: ' + e.message + '，请检查同步码是否正确', 'error', 3000);
      return false;
    }
  },

  getCloudSyncInfo() {
    const expires = Store.get('cloud_sync_expires');
    let expired = false;
    if (expires) {
      expired = new Date(expires).getTime() < Date.now();
    }
    return {
      id: Store.get('cloud_sync_id'),
      date: Store.get('cloud_sync_date'),
      expires: expires,
      expired: expired
    };
  },

  // ============================================
  // 方案3: 二维码同步
  // ============================================
  async generateQRCode(containerId) {
    const syncId = await this.uploadToCloud();
    if (!syncId) return;

    const syncUrl = `${window.location.origin}${window.location.pathname}?sync=${syncId}`;
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';

    // 使用QRCode库生成二维码
    if (typeof QRCode !== 'undefined') {
      new QRCode(container, {
        text: syncUrl,
        width: 220,
        height: 220,
        colorDark: '#2C2825',
        colorLight: '#FAF8F5',
        correctLevel: QRCode.CorrectLevel.M
      });
    } else {
      // 降级：显示URL链接
      container.innerHTML = `<div class="qr-fallback">
        <p>二维码库加载失败，请手动复制链接：</p>
        <input type="text" value="${syncUrl}" readonly onclick="this.select()">
      </div>`;
    }

    // 显示同步码和链接
    const info = document.getElementById('qrSyncInfo');
    if (info) {
      info.innerHTML = `
        <div class="sync-code-display">
          <label>同步码</label>
          <div class="sync-code-value">${syncId}</div>
        </div>
        <div class="sync-url-display">
          <label>或复制链接</label>
          <input type="text" value="${syncUrl}" readonly onclick="this.select()">
        </div>
        <p class="sync-hint">用手机扫描二维码，或在手机浏览器中输入同步码即可同步数据</p>
      `;
    }
  },

  // 从URL参数自动同步
  async autoSyncFromURL() {
    const params = new URLSearchParams(window.location.search);
    const syncId = params.get('sync');
    if (syncId) {
      console.log('检测到同步参数:', syncId);
      await this.downloadFromCloud(syncId);
      // 清除URL参数
      const url = new URL(window.location);
      url.searchParams.delete('sync');
      window.history.replaceState({}, document.title, url);
    }
  },

  // ============================================
  // 方案4: Firebase自动云同步
  // ============================================
  firebaseApp: null,
  firebaseDb: null,
  firebaseUser: null,
  firebaseSyncing: false,

  // 获取Firebase配置
  getFirebaseConfig() {
    return Store.get('firebase_config', null);
  },

  setFirebaseConfig(config) {
    Store.set('firebase_config', config);
  },

  isFirebaseEnabled() {
    return !!this.getFirebaseConfig() && typeof firebase !== 'undefined';
  },

  // 初始化Firebase
  async initFirebase() {
    const config = this.getFirebaseConfig();
    if (!config || typeof firebase === 'undefined') return false;

    try {
      if (this.firebaseApp) return true;

      this.firebaseApp = firebase.initializeApp(config);
      this.firebaseDb = firebase.database();

      // 匿名登录
      await firebase.auth().signInAnonymously();
      this.firebaseUser = firebase.auth().currentUser;

      // 监听数据变化
      this.firebaseDb.ref('users/' + this.firebaseUser.uid + '/data').on('value', (snapshot) => {
        if (this.firebaseSyncing) return;
        const cloudData = snapshot.val();
        if (cloudData && cloudData.data) {
          console.log('Firebase: 检测到云端数据更新');
          // 只在数据比本地新时恢复
          const localDate = Store.get('firebase_sync_date') || '1970-01-01';
          if (cloudData.exportDate > localDate) {
            this.restoreData(cloudData);
            Store.set('firebase_sync_date', cloudData.exportDate);
          }
        }
      });

      console.log('Firebase initialized, UID:', this.firebaseUser.uid);
      return true;
    } catch (e) {
      console.error('Firebase init error:', e);
      Helpers.notify('Firebase初始化失败: ' + e.message, 'error');
      return false;
    }
  },

  // 上传到Firebase
  async syncToFirebase() {
    if (!this.isFirebaseEnabled() || !this.firebaseUser) {
      Helpers.notify('Firebase未配置，请先在设置中配置', 'error');
      return false;
    }

    this.firebaseSyncing = true;
    try {
      const data = this.collectData();
      await this.firebaseDb.ref('users/' + this.firebaseUser.uid + '/data').set(data);
      Store.set('firebase_sync_date', new Date().toISOString());
      Helpers.notify('已同步到Firebase云端', 'success');
      return true;
    } catch (e) {
      console.error('Firebase sync error:', e);
      Helpers.notify('Firebase同步失败: ' + e.message, 'error');
      return false;
    } finally {
      this.firebaseSyncing = false;
    }
  },

  // 从Firebase下载
  async syncFromFirebase() {
    if (!this.isFirebaseEnabled() || !this.firebaseUser) {
      Helpers.notify('Firebase未配置', 'error');
      return false;
    }

    this.firebaseSyncing = true;
    try {
      const snapshot = await this.firebaseDb.ref('users/' + this.firebaseUser.uid + '/data').once('value');
      const cloudData = snapshot.val();
      if (cloudData && cloudData.data) {
        this.restoreData(cloudData);
        Store.set('firebase_sync_date', cloudData.exportDate || new Date().toISOString());
        return true;
      } else {
        Helpers.notify('云端暂无数据', 'info');
        return false;
      }
    } catch (e) {
      console.error('Firebase download error:', e);
      Helpers.notify('下载失败: ' + e.message, 'error');
      return false;
    } finally {
      this.firebaseSyncing = false;
    }
  },

  // 获取Firebase用户ID
  getFirebaseUID() {
    return this.firebaseUser?.uid || null;
  },

  // 自动同步（防抖）
  autoSyncDebounced: null,

  setupAutoSync() {
    if (!this.isFirebaseEnabled() || !this.firebaseUser) return;

    this.autoSyncDebounced = Helpers.debounce(() => {
      this.syncToFirebase();
    }, 5000);

    // 监听localStorage变化
    window.addEventListener('storage', (e) => {
      if (e.key && e.key.startsWith('ncre2_')) {
        this.autoSyncDebounced();
      }
    });

    // 页面关闭前同步
    window.addEventListener('beforeunload', () => {
      if (this.autoSyncDebounced) this.syncToFirebase();
    });
  }
};
