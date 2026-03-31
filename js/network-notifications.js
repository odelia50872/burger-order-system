class NetworkNotifications {
    static showNetworkError() {
        const notification = document.createElement('div');
        notification.className = 'network-error-notification';
        notification.innerHTML = `
            <div class="network-error-content">
                <span>⚠️ ארעה תקלה ברשת, אנא נסה שוב מאוחר יותר</span>
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
            NetworkNotifications.closeNetworkError(notification);
        }, 5000);
        
        closeBtn.addEventListener('click', () => {
            clearTimeout(autoClose);
            NetworkNotifications.closeNetworkError(notification);
        });
    }

    static closeNetworkError(notification) {
        notification.style.transform = 'translateX(400px)';
        notification.style.opacity = '0';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }
}