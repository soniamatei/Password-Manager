import {Container, Card, Button, TextField} from "@mui/material";
import {  useNavigate } from "react-router-dom";
import React, {BaseSyntheticEvent, useContext, useEffect, useState} from "react";
import AuthContext from "../../context/AuthProvider";
import {BACKEND_API_URL} from "../../constants";
import axios from "axios";
import {Label} from "@mui/icons-material";

export const ConfirmationCode = () => {
    // @ts-ignore
    const {notifyAll } = useContext(AuthContext);
    const navigate = useNavigate();
    const [code, setCode] = useState()

    useEffect(() => {
    })

    const handleConfirm = (event: { preventDefault: () => void }) => {
        event.preventDefault();
        console.log(code)
        axios.get(`${BACKEND_API_URL}/register/confirm/${code}`)
            .then(() => {
                notifyAll("Account activated.");
                navigate("/login");
            })
            .catch((error) => {
                notifyAll(error.response.data["detail"]);
            });
    };

    return (
        <Container>
            <Card>
                <h4>Activate your account</h4>
                <br/>
                <Container >
                    <form onSubmit={handleConfirm} style={{display: "flex", justifyContent: "left", alignItems: "center", alignContent: "center"}}>
                        <TextField label="Input Code"
                                   variant="outlined"
                            // @ts-ignore
                                   onInputCapture={(event: BaseSyntheticEvent) => {
                                       if (event.target.value) {
                                           setCode(event.target.value)
                                       }}}
                                   required={true}
                        />
                        <Button type="submit" sx={{marginLeft: 3}}>Activate</Button>
                    </form>
                </Container>
            </Card>
        </Container>
    );
};