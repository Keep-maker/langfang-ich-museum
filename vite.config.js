import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  // 部署到 GitHub Pages 时的基础路径
  // 如果你的仓库名是 'my-project'，则设置为 '/my-project/'
  base: '/langfang-ich-museum/',
  // 指定项目根目录为当前目录
  root: './',
  build: {
    rollupOptions: {
      input: {
        // 配置所有页面的入口点
        main: resolve(__dirname, 'index.html'),
        museum: resolve(__dirname, 'src/pages/museum.html'),
        quiz: resolve(__dirname, 'src/pages/quiz.html'),
        experience: resolve(__dirname, 'src/pages/experience.html'),
        aiGuide: resolve(__dirname, 'src/pages/ai-guide.html'),
        culturalProducts: resolve(__dirname, 'src/pages/cultural-products.html'),
        craftDetail: resolve(__dirname, 'src/pages/craft-detail.html'),
        culturalDetail: resolve(__dirname, 'src/pages/cultural-detail.html')
      }
    }
  }
});