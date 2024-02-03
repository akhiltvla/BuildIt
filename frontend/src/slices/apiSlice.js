import { createApi,fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const baseQuery = fetchBaseQuery({ baseUrl:'' });  

export const apiSlice = createApi({
    baseQuery,
    tagTypes:['User', 'Pm', 'Admin','Project', 'Chat'],
    endpoints: (builder) => ({ })
})