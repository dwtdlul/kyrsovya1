// PC Morph - Main JavaScript

const THEME = {
    accent: '#c8ff00',
    accentSecondary: '#ff6b00',
    accentHover: '#d4ff33',
    bgDark: '#0a0a0a',
    error: '#ff6b6b',
    success: '#4ade80'
};

document.addEventListener('DOMContentLoaded', () => {
    initBurgerMenu();
    initCartCalculator();
    initFilters();
    initLazyLoading();
    setActiveNavItem();
    initTouchFeedback();
});

// ==========================================
// BURGER MENU
// ==========================================
function initBurgerMenu() {
    const menuBtn = document.getElementById('menuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (!menuBtn || !mobileMenu) return;
    
    menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        menuBtn.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        
        if (mobileMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });
    
    const menuLinks = mobileMenu.querySelectorAll('.mobile-menu__link');
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuBtn.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    document.addEventListener('click', (e) => {
        if (mobileMenu.classList.contains('active') && 
            !mobileMenu.contains(e.target) && 
            !menuBtn.contains(e.target)) {
            menuBtn.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// ==========================================
// CART CALCULATOR
// ==========================================
function initCartCalculator() {
    const cartItems = document.getElementById('cartItems');
    if (!cartItems) return;
    
    cartItems.addEventListener('click', (e) => {
        const target = e.target;
        
        if (target.classList.contains('quantity-btn')) {
            const cartItem = target.closest('.cart-item');
            if (!cartItem) return;
            
            const quantityEl = cartItem.querySelector('.quantity-value');
            if (!quantityEl) return;
            
            const isIncrement = target.textContent.includes('+');
            const delta = isIncrement ? 1 : -1;
            
            let value = parseInt(quantityEl.textContent) + delta;
            if (value < 1) value = 1;
            if (value > 99) value = 99;
            
            quantityEl.style.transform = 'scale(1.3)';
            quantityEl.style.color = THEME.accent;
            quantityEl.textContent = value;
            
            setTimeout(() => {
                quantityEl.style.transform = 'scale(1)';
                quantityEl.style.color = '';
            }, 150);
            
            updateCartTotal();
        }
        
        if (target.closest('.cart-item__remove')) {
            const cartItem = target.closest('.cart-item');
            if (!cartItem) return;
            
            cartItem.style.transition = 'all 0.3s ease';
            cartItem.style.transform = 'translateX(-100%)';
            cartItem.style.opacity = '0';
            
            setTimeout(() => {
                cartItem.remove();
                updateCartTotal();
                
                if (document.querySelectorAll('.cart-item').length === 0) {
                    showEmptyCart();
                }
            }, 300);
        }
    });
    
    updateCartTotal();
}

function updateCartTotal() {
    const totalEl = document.getElementById('totalPrice');
    if (!totalEl) return;
    
    const items = document.querySelectorAll('.cart-item');
    let total = 0;
    
    items.forEach(item => {
        const priceEl = item.querySelector('.cart-item__price');
        const qtyEl = item.querySelector('.quantity-value');
        
        if (priceEl && qtyEl) {
            const priceText = priceEl.textContent.replace(/[^\d]/g, '');
            const price = parseInt(priceText) || 0;
            const qty = parseInt(qtyEl.textContent) || 1;
            total += price * qty;
        }
    });
    
    totalEl.style.transition = 'all 0.2s';
    totalEl.style.transform = 'scale(1.1)';
    totalEl.style.color = THEME.accent;
    
    setTimeout(() => {
        totalEl.textContent = total.toLocaleString('ru-RU') + ' ₽';
        totalEl.style.transform = 'scale(1)';
        totalEl.style.color = '';
    }, 150);
}

function showEmptyCart() {
    const container = document.getElementById('cartItems');
    if (!container) return;
    
    container.innerHTML = `
        <div style="text-align: center; padding: 60px 20px;">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" style="margin-bottom: 20px; color: ${THEME.accent}; opacity: 0.5;">
                <circle cx="9" cy="21" r="1"/>
                <circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            <p style="font-size: 18px; margin-bottom: 8px; color: var(--color-text-primary);">Корзина пуста</p>
            <p style="font-size: 14px; color: var(--color-text-secondary); margin-bottom: 24px;">Добавьте товары из каталога</p>
            <a href="catalog.html" class="btn btn--primary">В каталог</a>
        </div>
    `;
    
    const summary = document.querySelector('.cart__summary');
    if (summary) {
        summary.style.display = 'none';
    }
}

// ==========================================
// ADD TO CART
// ==========================================
function addToCart(productName) {
    const btn = event?.target?.closest('.btn') || document.querySelector('.btn--primary');
    if (!btn) return;
    
    const originalHTML = btn.innerHTML;
    
    btn.style.background = THEME.accent;
    btn.style.color = '#000';
    btn.innerHTML = '✓ Добавлено';
    btn.disabled = true;
    
    showNotification(productName + ' добавлен в корзину', 'success');
    
    setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.style.background = '';
        btn.style.color = '';
        btn.disabled = false;
    }, 1500);
}

// ==========================================
// CHECKOUT
// ==========================================
function checkout() {
    const btn = event?.target?.closest('.btn');
    if (!btn) return;
    
    btn.innerHTML = '<span style="animation: spin 1s linear infinite;">⟳</span> Оформление...';
    btn.disabled = true;
    
    setTimeout(() => {
        btn.innerHTML = '✓ Заказ оформлен!';
        btn.style.background = THEME.success;
        
        showNotification('Заказ успешно оформлен!', 'success');
        
        setTimeout(() => {
            window.location.href = 'profile.html';
        }, 1500);
    }, 2000);
}

// ==========================================
// FILTERS
// ==========================================
function initFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const cards = document.querySelectorAll('.product-card');
            cards.forEach((card, i) => {
                card.style.opacity = '0.5';
                setTimeout(() => card.style.opacity = '1', i * 50);
            });
        });
    });
}

// ==========================================
// NOTIFICATIONS
// ==========================================
function showNotification(message, type = 'default') {
    const old = document.querySelector('.notification');
    if (old) old.remove();
    
    const n = document.createElement('div');
    n.className = 'notification';
    
    const colors = {
        default: THEME.accent,
        success: THEME.success,
        error: THEME.error
    };
    
    const icons = { default: '◆', success: '✓', error: '✕' };
    const color = colors[type] || colors.default;
    const icon = icons[type] || icons.default;
    const textColor = type === 'default' ? '#000' : '#fff';
    
    n.innerHTML = `<span style="display: flex; align-items: center; gap: 8px;"><span>${icon}</span>${message}</span>`;
    n.style.cssText = `
        position: fixed;
        top: 80px;
        left: 50%;
        transform: translateX(-50%);
        background: ${color};
        color: ${textColor};
        padding: 14px 24px;
        border-radius: 12px;
        z-index: 10000;
        font-size: 14px;
        font-weight: 600;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        white-space: nowrap;
        animation: slideDown 0.3s ease;
    `;
    
    document.body.appendChild(n);
    
    setTimeout(() => {
        n.style.opacity = '0';
        n.style.transform = 'translateX(-50%) translateY(-10px)';
        setTimeout(() => n.remove(), 200);
    }, 2500);
}

// ==========================================
// LAZY LOADING
// ==========================================
function initLazyLoading() {
    if (!('IntersectionObserver' in window)) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(20px)';
                
                requestAnimationFrame(() => {
                    entry.target.style.transition = 'opacity 0.5s, transform 0.5s';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                });
                
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.product-card, .category-card, .feature-item').forEach(el => {
        observer.observe(el);
    });
}

// ==========================================
// NAVIGATION
// ==========================================
function setActiveNavItem() {
    const current = window.location.pathname.split('/').pop() || 'index.html';
    
    document.querySelectorAll('.bottom-nav__item').forEach(item => {
        const href = item.getAttribute('href');
        if (href === current || href?.includes(current)) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
    
    document.querySelectorAll('.mobile-menu__link').forEach(item => {
        const href = item.getAttribute('href');
        if (href === current || href?.includes(current)) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// ==========================================
// TOUCH FEEDBACK
// ==========================================
function initTouchFeedback() {
    const elements = document.querySelectorAll('.btn, .bottom-nav__item, .product-card, .category-card, .cart-item');
    
    elements.forEach(el => {
        el.addEventListener('touchstart', () => {
            el.style.transform = 'scale(0.98)';
        }, { passive: true });
        
        el.addEventListener('touchend', () => {
            el.style.transform = '';
        }, { passive: true });
    });
}

// ==========================================
// QUANTITY CONTROL
// ==========================================
function changeQuantity(delta) {
    const btn = event.target;
    const container = btn.closest('.cart-item__quantity');
    if (!container) return;
    
    const valueEl = container.querySelector('.quantity-value');
    if (!valueEl) return;
    
    let value = parseInt(valueEl.textContent) + delta;
    if (value < 1) value = 1;
    if (value > 99) value = 99;
    
    valueEl.style.transform = 'scale(1.3)';
    valueEl.style.color = THEME.accent;
    valueEl.textContent = value;
    
    setTimeout(() => {
        valueEl.style.transform = 'scale(1)';
        valueEl.style.color = '';
    }, 150);
    
    updateCartTotal();
}

// ==========================================
// REMOVE ITEM
// ==========================================
function removeItem() {
    const btn = event.target.closest('.cart-item__remove');
    if (!btn) return;
    
    const cartItem = btn.closest('.cart-item');
    if (!cartItem) return;
    
    cartItem.style.transition = 'all 0.3s ease';
    cartItem.style.transform = 'translateX(-100%)';
    cartItem.style.opacity = '0';
    
    setTimeout(() => {
        cartItem.remove();
        updateCartTotal();
        
        if (document.querySelectorAll('.cart-item').length === 0) {
            showEmptyCart();
        }
    }, 300);
}

// ==========================================
// ADMIN FUNCTIONS
// ==========================================
function editOrder(id) {
    showNotification('Редактирование заказа #' + id);
}

function deleteOrder(id) {
    const row = event?.target?.closest('tr');
    if (!row) return;
    
    if (confirm('Удалить заказ #' + id + '?')) {
        row.style.opacity = '0';
        setTimeout(() => row.remove(), 200);
        showNotification('Заказ #' + id + ' удален', 'error');
    }
}

function addOrder() {
    showNotification('Создание нового заказа');
}

function logout() {
    if (confirm('Выйти из аккаунта?')) {
        showNotification('Выход выполнен', 'success');
        setTimeout(() => window.location.href = 'index.html', 800);
    }
}

// ==========================================
// MODAL FUNCTIONS
// ==========================================
function showAddProductModal() {
    const modal = document.getElementById('addProductModal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function closeAddProductModal() {
    const modal = document.getElementById('addProductModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

function saveProduct() {
    showNotification('Товар успешно добавлен!', 'success');
    closeAddProductModal();
}

// ==========================================
// ANIMATIONS
// ==========================================
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    @keyframes slideDown {
        from { opacity: 0; transform: translateX(-50%) translateY(-20px); }
        to { opacity: 1; transform: translateX(-50%) translateY(0); }
    }
`;
document.head.appendChild(style);

// Export functions
window.addToCart = addToCart;
window.checkout = checkout;
window.changeQuantity = changeQuantity;
window.removeItem = removeItem;
window.editOrder = editOrder;
window.deleteOrder = deleteOrder;
window.addOrder = addOrder;
window.logout = logout;
window.showNotification = showNotification;
window.showAddProductModal = showAddProductModal;
window.closeAddProductModal = closeAddProductModal;
window.saveProduct = saveProduct;

console.log('PC Morph v3.0 - Mobile Optimized');
