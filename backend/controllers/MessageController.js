import MessageModel from '../models/MessageModel.js';

export const addMessage =async(req,res)=>{
    const {chatId, senderId, text } = req.body
    const message = new MessageModel({
        chatId,
        senderId,
        text
    })
    try {
        const result = await message.save()
        // console.log('result',result);
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json(error)
    }
}  

export const getMessages = async(req,res)=>{
    const {chatId} = req.params
//    console.log('chatid',chatId);
    try {
        const result = await MessageModel.find({chatId})
        // console.log('result',result);
        if(result){
            res.status(200).json(result);
          }
          else {
            res.status(404).json("No such Message");
          }
    } catch (error) {
        res.status(500).json(error) 
    }
}
