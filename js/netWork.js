class Network {
    static instance = null;
    constructor() {
        if (Network.instance) {
            return Network.instance;
        }
        this.networkFailure = false;
        this.dishServer = new DishesServer();
        this.orderServer = new OrdersServer();
        this.clientsServer = new ClientsServer();
        Network.instance = this;
    }

    sendRequest(myRequest) {
        const networkDelay = Math.floor(Math.random() * 500 + 500);
        const startTime = Date.now();
        while (Date.now() - startTime < networkDelay) {}
        if (this.failureRates(0)) {
            try {
                if (myRequest.url.startsWith("/dishes")) {
                    return this.dishServer.processRequest(myRequest);
                }
                else if (myRequest.url.startsWith("/orders")) {
                    return this.orderServer.processRequest(myRequest);
                }
                else if (myRequest.url.startsWith("/client")) {
                    return this.clientsServer.processRequest(myRequest);
                }
                return { status: 404, data: "Not Found" };
            }
            catch (error) {
                return { status: 500, data: "Internal Server Error" };
            }
        }
        else
            return { status: 503, data: "Service Unavailable" };
    }

    failureRates(percentage) {
        const networkFailur = Math.floor(Math.random() * 10);
        return networkFailur >= percentage * 10;
    }
}