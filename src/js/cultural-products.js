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
const addCartBtns = document.querySelectorAll('.add-cart-btn');
const cartSettle = document.getElementById('cartSettle');

// 购物车数据（本地存储）
let cartData = JSON.parse(localStorage.getItem('lfichCart')) || [];

// 页面加载渲染购物车
window.onload = function () {
    renderCart();
    updateCartBadge();
    calculateTotal();
};

// 加入购物车
addCartBtns.forEach(btn => {
    btn.addEventListener('click', function () {
        const card = this.closest('.culture-card');
        const id = card.dataset.id;
        const name = card.dataset.name;
        const price = Number(card.dataset.price);
        const orig = card.dataset.orig;
        const cate = card.dataset.cate;
        const img = card.dataset.img;

        // 判断是否已加入购物车
        const existIndex = cartData.findIndex(item => item.id === id);
        if (existIndex > -1) {
            cartData[existIndex].count++;
        } else {
            cartData.push({
                id, name, price, orig, cate, img, count: 1
            });
        }

        // 保存到本地存储
        localStorage.setItem('lfichCart', JSON.stringify(cartData));
        // 更新视图
        renderCart();
        updateCartBadge();
        calculateTotal();
        // 显示成功提示
        showToast();
    });
});

// 渲染购物车列表
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
          <div class="cart-item-img">
            <img src="assets/images/culture/${item.img}" alt="${item.name}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2280%22 height=%2280%22%3E%3Crect fill=%22%23D4AF37%22 width=%2280%22 height=%2280%22/%3E%3Ctext x=%2250%25%22 y=%250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-size=%2212%22 fill=%22%23fff%22%3E非遗文创%3C/text%3E%3C/svg%3E'">
          </div>
          <div class="cart-item-info">
            <h4 class="cart-item-title">${item.name}</h4>
            <span class="cart-item-badge">${item.cate === 'filigree' ? '花丝镶嵌' : item.cate === 'cloisonne' ? '景泰蓝' : item.cate === 'embroidery' ? '京绣系列' : item.cate === 'daily' ? '非遗日用' : '工艺摆件'}</span>
            <p class="cart-item-price">¥${item.price}</p>
          </div>
          <div class="cart-item-count">
            <button class="count-btn minus" data-index="${index}">-</button>
            <input type="number" class="count-input" value="${item.count}" min="1" data-index="${index}">
            <button class="count-btn plus" data-index="${index}">+</button>
          </div>
          <div class="cart-item-del" data-index="${index}"><i class="fas fa-trash"></i></div>
        `;
        cartList.appendChild(cartItem);
    });

    // 绑定数量增减事件
    bindCountEvent();
    // 绑定删除事件
    bindDelEvent();
}

// 数量增减事件
function bindCountEvent() {
    const minusBtns = document.querySelectorAll('.count-btn.minus');
    const plusBtns = document.querySelectorAll('.count-btn.plus');
    const countInputs = document.querySelectorAll('.count-input');

    // 减数量
    minusBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const index = this.dataset.index;
            if (cartData[index].count > 1) {
                cartData[index].count--;
                updateCart(index, cartData[index].count);
            }
        });
    });

    // 加数量
    plusBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const index = this.dataset.index;
            cartData[index].count++;
            updateCart(index, cartData[index].count);
        });
    });

    // 输入数量
    countInputs.forEach(input => {
        input.addEventListener('blur', function () {
            const index = this.dataset.index;
            let count = Number(this.value);
            if (isNaN(count) || count < 1) count = 1;
            this.value = count;
            cartData[index].count = count;
            updateCart(index, count);
        });
    });
}

// 删除商品事件
function bindDelEvent() {
    const delBtns = document.querySelectorAll('.cart-item-del');
    delBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const index = this.dataset.index;
            cartData.splice(index, 1);
            localStorage.setItem('lfichCart', JSON.stringify(cartData));
            renderCart();
            updateCartBadge();
            calculateTotal();
        });
    });
}

// 更新购物车单个商品数量
function updateCart(index, count) {
    localStorage.setItem('lfichCart', JSON.stringify(cartData));
    document.querySelectorAll('.count-input')[index].value = count;
    calculateTotal();
}

// 更新购物车角标
function updateCartBadge() {
    let totalCount = 0;
    cartData.forEach(item => {
        totalCount += item.count;
    });
    cartBadge.innerText = totalCount;
}

// 计算总价
function calculateTotal() {
    let total = 0;
    cartData.forEach(item => {
        total += item.price * item.count;
    });
    cartTotalPrice.innerText = `¥${total.toFixed(2)}`;
}

// 显示购物车弹窗
cartFloat.addEventListener('click', function () {
    cartModal.classList.add('show');
    document.body.style.overflow = 'hidden';
});

// 关闭购物车弹窗
cartClose.addEventListener('click', function () {
    cartModal.classList.remove('show');
    document.body.style.overflow = 'auto';
});

// 点击遮罩关闭购物车
cartModal.addEventListener('click', function (e) {
    if (e.target === this) {
        cartModal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
});

// 返回挑选文创
backShop.addEventListener('click', function () {
    cartModal.classList.remove('show');
    document.body.style.overflow = 'auto';
});

// 加入购物车成功提示
function showToast() {
    cartToast.classList.add('show');
    setTimeout(() => {
        cartToast.classList.remove('show');
    }, 1500);
}

// 立即结算（可自行对接后端接口）
cartSettle.addEventListener('click', function () {
    alert('非遗文创结算中，敬请期待！');
    // 对接后端结算接口可写在这里
    // cartModal.classList.remove('show');
    // document.body.style.overflow = 'auto';
});

// 搜索和分页逻辑优化
const productLogic = {
    data: [],
    state: {
        category: 'all',
        keyword: '',
        page: 1,
        pageSize: 6 // 每页显示数量
    },

    init() {
        // 1. 提取数据
        const cards = document.querySelectorAll('.culture-card');
        cards.forEach(card => {
            // 获取描述文本，注意处理可能为空的情况
            const descEl = card.querySelector('.card-desc');
            const desc = descEl ? descEl.textContent.trim().toLowerCase() : '';
            const name = card.dataset.name ? card.dataset.name.toLowerCase() : '';

            this.data.push({
                element: card,
                id: card.dataset.id,
                name: name,
                cate: card.dataset.cate,
                desc: desc
            });
        });

        // 2. 绑定事件
        this.bindEvents();

        // 3. 初始渲染
        this.updateDisplay();
    },

    bindEvents() {
        // 分类筛选
        const cateBtns = document.querySelectorAll('.cate-btn');
        cateBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // 更新按钮样式
                cateBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');

                // 更新状态
                this.state.category = e.target.dataset.cate;
                this.state.page = 1; // 切换分类重置为第一页
                this.updateDisplay();
            });
        });

        // 搜索功能
        const searchInput = document.querySelector('.filter-search input');
        const searchBtn = document.querySelector('.search-btn');

        const handleSearch = () => {
            this.state.keyword = searchInput.value.trim().toLowerCase();
            this.state.page = 1; // 搜索重置为第一页
            this.updateDisplay();
        };

        if (searchBtn && searchInput) {
            searchBtn.addEventListener('click', handleSearch);
            searchInput.addEventListener('keyup', (e) => {
                if (e.key === 'Enter') handleSearch();
            });
        }

        // 分页点击 (事件委托)
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
                // 滚动到商品列表顶部
                const filterBar = document.querySelector('.culture-filter');
                if (filterBar) {
                    filterBar.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }
    },

    updateDisplay() {
        // 1. 过滤数据（模糊匹配：名称或描述包含关键词）
        const filtered = this.data.filter(item => {
            const matchCate = this.state.category === 'all' || item.cate === this.state.category;
            const matchSearch = item.name.includes(this.state.keyword) || item.desc.includes(this.state.keyword);
            return matchCate && matchSearch;
        });

        // 2. 分页计算
        const total = filtered.length;
        const totalPages = Math.ceil(total / this.state.pageSize);

        // 修正当前页码
        if (this.state.page > totalPages) this.state.page = totalPages || 1;
        if (this.state.page < 1) this.state.page = 1;

        const start = (this.state.page - 1) * this.state.pageSize;
        const end = start + this.state.pageSize;
        const currentItems = filtered.slice(start, end);

        // 3. 更新卡片显示
        // 先隐藏所有
        this.data.forEach(item => {
            item.element.style.display = 'none';
        });
        // 显示当前页
        currentItems.forEach(item => {
            item.element.style.display = 'block';
        });

        // 4. 更新分页控件
        this.renderPagination(totalPages);

        // 5. 无结果提示
        const grid = document.querySelector('.culture-card-grid');
        let noResult = document.getElementById('no-result-msg');
        if (total === 0) {
            if (!noResult) {
                noResult = document.createElement('div');
                noResult.id = 'no-result-msg';
                noResult.style.textAlign = 'center';
                noResult.style.padding = '60px 0';
                noResult.style.color = '#999';
                noResult.style.width = '100%';
                noResult.style.gridColumn = '1 / -1';
                noResult.innerHTML = '<i class="fas fa-search" style="font-size: 48px; margin-bottom: 20px; display: block;"></i><p>未找到相关文创产品，换个关键词试试吧~</p>';
                grid.appendChild(noResult);
            }
            noResult.style.display = 'block';
        } else if (noResult) {
            noResult.style.display = 'none';
        }
    },

    renderPagination(totalPages) {
        const container = document.querySelector('.culture-pagination');
        if (!container) return;

        // 如果没有数据或只有1页且少于每页数量，是否隐藏分页？
        // 这里选择：如果有数据且只有1页，隐藏分页；如果没有数据，也隐藏分页。
        if (totalPages <= 1) {
            container.style.display = 'none';
            return;
        }
        container.style.display = 'flex';

        let html = '';

        // 上一页
        const prevDisabled = this.state.page === 1 ? 'disabled' : '';
        html += `<button class="page-btn ${prevDisabled}" data-page="prev"><i class="fas fa-chevron-left"></i></button>`;

        // 页码生成逻辑 (简单的全部显示，如果页数多可以优化为 1 2 ... 5 6)
        // 这里由于总数不多，直接显示所有页码
        for (let i = 1; i <= totalPages; i++) {
            const active = i === this.state.page ? 'active' : '';
            html += `<button class="page-btn ${active}" data-page="${i}">${i}</button>`;
        }

        // 下一页
        const nextDisabled = this.state.page === totalPages ? 'disabled' : '';
        html += `<button class="page-btn ${nextDisabled}" data-page="next"><i class="fas fa-chevron-right"></i></button>`;

        container.innerHTML = html;
    }
};

// 初始化搜索和分页
productLogic.init();