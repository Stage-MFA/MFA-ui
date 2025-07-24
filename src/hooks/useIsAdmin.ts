"use client";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
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

export function useIsAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get("accessToken");
    const email = Cookies.get("user");

    if (!token || !email) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch(`${BASE_URL_API}/users/email?email=${email}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store",
        });

        if (!res.ok) throw new Error("Utilisateur non trouvé");

        const user: User = await res.json();
        const admin = user.roleResDto.some((role) => role.name === "ADMIN");
        setIsAdmin(admin);
      } catch (error) {
        console.error("Erreur isAdmin", error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { isAdmin, loading };
}
