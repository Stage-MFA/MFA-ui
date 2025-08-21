"use client";

import { useEffect, useState } from "react";
import { BASE_URL_API } from "@/lib/constants";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
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

type InterventionTosave = {
  dateIntervention: string;
  status: string;
  description: string;
  idUser: number;
  interventionRequestId: number;
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

type FormValues = {
  status: string;
};

export default function InterventionEdit() {
  const [intervention, setIntervention] = useState<Intervention>();
  const [request, setRequest] = useState<Request>();
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const interventionId = searchParams.get("interventionId");

  const { register, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: { status: "" },
  });

  useEffect(() => {
    async function fetchIntervention() {
      if (!interventionId) return;
      const res = await fetch(
        `${BASE_URL_API}/interventions/${interventionId}`,
        {
          method: "GET",
          headers: { "content-type": "application/json" },
          cache: "no-store",
        },
      );
      if (!res.ok) throw new Error("Erreur chargement intervention");
      const data: Intervention = await res.json();
      setIntervention(data);
      console.log("Fetched intervention =>", data);
      reset({ status: data.status });
    }
    fetchIntervention().catch(() =>
      alert("Erreur : Impossible de charger l’intervention"),
    );
  }, [interventionId, reset]);

  useEffect(() => {
    async function fetchRequests() {
      try {
        if (!intervention?.interventionRequestId) return;
        const res = await fetch(
          `${BASE_URL_API}/request/${intervention.interventionRequestId}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            cache: "no-store",
          },
        );
        if (!res.ok) throw new Error("Erreur lors du chargement de la request");
        const data: Request = await res.json();
        console.log("Fetched request =>", data);
        setRequest(data);
      } catch (error) {
        console.error("Erreur récupération request:", error);
        alert("Erreur : Impossible de charger la request");
      }
    }
    fetchRequests();
  }, [intervention?.interventionRequestId]);

  const onSubmit = async (dataForm: FormValues) => {
    if (!intervention || !request) return;

    setIsLoading(true);
    try {
      const { interventionId: id, ...interventionData } = intervention;
      const updatedIntervention = {
        ...interventionData,
        status: dataForm.status,
      };

      const interventionUpdated: InterventionTosave = {
        dateIntervention: updatedIntervention.dateIntervention,
        status: updatedIntervention.status,
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

      const updatedRequest = {
        ...request,
        status: "FINISH",
      };

      const responseRequest = await fetch(
        `${BASE_URL_API}/request/${request.interventionRequestId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedRequest),
        },
      );

      if (!responseRequest.ok || !responseIntervention.ok) {
        throw new Error("Échec de la mise à jour");
      }

      alert("Succès : Intervention et demande mises à jour");
      router.push("/technicien-ministere/intervention");
    } catch (error) {
      console.error("Erreur :", error);
      alert("Erreur lors de la mise à jour");
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
              <label className={styles.label}>Status Intervention</label>
              <select
                className={styles.input}
                {...register("status")}
                defaultValue=""
              >
                <option value="" disabled>
                  -- Choisir --
                </option>
                <option value="IN_PROGRESS">En cours</option>
              </select>
            </div>
          </div>
          <div className={styles.buttonContainer}>
            <button
              type="submit"
              disabled={isLoading}
              className={styles.button}
            >
              {isLoading ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
