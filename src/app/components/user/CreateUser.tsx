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
  firstname: z.string().min(1, "Le prénom est requis"),
  lastname: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Email invalide").min(1, "L'email est requis"),
  password: z
    .string()
    .min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  gender: z.enum(["M", "F"]),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateUser() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
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
      const response = await fetch(`${BASE_URL_API}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Échec de la création de l'utilisateur");
      }

      alert("Utilisateur créé avec succès");
      router.push("/admin-ministere/user");
    } catch (error) {
      console.error("Erreur :", error);
      alert("Erreur lors de la création de l'utilisateur");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.formContainer}>
        <Image
          alt="Logo Ministère"
          src="/materiel3.png"
          height={600}
          width={600}
          className={styles.logo}
        />

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <button
            type="button"
            className={styles.backButton}
            onClick={() => router.back()}
          >
            <FaArrowLeft />
          </button>

          <div className={styles.grid}>
            <div className={styles.column}>
              <label className={styles.label}>Prénom</label>
              <input
                type="text"
                {...register("firstname")}
                className={styles.input}
              />
              {errors.firstname && (
                <p className={styles.error}>{errors.firstname.message}</p>
              )}

              <label className={styles.label}>Nom</label>
              <input
                type="text"
                {...register("lastname")}
                className={styles.input}
              />
              {errors.lastname && (
                <p className={styles.error}>{errors.lastname.message}</p>
              )}
            </div>

            <div className={styles.column}>
              <label className={styles.label}>Email</label>
              <input
                type="email"
                {...register("email")}
                className={styles.input}
              />
              {errors.email && (
                <p className={styles.error}>{errors.email.message}</p>
              )}

              <label className={styles.label}>Mot de passe</label>
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                className={styles.input}
              />
              {errors.password && (
                <p className={styles.error}>{errors.password.message}</p>
              )}

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={styles.togglePasswordBtn}
              >
                {showPassword ? "Cacher" : "Afficher"} le mot de passe
              </button>
            </div>
          </div>

          <div>
            <label className={styles.label}>Genre</label>
            <select {...register("gender")} className={styles.select}>
              <option value="">Sélectionner...</option>
              <option value="M">Masculin</option>
              <option value="F">Féminin</option>
            </select>
            {errors.gender && (
              <p className={styles.error}>{errors.gender.message}</p>
            )}
          </div>

          <button type="submit" disabled={isLoading} className={styles.button}>
            {isLoading ? "Chargement..." : "Créer l'utilisateur"}
          </button>
        </form>
      </div>
    </div>
  );
}
