import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function TokenWatcher() {
  const { auth, logout } = useAuth();

  useEffect(() => {
    if (!auth?.token) return;

    // Use a protected endpoint to check token validity
    const checkAuth = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/user/me/", {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        });
        if (res.status === 401 || res.status === 403) {
          logout();
        }
      } catch {
        logout();
      }
    };

    checkAuth();
  }, [auth, logout]);

  return null;
}
