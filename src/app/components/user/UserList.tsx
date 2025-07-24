"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BASE_URL_API } from "@/lib/constants";
import { FiEdit, FiTrash2, FiSearch, FiPlus } from "react-icons/fi";
import styles from "@/app/style/user.module.css";

type Role = {
  id: number;
  name: string;
};

type User = {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  roleResDto: Role[];
};

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch(`${BASE_URL_API}/users`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        });

        if (!res.ok)
          throw new Error("Erreur lors du chargement des utilisateurs");

        const data = await res.json();
        setUsers(data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchUsers();
  }, []);

  const handleAddUser = () => {
    router.push("/admin-ministere/user/add");
  };

  const handleEditRole = (email: string) => {
    router.push(`/admin-ministere/user/edit-role?email=${email}`);
  };
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.searchWrapper}>
          <FiSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Rechercher..."
            className={styles.searchInput}
          />
        </div>

        <button onClick={handleAddUser} className={styles.btnAdd}>
          <FiPlus /> Ajouter
        </button>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr>
              <th className={styles.th}>Nom</th>
              <th className={styles.th}>Email</th>
              <th className={styles.th}>Rôles</th>
              <th className={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className={styles.tr}>
                <td className={styles.td}>
                  {user.firstname} {user.lastname}
                </td>
                <td className={styles.td}>{user.email}</td>
                <td className={styles.td}>
                  {user.roleResDto.map((role) => (
                    <span key={role.id} className={styles.roleTag}>
                      {role.name}
                    </span>
                  ))}
                </td>
                <td className={styles.td}>
                  <div className={styles.actions}>
                    <button
                      className={`${styles.actionBtn} ${styles.edit}`}
                      onClick={() => handleEditRole(user.email)}
                    >
                      <FiEdit size={18} />
                    </button>
                    <button className={`${styles.actionBtn} ${styles.delete}`}>
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
