

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
            }

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
                        showToast(`已添加「${title}」到预约列表`);
                    });
                });

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
