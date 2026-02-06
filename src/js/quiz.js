/**
 * 非遗答题系统
 * 包含题库、答题逻辑、AI解析功能
 */

import Utils from './utils.js';

(function () {
  'use strict';

  // ========== 题库数据 ==========
  const QUESTIONS = {
    easy: [
      {
        id: 1,
        category: '花丝镶嵌',
        question: '花丝镶嵌工艺中，"花丝"主要采用的材料是什么？',
        options: ['A. 金、银等贵金属', 'B. 铜、铁等普通金属', 'C. 玉石', 'D. 木材'],
        answer: 0,
        explanation: '花丝镶嵌主要采用金、银等贵金属为原料，通过拉丝、编织等工艺制作而成。'
      },
      {
        id: 2,
        category: '景泰蓝',
        question: '景泰蓝工艺起源于哪个朝代？',
        options: ['A. 唐朝', 'B. 宋朝', 'C. 元朝', 'D. 清朝'],
        answer: 2,
        explanation: '景泰蓝工艺起源于元朝，在明朝景泰年间达到鼎盛，因此得名"景泰蓝"。'
      },
      {
        id: 3,
        category: '传统工艺',
        question: '以下哪项不属于中国传统"四大名绣"？',
        options: ['A. 苏绣', 'B. 湘绣', 'C. 蜀绣', 'D. 京绣'],
        answer: 3,
        explanation: '中国四大名绣是苏绣、湘绣、蜀绣和粤绣。京绣虽然也是著名的刺绣工艺，但不在四大名绣之列。'
      },
      {
        id: 4,
        category: '花丝镶嵌',
        question: '花丝镶嵌中的"镶嵌"主要指什么工艺？',
        options: ['A. 将金属丝编织成图案', 'B. 将宝石嵌入金属底座', 'C. 在金属上刻画纹样', 'D. 给金属上色'],
        answer: 1,
        explanation: '"镶嵌"是指将珍珠、宝石、玉石等镶嵌在金属底座上的工艺，与"花丝"工艺相结合，形成完整的花丝镶嵌技艺。'
      },
      {
        id: 5,
        category: '景泰蓝',
        question: '景泰蓝的主要制作工序不包括以下哪项？',
        options: ['A. 掐丝', 'B. 点蓝', 'C. 烧蓝', 'D. 拉丝'],
        answer: 3,
        explanation: '景泰蓝的主要工序包括：制胎、掐丝、点蓝、烧蓝、磨光、镀金等。拉丝是花丝镶嵌的工艺。'
      },
      {
        id: 6,
        category: '非遗知识',
        question: '中国非物质文化遗产的标志图案是什么形状？',
        options: ['A. 圆形', 'B. 方形', 'C. 太极图形', 'D. 回纹形'],
        answer: 0,
        explanation: '中国非物质文化遗产标志为圆形图案，外圈为中国传统的"回"纹图案，内部为"文"字的变形。'
      },
      {
        id: 7,
        category: '传统工艺',
        question: '廊坊市大厂回族自治县以哪种非遗工艺最为著名？',
        options: ['A. 景泰蓝', 'B. 花丝镶嵌', 'C. 剪纸', 'D. 泥塑'],
        answer: 1,
        explanation: '大厂回族自治县是中国著名的花丝镶嵌之乡，花丝镶嵌工艺在此传承已有数百年历史。'
      },
      {
        id: 8,
        category: '花丝镶嵌',
        question: '花丝镶嵌作品中常见的"累丝"工艺是指什么？',
        options: ['A. 将金属丝堆叠成立体造型', 'B. 将金属丝拉成细丝', 'C. 在金属上刻画纹样', 'D. 给金属丝上色'],
        answer: 0,
        explanation: '"累丝"是将金属细丝层层堆叠、焊接，形成立体的造型和纹饰，是花丝镶嵌的重要技法之一。'
      },
      {
        id: 9,
        category: '景泰蓝',
        question: '景泰蓝中的"蓝"主要指什么？',
        options: ['A. 蓝色的金属', 'B. 蓝色的珐琅釉料', 'C. 蓝色的宝石', 'D. 蓝色的颜料'],
        answer: 1,
        explanation: '景泰蓝中的"蓝"指的是蓝色的珐琅釉料，因明朝景泰年间以蓝色釉料最为出色而得名。'
      },
      {
        id: 10,
        category: '非遗知识',
        question: '联合国教科文组织将非物质文化遗产分为几大类？',
        options: ['A. 3类', 'B. 5类', 'C. 7类', 'D. 10类'],
        answer: 1,
        explanation: '联合国教科文组织将非物质文化遗产分为5大类：口头传统、表演艺术、社会实践、传统手工艺、有关自然界的知识和实践。'
      }
    ],
    medium: [
      {
        id: 11,
        category: '花丝镶嵌',
        question: '花丝镶嵌工艺中，金丝最细可以拉到多细？',
        options: ['A. 0.5毫米', 'B. 0.16毫米', 'C. 1毫米', 'D. 2毫米'],
        answer: 1,
        explanation: '花丝镶嵌中的金丝经过多次拉制，最细可达0.16毫米，比头发丝还细，展现了极高的工艺水平。'
      },
      {
        id: 12,
        category: '景泰蓝',
        question: '景泰蓝制作中"点蓝"工序需要重复多少次？',
        options: ['A. 1-2次', 'B. 3-4次', 'C. 5-6次', 'D. 7-8次'],
        answer: 1,
        explanation: '点蓝工序一般需要重复3-4次，因为珐琅釉料烧制后会收缩，需要多次填充才能达到理想效果。'
      },
      {
        id: 13,
        category: '传统工艺',
        question: '以下哪位是花丝镶嵌国家级非遗传承人？',
        options: ['A. 白静宜', 'B. 张同禄', 'C. 王芝文', 'D. 杨惠姗'],
        answer: 0,
        explanation: '白静宜是花丝镶嵌国家级非物质文化遗产代表性传承人，从事花丝镶嵌工艺数十年。'
      },
      {
        id: 14,
        category: '花丝镶嵌',
        question: '花丝镶嵌的"八大工艺"不包括以下哪项？',
        options: ['A. 掐、填、攒、焊', 'B. 堆、垒、织、编', 'C. 点、烧、磨、镀', 'D. 以上都包括'],
        answer: 2,
        explanation: '花丝镶嵌的八大工艺是：掐、填、攒、焊、堆、垒、织、编。点、烧、磨、镀是景泰蓝的工艺。'
      },
      {
        id: 15,
        category: '景泰蓝',
        question: '景泰蓝烧制的温度大约是多少度？',
        options: ['A. 500-600℃', 'B. 700-800℃', 'C. 900-1000℃', 'D. 1100-1200℃'],
        answer: 1,
        explanation: '景泰蓝烧制温度约为700-800℃，这个温度能使珐琅釉料熔化并与铜胎紧密结合。'
      },
      {
        id: 16,
        category: '非遗知识',
        question: '中国非物质文化遗产法是哪一年正式实施的？',
        options: ['A. 2005年', 'B. 2008年', 'C. 2011年', 'D. 2015年'],
        answer: 2,
        explanation: '《中华人民共和国非物质文化遗产法》于2011年6月1日起正式实施，为非遗保护提供了法律保障。'
      },
      {
        id: 17,
        category: '花丝镶嵌',
        question: '花丝镶嵌作品"金瓯永固杯"是哪个朝代的作品？',
        options: ['A. 明朝', 'B. 清朝', 'C. 民国', 'D. 现代'],
        answer: 1,
        explanation: '"金瓯永固杯"是清代乾隆年间的花丝镶嵌代表作，现藏于故宫博物院，是国宝级文物。'
      },
      {
        id: 18,
        category: '景泰蓝',
        question: '景泰蓝又被称为什么？',
        options: ['A. 金丝珐琅', 'B. 铜胎掐丝珐琅', 'C. 银丝珐琅', 'D. 玉胎珐琅'],
        answer: 1,
        explanation: '景泰蓝的正式名称是"铜胎掐丝珐琅"，因明朝景泰年间最为兴盛且多用蓝色釉料而俗称"景泰蓝"。'
      },
      {
        id: 19,
        category: '传统工艺',
        question: '以下哪项工艺被列入联合国人类非物质文化遗产代表作名录？',
        options: ['A. 花丝镶嵌', 'B. 景泰蓝', 'C. 中国剪纸', 'D. 以上都是'],
        answer: 2,
        explanation: '中国剪纸于2009年被列入联合国人类非物质文化遗产代表作名录。花丝镶嵌和景泰蓝是国家级非遗项目。'
      },
      {
        id: 20,
        category: '花丝镶嵌',
        question: '花丝镶嵌中"攒"的工艺是指什么？',
        options: ['A. 将零件组装成整体', 'B. 将金属丝拉细', 'C. 在金属上刻画', 'D. 给作品上色'],
        answer: 0,
        explanation: '"攒"是将制作好的各个零件按照设计图纸组装成完整作品的工艺，是花丝镶嵌的关键步骤。'
      }
    ],
    hard: [
      {
        id: 21,
        category: '花丝镶嵌',
        question: '花丝镶嵌中使用的焊药主要成分是什么？',
        options: ['A. 银粉和硼砂', 'B. 铜粉和松香', 'C. 金粉和明矾', 'D. 锡粉和氯化锌'],
        answer: 0,
        explanation: '花丝镶嵌使用的焊药主要由银粉和硼砂组成，硼砂起助焊作用，银粉熔点较低便于焊接。'
      },
      {
        id: 22,
        category: '景泰蓝',
        question: '景泰蓝珐琅釉料的主要成分是什么？',
        options: ['A. 石英、长石、硼砂', 'B. 氧化铅、氧化硅、金属氧化物', 'C. �iteiteite', 'D. 石灰、黏土、沙子'],
        answer: 1,
        explanation: '景泰蓝珐琅釉料主要由氧化铅、氧化硅和各种金属氧化物组成，不同金属氧化物产生不同颜色。'
      },
      {
        id: 23,
        category: '传统工艺',
        question: '花丝镶嵌的"錾刻"工艺中，常用的錾子有多少种？',
        options: ['A. 10-20种', 'B. 30-50种', 'C. 100种以上', 'D. 200种以上'],
        answer: 2,
        explanation: '錾刻工艺中使用的錾子种类繁多，根据不同的纹饰需求，常用的錾子有100种以上。'
      },
      {
        id: 24,
        category: '花丝镶嵌',
        question: '明代花丝镶嵌的代表作"万历皇帝金丝翼善冠"重量约为多少？',
        options: ['A. 500克', 'B. 826克', 'C. 1200克', 'D. 1500克'],
        answer: 1,
        explanation: '万历皇帝金丝翼善冠重约826克，由极细的金丝编织而成，是明代花丝镶嵌的巅峰之作。'
      },
      {
        id: 25,
        category: '景泰蓝',
        question: '景泰蓝"掐丝"工艺中，铜丝的标准厚度是多少？',
        options: ['A. 0.1-0.2毫米', 'B. 0.3-0.5毫米', 'C. 0.6-0.8毫米', 'D. 1-1.2毫米'],
        answer: 1,
        explanation: '景泰蓝掐丝用的铜丝标准厚度为0.3-0.5毫米，太细容易断裂，太粗则影响美观。'
      },
      {
        id: 26,
        category: '非遗知识',
        question: '截至2023年，中国共有多少项人类非物质文化遗产代表作？',
        options: ['A. 32项', 'B. 43项', 'C. 55项', 'D. 62项'],
        answer: 1,
        explanation: '截至2023年，中国共有43项人类非物质文化遗产代表作，数量位居世界第一。'
      },
      {
        id: 27,
        category: '花丝镶嵌',
        question: '花丝镶嵌中"堆丝"与"累丝"的主要区别是什么？',
        options: ['A. 使用材料不同', 'B. 堆丝是平面的，累丝是立体的', 'C. 堆丝用焊接，累丝用粘接', 'D. 没有区别'],
        answer: 1,
        explanation: '堆丝是将金属丝在平面上堆叠形成图案，累丝则是将金属丝层层堆叠形成立体造型。'
      },
      {
        id: 28,
        category: '景泰蓝',
        question: '景泰蓝制作中"磨光"工序使用的材料依次是什么？',
        options: ['A. 砂纸、抛光膏', 'B. 金刚砂、黄石、木炭', 'C. 磨石、细沙、布', 'D. 砂轮、羊毛轮'],
        answer: 1,
        explanation: '景泰蓝磨光工序依次使用金刚砂石（粗磨）、黄石（细磨）、木炭（精磨），最后用布抛光。'
      },
      {
        id: 29,
        category: '传统工艺',
        question: '花丝镶嵌在清代宫廷中由哪个机构负责制作？',
        options: ['A. 内务府造办处', 'B. 工部', 'C. 户部', 'D. 礼部'],
        answer: 0,
        explanation: '清代宫廷花丝镶嵌由内务府造办处负责制作，造办处下设金玉作等专门作坊。'
      },
      {
        id: 30,
        category: '花丝镶嵌',
        question: '花丝镶嵌中"炸珠"工艺制作的金珠直径最小可达多少？',
        options: ['A. 0.5毫米', 'B. 0.3毫米', 'C. 0.1毫米', 'D. 0.05毫米'],
        answer: 2,
        explanation: '"炸珠"是将金属丝切成小段后熔化成小珠，最小可达0.1毫米，用于装饰花丝作品。'
      }
    ]
  };

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
