import React, { Component } from "react";
import { observer, inject } from "mobx-react";

import AppBar from "material-ui/AppBar";

import { Ship } from "./Ship";
import { ShipList } from "./ShipList";
import { Logged } from "./Logged";

@inject("store")
@observer
export default class App extends Component {
    render() {
        const store = this.props.store;
        return (
            <div>
                <AppBar
                    title="ViewStore Demo"
                    onTitleTouchTap={() => store.showAllShips()}
                    showMenuIconButton={false}
                    iconElementRight={
                        <div>
                            <div className="userInfo">
                                {store.isAuthenticated
                                    ? store.currentUser.name
                                    : "No User"}
                            </div>
                            {store.isAuthenticated ? (
                                <Logged store={store} />
                            ) : (
                                <div
                                    className="userInfo"
                                    onClick={() => store.showShip("")}
                                >
                                    Log In
                                </div>
                            )}
                        </div>
                    }
                />
                {renderCurrentView(store)}
            </div>
        );
    }
}

function renderCurrentView(store) {
    const view = store.currentView;
    switch (view.name) {
        case "allShips":
            return <ShipList view={view} store={store} />;
        case "ship":
            return <Ship view={view} store={store} />;
        default:
            return <ShipList view={view} store={store} />;
    }
}
