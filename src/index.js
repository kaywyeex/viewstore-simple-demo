import React from "react";
import { render } from "react-dom";

import { startRouter } from "./stores/router";
import { Provider } from "mobx-react";

import lightBaseTheme from "material-ui/styles/baseThemes/lightBaseTheme";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import getMuiTheme from "material-ui/styles/getMuiTheme";

import ViewStore from "./stores/viewStore";
import App from "./components/App";
import "./styles/index.css";

const viewStore = new ViewStore();
startRouter(viewStore);

render(
    <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
        <Provider store={viewStore}>
            <App />
        </Provider>
    </MuiThemeProvider>,
    document.getElementById("root")
);
