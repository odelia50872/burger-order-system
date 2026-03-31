class DishesServer {
    constructor() {
        this.db = new DatabaseOfDishes();
    }
    processRequest(myRequest) {
        const type = myRequest.type;
        const url = myRequest.url;
        const data = myRequest.data;
        switch (type) {
            case "GET":
                {
                    try {
                        const phoneNumber = url.substring(url.lastIndexOf("/") + 1);
                        const dish = this.db.getFavoriteDishes(phoneNumber);
                        if (dish === null) {
                            return { status: 404, data: "Not Found" };
                        }
                        return { status: 200, data: dish };
                    }
                    catch (error) {
                        return { status: 500, data: "Internal Server Error" };
                    }
                }

            case "POST":
                {
                    return this.addNewclientOrAddFavoriteDish(url, data);
                }
            case "DELETE":
                {
                    try {
                        const urlParts = url.split('/');
                        const phoneNumber = urlParts[2];
                        const dishName = urlParts[3];
                        const favoriteDishWasDeleted = this.db.deleteFavoriteDish(phoneNumber, dishName);
                        if (favoriteDishWasDeleted)
                            return { status: 200, data: "OK" };
                        return { status: 404, data: "Not Found" };
                    } catch (error) {
                        return { status: 500, data: "Internal Server Error" };
                    }
                }
            default:
                return null;
        }
    }

    addNewclientOrAddFavoriteDish(url, data) {
        if (url == "/dishes/addNewClient") {
            try {
                this.db.addNewClient(data.phoneNumber);
                return { status: 200, data: "success" };
            } catch (error) {
                return { status: 500, data: "Internal Server Error" };
            }
        }
        else {
            try {
                const phoneNumber = url.substring(url.lastIndexOf("/") + 1);
                const dishToAdd = data;
                const favoriteDishes=this.db.getFavoriteDishes(phoneNumber);
                const dishExistAlready=favoriteDishes.find(dish => dish.dishName === dishToAdd.dishName);
                if(dishExistAlready)
                {
                    return { status: 404, data: "Dish Already Exist" };
                }
                const favoriteDishWasAdded = this.db.addFavoriteDish(phoneNumber,dishToAdd);
                if (favoriteDishWasAdded)
                    return { status: 200, data: dishToAdd };
                return { status: 404, data: "Client Not Found" };
            } catch (error) {
                return { status: 500, data: "Internal Server Error" };
            }
        }
    }
}
