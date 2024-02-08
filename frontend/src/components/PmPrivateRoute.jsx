import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

import React from 'react'

const PmPrivateRoute = () => {

    const  { pmInfo  } = useSelector((state) => state.pmAuth)
   
    return pmInfo ? <Outlet />: <Navigate to='/'/>
   
}

export default PmPrivateRoute
