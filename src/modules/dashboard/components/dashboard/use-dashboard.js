import { useQuery } from "@tanstack/react-query";
import apiClient from "@lib/api-client";

const useDashboard = () =>
  useQuery({
    queryKey: ["dashboard"],
    queryFn: () => apiClient.get("/dashboard/stats").then((r) => r.data),
    refetchInterval: 60_000,
    staleTime: 0,
  });

export default useDashboard;
