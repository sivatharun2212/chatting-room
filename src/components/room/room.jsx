import { useEffect, useState, useContext } from "react";
import styles from "./room.module.css";
import { deleteDoc, doc, getDoc } from "firebase/firestore";
import { db } from "../../config/firebase"
import { UserContext } from "../../context/userContext";

const Room = ({room , setRoom}) => {
    const {userData} = useContext(UserContext);
    const [roomDetails, setRoomDetails]=useState(null)
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
                    console.log("roomdetails",roomDetails);
                }
            }catch(error){
                console.log(error.message);
            }

        }
        getRoomDetails();
    },[room])

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
                    </div>
                    <div className={styles.activeMembersContainer}>
                        <div className={styles.amheader}>
                            <h1 className={styles.name}>Active Members</h1>
                        </div>
                        <div className={styles.membersScreen}>
                            {roomDetails?.members.map((member) => {
                                return <div className={styles.activeMember}>
                                    {member}
                                </div>
                            })

                            }
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
