import {Container, Card, Button, TextField, LinearProgress} from "@mui/material";
import {  useNavigate } from "react-router-dom";
import React, {BaseSyntheticEvent, useContext, useEffect, useState} from "react";
import AuthContext from "../../context/AuthProvider";
import {BACKEND_API_URL} from "../../constants";
import axios from "axios";
import {Label} from "@mui/icons-material";

export const Administration = () => {
    // @ts-ignore
    const { notifyAll, user, logoutUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false)
    const [perPage, setPerPage] = useState()
    const [username, setUsername] = useState()
    const [role, setRole] = useState()

    useEffect(() => {
        if (user == null)
            navigate("/login");
    }, [])

    const handleDeleteUsers = (event: { preventDefault: () => void }) => {
        event.preventDefault();
        setLoading(true);
        axios.get(`${BACKEND_API_URL}/user/reset`)
            .then(() => {
                setLoading(false);
                notifyAll("Users deleted.");
                logoutUser();
            })
            .catch((error) => {
                setLoading(false);
                notifyAll(error.response.data["detail"]);
            });
    };

    const handleDeleteVault = (event: { preventDefault: () => void }) => {
        event.preventDefault();
        setLoading(true);
        axios.get(`${BACKEND_API_URL}/vault/reset`)
            .then(() => {
                setLoading(false);
                notifyAll("Vaults deleted.");
            })
            .catch((error) => {
                setLoading(false);
                notifyAll(error.response.data["detail"]);
            });
    };

    const handleDeleteAccount = (event: { preventDefault: () => void }) => {
        event.preventDefault();
        setLoading(true);
        axios.get(`${BACKEND_API_URL}/account/reset`)
            .then(() => {
                setLoading(false);
                notifyAll("Account passwords deleted.");
            })
            .catch((error) => {
                setLoading(false);
                notifyAll(error.response.data["detail"]);
            });
    };

    const handleDeleteClassic = (event: { preventDefault: () => void }) => {
        event.preventDefault();
        setLoading(true);
        axios.get(`${BACKEND_API_URL}/classic/reset`)
            .then(() => {
                setLoading(false);
                notifyAll("Classic passwords deleted.");
            })
            .catch((error) => {
                setLoading(false);
                notifyAll(error.response.data["detail"]);
            });
    };

    const handleDeleteTag = (event: { preventDefault: () => void }) => {
        event.preventDefault();
        setLoading(true);
        axios.get(`${BACKEND_API_URL}/tag/reset`)
            .then(() => {
                setLoading(false);
                notifyAll("Tags deleted.");
            })
            .catch((error) => {
                setLoading(false);
                notifyAll(error.response.data["detail"]);
            });
    };

    const handlePopulationUserProfiles = (event: { preventDefault: () => void }, ) => {
        event.preventDefault();
        setLoading(true);
        axios.post(`${BACKEND_API_URL}/populate`, {type: "profile"})
            .then(() => {
                setLoading(false);
                notifyAll("User profiles populated.");
            })
            .catch((error) => {
                setLoading(false);
                console.log(error)
            });
    };

    const handlePopulationUser = (event: { preventDefault: () => void }, ) => {
        event.preventDefault();
        setLoading(true);
        axios.post(`${BACKEND_API_URL}/populate`, {type: "user"})
            .then(() => {
                setLoading(false);
                notifyAll("Users populated.");
            })
            .catch((error) => {
                setLoading(false);
                console.log(error)
            });
    };

    const handlePopulationVault = (event: { preventDefault: () => void }) => {
        event.preventDefault();
        setLoading(true);
        axios.post(`${BACKEND_API_URL}/populate`, {type: "vault"})
            .then(() => {
                setLoading(false);
                notifyAll("Vaults populated.");
            })
            .catch((error) => {
                setLoading(false);
                console.log(error)
            });
    };

    const handlePopulationAccount= (event: { preventDefault: () => void }) => {
        event.preventDefault();
        setLoading(true);
        axios.post(`${BACKEND_API_URL}/populate`, {type: "account"})
            .then(() => {
                setLoading(false);
                notifyAll("Account passwords populated.");
            })
            .catch((error) => {
                setLoading(false);
                console.log(error)
            });
    };

    const handlePopulationClassic = (event: { preventDefault: () => void }) => {
        event.preventDefault();
        setLoading(true);
        axios.post(`${BACKEND_API_URL}/populate`, {type: "classic"})
            .then(() => {
                setLoading(false);
                notifyAll("Classic passwords populated.");
            })
            .catch((error) => {
                setLoading(false);
                console.log(error)
            });
    };

    const handlePopulationTag = (event: { preventDefault: () => void }) => {
        event.preventDefault();
        setLoading(true);
        axios.post(`${BACKEND_API_URL}/populate`, {type: "tag"})
            .then(() => {
                setLoading(false);
                notifyAll("Tags populated.");
            })
            .catch((error) => {
                setLoading(false);
                console.log(error)
            });
    };

    const handlePopulationRelations = (event: { preventDefault: () => void }) => {
        event.preventDefault();
        setLoading(true);
        axios.post(`${BACKEND_API_URL}/populate`, {type: "relation"})
            .then(() => {
                setLoading(false);
                notifyAll("Relations populated.");
            })
            .catch((error) => {
                setLoading(false);
                console.log(error)
            });
    };

    const handleModifyPerPage = (event: { preventDefault: () => void }) => {
        event.preventDefault();
        setLoading(true);
        // @ts-ignore
        axios.post(`${BACKEND_API_URL}/user/per-page`, {per_page: perPage})
            .then(() => {
                setLoading(false);
                notifyAll("Change committed.");
            })
            .catch((error) => {
                setLoading(false);
                console.log(error)
            });
    }

    const handleRoleChange = (event: { preventDefault: () => void }) => {
        event.preventDefault();
        setLoading(true);
        // @ts-ignore
        // axios.post(`${BACKEND_API_URL}/user/per-page`, {per_page: perPage})
        //     .then(() => {
        //         setLoading(false);
        //         notifyAll("Change committed.");
        //     })
        //     .catch((error) => {
        //         setLoading(false);
        //
        //         for (const msg1 in error.response.data) {
        //             const value = error.response.data[msg1];
        //             notifyAll(msg1 + ": " + value)
        //         }
        //     });
    }

    return (
        <Container>
                <br/>
                {loading && (
                    <>
                        <LinearProgress/>
                        <br/> <br/>
                    </>
                )}
                <Container sx={{display: "flex", alignItems: "center", flexFlow: "column"}}>
                    <Container sx={{display: "flex", justifyContent: "space-around"}}>
                        <Card sx={{padding: "3em", backgroundColor: "#f2f2f2", width: "20em"}}>
                            <h4>Reset Entities</h4>
                            <br/>
                            <Button disabled={loading} onClick={handleDeleteUsers} sx={{backgroundColor: "#4d0000"}}>Users</Button><br/>
                            <Button disabled={loading} onClick={handleDeleteVault} sx={{backgroundColor: "#4d0000",  marginTop: "1em"}}>Vaults</Button>
                            <Button disabled={loading} onClick={handleDeleteAccount} sx={{backgroundColor: "#4d0000",  marginTop: "1em"}}>Account Passwords</Button>
                            <Button disabled={loading} onClick={handleDeleteClassic} sx={{backgroundColor: "#4d0000",  marginTop: "1em"}}>Classic Passwords</Button>
                            <Button disabled={loading} onClick={handleDeleteTag} sx={{backgroundColor: "#4d0000",  marginTop: "1em"}}>Tags</Button>
                        </Card>
                        <Card sx={{padding: "3em", backgroundColor: "#f2f2f2", width: "20em"}}>
                            <h4>Populate Entities</h4>
                            <br/>
                            <Button disabled={loading} onClick={handlePopulationUserProfiles} sx={{backgroundColor: "#4d0000"}}>User Profiles</Button><br/>
                            <Button disabled={loading} onClick={handlePopulationUser} sx={{backgroundColor: "#4d0000",   marginTop: "1em"}}>Users</Button><br/>
                            <Button disabled={loading} onClick={handlePopulationVault} sx={{backgroundColor: "#4d0000",  marginTop: "1em"}}>Vaults</Button>
                            <Button disabled={loading} onClick={handlePopulationAccount} sx={{backgroundColor: "#4d0000",  marginTop: "1em"}}>Account Passwords</Button>
                            <Button disabled={loading} onClick={handlePopulationClassic} sx={{backgroundColor: "#4d0000",  marginTop: "1em"}}>Classic Passwords</Button>
                            <Button disabled={loading} onClick={handlePopulationTag} sx={{backgroundColor: "#4d0000",  marginTop: "1em"}}>Tags</Button><br/>
                            <Button disabled={loading} onClick={handlePopulationRelations} sx={{backgroundColor: "#4d0000",  marginTop: "1em"}}>Relations</Button>
                        </Card>
                    </Container>
                    <br/>
                    <br/>
                    <Container sx={{display: "flex", justifyContent: "space-around"}}>
                        <Card sx={{padding: "2em", backgroundColor: "#f2f2f2", width: "20em"}}>
                            <h4>Set Entities per Page</h4>
                            <br/>
                            <form onSubmit={handleModifyPerPage} style={{display: "flex", justifyContent: "left", alignItems: "center", alignContent: "center"}}>
                                <TextField label="Input Number"
                                           variant="outlined"
                                           type={"number"}
                                    // @ts-ignore
                                           onInputCapture={(event: BaseSyntheticEvent) => {
                                               if (event.target.value) {
                                                   setPerPage(event.target.value)
                                               }}}
                                           required={true}
                                />
                                <br/>
                                <Button disabled={loading}  type="submit" sx={{marginLeft: 3}}>SET</Button>
                            </form>
                        </Card>
                        <Card sx={{padding: "2em", backgroundColor: "#f2f2f2", width: "20em"}}>
                            <h4>Set Role for User</h4>
                            <br/>
                            <form onSubmit={handleRoleChange} style={{display: "flex", justifyContent: "left", alignItems: "center", alignContent: "center"}}>
                                <TextField label="Input Name"
                                           variant="outlined"
                                    // @ts-ignore
                                           onInputCapture={(event: BaseSyntheticEvent) => {
                                               if (event.target.value) {
                                                   setUsername(event.target.value)
                                               }}}
                                           required={true}
                                />
                                <br/>
                                <TextField label="Input Role"
                                           variant="outlined"
                                    // @ts-ignore
                                           onInputCapture={(event: BaseSyntheticEvent) => {
                                               if (event.target.value) {
                                                   setRole(event.target.value)
                                               }}}
                                           required={true}
                                />
                                <br/>
                                <Button disabled={loading}  type="submit" sx={{marginLeft: 3}}>SET</Button>
                            </form>
                        </Card>
                    </Container>
                </Container>
        </Container>
    );
};