import React from "react";
import { Navigate } from "react-router-dom";

import { useProfile } from "../hooks/index";

const AuthProtected = (props: any) => {
  const { userProfile, loading } = useProfile();

  // Espera a que termine de cargar
  if (loading) return null;

  // Redirige si no hay usuario
  if (!userProfile) {
    return <Navigate to="/auth-login" />;
  }

  // Si todo bien, deja pasar
  return <>{props.children}</>;
};

export { AuthProtected };
