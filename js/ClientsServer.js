class ClientsServer {
    constructor() {
        this.db = new DatabaseOfClients();
    }
    processRequest(myRequest) {
        const type = myRequest.type;
        const url = myRequest.url;
        const data = myRequest.data;
        switch (type) {
            case "GET":
                {
                    return this.getDateOfBirthOrName(url);
                }
            case "POST":
                {
                    switch (url) {
                        case "/client/register":
                            try {
                                if (this.db.getClientDetails(data.phoneNumber)) {
                                    return { status: 409, data: "Client already exists" };
                                }
                                this.db.addClient(data);
                                return { status: 200, data: "Success" };
                            }
                            catch (error) {
                                return { status: 500, data: "Internal Server Error" };
                            }
                        case "/client/login":
                            try {
                                const result = this.db.getClientDetails(data.phoneNumber);
                                if (result && result.password == data.password)
                                    return { status: 200, data: result };
                                else
                                    return { status: 401, data: "Unauthorized" };
                            }
                            catch (error) {
                                return { status: 500, data: "Internal Server Error" };
                            }
                    }
                }
            case "PUT": {
                if (url.startsWith("/client/update")) {
                    const phoneNumber = url.substring(url.lastIndexOf("/") + 1);
                    try {
                        this.db.updateClientDetails(phoneNumber, data);
                        return { status: 200, data: "Success" };
                    } catch (error) {
                        return { status: 500, data: "Internal Server Error" };
                    }
                }
            }
            default: {
                return { status: 404, data: "Not Found" };
            }
        }
    }
    getDateOfBirthOrName(url) {
        const urlParts = url.split('/');
        const phoneNumber = urlParts[2];
        const dateOfBirthOrName = urlParts[3];
        try {
            const clientDetails = this.db.getClientDetails(phoneNumber);
            if (clientDetails) {
                if (dateOfBirthOrName === 'dateOfBirth') {
                    return { status: 200, data: clientDetails.dateOfBirth };
                } else if (dateOfBirthOrName === 'name') {
                    return { status: 200, data: clientDetails.firstName };
                } else {
                    return { status: 404, data: "Not Found" };
                }
            }
        }
        catch (error) {
            return { status: 500, data: "Internal Server Error" };
        }
    }
}
