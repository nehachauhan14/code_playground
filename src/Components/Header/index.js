import React from "react";
import styles from "./styles.module.scss";

const Header = () => {
  return (
    <header className={styles.header}>
      <span className={styles.headerLogo}>AI playground</span>
      <ul className={styles.headerLinks}>
        <li>Learn AI</li>
        <li>Docs</li>
        <li className={styles.profileLink}>
          <img src="https://s3.amazonaws.com/uifaces/faces/twitter/stan/48.jpg" className={styles.avatar} alt="profile image" />
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
