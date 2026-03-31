class DatabaseOfOrders {
    getLastOrders(phoneNumber) {
        try {
            const allClients = localStorage.getItem("clientsLastOrders");
            if (!allClients) return [];
            
            const allClientsResult = JSON.parse(allClients);
            const currentClient = allClientsResult.find(item => item.phoneNumber == phoneNumber);
            if (currentClient) {
                return currentClient.lastOrders || [];
            }
            return [];
        } catch (error) {
            return [];
        }
    }

    deleteLastOrder(phoneNumber,orderToDelete) {
        try {
            const allClients = localStorage.getItem("clientsLastOrders");
            if (!allClients) throw new Error("No clients data");
            
            const allClientsResult = JSON.parse(allClients);
            let operationCompleted = false;
            
            allClientsResult.forEach(item => {
                if (item.phoneNumber == phoneNumber) {
                    const lastOrders = item.lastOrders;
                    const indexOfOrder = lastOrders.findIndex(order => order.orderName == orderToDelete);
                    if (indexOfOrder != -1) {
                        lastOrders.splice(indexOfOrder, 1);
                        item.lastOrders = lastOrders;
                        operationCompleted = true;
                    }
                    localStorage.setItem("clientsLastOrders", JSON.stringify(allClientsResult));
                }
            });
            return operationCompleted;
        } catch (error) {
            throw new Error(`Failed to delete last order: ${error.message}`);
        }
    }

    addLastOrder(phoneNumber,orderToAdd) {
        try {
            const allClients = localStorage.getItem("clientsLastOrders");
            if (!allClients) throw new Error("No clients data");
            
            const allClientsResult = JSON.parse(allClients);
            let operationCompleted = false;
            
            allClientsResult.forEach(item => {
                if (item.phoneNumber == phoneNumber) {
                    const lastOrders = item.lastOrders;
                    lastOrders.unshift(orderToAdd);
                    item.lastOrders = lastOrders;
                    localStorage.setItem("clientsLastOrders", JSON.stringify(allClientsResult));
                    operationCompleted = true;
                }
            });
            return operationCompleted;
        } catch (error) {
            throw new Error(`Failed to add last order: ${error.message}`);
        }
    }

    addNewClient(phoneNumber) {
        try {
            const allClients = JSON.parse(localStorage.getItem("clientsLastOrders") || '[]');
            allClients.push({ phoneNumber: phoneNumber, lastOrders: [] });
            localStorage.setItem("clientsLastOrders", JSON.stringify(allClients));
        } catch (error) {
            throw new Error(`Failed to add new client: ${error.message}`);
        }
    }
}