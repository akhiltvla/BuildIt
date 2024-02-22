import React, { useEffect, useRef, useState } from 'react'
import { Box, Modal, TextField, Divider, Typography, InputLabel, MenuItem } from '@mui/material'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select';
import { useSelector } from 'react-redux';
import { useUserChatsMutation } from '../../slices/chatApiSlice';
import Conversation from '../../components/Conversation/Conversation.jsx';
import './Chat.css'
import SeSidenav from '../../components/SeSidenav.jsx';
import ChatBox from '../../components/ChatBox/ChatBox';
import { io } from 'socket.io-client'
import {   useAdminPmListMutation} from '../../slices/adminApiSlice.js';


const Chat = () => {

  const [userChats] = useUserChatsMutation()
  // const socket = useRef()
  const { userInfo } = useSelector((state) => state.auth)
  const {pmInfo } = useSelector((state) => state.auth)
  
  const [ppm, setPpm] = useState('');
  const [seList, setSeList] = useState([]);
  const [pmList, setPmList] = useState([]);
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null)
  const [onlineUsers, setOnlineUsers] = useState([])
  const [sendMessage, setSendMessage] = useState(null)
  const [recieveMessage, setRecieveMessage] = useState(null)
  const [socket, setSocket] = useState(null)
   const newSocket = useRef()

   const [pmListData] = useAdminPmListMutation()

// sending message to the socket server
useEffect(()=>{
  if(sendMessage!==null){
     const newSocket = io("http://localhost:4000");
  newSocket.emit('send-message',sendMessage)
}
},[sendMessage])

useEffect(() => {

  // socket.current = io('http://localhost:3000')
  // socket.current.emit('new-user-add', userInfo._id)
  // console.log('xyzzzzxxx');
  // socket.current.on("get-users", (users) => {

  //   setOnlineUsers(users);
  //   console.log('onlineusers:',onlineUsers);

  const newSocket = io("http://localhost:4000");

  newSocket.on("connect", () => {
    setSocket(newSocket);
    newSocket.emit("new-user-add", userInfo._id);
    newSocket.on("get-users", (users) => {
      setOnlineUsers(users);
      console.log('onlineusers', onlineUsers);
      
    });
  });
  return () => {
    newSocket.disconnect();
  };
}, [userInfo])




  // recieve message from the socket server
useEffect(()=>{
  const newSocket = io("http://localhost:4000");
  newSocket.on('receive-message', (data)=>{
    setRecieveMessage(data)
  })

},[])

  useEffect(() => {

    const getChats = async () => {
      try {
        
        const { data } = await userChats(userInfo._id)
        if (data) {
         
          setChats(data)
          console.log('setcha',data);
        }
        
      } catch (error) {
        console.log(error);
      }
    }

    getChats()

  }, [userInfo])

  useEffect(() => {
    fetchPmAndSeList()
  }, []);


const checkOnlineStatus = (chat)=>{
  
  const chatMember = chat.members.find((member)=>member!==userChats._id)
  const online = onlineUsers.find((user)=>user.userId === chatMember)
  console.log('online',online);
  return online? true: false
}


const fetchPmAndSeList = async () => {
  try {
    const pmResponse = await pmListData();
    

    const pmData = pmResponse.data;
 

    setPmList(pmData);
   
  } catch (error) {
    console.error('Error fetching PM and SE data', error);
  }
};




const handleChangePpm = async(event) => {
  
  const selectedPMName = event.target.value;
  
  setPpm(selectedPMName);
  const selectedPM = pmList.find(pm => pm.name === selectedPMName);
  console.log('selectedPm',selectedPM);
    if (selectedPM) {
      try {
        const { data } = await userChats(selectedPM._id);
        console.log('bnbnbn',data);
        //setChats(data);
        setCurrentChat(data); // Assuming you want to set the first chat related to the selected PM
     console.log('cchat',data);
      } catch (error) {
        console.log(error);
      }
    }

};




  return (
    // <Box sx={{ display: 'flex' }}>
    // <SeSidenav />
    <div className='Chat'>
      {/* left side */}
      <div className='Left-side-chat'>

        <div className='Chat-container'>
          <h2>Chats</h2>
          <div className='Chat-list'>


          <FormControl >

            <InputLabel id="pm-label">Project Manager</InputLabel>
            <Select labelId="pm-label" id="pm"
              value={ppm} onChange={handleChangePpm}>
              <MenuItem value=''>
                <em>None</em>
              </MenuItem>
              {pmList.map((pm) => (
                <MenuItem  key={pm.name} value={pm.name}  >
                  
                  {pm.name}
                </MenuItem>
              //   <div onClick={() => setCurrentChat(chat)}>
              //   <Conversation data={chat} currentUserId={userInfo._id} online={checkOnlineStatus(chat)} />
              // </div>
              ))}
            </Select>
          </FormControl>

            {/* {chats.map((chat) => (
              <div key={chat._id} onClick={() => setCurrentChat(chat)}>
                <Conversation data={chat} currentUserId={userInfo._id} online={checkOnlineStatus(chat)} />
              </div>
            ))} */}
          </div>
        </div>
      </div>


      {/* right side */}
      <div className='Right-side-chat'>

        {/* <div style={{ width: '20rem, alignSelf: flex-end' }}> */}

          <ChatBox chat={currentChat} currentUser={userInfo._id} setSendMessage={setSendMessage}
          recieveMessage = {recieveMessage} />
        </div>
      </div>
    // </div>
    // </Box>
  )
}

export default Chat

