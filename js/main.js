class BurgerApp {
    constructor() {
        this.cart = [];
        this.currentClient = null;
        this.authManager = new AuthManager(this);
        this.cartManager = new CartManager(this);
        this.favoritesManager = new FavoritesManager(this);
        this.ordersManager = new OrdersManager(this);
        this.profileManager = new ProfileManager(this);
        this.customBurgerManager = new CustomBurgerManager(this);
        this.userInterfaceManager = new UserInterfaceManager(this);
        this.pageHistoryManager = new PageHistoryManager(this);
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkAuthStatus();
    }

    setupEventListeners() {
        document.getElementById('login-tab').addEventListener('click', () => this.authManager.showLoginForm());
        document.getElementById('register-tab').addEventListener('click', () => this.authManager.showRegisterForm());
        document.getElementById('login-btn').addEventListener('click', () => this.authManager.handleLogin());
        document.getElementById('register-btn').addEventListener('click', () => this.authManager.handleRegister());
        document.getElementById('home-nav').addEventListener('click', () => this.userInterfaceManager.showContent('home'));
        document.getElementById('orders-nav').addEventListener('click', () => this.userInterfaceManager.showContent('orders'));
        document.getElementById('favorites-nav').addEventListener('click', () => this.userInterfaceManager.showContent('favorites'));
        document.getElementById('cart-nav').addEventListener('click', () => this.userInterfaceManager.showContent('cart'));
        document.getElementById('profile-nav').addEventListener('click', () => this.userInterfaceManager.showContent('profile'));
        document.getElementById('logout-btn').addEventListener('click', () => this.authManager.logout());
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-cart')) {
                this.cartManager.addToCart(e.target);
            }
            if (e.target.classList.contains('favorite-heart')) {
                this.favoritesManager.addToFavorites(e.target.closest('.menu-item'));
                e.target.classList.add('active');
            }
            if (e.target.classList.contains('reorder-btn')) {
                this.ordersManager.reorder(e.target.dataset.orderName, e.target.dataset.orderPrice);
            }
            if (e.target.classList.contains('remove-favorite-icon')) {
                this.favoritesManager.removeFavorite(e.target.dataset.dishName);
            }
        });
        document.getElementById('checkout-btn').addEventListener('click', () => this.cartManager.checkout());
        document.addEventListener('click', (e) => {
            if (e.target.id === 'edit-profile-btn') this.profileManager.showEditProfile();
            if (e.target.id === 'save-profile-btn') this.profileManager.saveProfile();
            if (e.target.id === 'cancel-edit-btn') this.profileManager.cancelEdit();
        });
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('customize-burger')) this.customBurgerManager.showCustomBurger();
            if (e.target.classList.contains('close-modal')) this.customBurgerManager.closeCustomBurger();
            if (e.target.id === 'add-custom-burger') this.customBurgerManager.addCustomBurger();
            if (e.target.id === 'cancel-custom') this.customBurgerManager.closeCustomBurger();
        });
        document.addEventListener('change', (e) => {
            if (e.target.closest('#custom-burger-modal')) {
                this.customBurgerManager.updateCustomPrice();
            }
        });
    }

    checkAuthStatus() {
        const currentClient = localStorage.getItem('currentClient');
        if (currentClient) {
            this.userInterfaceManager.showMainPage();
            this.ordersManager.loadOrders();
            this.favoritesManager.loadFavorites();
            this.favoritesManager.updateMenuFavorites();
        } else {
            this.userInterfaceManager.showAuthPage();
        }
    }

    showLoading() { this.userInterfaceManager.showLoading(); }
    hideLoading() { this.userInterfaceManager.hideLoading(); }
    showAuthPage() { this.userInterfaceManager.showAuthPage(); }
    showMainPage() { this.userInterfaceManager.showMainPage(); }
    showContent(contentType) { this.userInterfaceManager.showContent(contentType); }
    updateCartCount() { this.userInterfaceManager.updateCartCount(); }
    showMessage(message, type) { this.userInterfaceManager.showMessage(message, type); }
    showSuccessMessage(message) { this.userInterfaceManager.showSuccessMessage(message); }
    showBirthdayMessage(message) { this.userInterfaceManager.showBirthdayMessage(message); }
    loadOrders() { this.ordersManager.loadOrders(); }
    loadFavorites() { this.favoritesManager.loadFavorites(); }
    checkBirthday(callback) { this.ordersManager.checkBirthday(callback); }
    togglePassword(inputId) { this.authManager.togglePassword(inputId); }
}

const app = new BurgerApp();