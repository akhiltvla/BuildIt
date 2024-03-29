import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

import React from 'react'

const AdminPrivateRoute = () => {

    const  { adminInfo } = useSelector((state) => state.adminAuth)
    return adminInfo ? <Outlet />: <Navigate to='/'/>
   
}

export default AdminPrivateRoute
