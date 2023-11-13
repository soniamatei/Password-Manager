import {
    TableContainer,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    CircularProgress,
    Container,
    IconButton,
    Tooltip,
} from "@mui/material";
import React from "react";
import { useEffect, useState, useContext } from "react";
import {Link, useNavigate} from "react-router-dom";
import { BACKEND_API_URL } from "../constants";
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import axios from "axios";
import Pagination from "./Paginator";
import AuthContext from "../context/AuthProvider"
import {User} from "../models/User";

export const StatVaults = () => {
    // @ts-ignore
    const { user,axiosBearer } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [totalVaults, setTotalVaults ] = useState();
    const [vaults, setVaults] = useState<{
        user: User;
        id: number;
        created_at: string;
        last_modified: string;
        title: string;
        description: string;
        avg_password_length: number;
    }[]>([]);

    useEffect(() => {
        if (user == null){
            navigate("/login");
        }

        if (axiosBearer) {
            setLoading(true);
            axios.get(`${BACKEND_API_URL}/statistics-vault`)
                .then((response1) => {
                    axios.get(`${BACKEND_API_URL}/vault/number`).then( (response) => {
                        setTotalVaults(response.data["number"]);
                        setVaults(response1.data);
                        setLoading(false);
                    })
                });
        }

    }, [axiosBearer]);

    const [pg, setpg] = React.useState(1);

    const paginate = (pageNB: React.SetStateAction<number>) => {
        setLoading(true);
        setpg(pageNB)
        axios.get(`${BACKEND_API_URL}/statistics-vault?page=${pageNB}`)
            .then((response) => {
                setVaults(response.data);
                setLoading(false);
            });}

    return (
        <Container>
            <h3>Vaults in the descending order of the average length of the account passwords.</h3>

            {loading && <CircularProgress />}
            {!loading && vaults.length === 0 && <p>No vaults found</p>}
            {!loading && vaults.length > 0 && (
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>#</TableCell>
                                <TableCell align="left">created_at
                                </TableCell>
                                <TableCell align="left">last_modified</TableCell>
                                <TableCell align="left">user</TableCell>
                                <TableCell align="left">title</TableCell>
                                <TableCell align="left">description</TableCell>
                                <TableCell align="left">avg_password_length</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {vaults.map((vault, index) => (
                                <TableRow key={vault.id}>
                                    <TableCell component="th" scope="row">{(pg - 1) * 25 + index + 1}</TableCell>
                                    <TableCell component="th" scope="row">{vault.created_at}</TableCell>
                                    <TableCell component="th" scope="row">{vault.last_modified}</TableCell>
                                    <TableCell component="th" scope="row">
                                        <Link to={(vault.user as User).id != user.id ? `/profile/${(vault.user as User).id}/` : `/profile`} title="View user profile">
                                            {(vault.user as User).username}
                                        </Link>
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        <Link to={`/vault/${vault.id}/details`} title="View vault details">
                                            {vault.title}
                                        </Link>
                                    </TableCell>
                                    <TableCell align="left">{vault.description}</TableCell>
                                    <TableCell align="left">{vault.avg_password_length}</TableCell>
                                    {/*<TableCell align="right">*/}
                                    {/*    <IconButton*/}
                                    {/*        component={Link}*/}
                                    {/*        sx={{ mr: 3 }}*/}
                                    {/*        to={`/vault/${vault.id}/details`}>*/}
                                    {/*        <Tooltip title="View vault details" arrow>*/}
                                    {/*            <ReadMoreIcon color="primary" />*/}
                                    {/*        </Tooltip>*/}
                                    {/*    </IconButton>*/}

                                    {/*    <IconButton component={Link} sx={{ mr: 3 }} to={`/vault/${vault.id}/edit`}>*/}
                                    {/*        <EditIcon />*/}
                                    {/*    </IconButton>*/}

                                    {/*    <IconButton component={Link} sx={{ mr: 3 }} to={`/vault/${vault.id}/delete`}>*/}
                                    {/*        <DeleteForeverIcon sx={{ color: "red" }} />*/}
                                    {/*    </IconButton>*/}
                                    {/*</TableCell>*/}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
            <br/>
            {!loading && ( <Pagination
                perPage = {vaults.length}
                total={totalVaults}
                paginate={paginate}
                currPage={pg}
            />)}
        </Container>
    );
};