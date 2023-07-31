import styles from "./room.module.css";
const Room = ({setRoom, signout}) => {

    const exitRoom = () => {
        setRoom(null)
    }

    return (
        <>
        <div className={styles.container}>
        <h1>room</h1>
        <button onClick={signout}>sign out</button>
        <button onClick={exitRoom}>exit</button>
        </div>
        </>
    )
}

export default Room;
