import  { apiSlice } from  './apiSlice'
// const USERS_URL = '/api/users'
const USERS_URL = 'https://buildit-q6ya.onrender.com/api/users'


const usersApiSlice = apiSlice.injectEndpoints({
    endpoints:(builder)=>({
        login: builder.mutation({
            query:(data)=>({
                url: `${USERS_URL}/auth`,
                method: 'POST',
                body: data,

            }), 
        }),

        glogin: builder.mutation({
          query:(data)=>({
              url: `${USERS_URL}/gauth`,
              method: 'POST',
              body: data,

          }), 
      }),

      gregister: builder.mutation({
        query:(data)=>({
            url: `${USERS_URL}/registergauth`,
            method: 'POST',
            body: data,

        }), 
    }),
 
        register: builder.mutation({
            query:(data)=>({
                url: `${USERS_URL}`,
                method: 'POST',
                body: data,

            }), 
        }),

        logout: builder.mutation({
              query: ()=> ({
                url: `${USERS_URL}/logout`,
                method: 'POST',
              }),  
        }), 
        
        verifyUser: builder.mutation({
          query: (data)=>({
            url: `${USERS_URL}/verifyuser`,
            method: 'GET',
            body:data,
          }),
        }),

        sendPasswordLink: builder.mutation({
          query: (data)=>({
            url: `${USERS_URL}/seforgotpassword`,
            method: 'POST',
            body:data,
          }),
        }),


        resetPassword: builder.mutation({
          query: ({_id,token, password})=>({
            url: `${USERS_URL}/seresetpassword/${_id}/${token}`,
            method: 'POST',
            body: { password }
          }),
        }),

        
        updateUser: builder.mutation({
            query: (data)=> ({
              url: `${USERS_URL}/profile`,
              method: 'PUT',
              body: data,
            }),  
    
      }),
      listTeamSe: builder.mutation({
        query: (projectId) => ({
          url: `${USERS_URL}/listteamse?projectId=${projectId}`,
          method: 'GET',
        }),
      }),

      materialRequest: builder.mutation({
        query:(data)=>({
          url: `${USERS_URL}/materialrequest`,
          method: 'POST',
          body: data,

      }), 
      }),
      employeeRequest: builder.mutation({
        query:(data)=>({
          url: `${USERS_URL}/employeerequest`,
          method: 'POST',
          body: data,

      }), 
      }),

      equipmentRequest: builder.mutation({
        query:(data)=>({
          url: `${USERS_URL}/equipmentrequest`,
          method: 'POST',
          body: data,

      }), 
      }),

      listRequestSe: builder.mutation({
        query: (projectId) => ({
          url: `${USERS_URL}/request?projectId=${projectId}`,
          method: 'GET',
        }),
      }),
      seLocation: builder.mutation({
        query: (data) => ({
          url: `${USERS_URL}/selocation`,
          method: 'POST',
          body: data,
        }),
      }),

      getUser: builder.mutation({
        query: (pmId) => ({
          url: `${USERS_URL}/getuser/${pmId}`,
          method: 'GET',
        }),
      }),

      getMessage: builder.mutation({
        query: (chatId) => ({
          url: `${USERS_URL}/getmessage/${chatId}`,
          method: 'GET',
        }),
      }),

      
      // userChats: builder.mutation({
      //   query: (userId) => ({
      //     url: `${USERS_URL}/chat/${userId}`,
      //     method: 'GET',
      //   }),
      // }),
}),

})




export const { useLoginMutation, useUserpmChatsMutation,useGregisterMutation,useResetPasswordMutation, useGloginMutation, useLogoutMutation, useVerifyUserMutation, useSendPasswordLinkMutation,useRegisterMutation, useUpdateUserMutation,  useListTeamSeMutation, useMaterialRequestMutation, useEmployeeRequestMutation, useListRequestSeMutation,useEquipmentRequestMutation, useSeLocationMutation, useGetUserMutation, useUserChatsMutation, useGetMessageMutation } = usersApiSlice