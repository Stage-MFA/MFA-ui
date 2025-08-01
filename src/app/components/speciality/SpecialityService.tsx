import { BASE_URL_API } from "@/lib/constants";

export type Speciality = {
  specialityId: number;
  name: string;
};

export async function fetchSpecialities(): Promise<Speciality[]> {
  try {
    const response = await fetch(`${BASE_URL_API}/speciality`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Erreur lors du chargement des spécialités");
    }

    const data = await response.json();
    return data as Speciality[];
  } catch (error) {
    console.error("Erreur dans fetchDirections:", error);
    return [];
  }
}
