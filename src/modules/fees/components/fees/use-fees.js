import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@lib/api-client";

export const useFeesOverview = (params) =>
  useQuery({
    queryKey: ["fees", params],
    queryFn: () => apiClient.get("/fees", { params }).then((r) => r.data),
  });

export const useCollectFee = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => apiClient.post("/fees/collect", data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["fees"] });
      qc.invalidateQueries({ queryKey: ["member-profile"] });
    },
  });
};
