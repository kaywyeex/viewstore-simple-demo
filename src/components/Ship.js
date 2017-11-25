import React from "react";
import { observer } from "mobx-react";

import { Login } from "./Login.js";
import { Card, CardHeader } from "material-ui/Card";

export const Ship = observer(({ view, store }) => {
    if (!store.isAuthenticated)
        return (
            <Login
                store={store}
                afterLogin={() =>
                    view.shipId
                        ? store.showShip(view.shipId)
                        : store.showAllShips()
                }
            />
        );
    switch (view.ship.state) {
        case "pending":
            return <h5>Loading Ship.. {view.shipId}</h5>;
        case "rejected":
            return <div>Loading failed.. {view.ship.reason}</div>;
        case "fulfilled":
            return (
                <Card style={{ width: "30%", margin: "7% auto 0 auto" }}>
                    <CardHeader
                        title={view.ship.value.name}
                        subtitle={`ID: ${view.ship.value.id}`}
                    />
                </Card>
            );
        default:
            return <h5>Loading Ship.. {view.shipId}</h5>;
    }
});
