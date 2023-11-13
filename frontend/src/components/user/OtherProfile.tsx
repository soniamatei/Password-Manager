import {Box, Card, CardActions, CardContent, CircularProgress, IconButton, List, ListItem} from "@mui/material";
import { Container } from "@mui/system";
import {useContext, useEffect, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import { BACKEND_API_URL } from "../../constants";
import { Vault } from "../../models/Vault";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AuthContext from "../../context/AuthProvider";
import axios from "axios";
import {User} from "../../models/User";
import {Logout} from "@mui/icons-material";

export const OtherProfile = () => {
    // @ts-ignore
    const { user, axiosBearer} = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const { userId } = useParams();
    
    const [otherUser, setOtherUser] = useState<User>()

    useEffect(() => {
        if (user == null)
            navigate("/login");

        if (axiosBearer) {
            setLoading(true);
            axios.get(`${BACKEND_API_URL}/user/${userId}`)
                .then((response) => {
                    setOtherUser(response.data);
                    setLoading(false);
                })
        }
    }, [axiosBearer, userId]);

    return (
        <Container>
            {loading && (
                <Box>
                    <CircularProgress sx={{mt: 3}}/>
                </Box>
            )}
            {!loading &&(
                <Card>
                    <CardContent>
                        <h1>Profile {otherUser?.username}</h1>
                        <ul>
                            <li>Email: {otherUser?.email}</li>
                            <li>No. account passwords: {otherUser?.nb_acc}</li>
                            <li>No. classic passwords: {otherUser?.nb_cls}</li>
                            <li>No. vault: {otherUser?.nb_vls}</li>
                            <li>No. tags: {otherUser?.nb_tgs}</li>
                            <li>Bio: {otherUser?.profile.bio}</li>
                            <li>Gender: {otherUser?.profile.gender}</li>
                            <li>Marital_status: {otherUser?.profile.marital_status}</li>
                            <li>Birthday: {otherUser?.profile.birthday}</li>
                            <li>Instagram: {otherUser?.profile.instagram}</li>
                        </ul>
                        <br/>
                    </CardContent>
                </Card>)}
        </Container>
    );
};