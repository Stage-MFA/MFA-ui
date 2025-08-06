"use client";

import Image from "next/image";
import styles from "@/app/style/userProfile.module.css";
import { useEffect, useState } from "react";
import { BASE_URL_API } from "@/lib/constants";
import { FiEdit } from "react-icons/fi";
import {
  fetchDirections,
  Direction,
} from "@/app/components/direction/DirectionServices";
import {
  fetchSpecialities,
  Speciality,
} from "@/app/components/speciality/SpecialityService";

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
  role: string;
  roleResDto: Role[];
  gender?: string;
};

export default function UserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);

  const [directions, setDirections] = useState<Direction[]>([]);
  const [specialities, setSpecialities] = useState<Speciality[]>([]);

  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    directionId: "",
    specialityId: "",
    gender: "M",
  });

  const email = sessionStorage.getItem("user");

  useEffect(() => {
    if (!email) return;

    async function fetchUser() {
      const res = await fetch(`${BASE_URL_API}/users/email?email=${email}`);
      if (!res.ok) return;
      const data: User = await res.json();
      setUser(data);

      const directions = await fetchDirections();
      const specialities = await fetchSpecialities();
      setDirections(directions);
      setSpecialities(specialities);

      const direction = directions.find(
        (d: Direction) => d.name === data.direction,
      );
      const speciality = specialities.find(
        (s: Speciality) => s.name === data.speciality,
      );

      setForm({
        firstname: data.firstname,
        lastname: data.lastname,
        directionId: direction?.directionId?.toString() || "",
        specialityId: speciality?.specialityId?.toString() || "",
        gender: data.gender || "M",
      });
    }

    fetchUser();
  }, [email]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    if (!user) return;

    const payload = {
      ...form,
      directionId: parseInt(form.directionId),
      specialityId: form.specialityId ? parseInt(form.specialityId) : null,
      email: user.email,
      password: sessionStorage.getItem("pwd"),
    };

    const res = await fetch(`${BASE_URL_API}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setShowModal(false);
      const refreshed = await fetch(
        `${BASE_URL_API}/users/email?email=${user.email}`,
      );
      const refreshedUser = await refreshed.json();
      setUser(refreshedUser);
    } else {
      alert("Erreur lors de la mise à jour");
    }
  };

  if (!user) return <p></p>;

  return (
    <div className={styles.page}>
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
            onClick={() => setShowModal(true)}
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
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Nom complet</span>
              <span className={styles.infoValue}>
                {user.firstname} {user.lastname}
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Spécialité</span>
              <span className={styles.infoValue}>{user.speciality}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Direction</span>
              <span className={styles.infoValue}>{user.direction}</span>
            </div>
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

      {/* Modal */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Modifier mon profil</h3>
            <input
              name="firstname"
              value={form.firstname}
              onChange={handleChange}
              placeholder="Prénom"
              className={styles.input}
            />
            <input
              name="lastname"
              value={form.lastname}
              onChange={handleChange}
              placeholder="Nom"
              className={styles.input}
            />

            <select
              name="directionId"
              value={form.directionId}
              onChange={handleChange}
              className={styles.input}
            >
              <option value="">-- Direction --</option>
              {directions.map((d) => (
                <option key={d.directionId} value={d.directionId}>
                  {d.name}
                </option>
              ))}
            </select>

            <select
              name="specialityId"
              value={form.specialityId}
              onChange={handleChange}
              className={styles.input}
            >
              <option value="">-- Spécialité --</option>
              {specialities.map((s) => (
                <option key={s.specialityId} value={s.specialityId}>
                  {s.name}
                </option>
              ))}
            </select>

            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className={styles.input}
            >
              <option value="M">Masculin</option>
              <option value="F">Féminin</option>
            </select>

            <div className={styles.modalActions}>
              <button onClick={handleUpdate} className={styles.button}>
                Enregistrer
              </button>
              <button
                onClick={() => setShowModal(false)}
                className={styles.buttonCancel}
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
