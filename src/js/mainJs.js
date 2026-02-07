/**
 * ==========================================
 * 廊坊非遗数字中心 - 主JavaScript文件
 * ==========================================
 */

import Utils from './utils.js';

(function () {
  'use strict';

  // ========== 配置 ==========
  const CONFIG = {
    scrollOffset: 80,
    animationDuration: 300,
    carouselInterval: 6000,
    lazyLoadThreshold: 0.1
  };

  // ========== 状态管理 ==========
  const State = {
    isLoading: true,
    isMenuOpen: false,
    isSearchOpen: false,
    currentSlide: 0,
    scrollPosition: 0
  };

  // ========== DOM元素缓存 ==========
  const Elements = {
    loader: null,
    navbar: null,
    mobileMenuToggle: null,
    navMenu: null,
    searchBtn: null,
    searchModal: null,
    backToTop: null,
    carousel: null,
    mobileSidebar: null,
    fullscreenBtn: null
  };

  /**
   * 初始化DOM元素缓存
   */
  function cacheElements() {
    Elements.loader = document.getElementById('pageLoader');
    Elements.navbar = document.querySelector('.navbar');
    Elements.mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    Elements.navMenu = document.querySelector('.nav-menu');
    Elements.searchBtn = document.getElementById('searchBtn');
    Elements.searchModal = document.getElementById('searchModal');
    Elements.backToTop = document.getElementById('backToTop');
    Elements.carousel = document.querySelector('.hero-carousel');
    Elements.mobileSidebar = document.getElementById('mobileSidebar');
    Elements.fullscreenBtn = document.getElementById('fullscreenBtn');
  }

  /**
   * 页面加载完成处理
   */
  function handlePageLoad() {
    console.log('--- handlePageLoad called ---');
    // 隐藏加载器
    if (Elements.loader) {
      console.log('Loader found, hiding...');
      Elements.loader.classList.add('hidden');
      setTimeout(() => {
        Elements.loader.style.display = 'none';
        State.isLoading = false;
        console.log('Loader display none');
      }, 500);
    } else {
      console.warn('Loader element NOT found in handlePageLoad');
    }

    // 初始化AOS动画库
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 800,
        easing: 'ease-out',
        once: true,
        offset: 100,
        disable: Utils.prefersReducedMotion()
      });
    }

    // 触发数字动画
    initNumberAnimations();
  }

  /**
   * 初始化导航栏
   */
  function initNavbar() {
    if (!Elements.navbar) return;

    // 滚动时改变导航栏样式
    const handleScroll = Utils.throttle(() => {
      const scrollTop = window.pageYOffset;

      if (scrollTop > 50) {
        Elements.navbar.classList.add('scrolled');
      } else {
        Elements.navbar.classList.remove('scrolled');
      }

      State.scrollPosition = scrollTop;
    }, 100);

    window.addEventListener('scroll', handleScroll, { passive: true });

    // 移动端菜单切换
    if (Elements.mobileMenuToggle) {
      Elements.mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    }

    // 移动端侧边栏关闭按钮
    if (Elements.mobileSidebar) {
      const sidebarClose = Elements.mobileSidebar.querySelector('.sidebar-close');
      const sidebarOverlay = Elements.mobileSidebar.querySelector('.sidebar-overlay');

      sidebarClose?.addEventListener('click', closeMobileMenu);
      sidebarOverlay?.addEventListener('click', closeMobileMenu);
    }

    // 点击导航链接后关闭移动菜单
    const navLinks = document.querySelectorAll('.nav-item, .sidebar-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (State.isMenuOpen) {
          closeMobileMenu();
        }
      });
    });

    // 全屏按钮
    if (Elements.fullscreenBtn) {
      Elements.fullscreenBtn.addEventListener('click', Utils.toggleFullscreen);
    }
  }

  /**
   * 切换移动端菜单
   */
  function toggleMobileMenu() {
    State.isMenuOpen = !State.isMenuOpen;

    if (Elements.mobileMenuToggle) {
      Elements.mobileMenuToggle.setAttribute('aria-expanded', State.isMenuOpen);
    }

    if (Elements.mobileSidebar) {
      Elements.mobileSidebar.setAttribute('aria-hidden', !State.isMenuOpen);
    }

    if (Elements.navMenu) {
      Elements.navMenu.classList.toggle('active', State.isMenuOpen);
    }

    document.body.classList.toggle('no-scroll', State.isMenuOpen);
  }

  /**
   * 关闭移动端菜单
   */
  function closeMobileMenu() {
    State.isMenuOpen = false;

    if (Elements.mobileMenuToggle) {
      Elements.mobileMenuToggle.setAttribute('aria-expanded', 'false');
    }

    if (Elements.mobileSidebar) {
      Elements.mobileSidebar.setAttribute('aria-hidden', 'true');
    }

    if (Elements.navMenu) {
      Elements.navMenu.classList.remove('active');
    }

    document.body.classList.remove('no-scroll');
  }

  /**
   * 初始化搜索功能
   */
  function initSearch() {
    if (!Elements.searchBtn || !Elements.searchModal) return;

    const searchClose = Elements.searchModal.querySelector('.search-close');
    const searchInput = Elements.searchModal.querySelector('.search-input');

    // 打开搜索
    Elements.searchBtn.addEventListener('click', () => {
      openSearch();
    });

    // 关闭搜索
    searchClose?.addEventListener('click', closeSearch);

    // 点击背景关闭
    Elements.searchModal.addEventListener('click', (e) => {
      if (e.target === Elements.searchModal) {
        closeSearch();
      }
    });

    // ESC键关闭
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && State.isSearchOpen) {
        closeSearch();
      }
    });

    // 搜索建议点击
    const suggestionTags = Elements.searchModal.querySelectorAll('.suggestion-tag');
    suggestionTags.forEach(tag => {
      tag.addEventListener('click', () => {
        if (searchInput) {
          searchInput.value = tag.textContent;
          searchInput.focus();
        }
      });
    });
  }

  /**
   * 打开搜索模态框
   */
  function openSearch() {
    State.isSearchOpen = true;
    Elements.searchModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');

    // 聚焦搜索输入框
    setTimeout(() => {
      const searchInput = Elements.searchModal.querySelector('.search-input');
      searchInput?.focus();
    }, 300);
  }

  /**
   * 关闭搜索模态框
   */
  function closeSearch() {
    State.isSearchOpen = false;
    Elements.searchModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
  }

  /**
   * 初始化返回顶部按钮
   */
  function initBackToTop() {
    if (!Elements.backToTop) return;

    const progressCircle = Elements.backToTop.querySelector('.progress-circle');
    const circumference = 2 * Math.PI * 20; // r=20

    // 监听滚动更新进度
    const updateProgress = Utils.throttle(() => {
      const scrollPercent = Utils.getScrollPercent();
      const offset = circumference - (scrollPercent / 100) * circumference;

      if (progressCircle) {
        progressCircle.style.strokeDashoffset = offset;
      }

      // 显示/隐藏按钮
      if (window.pageYOffset > 300) {
        Elements.backToTop.removeAttribute('hidden');
      } else {
        Elements.backToTop.setAttribute('hidden', '');
      }
    }, 100);

    window.addEventListener('scroll', updateProgress, { passive: true });

    // 点击返回顶部
    Elements.backToTop.addEventListener('click', () => {
      Utils.smoothScrollTo(document.body, 0, 800);
    });
  }

  /**
   * 初始化数字动画
   */
  function initNumberAnimations() {
    const statNumbers = document.querySelectorAll('.stat-number .number');

    if (!statNumbers.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const endValue = parseInt(element.dataset.value, 10);
          const suffix = element.dataset.suffix || '';

          Utils.animateNumber(element, 0, endValue, 2000, suffix);
          observer.unobserve(element);
        }
      });
    }, {
      threshold: 0.5
    });

    statNumbers.forEach(num => observer.observe(num));
  }

  /**
   * 初始化图片懒加载
   */
  function initLazyLoading() {
    const lazyImages = document.querySelectorAll('img[data-src]');

    if (!lazyImages.length) return;

    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            img.classList.add('loaded');
            imageObserver.unobserve(img);
          }
        });
      }, {
        rootMargin: '50px 0px',
        threshold: CONFIG.lazyLoadThreshold
      });

      lazyImages.forEach(img => imageObserver.observe(img));
    } else {
      // 回退方案
      lazyImages.forEach(img => {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      });
    }
  }

  /**
   * 初始化滚动动画
   */
  function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-animate]');

    if (!animatedElements.length || Utils.prefersReducedMotion()) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const animation = element.dataset.animate;
          const delay = element.dataset.delay || 0;

          setTimeout(() => {
            element.classList.add('animated', animation);
          }, parseInt(delay, 10));

          observer.unobserve(element);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => observer.observe(el));
  }

  /**
   * 初始化平滑锚点滚动
   */
  function initSmoothAnchors() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');

    anchorLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
          e.preventDefault();
          Utils.smoothScrollTo(targetElement, CONFIG.scrollOffset, 800);

          // 更新URL但不跳转
          history.pushState(null, null, targetId);
        }
      });
    });
  }

  /**
   * 初始化键盘无障碍
   */
  function initKeyboardAccessibility() {
    // 跳过链接
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
      skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
          mainContent.focus();
          mainContent.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }

    // Tab键焦点可见性
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
      }
    });

    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-navigation');
    });
  }

  /**
   * 初始化语言选择器
   */
  function initLanguageSelector() {
    const languageBtn = document.querySelector('.language-btn');
    const languageDropdown = document.querySelector('.language-dropdown');

    if (!languageBtn || !languageDropdown) return;

    languageBtn.addEventListener('click', () => {
      const isExpanded = languageBtn.getAttribute('aria-expanded') === 'true';
      languageBtn.setAttribute('aria-expanded', !isExpanded);
    });

    // 选择语言
    const languageOptions = languageDropdown.querySelectorAll('li');
    languageOptions.forEach(option => {
      option.addEventListener('click', () => {
        const lang = option.dataset.lang;

        // 更新选中状态
        languageOptions.forEach(opt => opt.setAttribute('aria-selected', 'false'));
        option.setAttribute('aria-selected', 'true');

        // 更新按钮文本
        languageBtn.querySelector('span').textContent = option.textContent;
        languageBtn.setAttribute('aria-expanded', 'false');

        // 存储语言偏好
        Utils.setStorage('preferred-language', lang);

        // 触发语言切换事件
        document.dispatchEvent(new CustomEvent('languageChange', { detail: { lang } }));
      });
    });

    // 点击外部关闭
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.language-selector')) {
        languageBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /**
   * 初始化视差效果
   */
  function initParallax() {
    if (Utils.prefersReducedMotion() || Utils.getDeviceInfo().isMobile) return;

    const parallaxLayers = document.querySelectorAll('.parallax-layer');

    if (!parallaxLayers.length) return;

    const handleParallax = Utils.throttle(() => {
      const scrollTop = window.pageYOffset;

      parallaxLayers.forEach(layer => {
        const speed = parseFloat(layer.dataset.speed) || 0.5;
        const yPos = -(scrollTop * speed);
        layer.style.transform = `translate3d(0, ${yPos}px, 0)`;
      });
    }, 16);

    window.addEventListener('scroll', handleParallax, { passive: true });
  }

  /**
   * 初始化卡片悬停效果
   */
  function initCardEffects() {
    const cards = document.querySelectorAll('.inheritor-card, .access-card, .craft-card');

    if (!cards.length || Utils.getDeviceInfo().isMobile) return;

    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  /**
   * 初始化主题切换（深色模式）
   */
  function initThemeToggle() {
    const themeBtn = document.getElementById('themeToggle');
    if (!themeBtn) return;

    // 检查系统偏好和存储的偏好
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const storedTheme = Utils.getStorage('theme');
    const initialTheme = storedTheme || (prefersDark ? 'dark' : 'light');

    setTheme(initialTheme);

    themeBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.dataset.theme;
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
      Utils.setStorage('theme', newTheme);
    });
  }

  /**
   * 设置主题
   * @param {string} theme - 主题名称
   */
  function setTheme(theme) {
    document.documentElement.dataset.theme = theme;

    // 更新meta主题色
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'dark' ? '#1a1a2e' : '#FFFEF5');
    }
  }

  /**
   * 初始化表单验证
   */
  function initFormValidation() {
    const forms = document.querySelectorAll('form[data-validate]');

    forms.forEach(form => {
      form.addEventListener('submit', (e) => {
        if (!validateForm(form)) {
          e.preventDefault();
        }
      });

      // 实时验证
      const inputs = form.querySelectorAll('input, textarea, select');
      inputs.forEach(input => {
        input.addEventListener('blur', () => {
          validateField(input);
        });

        input.addEventListener('input', Utils.debounce(() => {
          if (input.classList.contains('error')) {
            validateField(input);
          }
        }, 300));
      });
    });
  }

  /**
   * 验证表单
   * @param {HTMLFormElement} form
   * @returns {boolean}
   */
  function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    let isValid = true;

    inputs.forEach(input => {
      if (!validateField(input)) {
        isValid = false;
      }
    });

    return isValid;
  }

  /**
   * 验证单个字段
   * @param {HTMLElement} field
   * @returns {boolean}
   */
  function validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    let isValid = true;
    let errorMessage = '';

    // 必填验证
    if (field.required && !value) {
      isValid = false;
      errorMessage = '此字段为必填项';
    }
    // 邮箱验证
    else if (type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        errorMessage = '请输入有效的邮箱地址';
      }
    }
    // 手机号验证
    else if (type === 'tel' && value) {
      const phoneRegex = /^1[3-9]\d{9}$/;
      if (!phoneRegex.test(value)) {
        isValid = false;
        errorMessage = '请输入有效的手机号码';
      }
    }
    // 最小长度验证
    else if (field.minLength && value.length < field.minLength) {
      isValid = false;
      errorMessage = `至少需要 ${field.minLength} 个字符`;
    }

    // 更新UI
    const formGroup = field.closest('.form-group');
    const errorElement = formGroup?.querySelector('.form-error');

    if (isValid) {
      field.classList.remove('error');
      if (errorElement) errorElement.textContent = '';
    } else {
      field.classList.add('error');
      if (errorElement) errorElement.textContent = errorMessage;
    }

    return isValid;
  }

  /**
   * 显示Toast通知
   * @param {Object} options
   */
  function showToast({ title, message, type = 'info', duration = 5000 }) {
    const container = document.querySelector('.toast-container') || createToastContainer();

    const toast = Utils.createElement('div', {
      className: `toast ${type}`,
      role: 'alert'
    }, [
      Utils.createElement('div', { className: 'toast-icon' }, getToastIcon(type)),
      Utils.createElement('div', { className: 'toast-content' }, [
        Utils.createElement('div', { className: 'toast-title' }, title),
        Utils.createElement('div', { className: 'toast-message' }, message)
      ]),
      Utils.createElement('button', {
        className: 'toast-close',
        'aria-label': '关闭',
        onClick: () => removeToast(toast)
      }, '×')
    ]);

    container.appendChild(toast);

    // 触发动画
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    // 自动移除
    if (duration > 0) {
      setTimeout(() => removeToast(toast), duration);
    }

    return toast;
  }

  /**
   * 创建Toast容器
   */
  function createToastContainer() {
    const container = Utils.createElement('div', { className: 'toast-container' });
    document.body.appendChild(container);
    return container;
  }

  /**
   * 获取Toast图标
   * @param {string} type
   * @returns {string}
   */
  function getToastIcon(type) {
    const icons = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ'
    };
    return icons[type] || icons.info;
  }

  /**
   * 移除Toast
   * @param {Element} toast
   */
  function removeToast(toast) {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }

  /**
   * 应用入口
   */
  function init() {
    console.log('--- init called ---');
    // 缓存DOM元素
    cacheElements();
    console.log('Elements cached:', Elements);

    // 初始化各模块
    initNavbar();
    initSearch();
    initBackToTop();
    initLazyLoading();
    initScrollAnimations();
    initSmoothAnchors();
    initKeyboardAccessibility();
    initLanguageSelector();
    initParallax();
    initCardEffects();
    initThemeToggle();
    initFormValidation();

    // 页面加载完成
    if (document.readyState === 'complete') {
      handlePageLoad();
    } else {
      window.addEventListener('load', handlePageLoad);
    }
    setTimeout(() => {
      if (State.isLoading) {
        handlePageLoad();
      }
    }, 5000);

    console.log('🏛️ 廊坊非遗数字中心 - 初始化完成');
  }

  // 暴露全局API
  window.LangfangHeritage = {
    init,
    showToast,
    Utils
  };

  // DOM Ready后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
