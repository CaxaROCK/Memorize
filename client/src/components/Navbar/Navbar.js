import React, { useEffect, useState } from "react";
import { AppBar, Avatar, Button, Toolbar, Typography } from "@material-ui/core";
// import memoriesLogo from "../../img/memories-Logo.png";
import memoriesLogo from "../../img/memory-logo.png";
// import memoriesText from "../../img/memories-Text.png";
import useStyles from "./style";
import { Link, useHistory, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import decode from "jwt-decode";

function Navbar() {
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();
    const location = useLocation();

    const [user, setUser] = useState(
        JSON.parse(localStorage.getItem("profile"))
    );

    useEffect(() => {
        const token = user?.token;

        if (token) {
            const decodedToken = decode(token);

            if (decodedToken.exp * 10000 < new Date().getTime()) {
                logout();
                alert(
                    `You've been logedout due to token expiery, please login once again`
                );
            }
        }

        setUser(JSON.parse(localStorage.getItem("profile")));
    }, [location]);

    const logout = () => {
        dispatch({ type: "LOGOUT" });
        history.push("/");

        setUser(null);
    };

    return (
        <AppBar className={classes.appBar} position="static" color="inherit">
            <Link
                className={classes.brandContainer}
                style={{
                    textDecoration: "none",
                    color: "#36454F",
                    fontSize: "3rem",
                    fontWeight: "700",
                }}
                to="/"
            >
                {/* <img
                    className={classes.image}
                    src={memoriesText}
                    alt="icon"
                    height="45"
                />
                <img
                    className={classes.image}
                    src={memoriesLogo}
                    alt="icon"
                    height="40"
                /> */}
                Memorized
                <img
                    className={classes.image}
                    src={memoriesLogo}
                    alt="icon"
                    height="60"
                />
            </Link>
            <Toolbar className={classes.toolbar}>
                {user ? (
                    <div className={classes.profile}>
                        <Avatar
                            className={classes.purple}
                            alt={
                                user.user.displayName
                                    ? user.user.displayName
                                    : user.user.name
                            }
                            src={user.user?.photoURL}
                        >
                            {user.user.displayName
                                ? user.user.displayName.charAt(0)
                                : user.user.name.charAt(0)}
                        </Avatar>
                        <Typography className={classes.userName} variant="h6">
                            {user.user.displayName
                                ? user.user.displayName
                                : user.user.name}
                        </Typography>
                        <Button
                            variant="contained"
                            // classes={classes.logout}
                            color="secondary"
                            onClick={logout}
                        >
                            Logout
                        </Button>
                    </div>
                ) : (
                    <Button
                        component={Link}
                        to="/auth"
                        variant="contained"
                        color="primary"
                    >
                        Login
                    </Button>
                )}
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;
