"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BASE_URL_API } from "@/lib/constants";
import { FiEdit, FiTrash2, FiSearch, FiPlus } from "react-icons/fi";
import styles from "@/app/style/specialityDirection.module.css";
import Swal from "sweetalert2";

type Speciality = {
  specialityId: number;
  name: string;
};

export default function SpecialityList() {
  const [specialities, setSpecialities] = useState<Speciality[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 3;
  const router = useRouter();

  useEffect(() => {
    async function fetchSpecialities() {
      try {
        const res = await fetch(`${BASE_URL_API}/speciality`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        });

        if (!res.ok)
          throw new Error("Erreur lors du chargement des spécialités");

        const data: Speciality[] = await res.json();
        setSpecialities(data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchSpecialities();
  }, []);

  const handleAddSpeciality = () => {
    router.prefetch("/admin-ministere/speciality/add")
    router.push("/admin-ministere/speciality/add");
  };

  const handleEdit = (specialityId: number) => {
    router.prefetch( `/admin-ministere/speciality/edit?specialityId=${specialityId}`)
    router.push(
      `/admin-ministere/speciality/edit?specialityId=${specialityId}`);
  };

  const handleDelete = async (specialityId: number) => {
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
        const res = await fetch(`${BASE_URL_API}/speciality/${specialityId}`, {
          method: "DELETE",
        });

        if (res.ok) {
          setSpecialities((prev) =>
            prev.filter((s) => s.specialityId !== specialityId),
          );
          Swal.fire("Supprimé !", "La spécialité a été supprimée.", "success");
        } else {
          throw new Error("Échec de la suppression.");
        }
      } catch (error) {
        console.error(error);
        Swal.fire("Erreur", "Une erreur est survenue.", "error");
      }
    }
  };

  const filteredSpecialities = specialities.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredSpecialities.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentSpecialities = filteredSpecialities.slice(
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
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className={styles.searchInput}
          />
        </div>

        <button onClick={handleAddSpeciality} className={styles.btnAdd}>
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
            {currentSpecialities.length === 0 && (
              <tr>
                <td
                  colSpan={2}
                  style={{ textAlign: "center", padding: "1rem" }}
                >
                  Aucun résultat trouvé.
                </td>
              </tr>
            )}
            {currentSpecialities.map((s) => (
              <tr key={s.specialityId} className={styles.tr}>
                <td className={styles.td}>{s.name}</td>
                <td className={styles.td}>
                  <div className={styles.actions}>
                    <button
                      className={`${styles.actionBtn} ${styles.edit}`}
                      onClick={() => handleEdit(s.specialityId)}
                      aria-label={`Modifier ${s.name}`}
                    >
                      <FiEdit size={18} />
                    </button>
                    <button
                      className={`${styles.actionBtn} ${styles.delete}`}
                      onClick={() => handleDelete(s.specialityId)}
                      aria-label={`Supprimer ${s.name}`}
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
