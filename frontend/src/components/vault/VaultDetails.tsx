import {Box, Card, CardActions, CardContent, CircularProgress, IconButton, List, ListItem} from "@mui/material";
import { Container } from "@mui/system";
import {useContext, useEffect, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import { BACKEND_API_URL } from "../../constants";
import { Vault } from "../../models/Vault";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";
import AuthContext from "../../context/AuthProvider";
import {User} from "../../models/User";

export const VaultDetails = () => {
    // @ts-ignore
    const { user, axiosBearer } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const { vaultId } = useParams();
    const [vault, setVault] = useState<Vault>();

    useEffect(() => {
        if (user == null)
            navigate("/login");

        if (axiosBearer) {
            setLoading(true);
            axios.get(`${BACKEND_API_URL}/vault/${vaultId}`)
                .then((response) => {
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
                    <IconButton component={Link} sx={{ ml: 0 }} to={`/vault`}>
                        <ArrowBackIcon />
                    </IconButton>{" "}
                    <h1>Details</h1>
                    <ul>
                        <li>Created: {vault?.created_at}</li>
                        <li>Modified: {vault?.last_modified}</li>
                        <li>Title: {vault?.title}</li>
                        <li>Description: {vault?.description}</li>
                        <li>Master Password: {vault?.master_password}</li>
                    </ul>
                    <br/>
                    <p>Account Passwords:</p>
                    <List>
                        {vault?.account_passwords?.map((passw) => (
                            <ListItem key={passw.id}><Link to={`/account/${passw.id}/details`} title="View password details">
                                {passw.website_or_app} --- {passw.password}</Link></ListItem>
                    ))}
                    </List>
                    <br/>
                    <p>Classic Passwords:</p>
                    <List>
                        {vault?.classic_passwords?.map((passw) => (
                        <ListItem key={passw.id}><Link to={`/classic/${passw.id}/details`} title="View password details">
                            {passw.used_for} --- {passw.password}</Link></ListItem>
                    ))}
                    </List>
                    <br/>
                    <p>Tags:</p>
                    <List>
                        {vault?.tags?.map((tag) => (
                        <ListItem key={tag.id}><Link to={`/tag/${tag.id}/details`} title="View tag details">
                            {tag.title}</Link></ListItem>
                    ))}
                    </List>

                </CardContent>
                <CardActions>
                    <IconButton component={Link} sx={{ mr: 3 }} to={`/vault/${vaultId}/edit`}>
                        <EditIcon />
                    </IconButton>

                    <IconButton component={Link} sx={{ mr: 3 }} to={`/vault/${vaultId}/delete/${(vault?.user as User).id}`}>
                        <DeleteForeverIcon sx={{ color: "red" }} />
                    </IconButton>
                </CardActions>
            </Card>)}
        </Container>
    );
};