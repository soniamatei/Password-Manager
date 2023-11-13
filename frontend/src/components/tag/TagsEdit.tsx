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
import { useEffect, useState, useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BACKEND_API_URL } from "../../constants";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";
import { Tag } from "../../models/Tag";
import AuthContext from "../../context/AuthProvider";

export const TagsEdit = () => {
    // @ts-ignore
    const { user, axiosBearer, roles } = useContext(AuthContext);
    const navigate = useNavigate();
    const { tagId } = useParams();
    const [loading, setLoading] = useState(true);

    const [tag, setTag] = useState<Tag>({
        user: user.id,
        nb_acc: 0,
        id: 0,
        title: "",
        vault: 0,
        tagged_passwords: []
    });

    const updateTag = async (event: { preventDefault: () => void }) => {
        event.preventDefault();
        try {
            console.log(tag.vault)
            await axios.patch(`${BACKEND_API_URL}/tag/${tagId}`, tag);
            navigate("/tag");
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (user == null){
            navigate("/login");
        }

        if (axiosBearer) {
            setLoading(true);
            axios.get(`${BACKEND_API_URL}/tag/${tagId}`)
                .then((response) => {

                    if (roles.includes("user") && response.data.user.id != user.id){
                        setLoading(false);
                        navigate("/unauthorized");
                    }

                    setTag(response.data);
                    setLoading(false);
                })
        }

    }, [tagId, axiosBearer]);

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
                        <IconButton component={Link} sx={{ mr: 3 }} to={`/tag`}>
                            <ArrowBackIcon />
                        </IconButton>{" "}
                        <form onSubmit={updateTag}>
                            <br/>
                            <TextField
                                id="title"
                                label="Title"
                                defaultValue={tag.title}
                                variant="outlined"
                                fullWidth
                                sx={{ mb: 2 }}
                                onChange={(event) => setTag({ ...tag, title: event.target.value })}
                                required={true}
                            />
                            <Button type="submit">Update Tag</Button>
                        </form>
                    </CardContent>
                    <CardActions></CardActions>
                </Card>)}
        </Container>
    );
};