import { Container, Card, CardContent, IconButton, CardActions, Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {useContext, useEffect} from "react";
import AuthContext from "../../context/AuthProvider";

export const UserLogout = () => {
    // @ts-ignore
    const { user, logoutUser } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user == null){
            navigate("/login");
        }
    })

    const handleCancel = (event: { preventDefault: () => void }) => {
        event.preventDefault();
        // go to courses list
        navigate("/profile");
    };

    return (
        <Container>
            <Card>
                <CardContent>
                    <IconButton component={Link} sx={{ mr: 3 }} to={`/profile`}>
                        <ArrowBackIcon />
                    </IconButton>{" "}
                    Are you sure you want to log out?
                </CardContent>
                <CardActions>
                    <Button onClick={logoutUser}>Log out</Button>
                    <Button onClick={handleCancel}>Cancel</Button>
                </CardActions>
            </Card>
        </Container>
    );
};