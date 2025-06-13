import {Navigate, Outlet, useNavigate} from "react-router-dom";
import {useEffect} from "react";
import {checkAuth} from "../redux/authSlice/auth.thunks.ts";
import {useAppDispatch, useAppSelector} from "../redux/hooks.ts";
import type {RootState} from "../redux/store.ts";
import {selectIsLoggedIn} from "../redux/authSlice/auth.slice.ts";

const AuthGuard = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const isLoggedIn = useAppSelector(selectIsLoggedIn);
    const authStatus = useAppSelector((state: RootState) => state.auth.status);

    useEffect(() => {
        if (authStatus === 'idle') {
            dispatch(checkAuth());
        }
    }, [dispatch, authStatus]);

    useEffect(() => {
        if ((authStatus === 'succeeded' && !isLoggedIn) || authStatus === 'failed') {
            console.log('User is not logged in or authentication failed. Redirecting to login...');
            navigate('/login'); // Redirects to the login page
        }
    }, [isLoggedIn, authStatus, navigate]);


    return isLoggedIn? <Outlet /> : <Navigate to={'/login'} />;
};

export default AuthGuard;