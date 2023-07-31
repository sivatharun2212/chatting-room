import googleIcon from "../../assets/google-icon.svg";
import { auth,provider,db } from "../../config/firebase";
import { signInWithPopup } from "firebase/auth"
import styles from "./auth.module.css";
import Cookies from "universal-cookie";
import { doc,setDoc, } from "firebase/firestore";
import { useContext } from "react";
import { UserContext } from "../../context/userContext";


const Auth = ({ setIsAuth }) => {
    const {setUserData} = useContext(UserContext);
    const cookies = new Cookies();
    const signin = async() => {
        try{
            const authUser = await signInWithPopup(auth, provider);
            console.log(authUser);
            cookies.set("auth-token", authUser.user.refreshToken);
            const requiredUserData = {
                name: authUser?.user?.displayName,
                email: authUser?.user?.email,
                photo: authUser?.user?.photoURL,
            };
            const docRef = doc(db, "users", authUser?.user?.email);
            await setDoc(docRef, requiredUserData)
            setIsAuth(true);
            setUserData(authUser?.user)
        }catch(error){
            console.error(error.message);
        }
    }
    return (
        <section className={styles.container}>
            <div className={styles.headingContainer}>
                <h1 className={styles.heading}>sign in to get started</h1>
            </div>
            <div className={styles.signInContainer}>
                <div className={styles.signInWraper}>
                <div className={styles.signin} onClick={signin}>
                    <img className={styles.signinImg} src={googleIcon} alt="googleIcon" />
                    <h3 className={styles.signinTxt} >Sign in with Google</h3>
                </div>
                <span className={styles.signinNote}>Other ways to sign in</span>
                </div>
            </div>
        </section>
    )
}

export default Auth;