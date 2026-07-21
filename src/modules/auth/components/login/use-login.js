import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@app/auth-context/auth-context";
import apiClient from "@lib/api-client";

const schema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

const useLogin = () => {
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data) => {
    setServerError("");
    try {
      const res = await apiClient.post("/auth/login", data);
      login(res.data.admin);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setServerError(err?.response?.data?.message ?? "Login failed");
    }
  };

  return { form, onSubmit: form.handleSubmit(onSubmit), serverError };
};

export default useLogin;
