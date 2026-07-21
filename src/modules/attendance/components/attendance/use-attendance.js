import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@lib/api-client";

const todayStr = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const useActiveMembers = () =>
  useQuery({
    queryKey: ["members", "active-all"],
    queryFn: () =>
      apiClient
        .get("/members", { params: { isActive: true, limit: 500 } })
        .then((r) => r.data),
  });

export const useTodayAttendance = () => {
  const date = todayStr();
  return useQuery({
    queryKey: ["attendance", "today", date],
    queryFn: () =>
      apiClient
        .get("/attendance", { params: { date } })
        .then((r) => r.data),
  });
};

export const useMarkAttendance = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ memberId, status }) =>
      apiClient
        .post("/attendance", { member: memberId, date: todayStr(), status })
        .then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["attendance", "today"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
};
