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
    Tooltip, TableSortLabel, Checkbox, Button,
} from "@mui/material";
import React, {useContext} from "react";
import { useEffect, useState } from "react";
import {Link, useNavigate} from "react-router-dom";
import { BACKEND_API_URL } from "../../constants";
import { Vault } from "../../models/Vault";
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import Pagination from "../Paginator";
import AuthContext from "../../context/AuthProvider";
import {User} from "../../models/User";

export const AllVaults = () => {
    // @ts-ignore
    const { user, axiosBearer, notifyAll, roles } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [vaults, setVaults] = useState<Vault[]>([]);
    const [totalVaults, setTotalVaults ] = useState();
    const [pg, setpg] = React.useState(1);

    useEffect(() => {
        if (user == null)
            navigate("/login");

        if (axiosBearer) {
            setLoading(true);
            axios.get(`${BACKEND_API_URL}/vault?page=${pg}`)
                .then((response1) => {
                    axios.get(`${BACKEND_API_URL}/vault/number`).then( (response) => {
                        setTotalVaults(response.data["number"]);
                        setVaults(response1.data);
                        setLoading(false);
                    })
                });
        }

    }, [axiosBearer]);

    const [orderColumn, setOrderColumn] = useState("id");
    const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("asc");

    const handleSort = (column: string) => {
        let newOrderColumn = column;
        let newOrderDirection = "asc";
        if (column == orderColumn) {
            if (orderDirection == "asc") {
                newOrderDirection = "desc";
            } else {
                newOrderColumn = "id";
                newOrderDirection = "asc";
                (document.activeElement as HTMLElement).blur();
            }
        }
        setOrderColumn(newOrderColumn);
        // @ts-ignore
        setOrderDirection(newOrderDirection);
    };

    const sortedInfo = (column: string, direction: string) => {
        const info = vaults.map((vault: Vault, index) => {
            return {
                index: index + 1,
                ...vault
            }
        });
        return info.sort((a, b) => {
            if (direction == "asc")
            { // @ts-ignore
                return (a[column] < b[column]) ? -1 : 1;
            }
            else
            { // @ts-ignore
                return (a[column] > b[column]) ? -1 : 1;
            }
        });
    };

    const paginate = (pageNB: React.SetStateAction<number>) => {
        setLoading(true);
        setpg(pageNB)
        axios.get(`${BACKEND_API_URL}/vault?page=${pageNB}`)
            .then((response) => {
                setVaults(response.data);
                setLoading(false);
            });}

    const [checkedVaults, setCheckedVaults] = useState<number[]>([]);
    const [selectAll, setSelectAll] = useState(false);

    const handleCheckboxChange = (event: any, vaultID: number) => {
        if (event.target.checked) {
            setCheckedVaults([...checkedVaults, vaultID]);
        } else {
            const index = checkedVaults.indexOf(vaultID);
            if (index !== -1) {
                checkedVaults.splice(index, 1);
                setCheckedVaults([...checkedVaults]);
            }
        }
    };

    const handleSelectAllChange = (event: any) => {
        setSelectAll(event.target.checked);
        if (event.target.checked) {
            setCheckedVaults(vaults.map((vault) => vault.id));
        } else {
            setCheckedVaults([]);
        }
    };

    const handleMultipleDelete = () => {
        // @ts-ignore
        axios.delete(`${BACKEND_API_URL}/vault/delete-list`, { data: { vault_ids: checkedVaults } })
            .then(() =>  window.location.reload())
            .catch((error) => console.log(error));
    };

    const isSelected = (vaultID: number) => checkedVaults.indexOf(vaultID) !== -1;

    return (
        <Container>
            <h1>All vaults</h1>

            {loading && <CircularProgress />}
            {!loading && vaults.length === 0 && <p>No vaults found</p>}
            {!loading && checkedVaults.length > 0 && roles.includes("admin") && (
                <Button onClick={handleMultipleDelete} sx={{backgroundColor: "#4d0000"}}>Delete</Button>
            )}
            {!loading && (
                <IconButton component={Link} sx={{ mr: 3 }} to={`/vault/add`}>
                    <Tooltip title="Add a new vault" arrow>
                        <AddIcon color="primary" />
                    </Tooltip>
                </IconButton>
            )}
            {!loading && vaults.length > 0 && (
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                                <TableRow><TableCell padding="checkbox">
                                    <Checkbox
                                        checked={selectAll}
                                        onChange={handleSelectAllChange}
                                        indeterminate={checkedVaults.length > 0 && checkedVaults.length < sortedInfo(orderColumn, orderDirection).length}
                                    />
                                </TableCell>
                                <TableCell>#</TableCell>
                                <TableCell>user</TableCell>
                                <TableCell align="left">
                                    <TableSortLabel
                                        active={orderColumn === "title"}
                                        direction={orderColumn === "title" ? orderDirection : undefined}
                                        onClick={() => handleSort("title")}
                                    >
                                        title
                                    </TableSortLabel>
                                    </TableCell>
                                <TableCell align="left">
                                    <TableSortLabel
                                        active={orderColumn === "description"}
                                        direction={orderColumn === "description" ? orderDirection : undefined}
                                        onClick={() => handleSort("description")}
                                    >
                                        description
                                    </TableSortLabel>
                                    </TableCell>
                                <TableCell align="left">
                                    <TableSortLabel
                                        active={orderColumn === "master_password"}
                                        direction={orderColumn === "master_password" ? orderDirection : undefined}
                                        onClick={() => handleSort("master_password")}
                                    >
                                        master_password
                                    </TableSortLabel>
                                    </TableCell>
                                <TableCell align="left">
                                    <TableSortLabel
                                        active={orderColumn === "accounts"}
                                        direction={orderColumn === "accounts" ? orderDirection : undefined}
                                        onClick={() => handleSort("accounts")}
                                    >
                                        account_passws
                                    </TableSortLabel>
                                    </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sortedInfo(orderColumn, orderDirection).map((vault, index) => (
                                    <TableRow key={vault.id}>
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            checked={isSelected(vault.id)}
                                            onChange={(event) => handleCheckboxChange(event, vault.id)}
                                        />
                                    </TableCell>
                                    <TableCell component="th" scope="row">{(pg - 1) * 25 + index + 1}</TableCell>
                                    <TableCell component="th" scope="row">
                                        <Link to={((vault.user as User).id != user.id || user.id == 0) ? `/profile/${(vault.user as User).id}` : `/profile`} title="View user profile">
                                            {(vault.user as User).username}
                                        </Link>
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        <Link to={`/vault/${vault.id}/details`} title="View vault details">
                                            {vault.title}
                                        </Link>
                                    </TableCell>
                                    <TableCell align="left">{vault.description}</TableCell>
                                    <TableCell align="left">{vault.master_password}</TableCell>
                                    <TableCell align="left">{vault.nb_acc}</TableCell>
                                    <TableCell align="right">
                                        <IconButton
                                            component={Link}
                                            sx={{ mr: 3 }}
                                            to={`/vault/${vault.id}/details`}>
                                            <Tooltip title="View vault details" arrow>
                                                <ReadMoreIcon color="primary" />
                                            </Tooltip>
                                        </IconButton>

                                        <IconButton component={Link} sx={{ mr: 3 }} to={`/vault/${vault.id}/edit`}>
                                            <EditIcon />
                                        </IconButton>

                                        <IconButton component={Link} sx={{ mr: 3 }} to={`/vault/${vault.id}/delete/${(vault.user as User).id}`}>
                                            <DeleteForeverIcon sx={{ color: "red" }} />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
            <br/>
            {!loading && ( <Pagination
                // @ts-ignore
                perPage = {vaults.length}
                total={totalVaults}
                paginate={paginate}
                currPage={pg}
            />)}
        </Container>
    )};