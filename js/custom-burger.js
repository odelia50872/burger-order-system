class CustomBurgerManager {
    constructor(app) {
        this.app = app;
    }

    showCustomBurger() {
        document.getElementById('custom-burger-modal').style.display = 'block';
        this.updateCustomPrice();
    }

    closeCustomBurger() {
        document.getElementById('custom-burger-modal').style.display = 'none';
        this.resetCustomForm();
    }

    updateCustomPrice() {
        let total = 50;
        const bread = document.querySelector('input[name="bread"]:checked');
        if (bread) total += parseInt(bread.dataset.price);
        const meat = document.querySelector('input[name="meat"]:checked');
        if (meat) total += parseInt(meat.dataset.price);
        const sauces = document.querySelectorAll('input[name="sauce"]:checked');
        sauces.forEach(sauce => total += parseInt(sauce.dataset.price));
        const toppings = document.querySelectorAll('input[name="topping"]:checked');
        toppings.forEach(topping => total += parseInt(topping.dataset.price));
        document.getElementById('custom-price').textContent = `₪${total}`;
    }

    addCustomBurger() {
        const bread = document.querySelector('input[name="bread"]:checked').value;
        const meat = document.querySelector('input[name="meat"]:checked').value;
        const sauces = Array.from(document.querySelectorAll('input[name="sauce"]:checked')).map(s => s.value);
        const toppings = Array.from(document.querySelectorAll('input[name="topping"]:checked')).map(t => t.value);
        const price = parseInt(document.getElementById('custom-price').textContent.replace('₪', ''));
        const burgerName = `בורגר מותאם - קציצת בשר ${meat} על לחמנית  ${bread}`;
        this.app.cart.push({ name: burgerName, price: price, quantity: 1 });
        this.app.updateCartCount();
        this.closeCustomBurger();
        this.app.showSuccessMessage(`✅ ${burgerName} נוסף לעגלה!`);
    }

    resetCustomForm() {
        document.querySelectorAll('input[name="bread"]')[0].checked = true;
        document.querySelectorAll('input[name="meat"]')[0].checked = true;
        document.querySelectorAll('input[name="sauce"]').forEach(input => input.checked = false);
        document.querySelectorAll('input[name="topping"]').forEach(input => input.checked = false);
        this.updateCustomPrice();
    }
}