"use client";
import SideBar from "../components/user-ministere/SideBar";
import styles from "@/app/style/adminLayout.module.css";
import Navbar from "@/app/components/user-ministere/NavBar";
import Cookies from "js-cookie";
import { useIsUser } from "@/hooks/useIsUser";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userName = Cookies.get("user");
  const { isVerifying } = useIsUser();
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
