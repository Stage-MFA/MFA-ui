"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BASE_URL_API } from "@/lib/constants";
import { FiEdit, FiTrash2, FiSearch, FiPlus } from "react-icons/fi";
import styles from "@/app/style/specialityDirection.module.css";
import Swal from "sweetalert2";

type Direction = {
  directionId: number;
  name: string;
};

export default function DirectionList() {
  const [directions, setDirections] = useState<Direction[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 3;
  const router = useRouter();

  useEffect(() => {
    async function fetchDirections() {
      try {
        const res = await fetch(`${BASE_URL_API}/directions`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        });

        if (!res.ok)
          throw new Error("Erreur lors du chargement des directions");

        const data: Direction[] = await res.json();
        setDirections(data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchDirections();
  }, []);

  const handleAddDirection = () => {
    router.prefetch("/admin-ministere/direction/add");
    router.push("/admin-ministere/direction/add");
  };

  const handleEdit = (directionId: number) => {
    router.prefetch(
      `/admin-ministere/direction/edit?directionId=${directionId}`,
    );
    router.push(`/admin-ministere/direction/edit?directionId=${directionId}`);
  };

  const handleDelete = async (directionId: number) => {
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
        const res = await fetch(`${BASE_URL_API}/directions/${directionId}`, {
          method: "DELETE",
        });

        if (res.ok) {
          setDirections((prev) =>
            prev.filter((d) => d.directionId !== directionId),
          );
          Swal.fire("Supprimé !", "La direction a été supprimée.", "success");
        } else {
          throw new Error("Échec de la suppression.");
        }
      } catch (error) {
        console.error(error);
        Swal.fire("Erreur", "Une erreur est survenue.", "error");
      }
    }
  };

  const filteredDirections = directions.filter((d) =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredDirections.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentDirections = filteredDirections.slice(indexOfFirst, indexOfLast);

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
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className={styles.searchInput}
          />
        </div>

        <button onClick={handleAddDirection} className={styles.btnAdd}>
          <FiPlus /> Ajouter
        </button>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr>
              <th className={styles.th}>Nom</th>
              <th className={styles.th}>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentDirections.length === 0 && (
              <tr>
                <td
                  colSpan={2}
                  style={{ textAlign: "center", padding: "1rem" }}
                >
                  Aucun résultat trouvé.
                </td>
              </tr>
            )}
            {currentDirections.map((d) => (
              <tr key={d.directionId} className={styles.tr}>
                <td className={styles.td}>{d.name}</td>
                <td className={styles.td}>
                  <div className={styles.actions}>
                    <button
                      className={`${styles.actionBtn} ${styles.edit}`}
                      onClick={() => handleEdit(d.directionId)}
                      aria-label={`Modifier ${d.name}`}
                    >
                      <FiEdit size={18} />
                    </button>
                    <button
                      className={`${styles.actionBtn} ${styles.delete}`}
                      onClick={() => handleDelete(d.directionId)}
                      aria-label={`Supprimer ${d.name}`}
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

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => handlePageChange(i + 1)}
            className={`${styles.pageButton} ${currentPage === i + 1 ? styles.activePage : ""}`}
          >
            {i + 1}
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
