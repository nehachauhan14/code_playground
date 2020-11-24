import React from "react";
import styles from "./styles.module.scss";

const Header = (props) => {

  const openSidenav = () => {
    document.getElementById("sidebar").style.width = "250px";
  }

  const closeSidenav = () => {
    document.getElementById("sidebar").style.width = "0";
  }

  if(!props.isDesktop) {
    return (
      <header className={`flex jcSpaceBetween alignCenter ${styles.header}`}>
      <span className={styles.headerLogo}>AI playground</span>
      <span id="hamburger" onClick={() => openSidenav()} className={styles.headerLinks}>
          <svg viewBox="0 0 100 80" width="30" height="30" fill="#ffffffcc">
              <rect width="100" height="20" rx="8"></rect>
              <rect y="30" width="100" height="20" rx="8"></rect>
              <rect y="60" width="100" height="20" rx="8"></rect>
          </svg>
      </span>
      <div id="sidebar" className={styles.sidebar}>
        <a href="javascript:void(0)"  className={styles.closebtn} onClick={()=> closeSidenav()}><img src="assets/images/close.svg" /></a>
        <a href="javascript:void(0)"><img src="assets/images/avatar_comics.png" className={styles.avatar} alt="profile image" /></a>
        <a href="javascript:void(0)">Learn AI</a>
        <a href="javascript:void(0)">Docs</a>
      </div>
    </header>
    )
}

  return (
    <header className={`flex jcSpaceBetween alignCenter ${styles.header}`}>
      <span className={styles.headerLogo}>AI playground</span>
      <ul className={`flex jcSpaceEvenly alignCenter ${styles.headerLinks}`}>
        <li>Learn AI</li>
        <li>Docs</li>
        <li className={`flex jcSpaceBetween alignCenter ${styles.profileLink}`}>
          <img src="assets/images/avatar_comics.png" className={styles.avatar} alt="profile image" />
          <span className={styles.text}>Account</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="13"
            height="8"
            viewBox="0 0 13 8"
          >
            <path
              fill="#C6C6C6"
              fill-rule="evenodd"
              d="M11.33.3l-4.6 4.6L2.13.3.73 1.7l6 6 6-6z"
            />
          </svg>
        </li>
      </ul>
    </header>
  );
};

export default Header;
