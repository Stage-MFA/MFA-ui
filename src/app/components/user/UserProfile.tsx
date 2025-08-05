"use client";

import Image from "next/image";
import styles from "@/app/style/userProfile.module.css";
import createUserStyles from "@/app/style/createUser.module.css";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { BASE_URL_API } from "@/lib/constants";
import { FiEdit } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FaArrowLeft } from "react-icons/fa";
import { fetchDirections } from "@/app/components/direction/DirectionServices";
import { fetchSpecialities } from "@/app/components/speciality/SpecialityService";

const formSchema = z.object({
  firstname: z.string().min(1, "Le prénom est requis"),
  lastname: z.string().min(1, "Le nom est requis"),
  directionId: z
    .string()
    .refine((val) => Number(val) > 0, "Veuillez sélectionner une direction"),
  specialityId: z.string().optional().nullable(),
  gender: z.enum(["M", "F"]),
});

type FormValues = z.infer<typeof formSchema>;

type Role = { id: number; name: string };
type Direction = { directionId: number; name: string };
type Speciality = { specialityId: number; name: string };

type User = {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  direction: string;
  speciality: string;
  role: string;
  roleResDto: Role[];
};

export default function UserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [directions, setDirections] = useState<Direction[]>([]);
  const [specialities, setSpecialities] = useState<Speciality[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    loadUser();
    fetchDirections().then(setDirections);
    fetchSpecialities().then(setSpecialities);
  }, []);

  const loadUser = async () => {
    const email = Cookies.get("user");
    if (!email) return;

    try {
      const res = await fetch(`${BASE_URL_API}/users/email?email=${email}`, {
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Erreur de récupération");
      const data: User = await res.json();
      setUser(data);
    } catch (err) {
      console.error(err);
    }
  };

  const showEditModal = () => {
    if (!user) return;
    reset({
      firstname: user.firstname,
      lastname: user.lastname,
      directionId:
        directions
          .find((d) => d.name === user.direction)
          ?.directionId.toString() || "",
      specialityId:
        specialities
          .find((s) => s.name === user.speciality)
          ?.specialityId.toString() || "",
      gender: "M",
    });
    setEditModalOpen(true);
  };

  const onSubmit = async (formData: FormValues) => {
    if (!user) return;
    try {
      const payload = {
        ...formData,
        directionId: parseInt(formData.directionId),
        specialityId: formData.specialityId
          ? parseInt(formData.specialityId)
          : null,
        email: user.email,
        password: "unchanged",
      };

      const res = await fetch(`${BASE_URL_API}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Erreur mise à jour");

      alert("Profil mis à jour !");
      setEditModalOpen(false);
      loadUser();
    } catch (err) {
      alert("Erreur lors de la mise à jour");
      console.error(err);
    }
  };

  if (!user) return <p className={styles.loading}></p>;

  return (
    <div className={styles.page}>
      {isEditModalOpen && (
        <div className={createUserStyles.wrapper}>
          <div className={createUserStyles.formContainer}>
            <Image
              alt="Logo Ministère"
              src="/materiel3.png"
              height={600}
              width={600}
              className={createUserStyles.logo}
            />
            <form
              onSubmit={handleSubmit(onSubmit)}
              className={createUserStyles.form}
            >
              <button
                type="button"
                className={createUserStyles.backButton}
                onClick={() => setEditModalOpen(false)}
              >
                <FaArrowLeft />
              </button>

              <div className={createUserStyles.grid}>
                <div className={createUserStyles.column}>
                  <label className={createUserStyles.label}>Prénom</label>
                  <input
                    {...register("firstname")}
                    className={createUserStyles.input}
                  />
                  {errors.firstname && (
                    <p className={createUserStyles.error}>
                      {errors.firstname.message}
                    </p>
                  )}

                  <label className={createUserStyles.label}>Nom</label>
                  <input
                    {...register("lastname")}
                    className={createUserStyles.input}
                  />
                  {errors.lastname && (
                    <p className={createUserStyles.error}>
                      {errors.lastname.message}
                    </p>
                  )}

                  <label className={createUserStyles.label}>Direction</label>
                  <select
                    {...register("directionId")}
                    className={createUserStyles.select}
                  >
                    <option value="">-- Sélectionner une direction --</option>
                    {directions.map((dir) => (
                      <option key={dir.directionId} value={dir.directionId}>
                        {dir.name}
                      </option>
                    ))}
                  </select>
                  {errors.directionId && (
                    <p className={createUserStyles.error}>
                      {errors.directionId.message}
                    </p>
                  )}
                </div>

                <div className={createUserStyles.column}>
                  <label className={createUserStyles.label}>Spécialité</label>
                  <select
                    {...register("specialityId")}
                    className={createUserStyles.select}
                  >
                    <option value="">-- Sélectionner une spécialité --</option>
                    {specialities.map((spec) => (
                      <option key={spec.specialityId} value={spec.specialityId}>
                        {spec.name}
                      </option>
                    ))}
                  </select>

                  <label className={createUserStyles.label}>Genre</label>
                  <select
                    {...register("gender")}
                    className={createUserStyles.select}
                  >
                    <option value="">Sélectionner...</option>
                    <option value="M">Masculin</option>
                    <option value="F">Féminin</option>
                  </select>
                  {errors.gender && (
                    <p className={createUserStyles.error}>
                      {errors.gender.message}
                    </p>
                  )}
                </div>
              </div>

              <div className={createUserStyles.buttonContainer}>
                <button type="submit" className={createUserStyles.button}>
                  Mettre à jour
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className={styles.cover}>
        <Image
          src="/cover.jpg"
          alt="Cover"
          layout="fill"
          objectFit="cover"
          className={styles.coverImage}
        />
      </div>

      <div className={styles.profileHeader}>
        <div className={styles.avatarWrapper}>
          <Image
            src="/materiel3.png"
            alt="Avatar"
            width={150}
            height={150}
            className={styles.avatar}
          />
        </div>
        <div className={styles.userInfo}>
          <h1 className={styles.fullName}>
            {user.firstname} {user.lastname}
          </h1>
          <p className={styles.email}>{user.email}</p>
          <button
            className={styles.editButton}
            onClick={showEditModal}
            title="Modifier le profil"
          >
            <FiEdit />
          </button>
        </div>
      </div>

      <div className={styles.profileBody}>
        <div className={styles.card}>
          <h2>À propos</h2>
          <div className={styles.infoGrid}>
            <ProfileInfo
              label="Nom complet"
              value={`${user.firstname} ${user.lastname}`}
            />
            <ProfileInfo label="Spécialité" value={user.speciality} />
            <ProfileInfo label="Direction" value={user.direction} />
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Rôles</span>
              <div className={styles.roles}>
                {user.roleResDto.map((role) => (
                  <span key={role.id} className={styles.roleTag}>
                    {role.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileInfo({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.infoItem}>
      <span className={styles.infoLabel}>{label}</span>
      <span className={styles.infoValue}>{value}</span>
    </div>
  );
}
