/**
 * ==========================================
 * 廊坊非遗数字中心 - 虚拟博物馆交互
 * ==========================================
 */

import Utils from './utils.js';

(function () {
  'use strict';

  // ========== 配置 ==========
  const CONFIG = {
    autoRotate: true,
    rotateSpeed: 0.5,
    particleCount: 30,
    sceneChangeDelay: 5000
  };

  // ========== 状态管理 ==========
  const State = {
    currentHall: 'filigree',
    currentScene: 0,
    isAutoPlaying: true,
    rotation: 0,
    zoom: 1,
    infoVisible: false
  };

  // ========== DOM元素 ==========
  let hallTabs = [];
  let hallScene = null;
  let controlPanel = null;
  let infoPanel = null;
  let sceneDots = [];
  let particlesContainer = null;
  let exhibitCards = [];

  /**
   * 初始化博物馆
   */
  function init() {
    // 缓存DOM元素
    cacheElements();

    // 绑定事件
    bindEvents();

    // 初始化粒子效果
    initParticles();

    // 初始化展品卡片
    initExhibitCards();

    // 开始自动播放
    if (State.isAutoPlaying) {
      startAutoPlay();
    }

    console.log('🏛️ 虚拟博物馆初始化完成');
  }

  /**
   * 缓存DOM元素
   */
  function cacheElements() {
    hallTabs = Array.from(document.querySelectorAll('.hall-tab'));
    hallScene = document.getElementById('hallScene');
    controlPanel = document.querySelector('.control-panel');
    infoPanel = document.getElementById('infoPanel');
    sceneDots = Array.from(document.querySelectorAll('.scene-dot'));
    particlesContainer = document.getElementById('particles');
    exhibitCards = Array.from(document.querySelectorAll('.exhibit-card'));
  }

  /**
   * 绑定事件
   */
  function bindEvents() {
    // 展厅标签切换
    hallTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        switchHall(tab.dataset.hall);
      });
    });

    // 控制按钮
    if (controlPanel) {
      controlPanel.addEventListener('click', (e) => {
        const btn = e.target.closest('.control-btn');
        if (!btn) return;

        const action = btn.dataset.action;
        handleControlAction(action, btn);
      });
    }

    // 场景指示器
    sceneDots.forEach(dot => {
      dot.addEventListener('click', () => {
        goToScene(parseInt(dot.dataset.scene, 10));
      });
    });

    // 信息面板关闭
    if (infoPanel) {
      const closeBtn = infoPanel.querySelector('.info-close');
      closeBtn?.addEventListener('click', hideInfo);
    }

    // 展品卡片点击
    exhibitCards.forEach(card => {
      card.addEventListener('click', () => {
        showExhibitInfo(card);
      });
    });

    // 全屏按钮
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    fullscreenBtn?.addEventListener('click', toggleFullscreen);

    // 键盘控制
    document.addEventListener('keydown', handleKeyboard);

    // 触摸滑动
    if ('ontouchstart' in window && hallScene) {
      let touchStartX = 0;
      let touchStartY = 0;

      hallScene.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }, { passive: true });

      hallScene.addEventListener('touchmove', (e) => {
        if (!touchStartX || !touchStartY) return;

        const touchEndX = e.touches[0].clientX;
        const touchEndY = e.touches[0].clientY;
        
        const diffX = touchStartX - touchEndX;
        const diffY = touchStartY - touchEndY;

        // 水平滑动切换场景
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
          if (diffX > 0) {
            nextScene();
          } else {
            previousScene();
          }
          touchStartX = 0;
          touchStartY = 0;
        }
      }, { passive: true });
    }
  }

  /**
   * 切换展厅
   */
  function switchHall(hallId) {
    if (hallId === State.currentHall) return;

    // 更新标签状态
    hallTabs.forEach(tab => {
      if (tab.dataset.hall === hallId) {
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
      } else {
        tab.classList.remove('active');
        tab.setAttribute('aria-selected', 'false');
      }
    });

    // 更新状态
    State.currentHall = hallId;
    State.currentScene = 0;

    // 更新场景
    updateScene();

    // 显示提示
    showToast(`已切换到${getHallName(hallId)}`);
  }

  /**
   * 获取展厅名称
   */
  function getHallName(hallId) {
    const names = {
      'filigree': '花丝镶嵌馆',
      'cloisonne': '景泰蓝馆',
      'crafts': '传统工艺馆',
      'inheritors': '传承人馆',
      'culture': '文化馆'
    };
    return names[hallId] || '展厅';
  }

  /**
   * 处理控制动作
   */
  function handleControlAction(action, btn) {
    switch (action) {
      case 'rotate-left':
        rotateScene(-30);
        break;
      case 'rotate-right':
        rotateScene(30);
        break;
      case 'zoom-in':
        zoomScene(0.1);
        break;
      case 'zoom-out':
        zoomScene(-0.1);
        break;
      case 'play':
        toggleAutoPlay(btn);
        break;
    }
  }

  /**
   * 旋转场景
   */
  function rotateScene(degree) {
    State.rotation += degree;
    if (hallScene) {
      hallScene.style.transform = `rotate(${State.rotation}deg) scale(${State.zoom})`;
    }
  }

  /**
   * 缩放场景
   */
  function zoomScene(delta) {
    State.zoom = Math.max(0.5, Math.min(2, State.zoom + delta));
    if (hallScene) {
      hallScene.style.transform = `rotate(${State.rotation}deg) scale(${State.zoom})`;
    }
  }

  /**
   * 切换自动播放
   */
  function toggleAutoPlay(btn) {
    State.isAutoPlaying = !State.isAutoPlaying;

    if (State.isAutoPlaying) {
      btn.classList.add('active');
      startAutoPlay();
    } else {
      btn.classList.remove('active');
      stopAutoPlay();
    }
  }

  /**
   * 开始自动播放
   */
  function startAutoPlay() {
    if (State.autoPlayTimer) {
      clearInterval(State.autoPlayTimer);
    }

    State.autoPlayTimer = setInterval(() => {
      nextScene();
    }, CONFIG.sceneChangeDelay);
  }

  /**
   * 停止自动播放
   */
  function stopAutoPlay() {
    if (State.autoPlayTimer) {
      clearInterval(State.autoPlayTimer);
      State.autoPlayTimer = null;
    }
  }

  /**
   * 下一个场景
   */
  function nextScene() {
    State.currentScene = (State.currentScene + 1) % sceneDots.length;
    updateScene();
  }

  /**
   * 上一个场景
   */
  function previousScene() {
    State.currentScene = (State.currentScene - 1 + sceneDots.length) % sceneDots.length;
    updateScene();
  }

  /**
   * 跳转到指定场景
   */
  function goToScene(sceneIndex) {
    State.currentScene = sceneIndex;
    updateScene();
    stopAutoPlay();
  }

  /**
   * 更新场景
   */
  function updateScene() {
    // 更新场景指示器
    sceneDots.forEach((dot, index) => {
      if (index === State.currentScene) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });

    // 场景切换动画
    if (hallScene) {
      hallScene.style.opacity = '0.5';
      setTimeout(() => {
        hallScene.style.opacity = '1';
      }, 300);
    }

    // 重置旋转和缩放
    State.rotation = 0;
    State.zoom = 1;
    if (hallScene) {
      hallScene.style.transform = `rotate(0deg) scale(1)`;
    }
  }

  /**
   * 键盘控制
   */
  function handleKeyboard(e) {
    if (State.infoVisible && e.key === 'Escape') {
      hideInfo();
      return;
    }

    switch (e.key) {
      case 'ArrowLeft':
        previousScene();
        break;
      case 'ArrowRight':
        nextScene();
        break;
      case ' ':
        e.preventDefault();
        const playBtn = controlPanel?.querySelector('[data-action="play"]');
        if (playBtn) toggleAutoPlay(playBtn);
        break;
      case 'f':
      case 'F':
        toggleFullscreen();
        break;
    }
  }

  /**
   * 初始化粒子效果
   */
  function initParticles() {
    if (!particlesContainer) return;

    for (let i = 0; i < CONFIG.particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.animationDelay = `${Math.random() * 15}s`;
      particle.style.animationDuration = `${10 + Math.random() * 10}s`;
      particlesContainer.appendChild(particle);
    }
  }

  /**
   * 初始化展品卡片
   */
  function initExhibitCards() {
    exhibitCards.forEach(card => {
      // 添加悬停效果
      card.addEventListener('mouseenter', function () {
        if (!Utils.getDeviceInfo().isMobile) {
          this.style.transform = 'translateY(-8px) scale(1.02)';
        }
      });

      card.addEventListener('mouseleave', function () {
        this.style.transform = '';
      });
    });
  }

  /**
   * 显示展品信息
   */
  function showExhibitInfo(card) {
    const title = card.querySelector('.exhibit-title')?.textContent || '展品';
    const desc = card.querySelector('.exhibit-desc')?.textContent || '';

    if (infoPanel) {
      // 更新信息面板内容
      const titleEl = infoPanel.querySelector('.detail-value');
      if (titleEl) {
        titleEl.textContent = title;
      }

      // 显示面板
      infoPanel.classList.add('show');
      State.infoVisible = true;
    }
  }

  /**
   * 隐藏信息面板
   */
  function hideInfo() {
    if (infoPanel) {
      infoPanel.classList.remove('show');
      State.infoVisible = false;
    }
  }

  /**
   * 切换全屏
   */
  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.() ||
        document.documentElement.webkitRequestFullscreen?.();
    } else {
      document.exitFullscreen?.() ||
        document.webkitExitFullscreen?.();
    }
  }

  /**
   * 显示提示消息
   */
  function showToast(message) {
    if (typeof window.LangfangHeritage !== 'undefined' && window.LangfangHeritage.showToast) {
      window.LangfangHeritage.showToast({
        title: '提示',
        message: message,
        type: 'info',
        duration: 2000
      });
    }
  }

  /**
   * 清理
   */
  function cleanup() {
    stopAutoPlay();
    document.removeEventListener('keydown', handleKeyboard);
  }

  // ========== 初始化 ==========
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // 页面卸载时清理
  window.addEventListener('beforeunload', cleanup);

  // 暴露API
  window.Museum = {
    switchHall,
    nextScene,
    previousScene,
    showExhibitInfo,
    hideInfo
  };

})();
