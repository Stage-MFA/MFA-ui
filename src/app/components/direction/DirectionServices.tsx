import { BASE_URL_API } from "@/lib/constants";

export type Direction = {
  directionId: number;
  name: string;
};

export async function fetchDirections(): Promise<Direction[]> {
  try {
    const response = await fetch(`${BASE_URL_API}/directions`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Erreur lors du chargement des directions");
    }

    const data = await response.json();
    return data as Direction[];
  } catch (error) {
    console.error("Erreur dans fetchDirections:", error);
    return [];
  }
}
