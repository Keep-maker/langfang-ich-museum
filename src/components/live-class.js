/**
 * 直播课堂组件
 */
class LiveClass {
  constructor(container, options = {}) {
    this.container = container;
    this.options = {
      autoRefresh: true,
      refreshInterval: 60000,
      ...options
    };

    this.liveClasses = [
      {
        id: 1,
        title: '景泰蓝掐丝技法详解',
        instructor: '张明辉',
        instructorTitle: '国家级传承人',
        startTime: '2024-01-20 14:00',
        duration: 90,
        enrolled: 156,
        maxEnroll: 200,
        status: 'upcoming',
        cover: '🎨'
      },
      {
        id: 2,
        title: '剪纸艺术现场创作',
        instructor: '李秀芳',
        instructorTitle: '省级传承人',
        startTime: '2024-01-20 19:00',
        duration: 60,
        enrolled: 89,
        maxEnroll: 150,
        status: 'upcoming',
        cover: '✂️'
      },
      {
        id: 3,
        title: '京韵大鼓唱腔教学',
        instructor: '王德顺',
        instructorTitle: '市级传承人',
        startTime: '2024-01-19 15:00',
        duration: 120,
        enrolled: 200,
        maxEnroll: 200,
        status: 'live',
        viewers: 1580,
        cover: '🥁'
      }
    ];

    this.init();
  }

  init() {
    this.render();
    if (this.options.autoRefresh) {
      this.startAutoRefresh();
    }
  }

  render() {
    const liveNow = this.liveClasses.filter(c => c.status === 'live');
    const upcoming = this.liveClasses.filter(c => c.status === 'upcoming');

    this.container.innerHTML = `
            <div class="live-class-widget">
                <div class="widget-header">
                    <h3>
                        <span class="live-indicator"></span>
                        直播课堂
                    </h3>
                    <a href="#" class="view-schedule">完整课表 →</a>
                </div>
                
                ${liveNow.length > 0 ? `
                    <div class="live-now-section">
                        <h4>🔴 正在直播</h4>
                        ${liveNow.map(course => this.renderLiveNowCard(course)).join('')}
                    </div>
                ` : ''}
                
                <div class="upcoming-section">
                    <h4>📅 即将开始</h4>
                    <div class="upcoming-list">
                        ${upcoming.map(course => this.renderUpcomingCard(course)).join('')}
                    </div>
                </div>
            </div>
        `;

    this.addStyles();
  }

  renderLiveNowCard(course) {
    return `
            <div class="live-now-card">
                <div class="live-cover">
                    <span class="cover-emoji">${course.cover}</span>
                    <div class="live-badge">
                        <span class="badge-dot"></span>
                        直播中
                    </div>
                    <div class="viewer-count">
                        <span>👁️</span> ${this.formatNumber(course.viewers)}人观看
                    </div>
                </div>
                <div class="live-info">
                    <h5 class="live-title">${course.title}</h5>
                    <div class="instructor-row">
                        <span class="instructor-avatar">👤</span>
                        <span class="instructor-name">${course.instructor}</span>
                        <span class="instructor-tag">${course.instructorTitle}</span>
                    </div>
                    <button class="join-live-btn" onclick="LiveClass.joinLive(${course.id})">
                        进入直播间
                    </button>
                </div>
            </div>
        `;
  }

  renderUpcomingCard(course) {
    const startTime = new Date(course.startTime);
    const timeStr = this.formatTime(startTime);
    const countdown = this.getCountdown(startTime);
    const progress = (course.enrolled / course.maxEnroll) * 100;

    return `
            <div class="upcoming-card">
                <div class="upcoming-cover">
                    <span>${course.cover}</span>
                </div>
                <div class="upcoming-info">
                    <h5>${course.title}</h5>
                    <p class="upcoming-meta">
                        <span>👤 ${course.instructor}</span>
                        <span>⏱️ ${course.duration}分钟</span>
                    </p>
                    <p class="upcoming-time">
                        <span>📅 ${timeStr}</span>
                        ${countdown ? `<span class="countdown">${countdown}</span>` : ''}
                    </p>
                    <div class="enroll-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${progress}%"></div>
                        </div>
                        <span class="enroll-text">${course.enrolled}/${course.maxEnroll}人已预约</span>
                    </div>
                </div>
                <button class="reserve-btn ${course.enrolled >= course.maxEnroll ? 'disabled' : ''}"
                        onclick="LiveClass.reserve(${course.id})"
                        ${course.enrolled >= course.maxEnroll ? 'disabled' : ''}>
                    ${course.enrolled >= course.maxEnroll ? '已约满' : '预约'}
                </button>
            </div>
        `;
  }

  formatTime(date) {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${month}月${day}日
