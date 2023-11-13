import { Container, Card, CardContent, IconButton, CardActions, Button } from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";
import { BACKEND_API_URL } from "../../constants";
import {useEffect, useContext} from "react";
import AuthContext from "../../context/AuthProvider";

export const AccountPasswordDelete = () => {
    // @ts-ignore
    const { user, roles } = useContext(AuthContext);
    const { passwId } = useParams();
    const navigate = useNavigate();
    const { userId } = useParams();

    useEffect(() => {
        if (user == null){
            navigate("/login");
        }
        if (roles.includes("user") && userId != user.id){
            navigate("/unauthorized");
        }
    })

    const handleDelete = async (event: { preventDefault: () => void }) => {
        event.preventDefault();
        await axios.delete(`${BACKEND_API_URL}/account/${passwId}`);
        navigate("/account");
    };

    const handleCancel = (event: { preventDefault: () => void }) => {
        event.preventDefault();
        navigate("/account");
    };

    return (
        <Container>
            <Card>
                <CardContent>
                    <IconButton component={Link} sx={{ mr: 3 }} to={`/account`}>
                        <ArrowBackIcon />
                    </IconButton>{" "}
                    Are you sure you want to delete this password? This cannot be undone!
                </CardContent>
                <CardActions>
                    <Button onClick={handleDelete}>Delete it</Button>
                    <Button onClick={handleCancel}>Cancel</Button>
                </CardActions>
            </Card>
        </Container>
    );
};