class ProfileManager {
    constructor(app) {
        this.app = app;
    }

    loadProfile() {
        const phoneNumber = JSON.parse(localStorage.getItem('currentClient'));
        const request = new FXMLHttpRequest();
        request.open('GET', `/client/${phoneNumber}/name`);
        setTimeout(() => {
            request.send();
            setTimeout(() => {
                if (request.status === 200) {
                    const firstName = request.responseText;
                    this.displayProfile(firstName);
                }
                else {
                    console.error('שגיאת רשת בטעינת פרופיל - Status:', request.status || 503);
                }
            }, 1500);
        }, 100);
    }

    displayProfile(firstName) {
        const profileInfo = document.getElementById('profile-info');
        profileInfo.innerHTML = `
            <div class="profile-card">
                <h3>שם פרטי: ${firstName}</h3>
                <button id="edit-profile-btn" class="edit-profile-btn">ערוך פרופיל</button>
            </div>
        `;
    }

    showEditProfile() {
        document.getElementById('profile-info').style.display = 'none';
        document.getElementById('profile-edit').style.display = 'block';
    }

    saveProfile() {
        const firstName = document.getElementById('edit-firstName').value;
        const lastName = document.getElementById('edit-lastName').value;
        const newPassword = document.getElementById('edit-password').value;
        const birthDate = document.getElementById('edit-birthDate').value;
        const currentPassword = document.getElementById('current-password').value;
        if (!firstName || !lastName || !newPassword || !birthDate || !currentPassword) {
            this.app.showSuccessMessage('❌ אנא מלא את כל השדות');
            return;
        }
        this.app.showLoading();
        const phoneNumber = JSON.parse(localStorage.getItem('currentClient'));
        const loginRequest = new FXMLHttpRequest();
        loginRequest.open('POST', '/client/login');
        setTimeout(() => {
            loginRequest.send({ phoneNumber: phoneNumber, password: currentPassword });
            setTimeout(() => {
                if (loginRequest.status === 200) {
                    const updateClient = new Client(firstName, lastName, phoneNumber, newPassword, birthDate);
                    setTimeout(() => {
                        updateClient.update();
                        this.app.hideLoading();
                        this.clearProfileForm();
                        this.cancelEdit();
                        this.loadProfile();
                        this.app.showSuccessMessage('פרופיל עודכן בהצלחה!');
                    }, 100);
                }
                else {
                    this.app.hideLoading();
                    this.app.showSuccessMessage('❌ סיסמה נוכחית שגויה');
                }
            }, 1500);
        }, 100);
    }

    cancelEdit() {
        document.getElementById('profile-info').style.display = 'block';
        document.getElementById('profile-edit').style.display = 'none';
        document.getElementById('edit-password').value = '';
    }

    clearProfileForm() {
        const firstNameInput = document.querySelector('#edit-firstName');
        const lastNameInput = document.querySelector('#edit-lastName');
        const passwordInput = document.querySelector('#edit-password');
        const birthDateInput = document.querySelector('#edit-birthDate');
        const currentPasswordInput = document.querySelector('#current-password');

        if (firstNameInput) firstNameInput.value = '';
        if (lastNameInput) lastNameInput.value = '';
        if (passwordInput) passwordInput.value = '';
        if (birthDateInput) birthDateInput.value = '';
        if (currentPasswordInput) currentPasswordInput.value = '';
    }
}