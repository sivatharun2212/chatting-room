import { useEffect, useState } from "react";
import { useContext } from "react";
import styles from "./room.module.css";
import { deleteDoc, doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../config/firebase"
import { UserContext } from "../../context/userContext";

const Room = ({room , setRoom}) => {
    const {userData} = useContext(UserContext);
    const [roomDetails, setRoomDetails]=useState(null)
    const [notifications, setNotifications] = useState([]);
    const [allNotifications, setAllNotifications] = useState([]);
    // const [isJoinedUserLeft, setIsJoinedUserLeft] = useState(false);
    let userLeft = false;

    const exitRoom = () => {
        deleteRoom()
        updateExitRoom();
        // setIsJoinedUserLeft(true)
        userLeft = true
        console.log("user exit");
        // displayExitNotification();
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





    useEffect(() => {
        console.log("user has left", userLeft);
        if(roomDetails?.members.length > 0){
         const createdNotif = `Created the room at`
         const createdNotification = {
             name : roomDetails.members[0].name,
             notif : createdNotif,
             time : roomDetails?.createdAt,
         }
         setNotifications([createdNotification])
         if(roomDetails?.members.length > 1){
            const joinedNotification = roomDetails.members.slice(1).map((member)=> {
                return {
                    name: member.name,
                    notif: "joined the room at",
                    time: member.joinedAt,
                }
            })
            setNotifications((prevNotifications) => [...prevNotifications, ...joinedNotification])
         }
         if(userLeft){
            console.log("exit user");
            const time = new Date().toLocaleTimeString();
            const exitNotif = "left the room at";
            const exitNotification = {
                name: userData.displayName,
                notif: exitNotif,
                time,
            };
            setNotifications((prevNotifications) => [...prevNotifications, exitNotification]);
         }
         console.log("dependency working");
        }

 
     },[roomDetails])

     useEffect(() => {
        console.log("mmNOTIF", notifications);
        const newNotifications = notifications.filter(
            (notification) =>
                !allNotifications.some(
                    (existingNotification) =>
                        existingNotification.name === notification.name &&
                        existingNotification.notif === notification.notif &&
                        existingNotification.time === notification.time
                )
        );

        setAllNotifications((prevAllNotifications) => [...prevAllNotifications, ...newNotifications]);
        console.log("NOTIF", notifications);
    }, [notifications]);
    
    const deleteRoom = async() => {
        if(roomDetails?.createdBy === userData?.email){
            try{
                const roomRef = doc(db, "rooms",room);
                await deleteDoc(roomRef);
            }catch(error){
                console.log(error.message);
            }
        }
    }

    const updateExitRoom = async() => {
        if(roomDetails?.createdBy !== userData?.email){
            const roomData = roomDetails;
            const updatedUsers = roomData?.members?.filter((member) => member.email !== userData.email)
            const roomRef = doc(db, "rooms", room)
            await updateDoc(roomRef, {members: updatedUsers})
     }
    }


    const displayExitNotification = () => {
        // if (roomDetails?.createdBy !== userData?.email) {
        //     setIsJoinedUserLeft(true);
        // }
        setIsJoinedUserLeft(true)
    };
    

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
                            {allNotifications.map((notification) => {
                                return <div>
                                    <h3 className={styles.notification}>{notification.name} {" "} {notification.notif}{" "}<span className={styles.time}>{notification.time}</span> </h3>
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
