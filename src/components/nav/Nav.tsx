import {Link, NavLink} from 'react-router-dom';
import styles from './Nav.module.scss';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import {checkAuth, logout} from "../../redux/authSlice/auth.thunks.ts";
import {Tooltip} from "@mui/material";
// import LogoutIcon from '../../assets/icons/logout.svg';
// import HomeIcon from '../../assets/icons/home.svg';

import { useNavigate } from 'react-router-dom';


const Nav = () => {
    const {user} = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleLogout = () =>{
        dispatch(logout());
        dispatch(checkAuth());
        console.log("Log out success.")
        navigate('/login', { replace: true });
    }


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
                        className={styles.navLogout} title={"Logout"} onClick={handleLogout}>
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
    <svg xmlns="XXXXXXXXXXXXXXXXXXXXXXXXXX" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.navLogout}>
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
        <polyline points="16 17 21 12 16 7"></polyline>
        <line x1="21" y1="12" x2="9" y2="12"></line>
    </svg>
    // <svg
    //     className={styles.navLogout}
    //     xmlns="http://www.w3.org/2000/svg"
    //     viewBox="0 0 24 24"
    //     fill="currentColor"
    // >
    //     <path
    //         d="M17 7L15.59 8.41 18.17 11H8v2h10.17l-2.58 2.59L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
    // </svg>
);