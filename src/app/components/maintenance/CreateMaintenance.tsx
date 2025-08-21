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

type Intervention = {
  interventionId: number;
  dateIntervention: string;
  status: string;
  description: string;
  usersId: number;
  interventionRequestId: number;
};

const formSchema = z.object({
  startDate: z.string().min(1, "Date requise"),
  endDate: z.string().min(1, "Date requise"),
  description: z.string().min(1, "Description invalide"),
  status: z.enum(["PENDING", "IN_PROGRESS", "FINISH"]),
  interventionId: z.number(),
});

type InterventionTosave = {
  dateIntervention: string;
  status: string;
  description: string;
  idUser: number;
  interventionRequestId: number;
};

type formSchemaType = z.infer<typeof formSchema>;

export default function CreateMaintenance() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const IdIntervention = searchParams.get("interventionId");
  const [intervention, setIntervention] = useState<Intervention>();

  useEffect(() => {
    async function fetchIntervention() {
      try {
        const res = await fetch(
          `${BASE_URL_API}/interventions/${IdIntervention}`,
          {
            method: "GET",
            headers: { "content-type": "application/json" },
            cache: "no-store",
          },
        );
        if (!res.ok) throw new Error("Erreur chargement intervention");
        const data: Intervention = await res.json();
        setIntervention(data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchIntervention();
  }, [IdIntervention]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<formSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      startDate: "",
      endDate: "",
      description: "",
      status: "IN_PROGRESS",
      interventionId: Number(IdIntervention),
    },
  });

  const onSubmit = async (data: formSchemaType) => {
    setIsLoading(true);
    try {
      const { interventionId: id, ...interventionData } = intervention!;
      const updatedIntervention = {
        ...interventionData,
        status: data.status,
      };

      const interventionUpdated: InterventionTosave = {
        dateIntervention: updatedIntervention.dateIntervention,
        status: "FINISH",
        description: updatedIntervention.description,
        idUser: updatedIntervention.usersId,
        interventionRequestId: updatedIntervention.interventionRequestId,
      };

      const responseIntervention = await fetch(
        `${BASE_URL_API}/interventions/${id}`,
        {
          method: "PUT",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(interventionUpdated),
        },
      );

      const res = await fetch(`${BASE_URL_API}/maintenances`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data),
        cache: "no-store",
      });
      if (!res.ok && responseIntervention.ok)
        throw new Error("Erreur ajout maintenance");
      router.push("/technicien-ministere/maintenance");
    } catch (error) {
      console.log(error);
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
          alt="Logo Intervention"
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
          <div className={styles.grid}>
            <div className={styles.column}>
              <label className={styles.label}>Date début maintenance</label>
              <input
                type="datetime-local"
                className={styles.input}
                {...register("startDate")}
              />
              {errors.startDate && (
                <p className={styles.error}>{errors.startDate.message}</p>
              )}

              <label className={styles.label}>Date fin maintenance</label>
              <input
                type="datetime-local"
                className={styles.input}
                {...register("endDate")}
              />
              {errors.endDate && (
                <p className={styles.error}>{errors.endDate.message}</p>
              )}

              <label className={styles.label}>Description</label>
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
              {isLoading ? "Envoi..." : "Créer la maintenance"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
