/**
 * craft-detail.js
 * 
 * 深度优化后的工艺详情页脚本逻辑
 * 1. 集成 AOS 动画初始化
 * 2. 导航栏滚动效果及移动端菜单
 * 3. 搜索模态框逻辑
 * 4. 返回顶部功能
 * 5. 视差效果优化
 */

import Utils from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
    // ========== 状态管理 ==========
    const State = {
        isMenuOpen: false,
        isSearchOpen: false,
        scrollPosition: 0,
        currentCraft: 'filigree' // 默认值
    };

    // ========== 工艺数据 ==========
    const CRAFT_DATA = {
        'filigree': {
            title: '花丝镶嵌',
            subtitle: 'THE ART OF FILIGREE AND INLAY',
            pinyin: 'HUĀ SĪ XIANG QIÀN',
            label: '国家级非物质文化遗产',
            tags: ['传世工艺 宫廷绝艺', '非遗文化 匠心传承', '细金工艺 极致繁复'],
            intro: '花丝镶嵌，又称“细金工艺”，是一门传承千年的宫廷绝艺。它将金、银、铜等抽成细丝，通过掐、填、攒、焊、编、织等技法，钩勒出精妙绝伦的图案，再镶嵌以璀璨夺目的珠宝。每一件作品都是时光与匠心的结晶，展现了中国古代金工技艺的巅峰水平。',
            steps: [
                {
                    name: '掐丝',
                    desc: '将细如发丝的金银丝，用镊子掐成各种纹样，是花丝工艺中最精妙的技法，要求匠人有着超凡的耐心与精准度。',
                    icon: 'qiasi'
                },
                {
                    name: '填丝',
                    desc: '在掐制好的轮廓内填入细密的丝线，形成丰富的肌理效果，如同在金属上"编织"出璀璨图案。',
                    icon: 'tiansi'
                },
                {
                    name: '焊接',
                    desc: '使用秘制焊药，在特制炭火上将金银丝纹样焊接固定，火候掌控全凭匠人数十年经验，丝毫差错便前功尽弃。',
                    icon: 'hanjie'
                },
                {
                    name: '镶嵌',
                    desc: '将宝石、珍珠、翡翠等珍贵材料镶嵌于花丝底座之上，需精确计算每粒宝石的角度与受力，方能使光芒交相辉映。',
                    icon: 'xiangqian'
                }
            ]
            // 其他数据可按需添加
        },
        'cloisonne': {
            title: '景泰蓝',
            subtitle: 'THE ART OF CLOISONNÉ ENAMEL',
            pinyin: 'JǏNG TÀI LÁN',
            label: '国家级非物质文化遗产',
            tags: ['六百年历史 宫廷御用珍品', '燕京八绝之首', '铜胎掐丝点蓝釉，炉火淬炼见真功'],
            intro: '景泰蓝，正名“铜胎掐丝珐琅”，因其在明代景泰年间达到巅峰且釉色多为蓝色而得名。它结合了青铜工艺、珐琅工艺、绘画与雕刻技艺于一体。制作过程极其繁复，需经过制胎、掐丝、点蓝、烧蓝、磨光、镀金等六道核心工序，是皇权与艺术的完美融合。',
            steps: [
                {
                    name: '制胎',
                    desc: '以红铜为原材料，经过锤打、裁剪、焊接，制成各种造型的器皿底胎，是景泰蓝制作的第一道工序。',
                    icon: 'zhitai'
                },
                {
                    name: '掐丝',
                    desc: '用扁铜丝掐成各种精美的花纹，粘在铜胎上。这是景泰蓝最核心的工艺，决定了器物的神韵。',
                    icon: 'qiasi-c'
                },
                {
                    name: '点蓝',
                    desc: '将五颜六色的珐琅釉料填入掐好的丝缝中。颜色深浅搭配、过渡自然，全靠匠人的艺术造诣。',
                    icon: 'dianlan'
                },
                {
                    name: '烧蓝',
                    desc: '将填好釉料的器物放入炉中，经过800度高温烧制，使釉料熔化并与铜胎紧密结合。',
                    icon: 'shaolan'
                },
                {
                    name: '磨光',
                    desc: '用粗砂石、细砂石和炭依次打磨，直到器物表面平整光滑，掐出的丝线显露出闪亮的铜色。',
                    icon: 'moguang'
                },
                {
                    name: '镀金',
                    desc: '在器物表面镀上一层黄金，既能防止铜丝氧化，又能增加器物的华贵感，使其金碧辉煌。',
                    icon: 'dujin'
                }
            ]
        },
        'embroidery': {
            title: '京绣',
            subtitle: 'THE ART OF BEIJING EMBROIDERY',
            pinyin: 'JĪNG XIÙ',
            label: '国家级非物质文化遗产',
            tags: ['燕京八绝之一', '宫廷绣艺 尊贵典雅', '平金夹绣，光彩夺目'],
            intro: '京绣，又名“宫绣”，是以北京为中心的传统刺绣工艺。京绣题材多为吉祥图案，构图严谨，色彩瑰丽，绣工精巧。其最鲜明的特征是“平金夹绣”，即以金银线勾勒轮廓，内填彩线，使图案具有极强的立体感和装饰性。',
            steps: [
                {
                    name: '定稿',
                    desc: '根据绣品的用途和规格，绘制精美的底稿，图案多以龙凤、祥云、花鸟等吉祥题材为主。',
                    icon: 'qiasi' // 复用或后续替换
                },
                {
                    name: '配线',
                    desc: '精选各色丝线、金线、银线，根据底稿的色彩要求进行搭配，这是决定绣品视觉效果的关键。',
                    icon: 'tiansi'
                },
                {
                    name: '平绣',
                    desc: '使用平绣、散错针等技法，将图案色彩填满，要求绣面平整，针迹细密。',
                    icon: 'hanjie'
                },
                {
                    name: '平金',
                    desc: '用金银线沿着图案轮廓进行盘绕固定，使绣品产生金碧辉煌、富丽堂皇的效果。',
                    icon: 'xiangqian'
                }
            ]
        },
        'lacquer': {
            title: '雕漆',
            subtitle: 'THE ART OF CARVED LACQUER',
            pinyin: 'DIĀO QĪ',
            label: '国家级非物质文化遗产',
            tags: ['剔红之美 沉稳大气', '百层髹漆，万次雕琢', '东方工艺的极致耐心'],
            intro: '雕漆是在堆起的平面漆胎上剔刻花纹的技法，以剔红最为著名。其工序繁琐，首先要在胎骨上髹漆数十层甚至上百层，待漆达到一定厚度时，再根据设计方案刻出浮雕花纹。每一件雕漆作品都是时间与匠心的完美契合。',
            steps: [
                {
                    name: '制胎',
                    desc: '通常以铜、木、锡等材料制成器物底胎，要求造型稳固，表面平整。',
                    icon: 'zhitai'
                },
                {
                    name: '髹漆',
                    desc: '在胎体上逐层刷漆，每刷一层需晾干后再刷下一层，通常需刷百余层方可雕刻。',
                    icon: 'tiansi'
                },
                {
                    name: '刻样',
                    desc: '在漆层达到足够厚度后，将设计好的纹样贴在漆面上，为雕刻做准备。',
                    icon: 'qiasi-c'
                },
                {
                    name: '雕刻',
                    desc: '匠人运刀如笔，在厚重的漆层上剔刻出深浅不一、错落有致的图案，极考验功力。',
                    icon: 'hanjie'
                }
            ]
        }
    };

    // ========== DOM 元素缓存 ==========
    const Elements = {
        loader: document.getElementById('pageLoader'),
        navbar: document.getElementById('navbar'),
        mobileMenuToggle: document.getElementById('mobileMenuToggle'),
        mobileSidebar: document.getElementById('mobileSidebar'),
        searchBtn: document.getElementById('searchBtn'),
        searchModal: document.getElementById('searchModal'),
        backToTop: document.getElementById('backToTop')
    };

    /**
     * 根据 URL 参数加载工艺数据
     */
    const loadCraftData = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const craft = urlParams.get('craft');

        if (craft && CRAFT_DATA[craft]) {
            State.currentCraft = craft;
            const data = CRAFT_DATA[craft];

            // 更新标题和基本信息
            document.title = `${data.title}制作工艺 - 千年技艺`;
            const header = document.querySelector('.header');
            if (header) {
                const titleEl = header.querySelector('.main-title');
                const subtitleEl = header.querySelector('.subtitle');
                const pinyinEl = header.querySelector('.pinyin');
                const tagsEl = header.querySelector('.feature-tags');
                const labelEl = header.querySelector('.national-label');

                if (titleEl) titleEl.textContent = data.title;
                if (subtitleEl) subtitleEl.textContent = data.subtitle;
                if (pinyinEl) pinyinEl.textContent = data.pinyin;
                if (labelEl) labelEl.textContent = data.label;

                // 更新标签与介绍
                const introEl = header.querySelector('.intro-text');
                if (introEl && data.intro) introEl.textContent = data.intro;

                if (tagsEl && data.tags) {
                    tagsEl.innerHTML = data.tags.map(tag => `
                        <span class="feature-tag"><i>✦</i> ${tag}</span>
                    `).join('');
                }
            }

            // 更新工艺流程 (匠艺精粹)
            const toolsGrid = document.querySelector('.tools-grid');
            if (toolsGrid && data.steps) {
                toolsGrid.innerHTML = data.steps.map((step, index) => `
                    <div class="tool-card" data-aos="fade-up" data-aos-delay="${(index + 1) * 100}">
                        <div class="tool-icon">
                            ${getIconSvg(step.icon)}
                        </div>
                        <h3 class="tool-name">${step.name}</h3>
                        <p class="tool-description">${step.desc}</p>
                    </div>
                `).join('');
            }

            // 如果是景泰蓝，更新特定部分（珍材宝料、典藏华章、千年传承）
            if (craft === 'cloisonne') {
                updateCloisonneSpecifics();
            } else if (craft === 'embroidery') {
                updateEmbroiderySpecifics();
            } else if (craft === 'lacquer') {
                updateLacquerSpecifics();
            }
        }
    };

    /**
     * 获取图标 SVG
     */
    const getIconSvg = (iconName) => {
        const icons = {
            'zhitai': `
                <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="32" cy="32" r="30" stroke="currentColor" stroke-width="1" opacity="0.3" />
                    <path d="M22 42V20C22 18 24 16 32 16C40 16 42 18 42 20V42" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity="0.4" />
                    <path d="M20 42H44L42 50H22L20 42Z" fill="var(--color-gold)" opacity="0.6" />
                    <path d="M32 24L32 38M26 31L38 31" stroke="var(--accent-red)" stroke-width="2" stroke-linecap="round" />
                    <!-- 装饰纹样 -->
                    <path d="M25 16C25 16 28 14 32 14C36 14 39 16 39 16" stroke="var(--color-gold)" stroke-width="1" opacity="0.5" />
                </svg>`,
            'qiasi-c': `
                <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="32" cy="32" r="30" stroke="currentColor" stroke-width="1" opacity="0.3" />
                    <!-- 掐丝卷草纹 -->
                    <path d="M20 32C20 25 25 20 32 20C39 20 44 25 44 32" stroke="var(--color-gold)" stroke-width="1" opacity="0.2" />
                    <path d="M24 32C24 28 28 26 32 30C36 34 40 32 40 28" stroke="var(--accent-red)" stroke-width="2" stroke-linecap="round" />
                    <path d="M24 38C24 34 28 32 32 36C36 40 40 38 40 34" stroke="var(--accent-red)" stroke-width="2" stroke-linecap="round" />
                    <path d="M28 24C28 24 30 22 32 22C34 22 36 24 36 24" stroke="var(--color-gold)" stroke-width="1" />
                </svg>`,
            'dianlan': `
                <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="32" cy="32" r="30" stroke="currentColor" stroke-width="1" opacity="0.3" />
                    <path d="M20 20L44 44M44 20L20 44" stroke="currentColor" stroke-width="0.5" opacity="0.1" />
                    <!-- 点蓝釉料罐 -->
                    <path d="M28 45H36V50H28V45Z" fill="var(--color-gold)" opacity="0.4" />
                    <circle cx="22" cy="25" r="6" fill="#003399" /> <!-- 宝蓝 -->
                    <circle cx="42" cy="25" r="6" fill="#0099CC" /> <!-- 天蓝 -->
                    <circle cx="32" cy="40" r="7" fill="#CC0033" /> <!-- 胭脂红 -->
                    <path d="M32 15L32 25" stroke="var(--color-gold)" stroke-width="2" stroke-linecap="round" />
                </svg>`,
            'shaolan': `
                <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="32" cy="32" r="30" stroke="currentColor" stroke-width="1" opacity="0.3" />
                    <!-- 窑火 -->
                    <path d="M32 50C32 50 48 38 48 25C48 15 40 10 32 10C24 10 16 15 16 25C16 38 32 50 32 50Z" fill="var(--accent-red)" opacity="0.15" />
                    <path d="M32 42C32 42 42 32 42 25C42 20 38 16 32 16C26 16 22 20 22 25C22 32 32 42 32 42Z" fill="var(--accent-red)" />
                    <!-- 烧制中的器皿轮廓 -->
                    <path d="M28 25C28 25 30 22 32 22C34 22 36 25 36 25" stroke="white" stroke-width="1.5" stroke-linecap="round" opacity="0.6" />
                    <rect x="20" y="48" width="24" height="4" rx="2" fill="var(--color-gold)" />
                </svg>`,
            'moguang': `
                <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="32" cy="32" r="30" stroke="currentColor" stroke-width="1" opacity="0.3" />
                    <!-- 磨石 -->
                    <rect x="18" y="20" width="28" height="12" rx="2" fill="var(--text-secondary)" opacity="0.4" />
                    <path d="M18 26H46" stroke="currentColor" stroke-width="0.5" opacity="0.2" />
                    <!-- 打磨出的光泽 -->
                    <path d="M20 40C20 40 25 38 32 38C39 38 44 40 44 40" stroke="var(--color-gold)" stroke-width="2" stroke-linecap="round" />
                    <path d="M15 45L20 43M44 43L49 45" stroke="var(--color-gold)" stroke-width="1" opacity="0.6" />
                    <!-- 飞溅的水滴/磨屑 -->
                    <circle cx="28" cy="15" r="1" fill="var(--color-gold)" />
                    <circle cx="36" cy="17" r="1.5" fill="var(--color-gold)" opacity="0.6" />
                </svg>`,
            'dujin': `
                <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="32" cy="32" r="30" stroke="currentColor" stroke-width="1" opacity="0.3" />
                    <!-- 镀金液/光芒 -->
                    <circle cx="32" cy="32" r="15" fill="var(--color-gold)" opacity="0.1" />
                    <!-- 器物金边 -->
                    <path d="M22 45V22C22 20 24 18 32 18C40 18 42 20 42 22V45" stroke="var(--color-gold)" stroke-width="2.5" stroke-linecap="round" />
                    <path d="M20 45H44" stroke="var(--color-gold)" stroke-width="3" stroke-linecap="round" />
                    <!-- 闪烁星芒 -->
                    <path d="M32 10V14M10 32H14M32 50V54M50 32H54" stroke="var(--color-gold)" stroke-width="1.5" stroke-linecap="round" />
                    <path d="M16 16L19 19M45 45L48 48M16 48L19 45M45 19L48 16" stroke="var(--color-gold)" stroke-width="1" opacity="0.6" />
                </svg>`,
            // 保留原有的花丝图标以防回退
            'qiasi': `
                <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="32" cy="32" r="30" stroke="currentColor" stroke-width="1" opacity="0.3" />
                    <path d="M25 48L22 12C22 12 25 10 32 10C39 10 42 12 42 12L39 48" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity="0.4" />
                    <path d="M22 15C22 15 28 12 32 18C36 24 42 22 42 22M22 25C22 25 28 22 32 28C36 34 42 32 42 32" stroke="var(--accent-red)" stroke-width="2" stroke-linecap="round" />
                    <circle cx="32" cy="18" r="4" fill="var(--color-gold)" />
                    <circle cx="32" cy="28" r="3" fill="var(--color-gold)" opacity="0.6" />
                </svg>`,
            'tiansi': `
                <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="32" cy="32" r="30" stroke="currentColor" stroke-width="1" opacity="0.3" />
                    <path d="M15 25H49M15 32H49M15 39H49M25 15V49M32 15V49M39 15V49" stroke="currentColor" stroke-width="0.5" opacity="0.2" />
                    <path d="M24 32C24 28 28 26 32 30C36 34 40 32 40 28" stroke="var(--accent-red)" stroke-width="2" stroke-linecap="round" />
                    <path d="M24 32C24 36 28 38 32 34C36 30 40 32 40 36" stroke="var(--accent-red)" stroke-width="2" stroke-linecap="round" />
                    <path d="M28 28L36 36M28 36L36 28" stroke="var(--color-gold)" stroke-width="1" opacity="0.6" />
                    <circle cx="32" cy="32" r="4" fill="var(--color-gold)" />
                </svg>`,
            'hanjie': `
                <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="32" cy="32" r="30" stroke="currentColor" stroke-width="1" opacity="0.3" />
                    <path d="M32 48C32 48 44 38 44 28C44 20 38 14 32 14C26 14 20 20 20 28C20 38 32 48 32 48Z" fill="var(--accent-red)" opacity="0.1" />
                    <path d="M32 44C32 44 40 36 40 28C40 22 36 18 32 18C28 18 24 22 24 28C24 36 32 44 32 44Z" stroke="var(--accent-red)" stroke-width="1.5" stroke-linecap="round" />
                    <path d="M32 40C32 40 36 34 36 30C36 28 34 26 32 26C30 26 28 28 28 30C28 34 32 40 32 40Z" fill="var(--accent-red)" />
                    <circle cx="25" cy="22" r="1" fill="var(--color-gold)" />
                    <circle cx="39" cy="22" r="1" fill="var(--color-gold)" />
                    <rect x="18" y="46" width="28" height="4" rx="1" fill="var(--color-gold)" />
                </svg>`,
            'xiangqian': `
                <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="32" cy="32" r="30" stroke="currentColor" stroke-width="1" opacity="0.3" />
                    <path d="M32 10L44 18V34L32 42L20 34V18L32 10Z" stroke="var(--color-gold)" stroke-width="1.5" />
                    <path d="M32 16L40 26L32 36L24 26L32 16Z" fill="var(--accent-red)" />
                    <path d="M32 16V36M40 26H24" stroke="white" stroke-width="0.5" opacity="0.3" />
                    <path d="M20 18L25 22M44 18L39 22M20 34L25 30M44 34L39 30" stroke="var(--color-gold)" stroke-width="2.5" stroke-linecap="round" />
                    <circle cx="32" cy="10" r="1.5" fill="var(--color-gold)" />
                    <circle cx="32" cy="42" r="1.5" fill="var(--color-gold)" />
                </svg>`
        };
        return icons[iconName] || icons['qiasi'];
    };

    /**
     * 更新景泰蓝特有内容
     */
    const updateCloisonneSpecifics = () => {
        // 1. 更新珍材宝料
        const materialsSection = document.getElementById('materials');
        if (materialsSection) {
            const categories = materialsSection.querySelectorAll('.material-category');
            if (categories.length >= 2) {
                // 更新贵金属材料为景泰蓝相关
                categories[0].querySelector('.material-title').textContent = '基胎与结构';
                categories[0].querySelector('.material-items').innerHTML = `
                    <div class="material-item" data-aos="fade-up" data-aos-delay="100">
                        <div class="material-icon-circle">
                            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="20" cy="20" r="18" stroke="currentColor" stroke-width="0.5" opacity="0.1" />
                                <rect x="10" y="10" width="20" height="20" fill="#B87333" opacity="0.8" />
                                <path d="M10 10L30 30M30 10L10 30" stroke="var(--color-gold)" stroke-width="1" />
                            </svg>
                        </div>
                        <div class="material-info">
                            <div class="material-name">紫铜胎体</div>
                            <div class="material-desc">精选质地纯净、延展性极佳的红铜（紫铜），经过成千上万次锤打而成。</div>
                        </div>
                    </div>
                    <div class="material-item" data-aos="fade-up" data-aos-delay="200">
                        <div class="material-icon-circle">
                            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="20" cy="20" r="18" stroke="currentColor" stroke-width="0.5" opacity="0.1" />
                                <path d="M10 20C10 15 15 10 20 10C25 10 30 15 30 20" stroke="#B87333" stroke-width="2" />
                                <path d="M15 25C15 22 18 20 20 22" stroke="var(--accent-red)" stroke-width="1.5" />
                            </svg>
                        </div>
                        <div class="material-info">
                            <div class="material-name">扁铜丝</div>
                            <div class="material-desc">特制的扁平铜丝，厚度均匀，用于在胎体上勾勒繁复精致的图案线条。</div>
                        </div>
                    </div>
                    <div class="material-item" data-aos="fade-up" data-aos-delay="300">
                        <div class="material-icon-circle">
                            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="20" cy="20" r="18" stroke="currentColor" stroke-width="0.5" opacity="0.1" />
                                <path d="M12 28L28 12" stroke="var(--color-gold)" stroke-width="2" stroke-linecap="round" />
                                <path d="M15 15L25 25" stroke="var(--accent-red)" stroke-width="1.5" opacity="0.6" />
                                <circle cx="20" cy="20" r="3" fill="var(--color-gold)" />
                            </svg>
                        </div>
                        <div class="material-info">
                            <div class="material-name">古法焊药</div>
                            <div class="material-desc">配方独特的焊药，确保铜丝与胎体在高温下能够牢固结合且不留痕迹。</div>
                        </div>
                    </div>
                `;

                // 更新镶嵌宝料为釉料相关
                categories[1].querySelector('.material-title').textContent = '釉料与点缀';
                categories[1].querySelector('.material-items').innerHTML = `
                    <div class="material-item" data-aos="fade-up" data-aos-delay="100">
                        <div class="material-icon-circle">
                            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="20" cy="20" r="18" stroke="currentColor" stroke-width="0.5" opacity="0.1" />
                                <circle cx="15" cy="15" r="4" fill="#1E90FF" />
                                <circle cx="25" cy="15" r="4" fill="#9D2933" />
                                <circle cx="20" cy="25" r="4" fill="#D4AF37" />
                            </svg>
                        </div>
                        <div class="material-info">
                            <div class="material-name">天然矿物釉料</div>
                            <div class="material-desc">由长石、石英等矿物研磨而成，加入金属氧化物呈色，烧制后色泽经久不褪。</div>
                        </div>
                    </div>
                    <div class="material-item" data-aos="fade-up" data-aos-delay="200">
                        <div class="material-icon-circle">
                            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="20" cy="20" r="18" stroke="currentColor" stroke-width="0.5" opacity="0.1" />
                                <rect x="12" y="15" width="16" height="10" fill="var(--text-secondary)" opacity="0.5" />
                                <path d="M10 25H30" stroke="currentColor" stroke-width="1" />
                            </svg>
                        </div>
                        <div class="material-info">
                            <div class="material-name">精选研磨砂石</div>
                            <div class="material-desc">包括粗砂、细砂及椴木炭等，用于多道打磨工序，使器物表面平滑如镜。</div>
                        </div>
                    </div>
                    <div class="material-item" data-aos="fade-up" data-aos-delay="300">
                        <div class="material-icon-circle">
                            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="20" cy="20" r="18" stroke="currentColor" stroke-width="0.5" opacity="0.1" />
                                <path d="M10 20H30M20 10V30" stroke="var(--color-gold)" stroke-width="2" />
                                <circle cx="20" cy="20" r="5" fill="var(--color-gold)" />
                            </svg>
                        </div>
                        <div class="material-info">
                            <div class="material-name">黄金镀层</div>
                            <div class="material-desc">成品表面经过镀金处理，既增加了器物的华贵感，又能防止铜丝氧化。</div>
                        </div>
                    </div>
                `;
            }
        }

        // 2. 更新典藏华章
        const collectionGrid = document.querySelector('.artworks-grid');
        if (collectionGrid) {
            collectionGrid.innerHTML = `
                <div class="artwork-card" data-aos="fade-up" data-aos-delay="100">
                    <div class="artwork-content">
                        <h3 class="artwork-title">缠枝莲纹鼎式炉</h3>
                        <p class="artwork-description">明景泰年间的典型代表作，器形稳重，釉色纯正，掐丝线条圆润流畅，充分体现了景泰蓝巅峰时期的工艺水平。</p>
                        <div class="artwork-meta">
                            <span>明景泰</span>
                            <span>通高28.4cm</span>
                        </div>
                    </div>
                </div>
                <div class="artwork-card" data-aos="fade-up" data-aos-delay="200">
                    <div class="artwork-content">
                        <h3 class="artwork-title">出戟花觚</h3>
                        <p class="artwork-description">清乾隆时期精品，造型仿古，纹饰繁缛精美，使用了多达二十余种釉色，点蓝技艺精湛，色彩过渡自然如画。</p>
                        <div class="artwork-meta">
                            <span>清乾隆</span>
                            <span>高45.2cm</span>
                        </div>
                    </div>
                </div>
                <div class="artwork-card" data-aos="fade-up" data-aos-delay="300">
                    <div class="artwork-content">
                        <h3 class="artwork-title">铜胎掐丝珐琅聚宝盆</h3>
                        <p class="artwork-description">当代大师力作，盆身掐丝细密如发，点釉厚实圆润，经过数次反复烧制，呈现出如蓝宝石般深邃而富有层次的光泽。</p>
                        <div class="artwork-meta">
                            <span>现代工艺</span>
                            <span>宽32.5cm</span>
                        </div>
                    </div>
                </div>
            `;
        }

        // 3. 更新千年传承
        const timeline = document.querySelector('.timeline');
        if (timeline) {
            const timelineItems = timeline.querySelectorAll('.timeline-item');
            const historyData = [
                { year: '元代', title: '技艺西来', text: '掐丝珐琅工艺由阿拉伯地区传入中国，因其色彩斑斓，初称"大食窑"或"鬼国窑"。' },
                { year: '明景泰', title: '声名大噪', text: '明代景泰年间，由于皇室的大力推崇，工艺达到顶峰。因釉色以孔雀蓝为主，故名"景泰蓝"。' },
                { year: '清代', title: '宫廷极盛', text: '乾隆时期，景泰蓝制作规模宏大，不仅用于礼器，更广泛应用于宫廷家具与室内装饰。' },
                { year: '2006', title: '国粹新生', text: '景泰蓝制作技艺被列入第一批国家级非物质文化遗产名录，成为中华文化的璀璨名片。' }
            ];

            timelineItems.forEach((item, index) => {
                if (historyData[index]) {
                    item.querySelector('.timeline-year').textContent = historyData[index].year;
                    item.querySelector('.timeline-title').textContent = historyData[index].title;
                    item.querySelector('.timeline-text').textContent = historyData[index].text;
                }
            });
        }
    };

    /**
     * 更新京绣特有内容
     */
    const updateEmbroiderySpecifics = () => {
        // 1. 更新珍材宝料
        const materialsSection = document.getElementById('materials');
        if (materialsSection) {
            const categories = materialsSection.querySelectorAll('.material-category');
            if (categories.length >= 2) {
                categories[0].querySelector('.material-title').textContent = '丝线与底料';
                categories[0].querySelector('.material-items').innerHTML = `
                    <div class="material-item" data-aos="fade-up" data-aos-delay="100">
                        <div class="material-icon-circle">
                            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="20" cy="20" r="18" stroke="currentColor" stroke-width="0.5" opacity="0.1" />
                                <path d="M10 20C10 15 15 10 20 10C25 10 30 15 30 20" stroke="#FF69B4" stroke-width="2" />
                                <circle cx="20" cy="20" r="3" fill="#FF69B4" />
                            </svg>
                        </div>
                        <div class="material-info">
                            <div class="material-name">天然蚕丝线</div>
                            <div class="material-desc">精选上等蚕丝，经过手工染色，色泽润泽，经久不褪，是京绣的主要用线。</div>
                        </div>
                    </div>
                    <div class="material-item" data-aos="fade-up" data-aos-delay="200">
                        <div class="material-icon-circle">
                            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="20" cy="20" r="18" stroke="currentColor" stroke-width="0.5" opacity="0.1" />
                                <path d="M10 20L30 20M20 10L20 30" stroke="var(--color-gold)" stroke-width="2" />
                            </svg>
                        </div>
                        <div class="material-info">
                            <div class="material-name">库伦金线</div>
                            <div class="material-desc">特制的金线，由真金打成薄片后贴在纸上切成细丝，用于平金技法，极显尊贵。</div>
                        </div>
                    </div>
                `;

                categories[1].querySelector('.material-title').textContent = '绣底与装饰';
                categories[1].querySelector('.material-items').innerHTML = `
                    <div class="material-item" data-aos="fade-up" data-aos-delay="100">
                        <div class="material-info">
                            <div class="material-name">宫廷贡缎</div>
                            <div class="material-desc">质地紧密、手感滑爽的缎料，作为刺绣的底料，能完美衬托出绣品的精致。</div>
                        </div>
                    </div>
                `;
            }
        }

        // 2. 更新典藏华章
        const collectionGrid = document.querySelector('.artworks-grid');
        if (collectionGrid) {
            collectionGrid.innerHTML = `
                <div class="artwork-card" data-aos="fade-up" data-aos-delay="100">
                    <div class="artwork-content">
                        <h3 class="artwork-title">龙纹十二章袍</h3>
                        <p class="artwork-description">复原清代皇帝朝袍，采用平金夹绣技法，龙身鳞片清晰可见，金光璀璨，展现了极高的皇家工艺水准。</p>
                        <div class="artwork-meta"><span>清代风格</span></div>
                    </div>
                </div>
            `;
        }

        // 3. 更新千年传承
        const timeline = document.querySelector('.timeline');
        if (timeline) {
            const historyData = [
                { year: '辽金', title: '初步形成', text: '随着北京成为陪都，刺绣工艺开始在此聚集，吸收了多民族的艺术风格。' },
                { year: '明清', title: '进入鼎盛', text: '成为宫廷专供，设立"内务府造办处"专门管理刺绣制作，形成了尊贵典雅的京绣风格。' }
            ];
            const timelineItems = timeline.querySelectorAll('.timeline-item');
            timelineItems.forEach((item, index) => {
                if (historyData[index]) {
                    item.querySelector('.timeline-year').textContent = historyData[index].year;
                    item.querySelector('.timeline-title').textContent = historyData[index].title;
                    item.querySelector('.timeline-text').textContent = historyData[index].text;
                } else {
                    item.style.display = 'none';
                }
            });
        }
    };

    /**
     * 更新雕漆特有内容
     */
    const updateLacquerSpecifics = () => {
        // 1. 更新珍材宝料
        const materialsSection = document.getElementById('materials');
        if (materialsSection) {
            const categories = materialsSection.querySelectorAll('.material-category');
            if (categories.length >= 2) {
                categories[0].querySelector('.material-title').textContent = '生漆与胎骨';
                categories[0].querySelector('.material-items').innerHTML = `
                    <div class="material-item" data-aos="fade-up" data-aos-delay="100">
                        <div class="material-info">
                            <div class="material-name">天然大漆</div>
                            <div class="material-desc">从漆树上采集的天然生漆，经过过滤、搅拌，加入朱砂等天然矿物颜色而成。</div>
                        </div>
                    </div>
                `;
            }
        }

        // 2. 更新典藏华章
        const collectionGrid = document.querySelector('.artworks-grid');
        if (collectionGrid) {
            collectionGrid.innerHTML = `
                <div class="artwork-card" data-aos="fade-up" data-aos-delay="100">
                    <div class="artwork-content">
                        <h3 class="artwork-title">剔红花鸟纹大盘</h3>
                        <p class="artwork-description">漆层厚重，雕刻深峻，花鸟形象生动传神，是雕漆工艺中的代表作。</p>
                        <div class="artwork-meta"><span>清乾隆</span></div>
                    </div>
                </div>
            `;
        }

        // 3. 更新千年传承
        const timeline = document.querySelector('.timeline');
        if (timeline) {
            const historyData = [
                { year: '唐代', title: '技艺发端', text: '唐代已有堆漆工艺，为后世雕漆的形成奠定了技术基础。' },
                { year: '元代', title: '名家辈出', text: '张成、杨茂等大师的出现，标志着雕漆技艺达到了成熟期。' }
            ];
            const timelineItems = timeline.querySelectorAll('.timeline-item');
            timelineItems.forEach((item, index) => {
                if (historyData[index]) {
                    item.querySelector('.timeline-year').textContent = historyData[index].year;
                    item.querySelector('.timeline-title').textContent = historyData[index].title;
                    item.querySelector('.timeline-text').textContent = historyData[index].text;
                } else {
                    item.style.display = 'none';
                }
            });
        }
    };

    /**
     * 初始化页面加载
     */
    const initPageLoad = () => {
        // 加载工艺数据
        loadCraftData();

        // 隐藏加载器
        if (Elements.loader) {
            Elements.loader.classList.add('hidden');
            setTimeout(() => {
                Elements.loader.style.display = 'none';
                State.isLoading = false;
            }, 500);
        }

        // 初始化 AOS
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                easing: 'ease-out',
                once: true,
                offset: 100,
                disable: Utils.prefersReducedMotion?.() || false
            });
        }
    };

    /**
     * 初始化导航栏与菜单
     */
    const initNavigation = () => {
        // 滚动监听
        window.addEventListener('scroll', Utils.throttle(() => {
            const scrollTop = window.pageYOffset;

            // 导航栏效果
            if (scrollTop > 50) {
                Elements.navbar?.classList.add('scrolled');
            } else {
                Elements.navbar?.classList.remove('scrolled');
            }

            // 返回顶部按钮逻辑
            if (Elements.backToTop) {
                const progressCircle = Elements.backToTop.querySelector('.progress-circle');
                const circumference = 2 * Math.PI * 20; // r=20

                if (scrollTop > 300) {
                    Elements.backToTop.removeAttribute('hidden');
                    Elements.backToTop.classList.add('visible');

                    // 更新进度环
                    if (progressCircle) {
                        const scrollPercent = Utils.getScrollPercent();
                        const offset = circumference - (scrollPercent / 100) * circumference;
                        progressCircle.style.strokeDashoffset = offset;
                    }
                } else {
                    Elements.backToTop.classList.remove('visible');
                    setTimeout(() => {
                        if (!Elements.backToTop.classList.contains('visible')) {
                            Elements.backToTop.setAttribute('hidden', '');
                        }
                    }, 300);
                }
            }

            State.scrollPosition = scrollTop;
        }, 100));

        // 移动端菜单切换
        const toggleMenu = () => {
            State.isMenuOpen = !State.isMenuOpen;

            if (Elements.mobileSidebar) {
                Elements.mobileSidebar.setAttribute('aria-hidden', !State.isMenuOpen);
                Elements.mobileSidebar.classList.toggle('active', State.isMenuOpen);
            }

            if (Elements.mobileMenuToggle) {
                Elements.mobileMenuToggle.setAttribute('aria-expanded', State.isMenuOpen);
                Elements.mobileMenuToggle.classList.toggle('active', State.isMenuOpen);
            }

            document.body.classList.toggle('no-scroll', State.isMenuOpen);
        };

        Elements.mobileMenuToggle?.addEventListener('click', toggleMenu);

        // 关闭侧边栏
        const closeBtn = Elements.mobileSidebar?.querySelector('.sidebar-close');
        const overlay = Elements.mobileSidebar?.querySelector('.sidebar-overlay');

        [closeBtn, overlay].forEach(el => {
            el?.addEventListener('click', () => {
                if (State.isMenuOpen) toggleMenu();
            });
        });

        // 导航点击平滑滚动
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#' || targetId === '') return;

                const targetEl = document.querySelector(targetId);
                if (targetEl) {
                    e.preventDefault();
                    if (State.isMenuOpen) toggleMenu();

                    const navbarHeight = Elements.navbar?.offsetHeight || 80;
                    Utils.smoothScrollTo(targetEl, navbarHeight);

                    // 更新 URL
                    history.pushState(null, null, targetId);
                }
            });
        });
    };

    /**
     * 初始化搜索功能
     */
    const initSearch = () => {
        if (!Elements.searchBtn || !Elements.searchModal) return;

        const toggleSearch = (show) => {
            State.isSearchOpen = typeof show === 'boolean' ? show : !State.isSearchOpen;

            Elements.searchModal.setAttribute('aria-hidden', !State.isSearchOpen);
            Elements.searchModal.classList.toggle('active', State.isSearchOpen);
            document.body.classList.toggle('no-scroll', State.isSearchOpen);

            if (State.isSearchOpen) {
                setTimeout(() => {
                    Elements.searchModal.querySelector('.search-input')?.focus();
                }, 300);
            }
        };

        Elements.searchBtn.addEventListener('click', () => toggleSearch(true));

        const closeBtn = Elements.searchModal.querySelector('.search-close');
        closeBtn?.addEventListener('click', () => toggleSearch(false));

        // 点击背景关闭
        Elements.searchModal.addEventListener('click', (e) => {
            if (e.target === Elements.searchModal) {
                toggleSearch(false);
            }
        });

        // ESC 关闭搜索
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && State.isSearchOpen) {
                toggleSearch(false);
            }
        });

        // 搜索建议点击
        const suggestionTags = Elements.searchModal.querySelectorAll('.suggestion-tag');
        suggestionTags.forEach(tag => {
            tag.addEventListener('click', () => {
                const searchInput = Elements.searchModal.querySelector('.search-input');
                if (searchInput) {
                    searchInput.value = tag.textContent;
                    searchInput.focus();
                }
            });
        });
    };

    /**
     * 初始化视差效果
     */
    const initParallax = () => {
        let ticking = false;

        document.addEventListener('mousemove', (e) => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const x = (e.clientX / window.innerWidth - 0.5) * 20;
                    const y = (e.clientY / window.innerHeight - 0.5) * 20;

                    // 为 body 背景添加轻微移动
                    document.body.style.backgroundPosition = `calc(50% + ${x}px) calc(50% + ${y}px)`;
                    ticking = false;
                });
                ticking = true;
            }
        });
    };

    /**
     * 初始化返回顶部
     */
    const initBackToTop = () => {
        if (!Elements.backToTop) return;

        const progressCircle = Elements.backToTop.querySelector('.progress-circle');
        const circumference = 2 * Math.PI * 20; // r=20

        const updateProgress = () => {
            if (typeof Utils.getScrollPercent !== 'function') return;

            const scrollPercent = Utils.getScrollPercent();
            const offset = circumference - (scrollPercent / 100) * circumference;

            if (progressCircle) {
                progressCircle.style.strokeDashoffset = offset;
            }

            // 显示/隐藏按钮
            if (window.pageYOffset > 300) {
                Elements.backToTop.removeAttribute('hidden');
                Elements.backToTop.classList.add('visible');
            } else {
                Elements.backToTop.setAttribute('hidden', '');
                Elements.backToTop.classList.remove('visible');
            }
        };

        const throttledUpdate = typeof Utils.throttle === 'function'
            ? Utils.throttle(updateProgress, 100)
            : updateProgress;

        window.addEventListener('scroll', throttledUpdate, { passive: true });

        Elements.backToTop.addEventListener('click', () => {
            Utils.smoothScrollTo(document.body, 0, 800);
        });
    };

    /**
     * 初始化无障碍
     */
    const initKeyboardAccessibility = () => {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    };

    /**
     * 初始化语言选择
     */
    const initLanguageSelector = () => {
        const languageBtn = document.querySelector('.language-btn');
        const languageDropdown = document.querySelector('.language-dropdown');

        if (!languageBtn || !languageDropdown) return;

        // 获取存储的语言偏好并更新UI
        const savedLang = Utils.getStorage?.('preferred-language', 'zh') || 'zh';
        updateLanguageUI(savedLang);

        languageBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isExpanded = languageBtn.getAttribute('aria-expanded') === 'true';
            languageBtn.setAttribute('aria-expanded', !isExpanded);
            languageDropdown.classList.toggle('active', !isExpanded);
        });

        const languageOptions = languageDropdown.querySelectorAll('li');
        languageOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                const lang = option.dataset.lang;
                updateLanguageUI(lang);

                // 存储语言偏好
                Utils.setStorage?.('preferred-language', lang);

                // 触发语言切换事件
                document.dispatchEvent(new CustomEvent('languageChange', { detail: { lang } }));
            });
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.language-selector')) {
                languageBtn.setAttribute('aria-expanded', 'false');
                languageDropdown.classList.remove('active');
            }
        });
    };

    /**
     * 更新语言UI
     */
    const updateLanguageUI = (lang) => {
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
    };

    /**
     * 初始化全屏切换
     */
    const initFullscreen = () => {
        const fullscreenBtn = document.getElementById('fullscreenBtn');
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', () => {
                Utils.toggleFullscreen?.();
            });
        }
    };

    /**
     * 初始化卡片悬停效果
     */
    const initCardEffects = () => {
        const cards = document.querySelectorAll('.material-item, .tool-card');
        if (!cards.length || Utils.getDeviceInfo?.().isMobile) return;

        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                // 限制旋转幅度
                const rotateX = (y - centerY) / 25;
                const rotateY = (centerX - x) / 25;

                // 判断是否为 material-item (需要 translateX 效果)
                const isMaterial = card.classList.contains('material-item');
                const translateVal = isMaterial ? 'translateX(5px)' : 'translateY(-10px)';

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) ${translateVal}`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    };

    // 执行初始化
    try {
        initPageLoad();
        initNavigation();
        initSearch();
        initParallax();
        initBackToTop();
        initKeyboardAccessibility();
        initLanguageSelector();
        initCardEffects();
    } catch (err) {
        console.error('Initialization error:', err);
    }
});
