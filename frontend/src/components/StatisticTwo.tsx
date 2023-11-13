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
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import {Vault} from "../models/Vault";
import Pagination from "./Paginator"
import AuthContext from "../context/AuthProvider"
import {User} from "../models/User";

export const StatPassws = () => {
    // @ts-ignore
    const { user, axiosBearer } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [totalPassw, setTotalPassw ] = useState();
    const [passw, setPassw] = useState<{
        id: number;
        user: User;
        created_at: string;
        last_modified: string;
        vault: Vault | number;
        website_or_app: string;
        username_or_email: string;
        note: string;
        count_tags: number;
    }[]>([]);

    useEffect(() => {
        if (user == null){
            navigate("/login");
        }

        if (axiosBearer) {
            setLoading(true);
            axios.get(`${BACKEND_API_URL}/statistics-password`)
                .then((response1) => {
                    axios.get(`${BACKEND_API_URL}/account/number`).then( (response) => {
                        setTotalPassw(response.data["number"]);
                        setPassw(response1.data);
                        setLoading(false);
                    })
                });
        }

    }, [axiosBearer]);

    const [pg, setpg] = React.useState(1);

    const paginate = (pageNB: React.SetStateAction<number>) => {
        setLoading(true);
        setpg(pageNB)
        axios.get(`${BACKEND_API_URL}/account?page=${pageNB}`)
            .then((response) => {
                setPassw(response.data);
                setLoading(false);
            });}

    return (
        <Container>
            <h3>Account passwords in the descending order of the number of their tags.</h3>

            {loading && <CircularProgress />}
            {!loading && passw.length === 0 && <p>No passwords found</p>}
            {!loading && (
                <IconButton component={Link} sx={{ mr: 3 }} to={`/account/add`}>
                    <Tooltip title="Add a new password" arrow>
                        <AddIcon color="primary" />
                    </Tooltip>
                </IconButton>
            )}
            {!loading && passw.length > 0 && (
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>#</TableCell>
                                <TableCell align="left">created_at</TableCell>
                                <TableCell align="left">last_modified</TableCell>
                                <TableCell align="left">user</TableCell>
                                <TableCell align="left">website_or_app</TableCell>
                                <TableCell align="left">username_or_email</TableCell>
                                <TableCell align="left">note</TableCell>
                                <TableCell align="left">count_tags</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {passw.map((passw, index) => (
                                <TableRow key={passw.id}>
                                    <TableCell component="th" scope="row">{(pg - 1) * 25 + index + 1}</TableCell>
                                    <TableCell component="th" scope="row">{passw.created_at}</TableCell>
                                    <TableCell component="th" scope="row">{passw.last_modified}</TableCell>
                                    <TableCell component="th" scope="row">
                                        <Link to={(passw.user as User).id != user.id ? `/profile/${(passw.user as User).id}/` : `/profile`} title="View user profile">
                                            {(passw.user as User).username}
                                        </Link>
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        <Link to={`/account/${passw.id}/details`} title="View passwords details">
                                            {passw.website_or_app}
                                        </Link>
                                    </TableCell>
                                    <TableCell align="left">{passw.username_or_email}</TableCell>
                                    <TableCell align="left">{passw.note}</TableCell>
                                    <TableCell align="left">{passw.count_tags}</TableCell>
                                    {/*<TableCell align="left">*/}
                                    {/*    <IconButton*/}
                                    {/*        component={Link}*/}
                                    {/*        sx={{ mr: 3 }}*/}
                                    {/*        to={`/account/${passw.id}/details`}>*/}
                                    {/*        <Tooltip title="View password details" arrow>*/}
                                    {/*            <ReadMoreIcon color="primary" />*/}
                                    {/*        </Tooltip>*/}
                                    {/*    </IconButton>*/}

                                    {/*    <IconButton component={Link} sx={{ mr: 3 }} to={`/account/${passw.id}/edit`}>*/}
                                    {/*        <EditIcon />*/}
                                    {/*    </IconButton>*/}

                                    {/*    <IconButton component={Link} sx={{ mr: 3 }} to={`/account/${passw.id}/delete`}>*/}
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
                perPage = {passw.length}
                total={totalPassw}
                paginate={paginate}
                currPage={pg}
            />)}
        </Container>
    );
};