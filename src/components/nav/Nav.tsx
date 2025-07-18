import {Link, NavLink} from 'react-router-dom';
import styles from './Nav.module.scss';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import {checkAuth, logout} from "../../redux/authSlice/auth.thunks.ts";
import {Tooltip} from "@mui/material";

import { useNavigate } from 'react-router-dom';
import {useEffect} from "react";
import {useAlert} from "../alert/AlertHook.tsx";


const Nav = () => {
    const {user,status} = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const {showAlert} = useAlert();

    useEffect(() => {
        if (!user && status === 'idle') {
            dispatch(checkAuth());
        }
    }, [user, status, dispatch]);

    const handleLogout = async () => {
        const resultAction = await dispatch(logout());

        if (logout.fulfilled.match(resultAction)) {
            showAlert('success', 'Logout','See you next time.');
            navigate('/login');
        } else {
            console.error("Logout failed.");
        }
    };


    return (
    <nav className={styles.nav}>
      <div className={styles.navLeft}>
        <Link to="">
            <HomeIcon />
        </Link>
      </div>

        <div className={styles.navRight}>
            {user && <NavLink
                to={`/users/${user.id}/profile`}
                className={styles.navUsername}
            >
                {user.username}
            </NavLink>}

            <div onClick={ handleLogout }>
                <Tooltip
                        className={styles.navLogout} title={"Logout"}>
                    <LogoutIcon />
                </Tooltip>
            </div>

            <button
                className={styles.navMenuButton}
                aria-label="Menu"
            >
                ☰
            </button>

            <ul className={styles.navDropdown}>
                <li><Link to="/contact">Contact</Link></li>
                <li><Link to="/posts">Posts</Link></li>
                <li><Link to="/user/posts">My Posts</Link></li>
                {(user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') && (
                    <>
                        <li><Link to="/admin/users">User Management</Link></li>
                        <li><Link to="/admin/messages">Message Management</Link></li>

                    </>
                )}
            </ul>
        </div>
    </nav>
    );
};

export default Nav;

const HomeIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className={styles.navLogo}
    >
        <path d="M12 2.25L1 12h3v8h6v-6h4v6h6v-8h3L12 2.25zM12 6.5l5.25 4.5V18h-3v-6H9v6H6.75V11L12 6.5z"/>
    </svg>
);

const LogoutIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.navLogout}>
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
        <polyline points="16 17 21 12 16 7"></polyline>
        <line x1="21" y1="12" x2="9" y2="12"></line>
    </svg>
);