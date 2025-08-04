import { useRoleGuard } from "./useRoleGuard";

export const useIsTechnician = () => useRoleGuard("TECHNICIAN");
