import React from "react";
import { Container } from "@material-ui/core";
import Navbar from "./components/Navbar/Navbar";
import Home from "./components/Home/Home";
import Auth from "./components/Auth/Auth";

import { Switch, Route, Redirect } from "react-router-dom";

import { GoogleOAuthProvider } from "@react-oauth/google";
import PostDetails from "./components/Posts/PostDetails/PostDetails";

function App() {
    const user = JSON.parse(localStorage.getItem("profile"));
    return (
        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
            <Container maxWidth="xl">
                <Navbar />
                <Switch>
                    <Route
                        exact
                        path="/"
                        component={() => <Redirect to={`/posts`} />}
                    />
                    <Route exact path="/posts" component={Home} />
                    <Route exact path="/posts/search" component={Home} />
                    <Route exact path="/posts/:id" component={PostDetails} />
                    <Route
                        exact
                        path="/auth"
                        component={() =>
                            !user ? <Auth /> : <Redirect to={`/posts`} />
                        }
                    />
                </Switch>
            </Container>
        </GoogleOAuthProvider>
    );
}

export default App;
