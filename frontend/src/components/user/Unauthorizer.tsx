import {Link, useNavigate, useParams} from "react-router-dom"
import {Button, Card, CardActions, CardContent, Container, IconButton} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// @ts-ignore
export const Unauthorized = () => {
    const navigate = useNavigate();

    const goBack = () => navigate("/home");

    return (
        <Container>
            <Card>
                <CardContent>
                    <IconButton onClick={goBack}>
                        <ArrowBackIcon />
                    </IconButton>{" "}
                    <h1>Unauthorized</h1>
                    <br/>
                    You don't have permission for this page.
                </CardContent>

            </Card>
        </Container>
    )
}

export default Unauthorized