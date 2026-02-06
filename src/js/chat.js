/**
 * 廊坊非遗数字中心 - AI智能导览对话系统
 * 非遗宫廷风格 v2.1
 * 
 * 功能：流式AI对话、Markdown渲染、印章动画、快捷问题、粒子背景
 */

import Utils from './utils.js';

(function () {
  'use strict';

  // ========== 配置 ==========
  const CONFIG = {
    apiUrl: 'http://localhost:8000/chat',
    maxHistory: 20,
    particleCount: 15
  };

  // ========== 状态管理 ==========
  const State = {
    chatHistory: [],
    isLoading: false,
    messageCount: 0
  };

  // ========== DOM缓存 ==========
  const Elements = {};

  // ========== 初始化 ==========
  function init() {
    cacheElements();
    if (!Elements.chatFlow) return;

    bindEvents();
    initParticles();
  }

  function cacheElements() {
    Elements.chatFlow = document.getElementById('chat-flow');
    Elements.userInput = document.getElementById('userInput');
    Elements.sendBtn = document.getElementById('sendBtn');
    Elements.clearBtn = document.getElementById('clearBtn');
    Elements.particlesContainer = document.querySelector('.bg-particles');
    Elements.quickQuestions = document.querySelectorAll('.question-tag');
  }

  function bindEvents() {
    if (Elements.sendBtn) {
      Elements.sendBtn.addEventListener('click', handleSend);
    }

    if (Elements.userInput) {
      Elements.userInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          handleSend();
        }
      });

      Elements.userInput.addEventListener('focus', () => {
        Elements.userInput.closest('.input-area')?.classList.add('focused');
      });
      Elements.userInput.addEventListener('blur', () => {
        Elements.userInput.closest('.input-area')?.classList.remove('focused');
      });
    }

    // 快捷问题
    Elements.quickQuestions.forEach(tag => {
      tag.addEventListener('click', () => {
        const question = tag.dataset.question || tag.textContent.trim();
        if (Elements.userInput) {
          Elements.userInput.value = question;
          handleSend();
        }
      });
    });

    if (Elements.clearBtn) {
      Elements.clearBtn.addEventListener('click', clearChat);
    }

    if (Elements.sendBtn) {
      Elements.sendBtn.addEventListener('click', createRipple);
    }
  }

  // ========== 消息发送 ==========
  function handleSend() {
    if (State.isLoading) return;

    const prompt = Elements.userInput.value.trim();
    if (!prompt) {
      shakeInput();
      return;
    }

    Elements.userInput.value = '';
    State.isLoading = true;
    updateSendBtnState();

    appendUserMessage(prompt);
    sendToAI(prompt);
  }

  // ========== 渲染用户消息 ==========
  function appendUserMessage(content) {
    State.messageCount++;
    const msgDiv = document.createElement('div');
    msgDiv.className = 'msg user-msg';

    const time = getTimeString();
    msgDiv.innerHTML = `
      <div class="user-bubble">${escapeHtml(content)}</div>
      <span class="user-timestamp">${time}</span>
    `;

    Elements.chatFlow.appendChild(msgDiv);
    scrollToBottom();
  }

  // ========== AI交互 ==========
  async function sendToAI(prompt) {
    const { msgDiv, textContainer, sealIcon } = appendAiPlaceholder();

    try {
      const response = await fetch(CONFIG.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt,
          history: State.chatHistory.slice(-CONFIG.maxHistory)
        })
      });

      if (!response.ok) {
        throw new Error(`服务响应异常 (${response.status})`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullReply = '';

      // 接收到数据，切换到内容模式
      msgDiv.classList.remove('typing');
      textContainer.style.display = 'block';
      textContainer.textContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        fullReply += chunk;

        // 流式阶段：先用纯文本显示，保证实时性
        textContainer.textContent = fullReply;
        scrollToBottom();
      }

      // 流式结束后：将完整文本渲染为Markdown格式的HTML
      textContainer.innerHTML = renderMarkdown(fullReply);
      textContainer.classList.add('markdown-body');

      // 激活印章闪烁
      sealIcon.classList.add('seal-active');

      // 添加时间戳
      const timeSpan = document.createElement('span');
      timeSpan.className = 'ai-timestamp';
      timeSpan.textContent = getTimeString();
      msgDiv.querySelector('.ai-bubble').appendChild(timeSpan);

      // 更新历史
      State.chatHistory.push({ role: 'user', content: prompt });
      State.chatHistory.push({ role: 'assistant', content: fullReply });

    } catch (error) {
      console.error('AI请求失败:', error);
      msgDiv.classList.remove('typing');
      textContainer.style.display = 'block';
      textContainer.innerHTML = `
        <span class="error-text">
          <svg class="error-icon" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/>
            <path d="M8 5v4M8 11v0.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          文脉连接中断，请检查AI服务是否启动后重试。
        </span>
      `;
    } finally {
      State.isLoading = false;
      updateSendBtnState();
      scrollToBottom();
    }
  }

  // ========== 渲染AI占位气泡 ==========
  function appendAiPlaceholder() {
    State.messageCount++;
    const msgDiv = document.createElement('div');
    msgDiv.className = 'msg ai-msg typing';

    msgDiv.innerHTML = `
      <div class="ai-bubble">
        <div class="label-box">
          <i class="seal-icon"></i>
          <span>答 · 匠心</span>
        </div>
        <div class="ai-content-text"></div>
        <div class="loading-dots">
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
          <span class="loading-label">匠心探寻中...</span>
        </div>
      </div>
    `;

    Elements.chatFlow.appendChild(msgDiv);
    scrollToBottom();

    return {
      msgDiv,
      textContainer: msgDiv.querySelector('.ai-content-text'),
      sealIcon: msgDiv.querySelector('.seal-icon'),
      loadingDots: msgDiv.querySelector('.loading-dots')
    };
  }

  // ========== 轻量Markdown渲染器 ==========
  function renderMarkdown(text) {
    if (!text) return '';

    // 先对原始文本做HTML转义（保护特殊字符）
    let html = escapeHtml(text);

    // --- 表格（必须在其他行内处理之前，因为表格行含 | ）---
    html = renderTables(html);

    // --- 代码块 ```...``` ---
    html = html.replace(/```(\w*)\n([\s\S]*?)```/g, function (match, lang, code) {
      return '<pre class="md-code-block"><code>' + code.trim() + '</code></pre>';
    });

    // --- 行内代码 `...` ---
    html = html.replace(/`([^`]+)`/g, '<code class="md-inline-code">$1</code>');

    // --- 标题 ---
    html = html.replace(/^#### (.+)$/gm, '<h4 class="md-h4">$1</h4>');
    html = html.replace(/^### (.+)$/gm, '<h3 class="md-h3">$1</h3>');
    html = html.replace(/^## (.+)$/gm, '<h2 class="md-h2">$1</h2>');
    html = html.replace(/^# (.+)$/gm, '<h1 class="md-h1">$1</h1>');

    // --- 粗体和斜体 ---
    html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

    // --- 分隔线 ---
    html = html.replace(/^---+$/gm, '<hr class="md-hr">');

    // --- 无序列表 ---
    html = html.replace(/^[\-\*] (.+)$/gm, '<li>$1</li>');
    html = html.replace(/((?:<li>.*<\/li>\n?)+)/g, '<ul class="md-list">$1</ul>');

    // --- 有序列表 ---
    html = html.replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>');
    // 包裹连续的<li>为<ol>（如果前面没有被<ul>包裹的话）
    html = html.replace(/((?:<li>.*<\/li>\n?)+)/g, function (match) {
      // 如果已经被<ul>包裹则跳过
      if (match.includes('<ul')) return match;
      return '<ol class="md-list">' + match + '</ol>';
    });

    // --- 段落处理：连续两个换行变段落，单个换行变<br> ---
    // 先处理连续空行
    html = html.replace(/\n{2,}/g, '</p><p class="md-p">');
    // 单个换行（但不在标签之间）
    html = html.replace(/\n/g, '<br>');

    // 清理：移除标签之间多余的<br>
    html = html.replace(/<br>\s*(<\/?(?:h[1-4]|ul|ol|li|pre|table|thead|tbody|tr|th|td|hr|p|div))/g, '$1');
    html = html.replace(/(<\/(?:h[1-4]|ul|ol|li|pre|table|thead|tbody|tr|th|td|hr|p|div)>)\s*<br>/g, '$1');

    // 包裹在段落中
    html = '<p class="md-p">' + html + '</p>';

    // 清理空段落
    html = html.replace(/<p class="md-p">\s*<\/p>/g, '');

    return html;
  }

  // --- 表格渲染 ---
  function renderTables(html) {
    const lines = html.split('\n');
    const result = [];
    let i = 0;

    while (i < lines.length) {
      // 检测表格：至少连续3行含 |，且第2行是分隔行 |---|
      if (isTableRow(lines[i]) && i + 2 < lines.length && isTableSeparator(lines[i + 1])) {
        // 解析表头
        const headerCells = parseTableRow(lines[i]);
        let tableHtml = '<div class="md-table-wrapper"><table class="md-table"><thead><tr>';
        headerCells.forEach(cell => {
          tableHtml += '<th>' + cell.trim() + '</th>';
        });
        tableHtml += '</tr></thead><tbody>';

        // 跳过分隔行
        i += 2;

        // 解析数据行
        while (i < lines.length && isTableRow(lines[i])) {
          const cells = parseTableRow(lines[i]);
          tableHtml += '<tr>';
          cells.forEach(cell => {
            tableHtml += '<td>' + cell.trim() + '</td>';
          });
          tableHtml += '</tr>';
          i++;
        }

        tableHtml += '</tbody></table></div>';
        result.push(tableHtml);
      } else {
        result.push(lines[i]);
        i++;
      }
    }

    return result.join('\n');
  }

  function isTableRow(line) {
    if (!line) return false;
    const trimmed = line.trim();
    return trimmed.includes('|') && trimmed.split('|').length >= 3;
  }

  function isTableSeparator(line) {
    if (!line) return false;
    return /^\|?[\s\-:|]+\|[\s\-:|]+\|?$/.test(line.trim());
  }

  function parseTableRow(line) {
    let trimmed = line.trim();
    // 去掉首尾的 |
    if (trimmed.startsWith('|')) trimmed = trimmed.substring(1);
    if (trimmed.endsWith('|')) trimmed = trimmed.substring(0, trimmed.length - 1);
    return trimmed.split('|');
  }

  // ========== 清除对话 ==========
  function clearChat() {
    if (State.isLoading) return;

    const messages = Elements.chatFlow.querySelectorAll('.msg');
    messages.forEach((msg, i) => {
      msg.style.transition = `opacity 0.3s ${i * 0.05}s, transform 0.3s ${i * 0.05}s`;
      msg.style.opacity = '0';
      msg.style.transform = 'translateY(-10px)';
    });

    setTimeout(() => {
      Elements.chatFlow.innerHTML = '';
      State.chatHistory = [];
      State.messageCount = 0;
    }, messages.length * 50 + 300);
  }

  // ========== 背景粒子 ==========
  function initParticles() {
    if (!Elements.particlesContainer) return;

    for (let i = 0; i < CONFIG.particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'bg-particle';

      const size = Math.random() * 4 + 2;
      const left = Math.random() * 100;
      const duration = Math.random() * 15 + 15;
      const delay = Math.random() * 20;

      particle.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${left}%;
        animation-duration: ${duration}s;
        animation-delay: -${delay}s;
        opacity: ${Math.random() * 0.12 + 0.03};
      `;

      const colors = [
        'var(--color-gold)',
        'var(--color-palace-red)',
        'var(--color-cloisonne-blue)'
      ];
      particle.style.background = colors[Math.floor(Math.random() * colors.length)];

      Elements.particlesContainer.appendChild(particle);
    }
  }

  // ========== 工具函数 ==========
  function scrollToBottom() {
    requestAnimationFrame(() => {
      if (Elements.chatFlow) {
        Elements.chatFlow.scrollTop = Elements.chatFlow.scrollHeight;
      }
    });
  }

  function getTimeString() {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function shakeInput() {
    const area = Elements.userInput?.closest('.input-area');
    if (!area) return;
    area.style.animation = 'none';
    area.offsetHeight;
    area.style.animation = 'shake 0.4s ease';
    setTimeout(() => { area.style.animation = ''; }, 400);
  }

  function updateSendBtnState() {
    if (!Elements.sendBtn) return;
    Elements.sendBtn.disabled = State.isLoading;
    Elements.sendBtn.style.opacity = State.isLoading ? '0.6' : '1';
    Elements.sendBtn.style.cursor = State.isLoading ? 'not-allowed' : 'pointer';
  }

  function createRipple(e) {
    const btn = e.currentTarget;
    const circle = document.createElement('span');
    const diameter = Math.max(btn.clientWidth, btn.clientHeight);
    const radius = diameter / 2;
    const rect = btn.getBoundingClientRect();

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - rect.left - radius}px`;
    circle.style.top = `${e.clientY - rect.top - radius}px`;
    circle.classList.add('ripple');

    const oldRipple = btn.querySelector('.ripple');
    if (oldRipple) oldRipple.remove();

    btn.appendChild(circle);
    setTimeout(() => circle.remove(), 600);
  }

  // shake动画备选
  const shakeStyle = document.createElement('style');
  shakeStyle.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-6px); }
      50% { transform: translateX(6px); }
      75% { transform: translateX(-4px); }
    }
  `;
  document.head.appendChild(shakeStyle);

  // ========== 启动 ==========
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // ========== 暴露API ==========
  window.AIChat = {
    send: handleSend,
    clear: clearChat,
    getHistory: () => [...State.chatHistory]
  };

})();
