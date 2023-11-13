import { Navigate, Outlet} from "react-router-dom";
import useAuth from "../hooks/useAuth";


// @ts-ignore
const RequireAuth = ({allowedRoles}) => {
    // @ts-ignore
    const { roles, user, } = useAuth();

    return (
        roles?.find((role: any) => allowedRoles?.includes(role))
            ? <Outlet />
            : user
                ? <Navigate to='/unauthorized'  replace />
                : <Navigate to="/login" replace />
    );
}

export default RequireAuth;