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
    Tooltip, TextField, Button,
} from "@mui/material";
import React, {BaseSyntheticEvent, useContext} from "react";
import { useEffect, useState } from "react";
import {Link, useNavigate} from "react-router-dom";
import { BACKEND_API_URL } from "../constants";
import { Vault } from "../models/Vault";
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import axios from "axios";
import Pagination from "./Paginator";
import AuthContext from "../context/AuthProvider";
import {toast, ToastContainer} from "react-toastify";
import {User} from "../models/User";

export const FilterVaults = () => {
    // @ts-ignore
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [vaults, setVaults] = useState<Vault[]>([]);
    const [totalVaults, setTotalVaults ] = useState();
    const [pg, setpg] = React.useState(1);

    useEffect(() => {
        if (user == null){
            navigate("/login");
        }
    })


    const paginate = (pageNB: React.SetStateAction<number>) => {
        setLoading(true);
        setpg(pageNB)
        axios.get(`${BACKEND_API_URL}/vault/gt/${filterYear}?page=${pageNB}`)
            .then((response) => {
                setVaults(response.data);
                setLoading(false);
            });}

    const [filterYear, setFilterYear] = useState();

    function notify(message: string) { toast(`🦄 ${message}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
    });}
    const filter = async (event: { preventDefault: () => void }) => {
        if (filterYear! > 2023) {
            notify("Year must be smaller than current year.");
            return;
        }
        event.preventDefault();
        try {
            setLoading(true);
            axios.get(`${BACKEND_API_URL}/vault/gt/${filterYear}`)
                .then((response1) => {
                    axios.get(`${BACKEND_API_URL}/vault-filter/number/${filterYear}`).then( (response) => {
                        setTotalVaults(response.data["number"]);
                        setVaults(response1.data);
                        setLoading(false);
                    })
                });
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Container>
            <h3>Vaults created in the years greater than:</h3>

            {loading && <CircularProgress />}
            {!loading && (
                <Container >
                    <form onSubmit={filter} style={{display: "flex", justifyContent: "left", alignItems: "center"}}>
                        <TextField label="Input Year"
                                   variant="outlined"
                                   // @ts-ignore
                                   onInputCapture={(event: BaseSyntheticEvent) => {
                                       if (event.target.value) {
                                           setFilterYear(event.target.value)
                                       }}}
                                   required={true}
                                   type={"number"}
                       />
                        <Button type="submit" sx={{marginLeft: 3}}>Filter</Button>
                    </form>
                </Container>
            )}
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
            {!loading && vaults.length > 0 && (<Pagination
                perPage = {vaults.length}
                total={totalVaults}
                paginate={paginate}
                currPage={pg}
            />)}
            <ToastContainer/>
        </Container>
    )};