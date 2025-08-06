"use client";
import SideBar from "../components/admin-ministere/SideBar";
import styles from "@/app/style/adminLayout.module.css";
import Navbar from "../components/admin-ministere/NavBar";
import { useIsAdmin } from "@/hooks/useIsAdmin";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userName =
    typeof window !== "undefined" ? sessionStorage.getItem("user") : "";
  const { isVerifying } = useIsAdmin();
  if (isVerifying) {
    return <div></div>;
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
