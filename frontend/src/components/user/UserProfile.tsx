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

export const UserProfile = () => {
    // @ts-ignore
    const { user, axiosBearer} = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [userDetail, setUserDetail] = useState<User>();

    useEffect(() => {
        if (user == null)
            navigate("/login");
        console.log(user, axiosBearer);
        if (axiosBearer) {
            setLoading(true);
            axios.get(`${BACKEND_API_URL}/user/${user.id}`)
                .then((response) => {
                    setUserDetail(response.data);
                    setLoading(false);
                })
        }
    }, [axiosBearer]);

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
                        <h1>Profile</h1>
                        <h1>{userDetail?.is_staff}</h1>
                        <ul>
                            <li>Created: {userDetail?.created_at}</li>
                            <li>Modified: {userDetail?.last_modified}</li>
                            <li>Username: {userDetail?.username}</li>
                            <li>Email: {userDetail?.email}</li>
                            <li>No. account passwords: {userDetail?.nb_acc}</li>
                            <li>No. classic passwords: {userDetail?.nb_cls}</li>
                            <li>No. vault: {userDetail?.nb_vls}</li>
                            <li>No. tags: {userDetail?.nb_tgs}</li>
                            <li>Bio: {userDetail?.profile.bio}</li>
                            <li>Gender: {userDetail?.profile.gender}</li>
                            <li>Marital_status: {userDetail?.profile.marital_status}</li>
                            <li>Birthday: {userDetail?.profile.birthday}</li>
                            <li>Instagram: {userDetail?.profile.instagram}</li>
                            <li>Pages per Page: {userDetail?.per_page}</li>
                        </ul>
                        <br/>
                    </CardContent>
                    <CardActions>
                        <IconButton component={Link} sx={{ mr: 3 }} to={`/profile/edit`}>
                            <EditIcon />
                        </IconButton>

                        <IconButton component={Link} sx={{ mr: 3 }} to={`/logout`}>
                            <Logout sx={{ color: "red" }} />
                        </IconButton>
                    </CardActions>
                </Card>)}
        </Container>
    );
};