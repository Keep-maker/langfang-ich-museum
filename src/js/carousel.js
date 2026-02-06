/**
 * ==========================================
 * 廊坊非遗数字中心 - 轮播功能
 * ==========================================
 */

(function () {
  'use strict';

  // ========== 配置 ==========
  const CONFIG = {
    autoPlayDelay: 6000,
    transitionDuration: 800,
    pauseOnHover: true
  };

  // ========== 状态管理 ==========
  const CarouselState = {
    currentIndex: 0,
    totalSlides: 0,
    isAnimating: false,
    autoPlayTimer: null,
    isPaused: false
  };

  // ========== DOM元素 ==========
  let carousel = null;
  let slidesWrapper = null;
  let slides = [];
  let prevBtn = null;
  let nextBtn = null;
  let indicators = [];

  /**
   * 初始化轮播
   */
  function initCarousel() {
    // 获取DOM元素
    carousel = document.querySelector('.hero-carousel');
    if (!carousel) return;

    slidesWrapper = carousel.querySelector('.carousel-wrapper');
    slides = Array.from(carousel.querySelectorAll('.carousel-slide'));
    prevBtn = carousel.querySelector('.carousel-control.prev');
    nextBtn = carousel.querySelector('.carousel-control.next');
    indicators = Array.from(carousel.querySelectorAll('.indicator'));

    CarouselState.totalSlides = slides.length;

    if (CarouselState.totalSlides === 0) return;

    // 绑定事件
    bindEvents();

    // 开始自动播放
    startAutoPlay();

    // 初始化第一张幻灯片
    showSlide(0);

    console.log('✨ 轮播初始化完成');
  }

  /**
   * 绑定事件
   */
  function bindEvents() {
    // 前一张按钮
    prevBtn?.addEventListener('click', () => {
      if (!CarouselState.isAnimating) {
        previousSlide();
      }
    });

    // 下一张按钮
    nextBtn?.addEventListener('click', () => {
      if (!CarouselState.isAnimating) {
        nextSlide();
      }
    });

    // 指示器点击
    indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => {
        if (!CarouselState.isAnimating && index !== CarouselState.currentIndex) {
          goToSlide(index);
        }
      });
    });

    // 键盘导航
    document.addEventListener('keydown', handleKeyboard);

    // 触摸滑动
    if ('ontouchstart' in window) {
      let touchStartX = 0;
      let touchEndX = 0;

      carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
      }, { passive: true });

      function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
          if (diff > 0) {
            nextSlide();
          } else {
            previousSlide();
          }
        }
      }
    }

    // 悬停暂停
    if (CONFIG.pauseOnHover) {
      carousel.addEventListener('mouseenter', pauseAutoPlay);
      carousel.addEventListener('mouseleave', resumeAutoPlay);
    }

    // 页面可见性变化
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        pauseAutoPlay();
      } else {
        resumeAutoPlay();
      }
    });
  }

  /**
   * 键盘控制
   */
  function handleKeyboard(e) {
    if (!carousel || CarouselState.isAnimating) return;

    switch (e.key) {
      case 'ArrowLeft':
        previousSlide();
        break;
      case 'ArrowRight':
        nextSlide();
        break;
      case 'Home':
        goToSlide(0);
        break;
      case 'End':
        goToSlide(CarouselState.totalSlides - 1);
        break;
    }
  }

  /**
   * 显示指定幻灯片
   */
  function showSlide(index) {
    if (index < 0 || index >= CarouselState.totalSlides) return;

    // 设置动画状态
    CarouselState.isAnimating = true;

    // 移除所有active类
    slides.forEach(slide => {
      slide.classList.remove('active');
      slide.setAttribute('aria-hidden', 'true');
    });

    indicators.forEach(indicator => {
      indicator.classList.remove('active');
      indicator.setAttribute('aria-selected', 'false');
      // 重置进度条
      const progress = indicator.querySelector('.indicator-progress');
      if (progress) {
        progress.style.animation = 'none';
        void progress.offsetWidth; // 触发重排
      }
    });

    // 激活当前幻灯片
    slides[index].classList.add('active');
    slides[index].setAttribute('aria-hidden', 'false');

    // 激活当前指示器
    if (indicators[index]) {
      indicators[index].classList.add('active');
      indicators[index].setAttribute('aria-selected', 'true');
      // 启动进度条动画
      const progress = indicators[index].querySelector('.indicator-progress');
      if (progress) {
        progress.style.animation = `indicatorProgress ${CONFIG.autoPlayDelay}ms linear forwards`;
      }
    }

    // 更新当前索引
    CarouselState.currentIndex = index;

    // 重置动画状态
    setTimeout(() => {
      CarouselState.isAnimating = false;
    }, CONFIG.transitionDuration);
  }

  /**
   * 下一张
   */
  function nextSlide() {
    const nextIndex = (CarouselState.currentIndex + 1) % CarouselState.totalSlides;
    goToSlide(nextIndex);
  }

  /**
   * 上一张
   */
  function previousSlide() {
    const prevIndex = (CarouselState.currentIndex - 1 + CarouselState.totalSlides) % CarouselState.totalSlides;
    goToSlide(prevIndex);
  }

  /**
   * 跳转到指定幻灯片
   */
  function goToSlide(index) {
    if (index === CarouselState.currentIndex) return;

    // 停止自动播放
    stopAutoPlay();

    // 显示目标幻灯片
    showSlide(index);

    // 恢复自动播放
    if (!CarouselState.isPaused) {
      startAutoPlay();
    }
  }

  /**
   * 开始自动播放
   */
  function startAutoPlay() {
    if (CarouselState.autoPlayTimer) {
      clearInterval(CarouselState.autoPlayTimer);
    }

    CarouselState.autoPlayTimer = setInterval(() => {
      if (!CarouselState.isPaused && !CarouselState.isAnimating) {
        nextSlide();
      }
    }, CONFIG.autoPlayDelay);
  }

  /**
   * 停止自动播放
   */
  function stopAutoPlay() {
    if (CarouselState.autoPlayTimer) {
      clearInterval(CarouselState.autoPlayTimer);
      CarouselState.autoPlayTimer = null;
    }
  }

  /**
   * 暂停自动播放
   */
  function pauseAutoPlay() {
    CarouselState.isPaused = true;
  }

  /**
   * 恢复自动播放
   */
  function resumeAutoPlay() {
    CarouselState.isPaused = false;
  }

  /**
   * 销毁轮播
   */
  function destroyCarousel() {
    stopAutoPlay();
    document.removeEventListener('keydown', handleKeyboard);
  }

  // ========== 初始化 ==========
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCarousel);
  } else {
    initCarousel();
  }

  // 暴露API
  window.Carousel = {
    next: nextSlide,
    prev: previousSlide,
    goTo: goToSlide,
    play: startAutoPlay,
    pause: pauseAutoPlay,
    destroy: destroyCarousel
  };

})();
