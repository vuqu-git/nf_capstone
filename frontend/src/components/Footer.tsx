import { Link } from "react-router-dom";
import styles from "./Footer.module.css";

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.linksContainer}>
                <div className={styles.line} />
                <div className={styles.links}>
                    <Link to="/impressum">Impressum</Link>
                    <Link to="/datenschutzhinweise">Datenschutzhinweise</Link>
                </div>
            </div>
        </footer>
    );
}