import styles from "../styles/navbar.module.css"
import Link from "next/link"

export default function Navbar() {
  return (
    <nav id={styles.navbar}>
      <div className={styles.containerNavbar}>

        <Link className={styles.logoLink} href="/">
          Burgas App
          {/* <img className="logo-navbar" src={logo} alt="" /> */}
        </Link>

        <div className={styles.menu}>
          <Link className={styles.linksMenu} href="/"> Stocks </Link>
          <Link className={styles.linksMenu} href="/"> Comprar </Link>
          <Link className={styles.linksMenu} href="/"> Extra </Link>
        </div>

      </div>
    </nav>
  )
}
