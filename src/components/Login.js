import React, { Component } from "react";
import { observable } from "mobx";
import { observer } from "mobx-react";

import Paper from "material-ui/Paper";
import Divider from "material-ui/Divider";
import TextField from "material-ui/TextField";
import RaisedButton from "material-ui/RaisedButton";

@observer
export class Login extends Component {
    @observable username = "";
    @observable password = "";
    @observable message = "Username: guest | Password: guest";

    render() {
        return (
            <div>
                <Paper
                    zDepth={2}
                    style={{ width: "30%", margin: "7% auto 0 auto" }}
                >
                    <TextField
                        hintText="Enter Username"
                        value={this.username}
                        onChange={e => (this.username = e.target.value)}
                        underlineShow={false}
                        style={{ marginLeft: 20 }}
                    />
                    <Divider />
                    <TextField
                        hintText="Enter Password"
                        value={this.password}
                        onChange={e => (this.password = e.target.value)}
                        underlineShow={false}
                        style={{ marginLeft: 20 }}
                    />
                </Paper>
                <h4
                    style={{
                        textAlign: "center",
                        color: "rgba(0, 0, 0, 0.3)",
                        fontWeight: "400"
                    }}
                >
                    {this.message}
                </h4>
                <RaisedButton
                    label="Login"
                    onClick={this.onLogin}
                    style={{
                        width: "30%",
                        display: "block",
                        margin: "0 auto"
                    }}
                />
            </div>
        );
    }

    onLogin = () => {
        this.message = "Processing...";
        this.props.store.performLogin(
            this.username,
            this.password,
            authenticated => {
                if (authenticated) {
                    this.message = "Login successful";
                    this.props.afterLogin();
                } else {
                    this.message = "Login Failed...";
                }
            }
        );
    };
}
