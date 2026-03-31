class CartManager {
    constructor(app) {
        this.app = app;
    }

    addToCart(element) {
        let name, price;
        if (element.dataset && element.dataset.name) {
            name = element.dataset.name;
            price = parseInt(element.dataset.price);
        }
        else {
            const parentItem = element.closest('.menu-item') || element.closest('.favorite-item');
            if (parentItem) {
                name = parentItem.dataset.name;
                price = parseInt(parentItem.dataset.price);
            }
        }
        if (!name || !price) {
            return;
        }
        const existingItem = this.app.cart.find(item => item.name === name);
        if (existingItem) {
            existingItem.quantity++;
        }
        else {
            this.app.cart.push({ name, price, quantity: 1 });
        }

        this.app.updateCartCount();
        this.app.showSuccessMessage(`✅ ${name} נוסף לעגלה בהצלחה!`);
    }

    updateCartDisplay() {
        const cartItems = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');
        const checkoutBtn = document.getElementById('checkout-btn');

        if (this.app.cart.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <div class="empty-cart-icon">🛒</div>
                    <h3>העגלה שלך ריקה</h3>
                    <p>הוסף מנות מהתפריט כדי להתחיל להזמין</p>
                </div>
            `;
            cartTotal.style.display = 'none';
            checkoutBtn.style.display = 'none';
            return;
        }

        const dishImages = {
            'המבורגר קלאסיק': '../images/classic burger.jpeg',
            'המבורגר עם רוטב הבית': '../images/Hamburger with sauce.jpeg',
            'המבורגר כבש': '../images/Lamb burger.jpeg',
            'המבורגר עגבניות': '../images/Tomato burger.jpeg',
            'המבורגר דגנים מלאים': '../images/Wholemeal hamburger.jpeg'
        };

        cartItems.innerHTML = this.app.cart.map(item => `
            <div class="cart-item-modern">
                <img src="${dishImages[item.name] || '../images/classic burger.jpeg'}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <div class="cart-item-info">
                        <span class="quantity">כמות: ${item.quantity}</span>
                        <span class="price">₪${item.price * item.quantity}</span>
                    </div>
                </div>
                <button class="remove-item" onclick="app.cartManager.removeFromCart('${item.name}')">&times;</button>
            </div>
        `).join('');

        const total = this.app.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotal.innerHTML = `
            <div class="cart-total-simple">
                <h3>סה"כ לתשלום: <span class="total-price">₪${total}</span></h3>
            </div>
        `;
        cartTotal.style.display = 'block';
        checkoutBtn.style.display = 'block';
    }

    removeFromCart(itemName) {
        this.app.cart = this.app.cart.filter(item => item.name !== itemName);
        this.app.updateCartCount();
        this.updateCartDisplay();
        this.app.showSuccessMessage(`✅ ${itemName} הוסר מהעגלה`);
    }

    checkout() {
        if (this.app.cart.length === 0) {
            this.app.showMessage('העגלה ריקה', 'error');
            return;
        }

        this.app.showLoading();
        let total = this.app.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const orderName = this.app.cart.map(item => `${item.name} x${item.quantity}`).join(', ');
        const phoneNumber = JSON.parse(localStorage.getItem('currentClient'));
        const originalTotal = total;
        const birthdayRequest = new FXMLHttpRequest();
        birthdayRequest.open('GET', `/client/${phoneNumber}/dateOfBirth`);

        setTimeout(() => {
            birthdayRequest.send();
            setTimeout(() => {
                let isBirthday = false;
                let discountMessage = '';
                let finalTotal = originalTotal;
                if (birthdayRequest.status === 200) {
                    const birthDate = birthdayRequest.responseText;
                    const today = new Date();
                    const birth = new Date(birthDate);
                    isBirthday = today.getDate() === birth.getDate() && today.getMonth() === birth.getMonth();
                    if (isBirthday) {
                        const discount = Math.round(originalTotal * 0.1);
                        finalTotal = originalTotal - discount;
                        discountMessage = ` (הנחה יום הולדת: -₪${discount})`;
                    }
                } 
                else {
                    console.error('שגיאת רשת בבדיקת יום הולדת - Status:', birthdayRequest.status || 503);
                }
                const orderRequest = new FXMLHttpRequest();
                orderRequest.open('POST', `/orders/${phoneNumber}`);
                setTimeout(() => {
                    orderRequest.send({ orderName, price: originalTotal.toString() });
                    setTimeout(() => {
                        this.app.hideLoading();
                        if (orderRequest.status === 200) {
                            this.app.cart = [];
                            this.app.updateCartCount();
                            this.updateCartDisplay();
                            this.app.showContent('orders');
                            const successMessage = isBirthday ?
                                `🎉 מזל טוב ליום הולדת! הזמנה בוצעה עם הנחה 10%! סה"כ: ₪${finalTotal}${discountMessage}` :
                                `✅ הזמנה בוצעה בהצלחה! סה"כ: ₪${finalTotal}`;

                            setTimeout(() => {
                                if (isBirthday) {
                                    this.app.showBirthdayMessage(successMessage);
                                } else {
                                    this.app.showSuccessMessage(successMessage);
                                }
                            }, 500);
                        } else {
                            console.error('שגיאת רשת בביצוע הזמנה - Status:', orderRequest.status || 503);
                            this.app.showMessage('שגיאה בביצוע ההזמנה', 'error');
                        }
                    }, 1500);
                }, 200);
            }, 1500);
        }, 100);
    }
}