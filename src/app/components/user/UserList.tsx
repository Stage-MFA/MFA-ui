"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BASE_URL_API } from "@/lib/constants";
import { FiEdit, FiTrash2, FiSearch, FiPlus } from "react-icons/fi";
import styles from "@/app/style/user.module.css";
import Swal from "sweetalert2";

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

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
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
        const usersWithRoles = data.filter(
          (user) => user.roleResDto.length > 0,
        );
        setUsers(usersWithRoles);
      } catch (error) {
        console.error(error);
      }
    }

    fetchUsers();
  }, []);

  const handleAddUser = () => {
    router.push("/admin-ministere/user/add");
  };

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
          Swal.fire("Supprimé !", "L'utilisateur a été supprimé.", "success");
          window.dispatchEvent(new Event("refreshInvitationCount"));
        } else {
          throw new Error("Échec de la suppression de l'utilisateur.");
        }
      } catch (error) {
        console.error(error);
        Swal.fire("Erreur", "Une erreur est survenue.", "error");
      }
    }
  };

  const filteredUsers = users.filter((user) =>
    `${user.firstname} ${user.lastname} ${user.email} ${user.direction} ${user.speciality}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
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
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
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
              <th className={styles.th}>Direction</th>
              <th className={styles.th}>Spécialité</th>
              <th className={styles.th}>Rôles</th>
              <th className={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user) => (
              <tr key={user.id} className={styles.tr}>
                <td className={styles.td}>
                  {user.firstname} {user.lastname}
                </td>
                <td className={styles.td}>{user.email}</td>
                <td className={styles.td}>{user.direction}</td>
                <td className={styles.td}>{user.speciality}</td>
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
                    <button
                      className={`${styles.actionBtn} ${styles.delete}`}
                      onClick={() => handleDelete(user.id)}
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
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
          disabled={currentPage === totalPages}
          className={styles.pageButton}
        >
          Suivant
        </button>
      </div>
    </div>
  );
}
