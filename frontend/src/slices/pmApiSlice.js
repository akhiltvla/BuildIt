import  { apiSlice } from  './apiSlice'
// const PMS_URL = '/api/pms'
const PMS_URL = 'https://buildit-q6ya.onrender.com/api/pms'


const pmsApiSlice = apiSlice.injectEndpoints({
    endpoints:(builder)=>({
        pmLogin: builder.mutation({
            query:(data)=>({
                url: `${PMS_URL}/pmauth`,
                method: 'POST',
                body: data,

            }), 
        }),

        glogin: builder.mutation({
          query:(data)=>({
              url: `${PMS_URL}/gauth`,
              method: 'POST',
              body: data,

          }), 
      }),
 
        pmregister: builder.mutation({
            query:(data)=>({
               
                url: `${PMS_URL}/pmregister`,
                method: 'POST',
                body: data,

            }), 
        }),

       pmLogout: builder.mutation({
              query: ()=> ({
                url: `${PMS_URL}/pmlogout`,
                method: 'POST',
              }),  
        }),  
        updatePm: builder.mutation({
            query: (data)=> ({
              url: `${PMS_URL}/pmprofile`,
              method: 'PUT',
              body: data,
            }),  
    
      }),

      addTeam: builder.mutation({
        query: (data) => ({
            url: `${PMS_URL}/pmteam`,
            method: 'POST',
            body: data,
      }),
    }),

    listTeam: builder.mutation({
        query: (projectId) => ({
          url: `${PMS_URL}/listteam?projectId=${projectId}`,
          method: 'GET',
        }),
      }),

    deleteTeam: builder.mutation({
        query: (teamId) => ({
          url: `${PMS_URL}/deleteteam/${teamId}`,
          method: 'DELETE',
  
        }),
      }),

      uploadDocument: builder.mutation({
        query: (projectId)=> ({
          url: `${PMS_URL}/pmdocument/${projectId}`,
          method: 'PUT',
          
        }),  

  }),


  listDocument: builder.mutation({
    query: (projectId) => ({
      url: `${PMS_URL}/listdocument?projectId=${projectId}`,
      method: 'GET',
    }),
  }),
  // deleteDocument: builder.mutation({
  //   query: (projectId) => ({
  //     url: `${PMS_URL}/deletedocument/${projectId}`,
  //     method: 'DELETE',

  //   }),
  // }),
  
  listRequest: builder.mutation({
    query: (projectId) => ({
      url: `${PMS_URL}/pmrequest?projectId=${projectId}`,
      method: 'GET',
    }),
  }),

  requestPermit: builder.mutation({
    query: (requestId) => ({
      url: `${PMS_URL}/requestpermit/${requestId}`,
      method: 'PATCH',

    }),
  }),

  requestReject: builder.mutation({
    query: (requestId) => ({
      url: `${PMS_URL}/requestreject/${requestId}`,
      method: 'PATCH',

    }),
  }),

  getUserPm: builder.mutation({
    query: (userId) => ({
      url: `${PMS_URL}/getuserpm/${userId}`,
      method: 'GET',
    }),
  }),
  
})
})

export const { usePmLoginMutation,useGetUserPmMutation,useGloginMutation, usePmLogoutMutation,usePmregisterMutation, useUpdatePmMutation, useAddTeamMutation, useDeleteTeamMutation, useListTeamMutation, useUploadDocumentMutation, useListDocumentMutation, useListRequestMutation,useRequestPermitMutation, useRequestRejectMutation, usePmgloginMutation } = pmsApiSlice