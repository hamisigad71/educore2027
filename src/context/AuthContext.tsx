import React, { createContext, useContext, useState } from "react";

export type Role = "admin" | "teacher" | "parent" | "staff" | null;

interface AuthUser {
  name: string;
  role: Role;
  email: string;
  photo: string;
}

interface AuthContextType {
  user: AuthUser | null;
  portal: string | null;
  department: string | null;
  login: (role: Role, portal: string, department?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const roleProfiles: Record<Exclude<Role, null>, AuthUser> = {
  admin: {
    name: "Mr. Daniel Kamau",
    role: "admin",
    email: "admin@brightfutures.ac.ke",
    photo:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=200",
  },
  teacher: {
    name: "Mrs. Jane Wambui",
    role: "teacher",
    email: "jane.wambui@shule.go.ke",
    photo:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200",
  },
  parent: {
    name: "Amani Otieno's Parent",
    role: "parent",
    email: "parent@gmail.com",
    photo:
      "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=200",
  },
  staff: {
    name: "Mr. Kevin Njoroge",
    role: "staff",
    email: "kevin.njoroge@shule.go.ke",
    photo:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200",
  },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [portal, setPortal] = useState<string | null>(() =>
    localStorage.getItem("portal"),
  );
  const [department, setDepartment] = useState<string | null>(() =>
    localStorage.getItem("department"),
  );

  const login = (role: Role, portal: string, dept?: string) => {
    if (role) setUser(roleProfiles[role]);
    setPortal(portal);
    localStorage.setItem("portal", portal);
    
    if (dept) {
      setDepartment(dept);
      localStorage.setItem("department", dept);
    } else {
      setDepartment(null);
      localStorage.removeItem("department");
    }
  };

  const logout = () => {
    setUser(null);
    setPortal(null);
    setDepartment(null);
    localStorage.removeItem("portal");
    localStorage.removeItem("department");
  };

  return (
    <AuthContext.Provider value={{ user, portal, department, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
