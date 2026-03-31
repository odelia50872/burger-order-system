class OrdersManager {
    constructor(app) {
        this.app = app;
    }

    loadOrders() {
        const phoneNumber = JSON.parse(localStorage.getItem('currentClient'));
        const request = new FXMLHttpRequest();
        request.open('GET', `/orders/${phoneNumber}`);
        setTimeout(() => {
            request.send();
            setTimeout(() => {
                if (request.status === 200) {
                    const orders = typeof request.responseText === 'string' ? JSON.parse(request.responseText) : request.responseText;
                    this.displayOrders(orders);
                } 
                else {
                    console.error('שגיאת רשת בטעינת הזמנות - Status:', request.status || 503);
                    document.getElementById('orders-list').innerHTML = '<p>אין הזמנות קודמות</p>';
                }
            }, 1500);
        }, 100);
    }

    displayOrders(orders) {
        const ordersList = document.getElementById('orders-list');
        if (!orders || orders.length === 0) {
            ordersList.innerHTML = '<p>אין הזמנות קודמות</p>';
            return;
        }
        ordersList.innerHTML = orders.map(order => `
            <div class="order-item">
                <img src="../images/humburgers order.png" alt="הזמנה" class="dish-image">
                <h3>${order.orderName}</h3>
                <p>מחיר: ₪${order.price}</p>
                <button class="reorder-btn" data-order-name="${order.orderName}" data-order-price="${order.price}">הזמן שוב</button>
            </div>
        `).join('');
    }

    reorder(orderName, orderPrice) {
        const price = parseInt(orderPrice) || 50;
        this.app.cart.push({ name: orderName, price: price, quantity: 1 });
        this.app.updateCartCount();
        this.app.showSuccessMessage(`✅ ${orderName} נוסף לעגלה בהצלחה!`);
    }

    checkBirthday(callback) {
        const phoneNumber = JSON.parse(localStorage.getItem('currentClient'));
        const request = new FXMLHttpRequest();
        request.open('GET', `/client/${phoneNumber}/dateOfBirth`);
        setTimeout(() => {
            request.send();
            setTimeout(() => {
                if (request.status === 200) {
                    const birthDate = request.responseText;
                    const today = new Date();
                    const birth = new Date(birthDate);
                    const isBirthday = today.getDate() === birth.getDate() && today.getMonth() === birth.getMonth();
                    callback(isBirthday);
                }
                 else {
                    console.error('שגיאת רשת בבדיקת יום הולדת - Status:', request.status || 503);
                    callback(false);
                }
            }, 1500);
        }, 100);
    }
}