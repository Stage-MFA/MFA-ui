"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BASE_URL_API } from "@/lib/constants";
import {
  FiEdit,
  FiTrash2,
  FiSearch,
  FiClock,
  FiLoader,
  FiCheckCircle,
} from "react-icons/fi";
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
  gender: string;
  direction: string;
  speciality: string;
  roleResDto: Role[];
};

type Intervention = {
  interventionId: number;
  dateIntervention: string;
  status: string;
  description: string;
  usersId: number;
  interventionRequestId: number;
};

export default function InterventionByUser() {
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("PENDING");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const itemsPerPage = 6;
  const router = useRouter();

  useEffect(() => {
    const email = sessionStorage.getItem("user");
    if (email) {
      fetch(`${BASE_URL_API}/users/email?email=${email}`)
        .then((res) => res.json())
        .then((data: User) => setCurrentUser(data))
        .catch((err) => console.error(err));
    }
  }, []);

  useEffect(() => {
    fetch(`${BASE_URL_API}/interventions`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data: Intervention[]) => setInterventions(data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    fetch(`${BASE_URL_API}/users`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data: User[]) => setUsers(data))
      .catch((err) => console.error(err));
  }, []);

  const getUserName = (idUser: number) => {
    const user = users.find((u) => u.id === idUser);
    return user ? `${user.firstname} ${user.lastname}` : "Utilisateur inconnu";
  };

  const getDirection = (idUser: number) => {
    const user = users.find((u) => u.id === idUser);
    return user ? user.direction : "Direction inconnue";
  };

  const statusClass = (status: string) => {
    switch (status.toUpperCase()) {
      case "PENDING":
        return styles.statusPending;
      case "IN_PROGRESS":
        return styles.statusInProgress;
      case "FINISH":
        return styles.statusFinish;
      default:
        return "";
    }
  };

  const statusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case "PENDING":
        return <FiClock style={{ marginRight: 6 }} />;
      case "IN_PROGRESS":
        return <FiLoader style={{ marginRight: 6 }} className={styles.spin} />;
      case "FINISH":
        return <FiCheckCircle style={{ marginRight: 6 }} />;
      default:
        return null;
    }
  };

  const translateStatus = (status: string) => {
    switch (status.toUpperCase()) {
      case "PENDING":
        return "En attente";
      case "IN_PROGRESS":
        return "En cours";
      case "FINISH":
        return "Demande acceptée";
      default:
        return status;
    }
  };

  const handleEdit = (id: number) => {
    router.push(`/technicien-ministere/intervention/edit?interventionId=${id}`);
  };

  const handleCreate = (id: number) => {
    router.push(`/technicien-ministere/maintenance/add?interventionId=${id}`);
  };

  const handleDelete = async (id: number) => {
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
        const res = await fetch(`${BASE_URL_API}/interventions/${id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) throw new Error("Erreur lors de la suppression");
        setInterventions((prev) => prev.filter((i) => i.interventionId !== id));
        Swal.fire("Supprimé !", "L'intervention a été supprimée.", "success");
      } catch (error) {
        Swal.fire(
          "Erreur",
          "Une erreur est survenue lors de la suppression.",
          "error",
        );
        console.log(error);
      }
    }
  };

  const filteredInterventions = interventions.filter((inter) => {
    const isMine = currentUser ? inter.usersId === currentUser.id : false;
    const matchesSearch = inter.description
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "ALL" || inter.status.toUpperCase() === statusFilter;
    const matchesDate = selectedDate
      ? new Date(inter.dateIntervention).toDateString() ===
        new Date(selectedDate).toDateString()
      : true;
    return isMine && matchesSearch && matchesStatus && matchesDate;
  });

  const totalPages = Math.ceil(filteredInterventions.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentInterventions = filteredInterventions.slice(
    indexOfFirst,
    indexOfLast,
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.searchWrapper}>
          <FiSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Rechercher une intervention..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className={styles.searchInput}
          />
        </div>
        <div>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              setCurrentPage(1);
            }}
            className={styles.filterDate}
          />
        </div>
        <div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className={styles.filterSelect}
          >
            <option value="PENDING">En attente</option>
            <option value="IN_PROGRESS">En cours</option>
            <option value="FINISH">Acceptée</option>
          </select>
        </div>
      </div>

      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            <th className={styles.th}>Date d&apos;intervention</th>
            <th className={styles.th}>Intervenant</th>
            <th className={styles.th}>Direction</th>
            <th className={styles.th}>Description</th>
            <th className={styles.th}>Statut</th>
            {(statusFilter === "PENDING" || statusFilter === "IN_PROGRESS") && (
              <th className={styles.th}>Actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          {currentInterventions.map((inter) => (
            <tr key={inter.interventionId} className={styles.tr}>
              <td className={styles.td}>
                {new Date(inter.dateIntervention).toLocaleString("fr-FR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </td>
              <td className={styles.td}>{getUserName(inter.usersId)}</td>
              <td className={styles.td}>{getDirection(inter.usersId)}</td>
              <td className={styles.td}>{inter.description}</td>
              <td className={styles.td}>
                <span
                  className={`${styles.badge} ${statusClass(inter.status)}`}
                >
                  {statusIcon(inter.status)}
                  {translateStatus(inter.status)}
                </span>
              </td>
              <td className={styles.td}>
                <div className={styles.actions}>
                  {statusFilter === "PENDING" && (
                    <button
                      className={`${styles.actionBtn} ${styles.edit}`}
                      onClick={() => handleEdit(inter.interventionId)}
                      title="Modifier"
                    >
                      <FiEdit size={18} />
                    </button>
                  )}
                  {statusFilter === "IN_PROGRESS" && (
                    <button
                      className={`${styles.actionBtn} ${styles.edit}`}
                      onClick={() => handleCreate(inter.interventionId)}
                      title="Clôturer"
                    >
                      <FiEdit size={18} />
                    </button>
                  )}
                  {inter.status.toUpperCase() === "PENDING" && (
                    <button
                      className={`${styles.actionBtn} ${styles.delete}`}
                      onClick={() => handleDelete(inter.interventionId)}
                      title="Supprimer"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
          {currentInterventions.length === 0 && (
            <tr>
              <td colSpan={6} className={styles.noData}>
                Aucune intervention trouvée
              </td>
            </tr>
          )}
        </tbody>
      </table>

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
