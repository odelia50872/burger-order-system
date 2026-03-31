class AuthManager {
    constructor(app) {
        this.app = app;
    }

    showLoginForm() {
        document.getElementById('login-tab').classList.add('active');
        document.getElementById('register-tab').classList.remove('active');
        document.getElementById('login-form').classList.add('active');
        document.getElementById('register-form').classList.remove('active');        
        if (this.app.pageHistoryManager && !this.app.pageHistoryManager.isNavigating) {
            this.app.pageHistoryManager.onAuthPageChange('login');
        }
    }

    showRegisterForm() {
        document.getElementById('register-tab').classList.add('active');
        document.getElementById('login-tab').classList.remove('active');
        document.getElementById('register-form').classList.add('active');
        document.getElementById('login-form').classList.remove('active');
        if (this.app.pageHistoryManager && !this.app.pageHistoryManager.isNavigating) {
            this.app.pageHistoryManager.onAuthPageChange('register');
        }
    }

    handleLogin() {
        const phone = document.getElementById('login-phone').value;
        const password = document.getElementById('login-password').value;
        if (!phone || !password) {
            this.app.showMessage('אנא מלא את כל השדות', 'error');
            return;
        }
        this.app.showLoading();
        const client = new Client('', '', phone, password, '');
        const originalClient = localStorage.getItem('currentClient');
        client.login();
        setTimeout(() => {
            const currentClient = localStorage.getItem('currentClient'); 
            this.app.hideLoading();
            if (currentClient && currentClient !== originalClient) {
                this.app.pageHistoryManager.onLogin();
                this.app.showMainPage();
                this.app.loadOrders();
                this.app.loadFavorites();
                this.app.showMessage('התחברת בהצלחה!', 'success');
                setTimeout(() => this.clearLoginForm(), 100);
            } else {
                this.app.showMessage('שגיאה בהתחברות. בדוק את הפרטים', 'error');
            }
        }, 1500);
    }

    handleRegister() {
        const firstName = document.getElementById('register-firstName').value;
        const lastName = document.getElementById('register-lastName').value;
        const phone = document.getElementById('register-phone').value;
        const password = document.getElementById('register-password').value;
        const birthDate = document.getElementById('register-birthDate').value;
        if (!firstName) {
            this.app.showMessage('אנא הכנס שם פרטי', 'error');
            return;
        }
        if (!lastName) {
            this.app.showMessage('אנא הכנס שם משפחה', 'error');
            return;
        }
        if (!phone) {
            this.app.showMessage('אנא הכנס מספר טלפון', 'error');
            return;
        }
        if (!password) {
            this.app.showMessage('אנא הכנס סיסמה', 'error');
            return;
        }
        if (!birthDate) {
            this.app.showMessage('אנא בחר תאריך לידה', 'error');
            return;
        }
        if (phone.length !== 10 || !phone.startsWith('05')) {
            this.app.showMessage('מספר טלפון חייב להיות 10 ספרות ולהתחיל ב-05', 'error');
            return;
        }
        const passwordValidation = this.validatePassword(password);
        if (!passwordValidation.isValid) {
            this.app.showMessage(passwordValidation.message, 'error');
            return;
        }
        this.app.showLoading();
        const client = new Client(firstName, lastName, phone, password, birthDate);
        const originalClient = localStorage.getItem('currentClient');
        client.register();
        setTimeout(() => {
            const currentClient = localStorage.getItem('currentClient');
            this.app.hideLoading();
            if (currentClient && currentClient !== originalClient) {
                this.app.pageHistoryManager.onLogin();
                this.app.showMainPage();
                this.app.showMessage('נרשמת בהצלחה!', 'success');
                setTimeout(() => this.clearRegisterForm(), 100);
            } else {
                this.app.showMessage('הינך כבר רשום במערכת! אנא עבור לטאב התחברות כדי להיכנס לחשבון שלך', 'error');
            }
        }, 1500);
    }

    validatePassword(password) {
        const hasSpecialChar = /[*$#!]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasCapitalLetter = /[A-Z]/.test(password);
        const hasSmallLetter = /[a-z]/.test(password);
        const hasValidLength = password.length >= 6;
        
        if (!hasValidLength) {
            return { isValid: false, message: 'סיסמה חייבת להיות באורך של לפחות 6 תווים' };
        }
        if (!hasCapitalLetter) {
            return { isValid: false, message: 'סיסמה חייבת לכלול לפחות אות גדולה אחת (A-Z)' };
        }
        if (!hasSmallLetter) {
            return { isValid: false, message: 'סיסמה חייבת לכלול לפחות אות קטנה אחת (a-z)' };
        }
        if (!hasNumber) {
            return { isValid: false, message: 'סיסמה חייבת לכלול לפחות מספר אחד (0-9)' };
        }
        if (!hasSpecialChar) {
            return { isValid: false, message: 'סיסמה חייבת לכלול לפחות תו מיוחד אחד (*, $, #)' };
        }
        
        return { isValid: true, message: '' };
    }

    clearLoginForm() {
        const phoneInput = document.querySelector('#login-phone');
        const passwordInput = document.querySelector('#login-password');
        if (phoneInput) phoneInput.value = '';
        if (passwordInput) passwordInput.value = '';
    }

    clearRegisterForm() {
        const firstNameInput = document.querySelector('#register-firstName');
        const lastNameInput = document.querySelector('#register-lastName');
        const phoneInput = document.querySelector('#register-phone');
        const passwordInput = document.querySelector('#register-password');
        const birthDateInput = document.querySelector('#register-birthDate');
        
        if (firstNameInput) firstNameInput.value = '';
        if (lastNameInput) lastNameInput.value = '';
        if (phoneInput) phoneInput.value = '';
        if (passwordInput) passwordInput.value = '';
        if (birthDateInput) birthDateInput.value = '';
    }

    logout() {
        localStorage.removeItem('currentClient');
        this.app.cart = [];
        this.app.updateCartCount();
        this.clearAllPages();
        this.app.pageHistoryManager.onLogout();
        this.app.showAuthPage();
        this.app.showMessage('התנתקת בהצלחה', 'success');
    }

    clearAllPages() {
        document.getElementById('orders-list').innerHTML = '';
        document.getElementById('favorites-list').innerHTML = '';
        document.getElementById('cart-items').innerHTML = '';
        document.getElementById('cart-total').innerHTML = '';
        document.getElementById('profile-info').innerHTML = '';
        document.getElementById('cart-total').style.display = 'none';
        document.getElementById('checkout-btn').style.display = 'none';
        document.getElementById('profile-edit').style.display = 'none';
        document.querySelectorAll('.favorite-heart').forEach(heart => {
            heart.classList.remove('active');
        });
    }

    togglePassword(inputId) {
        const input = document.getElementById(inputId);
        const toggle = input.parentElement.querySelector('.password-toggle');
        
        if (input.type === 'password') {
            input.type = 'text';
            toggle.classList.add('hidden');
            toggle.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
                </svg>
            `;
        } else {
            input.type = 'password';
            toggle.classList.remove('hidden');
            toggle.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                </svg>
            `;
        }
    }
}