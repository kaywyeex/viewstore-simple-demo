import React from "react";
import { observer } from "mobx-react";

import { List, ListItem } from "material-ui/List";
import Paper from "material-ui/Paper";

export const ShipList = observer(({ view, store }) => {
    switch (view.ships.state) {
        case "pending":
            return <h5>Loading Ships...</h5>;
        case "rejected":
            return <h5>Loading Failed...</h5>;
        case "fulfilled":
            return (
                <Paper
                    zDepth={2}
                    style={{ width: "30%", margin: "7% auto 0 auto" }}
                >
                    <List>
                        {view.ships.value.map(ship => {
                            return (
                                <ListItem
                                    style={{ textAlign: "center" }}
                                    primaryText={ship.name}
                                    key={ship.id}
                                    onClick={() => store.showShip(ship.id)}
                                />
                            );
                        })}
                    </List>
                </Paper>
            );
        default:
            return <h5>Loading Ships...</h5>;
    }
});
