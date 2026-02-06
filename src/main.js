/**
 * 廊坊非遗数字中心 - 主入口文件
 * 负责加载全局样式与初始化核心逻辑
 */

// 1. 引入样式表 (Vite 会自动将这些 CSS 注入页面)
import './css/variables.css';
import './css/reset.css';
import './css/main.css';
import './css/components.css';
import './css/carousel.css';
import './css/cards.css';
import './css/animations.css';
import './css/responsive.css';

// 2. 引入 JS 模块逻辑
// 注意：如果 utils.js 等文件内部没有使用 export，直接 import 即可执行
import './js/utils.js';
import './js/carousel.js';
import './js/animations.js';
import './js/mainJs.js';


// 3. 初始化 AOS 动画库 (因为是在 HTML 中通过 CDN 引入的，这里可以直接用)
window.addEventListener('load', () => {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            once: true,
            easing: 'ease-in-out'
        });
    }
});

console.log('🚀 廊坊非遗数字中心：工程化环境加载成功！');