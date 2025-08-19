"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BASE_URL_API } from "@/lib/constants";
import styles from "@/app/style/createUser.module.css";
import Image from "next/image";
import { FaArrowLeft } from "react-icons/fa";

type Role = {
  id: number;
  name: string;
};

type User = {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
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

const formSchemaIntervention = z.object({
  dateIntervention: z.string().min(1, "Date requise"),
  status: z.enum(["PENDING", "IN_PROGRESS", "FINISH"]),
  description: z.string().min(1, "Description invalide"),
  idUser: z.number(),
  interventionRequestId: z.number(),
});

type FormValuesIntervention = z.infer<typeof formSchemaIntervention>;

export default function CreateIntervention() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [request, setRequest] = useState<Request>();
  const [user, setUser] = useState<User[]>([]);
  const searchParams = useSearchParams();
  const idRequest = searchParams.get("interventionRequestId");

  useEffect(() => {
    async function fetchRequestById() {
      try {
        const requestRes = await fetch(`${BASE_URL_API}/request/${idRequest}`, {
          method: "GET",
          headers: { "content-type": "application/json" },
          cache: "no-store",
        });
        if (!requestRes.ok) {
          throw new Error("Erreur chargement demande intervention");
        }
        const data: Request = await requestRes.json();
        data.status = "IN_PROGRESS";
        setRequest(data);
      } catch (error) {
        console.error(error);
        alert("Erreur chargement demande intervention !");
      }
    }
    if (idRequest) {
      fetchRequestById();
    }
  }, [idRequest]);

  useEffect(() => {
    async function fetchUserById() {
      try {
        const userRes = await fetch(`${BASE_URL_API}/users`, {
          method: "GET",
          headers: { "content-type": "application/json" },
          cache: "no-store",
        });
        if (!userRes.ok) {
          throw new Error("Erreur de chargement d'utilisateur");
        }
        const data: User[] = await userRes.json();
        const dataList = data.filter((u) =>
          u.roleResDto.some((role) => role.name === "TECHNICIAN"),
        );
        setUser(dataList);
      } catch (error) {
        console.error(error);
        alert("Erreur chargement utilisateur lié à la demande intervention.");
      }
    }
    if (request?.idUser) {
      fetchUserById();
    }
  }, [request?.idUser]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValuesIntervention>({
    resolver: zodResolver(formSchemaIntervention),
    defaultValues: {
      dateIntervention: new Date().toISOString().slice(0, 16),
      status: "PENDING",
      idUser: 0,
      interventionRequestId: idRequest ? Number(idRequest) : 0,
      description: "",
    },
  });

  const onSubmit = async (dataForm: FormValuesIntervention) => {
    if (!request) return;

    setIsLoading(true);
    try {
      const responseRequest = await fetch(
        `${BASE_URL_API}/request/${idRequest}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(request),
        },
      );

      const responseIntervention = await fetch(
        `${BASE_URL_API}/interventions`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(dataForm),
        },
      );

      if (!responseRequest.ok || !responseIntervention.ok) {
        throw new Error("Échec de la création de la demande");
      }
      router.push("/admin-ministere/request-intervention");
    } catch (error) {
      console.error("Erreur :", error);
      alert("Erreur lors de la création de la demande");
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
              <label className={styles.label}>Date intervention</label>
              <input
                type="datetime-local"
                className={styles.input}
                {...register("dateIntervention")}
              />
              {errors.dateIntervention && (
                <p className={styles.error}>
                  {errors.dateIntervention.message}
                </p>
              )}
            </div>
            <div className={styles.column}>
              <label className={styles.label}>Technicien</label>
              <select
                className={styles.input}
                {...register("idUser", { valueAsNumber: true })}
              >
                <option value="">-- Sélectionner un technicien --</option>
                {user.map((dir) => (
                  <option key={dir.id} value={dir.id}>
                    {dir.firstname} {dir.lastname} {`(${dir.speciality})`}
                  </option>
                ))}
              </select>
              {errors.idUser && (
                <p className={styles.error}>{errors.idUser.message}</p>
              )}
            </div>
          </div>
          <label className={styles.label}>Description</label>
          <input
            type="text"
            className={styles.input}
            {...register("description")}
            style={{ minHeight: "120px" }}
          />
          {errors.description && (
            <p className={styles.error}>{errors.description.message}</p>
          )}
          <div className={styles.buttonContainer}>
            <button
              type="submit"
              disabled={isLoading}
              className={styles.button}
            >
              {isLoading ? "Envoi..." : "Créer intervention"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
