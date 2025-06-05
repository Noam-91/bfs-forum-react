import styles from "./Nav.module.scss"
import {NavLink} from "react-router-dom";
const Nav = () => {
    return (
        <nav className={styles.container}>
            <NavLink to={"/"}>Home</NavLink>
        </nav>
    );
};

export default Nav;