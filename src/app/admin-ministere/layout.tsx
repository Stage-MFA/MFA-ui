"use client";
import SideBar from "../components/admin-ministere/SideBar";
import styles from '@/app/style/adminLayout.module.css';
import { useAuthGuard } from "@/hooks/useAuthGuard";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const loading = useAuthGuard();

  if (loading) {
    return (
      <div className={styles.loading}>
      </div>
    );
  }

  return (
    <div className={styles.layoutContainer}>
      <SideBar />
      <main className={styles.layoutMain}>
        {children}
      </main>
    </div>
  );
}
