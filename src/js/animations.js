/**
 * ==========================================
 * 廊坊非遗数字中心 - 动画控制
 * ==========================================
 */

import Utils from './utils.js';

(function () {
  'use strict';

  // ========== 配置 ==========
  const CONFIG = {
    observerThreshold: 0.15,
    observerRootMargin: '0px 0px -50px 0px',
    staggerDelay: 100
  };

  // ========== 元素观察器 ==========
  let animationObserver = null;
  let numberObserver = null;

  /**
   * 初始化动画系统
   */
  function init() {
    if (Utils.prefersReducedMotion()) {
      console.log('⚠️ 用户偏好减少动画，跳过动画初始化');
      return;
    }

    initScrollAnimations();
    initNumberAnimations();
    initParallaxEffects();
    initHoverEffects();

    console.log('🎬 动画系统初始化完成');
  }

  /**
   * 初始化滚动触发动画
   */
  function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-aos]');
    if (!animatedElements.length) return;

    animationObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const delay = parseInt(element.getAttribute('data-aos-delay') || '0', 10);

          setTimeout(() => {
            element.classList.add('aos-animate');
          }, delay);

          // 只观察一次
          animationObserver.unobserve(element);
        }
      });
    }, {
      threshold: CONFIG.observerThreshold,
      rootMargin: CONFIG.observerRootMargin
    });

    animatedElements.forEach(el => {
      animationObserver.observe(el);
    });
  }

  /**
   * 初始化数字滚动动画
   */
  function initNumberAnimations() {
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    if (!statNumbers.length) return;

    numberObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const target = parseInt(element.getAttribute('data-target'), 10);
          const suffix = element.getAttribute('data-suffix') || '';
          const numberElement = element.querySelector('.number');

          if (numberElement) {
            animateNumber(numberElement, 0, target, 2000, suffix);
          }

          numberObserver.unobserve(element);
        }
      });
    }, {
      threshold: 0.5
    });

    statNumbers.forEach(stat => {
      numberObserver.observe(stat);
    });
  }

  /**
   * 数字动画
   */
  function animateNumber(element, start, end, duration, suffix = '') {
    let startTime = null;
    const range = end - start;

    function step(currentTime) {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easeProgress = easeOutQuart(progress);
      const current = Math.floor(start + range * easeProgress);

      element.textContent = formatNumber(current);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        element.textContent = formatNumber(end);
      }
    }

    requestAnimationFrame(step);
  }

  /**
   * 格式化数字
   */
  function formatNumber(num) {
    if (num >= 10000) {
      return (num / 10000).toFixed(1) + '万';
    }
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  /**
   * 缓动函数
   */
  function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  /**
   * 初始化视差效果
   */
  function initParallaxEffects() {
    if (Utils.getDeviceInfo().isMobile) return;

    const parallaxElements = document.querySelectorAll('.parallax-layer');
    if (!parallaxElements.length) return;

    const handleScroll = Utils.throttle(() => {
      const scrollTop = window.pageYOffset;

      parallaxElements.forEach(element => {
        const speed = parseFloat(element.getAttribute('data-speed')) || 0.5;
        const yPos = -(scrollTop * speed);
        element.style.transform = `translate3d(0, ${yPos}px, 0)`;
      });
    }, 16);

    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  /**
   * 初始化悬停效果
   */
  function initHoverEffects() {
    if (Utils.getDeviceInfo().isMobile) return;

    // 卡片倾斜效果已去除
    /*
    const tiltCards = document.querySelectorAll('.inheritor-card, .access-card');

    tiltCards.forEach(card => {
      card.addEventListener('mousemove', handleCardTilt);
      card.addEventListener('mouseleave', resetCardTilt);
    });
    */
  }

  /**
   * 处理卡片倾斜
   */
  function handleCardTilt(e) {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    card.style.transition = 'transform 0.1s ease-out';
  }

  /**
   * 重置卡片倾斜
   */
  function resetCardTilt(e) {
    const card = e.currentTarget;
    card.style.transform = '';
    card.style.transition = 'transform 0.3s ease-out';
  }

  /**
   * 创建波纹效果
   */
  function createRipple(element, event) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.classList.add('ripple');

    element.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);
  }

  /**
   * 添加波纹效果到按钮
   */
  function initRippleEffect() {
    const rippleButtons = document.querySelectorAll('.mortise-btn, .action-btn');

    rippleButtons.forEach(button => {
      button.style.position = 'relative';
      button.style.overflow = 'hidden';

      button.addEventListener('click', function (e) {
        createRipple(this, e);
      });
    });
  }

  /**
   * 交错动画
   */
  function staggerAnimation(elements, animationClass, delay = CONFIG.staggerDelay) {
    elements.forEach((element, index) => {
      setTimeout(() => {
        element.classList.add(animationClass);
      }, index * delay);
    });
  }

  /**
   * 页面进入动画
   */
  function pageEnterAnimation() {
    const heroContent = document.querySelector('.hero-carousel .content-wrapper');
    if (heroContent) {
      setTimeout(() => {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(30px)';
        heroContent.style.transition = 'all 0.8s ease-out';

        requestAnimationFrame(() => {
          heroContent.style.opacity = '1';
          heroContent.style.transform = 'translateY(0)';
        });
      }, 500);
    }
  }

  /**
   * 滚动进度指示器
   */
  function initScrollProgress() {
    const progressCircle = document.querySelector('.progress-circle');
    if (!progressCircle) return;

    const circumference = 2 * Math.PI * 20; // r=20
    progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
    progressCircle.style.strokeDashoffset = circumference;

    const updateProgress = Utils.throttle(() => {
      const scrollPercent = Utils.getScrollPercent();
      const offset = circumference - (scrollPercent / 100) * circumference;
      progressCircle.style.strokeDashoffset = offset;
    }, 10);

    window.addEventListener('scroll', updateProgress, { passive: true });
  }

  /**
   * 粒子效果
   */
  function createParticles(container, count = 20) {
    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.cssText = `
        position: absolute;
        width: ${Math.random() * 4 + 2}px;
        height: ${Math.random() * 4 + 2}px;
        background: var(--color-gold);
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        opacity: ${Math.random() * 0.5 + 0.3};
        animation: particleFloat ${Math.random() * 10 + 10}s linear infinite;
        animation-delay: ${Math.random() * 5}s;
      `;
      container.appendChild(particle);
    }
  }

  /**
   * 清理观察器
   */
  function cleanup() {
    if (animationObserver) {
      animationObserver.disconnect();
    }
    if (numberObserver) {
      numberObserver.disconnect();
    }
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
  window.Animations = {
    stagger: staggerAnimation,
    createRipple,
    createParticles,
    animateNumber,
    cleanup
  };

})();
