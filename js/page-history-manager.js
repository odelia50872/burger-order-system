class PageHistoryManager {
    constructor(app) {
        this.app = app;
        this.currentPage = null;
        this.isNavigating = false;
        this.init();
    }

    init() {
        window.addEventListener('popstate', (event) => {
            if (event.state && !this.isNavigating) {
                this.handleHistoryNavigation(event.state);
            }
        });
        this.setInitialState();
    }

    setInitialState() {
        const currentClient = localStorage.getItem('currentClient');
        if (currentClient) {
            this.pushState('main', 'home');
        } else {
            this.pushState('auth', 'login');
        }
    }

    pushState(page, section = null) {
        if (this.isNavigating) return;
        const state = { page, section };
        const url = this.buildUrl(page, section);
        if (this.currentPage !== `${page}-${section}`) {
            history.pushState(state, '', url);
            this.currentPage = `${page}-${section}`;
        }
    }

    replaceState(page, section = null) {
        const state = { page, section };
        const url = this.buildUrl(page, section);
        history.replaceState(state, '', url);
        this.currentPage = `${page}-${section}`;
    }

    buildUrl(page, section) {
        let url = '#';
        if (page === 'auth') {
            url += section === 'register' ? 'register' : 'login';
        } 
        else if (page === 'main') {
            url += section || 'home';
        }
        return url;
    }

    handleHistoryNavigation(state) {
        this.isNavigating = true;
        const currentClient = localStorage.getItem('currentClient');
        
        if (state.page === 'main' && !currentClient) {
            this.replaceState('auth', 'login');
            this.navigateToAuth('login');
        } 
        else if (state.page === 'auth' && currentClient) {
            this.replaceState('main', 'home');
            this.navigateToMain('home');
        } 
        else if (state.page === 'auth') {
            this.navigateToAuth(state.section);
        } 
        else if (state.page === 'main') {
            this.navigateToMain(state.section);
        }
        this.currentPage = `${state.page}-${state.section}`;
        setTimeout(() => {
            this.isNavigating = false;
        }, 100);
    }

    navigateToAuth(section) {
        this.app.userInterfaceManager.showAuthPage();
        if (section === 'register') {
            this.app.authManager.showRegisterForm();
        }
         else {
            this.app.authManager.showLoginForm();
        }
    }

    navigateToMain(section) {
        const currentClient = localStorage.getItem('currentClient');
        if (!currentClient) {
            this.pushState('auth', 'login');
            this.app.userInterfaceManager.showAuthPage();
            return;
        }
        this.app.userInterfaceManager.showMainPage();
        this.app.userInterfaceManager.showContent(section || 'home');
    }

    onAuthPageChange(section) {
        this.pushState('auth', section);
    }

    onMainPageChange(section) {
        this.pushState('main', section);
    }

    onLogin() {
        this.clearAuthHistory();
        this.replaceState('main', 'home');
    }

    clearAuthHistory() {
        const mainState = { page: 'main', section: 'home' };
        history.replaceState(mainState, '', '#home');
        this.currentPage = 'main-home';
    }

    onLogout() {
        history.replaceState(null, '', '#login');
        this.clearHistory();
        this.replaceState('auth', 'login');
    }

    clearHistory() {
        const currentState = { page: 'auth', section: 'login' };
        history.replaceState(currentState, '', '#login');
        this.currentPage = 'auth-login';
    }
}