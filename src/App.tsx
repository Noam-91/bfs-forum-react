import './App.css'
import Nav from "./components/nav/Nav.tsx";
import { Outlet } from 'react-router-dom';
import {useEffect} from "react";
import {checkAuth, login} from "./redux/authSlice/auth.thunks.ts";
import {useAppDispatch} from "./redux/hooks.ts";
function App() {
    //testOnly

    const dispatch = useAppDispatch();
    useEffect(() => {
        const username = 'test';
        const password = 'test123';
        dispatch(login({username,password}));
        dispatch(checkAuth());
    }, [dispatch]);
  return (
    <>
      <Nav/>
      <Outlet/>
    </>
  )
}

export default App
