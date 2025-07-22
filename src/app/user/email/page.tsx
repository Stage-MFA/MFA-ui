"use client";
import styles from "@/app/style/page.module.css";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { BASE_URL_FRONTEND, BASE_URL_API } from "@/lib/constants";
import Image from "next/image";
import emailjs from "@emailjs/browser";

const emailSchema = z.object({
  email: z.string().email({ message: "Adresse e-mail invalide" }),
});

type FormValues = z.infer<typeof emailSchema>;

export default function Home() {
  const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!;
  const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!;
  const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!;

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(emailSchema),
  });

  const sendEmailCode = async (email: string, code: string) => {
    try {
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        { to_email: email, code: code },
        PUBLIC_KEY,
      );
    } catch (err) {
      console.error("Erreur EmailJS :", err);
    }
  };

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${BASE_URL_API}/auth/code`, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: data.email,
      });

      if (!res.ok) throw new Error("Email introuvable");

      const result = await res.json();
      const { accessToken, refreshToken, code } = result;

      if (!accessToken || !refreshToken || !code) {
        throw new Error("Réponse incomplète");
      }

      Cookies.set("accessToken", accessToken, { expires: 1 });
      Cookies.set("refreshToken", refreshToken, { expires: 7 });
      Cookies.set("code", code, { expires: 1 });
      Cookies.set("user", data.email, { expires: 1 });

      await sendEmailCode(data.email, code);

      router.push(`${BASE_URL_FRONTEND}/user/code`);
    } catch (err) {
      console.error(err);
      router.push(`${BASE_URL_FRONTEND}`);
      alert("Email introuvable");
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
          <h2 className={styles.formTitle}>Rechercher votre compte</h2>
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
            <div className={styles.buttonGroup}>
              <button
                type="submit"
                className={styles.button}
                disabled={isLoading}
              >
                {isLoading
                  ? "email" + ".".repeat((Date.now() / 300) % 4 | 0)
                  : "Continuer"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
