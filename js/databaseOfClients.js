class DatabaseOfClients {
    getClientDetails(clientPhoneNumber) {
        try {
            const allClients = localStorage.getItem("clients");
            if (!allClients) return null;
            
            const allClientsResult = JSON.parse(allClients);
            const currentClient = allClientsResult.find(item => item.phoneNumber == clientPhoneNumber);
            return currentClient;
        } catch (error) {
            throw new Error(`Failed to get client details: ${error.message}`);
        }
    }

    addClient(clientToAdd) {
        try {
            const allClients = localStorage.getItem("clients");
            const allClientsResult = JSON.parse(allClients || '[]');
            allClientsResult.push(clientToAdd);
            localStorage.setItem("clients", JSON.stringify(allClientsResult));
        } catch (error) {
            throw new Error(`Failed to add client: ${error.message}`);
        }
    }

    updateClientDetails(phoneNumber,clientDetails) {
        try {
            const allClients = localStorage.getItem("clients");
            if (!allClients) throw new Error("No clients data");
            
            const allClientsResult = JSON.parse(allClients);
            const clientIndex = allClientsResult.findIndex(item => item.phoneNumber == phoneNumber);
            if (clientIndex === -1) throw new Error("Client not found");
            
            allClientsResult[clientIndex] = clientDetails;
            localStorage.setItem("clients", JSON.stringify(allClientsResult));
        } catch (error) {
            throw new Error(`Failed to set client details: ${error.message}`);
        }
    }
}