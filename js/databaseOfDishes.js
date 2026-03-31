class DatabaseOfDishes {
    getFavoriteDishes(phoneNumber) {
        try {
            const allClients = localStorage.getItem("clientsFavoriteDishes");
            if (!allClients) return [];
            
            const allClientsResult = JSON.parse(allClients);
            const currentClient = allClientsResult.find(item => item.phoneNumber == phoneNumber);
            if (currentClient) {
                return currentClient.favoriteDishes || [];
            }
            return [];
        } catch (error) {
            return [];
        }
    }

    deleteFavoriteDish(phoneNumber, dishToDelete) {
        try {
            const allClients = localStorage.getItem("clientsFavoriteDishes");
            if (!allClients) throw new Error("No clients data");
            
            const allClientsResult = JSON.parse(allClients);
            let operationCompleted = false;
            
            allClientsResult.forEach(item => {
                if (item.phoneNumber == phoneNumber) {
                    const favoriteDishes = item.favoriteDishes;
                    const index0fDish = favoriteDishes.findIndex(dish => dish.dishName == dishToDelete);
                    if (index0fDish != -1) {
                        favoriteDishes.splice(index0fDish, 1);
                        item.favoriteDishes = favoriteDishes;
                        operationCompleted = true;
                    }
                    localStorage.setItem("clientsFavoriteDishes", JSON.stringify(allClientsResult));
                }
            });
            return operationCompleted;
        } catch (error) {
            throw new Error(`Failed to delete favorite dish: ${error.message}`);
        }
    }

    addFavoriteDish(phoneNumber,dishToAdd) {
        try {
            const allClients = localStorage.getItem("clientsFavoriteDishes");
            if (!allClients) throw new Error("No clients data");
            
            const allClientsResult = JSON.parse(allClients);
            let operationCompleted = false;
            
            allClientsResult.forEach(item => {
                if (item.phoneNumber == phoneNumber) {
                    const favoriteDishes = item.favoriteDishes;
                    favoriteDishes.unshift(dishToAdd);
                    item.favoriteDishes = favoriteDishes;
                    localStorage.setItem("clientsFavoriteDishes", JSON.stringify(allClientsResult));
                    operationCompleted = true;
                }
            });
            return operationCompleted;
        } catch (error) {
            throw new Error(`Failed to add favorite dish: ${error.message}`);
        }
    }

    addNewClient(phoneNumber) {
        try {
            const allClients = JSON.parse(localStorage.getItem("clientsFavoriteDishes") || '[]');
            allClients.push({ phoneNumber: phoneNumber, favoriteDishes: [] });
            localStorage.setItem("clientsFavoriteDishes", JSON.stringify(allClients));
        } catch (error) {
            throw new Error(`Failed to add new client: ${error.message}`);
        }
    }
}