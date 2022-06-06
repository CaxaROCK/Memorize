import React, { useState } from "react";
import {
    Avatar,
    Button,
    Paper,
    Grid,
    Typography,
    Container,
} from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import useStyles from "./style";

import Input from "./Input";
import Icon from "./icon";

import { useHistory } from "react-router-dom";

import { useDispatch } from "react-redux";
import { signin, signup } from "../../actions/auth";
import { signInWithGoogle } from "../../Firebase/firebase";

const initialState = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
};

function Auth() {
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();

    const [isSignup, setIsSignup] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState(initialState);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isSignup) {
            dispatch(signup(formData, history));
        } else {
            // console.log(formData, history);
            dispatch(signin(formData, history));
        }
    };

    const handleChange = (e) => {
        // const key = e.target.name;
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleShowPassword = () => setShowPassword(!showPassword);

    const switchMode = () => {
        setIsSignup(!isSignup);
        setShowPassword(false);
    };

    const login = () => {
        signInWithGoogle()
            .then((res) => {
                // console.log(res);

                const user = res?.user.providerData[0];
                const token = res?._tokenResponse.idToken;

                console.log(user);

                try {
                    dispatch({ type: "AUTH", data: { user, token } });
                    history.push("/");
                } catch (error) {
                    console.log(error);
                }
            })
            .catch((error) => console.log(error));
    };

    return (
        <Container component="main" maxWidth="xs">
            <Paper className={classes.paper} elevation={3}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography variant="h5">
                    {isSignup ? "Sign up" : "Sign in"}
                </Typography>
                <form className={classes.form} onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        {isSignup && (
                            <>
                                <Input
                                    name="firstName"
                                    label="First Name"
                                    handleChange={handleChange}
                                    autoFocus
                                    half
                                />
                                <Input
                                    name="lastName"
                                    label="Last Name"
                                    handleChange={handleChange}
                                    half
                                />
                            </>
                        )}
                        <Input
                            name="email"
                            label="Email Adress"
                            handleChange={handleChange}
                            type="email"
                        />
                        <Input
                            name="password"
                            label="Password"
                            handleChange={handleChange}
                            type={showPassword ? "text" : "password"}
                            handleShowPassword={handleShowPassword}
                        />
                        {isSignup && (
                            <Input
                                name="confirmPassword"
                                label="Repeat Password"
                                handleChange={handleChange}
                                type="password"
                            />
                        )}
                    </Grid>

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        {isSignup ? "Sign up" : "Sign in"}
                    </Button>

                    <Button
                        className={classes.googleButton}
                        color="primary"
                        fullWidth
                        startIcon={<Icon />}
                        variant="contained"
                        onClick={login}
                    >
                        Google Sign In
                    </Button>

                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Button onClick={switchMode}>
                                {isSignup
                                    ? "already have an account? sign in"
                                    : "dont have an account? sign up"}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    );
}

export default Auth;
