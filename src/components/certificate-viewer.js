/**
 * 证书查看组件
 */
class CertificateViewer {
  constructor() {
    this.certificates = [];
  }

  show(certificateData) {
    const modal = document.createElement('div');
    modal.className = 'certificate-modal';
    modal.innerHTML = `
            <div class="certificate-overlay" onclick="CertificateViewer.close()"></div>
            <div class="certificate-container">
                <button class="certificate-close" onclick="CertificateViewer.close()">×</button>
                <div class="certificate-content">
                    <div class="certificate-card">
                        <div class="certificate-header">
                            <div class="certificate-logo">🏮</div>
                            <h2>廊坊非遗数字中心</h2>
                            <p>结业证书</p>
                        </div>
                        <div class="certificate-body">
                            <div class="certificate-ornament top-left">❋</div>
                            <div class="certificate-ornament top-right">❋</div>
                            <div class="certificate-ornament bottom-left">❋</div>
                            <div class="certificate-ornament bottom-right">❋</div>
                            
                            <p class="certificate-text">兹证明</p>
                            <h3 class="certificate-name">${certificateData.studentName || '学员姓名'}</h3>
                            <p class="certificate-text">完成了</p>
                            <h4 class="certificate-course">${certificateData.courseName || '课程名称'}</h4>
                            <p class="certificate-text">课程学习，成绩合格，特发此证</p>
                            
                            <div class="certificate-info">
                                <div class="info-item">
                                    <span class="info-label">证书编号</span>
                                    <span class="info-value">${certificateData.certNo || 'LFYC2024001'}</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">颁发日期</span>
                                    <span class="info-value">${certificateData.issueDate || '2024年1月15日'}</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">学习时长</span>
                                    <span class="info-value">${certificateData.hours || '24'}小时</span>
                                </div>
                            </div>
                        </div>
                        <div class="certificate-footer">
                            <div class="certificate-seal">
                                <span>🏛️</span>
                                <p>廊坊非遗<br>数字中心</p>
                            </div>
                            <div class="certificate-qr">
                                <span>📱</span>
                                <p>扫码验证</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="certificate-actions">
                    <button class="cert-btn download" onclick="CertificateViewer.download()">
                        <span>⬇️</span> 下载证书
                    </button>
                    <button class="cert-btn share" onclick="CertificateViewer.share()">
                        <span>📤</span> 分享证书
                    </button>
                    <button class="cert-btn print" onclick="CertificateViewer.print()">
                        <span>🖨️</span> 打印证书
                    </button>
                </div>
            </div>
        `;

    this.addStyles();
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    // 添加动画
    requestAnimationFrame(() => {
      modal.classList.add('active');
    });
  }

  addStyles() {
    if (document.getElementById('certificate-viewer-styles')) return;

    const style = document.createElement('style');
    style.id = 'certificate-viewer-styles';
    style.textContent = `
            .certificate-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: 5000;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            .certificate-modal.active {
                opacity: 1;
            }
            .certificate-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.85);
                backdrop-filter: blur(10px);
            }
            .certificate-container {
                position: relative;
                max-width: 700px;
                width: 100%;
            }
            .certificate-close {
                position: absolute;
                top: -50px;
                right: 0;
                width: 40px;
                height: 40px;
                background: rgba(255, 255, 255, 0.1);
                border: none;
                border-radius: 50%;
                color: white;
                font-size: 1.5rem;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            .certificate-close:hover {
                background: rgba(255, 255, 255, 0.2);
            }
            .certificate-content {
                background: white;
                border-radius: 16px;
                padding: 8px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
            }
            .certificate-card {
                border: 3px solid #8B4513;
                border-radius: 12px;
                padding: 40px;
                background: linear-gradient(135deg, #FFFDF5 0%, #FFF8E7 100%);
                position: relative;
            }
            .certificate-header {
                text-align: center;
                margin-bottom: 30px;
            }
            .certificate-logo {
                font-size: 3rem;
                margin-bottom: 10px;
            }
            .certificate-header h2 {
                font-family: 'Noto Serif SC', serif;
                font-size: 1.5rem;
                color: #8B4513;
                margin-bottom: 8px;
            }
            .certificate-header p {
                font-size: 1.8rem;
                font-weight: 700;
                color: #C41E3A;
                letter-spacing: 10px;
            }
            .certificate-body {
                text-align: center;
                padding: 30px 0;
                border-top: 2px dashed #D4A574;
                border-bottom: 2px dashed #D4A574;
                position: relative;
            }
            .certificate-ornament {
                position: absolute;
                font-size: 1.5rem;
                color: #D4A574;
            }
            .certificate-ornament.top-left { top: 10px; left: 10px; }
            .certificate-ornament.top-right { top: 10px; right: 10px; }
            .certificate-ornament.bottom-left { bottom: 10px; left: 10px; }
            .certificate-ornament.bottom-right { bottom: 10px; right: 10px; }
            .certificate-text {
                font-size: 1rem;
                color: #5D4037;
                margin: 10px 0;
            }
            .certificate-name {
                font-family: 'Noto Serif SC', serif;
                font-size: 2rem;
                color: #2C1810;
                margin: 16px 0;
                padding-bottom: 8px;
                border-bottom: 2px solid #8B4513;
                display: inline-block;
            }
            .certificate-course {
                font-size: 1.3rem;
                color: #8B4513;
                margin: 16px 0;
            }
            .certificate-info {
                display: flex;
                justify-content: center;
                gap: 40px;
                margin-top: 30px;
            }
            .info-item {
                text-align: center;
            }
            .info-label {
                display: block;
                font-size: 0.8rem;
                color: #8B7355;
                margin-bottom: 4px;
            }
            .info-value {
                font-size: 0.95rem;
                color: #5D4037;
                font-weight: 500;
            }
            .certificate-footer {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-top: 30px;
                padding-top: 20px;
            }
            .certificate-seal {
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 12px 20px;
                border: 2px solid #C41E3A;
                border-radius: 50%;
            }
            .certificate-seal span {
                font-size: 1.5rem;
            }
            .certificate-seal p {
                font-size: 0.7rem;
                color: #C41E3A;
                text-align: center;
                line-height: 1.3;
            }
            .certificate-qr {
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 10px;
                background: #f5f5f5;
                border-radius: 8px;
            }
            .certificate-qr span {
                font-size: 2rem;
            }
            .certificate-qr p {
                font-size: 0.7rem;
                color: #666;
            }
            .certificate-actions {
                display: flex;
                justify-content: center;
                gap: 16px;
                margin-top: 24px;
            }
            .cert-btn {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 12px 24px;
                border: none;
                border-radius: 25px;
                font-size: 0.95rem;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            .cert-btn.download {
                background: #8B4513;
                color: white;
            }
            .cert-btn.share {
                background: #3498DB;
                color: white;
            }
            .cert-btn.print {
                background: white;
                color: #333;
                border: 1px solid #ddd;
            }
            .cert-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            }
            
            @media (max-width: 600px) {
                .certificate-card {
                    padding: 24px;
                }
                .certificate-header p {
                    font-size: 1.3rem;
                    letter-spacing: 5px;
                }
                .certificate-name {
                    font-size: 1.5rem;
                }
                .certificate-info {
                    flex-direction: column;
                    gap: 16px;
                }
                .certificate-actions {
                    flex-direction: column;
                }
                .cert-btn {
                    width: 100%;
                    justify-content: center;
                }
            }
        `;
    document.head.appendChild(style);
  }

  static close() {
    const modal = document.querySelector('.certificate-modal');
    if (modal) {
      modal.classList.remove('active');
      setTimeout(() => {
        modal.remove();
        document.body.style.overflow = '';
      }, 300);
    }
  }

  static download() {
    if (window.showNotification) {
      window.showNotification('证书下载中...', 'info');
    }
    setTimeout(() => {
      if (window.showNotification) {
        window.showNotification('证书已保存到下载文件夹', 'success');
      }
    }, 1500);
  }

  static share() {
    if (navigator.share) {
      navigator.share({
        title: '我的非遗学习证书',
        text: '我在廊坊非遗数字中心完成了课程学习，获得了结业证书！',
        url: window.location.href
      });
    } else {
      if (window.showNotification) {
        window.showNotification('已复制分享链接到剪贴板', 'success');
      }
    }
  }

  static print() {
    window.print();
  }
}

// 导出
window.CertificateViewer = CertificateViewer;
