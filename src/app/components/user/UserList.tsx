"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BASE_URL_API } from "@/lib/constants";

type Role = {
  id: number;
  name: string;
};

type User = {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  roleResDto: Role[];
};

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch(`${BASE_URL_API}/users`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Erreur lors du chargement des utilisateurs");
        }

        const data = await res.json();
        setUsers(data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchUsers();
  }, []);

  const handleAddUser = () => {
    router.push("/admin-ministere/user/add");
  };

  return (
    <div>
      <button onClick={handleAddUser}>Ajouter un utilisateur</button>
      {users.map((user) => (
        <div
          key={user.id}
          style={{
            display: "flex",
            flexDirection: "row",
            marginBottom: "20px",
            border: "1px solid #ccc",
            padding: "10px",
            gap: "10px",
          }}
        >
          <h3>{user.firstname}</h3>
          <p>{user.lastname}</p>
          <p>{user.email}</p>
          <p>{user.roleResDto.map((role) => role.name).join(", ")}</p>
          <button>edit</button>
          <button>delete</button>
        </div>
      ))}
    </div>
  );
}
