"use client";
import React, { useState, useEffect } from "react";
import styles from "@/app/style/sideBar.module.css";
import { FaSignOutAlt } from "react-icons/fa";
import { FiUser, FiTool, FiBookOpen } from "react-icons/fi";
import { useRouter, usePathname } from "next/navigation";
import { BASE_URL_FRONTEND, BASE_URL_API } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";

type User = {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  gender: string;
  direction: string;
  speciality: string;
};

const SideBar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [countIntervention, setCountIntervention] = useState<number>(0);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const email = sessionStorage.getItem("user");
    if (email) {
      fetch(`${BASE_URL_API}/users/email?email=${email}`)
        .then((res) => res.json())
        .then((data: User) => setCurrentUser(data))
        .catch((err) => console.error(err));
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    router.push(`${BASE_URL_FRONTEND}`);
  };

  useEffect(() => {
    if (!currentUser) return;
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${BASE_URL_API}/interventions/invitation?id=${currentUser.id}`,
        );
        const text = await response.text();
        const data = parseInt(text, 10);
        setCountIntervention(data);
      } catch (error) {
        console.error("Erreur fetch invitation count:", error);
      }
    };
    fetchData();
  }, [currentUser]);

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
          <li>
            <Link
              href="/technicien-ministere/journal"
              className={clsx(styles.menuItem, {
                [styles.active]: pathname === "/technicien-ministere/journal",
              })}
            >
              <FiBookOpen />
              <span>Journal</span>
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
