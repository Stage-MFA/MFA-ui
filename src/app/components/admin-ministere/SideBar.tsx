"use client";

import styles from "@/app/style/sideBar.module.css";
import { FaHome, FaSignOutAlt, FaSitemap, FaStickyNote } from "react-icons/fa";
import { FiUser, FiSend, FiTool, FiBookOpen } from "react-icons/fi";
import { useRouter, usePathname } from "next/navigation";
import { BASE_URL_FRONTEND, BASE_URL_API } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { useState, useEffect } from "react";

const SideBar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [countNoRole, setCountNoRole] = useState<number>(0);
  const [countRequest, setCountRequest] = useState<number>(0);

  const handleLogout = () => {
    sessionStorage.clear();
    router.push(`${BASE_URL_FRONTEND}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BASE_URL_API}/users/invitation`);
        const data = await response.json();
        setCountNoRole(data);
      } catch (error) {
        console.error("Erreur fetch invitation count:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BASE_URL_API}/request/invitation`);
        const data = await response.json();
        setCountRequest(data);
      } catch (error) {
        console.error("Erreur fetch invitation count:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const eventSource = new EventSource(`${BASE_URL_API}/invitation`);

    eventSource.addEventListener("invitation-count", (event: MessageEvent) => {
      const updatedCount = parseInt(event.data);
      setCountNoRole(updatedCount);
    });

    eventSource.addEventListener(
      "count-request-intervention",
      (event: MessageEvent) => {
        const updatedCount = parseInt(event.data);
        setCountRequest(updatedCount);
      },
    );

    eventSource.onerror = (error) => {
      console.error("Erreur SSE:", error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
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
              <span>Tableau de bord</span>
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
              <span>Utilisateur</span>
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
              {countNoRole > 0 && (
                <span className={styles.badge}>{countNoRole}</span>
              )}
            </Link>
          </li>
          <li>
            <Link
              href="/admin-ministere/request-intervention"
              className={clsx(styles.menuItem, {
                [styles.active]:
                  pathname === "/admin-ministere/request-intervention",
              })}
            >
              <FaStickyNote />
              <span>Demande d&apos;intervention</span>
              {countRequest > 0 && (
                <span className={styles.badge}>{countRequest}</span>
              )}
            </Link>
          </li>
          <li>
            <Link
              href="/admin-ministere/maintenance"
              className={clsx(styles.menuItem, {
                [styles.active]: pathname === "/admin-ministere/maintenance",
              })}
            >
              <FiTool />
              <span>Maintenance</span>
            </Link>
          </li>
          <li>
            <Link
              href="/admin-ministere/journal"
              className={clsx(styles.menuItem, {
                [styles.active]: pathname === "/admin-ministere/journal",
              })}
            >
              <FiBookOpen />
              <span>Journal</span>
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
          <li>
            <Link
              href="/admin-ministere/material"
              className={clsx(styles.menuItem, {
                [styles.active]: pathname === "/admin-ministere/material",
              })}
            >
              <FiTool />
              <span>Material</span>
            </Link>
          </li>
          <li>
            <Link
              href="/admin-ministere/speciality"
              className={clsx(styles.menuItem, {
                [styles.active]: pathname === "/admin-ministere/speciality",
              })}
            >
              <FaSitemap />
              <span>Organisation</span>
            </Link>
          </li>
        </ul>
      </nav>

      <div className={styles.footer}>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          <FaSignOutAlt />
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  );
};

export default SideBar;
