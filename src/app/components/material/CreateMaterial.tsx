"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BASE_URL_API } from "@/lib/constants";
import styles from "@/app/style/createUser.module.css";
import Image from "next/image";
import { FaArrowLeft } from "react-icons/fa";

const formSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  type: z.string().min(1, "Le type est requis"),
  brand: z.string().min(1, "La marque est requise"),
  Model: z.string().min(1, "Le modèle est requis"),
  serialNumber: z
    .string()
    .min(1, "Le numéro de série est requis")
    .regex(/^\d+$/, "Le numéro de série doit être une série de chiffres"),
  acquisitionDat: z.date(),
  guarantee: z.string().optional().nullable(),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateMaterial() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      acquisitionDat: new Date(),
    },
  });

  function toLocalDateTimeString(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  }

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      const payload = {
        ...data,
        acquisitionDat: toLocalDateTimeString(data.acquisitionDat),
      };

      const response = await fetch(`${BASE_URL_API}/material`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Échec de la modification du matériel");
      router.push("/admin-ministere/material");
    } catch (error) {
      console.error("Erreur :", error);
      alert("Erreur lors de la modification du matériel");
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
          <div className={styles.grid}>
            <div className={styles.column}>
              <label className={styles.label}>Nom</label>
              <input
                type="text"
                {...register("name")}
                className={styles.input}
              />
              {errors.name && (
                <p className={styles.error}>{errors.name.message}</p>
              )}

              <label className={styles.label}>Type</label>
              <input
                type="text"
                {...register("type")}
                className={styles.input}
              />
              {errors.type && (
                <p className={styles.error}>{errors.type.message}</p>
              )}

              <label className={styles.label}>
                Date et heure d&apos;acquisition
              </label>
              <input
                type="datetime-local"
                className={styles.input}
                onChange={(e) => {
                  const newDate = new Date(e.target.value);
                  setValue("acquisitionDat", newDate);
                }}
              />
              {errors.acquisitionDat && (
                <p className={styles.error}>{errors.acquisitionDat.message}</p>
              )}
            </div>

            <div className={styles.column}>
              <label className={styles.label}>Marque</label>
              <input
                type="text"
                {...register("brand")}
                className={styles.input}
              />
              {errors.brand && (
                <p className={styles.error}>{errors.brand.message}</p>
              )}

              <label className={styles.label}>Modèle</label>
              <input
                type="text"
                {...register("Model")}
                className={styles.input}
              />
              {errors.Model && (
                <p className={styles.error}>{errors.Model.message}</p>
              )}

              <label className={styles.label}>Garantie</label>
              <input
                type="text"
                {...register("guarantee")}
                className={styles.input}
              />
            </div>
          </div>

          <label className={styles.label}>Numéro de série</label>
          <input
            type="text"
            {...register("serialNumber")}
            className={styles.input}
          />
          {errors.serialNumber && (
            <p className={styles.error}>{errors.serialNumber.message}</p>
          )}

          <div className={styles.buttonContainer}>
            <button
              type="submit"
              disabled={isLoading}
              className={styles.button}
            >
              {isLoading ? "Chargement..." : "Créer le matériel"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
