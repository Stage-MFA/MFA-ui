"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { useState } from "react";

export const useRoleGuard = (requiredRole: "ADMIN" | "USER" | "TECHNICIAN") => {
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const role = Cookies.get("role");

    if (!role || role !== requiredRole) {
      router.replace("/inaccessible");
    } else {
      setIsVerifying(false);
    }
  }, [requiredRole, router]);

  return { isVerifying };
};
