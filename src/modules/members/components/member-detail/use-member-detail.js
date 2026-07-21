import { useQuery } from "@tanstack/react-query";
import apiClient from "@lib/api-client";

const useMemberDetail = (id) =>
  useQuery({
    queryKey: ["member-profile", id],
    queryFn: () => apiClient.get(`/members/${id}/profile`).then((r) => r.data),
    enabled: !!id,
  });

export default useMemberDetail;
