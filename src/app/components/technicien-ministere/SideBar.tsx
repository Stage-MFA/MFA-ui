"use client";
import React from "react";
import styles from "@/app/Style/sideBar.module.css";
import { FaSignOutAlt } from "react-icons/fa";
import { FiUser, FiTool } from "react-icons/fi";
import { useRouter, usePathname } from "next/navigation";
import { BASE_URL_FRONTEND, BASE_URL_API } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { useState, useEffect } from "react";

const SideBar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [countIntervention, setCountIntervention] = useState<number>(0);

  const handleLogout = () => {
    sessionStorage.clear();
    router.push(`${BASE_URL_FRONTEND}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${BASE_URL_API}/interventions/invitation`,
        );
        const data = await response.json();
        setCountIntervention(data);
      } catch (error) {
        console.error("Erreur fetch invitation count:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const eventSource = new EventSource(`${BASE_URL_API}/invitation`);

    eventSource.addEventListener(
      "count-intervention",
      (event: MessageEvent) => {
        const updatedCount = parseInt(event.data);
        setCountIntervention(updatedCount);
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
              href="/technicien-ministere"
              className={clsx(styles.menuItem, {
                [styles.active]: pathname === "/technicien-ministere",
              })}
            >
              <FiUser />
              <span>Profil</span>
            </Link>
          </li>
          <li>
            <Link
              href="/technicien-ministere/intervention"
              className={clsx(styles.menuItem, {
                [styles.active]:
                  pathname === "/technicien-ministere/intervention",
              })}
            >
              <FiTool />
              <span>Intervention</span>
              {countIntervention > 0 && (
                <span className={styles.badge}>{countIntervention}</span>
              )}
            </Link>
          </li>
          <li>
            <Link
              href="/technicien-ministere/maintenance"
              className={clsx(styles.menuItem, {
                [styles.active]:
                  pathname === "/technicien-ministere/maintenance",
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
