import { useState } from 'react';
import './App.css';
import Auth from "./components/authentication/auth";
import Cookies from "universal-cookie";
import { auth } from './config/firebase';
import { signOut } from 'firebase/auth';
import Home from './components/home/home';
import Room from './components/room/room';

function App() {
  const cookies = new Cookies();
  const currentRoom = JSON.parse(localStorage.getItem("current-room")) || null;
  const [isAuth, setIsAuth] = useState(cookies.get("auth-token"));
  const [room, setRoom] = useState(currentRoom)
  const signout = async() => {
    await signOut(auth);
    cookies.remove("auth-token");
    localStorage.removeItem("userDetails");
    localStorage.removeItem("current-room");
    setIsAuth(false)
  }

  if(!isAuth){
    return(
      <>
        <div className="App">
          <h1 className='heading'>chatting r<span className='oo-text'>oo</span>ms</h1>
          <Auth setIsAuth={setIsAuth}/>
        </div>
      </>
    )
  }
  return (
    <>
    {room ? (<div className='chatting-page'>
              <Room room={room} setRoom={setRoom} signout={signout}/>
        </div>) : (<div className='home-page'>
                    <Home setRoom={setRoom} signout={signout}/>
                  </div>)}
    </>
  );
}

export default App;

