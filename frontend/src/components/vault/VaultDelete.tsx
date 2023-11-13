import { Container, Card, CardContent, IconButton, CardActions, Button } from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";
import { BACKEND_API_URL } from "../../constants";
import {useContext, useEffect} from "react";
import AuthContext from "../../context/AuthProvider";

export const VaultDelete = () => {
    // @ts-ignore
    const { user, roles } = useContext(AuthContext);
    const { vaultId } = useParams();
    const { userId } = useParams();
    const navigate = useNavigate();

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
        await axios.delete(`${BACKEND_API_URL}/vault/${vaultId}`);
        // go to courses list
        navigate("/vault");
    };

    const handleCancel = (event: { preventDefault: () => void }) => {
        event.preventDefault();
        // go to courses list
        navigate("/vault");
    };

    return (
        <Container>
            <Card>
                <CardContent>
                    <IconButton component={Link} sx={{ mr: 3 }} to={`/vault`}>
                        <ArrowBackIcon />
                    </IconButton>{" "}
                    Are you sure you want to delete this vault? This cannot be undone!
                </CardContent>
                <CardActions>
                    <Button onClick={handleDelete}>Delete it</Button>
                    <Button onClick={handleCancel}>Cancel</Button>
                </CardActions>
            </Card>
        </Container>
    );
};