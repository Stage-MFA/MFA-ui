"use client";
import SideBar from "../components/admin-ministere/SideBar";
import styles from "@/app/style/adminLayout.module.css";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import Navbar from "../components/admin-ministere/NavBar";
import Cookies from "js-cookie";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const loading = useAuthGuard();
  const userName = Cookies.get("user");

  if (loading) {
    return <div className={styles.loading}></div>;
  }

  return (
    <div className={styles.layoutContainer}>
      <SideBar />
      <main className={styles.layoutMain}>
        <Navbar userName={userName} />
        <div className={styles.space}></div>
        {children}
      </main>
    </div>
  );
}
