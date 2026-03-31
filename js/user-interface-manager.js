class UserInterfaceManager {
    constructor(app) {
        this.app = app;
    }

    showLoading() {
        document.getElementById('loading-overlay').classList.add('show');
    }

    hideLoading() {
        document.getElementById('loading-overlay').classList.remove('show');
    }

    showAuthPage() {
        document.getElementById('auth-page').classList.add('active');
        document.getElementById('main-page').classList.remove('active');
    }

    showMainPage() {
        document.getElementById('main-page').classList.add('active');
        document.getElementById('auth-page').classList.remove('active');
    }

    showContent(contentType) {
        document.querySelectorAll('.content').forEach(content => content.classList.remove('active'));
        document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active')); 
        document.getElementById(`${contentType}-content`).classList.add('active');
        document.getElementById(`${contentType}-nav`).classList.add('active');  
        if (this.app.pageHistoryManager && !this.app.pageHistoryManager.isNavigating) {
            this.app.pageHistoryManager.onMainPageChange(contentType);
        }
        if (contentType === 'orders') this.app.ordersManager.loadOrders();
        if (contentType === 'favorites') this.app.favoritesManager.loadFavorites();
        if (contentType === 'cart') this.app.cartManager.updateCartDisplay();
        if (contentType === 'profile') this.app.profileManager.loadProfile();
        if (contentType === 'home') this.app.favoritesManager.updateMenuFavorites();
    }

    updateCartCount() {
        const totalItems = this.app.cart.reduce((sum, item) => sum + item.quantity, 0);
        document.getElementById('cart-count').textContent = totalItems;
    }

    showMessage(message, type) {
        const messageEl = document.getElementById('auth-message');
        messageEl.textContent = message;
        messageEl.className = `message ${type}`;
        setTimeout(() => {
            messageEl.textContent = '';
            messageEl.className = 'message';
        }, 5000);
    }

    showSuccessMessage(message) {
        const notification = document.createElement('div');
        notification.className = 'success-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
                <button class="close-notification">×</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        setTimeout(() => notification.classList.add('show'), 100);
        const autoClose = setTimeout(() => {
            this.closeNotification(notification);
        }, 3000);
        notification.querySelector('.close-notification').addEventListener('click', () => {
            clearTimeout(autoClose);
            this.closeNotification(notification);
        });
    }

    showBirthdayMessage(message) {
        const notification = document.createElement('div');
        notification.className = 'birthday-notification';
        notification.innerHTML = `
            <div class="birthday-content">
                <div class="birthday-header">🎉🎂🎉</div>
                <div class="birthday-text">${message}</div>
                <div class="birthday-footer">🎈🎁🎈</div>
                <button class="close-birthday">×</button>
            </div>
        `;
        document.body.appendChild(notification); 
        setTimeout(() => notification.classList.add('show'), 100);
        const autoClose = setTimeout(() => {
            this.closeNotification(notification);
        }, 6000);
        notification.querySelector('.close-birthday').addEventListener('click', () => {
            clearTimeout(autoClose);
            this.closeNotification(notification);
        });
    }

    showNetworkError(message) {
        const notification = document.createElement('div');
        notification.className = 'network-error-notification';
        notification.innerHTML = `
            <div class="network-error-content">
                <span>${message}</span>
                <button class="close-network-error">×</button>
            </div>
        `;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            transform: translateX(400px);
            transition: all 0.3s ease;
        `;
        const content = notification.querySelector('.network-error-content');
        content.style.cssText = `
            background: linear-gradient(135deg, #ff4757, #ff3742);
            color: white;
            padding: 15px 20px;
            border-radius: 12px;
            box-shadow: 0 8px 25px rgba(255, 71, 87, 0.4);
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 15px;
            min-width: 350px;
        `;
        const closeBtn = notification.querySelector('.close-network-error');
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 18px;
            font-weight: bold;
            cursor: pointer;
            padding: 0;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: background 0.2s ease;
        `;
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        const autoClose = setTimeout(() => {
            this.closeNetworkError(notification);
        }, 5000);
        closeBtn.addEventListener('click', () => {
            clearTimeout(autoClose);
            this.closeNetworkError(notification);
        });
    }

    closeNotification(notification) {
        notification.classList.add('hide');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    closeNetworkError(notification) {
        notification.style.transform = 'translateX(400px)';
        notification.style.opacity = '0';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    createLoader() {
        const loader = document.createElement('div');
        loader.id = 'loading';
        loader.innerHTML = '<div class="spinner"></div><p>מעבד בקשה...</p>';
        document.body.appendChild(loader);
        return loader;
    }
}