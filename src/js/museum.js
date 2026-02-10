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

  // ========== 展品数据 ==========
  const EXHIBITS_DATA = {
    'filigree': [
      {
        id: 'f1',
        title: '花丝镶嵌凤冠',
        era: '清代',
        craft: '花丝镶嵌、点翠、累丝',
        desc: '这件凤冠采用传统花丝镶嵌工艺制作，以金银为基材，运用掐、填、攒、焊等技法，镶嵌珍珠、宝石，展现了中国传统金工技艺的精湛水平。',
        unit: '故宫博物院',
        badge: '国宝级',
        image: 'https://img.d-arts.cn/grab_img/29b4ffadfeb3241a98e460edc4e9a7eb1659582580.jpeg'
      },
      {
        id: 'f2',
        title: '金累丝嵌宝石香囊',
        era: '明代',
        craft: '累丝、镶嵌',
        desc: '此香囊通体以细如发丝的金丝累织而成，呈如意形，两面镂空，镶嵌红绿宝石，工艺极其精细，体现了明代宫廷审美的华贵与细腻。',
        unit: '国家博物馆',
        badge: '一级文物',
        image: 'https://k.sinaimg.cn/n/sinakd10120/206/w619h387/20200702/2b3f-ivwfwmn7241071.jpg/w700d1q75cms.jpg'
      }
    ],
    'cloisonne': [
      {
        id: 'c1',
        title: '景泰蓝缠枝莲纹鼎炉',
        era: '元代',
        craft: '景泰蓝、掐丝、点蓝',
        desc: '元代景泰蓝精品，釉色深沉稳重，掐丝豪放，缠枝莲纹饰饱满，是研究早期景泰蓝工艺的重要实物资料。',
        unit: '廊坊博物馆',
        badge: '镇馆之宝',
        image: 'https://ts1.tc.mm.bing.net/th/id/R-C.b8ea2d2771bc9cc6edcb0e58a8a0652d?rik=jGbAxYe6bxCm%2fQ&riu=http%3a%2f%2fwww.zhongyishoucang.com%2fimages%2fupload%2fimage%2f202011%2f20201107175002_92433.jpg&ehk=iKhdMb59aShlPqqUNAa2Ig95Vdg2XtJLjHbL18Y%2f3qA%3d&risl=&pid=ImgRaw&r=0'
      },
      {
        id: 'c2',
        title: '铜胎掐丝珐琅麒麟',
        era: '清代',
        craft: '掐丝珐琅、镀金',
        desc: '这对麒麟造型雄健，色彩斑斓，珐琅质地细腻，镀金厚重，是清代宫廷陈设佳品。',
        unit: '廊坊文化馆',
        badge: '珍贵文物',
        image: 'https://ts1.tc.mm.bing.net/th/id/R-C.60e212952789f80bf4ab92f325e734c4?rik=1nwTWDN5%2fekB1g&riu=http%3a%2f%2fnjgx.org%2fjaney_editor%2fattached%2fimage%2f20150717%2f20150717150767806780.jpg&ehk=IvrsZBM7CJ96UBuvWQ2H73Z%2ffjI5bLMz%2bP4vNv6jJRQ%3d&risl=&pid=ImgRaw&r=0'
      }
    ],
    'crafts': [
      {
        id: 'cr1',
        title: '脱胎漆器云龙纹瓶',
        era: '现代',
        craft: '脱胎漆器、髹饰',
        desc: '廊坊现代非遗工艺精品，器型优美，漆色光润，云龙纹饰栩栩如生，展现了现代传承人对传统工艺的继承与创新。',
        unit: '廊坊非遗中心',
        badge: '非遗精品',
        image: 'https://www.zsbeike.com/imgs/D/D11108/d11108.0171.2[07c0a85a85f8].jpg'
      }
    ],
    'inheritors': [
      {
        id: 'i1',
        title: '景泰蓝传承人 - 马福良',
        era: '国家级',
        craft: '景泰蓝制作技艺',
        desc: '马福良，国家级非物质文化遗产代表性项目景泰蓝制作技艺代表性传承人。他长期从事景泰蓝技艺的研究与创作，在继承传统的基础上，对釉料和掐丝工艺进行了多项创新。',
        unit: '廊坊市',
        badge: '国家级传承人',
        image: '../assets/images/all-inheritors/马福良.jpg'
      }
    ],
    'culture': [
      {
        id: 'cu1',
        title: '廊坊非遗分布图',
        era: '现代',
        craft: '文化研究',
        desc: '通过数字化地图展示廊坊市各区县的非物质文化遗产分布情况，包括传统美术、传统技艺、民间文学等多个类别。',
        unit: '文化馆',
        badge: '文化专题',
        image: 'https://ts1.tc.mm.bing.net/th/id/OIP-C.t9akY6AW4VTITutxzc05iAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3'
      }
    ]
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

    // 检查 URL Hash 并更新初始展厅
    handleInitialHash();

    // 绑定事件
    bindEvents();

    // 初始化粒子效果
    initParticles();

    // 初始化展品卡片
    initExhibitCards();

    // 初始渲染展品
    renderExhibits(State.currentHall);

    // 开始自动播放
    if (State.isAutoPlaying) {
      startAutoPlay();
    }

    console.log('🏛️ 虚拟博物馆初始化完成');
  }

  /**
   * 处理初始 URL Hash
   */
  function handleInitialHash() {
    const hash = window.location.hash.replace('#', '');
    if (hash && EXHIBITS_DATA[hash]) {
      State.currentHall = hash;
      // 更新标签状态
      hallTabs.forEach(tab => {
        if (tab.dataset.hall === hash) {
          tab.classList.add('active');
          tab.setAttribute('aria-selected', 'true');
        } else {
          tab.classList.remove('active');
          tab.setAttribute('aria-selected', 'false');
        }
      });
    }
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
    // 展品容器
    State.exhibitsGrid = document.querySelector('.exhibits-grid');
    updateExhibitCardsList();
  }

  /**
   * 更新展品卡片列表引用
   */
  function updateExhibitCardsList() {
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
    fullscreenBtn?.addEventListener('click', Utils.toggleFullscreen);

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

    // 重新渲染展品列表
    renderExhibits(hallId);

    // 显示提示
    showToast(`已切换到${getHallName(hallId)}`);
  }

  /**
   * 渲染展品列表
   */
  function renderExhibits(hallId) {
    if (!State.exhibitsGrid) return;

    const data = EXHIBITS_DATA[hallId] || [];
    if (data.length === 0) {
      State.exhibitsGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 50px; color: var(--color-ink-gray-light);">该展厅暂无展品，敬请期待...</div>';
      return;
    }

    State.exhibitsGrid.innerHTML = data.map((item, index) => `
      <article class="exhibit-card" data-aos="fade-up" data-aos-delay="${index * 100}" data-id="${item.id}">
        <div class="exhibit-image">
          <img src="${item.image}" alt="${item.title}" loading="lazy"
               onerror="this.onerror=null;this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22440%22%3E%3Crect fill=%22%231a1a2e%22 width=%22400%22 height=%22440%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-size=%2224%22 fill=%22%23D4AF37%22 font-family=%22serif%22%3E${encodeURIComponent(item.title)}%3C/text%3E%3C/svg%3E'">
          <div class="exhibit-overlay">
            <span class="exhibit-view-btn">查看详情</span>
          </div>
          <span class="exhibit-badge">${item.badge}</span>
        </div>
        <div class="exhibit-content">
          <h3 class="exhibit-title">${item.title}</h3>
          <p class="exhibit-desc">${item.desc}</p>
          <div class="exhibit-meta">
            <span class="exhibit-meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              ${item.era}
            </span>
            <span class="exhibit-meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2L2 7L12 12L22 7L12 2Z M2 17L12 22L22 17 M2 12L12 17L22 12" />
              </svg>
              ${item.craft.split('、')[0]}
            </span>
          </div>
        </div>
      </article>
    `).join('');

    // 重新初始化 AOS
    if (typeof AOS !== 'undefined') {
      AOS.refresh();
    }

    // 重新绑定事件
    updateExhibitCardsList();
    initExhibitCards();

    // 为新渲染的卡片绑定点击事件
    exhibitCards.forEach(card => {
      card.addEventListener('click', () => {
        showExhibitInfo(card);
      });
    });
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
      hallScene.style.transform = `scale(0.95) rotate(${State.rotation}deg)`;

      setTimeout(() => {
        hallScene.style.opacity = '1';
        hallScene.style.transform = `scale(${State.zoom}) rotate(${State.rotation}deg)`;

        // 根据展厅更新背景颜色
        const colors = {
          'filigree': 'radial-gradient(circle at center, #2a1a1a 0%, #1a0d0d 100%)',
          'cloisonne': 'radial-gradient(circle at center, #1e2a4a 0%, #1a1a2e 100%)',
          'crafts': 'radial-gradient(circle at center, #1a2a1a 0%, #0d1a0d 100%)',
          'inheritors': 'radial-gradient(circle at center, #2a2a1a 0%, #1a1a0d 100%)',
          'culture': 'radial-gradient(circle at center, #1a1a1a 0%, #000000 100%)'
        };
        hallScene.style.background = colors[State.currentHall] || colors.filigree;
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
    const id = card.dataset.id;
    const hallData = EXHIBITS_DATA[State.currentHall] || [];
    const exhibit = hallData.find(item => item.id === id);

    if (!exhibit) return;

    if (infoPanel) {
      // 更新信息面板内容
      const sections = infoPanel.querySelectorAll('.detail-section');

      sections[0].querySelector('.detail-value').textContent = exhibit.title;
      sections[1].querySelector('.detail-value').textContent = exhibit.era;
      sections[2].querySelector('.detail-value').textContent = exhibit.craft;
      sections[3].querySelector('.detail-value').textContent = exhibit.desc;
      sections[4].querySelector('.detail-value').textContent = exhibit.unit;

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
