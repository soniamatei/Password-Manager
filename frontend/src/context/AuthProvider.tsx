import { createContext, useState, useEffect } from "react"
import jwt_decode from "jwt-decode"
import { useNavigate } from 'react-router-dom'
import axios from "axios";
import { BACKEND_API_URL } from "../constants";
import {Box, CircularProgress} from "@mui/material";
import {toast, ToastContainer} from "react-toastify";
import {User} from "../models/User";

const AuthContext = createContext({})

export default AuthContext;

// @ts-ignore
export const AuthProvider = ({children}) => {
    // @ts-ignore
    let [authTokens, setAuthTokens] = useState(()=> localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null)
    let [axiosBeared, setAxiosBeared] = useState(false)
    // @ts-ignore
    let [user, setUser] = useState<User|null>(() => localStorage.getItem('authTokens') ? jwt_decode(JSON.parse(localStorage.getItem('authTokens'))["access"]).user : null)
    // @ts-ignore
    let [roles, setRoles] = useState<string[]>(localStorage.getItem('authTokens') ? [jwt_decode(JSON.parse(localStorage.getItem('authTokens'))["access"]).user.role] : [""])

    const navigate = useNavigate();

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

    // @ts-ignore
    let loginUser = async (e )=> {
        e.preventDefault()
        axios.post(`${BACKEND_API_URL}/login/`, {username: e.target.username.value, password: e.target.password.value})
            .then((response) => {
                if(response.status === 200){
                    console.log(response)
                    const token_data = jwt_decode(response.data["access"]) as any;
                    setUser(token_data.user);

                    setAuthTokens(response.data);
                    localStorage.setItem("authTokens", JSON.stringify(response.data));
                    axios.defaults.headers["Authorization"] = "Bearer " + response.data.access;
                    setAxiosBeared(true)
                    console.log(user)
                    navigate("/home")
                }else{
                    notify("Something went wrong.")
                }
            })
            .catch((response) => notify(response.response.data["detail"]))
    }

    let logoutUser = () => {
        setAuthTokens(null)
        setUser(null)
        localStorage.removeItem('authTokens')
        navigate('/login')
    }

    let contextData = {
        axiosBearer: axiosBeared,
        user:user,
        authTokens:authTokens,
        roles: roles,
        setUserr: setUser,
        setAuthTokens: setAuthTokens,
        loginUser:loginUser,
        logoutUser:logoutUser,
        notifyAll: notify,
        setAxiosBearer: setAxiosBeared
    }

    useEffect(()=> {
        if (localStorage.getItem('authTokens')) {
            try {
                if (roles.includes("anonymous")){
                    setAxiosBeared(true);
                    return
                }
                // @ts-ignore
                let Token = JSON.parse(localStorage.getItem('authTokens'))
                const decodedToken = jwt_decode(Token.access);
                const currentTime = new Date().getTime() / 1000;
                // @ts-ignore

                if (decodedToken.exp >= currentTime) {
                    axios.defaults.headers["Authorization"] = "Bearer " + Token.access;
                    setAxiosBeared(true);
                } else {
                    logoutUser();
                }
            }
            catch (error) {
                notify("Invalid token format.")
            }
        }
        }, [])

    return(
        <AuthContext.Provider value={contextData} >
            <ToastContainer/>
            {children}
        </AuthContext.Provider>
    )
}