class Client {
    constructor(firstName, lastName, phoneNumber, password, dateOfBirth) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.phoneNumber = phoneNumber;
        this.password = password;
        this.dateOfBirth = dateOfBirth;
    }

    login() {
        const phoneNumber = this.phoneNumber;
        const request = new FXMLHttpRequest();
        request.open("POST", "/client/login");
        request.onreadystatechange = function () {
            if (request.readyState == 4) {
                if (request.status == 200) {
                    localStorage.setItem('currentClient', JSON.stringify(phoneNumber));
                }
            }
        };
        request.send({ phoneNumber: this.phoneNumber, password: this.password });
    }

    register() {
        const phoneNumber = this.phoneNumber;
        const request = new FXMLHttpRequest();
        request.open("POST", "/client/register");
        request.onreadystatechange = () => {
            if (request.readyState == 4) {
                if (request.status == 200) {
                    localStorage.setItem('currentClient', JSON.stringify(phoneNumber));
                    const ordersRequest = new FXMLHttpRequest();
                    ordersRequest.open("POST", "/orders/addNewClient");
                    ordersRequest.send({ phoneNumber: phoneNumber });
                    const dishesRequest = new FXMLHttpRequest();
                    dishesRequest.open("POST", "/dishes/addNewClient");
                    dishesRequest.send({ phoneNumber: phoneNumber });
                }
            }
        };
        const user = {
            firstName: this.firstName,
            lastName: this.lastName,
            phoneNumber: this.phoneNumber,
            password: this.password,
            dateOfBirth: this.dateOfBirth
        }
        request.send(user);
    }

    update() {
        try {
            if (!this.validDetails()) {
                throw new Error("Invalid details");
            }
            
            const currentClient=localStorage.getItem("currentClient");
            const currentClientPhoneNumber=JSON.parse(currentClient);
            const request = new FXMLHttpRequest();
            request.open("PUT", `/client/update/${currentClientPhoneNumber}`);
            request.onreadystatechange = function () {
                if (request.readyState == 4) {
                    if (request.status == 200) {
                        return true;
                    } else {
                        throw new Error(`Update failed with status: ${request.status}`);
                    }
                }
            };
            const user = {
                firstName: this.firstName,
                lastName: this.lastName,
                phoneNumber: this.phoneNumber,
                password: this.password,
                dateOfBirth: this.dateOfBirth
            }
            request.send(user);
        } catch (error) {
            throw error;
        }
    }

    validDetails() {
        if (this.phoneNumber.length != 10 || !this.phoneNumber.startsWith("05")) {
            return false;
        }
        const passwordIncludesSpecialChar = /[*$#!]/.test(this.password)
        const passwordIncludesNumber = /\d/.test(this.password);
        const passwordIncludesCapitalLetter = /[A-Z]/.test(this.password);
        const passwordIncludesSmallLetter = /[a-z]/.test(this.password);
        const passwordLengthIsOk = this.password.length >= 6;
        if (!(passwordIncludesSpecialChar && passwordIncludesNumber && passwordIncludesCapitalLetter && passwordIncludesSmallLetter && passwordLengthIsOk)) {
            return false;
        }
        return true;
    }
}

