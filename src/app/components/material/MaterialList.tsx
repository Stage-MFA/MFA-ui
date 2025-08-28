"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BASE_URL_API } from "@/lib/constants";
import { FiEdit, FiTrash2, FiSearch, FiPlus } from "react-icons/fi";
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

export default function Materials() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 8;
  const router = useRouter();

  useEffect(() => {
    async function fetchMaterials() {
      try {
        const res = await fetch(`${BASE_URL_API}/material`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        });

        if (!res.ok) throw new Error("Erreur lors du chargement des matériels");

        const data: Material[] = await res.json();
        setMaterials(data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchMaterials();
  }, []);

  const handleAddMaterial = () => {
    router.prefetch("/admin-ministere/material/add");
    router.push("/admin-ministere/material/add");
  };

  const handleDelete = async (materialId: number) => {
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
        const res = await fetch(`${BASE_URL_API}/material/${materialId}`, {
          method: "DELETE",
        });

        if (res.ok) {
          setMaterials((prev) =>
            prev.filter((m) => m.materialId !== materialId),
          );
          Swal.fire("Supprimé !", "Le matériel a été supprimé.", "success");
        } else {
          throw new Error("Échec de la suppression.");
        }
      } catch (error) {
        console.error(error);
        Swal.fire("Erreur", "Une erreur est survenue.", "error");
      }
    }
  };

  const filteredMaterials = materials.filter((m) =>
    `${m.name} ${m.type} ${m.brand} ${m.model} ${m.guarantee}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredMaterials.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentMaterials = filteredMaterials.slice(indexOfFirst, indexOfLast);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleEditMaterial = (materialId: number) => {
    router.prefetch(`/admin-ministere/material/edit?materialId=${materialId}`)
    router.push(`/admin-ministere/material/edit?materialId=${materialId}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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

        <button onClick={handleAddMaterial} className={styles.btnAdd}>
          <FiPlus /> Ajouter
        </button>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr>
              <th className={styles.th}>Nom</th>
              <th className={styles.th}>Type</th>
              <th className={styles.th}>Marque</th>
              <th className={styles.th}>Modèle</th>
              <th className={styles.th}>N° Série</th>
              <th className={styles.th}>Date Acquisition</th>
              <th className={styles.th}>Garantie</th>
              <th className={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentMaterials.map((m) => (
              <tr key={m.materialId} className={styles.tr}>
                <td className={styles.td}>{m.name}</td>
                <td className={styles.td}>{m.type}</td>
                <td className={styles.td}>{m.brand}</td>
                <td className={styles.td}>{m.model}</td>
                <td className={styles.td}>{m.serialNumber}</td>
                <td className={styles.td}>{formatDate(m.acquisitionDate)}</td>
                <td className={styles.td}>{m.guarantee}</td>
                <td className={styles.td}>
                  <div className={styles.actions}>
                    <button
                      className={`${styles.actionBtn} ${styles.edit}`}
                      onClick={() => handleEditMaterial(m.materialId)}
                    >
                      <FiEdit size={18} />
                    </button>
                    <button
                      className={`${styles.actionBtn} ${styles.delete}`}
                      onClick={() => handleDelete(m.materialId)}
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
