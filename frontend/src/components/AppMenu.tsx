import { Box, AppBar, Toolbar, IconButton, Typography, Button } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import LockIcon from '@mui/icons-material/Lock';
import {useContext} from "react";
import AuthContext from "../context/AuthProvider";

export const AppMenu = () => {
    // @ts-ignore
    const { user } = useContext(AuthContext);
    const location = useLocation();
    const path = location.pathname;

    return (
        <>
            {user != null && (
                <Box sx={{ flexGrow: 1 }}>
                    <AppBar position="static" sx={{ marginBottom: "20px" }}>
                        <Toolbar>
                            <IconButton
                                component={Link}
                                to="/home"
                                size="large"
                                edge="start"
                                color="inherit"
                                aria-label="school"
                                sx={{ mr: 2 }}>
                                <LockIcon />
                            </IconButton>
                            <Typography variant="h6" component="div" sx={{ mr: 5 }}>
                                Password management
                            </Typography>
                            <Button
                                variant={path.startsWith("/vault") ? "outlined" : "text"}
                                to="/vault"
                                component={Link}
                                color="inherit"
                                sx={{ mr: 5 }}>
                                Vaults
                            </Button>
                            <Button
                                variant={path.startsWith("/account") ? "outlined" : "text"}
                                to="/account"
                                component={Link}
                                color="inherit"
                                sx={{ mr: 5 }}>
                                Account Passwords
                            </Button>
                            <Button
                                variant={path.startsWith("/classic") ? "outlined" : "text"}
                                to="/classic"
                                component={Link}
                                color="inherit"
                                sx={{ mr: 5 }}>
                                Classic Passwords
                            </Button>
                            <Button
                                variant={path.startsWith("/tag") ? "outlined" : "text"}
                                to="/tag"
                                component={Link}
                                color="inherit"
                                sx={{ mr: 5 }}>
                                Tags
                            </Button>
                            <Button
                                variant={path.startsWith("/statistics-vault") ? "outlined" : "text"}
                                to="/statistics-vault"
                                component={Link}
                                color="inherit"
                                sx={{ mr: 5 }}>
                                Stat. vaults
                            </Button>
                            <Button
                                variant={path.startsWith("/statistics-password") ? "outlined" : "text"}
                                to="/statistics-password"
                                component={Link}
                                color="inherit"
                                sx={{ mr: 5 }}>
                                Stat. account passw.
                            </Button>
                            <Button
                                variant={path.startsWith("/vault/filter") ? "outlined" : "text"}
                                to="/vault/filter"
                                component={Link}
                                color="inherit"
                                sx={{ mr: 5 }}>
                                Filter Vaults
                            </Button>
                            <Button
                                    variant={path.startsWith("/profile") ? "outlined" : "text"}
                                    to="/profile"
                                    component={Link}
                                    color="inherit"
                                    sx={{ mr: 5 }}>
                                    Profile
                            </Button>
                            <Button
                                    variant={path.startsWith("/administration") ? "outlined" : "text"}
                                    to="/administration"
                                    component={Link}
                                    color="inherit"
                                    sx={{ mr: 5 }}>
                                    Administration
                            </Button>
                            <Button
                                    variant={path.startsWith("/logout") ? "outlined" : "text"}
                                    to="/logout"
                                    component={Link}
                                    color="inherit"
                                    sx={{ mr: 5 }}>
                                    Log out
                            </Button>
                        </Toolbar>
                    </AppBar>
                </Box>
            )}
        </>
    );
};