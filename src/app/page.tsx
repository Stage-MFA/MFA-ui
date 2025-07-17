"use client";
import styles from "./style/page.module.css";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { BASE_URL_FRONTEND, BASE_URL_API } from "@/lib/constants";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";

const formSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z
    .string()
    .min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

type FormValues = z.infer<typeof formSchema>;

export default function Home() {
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
      const response = await fetch(`${BASE_URL_API}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Échec de la connexion");
      }

      const result = await response.json();
      if (!result.accessToken || !result.refreshToken) {
        throw new Error("Token manquant dans la réponse");
      }

      Cookies.set("accessToken", result.accessToken, { expires: 1 });
      Cookies.set("refreshToken", result.refreshToken, { expires: 7 });
      Cookies.set("user", data.email, { expires: 1 });

      router.push(`${BASE_URL_FRONTEND}/admin-ministere`);
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
      alert("Email ou mot de passe incorrect.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftBlock}>
        <h2 className={styles.title}>Plateforme pour MFA</h2>
        <div className={styles.imageContainer}>
          <Image
            src="/population.png"
            alt="Population"
            className={styles.populationImage}
          />
          <h2 className={styles.madagascarTitle}>MADAGASCAR</h2>
          <span className={styles.status}>● En ligne</span>
        </div>
        <div className={styles.welcome}>
          <span className={styles.welcomeText}>
            Bienvenue sur la plateforme nationale de MFA
          </span>
        </div>
      </div>

      <div className={styles.rightBlock}>
        <div className={styles.formContainer}>
          <Image
            alt="Logo Ministère"
            src="./MAF_logo-removebg-preview.png"
            className={styles.logo}
          />
          <h2 className={styles.formTitle}>Se connecter</h2>
        </div>

        <div className={styles.formSection}>
          <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <div>
              <label htmlFor="email" className={styles.label}>
                Email
              </label>
              <div className={styles.inputGroup}>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className={styles.input}
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className={styles.error}>{errors.email.message}</p>
              )}
            </div>

            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <label htmlFor="password" className={styles.label}>
                  Mot de passe
                </label>
                <a href="#" className={styles.forgotLink}>
                  Mot de passe oublié ?
                </a>
              </div>
              <div
                className={styles.inputGroup}
                style={{ position: "relative" }}
              >
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  className={styles.input}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className={styles.error}>{errors.password.message}</p>
              )}
            </div>

            <div className={styles.buttonGroup}>
              <button
                type="submit"
                className={styles.button}
                disabled={isLoading}
              >
                {isLoading
                  ? "Connexion" + ".".repeat((Date.now() / 300) % 4 | 0)
                  : "Se connecter"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
