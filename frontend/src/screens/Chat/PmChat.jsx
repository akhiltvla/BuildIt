import React, { useEffect, useRef, useState } from 'react'
import { Box, Modal, TextField, Divider, Typography, InputLabel, MenuItem } from '@mui/material'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select';
import { useSelector } from 'react-redux';
import { useUserpmChatsMutation } from '../../slices/chatApiSlice.js';
import PmConversation from '../../components/Conversation/PmConversation.jsx';
import './Chat.css'
import SeSidenav from '../../components/SeSidenav.jsx';
import PmChatBox from '../../components/ChatBox/PmChatBox';
import { io } from 'socket.io-client'
import { useAdminSeListMutation} from '../../slices/adminApiSlice.js';



const PmChat = () => {

  const [userChats] = useUserpmChatsMutation()
  // const socket = useRef()
  const { pmInfo } = useSelector((state) => state.pmAuth)
  
  const [chats, setChats] = useState([]);
  const [pse, setPse] = useState('');
  
  const [seList, setSeList] = useState([]);
  const [pmList, setPmList] = useState([]);
  const [currentChat, setCurrentChat] = useState(null)
  const [onlineUsers, setOnlineUsers] = useState([])
  const [sendMessage, setSendMessage] = useState(null)
  const [recieveMessage, setRecieveMessage] = useState(null)
  const [socket, setSocket] = useState(null)
  // const socket = useRef()
  const [seListData] = useAdminSeListMutation()


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
    newSocket.emit("new-user-add", pmInfo._id);
    newSocket.on("get-users", (users) => {
      setOnlineUsers(users);
      console.log('onlineusers:', onlineUsers);
    });
  });
  return () => {
    newSocket.disconnect();
  };
}, [pmInfo])

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

        const { data } = await userChats(pmInfo._id)

        setChats(data)
        // console.log('datachat',data);

      } catch (error) {
        console.log(error);
      }
    }

    getChats()

  }, [pmInfo])
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

    const seResponse = await seListData();

    
    const seData = seResponse.data;


    setSeList(seData);
  } catch (error) {
    console.error('Error fetching PM and SE data', error);
  }
};


const handleChangePse = async(event) => {
  
  const selectedSEName = event.target.value;
  
  setPse(selectedSEName);
  const selectedSE = seList.find(se => se.name === selectedSEName);
  
    if (selectedSE) {
      try {
        const { data } = await userChats(selectedSE._id);
        console.log('bnbnbn',data);
        setChats(data);
        setCurrentChat(data[0]); // Assuming you want to set the first chat related to the selected PM
     
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
            <InputLabel id="se-label">Site Engineer</InputLabel>
            <Select labelId="se-label" id="se"
              value={pse} onChange={handleChangePse}>
              <MenuItem value=''>
                <em>None</em>
              </MenuItem>
              {seList.map((se) => (
                <MenuItem key={se.name} value={se.name} >
                  
                  {se.name}
                </MenuItem>
              //   <div onClick={() => setCurrentChat(chat)}>
              //   <Conversation data={chat} currentUserId={userInfo._id} online={checkOnlineStatus(chat)} />
              // </div>
              ))}
            </Select>
          </FormControl>

          


            {/* {chats.map((chat) => (
              <div onClick={() => setCurrentChat(chat)}>
                <PmConversation data={chat} currentUserId={pmInfo._id} online={checkOnlineStatus(chat)} />
              </div>
            ))} */}
          </div>
        </div>
      </div>


      {/* right side */}
      <div className='Right-side-chat'>

   

          <PmChatBox chat={currentChat} currentUser={pmInfo._id} setSendMessage={setSendMessage}
          recieveMessage = {recieveMessage}/>
        </div>
      </div>
  
    // </Box>
  )
}

export default PmChat

