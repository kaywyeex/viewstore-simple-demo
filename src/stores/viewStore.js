import { observable, computed, action } from "mobx";
import { fromPromise } from "mobx-utils";
import request from "superagent";

const ships_url = "http://localhost:5000/ships";

async function fetch(url) {
    try {
        const res = await request(url);
        return res.body;
    } catch (err) {
        console.error(err);
    }
}

class ViewStore {
    @observable currentView = null;
    @observable currentUser = null;

    @computed
    get isAuthenticated() {
        return !!this.currentUser;
    }

    @computed
    get currentPath() {
        switch (this.currentView.name) {
            case "allShips":
                return "/ship/";
            case "ship":
                return `/ship/${this.currentView.shipId}`;
            default:
                return "/ship/";
        }
    }

    @action
    showAllShips() {
        this.currentView = {
            name: "allShips",
            // fromPromise takes a promise and returns an object with promise specific observables(value, .state & state)
            ships: fromPromise(fetch(`${ships_url}`))
        };
    }

    @action
    showShip(shipId) {
        this.currentView = {
            name: "ship",
            shipId,
            ship: fromPromise(
                this.isAuthenticated
                    ? fetch(`${ships_url}/${shipId}`)
                    : Promise.reject("Auth Required")
            )
        };
    }

    @action
    performLogin(username, password, callback) {
        if (user.password === password) {
            this.currentUser = user;
            callback(true);
        } else {
            console.log("Incorrect Password...");
            callback(false);
        }
    }
    @action
    performLogout() {
        this.currentUser = null;
    }
}

export default ViewStore;

// mock user
const user = {
    name: "guest",
    username: "guest",
    password: "guest"
};
