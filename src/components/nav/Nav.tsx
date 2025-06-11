import { useState } from 'react';
// import { logout } from '../../redux/userSlice/user.thunks';
import { Link } from 'react-router-dom';
import ReactIcon from '../../assets/icons/react.svg';
import styles from './Nav.module.scss';
import { fakeUser }   from '../../mock/user';
// import { useAppDispatch } from '../../redux/hooks';
// import { useAppSelector, useAppDispatch } from '../../redux/hooks';

const Nav = () => {
    // const user = useAppSelector((state: any) => state.user.user);
    // const dispatch = useAppDispatch();
    const user = fakeUser;
    
    const handleLogout = () =>{
        // dispatch(logout());
        console.log("Log out success.")
    }

console.log("Nav rendered");

    return (
    <nav className={styles.nav}>
      <div className={styles.navLeft}>
        <Link to="/home">
          <img src={ReactIcon} alt="Home" className={styles.navLogo} />
        </Link>
      </div>

      <div className={styles.navRight}>
            <Link
            to={`/users/${user.id}/profile`}
            className={styles.navUsername}
            >
            {user.username}
            </Link>
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