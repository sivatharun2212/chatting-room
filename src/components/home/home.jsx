import { useState, useContext, useEffect } from "react";
import styles from "./home.module.css";
import { doc, setDoc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../../config/firebase";
import { UserContext } from "../../context/userContext";

const Home = ({signout,setRoom }) => {
    const {userData} = useContext(UserContext);
    // const [fetchedUserData, setFetchedUserData] = useState(null);
    const [isCreated, setIsCreated] = useState(false);
    const [isJoined, setIsJoined] = useState(false);
    const [createId, setCreateId] = useState("");
    const [createPass, setCreatePass] = useState("");
    const [joinId, setJoinId] = useState("");
    const [joinPass, setJoinPass] = useState("");
    const [roomData, setRoomData] = useState(null);
    // const [isLoading, setIsLoading] = useState(true);

    const getRoomData = async() => {
        if(joinId && joinPass !== ""){
            const roomRef = doc(db, "rooms", joinId);
            const roomSnapshot = await getDoc(roomRef);
            if(roomSnapshot.exists){
                setRoomData(roomSnapshot.data())
                console.log("roomData",roomData);
            }
        }

    }
    useEffect(() => {
            getRoomData();
    }, [joinId,joinPass])

    const handlecreated = () => {
        setIsCreated(true);
        setIsJoined(false);
    }
    const handlejoined = () => {
        setIsJoined(true);
        setIsCreated(false);
    }
    
    const joinRoom = async(roomData) => {
        if(joinId && joinPass !== ""){
            localStorage.setItem("current-room", JSON.stringify(joinId));
            if(roomData?.roomID === joinId && roomData?.roomPassword === joinPass){
                setRoom(joinId);
                const roomRef = doc(db, "rooms", joinId)
                const joinedUserEmil = userData?.email;
                const joinedUserName = userData?.displayName;
                const joinedAt = new Date().toLocaleTimeString();
                try{
                    await updateDoc(roomRef, {members: arrayUnion({email: joinedUserEmil, name: joinedUserName, joinedAt})})
                }catch(error){
                    console.error(error.message)
                }
            }            
        }else{
            alert("fill out the fileds")
        }
    }   

    const createRoom = async (event) => {
        event.preventDefault();
        if(createId && createPass !== ""){
            localStorage.setItem("current-room", JSON.stringify(createId));
            setRoom(createId);
            console.log(userData);
            const createdAt = new Date().toLocaleTimeString();
            const docRef = doc(db, "rooms", createId)
            await setDoc(docRef,{
                createdBy : userData?.email,
                roomID : createId,
                roomName : `${userData?.displayName}'s Room`,
                roomPassword: createPass,
                createdAt,
                members:[{
                    email: userData?.email,
                    name: userData?.displayName,
                }],
                messages : [{
                    sentBy : userData?.email,
                    sentAt : createdAt,
                    message : "hii"
                }]
            })
        }else{
            alert("fill out the fileds")
        }
    }
    
    return <>
    <div className={styles.container}>
        <div className={styles.displayName}>
            <h1 className={styles.welcomeTxt}>welcome <span className={styles.name}>{userData?.displayName}</span></h1>
        </div>
        <div className={styles.roomType}>
            <div className={styles.createContainer}>
                <h1 className={styles.Heading}>Create Room</h1>
                <button onClick={handlecreated} className={styles.btn}>Create a new room</button>
            </div>
            <div className={styles.joinContainer}>
                <h1 className={styles.Heading}>Join Room</h1>
                <button onClick={handlejoined} className={styles.btn}>join existing room</button>
            </div>
        </div>
        <div className={styles.ActionContainer}>
            {isCreated && <div className={styles.creating}>
            <form className={styles.createForm} onSubmit={createRoom}>
                    <input type="text" onChange={(e) => setCreateId(e.target.value)} value={createId} placeholder="Room Id"/>
                    <input type="password" onChange={(e) => setCreatePass(e.target.value)} value={createPass} placeholder="Password"/>
                    <button className={styles.roomBtn} type="submit">create</button>
                </form>
            </div>}
            {isJoined && <div className={styles.joining}>
                <form className={styles.joinForm} onSubmit={(event) => {event.preventDefault(); joinRoom(roomData)}}>
                    <input type="text" onChange={(e) => setJoinId(e.target.value)} value={joinId} placeholder="Room Id"/>
                    <input type="password" onChange={(e) => setJoinPass(e.target.value)} value={joinPass} placeholder="Password"/>
                    <button className={styles.roomBtn} type="submit">join</button>
                </form>
            </div>}
        </div>
    </div>
    <button className={styles.btn} onClick={signout}>sign out</button>
    </>
}

export default Home;
