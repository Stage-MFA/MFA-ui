"use client";
import React from "react";
import styles from "@/app/Style/sideBar.module.css";
import { FaHome, FaSignOutAlt } from "react-icons/fa";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { BASE_URL_FRONTEND } from "@/lib/constants";
import Image from "next/image";

const SideBar: React.FC = () => {
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    Cookies.remove("user");

    router.push(`${BASE_URL_FRONTEND}`);
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoBlock}>
        <Image src="/MAF logo.jpg" alt="Logo " className={styles.logoImg} />
        <div className={styles.status}>Ministère Force Armée</div>
      </div>

      <nav className={styles.menuNav}>
        <ul className={styles.menuList}>
          <li className={styles.menuItem}>
            <span style={{ fontSize: "1.2rem" }}>
              <FaHome />
            </span>
            <span>Dashboard</span>
          </li>
        </ul>
      </nav>

      <div className={styles.footer}>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          <FaSignOutAlt />
          Déconnexion
        </button>
      </div>
    </aside>
  );
};

export default SideBar;
