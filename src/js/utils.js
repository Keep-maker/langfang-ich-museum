/**
 * ==========================================
 * 廊坊非遗数字中心 - 工具函数库
 * ==========================================
 */

const Utils = (function () {
  'use strict';

  /**
   * 防抖函数
   * @param {Function} func - 要防抖的函数
   * @param {number} wait - 等待时间(ms)
   * @param {boolean} immediate - 是否立即执行
   * @returns {Function}
   */
  function debounce(func, wait = 300, immediate = false) {
    let timeout;
    return function executedFunction(...args) {
      const context = this;
      const later = function () {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }

  /**
   * 节流函数
   * @param {Function} func - 要节流的函数
   * @param {number} limit - 时间限制(ms)
   * @returns {Function}
   */
  function throttle(func, limit = 100) {
    let inThrottle;
    return function executedFunction(...args) {
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  /**
   * 平滑滚动到指定元素
   * @param {string|Element} target - 目标元素或选择器
   * @param {number} offset - 偏移量
   * @param {number} duration - 动画时长
   */
  function smoothScrollTo(target, offset = 0, duration = 800) {
    const element = typeof target === 'string' ? document.querySelector(target) : target;
    if (!element) return;

    const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - offset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function animation(currentTime) {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      const ease = easeInOutCubic(progress);

      window.scrollTo(0, startPosition + distance * ease);

      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    }

    requestAnimationFrame(animation);
  }

  /**
   * 缓动函数 - easeInOutCubic
   * @param {number} t - 进度 (0-1)
   * @returns {number}
   */
  function easeInOutCubic(t) {
    return t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  /**
   * 检测元素是否在视口中
   * @param {Element} element - 要检测的元素
   * @param {number} threshold - 阈值 (0-1)
   * @returns {boolean}
   */
  function isInViewport(element, threshold = 0) {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;

    const vertInView = (rect.top <= windowHeight * (1 - threshold)) &&
      ((rect.top + rect.height) >= windowHeight * threshold);
    const horInView = (rect.left <= windowWidth * (1 - threshold)) &&
      ((rect.left + rect.width) >= windowWidth * threshold);

    return vertInView && horInView;
  }

  /**
   * 数字动画（计数器效果）
   * @param {Element} element - 目标元素
   * @param {number} start - 起始值
   * @param {number} end - 结束值
   * @param {number} duration - 动画时长
   * @param {string} suffix - 后缀
   */
  function animateNumber(element, start, end, duration = 2000, suffix = '') {
    let startTime = null;
    const range = end - start;

    function step(currentTime) {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const ease = easeInOutCubic(progress);
      const current = Math.floor(start + range * ease);

      element.textContent = formatNumber(current) + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }

  /**
   * 格式化数字（添加千分位分隔符）
   * @param {number} num - 数字
   * @returns {string}
   */
  function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  /**
   * 获取滚动百分比
   * @returns {number} 0-100
   */
  function getScrollPercent() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    return scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
  }

  /**
   * 设置CSS变量
   * @param {string} name - 变量名
   * @param {string} value - 变量值
   * @param {Element} element - 目标元素，默认为根元素
   */
  function setCSSVar(name, value, element = document.documentElement) {
    element.style.setProperty(name, value);
  }

  /**
   * 获取CSS变量
   * @param {string} name - 变量名
   * @param {Element} element - 目标元素
   * @returns {string}
   */
  function getCSSVar(name, element = document.documentElement) {
    return getComputedStyle(element).getPropertyValue(name).trim();
  }

  /**
   * 加载图片
   * @param {string} src - 图片地址
   * @returns {Promise<HTMLImageElement>}
   */
  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  /**
   * 预加载图片数组
   * @param {string[]} sources - 图片地址数组
   * @returns {Promise<HTMLImageElement[]>}
   */
  function preloadImages(sources) {
    return Promise.all(sources.map(loadImage));
  }

  /**
   * 生成唯一ID
   * @param {string} prefix - 前缀
   * @returns {string}
   */
  function generateId(prefix = 'id') {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 检测设备类型
   * @returns {Object}
   */
  function getDeviceInfo() {
    const ua = navigator.userAgent;
    return {
      isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua),
      isIOS: /iPad|iPhone|iPod/.test(ua),
      isAndroid: /Android/.test(ua),
      isSafari: /^((?!chrome|android).)*safari/i.test(ua),
      isChrome: /Chrome/.test(ua),
      isFirefox: /Firefox/.test(ua),
      isEdge: /Edge/.test(ua),
      isTouchDevice: 'ontouchstart' in window || navigator.maxTouchPoints > 0
    };
  }

  /**
   * 检测是否支持某个CSS特性
   * @param {string} property - CSS属性
   * @param {string} value - CSS值
   * @returns {boolean}
   */
  function supportsCSSProperty(property, value) {
    if (window.CSS && window.CSS.supports) {
      return CSS.supports(property, value);
    }
    // 回退方案
    const element = document.createElement('div');
    element.style[property] = value;
    return element.style[property] === value;
  }

  /**
   * 检测是否偏好减少动画
   * @returns {boolean}
   */
  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /**
   * 存储数据到localStorage
   * @param {string} key - 键
   * @param {*} value - 值
   */
  function setStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn('localStorage不可用:', e);
    }
  }

  /**
   * 从localStorage获取数据
   * @param {string} key - 键
   * @param {*} defaultValue - 默认值
   * @returns {*}
   */
  function getStorage(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.warn('localStorage读取失败:', e);
      return defaultValue;
    }
  }

  /**
   * 复制文本到剪贴板
   * @param {string} text - 要复制的文本
   * @returns {Promise<boolean>}
   */
  async function copyToClipboard(text) {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
      // 回退方案
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      return true;
    } catch (e) {
      console.error('复制失败:', e);
      return false;
    }
  }

  /**
   * 等待指定时间
   * @param {number} ms - 毫秒
   * @returns {Promise<void>}
   */
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 创建元素
   * @param {string} tag - 标签名
   * @param {Object} attributes - 属性
   * @param {string|Element|Element[]} children - 子元素
   * @returns {Element}
   */
  function createElement(tag, attributes = {}, children = null) {
    const element = document.createElement(tag);

    Object.entries(attributes).forEach(([key, value]) => {
      if (key === 'className') {
        element.className = value;
      } else if (key === 'style' && typeof value === 'object') {
        Object.assign(element.style, value);
      } else if (key.startsWith('on') && typeof value === 'function') {
        element.addEventListener(key.slice(2).toLowerCase(), value);
      } else if (key === 'dataset' && typeof value === 'object') {
        Object.entries(value).forEach(([dataKey, dataValue]) => {
          element.dataset[dataKey] = dataValue;
        });
      } else {
        element.setAttribute(key, value);
      }
    });

    if (children) {
      if (typeof children === 'string') {
        element.textContent = children;
      } else if (Array.isArray(children)) {
        children.forEach(child => {
          if (child) element.appendChild(child);
        });
      } else {
        element.appendChild(children);
      }
    }

    return element;
  }

  /**
   * 切换全屏模式
   */
  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`无法进入全屏模式: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }

  // 公开API
  return {
    debounce,
    throttle,
    smoothScrollTo,
    easeInOutCubic,
    isInViewport,
    animateNumber,
    formatNumber,
    getScrollPercent,
    setCSSVar,
    getCSSVar,
    loadImage,
    preloadImages,
    generateId,
    getDeviceInfo,
    supportsCSSProperty,
    prefersReducedMotion,
    setStorage,
    getStorage,
    copyToClipboard,
    sleep,
    createElement,
    toggleFullscreen
  };

})();

// 导出 Utils
export default Utils;
