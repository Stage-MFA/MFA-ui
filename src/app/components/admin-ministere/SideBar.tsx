"use client";

import React, { useEffect, useState } from "react";
import styles from "@/app/Style/sideBar.module.css";
import { FaHome, FaSignOutAlt } from "react-icons/fa";
import { FiUser, FiSend } from "react-icons/fi";
import Cookies from "js-cookie";
import { useRouter, usePathname } from "next/navigation";
import { BASE_URL_FRONTEND } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { getUsersWithoutRoleCount } from "@/lib/invitation";

const SideBar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [invitationCount, setInvitationCount] = useState(0);

  const handleLogout = () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    Cookies.remove("user");
    Cookies.remove("role");
    router.push(`${BASE_URL_FRONTEND}`);
  };

  useEffect(() => {
    const handleRefreshCount = () => {
      getUsersWithoutRoleCount().then(setInvitationCount).catch(console.error);
    };

    window.addEventListener("refreshInvitationCount", handleRefreshCount);
    return () =>
      window.removeEventListener("refreshInvitationCount", handleRefreshCount);
  }, []);

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
              href="/admin-ministere"
              className={clsx(styles.menuItem, {
                [styles.active]: pathname === "/admin-ministere",
              })}
            >
              <FaHome />
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link
              href="/admin-ministere/user"
              className={clsx(styles.menuItem, {
                [styles.active]: pathname === "/admin-ministere/user",
              })}
            >
              <FiUser />
              <span>User</span>
            </Link>
          </li>
          <li>
            <Link
              href="/admin-ministere/invitation"
              className={clsx(styles.menuItem, {
                [styles.active]: pathname === "/admin-ministere/invitation",
              })}
            >
              <FiSend />
              <span>Invitation</span>
              {invitationCount > 0 && (
                <span className={styles.badge}>{invitationCount}</span>
              )}
            </Link>
          </li>
          <li>
            <Link
              href="/admin-ministere/profile"
              className={clsx(styles.menuItem, {
                [styles.active]: pathname === "/admin-ministere/profile",
              })}
            >
              <FiUser />
              <span>Profile</span>
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
