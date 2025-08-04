import { useRoleGuard } from "./useRoleGuard";

export const useIsAdmin = () => useRoleGuard("ADMIN");
