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

type Material = {
  materialId: number;
  name: string;
  type: string;
  brand: string;
  model: string;
  serialNumber: number;
  acquisitionDate: string;
  guarantee: string;
};

type Request = {
  interventionRequestId: number;
  requestDate: string;
  status: string;
  priority: string;
  materials: Material[];
  description: string;
  idUser: number;
};

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

export default function RequestList() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("PENDING");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const itemsPerPage = 6;
  const router = useRouter();

  useEffect(() => {
    async function fetchRequests() {
      try {
        const res = await fetch(`${BASE_URL_API}/request`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Erreur lors du chargement des demandes");
        const data: Request[] = await res.json();
        setRequests(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchRequests();
  }, []);

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
        setUsers(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchUsers();
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

  const priorityClass = (priority: string) => {
    switch (priority.toUpperCase()) {
      case "URGENT":
        return styles.priorityHigh;
      case "WAIT":
        return styles.priorityWait;
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
        return "Assigné";
      default:
        return status;
    }
  };

  const translatePriority = (priority: string) => {
    switch (priority.toUpperCase()) {
      case "URGENT":
        return "Urgente";
      case "WAIT":
        return "Pas urgent";
      default:
        return priority;
    }
  };

  const handleEdit = (id: number) => {
    router.push(
      `/admin-ministere/request-intervention/edit?interventionRequestId=${id}`,
    );
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
        const res = await fetch(`${BASE_URL_API}/request/${id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok)
          throw new Error("Erreur lors de la suppression de la demande");
        setRequests((prev) =>
          prev.filter((r) => r.interventionRequestId !== id),
        );
        Swal.fire("Supprimé !", "La demande a été supprimée.", "success");
      } catch (error) {
        console.error("Erreur :", error);
        Swal.fire(
          "Erreur",
          "Une erreur est survenue lors de la suppression.",
          "error",
        );
      }
    }
  };

  const filteredRequests = requests.filter((request) => {
    const matchesSearch = request.description
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" || request.status.toUpperCase() === statusFilter;

    const matchesDate = selectedDate
      ? new Date(request.requestDate).toDateString() ===
        new Date(selectedDate).toDateString()
      : true;

    return matchesSearch && matchesStatus && matchesDate;
  });

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentRequests = filteredRequests.slice(indexOfFirst, indexOfLast);

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
            placeholder="Rechercher une demande..."
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
            style={{
              padding: "8px 12px",
              borderRadius: "10px",
              border: "1px solid #ccc",
              color: "#9e9b9bff",
              fontSize: "14px",
              fontWeight: 500,
              outline: "none",
              cursor: "pointer",
              transition: "all 0.3s ease",
              marginTop: "20px",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#0070f3")}
            onBlur={(e) => (e.target.style.borderColor = "#ccc")}
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
            <option value="FINISH">Assigné</option>
          </select>
        </div>
      </div>

      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            <th className={styles.th}>Date de demande</th>
            <th className={styles.th}>Demandeur</th>
            <th className={styles.th}>Direction</th>
            <th className={styles.th}>Matériels</th>
            <th className={styles.th}>Description</th>
            <th className={styles.th}>Statut</th>
            {statusFilter === "PENDING" && (
              <th className={styles.th}>Priorité</th>
            )}
            {statusFilter === "PENDING" && (
              <th className={styles.th}>Actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          {currentRequests.map((request) => (
            <tr key={request.interventionRequestId} className={styles.tr}>
              <td className={styles.td}>
                {new Date(request.requestDate).toLocaleString("fr-FR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </td>
              <td className={styles.td}>{getUserName(request.idUser)}</td>
              <td className={styles.td}>{getDirection(request.idUser)}</td>
              <td className={styles.td}>
                {request.materials.map((m) => m.name).join(", ")}
              </td>
              <td className={styles.td}>{request.description}</td>
              <td className={styles.td}>
                <span
                  className={`${styles.badge} ${statusClass(request.status)}`}
                >
                  {statusIcon(request.status)}
                  {translateStatus(request.status)}
                </span>
              </td>
              {request.status.toUpperCase() === "PENDING" && (
                <td className={styles.td}>
                  <span
                    className={`${styles.badge2} ${priorityClass(request.priority)}`}
                  >
                    {translatePriority(request.priority)}
                  </span>
                </td>
              )}
              <td className={styles.td}>
                <div className={styles.actions}>
                  {request.status.toUpperCase() === "PENDING" && (
                    <>
                      <button
                        className={`${styles.actionBtn} ${styles.edit}`}
                        onClick={() =>
                          handleEdit(request.interventionRequestId)
                        }
                        title="Modifier"
                      >
                        <FiEdit size={18} />
                      </button>
                      <button
                        className={`${styles.actionBtn} ${styles.delete}`}
                        onClick={() =>
                          handleDelete(request.interventionRequestId)
                        }
                        title="Supprimer"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
          {currentRequests.length === 0 && (
            <tr>
              <td
                colSpan={statusFilter === "PENDING" ? 8 : 7}
                className={styles.noData}
              >
                Aucune demande trouvée
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
