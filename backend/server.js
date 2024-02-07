import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
dotenv.config()
import { notFound ,errorHandler} from './middleware/errorMiddleware.js';
import connectDB from './config/db.js';
const port = process.env.PORT || 5000;

import userRoutes from './routes/userRoutes.js'
import pmRoutes from './routes/pmRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import ChatRoutes from './routes/ChatRoutes.js'
import MessageRoutes from './routes/MessageRoutes.js'
import cors from 'cors'
import { Server } from 'socket.io'
import { createServer } from "http";

connectDB()

const app = express();

const httpServer = createServer(app)
// console.log('httpserv',httpServer);
const io = new Server(4000,{
    cors:{
        
       origin:"https://dashing-profiterole-43c9fa.netlify.app/",
       methods:'GET,PUT,PATCH,POST,DELETE,HEAD',
       credentials:true

    }
})
 let activeUsers = [] 
//  console.log(activeUsers);
 io.on("connection", (socket) => {
    
  //For adding new User
  socket.on("new-user-add", (newUserId) => {
    //if user is not added previously
    if (!activeUsers.some((user) => user.userId === newUserId)) {
      activeUsers.push({
        userId: newUserId,
        socketId: socket.id
      });
      
      console.log("New User Connected", activeUsers);
      
    }

    console.log("Connected Users", activeUsers);
    io.emit("get-users", activeUsers);
  });

  //Send Message
  socket.on("send-message", (data) => {
    const { recieverId } = data;
    console.log('testdata',data);
    const user = activeUsers.find((user) => user.userId === recieverId);
    console.log("Sending from socket to: ", recieverId);
    console.log("Dataaa", data);
    if (user) {
      const mess = io.to(user.socketId).emit("recieve-message", data);
      if (mess) {
        console.log("Receiving on socket : ", user.socketId, data);
      }
    }
  });
  //On disconnect.
  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
    activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);

    console.log("Connected Users", activeUsers);
    io.emit("get-users", activeUsers);
  });
});

app.use(cors({
  origin:"https://dashing-profiterole-43c9fa.netlify.app/",
  methods:'GET,PUT,PATCH,POST,DELETE,HEAD',

}));
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

app.use('/api/users',userRoutes);
app.use('/api/pms',pmRoutes);
app.use('/api/admins',adminRoutes);
app.use('/api/chats',ChatRoutes)
app.use('/api/messages',MessageRoutes)
app.get('/',(req,res) => res.send('Server is ready'));

app.use(notFound);
app.use(errorHandler);

app.listen(port,()=>console.log(`Server started on port ${port}`));
