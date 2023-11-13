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
export const VaultEdit = () => {
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { vaultId } = useParams();
    // @ts-ignore
    const { user, axiosBearer, roles } = useContext(AuthContext);

    const [vault, setVault] = useState<Vault>({
        user: user.id,
        nb_acc: 0,
        title: "",
        description: "",
        master_password: "",
        account_passwords: [],
        classic_passwords: [],
        created_at: "",
        id: 0,
        last_modified: "",
        tags: []
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

    const updateVault = async (event: { preventDefault: () => void }) => {
        event.preventDefault();
        if (vault.master_password.length < 8){
            notify("master_password length >= 8");
        }
        else {
            try {
                axios.get<Vault[]>(
                    `${BACKEND_API_URL}/vault/autocomplete?query=${vault.title}`
                )
                    .then(response => {

                        if (response.data.length > 0) {
                            notify("title must be unique");
                        }
                        else {
                            try {
                                axios.put(`${BACKEND_API_URL}/vault/${vaultId}`, vault);
                                navigate("/vault");
                            } catch (error) {
                                console.log(error);
                            }
                        }
                    })
            } catch (error) {
                console.error("Error fetching suggestions:", error);
            }
        }
    };

    useEffect(() => {
        if (user == null)
            navigate("/login");

        if (axiosBearer) {
            setLoading(true);
            axios.get(`${BACKEND_API_URL}/vault/${vaultId}`)
                .then((response) => {

                    if (roles.includes("user") && response.data.user.id != user.id){
                        setLoading(false);
                        navigate("/unauthorized");
                    }

                    setVault(response.data);
                    setLoading(false);
                })
        }

    }, [vaultId, axiosBearer]);

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
                    <IconButton component={Link} sx={{ mr: 3 }} to={`/vault`}>
                        <ArrowBackIcon />
                    </IconButton>{" "}
                    <form onSubmit={updateVault}>
                        <TextField
                            id="title"
                            label="Title"
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2 }}
                            onChange={(event) => setVault({ ...vault, title: event.target.value })}
                            defaultValue={vault.title}
                            required={true}
                        />
                        <TextField
                            id="description"
                            label="Description"
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2 }}
                            onChange={(event) => setVault({ ...vault, description: event.target.value })}
                            defaultValue={vault.description}
                        />
                        <TextField
                            id="master_password"
                            defaultValue={vault.master_password}
                            label="Master Paswword"
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2 }}
                            onChange={(event) => setVault({ ...vault, master_password: event.target.value })}
                            required={true}
                        />

                        <Button type="submit">Update Vault</Button>
                    </form>
                </CardContent>
                <CardActions></CardActions>
            </Card>)}
            <ToastContainer/>
        </Container>
    );
};