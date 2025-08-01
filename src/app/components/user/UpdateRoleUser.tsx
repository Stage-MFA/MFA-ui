"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { BASE_URL_API, BASE_URL_FRONTEND } from "@/lib/constants";
import { useRouter } from "next/navigation";
import styles from "@/app/style/updateRoleUser.module.css";
import { FiArrowLeft } from "react-icons/fi";

const formSchema = z.object({
  role: z.string().min(1, "Le rôle est requis"),
});

type FormValues = z.infer<typeof formSchema>;

export default function UpdateRoleUser() {
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const [isLoading, setIsLoading] = useState(false);

  const onSubmitUpdate = async (data: FormValues) => {
    if (!emailParam) {
      alert("Email utilisateur non fourni.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URL_API}/users/role`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailParam, role: data.role }),
      });

      if (!response.ok)
        throw new Error("Erreur lors de la mise à jour du rôle.");
      router.push(`${BASE_URL_FRONTEND}/admin-ministere/user`);

      alert("Rôle mis à jour avec succès !");
      reset();
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitRemove = async (data: FormValues) => {
    if (!emailParam) {
      alert("Email utilisateur non fourni.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URL_API}/users/role`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailParam, role: data.role }),
      });

      if (!response.ok) throw new Error("Erreur lors du retrait du rôle.");
      router.push(`${BASE_URL_FRONTEND}/admin-ministere/user`);
      alert("Rôle retiré avec succès !");
      reset();
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.formContainer}>
        <button
          type="button"
          onClick={() => router.back()}
          className={styles.cancelButton}
          aria-label="Annuler et revenir en arrière"
        >
          <FiArrowLeft className={styles.backButton} size={24} />
        </button>
        <form onSubmit={handleSubmit(onSubmitUpdate)} className={styles.form}>
          <label htmlFor="role" className={styles.label}>
            Liste rôle diponible :
          </label>
          <select id="role" {...register("role")} className={styles.select}>
            <option value="">-- Sélectionner un rôle --</option>
            <option value="ADMIN">Administrateur</option>
            <option value="USER">Utilisateur</option>
            <option value="TECHNICIAN">Technicien</option>
          </select>
          {errors.role && <p className={styles.error}>{errors.role.message}</p>}

          <button type="submit" disabled={isLoading} className={styles.button}>
            {isLoading ? "Mise à jour..." : "Mettre à jour le rôle"}
          </button>
        </form>

        <form
          onSubmit={handleSubmit(onSubmitRemove)}
          className={styles.formRemove}
        >
          <button
            type="submit"
            disabled={isLoading}
            className={styles.buttonRemove}
          >
            {isLoading ? "Suppression..." : "Enlever le rôle"}
          </button>
        </form>
      </div>
    </div>
  );
}
