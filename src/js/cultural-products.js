import { productList } from './products-data.js';

// 获取DOM元素
const cartFloat = document.getElementById('cartFloat');
const cartModal = document.getElementById('cartModal');
const cartClose = document.getElementById('cartClose');
const cartBadge = document.getElementById('cartBadge');
const cartEmpty = document.getElementById('cartEmpty');
const cartList = document.getElementById('cartList');
const cartFooter = document.getElementById('cartFooter');
const cartTotalPrice = document.getElementById('cartTotalPrice');
const cartToast = document.getElementById('cartToast');
const backShop = document.querySelector('.back-shop');
const cartSettle = document.getElementById('cartSettle');

// 购物车数据（本地存储）
let cartData = JSON.parse(localStorage.getItem('lfichCart')) || [];

// 页面加载渲染
window.onload = function () {
    productLogic.init();
    renderCart();
    updateCartBadge();
    calculateTotal();
};

// 渲染购物车
function renderCart() {
    if (cartData.length === 0) {
        cartEmpty.style.display = 'block';
        cartList.style.display = 'none';
        cartFooter.style.display = 'none';
        return;
    }

    cartEmpty.style.display = 'none';
    cartList.style.display = 'block';
    cartFooter.style.display = 'flex';

    cartList.innerHTML = '';
    cartData.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.img}" alt="${item.name}" class="cart-item-img"
                 onerror="this.onerror=null;this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Crect fill=%22%239D2933%22 width=%22100%22 height=%22100%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-size=%2212%22 fill=%22%23F5F0E8%22%3E${encodeURIComponent(item.name.substring(0,4))}%3C/text%3E%3C/svg%3E'">
            <div class="cart-item-info">
                <h4 class="cart-item-title">${item.name}</h4>
                <div class="cart-item-price">¥${item.price}</div>
            </div>
            <div class="cart-item-ctrl">
                <button class="count-btn minus" data-index="${index}">-</button>
                <input type="number" class="count-input" value="${item.count}" min="1" data-index="${index}">
                <button class="count-btn plus" data-index="${index}">+</button>
            </div>
            <div class="cart-item-del" data-index="${index}"><i class="fas fa-trash"></i></div>
        `;
        cartList.appendChild(cartItem);
    });

    bindCountEvent();
    bindDelEvent();
}

// 绑定数量增减事件
function bindCountEvent() {
    const inputs = document.querySelectorAll('.count-input');
    const plusBtns = document.querySelectorAll('.plus');
    const minusBtns = document.querySelectorAll('.minus');

    plusBtns.forEach(btn => {
        btn.onclick = function () {
            const index = this.dataset.index;
            cartData[index].count++;
            updateCart(index, cartData[index].count);
        }
    });

    minusBtns.forEach(btn => {
        btn.onclick = function () {
            const index = this.dataset.index;
            if (cartData[index].count > 1) {
                cartData[index].count--;
                updateCart(index, cartData[index].count);
            }
        }
    });

    inputs.forEach(input => {
        input.onchange = function () {
            const index = this.dataset.index;
            let val = parseInt(this.value);
            if (isNaN(val) || val < 1) val = 1;
            cartData[index].count = val;
            updateCart(index, val);
        }
    });
}

// 绑定删除事件
function bindDelEvent() {
    const delBtns = document.querySelectorAll('.cart-item-del');
    delBtns.forEach(btn => {
        btn.onclick = function () {
            const index = this.dataset.index;
            cartData.splice(index, 1);
            localStorage.setItem('lfichCart', JSON.stringify(cartData));
            renderCart();
            updateCartBadge();
            calculateTotal();
        }
    });
}

// 更新购物车单个商品数量
function updateCart(index, count) {
    localStorage.setItem('lfichCart', JSON.stringify(cartData));
    const inputs = document.querySelectorAll('.count-input');
    if (inputs[index]) inputs[index].value = count;
    updateCartBadge();
    calculateTotal();
}

// 更新购物车角标
function updateCartBadge() {
    let totalCount = 0;
    cartData.forEach(item => {
        totalCount += item.count;
    });
    if (cartBadge) cartBadge.innerText = totalCount;
}

// 计算总价
function calculateTotal() {
    let total = 0;
    cartData.forEach(item => {
        total += item.price * item.count;
    });
    if (cartTotalPrice) cartTotalPrice.innerText = `¥${total.toFixed(2)}`;
}

// 显示购物车弹窗
if (cartFloat) {
    cartFloat.addEventListener('click', function () {
        if (cartModal) {
            cartModal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    });
}

// 关闭购物车弹窗
if (cartClose) {
    cartClose.addEventListener('click', function () {
        if (cartModal) {
            cartModal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    });
}

// 点击遮罩关闭购物车
if (cartModal) {
    cartModal.addEventListener('click', function (e) {
        if (e.target === this) {
            cartModal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    });
}

// 返回挑选文创
if (backShop) {
    backShop.addEventListener('click', function () {
        if (cartModal) {
            cartModal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    });
}

// 加入购物车成功提示
function showToast(msg = '加入购物车成功！') {
    cartToast.innerText = msg;
    cartToast.classList.add('show');
    setTimeout(() => {
        cartToast.classList.remove('show');
    }, 1500);
}

// 立即结算
if (cartSettle) cartSettle.addEventListener('click', function () {
    if (cartData.length === 0) return;

    // 模拟结算过程
    cartSettle.innerText = '正在处理...';
    cartSettle.disabled = true;

    setTimeout(() => {
        alert('支付成功！感谢您对非遗文化的支持。');
        cartData = [];
        localStorage.setItem('lfichCart', JSON.stringify(cartData));
        renderCart();
        updateCartBadge();
        calculateTotal();
        cartModal.classList.remove('show');
        document.body.style.overflow = 'auto';
        cartSettle.innerText = '立即结算';
        cartSettle.disabled = false;
    }, 1500);
});

// 搜索和分页逻辑
const productLogic = {
    data: productList,
    state: {
        category: 'all',
        keyword: '',
        page: 1,
        pageSize: 6  // 2行 × 3列 = 6个商品/页
    },

    init() {
        this.bindEvents();
        this.updateDisplay();
    },

    bindEvents() {
        // 分类点击
        const cateBtns = document.querySelectorAll('.cate-btn');
        cateBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                cateBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.state.category = btn.dataset.cate;
                this.state.page = 1;
                this.updateDisplay();
            });
        });

        // 搜索功能
        const searchBtn = document.getElementById('productSearchBtn');
        const searchInput = document.getElementById('searchInput');
        const handleSearch = () => {
            this.state.keyword = searchInput.value.trim().toLowerCase();
            this.state.page = 1;
            this.updateDisplay();
        };

        if (searchBtn && searchInput) {
            searchBtn.addEventListener('click', handleSearch);
            searchInput.addEventListener('keyup', (e) => {
                if (e.key === 'Enter') handleSearch();
            });
        }

        // 分页点击
        const pagination = document.querySelector('.culture-pagination');
        if (pagination) {
            pagination.addEventListener('click', (e) => {
                const btn = e.target.closest('.page-btn');
                if (!btn || btn.classList.contains('disabled') || btn.classList.contains('active')) return;

                if (btn.dataset.page === 'prev') {
                    this.state.page--;
                } else if (btn.dataset.page === 'next') {
                    this.state.page++;
                } else {
                    this.state.page = parseInt(btn.dataset.page);
                }

                this.updateDisplay();
                const filterBar = document.querySelector('.culture-filter');
                if (filterBar) {
                    filterBar.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }
    },

    updateDisplay() {
        // 过滤
        const filtered = this.data.filter(item => {
            const matchCate = this.state.category === 'all' || item.cate === this.state.category;
            const matchSearch = item.name.toLowerCase().includes(this.state.keyword) ||
                item.detail.toLowerCase().includes(this.state.keyword);
            return matchCate && matchSearch;
        });

        // 分页
        const total = filtered.length;
        const totalPages = Math.ceil(total / this.state.pageSize);

        if (this.state.page > totalPages) this.state.page = totalPages || 1;
        if (this.state.page < 1) this.state.page = 1;

        const start = (this.state.page - 1) * this.state.pageSize;
        const end = start + this.state.pageSize;
        const currentItems = filtered.slice(start, end);

        // 渲染商品列表
        this.renderProductList(currentItems);
        this.renderPagination(totalPages);

        // 无结果提示
        const grid = document.querySelector('.culture-card-grid');
        let noResult = document.getElementById('no-result-msg');
        if (total === 0) {
            if (!noResult) {
                noResult = document.createElement('div');
                noResult.id = 'no-result-msg';
                noResult.className = 'no-result';
                noResult.innerHTML = `
                    <i class="fas fa-search"></i>
                    <p>未找到相关文创产品，换个关键词试试吧~</p>
                `;
                grid.appendChild(noResult);
            }
            noResult.style.display = 'block';
        } else if (noResult) {
            noResult.style.display = 'none';
        }
    },

    renderProductList(items) {
        const grid = document.querySelector('.culture-card-grid');
        if (!grid) return;

        grid.innerHTML = '';
        items.forEach(item => {
            const article = document.createElement('article');
            article.className = 'culture-card';
            article.setAttribute('data-id', item.id);
            article.onclick = () => location.href = `cultural-detail.html?id=${item.id}`;

            article.innerHTML = `
                <div class="card-badge">${this.getCategoryName(item.cate)}</div>
                <div class="card-img-wrapper">
                    <img src="${item.img}" alt="${item.name}" class="card-img"
                         onerror="this.onerror=null;this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22400%22%3E%3Crect fill=%22%239D2933%22 width=%22400%22 height=%22400%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-size=%2224%22 fill=%22%23F5F0E8%22 font-family=%22serif%22%3E${encodeURIComponent(item.name)}%3C/text%3E%3C/svg%3E'">
                </div>
                <div class="card-content">
                    <h3 class="card-title">${item.name}</h3>
                    <p class="card-desc">${item.detail.substring(0, 35)}...</p>
                    <div class="card-price">
                        <span class="price-now">¥${item.price}</span>
                        <span class="price-orig">¥${item.orig}</span>
                    </div>
                    <div class="card-actions">
                        <button class="card-btn add-cart-btn">加入购物车</button>
                        <a href="cultural-detail.html?id=${item.id}" class="card-btn secondary">详情</a>
                    </div>
                </div>
            `;

            // 阻止按钮冒泡
            const addBtn = article.querySelector('.add-cart-btn');
            const detailBtn = article.querySelector('.secondary');

            addBtn.onclick = (e) => {
                e.stopPropagation();
                this.addToCart(item);
            };
            detailBtn.onclick = (e) => {
                e.stopPropagation();
            };

            grid.appendChild(article);
        });
    },

    getCategoryName(cate) {
        const names = {
            'filigree': '花丝镶嵌',
            'cloisonne': '景泰蓝',
            'embroidery': '京绣',
            'kites': '风筝',
            'ceramics': '陶瓷',
            'lacquer': '漆器'
        };
        return names[cate] || '非遗文创';
    },

    addToCart(product) {
        const existIndex = cartData.findIndex(item => item.id === product.id);
        if (existIndex > -1) {
            cartData[existIndex].count++;
        } else {
            cartData.push({
                id: product.id,
                name: product.name,
                price: product.price,
                img: product.img,
                count: 1
            });
        }

        localStorage.setItem('lfichCart', JSON.stringify(cartData));
        renderCart();
        updateCartBadge();
        calculateTotal();
        showToast();
    },

    renderPagination(totalPages) {
        const container = document.querySelector('.culture-pagination');
        if (!container) return;

        if (totalPages <= 1) {
            container.style.display = 'none';
            return;
        }
        container.style.display = 'flex';

        let html = '';
        const prevDisabled = this.state.page === 1 ? 'disabled' : '';
        html += `<button class="page-btn ${prevDisabled}" data-page="prev"><i class="fas fa-chevron-left"></i></button>`;

        for (let i = 1; i <= totalPages; i++) {
            const active = i === this.state.page ? 'active' : '';
            html += `<button class="page-btn ${active}" data-page="${i}">${i}</button>`;
        }

        const nextDisabled = this.state.page === totalPages ? 'disabled' : '';
        html += `<button class="page-btn ${nextDisabled}" data-page="next"><i class="fas fa-chevron-right"></i></button>`;

        container.innerHTML = html;
    }
};