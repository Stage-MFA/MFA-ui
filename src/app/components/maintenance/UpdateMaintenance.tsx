"use client";

import { useEffect, useState } from "react";
import { BASE_URL_API } from "@/lib/constants";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "@/app/style/createUser.module.css";
import Image from "next/image";
import { FaArrowLeft } from "react-icons/fa";

type Maintenance = {
  maintenanceId: number;
  startDate: string;
  endDate: string | null;
  description: string | null;
  status: string;
  interventionId: number;
};

type MaintenanceToSave = {
  startDate: string;
  endDate: string | null;
  description: string | null;
  status: string;
  interventionId: number;
};

export default function UpdateMaintenance() {
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const idMaintenance = searchParams.get("maintenanceId");
  const [maintenance, setMaintenance] = useState<Maintenance>();

  useEffect(() => {
    async function fetchMaintenance() {
      try {
        const res = await fetch(
          `${BASE_URL_API}/maintenances/${idMaintenance}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            cache: "no-store",
          },
        );
        if (!res.ok) throw new Error("Maintenance not found");
        const data: Maintenance = await res.json();
        setMaintenance(data);
      } catch (error) {
        console.log(error);
      }
    }
    if (idMaintenance) fetchMaintenance();
  }, [idMaintenance]);

  const getNowDateTime = () => {
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
  };

  const handleFinish = async () => {
    if (!maintenance) return;
    setIsLoading(true);
    try {
      const updatedMaintenance: MaintenanceToSave = {
        startDate: maintenance.startDate,
        endDate: new Date().toISOString(),
        description: maintenance.description,
        status: "FINISH",
        interventionId: maintenance.interventionId,
      };
      const res = await fetch(
        `${BASE_URL_API}/maintenances/${maintenance.maintenanceId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedMaintenance),
        },
      );
      if (!res.ok) throw new Error("Erreur lors de la mise à jour");
      router.push("/technicien-ministere/maintenance");
    } catch (error) {
      console.log(error);
      alert("Erreur lors de la mise à jour de la maintenance");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.formContainer}>
        <button
          type="button"
          className={styles.backButton}
          onClick={handleCancel}
          style={{ marginTop: "4%" }}
        >
          <FaArrowLeft />
        </button>
        <Image
          alt="Logo Maintenance"
          src="/materiel4.png"
          height={600}
          width={600}
          className={styles.logo}
        />
        <form
          className={styles.form}
          style={{ marginTop: "20px" }}
          onSubmit={(e) => {
            e.preventDefault();
            handleFinish();
          }}
        >
          <div className={styles.grid}>
            <div className={styles.column}>
              <h3 className={styles.label}>
                Voulez-vous terminer cette maintenance ?
              </h3>
              {maintenance && (
                <div className={styles.input} style={{ minHeight: 40 }}>
                  <p>
                    <b className={styles.label}>Date début :</b>{" "}
                    {new Date(maintenance.startDate).toLocaleString("fr-FR")}
                  </p>
                  <p>
                    <b className={styles.label}>Description :</b>{" "}
                    {maintenance.description}
                  </p>
                  <p>
                    <b className={styles.label}>Date de fin (sera) :</b>{" "}
                    {getNowDateTime().replace("T", " à ")}
                  </p>
                  <p>
                    <b className={styles.label}>Statut :</b> Terminé
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className={styles.buttonContainer}>
            <button
              type="submit"
              disabled={isLoading}
              className={styles.button}
            >
              {isLoading ? "Envoi..." : "Oui, terminer"}
            </button>
            <button
              type="button"
              className={styles.button}
              style={{ marginLeft: 12, background: "#ccc", color: "#222" }}
              onClick={handleCancel}
            >
              Non, annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
