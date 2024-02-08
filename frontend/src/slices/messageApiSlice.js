import  { apiSlice } from  './apiSlice'
// const MESSAGES_URL = '/api/messages'

const MESSAGES_URL = 'https://buildit-q6ya.onrender.com/api/messages'


const messageApiSlice = apiSlice.injectEndpoints({
    endpoints:(builder)=>({

      addMessages: builder.mutation({
        query: (data) => ({
          url: `${MESSAGES_URL}`,
          method: 'POST',
          body: data
        }),
      }),
      getMessages: builder.mutation({
        query: (chatId) => ({
          url: `${MESSAGES_URL}/${chatId}`,
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




export const { useGetMessagesMutation, useAddMessagesMutation } = messageApiSlice