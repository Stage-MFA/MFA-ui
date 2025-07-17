"use client";

import React from "react";
import { FiUser } from "react-icons/fi";
import styles from "@/app/style/Navbar.module.css";

interface NavbarProps {
  userName?: string;
}

const Navbar: React.FC<NavbarProps> = ({ userName = "Utilisateur" }) => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.leftSection}>
        <div className={styles.searchGroup}></div>
      </div>
      <div className={styles.rightSection}>
        <div className={styles.userInfo}>
          <FiUser className={styles.userIcon} />
          <span className={styles.userName}>{userName}</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
