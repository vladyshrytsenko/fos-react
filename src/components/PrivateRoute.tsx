import { Navigate, Outlet } from "react-router-dom"

const PrivateRoute: React.FC<{ isAuth: boolean}> = ({ isAuth }) => {
    return isAuth ? <Outlet/> : <Navigate to="/login"/>;
}

export default PrivateRoute;