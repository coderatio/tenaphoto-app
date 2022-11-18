import React from "react";
import {Navigate, Outlet, } from "react-router-dom";
import useAuth from "../Providers/AuthProvider";
import Loader from "./Loader";

const AuthRoute = () => {
    const { user, loading } = useAuth()

    if (loading) {
        return <Loader/>
    }

    return user ? <Outlet /> : <Navigate to='/login'/>
}

export default AuthRoute;