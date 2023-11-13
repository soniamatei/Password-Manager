import {
    Button,
    Card,
    CardActions,
    CardContent,
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
import {toast, ToastContainer} from "react-toastify";
import AuthContext from "../../context/AuthProvider";


export const VaultAdd = () => {
    // @ts-ignore
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
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

    useEffect(() => {
        if (user == null){
            navigate("/login");
        }
    })

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

    const addVault = async (event: { preventDefault: () => void }) => {
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
                                console.log(vault)
                                axios.post(`${BACKEND_API_URL}/vault`, vault);
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

    return (
        <Container>
            <Card>
                <CardContent>
                    <IconButton component={Link} sx={{ mr: 3 }} to={`/vault`}>
                        <ArrowBackIcon />
                    </IconButton>{" "}
                    <form onSubmit={addVault}>
                        <TextField
                            id="title"
                            label="Title"
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2 }}
                            onChange={(event) => setVault({ ...vault, title: event.target.value })}
                            required={true}
                        />
                        <TextField
                            id="description"
                            label="Description"
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2 }}
                            onChange={(event) => setVault({ ...vault, description: event.target.value })}
                        />
                        <TextField
                            id="master_password"
                            label="Master Password"
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2 }}
                            onChange={(event) => setVault({ ...vault, master_password: event.target.value })}
                            required={true}
                        />
                        <Button type="submit">Add Vault</Button>
                    </form>
                </CardContent>
                <CardActions></CardActions>
            </Card>
            <ToastContainer />
        </Container>
    );
};