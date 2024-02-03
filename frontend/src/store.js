import {configureStore} from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import pmAuthReducer from './slices/pmAuthSlice'
import adminAuthSlice from './slices/adminAuthSlice'
import getProjectSlice from './slices/getProjectSlice'
import { apiSlice } from './slices/apiSlice'

const store = configureStore({
    reducer:{
        auth: authReducer,
        pmAuth: pmAuthReducer,
        adminAuth: adminAuthSlice,
        getProject: getProjectSlice,
        [apiSlice.reducerPath]:apiSlice.reducer,
    },
    middleware:(getDefaultMiddleware)=> getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true,
})

export default store