import asyncHandler from 'express-async-handler';
import ChatModel from '../models/ChatModel.js';


export const createChat = async (req,res)=>{
    const newChat = new ChatModel({
        members: [req.body.senderId, req.body.recieverId],

    })

    try {
        const result = await newChat.save()
        res.status(200).json(result)

    } catch (error){
        res.status(500).json(error)
    }
}
// export const createChat = asyncHandler(async (req, res) => {
//     const chat = await ChatModel.findOne({
//       members: { $all: [req.body.senderId, req.body.recieverId] },
//     });
//     if (!chat) {
//       const newChat = new ChatModel({
//         members: [req.body.senderId, req.body.recieverId],
//       });
//       await newChat.save();
//       return res.status(200).json(newChat);
//     }
//     res.status(200).json(chat);
//   });
  


export const userChats = async (req, res) => {
    try {
        const userId = req.params.userId;
// console.log('id..',id);
        // Find existing chats for the user
        const chats = await ChatModel.find({
            members: userId
        });

        // If no chats exist, create a new chat
        if (chats.length === 0) {
            const newChat = new ChatModel({
                members: [userId]
            });

            const result = await newChat.save();
            return res.status(200).json([result]);
        }

        // Otherwise, return the existing chats
        return res.status(200).json(chats);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};






export const findChat = async(req,res)=>{
    try {
        
        const chat = await ChatModel.findOne({
            members: {$all: [req.params.firstId, req.params.secondId]}
        })
        res.status(200).json(chat)
    } catch (error) {
        res.status(500).json(error)
    }
}