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

async function getUsers() {
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

  return res.json();
}

export default async function Users() {
  const users = await getUsers();

  return (
    <div>
      {users.map((user: User) => (
        <div key={user.id}>
          <h3>{user.firstname}</h3>
          <p>{user.lastname}</p>
          <p>{user.email}</p>
          <p>{user.roleResDto.map((role: Role) => role.name).join(", ")}</p>
        </div>
      ))}
    </div>
  );
}
