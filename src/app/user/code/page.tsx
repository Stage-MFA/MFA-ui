"use client";
import styles from "@/app/style/page.module.css";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { BASE_URL_FRONTEND } from "@/lib/constants";
import Image from "next/image";
import { useAuthGuard } from "@/hooks/useAuthGuard";

const codeSchema = z.object({
  code: z
    .string()
    .min(1, "Le code est requis")
    .regex(/^\d{6}$/, "Le code doit contenir exactement 6 chiffres"),
});

type FormValues = z.infer<typeof codeSchema>;

export default function CodePage() {
  const router = useRouter();
  const loading = useAuthGuard();
  const [isLoading, setIsLoading] = useState(false);

  const codeNow = Cookies.get("code");

  useEffect(() => {
    if (!codeNow) {
      alert("Aucun code trouvé, veuillez vous reconnecter.");
      router.push("/");
    }
  }, [codeNow, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(codeSchema),
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      if (data.code === codeNow) {
        router.push(`${BASE_URL_FRONTEND}/user/pwd`);
      } else {
        alert("Code incorrect !");
        router.push("/");
      }
    } catch {
      alert("Une erreur est survenue.");
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return <div className={styles.loading}></div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.leftBlock}>
        <h2 className={styles.title}>Plateforme pour MFA</h2>
        <div className={styles.imageContainer}>
          <Image
            src="/population.png"
            alt="Population"
            height={600}
            width={600}
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
            src="/MAF_logo-removebg-preview.png"
            height={600}
            width={600}
            className={styles.logo}
          />
          <h2 className={styles.formTitle}>
            Entrez ici le code de vérification reçu par email :
          </h2>
        </div>

        <div className={styles.formSection}>
          <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <div>
              <label htmlFor="code" className={styles.label}>
                Code
              </label>
              <div className={styles.inputGroup}>
                <input
                  id="code"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  className={styles.input}
                  {...register("code")}
                />
              </div>
              {errors.code && (
                <p className={styles.error}>{errors.code.message}</p>
              )}
            </div>

            <div className={styles.buttonGroup}>
              <button
                type="submit"
                className={styles.button}
                disabled={isLoading}
              >
                {isLoading
                  ? "code" + ".".repeat((Date.now() / 300) % 4 | 0)
                  : "Vérifier"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
