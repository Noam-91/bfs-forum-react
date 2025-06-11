import {Link, NavLink} from 'react-router-dom';
import ReactIcon from '../../assets/icons/react.svg';
import styles from './Nav.module.scss';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import {logout} from "../../redux/authSlice/auth.thunks.ts";
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
          <img src={ReactIcon} alt="Home" className={styles.navLogo} />
        </Link>
      </div>

      <div className={styles.navRight}>
          {user && <NavLink
            to={`/users/${user.id}/profile`}
            className={styles.navUsername}
            >
            {user.username}
            </NavLink>}
        <button className={styles.navLogout} onClick={handleLogout}>
          Logout
        </button>

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