import {Link, NavLink} from 'react-router-dom';
import styles from './Nav.module.scss';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import {logout} from "../../redux/authSlice/auth.thunks.ts";
import {Tooltip} from "@mui/material";
import LogoutIcon from '../../assets/icons/logout.svg';
import HomeIcon from '../../assets/icons/home.svg';

import { useNavigate } from 'react-router-dom';


const Nav = () => {
    const {user} = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleLogout = () =>{
        dispatch(logout());
        console.log("Log out success.")
        navigate('/login', { replace: true });
    }

    return (
    <nav className={styles.nav}>
      <div className={styles.navLeft}>
        <Link to="/home">
            {/*<HomeIcon />*/}
            <img src={HomeIcon} alt="Home" width={24} height={24} />
        </Link>
      </div>

        <div className={styles.navRight}>
            {user && <NavLink
                to={`/users/${user.id}/profile`}
                className={styles.navUsername}
            >
                {user.username}
            </NavLink>}

            <Tooltip className={styles.navLogout} title={"Logout"} onClick={handleLogout}>
                {/*<LogoutIcon />*/}
                <img src={LogoutIcon} alt="Logout" width={24} height={24} />
            </Tooltip>
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