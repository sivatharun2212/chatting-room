import { useEffect, useState } from "react";
// import { useContext } from "react";
import styles from "./room.module.css";
import { deleteDoc, doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "../../config/firebase"
// import { UserContext } from "../../context/userContext";

const Room = ({room , setRoom}) => {
    // const {userData} = useContext(UserContext);
    const [roomDetails, setRoomDetails]=useState(null)
    const [notifications, setNotifications] = useState([]);
    const exitRoom = () => {
        deleteRoom()
        localStorage.removeItem("current-room");
        setRoom(null);
    }

    useEffect(() => {
        const getRoomDetails = async () => {
            try{
                const roomRef = doc(db, "rooms", room);
                const roomSnapshot = await getDoc(roomRef);
                if(roomSnapshot.exists){
                    const roomData = roomSnapshot.data();
                    setRoomDetails(roomData);
                }
            }catch(error){
                console.log(error.message);
            }

        }
        getRoomDetails();
    },[room])
    useEffect(() => {
        const roomRef = doc(db, "rooms", room);
        const unsubscribe = onSnapshot(roomRef, (snapshot) => {
         if(snapshot.exists){
             setRoomDetails(snapshot.data())
         }
        })

        return () => {
            unsubscribe();
        }
    }, [room])


    // useEffect(() => {
    //    if(roomDetails?.members.length === 1) {
    //     const createdNotif = `just created the room`
    //     const notification = {
    //         name : roomDetails.members[0].name,
    //         notif : createdNotif,
    //     }
    //     setNotifications((prevNotifications) => [...prevNotifications, notification])
    //    }
    //    if(roomDetails?.members.length > 1){
    //     const createdNotif = `just created the room`
    //     const notification = {
    //         name : roomDetails.members[0].name,
    //         notif : createdNotif,
    //     }
    //     setNotifications((prevNotifications) => [...prevNotifications, notification])

    //     let joinedMember;
    //     roomDetails.members.forEach((member)=> {
    //         if(member.email !== userData.email){
    //             joinedMember= member.name
    //             const joinNotif = `just joined the room`
    //             const notification ={
    //                 name : joinedMember,
    //                 notif : joinNotif,
    //             }
    //             return setNotifications((prevNotifications) => [...prevNotifications, notification]) 
    //         }
    //     })
    //    }

    // },[roomDetails, userData.email])






    useEffect(() => {

        if(roomDetails?.members.length > 0){
         const createdNotif = `just created the room`
         const createdNotification = {
             name : roomDetails.members[0].name,
             notif : createdNotif,
         }
         setNotifications([createdNotification])
         if(roomDetails?.members.length > 1){
            const joinedNotification = roomDetails.members.slice(1).map((member)=> {
                return {
                    name: member.name,
                    notif : "just joined the room"
                }
            })
            setNotifications((prevNotifications) => [...prevNotifications, ...joinedNotification])
         }
        }
 
     },[roomDetails])

    const deleteRoom = async() => {
        try{
            const roomRef = doc(db, "rooms",room);
            await deleteDoc(roomRef);
        }catch(error){
            console.log(error.message);
        }
    }
    return (
        <>
        <div className={styles.container}>
            <div className={styles.chatContainer}>
                <div className={styles.chat}>
                    <div className={styles.header}>
                        <h1 className={styles.name}>{roomDetails?.roomName}</h1>
                    </div>
                    <div className={styles.screen}>
                        <h3>{roomDetails?.createdBy}</h3>
                        <h3>{roomDetails?.roomID}</h3>
                        <h3>{roomDetails?.roomPassword}</h3>
                    </div>
                    <div className={styles.msgInput}>

                    </div>

                </div>
                <div className={styles.sideContainer}>
                    <div className={styles.notificationsContainer}>
                        <div className={styles.header}>
                            <h1 className={styles.name}>Notifications</h1>
                        </div>
                        <div className={styles.notifScreen}>
                            {notifications.map((notification) => {
                                return <div>
                                    <h3>{notification.name} {" "} {notification.notif}</h3>
                                </div>
                            })}
                        </div>
                    </div>
                    <div className={styles.activeMembersContainer}>
                        <div className={styles.amheader}>
                            <h1 className={styles.name}>Active Members</h1>
                        </div>
                        <div className={styles.membersScreen}>
                            {roomDetails?.members.map((member) => {
                                return <div className={styles.activeMember}>
                                    {member.name}
                                </div>
                            })}
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.exitContainer}>
                <button className={styles.btn} onClick={exitRoom}>exit</button>
            </div>
        </div>
        </>
    )
}

export default Room;
