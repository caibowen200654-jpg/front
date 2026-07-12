/* ============================================
   速记卡组件
   ============================================ */

const Flashcard = {
  render(card, index = 0, total = 0) {
    const isFavorited = Store.isFavorited('flashcard', card.id);
    return `
      <div class="flashcard-container" data-card-id="${card.id}">
        <div class="flashcard" onclick="Flashcard.flip(this)">
          <div class="flashcard-inner">
            <div class="flashcard-front">
              <div class="flashcard-label">问题</div>
              <div class="flashcard-content">${Helpers.escape(card.front)}</div>
              ${card.hint ? `<div class="flashcard-hint">💡 ${Helpers.escape(card.hint)}</div>` : ''}
              <div class="flashcard-flip-hint">点击翻转查看答案</div>
            </div>
            <div class="flashcard-back">
              <div class="flashcard-label">答案</div>
              <div class="flashcard-content">${Helpers.escape(card.back).replace(/\n/g, '<br>')}</div>
              <div class="flashcard-flip-hint">点击翻回</div>
            </div>
          </div>
        </div>
        <div class="flashcard-controls">
          <span class="flashcard-index">${index + 1} / ${total}</span>
          <div class="flashcard-actions">
            <button class="btn-sm btn-fuzzy" onclick="Flashcard.mark('${card.id}', 'fuzzy', ${index})" title="模糊">模糊</button>
            <button class="btn-sm btn-unfamiliar" onclick="Flashcard.mark('${card.id}', 'unfamiliar', ${index})" title="陌生">陌生</button>
            <button class="btn-sm btn-familiar" onclick="Flashcard.mark('${card.id}', 'familiar', ${index})" title="熟悉">熟悉</button>
            <button class="icon-btn-sm ${isFavorited ? 'active' : ''}" onclick="Flashcard.toggleFav('${card.id}', this)" title="收藏">
              ${Helpers.icon(isFavorited ? 'starFilled' : 'star', 14)}
            </button>
          </div>
        </div>
      </div>
    `;
  },

  flip(el) {
    el.classList.toggle('flipped');
  },

  mark(cardId, status, index) {
    Store.recordFlashcardReview(cardId, status);
    const labels = { familiar: '已标记为熟悉', fuzzy: '已标记为模糊', unfamiliar: '已标记为陌生' };
    Helpers.notify(labels[status] || '已标记', 'info', 1200);

    // 自动翻回正面
    const container = document.querySelector(`[data-card-id="${cardId}"]`);
    if (container) {
      const card = container.querySelector('.flashcard');
      card.classList.remove('flipped');
    }

    // 通知flashcards视图切换到下一张
    if (window.FlashcardsView && typeof window.FlashcardsView.next === 'function') {
      setTimeout(() => window.FlashcardsView.next(), 600);
    }
  },

  toggleFav(cardId, btn) {
    const added = Store.toggleFavorite('flashcard', cardId);
    btn.classList.toggle('active', added);
    btn.innerHTML = Helpers.icon(added ? 'starFilled' : 'star', 14);
  }
};
