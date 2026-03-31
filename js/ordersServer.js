class OrdersServer {
    constructor() {
        this.db = new DatabaseOfOrders();
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
                        const lastOrder = this.db.getLastOrders(phoneNumber);
                        if (lastOrder)
                            return { status: 200, data: lastOrder };
                        else
                            return { status: 404, data: "Not Found" };
                    } catch (error) {
                        return { status: 500, data: "Internal Server Error" };
                    }
                }

            case "POST":
                {
                    return this.addNewClientOrAddLastOrder(url, data);
                }
                
            case "DELETE":
                {
                    try {
                        const urlParts = url.split('/');
                        const phoneNumber = urlParts[2];
                        const orderName = urlParts[3];
                        if (this.db.deleteLastOrder(phoneNumber, orderName))
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

    addNewClientOrAddLastOrder(url, data) {

        if (url == "/orders/addNewClient") {
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
                const orderToAdd = data;
                const lastOrderWasAdded = this.db.addLastOrder(phoneNumber,orderToAdd);
                if (lastOrderWasAdded)
                    return { status: 200, data: orderToAdd };
                return { status: 404, data: "Client Not Found" };
            } catch (error) {
                return { status: 500, data: "Internal Server Error" };
            }
        }
    }
}

