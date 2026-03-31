class FXMLHttpRequest {
    constructor() {
        this.typeRequest;
        this.url;
        this.status = 0;
        this.readyState = 0;
        this.responseText = null;
        this.onreadystatechange = null;
        this.onload = null;
        this.network = new Network();
    }
    open(myTypeRequest, myUrl) {
        this.typeRequest = myTypeRequest;
        this.url = myUrl;
        this.readyState = 1;
        if (this.onreadystatechange) {
            this.onreadystatechange();
        }
    }
    send(data = null) {
        try {
            const request = { type: this.typeRequest, url: this.url, data: data };
            const response = this.network.sendRequest(request);

            this.readyState = 2;
            if (this.onreadystatechange) {
                this.onreadystatechange();
            }

            this.readyState = 3;
            if (this.onreadystatechange) {
                this.onreadystatechange();
            }

            this.status = response.status;
            this.responseText = response.data;
            this.readyState = 4;
            
            if (response.status === 503) {
                NetworkNotifications.showNetworkError();
            }
            
            if (this.onreadystatechange) {
                this.onreadystatechange();
            }
        } catch (error) {
            this.status = 500;
            this.responseText = "Internal Server Error";
            this.readyState = 4;
            if (this.onreadystatechange) {
                this.onreadystatechange();
            }
        }
    }

};