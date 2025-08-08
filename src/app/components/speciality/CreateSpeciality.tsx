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
});
type FormValues = z.infer<typeof formSchema>;

export default function CreateSpeciality() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      const payload = {
        ...data,
      };

      const response = await fetch(`${BASE_URL_API}/speciality`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok)
        throw new Error("Échec d'enregistrement de la spécialité");
      router.push("/admin-ministere/speciality");
    } catch (error) {
      console.error("Erreur :", error);
      alert("Erreur lors de l'enregistrement de la spécialité");
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
          src="/speciality.png"
          width={300}
          height={200}
          className={styles.logo}
        />

        <form
          onSubmit={handleSubmit(onSubmit)}
          className={styles.form}
          style={{ marginTop: "20px" }}
        >
          <div className={styles.grid}>
            <div className={styles.column}>
              <label htmlFor="name" className={styles.label}>
                Nom de la Spécialité
              </label>
              <input
                id="name"
                type="text"
                {...register("name")}
                className={styles.input}
              />
              {errors.name && (
                <p className={styles.error}>{errors.name.message}</p>
              )}
            </div>
          </div>

          <div className={styles.buttonContainer}>
            <button
              type="submit"
              disabled={isLoading}
              className={styles.button}
            >
              {isLoading ? "Chargement..." : "Créer la Spécialité"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
