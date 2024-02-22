import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    chatId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    senderId:{
        type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    text:{
        type: String,
    }
},
{
    timestamps:true,
}
)

const MessageModel = mongoose.model('Message',MessageSchema)

export default MessageModel