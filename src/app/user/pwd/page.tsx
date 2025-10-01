"use client";
import styles from "@/app/style/page.module.css";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { BASE_URL_FRONTEND, BASE_URL_API } from "@/lib/constants";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";

const passwordSchema = z
  .object({
    password: z.string().min(6, "Mot de passe trop court (min 6 caractères)"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof passwordSchema>;

export default function PasswordPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = async (data: FormValues) => {
    const email = sessionStorage.getItem("user");

    if (!email) {
      alert("Utilisateur introuvable dans la session.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URL_API}/users/pwd`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: data.password,
        }),
      });

      if (!response.ok) {
        throw new Error("Échec de la mise à jour du mot de passe");
      }

      sessionStorage.removeItem("code");
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("accessToken");
      sessionStorage.removeItem("refreshToken");

      alert("Mot de passe mis à jour avec succès !");
      router.push(`${BASE_URL_FRONTEND}/`);
    } catch (error) {
      console.error("Erreur :", error);
      alert("Impossible de mettre à jour le mot de passe.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.logoCorner}>
        <Image
          src="/mfa.png"
          alt="Logo entreprise"
          width={50}
          height={50}
          className={styles.roundLogo}
        />
      </div>
      <div className={styles.leftBlock}>
        <h2 className={styles.title}>Gestion de la maintenance </h2>
        <div className={styles.imageContainer}>
          <Image
            src="/materiel2.png"
            alt="Materiel"
            height={600}
            width={600}
            className={styles.populationImage}
          />
        </div>
        <div className={styles.welcome}>
          <span className={styles.welcomeText}>
            Ministère des Forces Armées
          </span>
        </div>
      </div>

      <div className={styles.rightBlock}>
        <div className={styles.formContainer}>
          <Image
            alt="Logo Ministère"
            src="/materiel3.png"
            height={600}
            width={600}
            className={styles.logo}
          />
          <h2 className={styles.formTitle}>Changer votre mot de passe</h2>
        </div>

        <div className={styles.formSection}>
          <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <div style={{ position: "relative" }}>
              <label htmlFor="password" className={styles.label}>
                Nouveau mot de passe
              </label>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className={styles.input}
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: 10,
                  top: 38,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
              {errors.password && (
                <p className={styles.error}>{errors.password.message}</p>
              )}
            </div>

            <div style={{ position: "relative" }}>
              <label htmlFor="confirmPassword" className={styles.label}>
                Confirmer le mot de passe
              </label>
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                className={styles.input}
                {...register("confirmPassword")}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: "absolute",
                  right: 10,
                  top: 38,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {showConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
              {errors.confirmPassword && (
                <p className={styles.error}>{errors.confirmPassword.message}</p>
              )}
            </div>

            <div className={styles.buttonGroup}>
              <button
                type="submit"
                className={styles.button}
                disabled={isLoading}
              >
                {isLoading ? "Enregistrement..." : "Valider le mot de passe"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
