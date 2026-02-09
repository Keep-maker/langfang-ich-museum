/**
 * ==========================================
 * 廊坊非遗数字中心 - 主JavaScript文件
 * ==========================================
 */

import Utils from './utils.js';

(function () {
  'use strict';

  // 全局错误捕获，方便调试
  window.onerror = function (message, source, lineno, colno, error) {
    console.error('Global Error caught:', message, 'at', source, ':', lineno, ':', colno);
    // 如果报错导致加载器没隐藏，尝试隐藏它
    if (typeof handlePageLoad === 'function') {
      handlePageLoad();
    }
    return false;
  };

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
   * 显示全局提示 (支持对象或字符串参数)
   */
  function showToast(options) {
    // 处理字符串参数的情况
    if (typeof options === 'string') {
      options = { message: options, title: '提示', type: 'info' };
    }

    const { title, message, type = 'info', duration = 5000 } = options;
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
    try {
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
        // 尝试重新查找一次，万一是之前的 cacheElements 没找着
        const loader = document.getElementById('pageLoader');
        if (loader) {
          loader.classList.add('hidden');
          setTimeout(() => {
            loader.style.display = 'none';
            State.isLoading = false;
          }, 500);
        }
      }

      // 初始化AOS动画库
      if (typeof AOS !== 'undefined') {
        try {
          AOS.init({
            duration: 800,
            easing: 'ease-out',
            once: true,
            offset: 100,
            disable: Utils.prefersReducedMotion()
          });
        } catch (aosError) {
          console.error('AOS init error:', aosError);
        }
      }

      // 触发数字动画
      try {
        initNumberAnimations();
      } catch (numAnimError) {
        console.error('initNumberAnimations error:', numAnimError);
      }
    } catch (err) {
      console.error('Error in handlePageLoad:', err);
      // 最后的最后，强制解锁滚动
      document.body.classList.remove('no-scroll');
      State.isLoading = false;
    }

    document.body.classList.remove('no-scroll');
  }

  /**
   * 初始化导航栏
   */
  function initNavbar() {
    if (!Elements.navbar) return;

    // 自动设置当前页面的 active 状态
    updateActiveNavItem();

    // 滚动时改变导航栏样式
    const handleScroll = Utils.throttle(() => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

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
      // 先移除可能存在的监听器，防止重复绑定
      Elements.fullscreenBtn.removeEventListener('click', Utils.toggleFullscreen);
      Elements.fullscreenBtn.addEventListener('click', Utils.toggleFullscreen);
    }
  }

  /**
   * 根据当前 URL 更新导航栏激活状态
   */
  function updateActiveNavItem() {
    const currentPath = window.location.pathname;
    const navItems = document.querySelectorAll('.nav-item, .sidebar-link');

    navItems.forEach(item => {
      const href = item.getAttribute('href');
      if (!href) return;

      // 移除所有 active 类
      item.classList.remove('active');

      // 检查路径匹配
      // 处理首页特殊情况
      if (currentPath === '/' || currentPath.endsWith('index.html')) {
        if (href.endsWith('index.html') || href === './' || href === 'index.html') {
          item.classList.add('active');
        }
      } else if (href !== '#' && !href.endsWith('index.html')) {
        // 获取文件名进行匹配
        const fileName = href.split('/').pop();
        if (currentPath.includes(fileName)) {
          item.classList.add('active');
        }
      }
    });
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
    // 兼容两种属性：data-value (mainJs) 和 data-target (animations.js)
    const statNumbers = document.querySelectorAll('.stat-number .number, .stat-number[data-target]');

    if (!statNumbers.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const targetNode = element.classList.contains('number') ? element : element.querySelector('.number');

          if (!targetNode) return;

          const endValue = parseInt(element.dataset.value || element.dataset.target, 10);
          const suffix = element.dataset.suffix || '';

          if (!isNaN(endValue)) {
            Utils.animateNumber(targetNode, 0, endValue, 2000, suffix);
            observer.unobserve(element);
          }
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
    // 键盘无障碍按钮
    const accessibilityBtn = document.querySelector('.accessibility-btn');
    if (accessibilityBtn) {
      accessibilityBtn.addEventListener('click', () => {
        document.body.classList.toggle('accessibility-mode');
        const isActive = document.body.classList.contains('accessibility-mode');

        // 存储偏好
        Utils.setStorage('accessibility-mode', isActive);

        showToast({
          title: '无障碍模式',
          message: isActive ? '已开启高对比度辅助模式' : '已关闭辅助模式',
          type: 'info'
        });
      });

      // 初始化加载存储的偏好
      if (Utils.getStorage('accessibility-mode')) {
        document.body.classList.add('accessibility-mode');
      }
    }

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

    // 获取存储的语言偏好并更新UI
    const savedLang = Utils.getStorage('preferred-language', 'zh');
    updateLanguageUI(savedLang);

    languageBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isExpanded = languageBtn.getAttribute('aria-expanded') === 'true';
      languageBtn.setAttribute('aria-expanded', !isExpanded);
      languageDropdown.classList.toggle('active', !isExpanded);
    });

    // 选择语言
    const languageOptions = languageDropdown.querySelectorAll('li');
    languageOptions.forEach(option => {
      option.addEventListener('click', (e) => {
        e.stopPropagation();
        const lang = option.dataset.lang;
        updateLanguageUI(lang);

        // 存储语言偏好
        Utils.setStorage('preferred-language', lang);

        // 触发语言切换事件
        document.dispatchEvent(new CustomEvent('languageChange', { detail: { lang } }));

        showToast({ title: '语言切换', message: `已切换至: ${option.textContent}`, type: 'success' });
      });
    });

    // 点击外部关闭
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.language-selector')) {
        languageBtn.setAttribute('aria-expanded', 'false');
        languageDropdown.classList.remove('active');
      }
    });
  }

  /**
   * 更新语言UI
   */
  function updateLanguageUI(lang) {
    const languageBtn = document.querySelector('.language-btn');
    const languageDropdown = document.querySelector('.language-dropdown');
    if (!languageBtn || !languageDropdown) return;

    const languageOptions = languageDropdown.querySelectorAll('li');
    const langMap = {
      'zh': '中文',
      'en': 'English',
      'ja': '日本語'
    };

    // 更新选中状态
    languageOptions.forEach(opt => {
      const isSelected = opt.dataset.lang === lang;
      opt.setAttribute('aria-selected', isSelected);
      opt.classList.toggle('active', isSelected);
    });

    // 更新按钮文本
    const btnSpan = languageBtn.querySelector('span');
    if (btnSpan) btnSpan.textContent = langMap[lang] || '中文';

    languageBtn.setAttribute('aria-expanded', 'false');
    languageDropdown.classList.remove('active');
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
    console.log('🏛️ Langfang ICH Digital Center - Initializing...');

    try {
      // 1. 核心基础模块
      cacheElements();

      const modules = [
        { name: 'Navbar', fn: initNavbar },
        { name: 'Search', fn: initSearch },
        { name: 'BackToTop', fn: initBackToTop },
        { name: 'Language', fn: initLanguageSelector },
        { name: 'Accessibility', fn: initKeyboardAccessibility },
        { name: 'Theme', fn: initThemeToggle }
      ];

      // 2. 交互与视觉模块
      const extraModules = [
        { name: 'LazyLoading', fn: initLazyLoading },
        { name: 'ScrollAnims', fn: initScrollAnimations },
        { name: 'SmoothAnchors', fn: initSmoothAnchors },
        { name: 'Parallax', fn: initParallax },
        { name: 'CardEffects', fn: initCardEffects },
        { name: 'FormValidation', fn: initFormValidation }
      ];

      // 独立初始化，互不干扰
      [...modules, ...extraModules].forEach(module => {
        try {
          module.fn();
        } catch (e) {
          console.warn(`[Init] Module "${module.name}" failed to initialize:`, e);
        }
      });

      console.log('✅ All modules processed');
    } catch (error) {
      console.error('Critical initialization error:', error);
      // 即便初始化报错，也要尝试隐藏加载器
      handlePageLoad();
    }

    // 页面加载完成处理
    if (document.readyState === 'complete') {
      handlePageLoad();
    } else {
      window.addEventListener('load', handlePageLoad);
      // 增加 DOMContentLoaded 作为备份，通常此时 DOM 已经可用，可以提前隐藏或确保隐藏
      document.addEventListener('DOMContentLoaded', () => {
        console.log('DOMContentLoaded fired');
        // 如果 3 秒后还没加载完，强制隐藏
        setTimeout(() => {
          if (State.isLoading) {
            console.log('Forcing loader hide after timeout');
            handlePageLoad();
          }
        }, 3000);
      });
    }

    // 终极兜底：无论如何，5秒内必须关闭加载器
    setTimeout(() => {
      if (State.isLoading) {
        console.log('Ultimate fallback: hiding loader');
        handlePageLoad();
      }
    }, 5000);

    console.log('🏛️ 廊坊非遗数字中心 - 初始化逻辑设置完成');
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
