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
import { PasswordClassic } from "../../models/Classic";
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import Pagination from "../Paginator";
import AuthContext from "../../context/AuthProvider";
import {User} from "../../models/User";

export const AllClassicPasswords = () => {
    // @ts-ignore
    const { user, axiosBearer, roles } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [totalPassw, setTotalPassw ] = useState();
    const [passw, setPassw] = useState<PasswordClassic[]>([]);

    useEffect(() => {
        if (user == null){
            navigate("/login");
        }

        if (axiosBearer) {
            setLoading(true);
            axios.get(`${BACKEND_API_URL}/classic`)
                .then((response1) => {
                    axios.get(`${BACKEND_API_URL}/classic/number`).then( (response) => {
                        setTotalPassw(response.data["number"]);
                        setPassw(response1.data);
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
        const info = passw.map((passw: PasswordClassic, index) => {
            return {
                index: index + 1,
                ...passw
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

    const [pg, setpg] = React.useState(1);

    const paginate = (pageNB: React.SetStateAction<number>) => {
        setLoading(true);
        setpg(pageNB)
        axios.get(`${BACKEND_API_URL}/classic?page=${pageNB}`)
            .then((response) => {
                setPassw(response.data);
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
            setCheckedVaults(passw.map((passw) => passw.id));
        } else {
            setCheckedVaults([]);
        }
    };

    const handleMultipleDelete = () => {
        // @ts-ignore
        axios.delete(`${BACKEND_API_URL}/classic/delete-list`, { data: { passw_ids: checkedVaults } })
            .then(() =>  window.location.reload())
            .catch((error) => console.log(error));
    };

    const isSelected = (vaultID: number) => checkedVaults.indexOf(vaultID) !== -1;


    return (
        <Container>
            <h1>All classic passwords</h1>

            {loading && <CircularProgress />}
            {!loading && passw.length === 0 && <p>No passwords found</p>}
            {!loading && checkedVaults.length > 0 && roles.includes("admin")&& (
                <Button onClick={handleMultipleDelete} sx={{backgroundColor: "#4d0000"}}>Delete</Button>
            )}
            {!loading && (
                <IconButton component={Link} sx={{ mr: 3 }} to={`/classic/add`}>
                    <Tooltip title="Add a new password" arrow>
                        <AddIcon color="primary" />
                    </Tooltip>
                </IconButton>
            )}
            {!loading && passw.length > 0 && (
                <TableContainer component={Paper} sx={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <Table sx={{ width: 800}} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell padding="checkbox">
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
                                        active={orderColumn === "used_for"}
                                        direction={orderColumn === "used_for" ? orderDirection : undefined}
                                        onClick={() => handleSort("used_for")}
                                    >
                                        used_for
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell align="left">
                                    <TableSortLabel
                                        active={orderColumn === "note"}
                                        direction={orderColumn === "note" ? orderDirection : undefined}
                                        onClick={() => handleSort("note")}
                                    >
                                        note
                                    </TableSortLabel>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sortedInfo(orderColumn, orderDirection).map((passw, index) => (
                                <TableRow key={passw.id}>
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            checked={isSelected(passw.id)}
                                            onChange={(event) => handleCheckboxChange(event, passw.id)}
                                        />
                                    </TableCell>
                                    <TableCell component="th" scope="row">{(pg - 1) * 25 + index + 1}</TableCell>
                                    <TableCell component="th" scope="row">
                                        <Link to={(passw.user as User).id != user.id || user.id == 0 ? `/profile/${(passw.user as User).id}` : `/profile`} title="View user profile">
                                            {(passw.user as User).username}
                                        </Link>
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        <Link to={`/classic/${passw.id}/details`} title="View passwords details">
                                            {passw.used_for}
                                        </Link>
                                    </TableCell>
                                    <TableCell align="left">{passw.note}</TableCell>
                                    <TableCell align="left">
                                        <IconButton
                                            component={Link}
                                            sx={{ mr: 3 }}
                                            to={`/classic/${passw.id}/details`}>
                                            <Tooltip title="View password details" arrow>
                                                <ReadMoreIcon color="primary" />
                                            </Tooltip>
                                        </IconButton>

                                        <IconButton component={Link} sx={{ mr: 3 }} to={`/classic/${passw.id}/edit`}>
                                            <EditIcon />
                                        </IconButton>

                                        <IconButton component={Link} sx={{ mr: 0 }} to={`/classic/${passw.id}/delete/${(passw?.user as User).id}`}>
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
                perPage = {passw.length}
                total={totalPassw}
                paginate={paginate}
                currPage={pg}
            />)}
        </Container>
    );
};