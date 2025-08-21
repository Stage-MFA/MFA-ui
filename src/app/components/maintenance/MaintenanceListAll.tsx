"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BASE_URL_API } from "@/lib/constants";
import { FiSearch, FiClock, FiLoader, FiCheckCircle } from "react-icons/fi";
import styles from "@/app/style/user.module.css";
import { FiEdit } from "react-icons/fi";

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

type Intervention = {
  interventionId: number;
  dateIntervention: string;
  status: string;
  description: string;
  usersId: number;
  interventionRequestId: number;
};

type Maintenance = {
  maintenanceId: number;
  startDate: string;
  endDate: string | null;
  description: string | null;
  status: string;
  interventionId: number;
};

export default function MaintenancesList() {
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("IN_PROGRESS");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const router = useRouter();

  useEffect(() => {
    fetch(`${BASE_URL_API}/maintenances`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data: Maintenance[]) => setMaintenances(data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    fetch(`${BASE_URL_API}/interventions`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data: Intervention[]) => setInterventions(data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    fetch(`${BASE_URL_API}/request`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data: Request[]) => setRequests(data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    fetch(`${BASE_URL_API}/users`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data: User[]) => setUsers(data))
      .catch((err) => console.error(err));
  }, []);

  const getIntervention = (id: number) =>
    interventions.find((i) => i.interventionId === id);

  const getRequest = (id: number) =>
    requests.find((r) => r.interventionRequestId === id);

  const getUserName = (id: number) => {
    const user = users.find((u) => u.id === id);
    return user ? `${user.firstname} ${user.lastname}` : "Utilisateur inconnu";
  };

  const getMaterial = (req?: Request) =>
    req && req.materials.length > 0
      ? `${req.materials[0].name} (${req.materials[0].type})`
      : "-";

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
        return "Terminé";
      default:
        return status;
    }
  };

  const filteredMaintenances = maintenances.filter((mnt) => {
    const intervention = getIntervention(mnt.interventionId);
    const req = intervention
      ? getRequest(intervention.interventionRequestId)
      : undefined;
    const matchesSearch =
      mnt.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (req &&
        req.materials.some((mat) =>
          mat.name.toLowerCase().includes(searchTerm.toLowerCase()),
        ));
    const matchesStatus = mnt.status.toUpperCase() === statusFilter;
    const matchesDate = selectedDate
      ? new Date(mnt.startDate).toDateString() ===
        new Date(selectedDate).toDateString()
      : true;
    return matchesSearch && matchesStatus && matchesDate;
  });

  const totalPages = Math.ceil(filteredMaintenances.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentMaintenances = filteredMaintenances.slice(
    indexOfFirst,
    indexOfLast,
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleCreate = (id: number) => {
    alert("Cette action vous permis de terminer cette maintenance");
    router.push(`/technicien-ministere/maintenance/edit?maintenanceId=${id}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.searchWrapper}>
          <FiSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Rechercher une maintenance..."
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
            <option value="IN_PROGRESS">En cours</option>
            <option value="FINISH">Terminé</option>
          </select>
        </div>
      </div>

      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            <th className={styles.th}>Début</th>
            {statusFilter === "FINISH" && <th className={styles.th}>Fin</th>}
            <th className={styles.th}>Matériel</th>
            <th className={styles.th}>Demandeur</th>
            <th className={styles.th}>Technicien</th>
            <th className={styles.th}>Description</th>
            <th className={styles.th}>Statut</th>
            {statusFilter === "IN_PROGRESS" && (
              <th className={styles.th}>Actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          {currentMaintenances.map((mnt) => {
            const intervention = getIntervention(mnt.interventionId);
            const req = intervention
              ? getRequest(intervention.interventionRequestId)
              : undefined;
            return (
              <tr key={mnt.maintenanceId} className={styles.tr}>
                <td className={styles.td}>
                  {new Date(mnt.startDate).toLocaleString("fr-FR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                {statusFilter === "FINISH" && (
                  <td className={styles.td}>
                    {mnt.endDate
                      ? new Date(mnt.endDate).toLocaleString("fr-FR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "-"}
                  </td>
                )}

                <td className={styles.td}>{getMaterial(req)}</td>
                <td className={styles.td}>
                  {req ? getUserName(req.idUser) : "-"}
                </td>
                <td className={styles.td}>
                  {intervention ? getUserName(intervention.usersId) : "-"}
                </td>
                <td className={styles.td}>{mnt.description || "-"}</td>
                <td className={styles.td}>
                  <span
                    className={`${styles.badge} ${statusClass(mnt.status)}`}
                  >
                    {statusIcon(mnt.status)}
                    {translateStatus(mnt.status)}
                  </span>
                </td>
                {statusFilter === "IN_PROGRESS" && (
                  <td className={styles.td}>
                    <div className={styles.actions}>
                      <button
                        className={`${styles.actionBtn} ${styles.edit}`}
                        onClick={() => handleCreate(mnt.maintenanceId)}
                        title="Modifier"
                      >
                        <FiEdit size={18} />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
          {currentMaintenances.length === 0 && (
            <tr>
              <td colSpan={8} className={styles.noData}>
                Aucune maintenance trouvée
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
