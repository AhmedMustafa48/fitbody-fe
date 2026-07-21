import { createContext, useContext, useReducer, useEffect } from "react";
import apiClient from "@lib/api-client";

const AuthContext = createContext(null);

const initialState = { admin: null, isLoading: true };

const authReducer = (state, action) => {
  switch (action.type) {
    case "SET_ADMIN":
      return { admin: action.payload, isLoading: false };
    case "LOGOUT":
      return { admin: null, isLoading: false };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const fetchMe = () => {
    apiClient
      .get("/auth/me")
      .then((res) => dispatch({ type: "SET_ADMIN", payload: res.data.admin }))
      .catch(() => dispatch({ type: "SET_LOADING", payload: false }));
  };

  useEffect(() => {
    fetchMe();
  }, []);

  const login = (admin) => dispatch({ type: "SET_ADMIN", payload: admin });

  const logout = () => {
    apiClient.post("/auth/logout").finally(() => dispatch({ type: "LOGOUT" }));
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, fetchMe }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
