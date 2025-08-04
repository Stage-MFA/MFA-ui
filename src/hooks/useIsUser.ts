import { useRoleGuard } from "./useRoleGuard";

export const useIsUser = () => useRoleGuard("USER");
