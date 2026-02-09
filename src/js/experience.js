

import Utils from './utils.js';

(function () {
    'use strict';

    // ========== DOM缓存 ==========
    const Elements = {};

    // ========== 初始化 ==========
    function init() {
        cacheElements();
        bindEvents();
        initAOS();
    }

    function cacheElements() {
        Elements.navBtns = document.querySelectorAll('.exp-nav-btn');
        Elements.sections = document.querySelectorAll('[data-category]');
        Elements.workshopBtns = document.querySelectorAll('.workshop-btn');
        Elements.ctaPrimary = document.querySelector('.cta-btn-primary');

        // 预约模态框相关
        Elements.bookingModal = document.getElementById('bookingModal');
        Elements.bookingForm = document.getElementById('bookingForm');
        Elements.modalClose = document.querySelector('.modal-close');
        Elements.workshopNameInput = document.getElementById('workshopName');
        Elements.totalPriceDisplay = document.getElementById('totalPrice');
        Elements.userCountSelect = document.getElementById('userCount');
    }

    const State = {
        currentWorkshop: null,
        basePrice: 0
    };

    function bindEvents() {
        // 分类导航切换
        Elements.navBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const target = btn.dataset.target;
                switchCategory(target, btn);
            });
        });

        // 工坊预约按钮
        Elements.workshopBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const card = btn.closest('.workshop-card');
                const title = card?.querySelector('.workshop-title')?.textContent || '体验课程';
                const priceText = card?.querySelector('.workshop-price')?.textContent || '¥0';
                const price = parseInt(priceText.replace(/[^0-9]/g, '')) || 0;

                openBookingModal(title, price);
            });
        });

        // 模态框关闭
        if (Elements.modalClose) {
            Elements.modalClose.onclick = closeBookingModal;
        }
        if (Elements.bookingModal) {
            Elements.bookingModal.querySelector('.modal-overlay').onclick = closeBookingModal;
        }

        // 人数变动更新总价
        if (Elements.userCountSelect) {
            Elements.userCountSelect.onchange = updateTotalPrice;
        }

        // 表单提交
        if (Elements.bookingForm) {
            Elements.bookingForm.onsubmit = (e) => {
                e.preventDefault();
                submitBooking();
            };
        }

        // CTA预约按钮
        if (Elements.ctaPrimary) {
            Elements.ctaPrimary.addEventListener('click', () => {
                // 滚动到工坊区域
                const workshopSection = document.getElementById('sectionWorkshop');
                if (workshopSection) {
                    workshopSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        }

        // 视频卡片点击
        document.querySelectorAll('.video-card').forEach(card => {
            card.addEventListener('click', () => {
                const title = card.querySelector('.video-title')?.textContent || '视频';
                showToast(`正在加载「${title}」...`);
            });
        });
    }

    // ========== 预约逻辑 ==========
    function openBookingModal(title, price) {
        State.currentWorkshop = title;
        State.basePrice = price;

        if (Elements.workshopNameInput) {
            Elements.workshopNameInput.value = title;
        }

        updateTotalPrice();

        if (Elements.bookingModal) {
            Elements.bookingModal.classList.add('active');
            Elements.bookingModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden'; // 禁止滚动
        }
    }

    function closeBookingModal() {
        if (Elements.bookingModal) {
            Elements.bookingModal.classList.remove('active');
            Elements.bookingModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = ''; // 恢复滚动
        }
        if (Elements.bookingForm) {
            Elements.bookingForm.reset();
        }
    }

    function updateTotalPrice() {
        const count = parseInt(Elements.userCountSelect?.value || '1');
        const total = State.basePrice * count;
        if (Elements.totalPriceDisplay) {
            Elements.totalPriceDisplay.textContent = `¥${total}`;
        }
    }

    function submitBooking() {
        // 模拟提交
        const btn = Elements.bookingForm.querySelector('.submit-btn');
        const originalText = btn.textContent;

        btn.disabled = true;
        btn.textContent = '正在提交...';

        setTimeout(() => {
            closeBookingModal();
            showToast('预约成功！我们将尽快与您联系。');
            btn.disabled = false;
            btn.textContent = originalText;
        }, 1500);
    }

    // ========== 分类筛选 ==========
    function switchCategory(target, activeBtn) {
        // 更新按钮状态
        Elements.navBtns.forEach(b => b.classList.remove('active'));
        activeBtn.classList.add('active');

        // 显示/隐藏对应区域
        Elements.sections.forEach(section => {
            const category = section.dataset.category;
            if (target === 'all' || category === target) {
                section.style.display = '';
                section.style.opacity = '0';
                section.style.transform = 'translateY(20px)';
                requestAnimationFrame(() => {
                    section.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                    section.style.opacity = '1';
                    section.style.transform = 'translateY(0)';
                });
            } else {
                section.style.display = 'none';
            }
        });
    }

    // ========== 提示信息 ==========
    function showToast(message) {
        // 优先使用全局方法
        if (window.LangfangHeritage && window.LangfangHeritage.showToast) {
            window.LangfangHeritage.showToast(message);
            return;
        }

        // 回退方案
        const existing = document.querySelector('.exp-toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = 'exp-toast';
        toast.textContent = message;
        toast.style.cssText = `
      position: fixed;
      bottom: 40px;
      left: 50%;
      transform: translateX(-50%) translateY(20px);
      padding: 12px 28px;
      background: rgba(45, 45, 45, 0.92);
      color: white;
      font-size: 14px;
      border-radius: 40px;
      z-index: 9999;
      opacity: 0;
      transition: all 0.3s ease;
      pointer-events: none;
      backdrop-filter: blur(8px);
    `;

        document.body.appendChild(toast);
        requestAnimationFrame(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(-50%) translateY(0)';
        });

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(-50%) translateY(20px)';
            setTimeout(() => toast.remove(), 300);
        }, 2500);
    }

    // ========== AOS初始化 ==========
    function initAOS() {
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 600,
                once: true,
                offset: 80
            });
        }
    }

    // ========== 启动 ==========
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // ========== 暴露API ==========
    window.Experience = {
        switchCategory,
        showToast
    };

})();
