/**
 * 非遗答题系统
 * 包含题库、答题逻辑、AI解析功能
 */

import Utils from './utils.js';
import { QUESTIONS } from './quiz-data.js';

const Quiz = (function () {
  'use strict';

  // ========== 题库数据 ==========
  // 数据已迁移至 quiz-data.js，通过 import { QUESTIONS } from './quiz-data.js' 引入

  // ========== 配置 ==========
  const CONFIG = {
    questionsPerRound: 10,
    scorePerQuestion: 10,
    aiApiUrl: 'http://localhost:8000/chat'
  };

  // ========== 状态管理 ==========
  const State = {
    currentDifficulty: 'easy',
    currentQuestionIndex: 0,
    questions: [],
    score: 0,
    correctCount: 0,
    wrongCount: 0,
    selectedAnswer: null,
    answered: false,
    startTime: null,
    endTime: null
  };

  // ========== DOM缓存 ==========
  const Elements = {};

  // ========== 初始化 ==========
  function init() {
    cacheElements();
    bindEvents();
    startQuiz();

    // 初始化AOS动画
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 600,
        once: true
      });
    }
  }

  function cacheElements() {
    Elements.quizCard = document.getElementById('quizCard');
    Elements.quizResult = document.getElementById('quizResult');
    Elements.currentQuestion = document.getElementById('currentQuestion');
    Elements.totalQuestions = document.getElementById('totalQuestions');
    Elements.progressBar = document.getElementById('progressBar');
    Elements.currentScore = document.getElementById('currentScore');
    Elements.questionNum = document.getElementById('questionNum');
    Elements.questionCategory = document.getElementById('questionCategory');
    Elements.questionText = document.getElementById('questionText');
    Elements.optionsList = document.getElementById('optionsList');
    Elements.resultFeedback = document.getElementById('resultFeedback');
    Elements.feedbackTitle = document.getElementById('feedbackTitle');
    Elements.feedbackText = document.getElementById('feedbackText');
    Elements.aiAnalysis = document.getElementById('aiAnalysis');
    Elements.aiAnalysisContent = document.getElementById('aiAnalysisContent');
    Elements.actionHint = document.getElementById('actionHint');
    Elements.nextBtn = document.getElementById('nextBtn');
    Elements.nextBtnText = document.getElementById('nextBtnText');
    Elements.finalScore = document.getElementById('finalScore');
    Elements.resultDesc = document.getElementById('resultDesc');
    Elements.correctCount = document.getElementById('correctCount');
    Elements.wrongCount = document.getElementById('wrongCount');
    Elements.totalTime = document.getElementById('totalTime');
    Elements.restartBtn = document.getElementById('restartBtn');
    Elements.difficultyBtns = document.querySelectorAll('.difficulty-btn');
  }

  function bindEvents() {
    // 难度选择
    Elements.difficultyBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        Elements.difficultyBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        State.currentDifficulty = btn.dataset.difficulty;
        startQuiz();
      });
    });

    // 下一题按钮
    Elements.nextBtn.addEventListener('click', nextQuestion);

    // 重新开始
    Elements.restartBtn.addEventListener('click', () => {
      startQuiz();
    });

    // 键盘快捷键
    document.addEventListener('keydown', handleKeyboard);
  }

  function handleKeyboard(e) {
    if (State.answered && e.key === 'Enter') {
      nextQuestion();
    }

    // 数字键选择答案
    if (!State.answered && ['1', '2', '3', '4'].includes(e.key)) {
      const index = parseInt(e.key) - 1;
      selectAnswer(index);
    }
  }

  // ========== 答题逻辑 ==========
  function startQuiz() {
    // 重置状态
    State.currentQuestionIndex = 0;
    State.score = 0;
    State.correctCount = 0;
    State.wrongCount = 0;
    State.selectedAnswer = null;
    State.answered = false;
    State.startTime = Date.now();
    State.endTime = null;

    // 随机选择题目
    const allQuestions = QUESTIONS[State.currentDifficulty];
    State.questions = shuffleArray([...allQuestions]).slice(0, CONFIG.questionsPerRound);

    // 更新UI
    Elements.totalQuestions.textContent = State.questions.length;
    Elements.currentScore.textContent = '0';
    Elements.quizCard.style.display = 'block';
    Elements.quizResult.classList.remove('show');

    // 显示第一题
    showQuestion();
  }

  function showQuestion() {
    const question = State.questions[State.currentQuestionIndex];
    if (!question) return;

    // 重置状态
    State.selectedAnswer = null;
    State.answered = false;

    // 更新进度
    const progress = ((State.currentQuestionIndex + 1) / State.questions.length) * 100;
    Elements.currentQuestion.textContent = State.currentQuestionIndex + 1;
    Elements.progressBar.style.width = `${progress}%`;

    // 更新题目
    Elements.questionNum.textContent = State.currentQuestionIndex + 1;
    Elements.questionCategory.textContent = question.category;
    Elements.questionText.textContent = question.question;

    // 生成选项
    renderOptions(question.options);

    // 隐藏反馈
    Elements.resultFeedback.classList.remove('show', 'correct', 'wrong');
    Elements.aiAnalysis.style.display = 'none';

    // 更新按钮状态
    Elements.nextBtn.disabled = true;
    Elements.actionHint.textContent = '请选择一个答案';

    // 更新按钮文字
    if (State.currentQuestionIndex === State.questions.length - 1) {
      Elements.nextBtnText.textContent = '查看结果';
    } else {
      Elements.nextBtnText.textContent = '下一题';
    }
  }

  function renderOptions(options) {
    const letters = ['A', 'B', 'C', 'D'];
    Elements.optionsList.innerHTML = options.map((option, index) => `
      <div class="option-item" data-index="${index}" onclick="Quiz.selectAnswer(${index})">
        <span class="option-letter">${letters[index]}</span>
        <span class="option-text">${option.substring(3)}</span>
        <svg class="option-icon" viewBox="0 0 24 24" fill="none">
          <path class="check-icon" d="M5 12L10 17L19 8" stroke="#52C41A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path class="cross-icon" d="M6 6L18 18M18 6L6 18" stroke="#FF4D4F" stroke-width="2" stroke-linecap="round" style="display: none;"/>
        </svg>
      </div>
    `).join('');
  }

  function selectAnswer(index) {
    if (State.answered) return;

    State.selectedAnswer = index;
    State.answered = true;

    const question = State.questions[State.currentQuestionIndex];
    const isCorrect = index === question.answer;

    // 更新选项样式
    const optionItems = Elements.optionsList.querySelectorAll('.option-item');
    optionItems.forEach((item, i) => {
      item.classList.add('disabled');
      if (i === index) {
        item.classList.add('selected');
        item.classList.add(isCorrect ? 'correct' : 'wrong');
        // 显示对应图标
        const checkIcon = item.querySelector('.check-icon');
        const crossIcon = item.querySelector('.cross-icon');
        if (isCorrect) {
          checkIcon.style.display = 'block';
          crossIcon.style.display = 'none';
        } else {
          checkIcon.style.display = 'none';
          crossIcon.style.display = 'block';
        }
      }
      if (i === question.answer && !isCorrect) {
        item.classList.add('correct');
        item.querySelector('.check-icon').style.display = 'block';
      }
    });

    // 更新分数
    if (isCorrect) {
      State.score += CONFIG.scorePerQuestion;
      State.correctCount++;
      Elements.currentScore.textContent = State.score;
    } else {
      State.wrongCount++;
    }

    // 显示反馈
    showFeedback(isCorrect, question);

    // 启用下一题按钮
    Elements.nextBtn.disabled = false;
    Elements.actionHint.textContent = '按 Enter 或点击按钮继续';
  }

  function showFeedback(isCorrect, question) {
    const letters = ['A', 'B', 'C', 'D'];

    Elements.resultFeedback.classList.remove('correct', 'wrong');
    Elements.resultFeedback.classList.add('show', isCorrect ? 'correct' : 'wrong');

    // 更新图标显示
    const correctIcon = Elements.resultFeedback.querySelector('.correct-icon');
    const wrongIcon = Elements.resultFeedback.querySelector('.wrong-icon');
    correctIcon.style.display = isCorrect ? 'block' : 'none';
    wrongIcon.style.display = isCorrect ? 'none' : 'block';

    // 更新标题和文字
    Elements.feedbackTitle.textContent = isCorrect ? '回答正确！' : '回答错误';
    Elements.feedbackText.textContent = `正确答案是 ${letters[question.answer]}。${question.explanation}`;

    // 如果答错，请求AI解析
    if (!isCorrect) {
      requestAIAnalysis(question);
    }
  }

  async function requestAIAnalysis(question) {
    Elements.aiAnalysis.style.display = 'block';
    Elements.aiAnalysisContent.innerHTML = `
      <div class="ai-loading">
        <span>正在生成解析</span>
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
      </div>
    `;

    const prompt = `请详细解析这道非遗知识题目：

题目：${question.question}
选项：${question.options.join('、')}
正确答案：${question.options[question.answer]}

请从以下几个方面进行解析：
1. 为什么这个答案是正确的
2. 相关的非遗知识背景
3. 帮助记忆的小技巧

请用简洁易懂的语言回答，控制在200字以内。`;

    try {
      const response = await fetch(CONFIG.aiApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt, history: [] })
      });

      if (!response.ok) {
        throw new Error('AI服务暂时不可用');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullReply = '';

      Elements.aiAnalysisContent.textContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        fullReply += decoder.decode(value, { stream: true });
        Elements.aiAnalysisContent.textContent = fullReply;
      }

    } catch (error) {
      console.error('AI解析请求失败:', error);
      Elements.aiAnalysisContent.innerHTML = `
        <p style="color: var(--color-ink-gray-light);">
          AI解析服务暂时不可用，请参考上方的标准答案解释。
        </p>
        <p style="margin-top: var(--spacing-2); font-size: var(--text-xs); color: var(--color-ink-gray-light);">
          提示：确保本地AI服务已启动（端口8000）
        </p>
      `;
    }
  }

  function nextQuestion() {
    State.currentQuestionIndex++;

    if (State.currentQuestionIndex >= State.questions.length) {
      showResult();
    } else {
      showQuestion();
    }
  }

  function showResult() {
    State.endTime = Date.now();
    const totalSeconds = Math.floor((State.endTime - State.startTime) / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    // 隐藏答题卡片，显示结果
    Elements.quizCard.style.display = 'none';
    Elements.quizResult.classList.add('show');

    // 更新结果数据
    Elements.finalScore.textContent = State.score;
    Elements.correctCount.textContent = State.correctCount;
    Elements.wrongCount.textContent = State.wrongCount;
    Elements.totalTime.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;

    // 根据分数给出评价
    let desc = '';
    if (State.score >= 90) {
      desc = '您的非遗知识水平：大师级';
    } else if (State.score >= 70) {
      desc = '您的非遗知识水平：优秀';
    } else if (State.score >= 50) {
      desc = '您的非遗知识水平：良好';
    } else {
      desc = '继续加油，多了解非遗知识！';
    }
    Elements.resultDesc.textContent = desc;
  }

  // ========== 工具函数 ==========
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // ========== 初始化 ==========
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // ========== 暴露API ==========
  window.Quiz = {
    selectAnswer,
    nextQuestion,
    startQuiz,
    getState: () => ({ ...State })
  };

})();
