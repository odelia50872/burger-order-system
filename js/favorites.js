class FavoritesManager {
    constructor(app) {
        this.app = app;
    }

    addToFavorites(menuItem) {
        const name = menuItem.dataset.name;
        const price = parseInt(menuItem.dataset.price);
        const image = menuItem.querySelector('.burger-image').src;
        this.app.showLoading();
        const phoneNumber = JSON.parse(localStorage.getItem('currentClient'));
        const request = new FXMLHttpRequest();
        request.open('POST', `/dishes/${phoneNumber}`);
        
        setTimeout(() => {
            request.send({ dishName: name, price: price.toString(), image: image });
            setTimeout(() => {
                this.app.hideLoading();
                if (request.status === 200) {
                    this.app.showSuccessMessage(`♥ ${name} נוסף למנות המועדפות בהצלחה!`);
                    this.updateHeartInMenu(name, true);
                    setTimeout(() => this.loadFavorites(), 100);
                }
                 else if (request.status === 404 && request.responseText === 'Dish Already Exist') {
                    this.app.showSuccessMessage(`ℹ️ ${name} כבר נמצא במנות המועדפות שלך`);
                } 
                else {
                    console.error('שגיאת רשת בהוספה למועדפים - Status:', request.status || 503);
                    this.app.showSuccessMessage('❌ שגיאה בהוספה למועדפים');
                }
            }, 1500);
        }, 100);
    }

    loadFavorites() {
        const phoneNumber = JSON.parse(localStorage.getItem('currentClient'));
        const request = new FXMLHttpRequest();
        request.open('GET', `/dishes/${phoneNumber}`);
        setTimeout(() => {
            request.send();
            setTimeout(() => {
                if (request.status === 200) {
                    const favorites = typeof request.responseText === 'string' ? JSON.parse(request.responseText) : request.responseText;
                    this.displayFavorites(favorites);
                } 
                else {
                    console.error('שגיאת רשת בטעינת מועדפים - Status:', request.status || 503);
                    document.getElementById('favorites-list').innerHTML = '<p>אין מנות מועדפות</p>';
                }
            }, 1500);
        }, 100);
    }

    displayFavorites(favorites) {
        const favoritesList = document.getElementById('favorites-list');
        if (!favorites || favorites.length === 0) {
            favoritesList.innerHTML = '<p>אין מנות מועדפות</p>';
            return;
        }
        favoritesList.innerHTML = favorites.map(dish => `
            <div class="favorite-item" data-name="${dish.dishName}" data-price="${dish.price}">
                <img src="${dish.image || '../images/classic burger.jpeg'}" alt="${dish.dishName}" class="dish-image">
                <h3>${dish.dishName}</h3>
                <p>מחיר: ₪${dish.price}</p>
                <div class="item-actions">
                    <button class="add-to-cart">🛒 הוסף לעגלה</button>
                    <img src="../images/garbage icon.png" alt="הסר ממועדפים" class="remove-favorite-icon" data-dish-name="${dish.dishName}" title="הסר ממועדפים">
                </div>
            </div>
        `).join('');
    }

    removeFavorite(dishName) {
        this.app.showLoading();
        const phoneNumber = JSON.parse(localStorage.getItem('currentClient'));
        const request = new FXMLHttpRequest();
        request.open('DELETE', `/dishes/${phoneNumber}/${dishName}`);
        setTimeout(() => {
            request.send();
            setTimeout(() => {
                this.app.hideLoading();
                if (request.status === 200) {
                    this.app.showSuccessMessage(`✅ ${dishName} הוסר ממועדפים בהצלחה!`);
                    this.loadFavorites();
                    this.updateHeartInMenu(dishName, false);
                } 
                else {
                    console.error('שגיאת רשת בהסרה ממועדפים - Status:', request.status || 503);
                    this.app.showMessage('שגיאה בהסרה ממועדפים', 'error');
                }
            }, 1500);
        }, 100);
    }

    updateHeartInMenu(dishName, isFavorite) {
        const menuItems = document.querySelectorAll('.menu-item');
        menuItems.forEach(item => {
            const itemName = item.querySelector('h3');
            if (itemName && itemName.textContent === dishName) {
                const heart = item.querySelector('.favorite-heart');
                if (heart) {
                    if (isFavorite) {
                        heart.classList.add('active');
                    } 
                    else {
                        heart.classList.remove('active');
                    }
                }
            }
        });
    }

    updateMenuFavorites() {
        const phoneNumber = JSON.parse(localStorage.getItem('currentClient'));
        const request = new FXMLHttpRequest();
        request.open('GET', `/dishes/${phoneNumber}`);
        setTimeout(() => {
            request.send();
            setTimeout(() => {
                if (request.status === 200) {
                    const favorites = typeof request.responseText === 'string' ? JSON.parse(request.responseText) : request.responseText || [];
                    const menuItems = document.querySelectorAll('.menu-item');
                    menuItems.forEach(item => {
                        const itemName = item.querySelector('h3');
                        const heart = item.querySelector('.favorite-heart');
                        if (itemName && heart) {
                            const isFavorite = favorites.some(fav => fav.dishName === itemName.textContent);
                            if (isFavorite) {
                                heart.classList.add('active');
                            } 
                            else {
                                heart.classList.remove('active');
                            }
                        }
                    });
                }
                 else {
                    console.error('שגיאת רשת בעדכון מועדפים בתפריט - Status:', request.status || 503);
                }
            }, 1500);
        }, 100);
    }
}