import { BASE_URL_API } from "@/lib/constants";

export type Role = {
  id: number;
  name: string;
};

export type User = {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  direction: string;
  speciality: string;
  role: string;
  roleResDto: Role[];
};

export async function getUsersWithoutRoleCount(): Promise<number> {
  const res = await fetch(`${BASE_URL_API}/users`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Erreur lors du chargement des utilisateurs");

  const data: User[] = await res.json();

  return data.filter((user) => user.roleResDto.length === 0).length;
}
