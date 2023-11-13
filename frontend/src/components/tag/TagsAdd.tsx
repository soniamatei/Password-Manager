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
import { useCallback, useEffect, useState , useContext} from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BACKEND_API_URL } from "../../constants";
import { Vault } from "../../models/Vault";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";
import { Tag } from "../../models/Tag";
import AuthContext from "../../context/AuthProvider";

export const TagsAdd = () => {
    // @ts-ignore
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [tag, setTag] = useState<Tag>({
        user: user.id,
        id: 0,
        title: "",
        vault: 0, nb_acc: 0,
        tagged_passwords: []
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
            debouncedFetchSuggestions.clear();
        };
    }, [debouncedFetchSuggestions]);

    const addTag = async (event: { preventDefault: () => void }) => {
        event.preventDefault();
        try {
            await axios.post(`${BACKEND_API_URL}/tag`, tag);
            navigate("/tag");
        } catch (error) {
            console.log(error);
        }
    };

    const handleInputChange = (event: any, value: any, reason: any) => {
        console.log("input", value, reason);

        if (reason === "input") {
            debouncedFetchSuggestions(value);
        }
    };

    return (
        <Container>
            <Card>
                <CardContent>
                    <IconButton component={Link} sx={{ mr: 3 }} to={`/tag`}>
                        <ArrowBackIcon />
                    </IconButton>{" "}
                    <form onSubmit={addTag}>
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
                                    setTag({ ...tag, vault: value.id });
                                }
                            }}
                        />
                        <br/>
                        <TextField
                            id="title"
                            label="Title"
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2 }}
                            onChange={(event) => setTag({ ...tag, title: event.target.value })}
                            required={true}
                        />
                        <Button type="submit">Add Tag</Button>
                    </form>
                </CardContent>
                <CardActions></CardActions>
            </Card>
        </Container>
    );
};