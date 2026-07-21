import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@lib/api-client";

const KEY = "members";

export const useMembers = (params = {}) =>
  useQuery({
    queryKey: [KEY, params],
    queryFn: () => apiClient.get("/members", { params }).then((r) => r.data),
  });

export const useCreateMember = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => apiClient.post("/members", data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
};

export const useUpdateMember = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) =>
      apiClient.put(`/members/${id}`, data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
};

export const useDeleteMember = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => apiClient.delete(`/members/${id}`).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
};
