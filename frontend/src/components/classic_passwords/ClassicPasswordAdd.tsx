import {
    Autocomplete,
    Button,
    Card,
    CardActions,
    CardContent, debounce,
    IconButton,
    TextField,
} from "@mui/material";
import { Container } from "@mui/system";
import { useCallback, useEffect, useState, useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BACKEND_API_URL } from "../../constants";
import { Vault } from "../../models/Vault";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";
import { PasswordClassic } from "../../models/Classic";
import {toast, ToastContainer} from "react-toastify";
import AuthContext from "../../context/AuthProvider";

export const ClassicPasswordAdd = () => {
    // @ts-ignore
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [passw, setPassw] = useState<PasswordClassic>({
        user: user.id,
        id: 0,
        created_at: "",
        last_modified: "",
        vault: 0,
        password: "",
        used_for: "",
        note: "",
    });

    const [vault, setVault] = useState<Vault[]>([]);

    const fetchSuggestions = async (query: string) => {
        try {
            const response = await axios.get<Vault[]>(
                `${BACKEND_API_URL}/vault/autocomplete?query=${query}`
            );
            const data = await response.data;
            setVault(data);
        } catch (error) {
            console.error("Error fetching suggestions:", error);
        }
    };

    const debouncedFetchSuggestions = useCallback(debounce(fetchSuggestions, 500), []);

    useEffect(() => {
        if (user == null){
            navigate("/login");
        }

        return () => {
            debouncedFetchSuggestions.clear(); //cancel??
        };
    }, [debouncedFetchSuggestions]);

    const addPassword = async (event: { preventDefault: () => void }) => {
        event.preventDefault();
        if (passw.password.length < 5) {
            notify("password length >= 5");
        }
        else {
            try {
                await axios.post(`${BACKEND_API_URL}/classic`, passw);
                navigate("/classic");
            } catch (error) {
                console.log(error);
            }
        }
    };

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

    const handleInputChange = (event: any, value: any, reason: any) => {
        if (reason === "input") {
            debouncedFetchSuggestions(value);
        }
    };

    return (
        <Container>
            <Card>
                <CardContent>
                    <IconButton component={Link} sx={{ mr: 3 }} to={`/classic`}>
                        <ArrowBackIcon />
                    </IconButton>{" "}
                    <form onSubmit={addPassword}>
                        <Autocomplete
                            id="vault"
                            options={vault}
                            getOptionLabel={(option) => `${option.title}`}
                            renderInput={(params) => <TextField {...params} required={true} label="Vault" variant="outlined" />}
                            filterOptions={(x) => x}
                            onInputChange={handleInputChange}
                            onChange={(event, value) => {
                                if (value) {
                                    console.log(value);
                                    setPassw({ ...passw, vault: value.id });
                                }
                            }}
                        />
                        <br/>
                        <TextField
                            id="used_for"
                            label="Used for"
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2 }}
                            onChange={(event) => setPassw({ ...passw, used_for: event.target.value })}
                            required={true}
                        />
                        <TextField
                            id="note"
                            label="Note"
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2 }}
                            onChange={(event) => setPassw({ ...passw, note: event.target.value })}
                        />
                        <TextField
                            id="password"
                            label="Password"
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2 }}
                            onChange={(event) => setPassw({ ...passw, password: event.target.value })}
                            required={true}
                        />
                        <Button type="submit">Add Password</Button>
                    </form>
                </CardContent>
                <CardActions></CardActions>
            </Card>
            <ToastContainer/>
        </Container>
    );
};