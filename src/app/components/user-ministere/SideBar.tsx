"use client";
import React from "react";
import styles from "@/app/Style/sideBar.module.css";
import { FaSignOutAlt } from "react-icons/fa";
import { FiUser, FiTool } from "react-icons/fi";
import Cookies from "js-cookie";
import { useRouter, usePathname } from "next/navigation";
import { BASE_URL_FRONTEND } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";

const SideBar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    Cookies.remove("user");
    Cookies.remove("role");
    router.push(`${BASE_URL_FRONTEND}`);
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoBlock}>
        <Image
          src="/MAF logo.jpg"
          alt="Logo"
          height={600}
          width={600}
          className={styles.logoImg}
        />
        <div className={styles.status}>Ministère Force Armée</div>
      </div>

      <nav className={styles.menuNav}>
        <ul className={styles.menuList}>
          <li>
            <Link
              href="/user-ministere"
              className={clsx(styles.menuItem, {
                [styles.active]: pathname === "/user-ministere",
              })}
            >
              <FiUser />
              <span>Profil</span>
            </Link>
          </li>
          <li>
            <Link
              href="/user-ministere/demande-maintenance"
              className={clsx(styles.menuItem, {
                [styles.active]:
                  pathname === "/user-ministere/demande-maintenance",
              })}
            >
              <FiTool />
              <span>Maintenance</span>
            </Link>
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
