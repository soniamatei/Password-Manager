import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent, CircularProgress,
    IconButton,
    TextField,
} from "@mui/material";
import { Container } from "@mui/system";
import {useCallback, useContext, useEffect, useState} from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BACKEND_API_URL } from "../../constants";
import { Vault } from "../../models/Vault";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthContext from "../../context/AuthProvider";
import {User} from "../../models/User";
import {Profile} from "../../models/Profile";
export const UserEdit = () => {
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    // @ts-ignore
    const { user, authTokens, axiosBearer } = useContext(AuthContext);

    const [userDetail, setUserDetail] = useState<User>({
        id: 0,
        created_at: "",
        last_modified: "",
        username: "",
        password: "",
        email: "",
        is_staff: 0,
        is_active: 1,
        nb_acc: 0,
        nb_cls: 0,
        nb_vls: 0,
        nb_tgs: 0,
        // @ts-ignore
        profile: 0,
        per_page: "",
    });

    function notify(message: string) { toast(`🦄 ${message}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
    });} []

    const updateUser= async (event: { preventDefault: () => void }) => {
        event.preventDefault();
        axios.patch(`${BACKEND_API_URL}/user/${user.id}`, userDetail)
            .then(() => navigate("/profile"))
            .catch((response) => {
                for (const msg1 in response.response.data) {
                    if (msg1 == "profile") {
                        for (const msg2 in response.response.data[msg1]){
                            const value = response.response.data[msg1][msg2];
                            notify(msg2 + ": " + value);
                        }
                    }
                    else {
                        const value = response.response.data[msg1];
                        notify(msg1 + ": " + value)
                    }
                }
            })
    };

    useEffect(() => {
        if (user == null)
            navigate("/login");

        if (axiosBearer) {
            setLoading(true);
            axios.get(`${BACKEND_API_URL}/user/${user.id}`)
                .then((response) => {
                    setUserDetail(response.data);
                    setLoading(false);
                })
        }
    }, [authTokens, user, axiosBearer]);

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
                        <IconButton component={Link} sx={{ mr: 3 }} to={`/profile`}>
                            <ArrowBackIcon />
                        </IconButton>{" "}
                        <form onSubmit={updateUser}>
                            <TextField
                                id="username"
                                label="Username"
                                variant="outlined"
                                fullWidth
                                sx={{ mb: 2 }}
                                onChange={(event) => setUserDetail({ ...userDetail, username: event.target.value })}
                                defaultValue={userDetail?.username}
                                required={true}
                            />
                            <TextField
                                type={"password"}
                                id="password"
                                label="Password"
                                variant="outlined"
                                fullWidth
                                sx={{ mb: 2 }}
                                onChange={(event) => setUserDetail({ ...userDetail, password: event.target.value })}
                                defaultValue={userDetail?.password}
                            />
                            <TextField
                                id="email"
                                label="Email"
                                variant="outlined"
                                fullWidth
                                sx={{ mb: 2 }}
                                onChange={(event) => setUserDetail({ ...userDetail, email: event.target.value })}
                                defaultValue={userDetail?.email}
                                required={true}
                            />
                            <TextField
                                id="bio"
                                label="Bio"
                                variant="outlined"
                                fullWidth
                                sx={{ mb: 2 }}
                                onChange={(event) => setUserDetail({ ...userDetail, profile: {...userDetail.profile, bio: event.target.value }})}
                                defaultValue={userDetail?.profile.bio}
                            />
                            <TextField
                                id="gender"
                                label="Gender"
                                variant="outlined"
                                fullWidth
                                sx={{ mb: 2 }}
                                onChange={(event) => setUserDetail({ ...userDetail, profile: {...userDetail.profile, gender: event.target.value }})}
                                defaultValue={userDetail?.profile.gender}
                            />
                            <TextField
                                id="marital_status"
                                label="Marital status"
                                variant="outlined"
                                fullWidth
                                sx={{ mb: 2 }}
                                onChange={(event) => setUserDetail({ ...userDetail, profile: {...userDetail.profile, marital_status: event.target.value }})}
                                defaultValue={userDetail?.profile.marital_status}
                            />
                            <TextField
                                id="birthday"
                                label="Birthday"
                                variant="outlined"
                                fullWidth
                                sx={{ mb: 2 }}
                                onChange={(event) => setUserDetail({ ...userDetail, profile: {...userDetail.profile, birthday: event.target.value }})}
                                defaultValue={userDetail?.profile.birthday}
                            />
                            <TextField
                                id="instagram"
                                label="Instagram"
                                variant="outlined"
                                fullWidth
                                sx={{ mb: 2 }}
                                onChange={(event) => setUserDetail({ ...userDetail, profile: {...userDetail.profile, instagram: event.target.value }})}
                                defaultValue={userDetail?.profile.instagram}
                            />
                            <TextField
                                id="per_page"
                                type={"number"}
                                label="Pages per page"
                                variant="outlined"
                                fullWidth
                                sx={{ mb: 2 }}
                                onChange={(event) => setUserDetail({ ...userDetail, per_page: event.target.value})}
                                defaultValue={userDetail?.per_page}
                                required={true}
                            />

                            <Button type="submit">Update</Button>
                        </form>
                    </CardContent>
                    <CardActions></CardActions>
                </Card>)}
            <ToastContainer/>
        </Container>
    );
};