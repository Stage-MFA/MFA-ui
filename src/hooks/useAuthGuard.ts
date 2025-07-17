import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export function useAuthGuard() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("accessToken");
    if (!token) {
      router.push("/");
    } else {
      setLoading(false);
    }
  },[router]);

  return loading;
}
export default useAuthGuard;
