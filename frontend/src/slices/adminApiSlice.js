import { apiSlice } from './apiSlice'
const ADMINS_URL = '/api/admins'

const adminsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    adminLogin: builder.mutation({
      query: (data) => ({
        url: `${ADMINS_URL}/adminauth`,
        method: 'POST',
        body: data,

      }),
    }),

    adminregister: builder.mutation({
      query: (data) => ({
        url: `${ADMINS_URL}`,
        method: 'POST',
        body: data,

      }),
    }),

    adminLogout: builder.mutation({
      query: () => ({
        url: `${ADMINS_URL}/adminlogout`,
        method: 'POST',
      }),
    }),
    updateAdmin: builder.mutation({
      query: (data) => ({
        url: `${ADMINS_URL}/adminprofile`,
        method: 'PUT',
        body: data,
      }),

    }),


    projectAdminAdd: builder.mutation({
      query: (data) => ({
        url: `${ADMINS_URL}/adminaddproject`,
        method: 'POST',
        body: data,
      }),
    }),

    projectAdminEdit: builder.mutation({
      query: (data) => ({
        url: `${ADMINS_URL}/admineditproject`,
        method: 'PUT',
        body: data,
      }),
    }),

    adminProjectList: builder.mutation({
      query: () => ({
        url: `${ADMINS_URL}/adminlistproject`,
        method: 'GET',

      }),
    }),

    adminProjectDelete: builder.mutation({
      query: (projectId) => ({
        url: `${ADMINS_URL}/admindeleteproject/${projectId}`,
        method: 'DELETE',

      }),
    }),


    pmAdminAdd: builder.mutation({
      query: (data) => ({
        url: `${ADMINS_URL}/adminaddpm`,
        method: 'POST',
        body: data,
      }),
    }),

    adminPmList: builder.mutation({
      query: () => ({
        url: `${ADMINS_URL}/adminlistpm`,
        method: 'GET',

      }),
    }),


    adminPmDelete: builder.mutation({
      query: (pmId) => ({
        url: `${ADMINS_URL}/admindeletepm/${pmId}`,
        method: 'DELETE',

      }),
    }),

    adminPmBlock: builder.mutation({
      query: (pmId) => ({
        url: `${ADMINS_URL}/adminblockpm/${pmId}`,
        method: 'PATCH',

      }),
    }),

    adminPmUnBlock: builder.mutation({
      query: (pmId) => ({
        url: `${ADMINS_URL}/adminunblockpm/${pmId}`,
        method: 'PATCH',

      }),
    }),

    adminPmAuthorise: builder.mutation({
      query: (pmId) => ({
        url: `${ADMINS_URL}/adminauthorisepm/${pmId}`,
        method: 'PATCH',

      }),
    }),

    seAdminAdd: builder.mutation({
      query: (data) => ({
        url: `${ADMINS_URL}/adminaddse`,
        method: 'POST',
        body: data,
      }),
    }),

    adminSeList: builder.mutation({
      query: () => ({
        url: `${ADMINS_URL}/adminlistse`,
        method: 'GET',

      }),
    }),
   
    adminSeDelete: builder.mutation({
      query: (seId) => ({
        url: `${ADMINS_URL}/admindeletese/${seId}`,
        method: 'DELETE',

      }),
    }),

    adminSeBlock: builder.mutation({
      query: (seId) => ({
        url: `${ADMINS_URL}/adminblockse/${seId}`,
        method: 'PATCH',

      }),
    }),

    adminSeUnBlock: builder.mutation({
      query: (seId) => ({
        url: `${ADMINS_URL}/adminunblockse/${seId}`,
        method: 'PATCH',

      }),
    }),
    adminSeAuthorise: builder.mutation({
      query: (seId) => ({
        url: `${ADMINS_URL}/adminauthorisese/${seId}`,
        method: 'PATCH',

      }),
    }),
    
    
    

  }),

})

export const { useAdminLoginMutation, useAdminLogoutMutation, useAdminregisterMutation, useUpdateAdminMutation, useProjectAdminAddMutation, useProjectAdminEditMutation, useAdminProjectListMutation, useAdminProjectDeleteMutation, usePmAdminAddMutation, useAdminPmListMutation, useAdminPmDeleteMutation, useAdminPmBlockMutation, useAdminPmUnBlockMutation, useAdminPmAuthoriseMutation, useSeAdminAddMutation,  useAdminSeListMutation, useAdminSeDeleteMutation, useAdminSeBlockMutation, useAdminSeUnBlockMutation, useAdminSeAuthoriseMutation } = adminsApiSlice