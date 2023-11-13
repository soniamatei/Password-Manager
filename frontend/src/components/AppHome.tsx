import { CssBaseline, Container, Typography } from "@mui/material";
import React, {useContext, useEffect} from "react";
import AuthContext from "../context/AuthProvider";
import {useNavigate, useParams} from "react-router-dom";

export const AppHome = () => {
    // @ts-ignore
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user === null){
            navigate("/login");
        }
    })

    return (
        <React.Fragment>
            <CssBaseline />

            <Container maxWidth="xl">
                <Typography variant="h1" component="h1" gutterBottom>
                    Welcome to the app! Use the menu above to navigate.
                </Typography>
            </Container>
        </React.Fragment>
    );
};