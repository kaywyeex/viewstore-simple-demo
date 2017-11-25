import React from "react";
import IconButton from "material-ui/IconButton";
import IconMenu from "material-ui/IconMenu";
import MenuItem from "material-ui/MenuItem";
import MoreVertIcon from "material-ui/svg-icons/navigation/more-vert";

export const Logged = props => (
    <IconMenu
        {...props}
        iconButtonElement={
            <IconButton>
                <MoreVertIcon color="white" />
            </IconButton>
        }
        targetOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "top" }}
    >
        <MenuItem
            primaryText="Sign Out"
            onClick={() => props.store.performLogout()}
        />
    </IconMenu>
);
Logged.muiName = "IconMenu";
