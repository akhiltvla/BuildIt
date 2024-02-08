import React, { useEffect, useRef, useState } from 'react'
import { useGetUserMutation } from '../../slices/userApiSlice'
import { useGetMessagesMutation, useAddMessagesMutation } from '../../slices/messageApiSlice'
import './ChatBox.css'
import { format } from 'timeago.js'
import InputEmoji from 'react-input-emoji'

const ChatBox = ({ chat, currentUser, setSendMessage, recieveMessage}) => {
    const [userData, setUserData] = useState(null)
    const [messages, setMessages] = useState([])
    const [getUser] = useGetUserMutation()
    const [getMessage] = useGetMessagesMutation()
    const [newMessage, setNewMessage] = useState('')
    const [addMessage] = useAddMessagesMutation()
    const scroll = useRef()


    useEffect(() => {
        if (recieveMessage !== null && recieveMessage.chatId === chat?._id) {
            setMessages([...messages, recieveMessage])
        }
    }, [recieveMessage])


    // fetchng data for header
    useEffect(() => {
        const userId = chat?.members?.find((id) => id !== currentUser)
        console.log('userid::::', userId);
        const getUserData = async () => {
            try {
                const { data } = await getUser(userId)
                setUserData(data)
                console.log('datatto', data);

            } catch (error) {
                console.log(error);
            }
        }
        if (chat !== null) getUserData()

    }, [chat, currentUser])

    //fetching data for messages

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const { data } = await getMessage(chat._id)
                 console.log('dataa getmessage',data);
                setMessages(data)
            } catch (error) {
                console.log(error);
            }
        }
        if (chat !== null) fetchMessages()
    }, [chat])

    const handleChange = (newMessage) => {
        setNewMessage(newMessage)
    }

    const handleSend = async (e) => {
        e.preventDefault();
        const message = {
            senderId: currentUser,
            text: newMessage,
            chatId: chat._id,
        }
        //Send message to database
        try {
            const { data } = await addMessage(message)
            setMessages([...messages, data])
            setNewMessage('')
        } catch (error) {
            console.log(error);
        }

        //send message to socket server

        const recieverId = chat.members.find((id) => id !== currentUser)
        setSendMessage({ ...message, recieverId })
    }

    // always scroll to last message

    useEffect(() => {
        scroll.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    return (
        <>
            <div className='ChatBox-container'>
                {chat ? (<>
                    <div className="chat-header">
                        <div className="follower">
                            <div>

                                <img
                                    src={userData?.photo ? userData.photo : ""}
                                    alt={userData?.name}
                                    className="followerImage"
                                    style={{ width: "50px", height: "50px" }}
                                />
                                <div className="name" style={{ fontSize: '0.8rem' }}>
                                    <span>{userData?.name}</span>

                                </div>
                            </div>
                        </div>
                        <hr style={{ width: "85%", border: "0.1px solid #ececec" }} />
                    </div>
                    {/* chatbox Messages */}

                    <div className="chat-body">
                        {messages.map((message) => (
                            <>
                                <div ref={scroll}
                                    className={message.senderId === currentUser ? 'messageown' : 'message'}>
                                    <span>{message.text}</span>{' '}
                                    <span>{format(message.createdAt)}</span>
                                </div>
                            </>
                        ))}
                    </div>


                    {/* chat-sender */}
                    <div className='chat-sender'>
                        {/* <div>+</div> */}
                        <InputEmoji value={newMessage} onChange={handleChange} />
                        <div className="send-button button" onClick={handleSend}>Send</div>
                    </div>
                </>
                ) : (
                    <span className='chatbox-empty-message'>
                        Tap on a Chat to Start Conversation. . .
                    </span>
                )}

            </div>
        </>
    )
}

export default ChatBox
