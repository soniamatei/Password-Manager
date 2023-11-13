import { useRef, useEffect, useContext } from 'react';
import AuthContext from "../context/AuthProvider";
import {Container} from "@mui/system";
import {Button} from "@mui/material";
import {Profile} from "../models/Profile";
import {useNavigate} from "react-router-dom";
import jwt_decode from "jwt-decode";
import axios from "axios";

const Login = () => {
    // @ts-ignore
    const { logoutUser, loginUser, setUserr, setAxiosBearer } = useContext(AuthContext);
    const userRef = useRef();
    const navigate = useNavigate();

    // useEffect(() => {
    //     // @ts-ignore
    //     userRef.current.focus();
    //     logoutUser();
    // }, [])

    const handleLogInAnonymously = () => {
        setUserr({
            id: 0,
            created_at: "",
            last_modified: "",
            username: "",
            password: "",
            email: "",
            is_staff: "",
            is_active: "",
            nb_acc: "",
            nb_cls: "",
            nb_vls: "",
            nb_tgs: "",
            profile: {
                id: 0,
                bio: "",
                gender: "",
                marital_status: "",
                birthday: "",
                instagram: "",
            },
            per_page: "",
        })
        setAxiosBearer(true);
        navigate("/home");
    }

    return (
        <Container sx={{display: "flex", justifyContent: "center"}}>
                <section>
                    {/*<p // @ts-ignore*/}
                    {/*    ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>*/}
                    <h1>Sign In</h1>
                    <form onSubmit={loginUser}>
                        <label htmlFor="username">Username:</label>
                        <input
                            type="text"
                            id="username"
                            // @ts-ignore
                            ref={userRef}
                            autoComplete="off"
                            // onChange={(e) => setUser(e.target.value)}
                            // value={user}
                            required
                        />

                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            // onChange={(e) => setPwd(e.target.value)}
                            // value={pwd}
                            required
                        />
                        <button>Sign In</button>
                    </form>
                    <p>
                        Need an Account?<br />
                        <span className="line">
                            <a href="/register">Sign Up</a>
                        </span>
                    </p>
                    <br/>
                    <button onClick={handleLogInAnonymously}>Log in anonymously</button>
                </section>
        </Container>
    )
}

export default Login