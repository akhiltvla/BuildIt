import asyncHandler from 'express-async-handler';
import ChatModel from '../models/ChatModel.js';
import User from '../models/userModel.js';

// export const createChat = async (req,res)=>{
//     const newChat = new ChatModel({
//         members: [req.body.senderId, req.body.recieverId],

//     })

//     try {
//         const result = await newChat.save()
//         res.status(200).json(result)

//     } catch (error){
//         res.status(500).json(error)
//     }
// }
export const createChat = asyncHandler(async (req, res) => {
    try {
        const chat = await ChatModel.findOne({
            members: { $all: [req.body.senderId, req.body.recieverId] },
          });
          if (!chat) {
            const newChat = new ChatModel({
              members: [req.body.senderId, req.body.recieverId],
            });
            await newChat.save();
            return res.status(200).json(newChat);
          }
          res.status(200).json(chat);
    } catch (error) {
        res.status(500).json(error) 
    }
    
  });
  


export const userChats = async (req, res) => {
  console.log('hoo');
   try {
    console.log('id..',req.params.memberId);
        // Find existing chats for the user
        const chats = await ChatModel.find({
            members: {$in: [req.params.memberId]}
        });
        const memberArray = [];
  if (chats) {
    for (const chat of chats) {
      for (const member of chat.members) {
        if (member.toString() !== req.params.memberId.toString()) {
          const user = await User.findById(member);
          memberArray.push(user);
        }
      }
    }
  }
  res.status(200).json(memberArray);
    
   } catch (error) {
    res.status(500).json(error) 
   }

}

        // If no chats exist, create a new chat
        // if (chats.length === 0) {
        //     const newChat = new ChatModel({
        //         members: [userId]
        //     });

        //     const result = await newChat.save();
        //     return res.status(200).json([result]);
        // }

        // Otherwise, return the existing chats
//         return res.status(200).json(chats);
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ error: 'Internal Server Error' });
//     }
// };






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