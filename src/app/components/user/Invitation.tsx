"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BASE_URL_API } from "@/lib/constants";
import { FiEdit, FiTrash2, FiSearch } from "react-icons/fi";
import styles from "@/app/style/user.module.css";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import { getUsersWithoutRoleCount } from "@/lib/invitation";

type Role = {
  id: number;
  name: string;
};

type User = {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  direction: string;
  speciality: string;
  role: string;
  roleResDto: Role[];
};

type UsersWithoutRoleProps = {
  onCountReady?: (count: number) => void;
};

export default function UsersWithoutRole({
  onCountReady,
}: UsersWithoutRoleProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
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

        const data: User[] = await res.json();

        const usersWithoutRoles = data.filter(
          (user) => user.roleResDto.length === 0,
        );
        setUsers(usersWithoutRoles);

        if (onCountReady) onCountReady(usersWithoutRoles.length);
      } catch (error) {
        console.error(error);
      }
    }

    fetchUsers();
  }, [onCountReady]);

  const filteredUsers = users.filter(
    (user) =>
      `${user.firstname} ${user.lastname}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const handleDelete = async (userId: number) => {
    const result = await Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Cette action est irréversible",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`${BASE_URL_API}/users/${userId}`, {
          method: "DELETE",
        });

        if (res.ok) {
          setUsers((prevUsers) =>
            prevUsers.filter((user) => user.id !== userId),
          );
          Cookies.set(
            "invitationCount",
            String(await getUsersWithoutRoleCount()),
            { expires: 1 },
          );
          Swal.fire("Supprimé !", "L'utilisateur a été supprimé.", "success");
          router.refresh();
        } else {
          throw new Error("Échec de la suppression de l'utilisateur.");
        }
      } catch (error) {
        console.error(error);
        Swal.fire("Erreur", "Une erreur est survenue.", "error");
      }
    }
  };

  const handleEditRole = (email: string) => {
    router.push(`/admin-ministere/user/edit-role?email=${email}`);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.searchWrapper} style={{ marginTop: "1em" }}>
          <FiSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Rechercher..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr>
              <th className={styles.th}>Nom</th>
              <th className={styles.th}>Email</th>
              <th className={styles.th}>Direction</th>
              <th className={styles.th}>Spécialité</th>
              <th className={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", padding: "1em" }}>
                  Aucunne invitation trouvée.
                </td>
              </tr>
            ) : (
              currentUsers.map((user) => (
                <tr key={user.id} className={styles.tr}>
                  <td className={styles.td}>
                    {user.firstname} {user.lastname}
                  </td>
                  <td className={styles.td}>{user.email}</td>
                  <td className={styles.td}>{user.direction}</td>
                  <td className={styles.td}>{user.speciality}</td>
                  <td className={styles.td}>
                    <div className={styles.actions}>
                      <button
                        className={`${styles.actionBtn} ${styles.edit}`}
                        onClick={() => handleEditRole(user.email)}
                      >
                        <FiEdit size={18} />
                      </button>
                      <button
                        className={`${styles.actionBtn} ${styles.delete}`}
                        onClick={() => handleDelete(user.id)}
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className={styles.pagination}>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={styles.pageButton}
        >
          Précédent
        </button>

        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`${styles.pageButton} ${currentPage === index + 1 ? styles.activePage : ""}`}
          >
            {index + 1}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
          className={styles.pageButton}
        >
          Suivant
        </button>
      </div>
    </div>
  );
}
