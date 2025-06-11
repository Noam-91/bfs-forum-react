import {Navigate, Outlet} from "react-router-dom";
import {useAlert} from "../components/alert/AlertHook.tsx";
import {selectIsLoggedIn } from "../redux/userSlice/user.slice.ts";
import {useEffect} from "react";
import {checkAuth} from "../redux/userSlice/user.thunks.ts";
import {useAppDispatch, useAppSelector} from "../redux/hooks.ts";

const AuthGuard = () => {
    // const isLoggedIn = useAppSelector(selectIsLoggedIn);
    const isLoggedIn =true
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(checkAuth());
    }, [dispatch]);

    // Showing alert
    const {showAlert} = useAlert();

    if(!isLoggedIn) showAlert('error','Unauthorized', 'Please login first');

    // useEffect(() => {
    // if (isLoggedIn === false) {
    //     showAlert("error", "Unauthorized", "Please login first");
    //     }
    // }, [isLoggedIn, showAlert]);

    
    return isLoggedIn? <Outlet/> : <Navigate to={'/'} />;
};

export default AuthGuard;