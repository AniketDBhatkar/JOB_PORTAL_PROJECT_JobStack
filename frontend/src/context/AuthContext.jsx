import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

// The backend has no "get current logged-in user" endpoint, only login/logout
// (which set/clear an httpOnly cookie the frontend can't read). So we persist
// the user object returned at login time in localStorage and rehydrate it on
// page load. This is a client-side convenience only — it is NOT what protects
// your API routes; isAuthenticate.js (the cookie check) still does that.
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("hirely_user");
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("hirely_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("hirely_user");
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
