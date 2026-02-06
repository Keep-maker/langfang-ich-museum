/**
 * 课程筛选组件
 */
class CourseFilter {
  constructor(container, options = {}) {
    this.container = container;
    this.options = {
      categories: ['全部', '工艺美术', '传统音乐', '民俗文化', '传统戏剧'],
      levels: ['全部', '入门', '初级', '中级', '高级'],
      sortOptions: ['最新上线', '最多学习', '好评优先', '价格最低'],
      ...options
    };

    this.filters = {
      category: '全部',
      level: '全部',
      sort: '最新上线',
      keyword: ''
    };

    this.init();
  }

  init() {
    this.render();
    this.bindEvents();
  }

  render() {
    this.container.innerHTML = `
            <div class="course-filter">
                <div class="filter-row">
                    <div class="filter-group">
                        <label>分类：</label>
                        <div class="filter-buttons" data-filter="category">
                            ${this.options.categories.map(cat =>
      `<button class="${cat === this.filters.category ? 'active' : ''}" 
                                         data-value="${cat}">${cat}</button>`
    ).join('')}
                        </div>
                    </div>
                </div>
                <div class="filter-row">
                    <div class="filter-group">
                        <label>难度：</label>
                        <div class="filter-buttons" data-filter="level">
                            ${this.options.levels.map(level =>
      `<button class="${level === this.filters.level ? 'active' : ''}" 
                                         data-value="${level}">${level}</button>`
    ).join('')}
                        </div>
                    </div>
                    <div class="filter-group">
                        <label>排序：</label>
                        <select class="filter-select" data-filter="sort">
                            ${this.options.sortOptions.map(opt =>
      `<option value="${opt}" ${opt === this.filters.sort ? 'selected' : ''}>${opt}</option>`
    ).join('')}
                        </select>
                    </div>
                </div>
            </div>
        `;

    this.addStyles();
  }

  addStyles() {
    if (document.getElementById('course-filter-styles')) return;

    const style = document.createElement('style');
    style.id = 'course-filter-styles';
    style.textContent = `
            .course-filter {
                background: white;
                padding: 24px;
                border-radius: 16px;
                margin-bottom: 30px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
            }
            .filter-row {
                display: flex;
                flex-wrap: wrap;
                gap: 24px;
                align-items: center;
            }
            .filter-row + .filter-row {
                margin-top: 16px;
                padding-top: 16px;
                border-top: 1px solid #f0f0f0;
            }
            .filter-group {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            .filter-group label {
                font-size: 0.9rem;
                color: #666;
                white-space: nowrap;
            }
            .filter-buttons {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
            }
            .filter-buttons button {
                padding: 6px 16px;
                background: #f5f5f5;
                border: 1px solid transparent;
                border-radius: 20px;
                font-size: 0.9rem;
                color: #666;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            .filter-buttons button:hover {
                background: #eee;
            }
            .filter-buttons button.active {
                background: #8B4513;
                color: white;
            }
            .filter-select {
                padding: 8px 16px;
                border: 1px solid #ddd;
                border-radius: 8px;
                font-size: 0.9rem;
                color: #333;
                cursor: pointer;
                outline: none;
            }
            .filter-select:focus {
                border-color: #8B4513;
            }
        `;
    document.head.appendChild(style);
  }

  bindEvents() {
    // 按钮筛选
    this.container.querySelectorAll('.filter-buttons').forEach(group => {
      group.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
          const filterType = group.dataset.filter;
          const value = e.target.dataset.value;

          group.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
          e.target.classList.add('active');

          this.filters[filterType] = value;
          this.onFilterChange();
        }
      });
    });

    // 下拉筛选
    this.container.querySelectorAll('.filter-select').forEach(select => {
      select.addEventListener('change', (e) => {
        const filterType = select.dataset.filter;
        this.filters[filterType] = e.target.value;
        this.onFilterChange();
      });
    });
  }

  onFilterChange() {
    console.log('筛选条件变化:', this.filters);

    // 触发自定义事件
    const event = new CustomEvent('filterChange', {
      detail: this.filters
    });
    this.container.dispatchEvent(event);
  }

  getFilters() {
    return { ...this.filters };
  }

  reset() {
    this.filters = {
      category: '全部',
      level: '全部',
      sort: '最新上线',
      keyword: ''
    };
    this.render();
    this.bindEvents();
    this.onFilterChange();
  }
}

// 导出
window.CourseFilter = CourseFilter;
/**
 * 学习进度组件
 */
class StudyProgress {
  constructor(container, userData = {}) {
    this.container = container;
    this.userData = {
      coursesCompleted: 5,
      coursesInProgress: 3,
      totalHours: 48,
      certificates: 2,
      streak: 7,
      points: 1250,
      ...userData
    };

    this.init();
  }

  init() {
    this.render();
  }

  render() {
    this.container.innerHTML = `
            <div class="study-progress-widget">
                <div class="progress-header">
                    <h3>📚 我的学习</h3>
                    <a href="#" class="view-all">查看全部 →</a>
                </div>
                
                <div class="progress-stats">
                    <div class="progress-stat">
                        <span class="stat-icon">✅</span>
                        <div class="stat-content">
                            <span class="stat-number">${this.userData.coursesCompleted}</span>
                            <span class="stat-label">已完成课程</span>
                        </div>
                    </div>
                                    <div class="progress-stat">
                        <span class="stat-icon">📖</span>
                        <div class="stat-content">
                            <span class="stat-number">${this.userData.coursesInProgress}</span>
                            <span class="stat-label">学习中</span>
                        </div>
                    </div>
                    <div class="progress-stat">
                        <span class="stat-icon">⏱️</span>
                        <div class="stat-content">
                            <span class="stat-number">${this.userData.totalHours}</span>
                            <span class="stat-label">学习时长(h)</span>
                        </div>
                    </div>
                    <div class="progress-stat">
                        <span class="stat-icon">🏆</span>
                        <div class="stat-content">
                            <span class="stat-number">${this.userData.certificates}</span>
                            <span class="stat-label">获得证书</span>
                        </div>
                    </div>
                </div>
                
                <div class="streak-section">
                    <div class="streak-info">
                        <span class="streak-icon">🔥</span>
                        <span class="streak-text">连续学习 <strong>${this.userData.streak}</strong> 天</span>
                    </div>
                    <div class="streak-calendar">
                        ${this.renderStreakCalendar()}
                    </div>
                </div>
                
                <div class="points-section">
                    <div class="points-info">
                        <span class="points-icon">⭐</span>
                        <span class="points-text">学习积分：<strong>${this.userData.points}</strong></span>
                    </div>
                    <button class="points-btn" onclick="StudyProgress.openPointsShop()">积分商城</button>
                </div>
                
                <div class="continue-learning">
                    <h4>继续学习</h4>
                    <div class="current-course">
                        <div class="course-thumb">🎨</div>
                        <div class="course-info">
                            <p class="course-name">景泰蓝制作工艺入门</p>
                            <div class="course-progress-bar">
                                <div class="progress-fill" style="width: 65%"></div>
                            </div>
                            <p class="progress-text">已完成 65%</p>
                        </div>
                        <button class="continue-btn">继续</button>
                    </div>
                </div>
            </div>
        `;

    this.addStyles();
  }

  renderStreakCalendar() {
    const days = ['一', '二', '三', '四', '五', '六', '日'];
    const today = new Date().getDay();
    const adjustedToday = today === 0 ? 6 : today - 1;

    return days.map((day, index) => {
      const isCompleted = index <= adjustedToday && index >= adjustedToday - this.userData.streak + 1;
      const isToday = index === adjustedToday;
      return `
                <div class="calendar-day ${isCompleted ? 'completed' : ''} ${isToday ? 'today' : ''}">
                    <span class="day-label">${day}</span>
                    <span class="day-status">${isCompleted ? '✓' : ''}</span>
                </div>
            `;
    }).join('');
  }

  addStyles() {
    if (document.getElementById('study-progress-styles')) return;

    const style = document.createElement('style');
    style.id = 'study-progress-styles';
    style.textContent = `
            .study-progress-widget {
                background: white;
                border-radius: 20px;
                padding: 24px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            }
            .progress-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
            }
            .progress-header h3 {
                font-size: 1.1rem;
                font-weight: 600;
                color: #2C1810;
            }
            .view-all {
                font-size: 0.85rem;
                color: #8B4513;
                text-decoration: none;
            }
            .view-all:hover {
                text-decoration: underline;
            }
            .progress-stats {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 16px;
                margin-bottom: 24px;
            }
            .progress-stat {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 12px;
                background: #FDF8F3;
                border-radius: 12px;
            }
            .stat-icon {
                font-size: 1.5rem;
            }
            .stat-content {
                display: flex;
                flex-direction: column;
            }
            .stat-number {
                font-size: 1.3rem;
                font-weight: 700;
                color: #8B4513;
            }
            .stat-label {
                font-size: 0.75rem;
                color: #8B7355;
            }
            .streak-section {
                background: linear-gradient(135deg, #FFF5E6 0%, #FFE8CC 100%);
                border-radius: 12px;
                padding: 16px;
                margin-bottom: 16px;
            }
            .streak-info {
                display: flex;
                align-items: center;
                gap: 8px;
                margin-bottom: 12px;
            }
            .streak-icon {
                font-size: 1.3rem;
            }
            .streak-text {
                font-size: 0.95rem;
                color: #5D4037;
            }
            .streak-text strong {
                color: #E67E22;
                font-size: 1.2rem;
            }
            .streak-calendar {
                display: flex;
                gap: 8px;
            }
            .calendar-day {
                flex: 1;
                text-align: center;
                padding: 8px 4px;
                background: rgba(255, 255, 255, 0.6);
                border-radius: 8px;
            }
            .calendar-day.completed {
                background: #8B4513;
            }
            .calendar-day.today {
                box-shadow: 0 0 0 2px #E67E22;
            }
            .day-label {
                display: block;
                font-size: 0.7rem;
                color: #8B7355;
            }
            .calendar-day.completed .day-label {
                color: rgba(255, 255, 255, 0.8);
            }
            .day-status {
                display: block;
                font-size: 0.8rem;
                color: white;
                font-weight: bold;
            }
            .points-section {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 16px;
                background: #F5E6D3;
                border-radius: 12px;
                margin-bottom: 20px;
            }
            .points-info {
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .points-icon {
                font-size: 1.3rem;
            }
            .points-text {
                font-size: 0.95rem;
                color: #5D4037;
            }
            .points-text strong {
                color: #8B4513;
                font-size: 1.1rem;
            }
            .points-btn {
                padding: 8px 16px;
                background: #8B4513;
                color: white;
                border: none;
                border-radius: 20px;
                font-size: 0.85rem;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            .points-btn:hover {
                background: #6B3410;
            }
            .continue-learning h4 {
                font-size: 0.95rem;
                color: #5D4037;
                margin-bottom: 12px;
            }
            .current-course {
                display: flex;
                align-items: center;
                gap: 14px;
                padding: 14px;
                background: #FDF8F3;
                border-radius: 12px;
            }
            .course-thumb {
                width: 50px;
                height: 50px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: linear-gradient(135deg, #F5E6D3 0%, #E8D5C4 100%);
                border-radius: 10px;
                font-size: 1.5rem;
            }
            .course-info {
                flex: 1;
            }
            .course-name {
                font-size: 0.9rem;
                font-weight: 500;
                color: #2C1810;
                margin-bottom: 8px;
            }
            .course-progress-bar {
                height: 6px;
                background: #E8D5C4;
                border-radius: 3px;
                overflow: hidden;
                margin-bottom: 4px;
            }
            .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #8B4513 0%, #D4A574 100%);
                border-radius: 3px;
                transition: width 0.5s ease;
            }
            .progress-text {
                font-size: 0.75rem;
                color: #8B7355;
            }
            .continue-btn {
                padding: 8px 20px;
                background: #8B4513;
                color: white;
                border: none;
                border-radius: 20px;
                font-size: 0.85rem;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            .continue-btn:hover {
                background: #6B3410;
                transform: translateY(-2px);
            }
            
            @media (max-width: 768px) {
                .progress-stats {
                    grid-template-columns: repeat(2, 1fr);
                }
                .calendar-day {
                    padding: 6px 2px;
                }
                .day-label {
                    font-size: 0.65rem;
                }
            }
        `;
    document.head.appendChild(style);
  }

  updateProgress(newData) {
    this.userData = { ...this.userData, ...newData };
    this.render();
  }

  static openPointsShop() {
    if (window.showNotification) {
      window.showNotification('积分商城即将上线，敬请期待！', 'info');
    }
  }
}

// 导出
window.StudyProgress = StudyProgress;
