import {Navigate, Outlet} from "react-router-dom";
import {useAlert} from "../components/alert/AlertHook.tsx";
import {selectIsLoggedIn} from "../redux/authSlice/auth.slice.ts";
import {useEffect} from "react";
import {checkAuth} from "../redux/authSlice/auth.thunks.ts";
import {useAppDispatch, useAppSelector} from "../redux/hooks.ts";

const AuthGuard = () => {
    const isLoggedIn = useAppSelector(selectIsLoggedIn);
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(checkAuth());
    }, [dispatch]);

    // Showing alert
    const {showAlert} = useAlert();
    if(!isLoggedIn) showAlert('error','Unauthorized', 'Please login first');

    return isLoggedIn? <Outlet/> : <Navigate to={'/'} />;
};

export default AuthGuard;