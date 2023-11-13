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
    Tooltip, TableSortLabel, Button, Checkbox,
} from "@mui/material";
import React from "react";
import { useEffect, useState, useContext } from "react";
import {Link, useNavigate} from "react-router-dom";
import { BACKEND_API_URL } from "../../constants";
import { Tag } from "../../models/Tag";
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import Pagination from "../Paginator";
import AuthContext from "../../context/AuthProvider";
import {User} from "../../models/User";

export const AllTags = () => {
    // @ts-ignore
    const { user, axiosBearer, roles } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [totalTags, setTotalTags] = useState()
    const [tags, setTags] = useState<Tag[]>([]);

    useEffect(() => {
        if (user == null){
            navigate("/login");
        }

        if (axiosBearer) {
            setLoading(true);
            axios.get(`${BACKEND_API_URL}/tag?page=${1}`)
                .then((response1) => {
                    axios.get(`${BACKEND_API_URL}/tag/number`).then( (response) => {
                        setTotalTags(response.data["number"]);
                        setTags(response1.data);
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
        const info = tags.map((tag: Tag, index) => {
            return {
                index: index + 1,
                ...tag
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
        axios.get(`${BACKEND_API_URL}/tag?page=${pageNB}`)
            .then((response) => {
                setTags(response.data);
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
            setCheckedVaults(tags.map((tag) => tag.id));
        } else {
            setCheckedVaults([]);
        }
    };

    const handleMultipleDelete = () => {
        // @ts-ignore
        axios.delete(`${BACKEND_API_URL}/tag/delete-list`, { data: { tag_ids: checkedVaults } })
            .then(() =>  window.location.reload())
            .catch((error) => console.log(error));
    };

    const isSelected = (vaultID: number) => checkedVaults.indexOf(vaultID) !== -1;

    return (
        <Container>
            <h1>All tags</h1>

            {loading && <CircularProgress />}
            {!loading && tags.length === 0 && <p>No tags found</p>}
            {!loading && checkedVaults.length > 0 && roles.includes("admin")&& (
                <Button onClick={handleMultipleDelete} sx={{backgroundColor: "#4d0000"}}>Delete</Button>
            )}
            {!loading && (
                <IconButton component={Link} sx={{ mr: 3 }} to={`/tag/add`}>
                    <Tooltip title="Add a new tag" arrow>
                        <AddIcon color="primary" />
                    </Tooltip>
                </IconButton>
            )}
            {!loading && tags.length > 0 && (
                <TableContainer  sx={{display: "flex", justifyContent: "center", alignItems: "center"}} component={Paper}>
                    <Table sx={{width:500}} aria-label="simple table">
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
                                <TableCell align="left">user</TableCell>
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
                                        active={orderColumn === "tagged_passws"}
                                        direction={orderColumn === "tagged_passws" ? orderDirection : undefined}
                                        onClick={() => handleSort("tagged_passws")}
                                    >
                                        tagged_passws
                                    </TableSortLabel>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sortedInfo(orderColumn, orderDirection).map((tags, index) => (
                                <TableRow key={tags.id}>
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            checked={isSelected(tags.id)}
                                            onChange={(event) => handleCheckboxChange(event, tags.id)}
                                        />
                                    </TableCell>
                                    <TableCell component="th" scope="row">{(pg - 1) * 25 + index + 1}</TableCell>
                                    <TableCell component="th" scope="row">
                                        <Link to={(tags.user as User).id != user.id || user.id == 0 ? `/profile/${(tags.user as User).id}` : `/profile`} title="View user profile">
                                            {(tags.user as User).username}
                                        </Link>
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        <Link to={`/tag/${tags.id}/details`} title="View tag details">
                                            {tags.title}
                                        </Link>
                                    </TableCell>
                                    <TableCell component="th" scope="row">{tags.nb_acc}</TableCell>
                                    <TableCell align="left">
                                        <IconButton
                                            component={Link}
                                            sx={{ mr: 3 }}
                                            to={`/tag/${tags.id}/details`}>
                                            <Tooltip title="View tag details" arrow>
                                                <ReadMoreIcon color="primary" />
                                            </Tooltip>
                                        </IconButton>

                                        <IconButton component={Link} sx={{ mr: 3 }} to={`/tag/${tags.id}/edit`}>
                                            <EditIcon />
                                        </IconButton>

                                        <IconButton component={Link} sx={{ mr: 0 }} to={`/tag/${tags.id}/delete/${(tags.user as User).id}`}>
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
                perPage = {tags.length}
                total={totalTags}
                paginate={paginate}
                currPage={pg}
            />)}
        </Container>
    );
};