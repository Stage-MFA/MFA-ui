"use client";

import { useEffect, useState } from "react";
import { BASE_URL_API } from "@/lib/constants";
import { FiSearch } from "react-icons/fi";
import styles from "@/app/style/user.module.css";
import { MdAccessTime } from "react-icons/md";

type History = {
  dateJournal: string;
  user: string;
  technician: string;
  action: string;
  time: number;
};

export default function JournalList() {
  const [journals, setJournals] = useState<History[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const itemsPerPage = 6;

  useEffect(() => {
    async function fetchJournals() {
      try {
        const res = await fetch(`${BASE_URL_API}/journals`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Erreur lors du chargement des journaux");
        const data: History[] = await res.json();
        setJournals(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchJournals();
  }, []);

  const filteredJournals = journals.filter((journal) => {
    const matchesSearch = journal.action
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesDate = selectedDate
      ? new Date(journal.dateJournal).toDateString() ===
        new Date(selectedDate).toDateString()
      : true;
    return matchesSearch && matchesDate;
  });

  const totalPages = Math.ceil(filteredJournals.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentJournals = filteredJournals.slice(indexOfFirst, indexOfLast);

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
            placeholder="Rechercher dans le journal..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className={styles.searchInput}
          />
        </div>
        <div style={{ marginRight: "20px" }}>
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
      </div>

      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            <th className={styles.th}>Date</th>
            <th className={styles.th}>Démandeur</th>
            <th className={styles.th}>Technicien</th>
            <th className={styles.th}>Action</th>
            <th className={styles.th}>Temps</th>
          </tr>
        </thead>
        <tbody>
          {currentJournals.map((journal, idx) => (
            <tr key={idx} className={styles.tr}>
              <td className={styles.td}>
                {new Date(journal.dateJournal).toLocaleString("fr-FR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </td>
              <td className={styles.td}>{journal.user}</td>
              <td className={styles.td}>{journal.technician}</td>
              <td className={styles.td}>{journal.action}</td>
              <td className={styles.td}>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    backgroundColor: "#f6f8fa",
                    border: "none",
                    borderRadius: "6px",
                    padding: "4px 8px",
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "#24292f",
                  }}
                >
                  <MdAccessTime size={16} color="#57606a" />
                  <span>{journal.time} h</span>
                </div>
              </td>
            </tr>
          ))}
          {currentJournals.length === 0 && (
            <tr>
              <td colSpan={5} className={styles.noData}>
                Aucun journal trouvé
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
            className={`${styles.pageButton} ${
              currentPage === index + 1 ? styles.activePage : ""
            }`}
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
