import  { apiSlice } from  './apiSlice'
// const CHATS_URL = '/api/chats'
const CHATS_URL = 'https://buildit-q6ya.onrender.com/api/chats'
const chatApiSlice = apiSlice.injectEndpoints({
    endpoints:(builder)=>({

      createChat: builder.mutation({
        query: (data) => ({
          url: `${CHATS_URL}/`,
          method: "POST",
          body: data,
        }),
      }),

      userChats: builder.mutation({
        query: (id) => ({
          url: `${CHATS_URL}/${id}`,
          method: 'GET',
        }),
      }),

      findChat: builder.mutation({
        query: ({userId, pmId}) => ({
          url: `${CHATS_URL}/find/${userId}/${pmId}`,
          method: "GET",
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