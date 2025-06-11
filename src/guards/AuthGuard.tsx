import {Navigate, Outlet} from "react-router-dom";
import {useEffect} from "react";
import {checkAuth} from "../redux/authSlice/auth.thunks.ts";
import {useAppDispatch, useAppSelector} from "../redux/hooks.ts";

const AuthGuard = () => {
    const {user} = useAppSelector(state=>state.auth);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(checkAuth());
    }, [dispatch]);

    return user? <Outlet /> : <Navigate to={'/'} />;
};

export default AuthGuard;