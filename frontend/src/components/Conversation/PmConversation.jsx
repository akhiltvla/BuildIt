import React, { useEffect, useState } from 'react'
import { useGetUserPmMutation } from '../../slices/pmApiSlice'
import { useSelector } from 'react-redux'
import "./Conversation.css";





const PmConversation = ({ data, currentUserId, online }) => {
    const { pmInfo } = useSelector((state) => state.pmAuth)
    const [userData, setUserData] = useState(null)
    const [getUser] = useGetUserPmMutation()
   
    useEffect(() => {

        const userId = data.members.find((id) => id !== currentUserId)
        console.log('userPmId',userId);
        const getUserData = async () => {
            try{
                const { data } = await getUser(userId)
                setUserData(data)
            }catch(error){
                console.log(error);
            }    
        }
         getUserData()
    }, [])


    
 
    return (
        <>
      <div className="follower conversation">
        <div>
         {online && <div className="online-dot"></div>}
          <img
            src={userData?.photo? userData.photo : ""}
            alt="Profile"
            className="followerImage"
            style={{ width: "50px", height: "50px" }}
          />
          <div className="name" style={{fontSize: '0.8rem'}}>
            <span>{userData?.name}</span>
            <span >{online? 'Online': 'Offline'}</span>
          </div>
        </div>
      </div>
      <hr style={{ width: "85%", border: "0.1px solid #ececec" }} />
    </>
    )
}

export default PmConversation
