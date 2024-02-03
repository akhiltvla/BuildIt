import  { apiSlice } from  './apiSlice'
const CHATS_URL = '/api/chats'

const chatApiSlice = apiSlice.injectEndpoints({
    endpoints:(builder)=>({

      userChats: builder.mutation({
        query: (userId) => ({
          url: `${CHATS_URL}/${userId}`,
          method: 'GET',
        }),
      }),

      userpmChats: builder.mutation({
        query: (pmId) => ({
          url: `${CHATS_URL}/${pmId}`,
          method: 'GET',
        }),
      }),

      // getUser: builder.mutation({
      //   query: (pmId) => ({
      //     url: `${CHATS_URL}/${pmId}`,
      //     method: 'GET',
      //   }),
      // }),

      
}),

})




export const { useUserChatsMutation, useUserpmChatsMutation } = chatApiSlice