"use client";

import { useEffect, useState } from "react";
import { BASE_URL_API } from "@/lib/constants";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import styles from "@/app/style/createUser.module.css";
import Image from "next/image";
import { FaArrowLeft } from "react-icons/fa";

const formSchema = z.object({
  idMaintenance: z.number(),
  description: z.string().min(1, "Description invalide"),
});

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

type FormSchemaType = z.infer<typeof formSchema>;

export default function CreateJournal() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [maintenance, setMaintenance] = useState<Maintenance | null>(null);
  const idM = searchParams.get("maintenanceId");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      idMaintenance: idM ? Number(idM) : 0,
      description: "",
    },
  });

  useEffect(() => {
    async function fetchMaintenance() {
      try {
        const res = await fetch(`${BASE_URL_API}/maintenances/${idM}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Maintenance non trouvée");
        const data: Maintenance = await res.json();
        setMaintenance(data);
        setValue("idMaintenance", data.maintenanceId);
      } catch (error) {
        console.error(error);
      }
    }
    if (idM) fetchMaintenance();
  }, [idM, setValue]);

  const onSubmit = async (values: FormSchemaType) => {
    if (!maintenance) return;
    setIsLoading(true);
    try {
      const updatedMaintenance: MaintenanceToSave = {
        startDate: maintenance.startDate,
        endDate: new Date().toISOString(),
        description: values.description,
        status: "FINISH",
        interventionId: maintenance.interventionId,
      };

      const resMnt = await fetch(
        `${BASE_URL_API}/maintenances/${maintenance.maintenanceId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedMaintenance),
        },
      );

      const resJrn = await fetch(`${BASE_URL_API}/journals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!resMnt.ok || !resJrn.ok)
        throw new Error("Erreur lors de la mise à jour");

      router.push("/technicien-ministere/maintenance");
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la mise à jour de la maintenance");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.formContainer}>
        <button
          type="button"
          className={styles.backButton}
          onClick={() => router.back()}
          style={{ marginTop: "4%" }}
        >
          <FaArrowLeft />
        </button>

        <Image
          alt="Logo Ministère"
          src="/materiel4.png"
          height={600}
          width={600}
          className={styles.logo}
        />

        <form
          onSubmit={handleSubmit(onSubmit)}
          className={styles.form}
          style={{ marginTop: "20px" }}
        >
          <input
            type="hidden"
            {...register("idMaintenance", { valueAsNumber: true })}
          />

          <div className={styles.grid}>
            <div className={styles.column}>
              <label className={styles.label}>
                Décrivez ici les actions réalisées durant l’intervention et la
                maintenance.
              </label>
              <br />
              <textarea
                {...register("description")}
                className={styles.input}
                rows={4}
              />
              {errors.description && (
                <p className={styles.error}>{errors.description.message}</p>
              )}
            </div>
          </div>
          <div className={styles.buttonContainer}>
            <button
              type="submit"
              disabled={isLoading}
              className={styles.button}
            >
              {isLoading ? "Chargement..." : "Terminer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
