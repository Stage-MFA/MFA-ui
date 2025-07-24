"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BASE_URL_API } from "@/lib/constants";

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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Échec de la création de l'utilisateur");
      }

      alert("Utilisateur créé avec succès");
      router.push("/admin-ministere/user");
    } catch (error) {
      console.error("Erreur lors de la création de l'utilisateur :", error);
      alert("Erreur lors de la création de l'utilisateur");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>Create User</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Prénom</label>
          <input type="text" {...register("firstname")} />
          {errors.firstname && <p>{errors.firstname.message}</p>}
        </div>
        <div>
          <label>Nom</label>
          <input type="text" {...register("lastname")} />
          {errors.lastname && <p>{errors.lastname.message}</p>}
        </div>
        <div>
          <label>Email</label>
          <input type="email" {...register("email")} />
          {errors.email && <p>{errors.email.message}</p>}
        </div>
        <div>
          <label>Mot de passe</label>
          <input
            type={showPassword ? "text" : "password"}
            {...register("password")}
          />
          {errors.password && <p>{errors.password.message}</p>}
          <button type="button" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? "Cacher" : "Afficher"}
          </button>
        </div>
        <div>
          <label>Genre</label>
          <select {...register("gender")}>
            <option value="">Sélectionner...</option>
            <option value="M">Masculin</option>
            <option value="F">Féminin</option>
          </select>
          {errors.gender && <p>{errors.gender.message}</p>}
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Chargement..." : "Créer l'utilisateur"}
        </button>
      </form>
    </div>
  );
}
