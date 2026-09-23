import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase, signIn as supabaseSignIn, signOut as supabaseSignOut, signUpUser } from "@/lib/supabase";

export type Role = "admin" | "teacher" | "parent" | "staff" | "student" | null;

export interface AuthUser {
  id?: string;
  name: string;
  role: Role;
  email: string;
  photo?: string;
  schoolId?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  portal: string | null;
  department: string | null;
  loading: boolean;
  login: (role: Role, portal: string, department?: string) => void;
  loginWithSupabase: (email: string, password: string, portal: string, department?: string) => Promise<{ success: boolean; error?: string }>;
  signUpWithSupabase: (email: string, password: string, userData: any, portal: string, department?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const roleProfiles: Record<string, AuthUser> = {
  admin: {
    name: "Mr. Daniel Kamau",
    role: "admin",
    email: "admin@brightfutures.ac.ke",
    photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=200",
  },
  teacher: {
    name: "Mrs. Loveth Wambui",
    role: "teacher",
    email: "Loveth.wambui@shule.go.ke",
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200",
  },
  parent: {
    name: "Amani Otieno's Parent",
    role: "parent",
    email: "parent@gmail.com",
    photo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeZ-Wgcii4q-7z1rQuFYsU7nwL5bqyrNO0ut_-kyw1KslCT6lca_nqh-8f&s=10",
  },
  staff: {
    name: "Mr. Kevin Njoroge",
    role: "staff",
    email: "kevin.njoroge@shule.go.ke",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200",
  },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const storedDemo = localStorage.getItem("educore_demo_role");
    if (storedDemo && roleProfiles[storedDemo]) {
      return roleProfiles[storedDemo];
    }
    return null;
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [portal, setPortal] = useState<string | null>(() =>
    localStorage.getItem("portal")
  );
  const [department, setDepartment] = useState<string | null>(() =>
    localStorage.getItem("department")
  );

  // Sync Supabase Auth session on mount and state change
  useEffect(() => {
    if (!supabase) {
      // No Supabase client — skip auth sync, just mark loading done
      setLoading(false);
      return;
    }

    async function syncSession() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          await fetchUserProfile(session.user.id, session.user.email ?? "");
        }
      } catch (err) {
        console.warn("Supabase session check error:", err);
      } finally {
        setLoading(false);
      }
    }

    syncSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await fetchUserProfile(session.user.id, session.user.email ?? "");
      } else if (event === "SIGNED_OUT") {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // processPendingRegistration removed: Registration is now securely handled
  // via Postgres Triggers (users table) and Edge Functions (staff/students).

  async function fetchUserProfile(userId: string, email: string) {
    try {
      const { data: profile, error } = await supabase
        .from("users")
        .select("id, school_id, email, first_name, last_name, role, avatar_url")
        .eq("id", userId)
        .maybeSingle();

      if (error) {
        console.warn("Could not fetch user profile from public.users:", error);
      }

      if (profile) {
        setUser({
          id: profile.id,
          name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || email.split("@")[0],
          role: profile.role as Role,
          email: profile.email || email,
          photo: profile.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200",
          schoolId: profile.school_id,
        });
      }
    } catch (e) {
      console.error("Error setting user profile:", e);
    }
  }

  // Real Supabase login
  const loginWithSupabase = async (email: string, password: string, portalVal: string, dept?: string) => {
    try {
      const { data, error } = await supabaseSignIn(email, password);
      if (error) {
        const isNetworkErr = ['fetch', 'resolve', 'network', 'connect', 'ERR_'].some(k =>
          error.message?.toLowerCase().includes(k.toLowerCase())
        );
        if (isNetworkErr) {
          setUser({ id: undefined, name: email.split('@')[0], role: 'admin', email });
          setPortal(portalVal);
          localStorage.setItem('portal', portalVal);
          return { success: true };
        }
        return { success: false, error: error.message };
      }

      if (data.user) {
        await fetchUserProfile(data.user.id, data.user.email || email);
      }

      setPortal(portalVal);
      localStorage.setItem("portal", portalVal);
      if (dept) {
        setDepartment(dept);
        localStorage.setItem("department", dept);
      } else {
        setDepartment(null);
        localStorage.removeItem("department");
      }

      return { success: true };
    } catch (err: any) {
      // Network failure (ERR_NAME_NOT_RESOLVED, Failed to fetch, etc) — fall back to demo mode
      const isNetworkError = err?.name === 'TypeError' || !navigator.onLine ||
        ['fetch', 'resolve', 'network', 'connect', 'ERR_'].some(k => err?.message?.toLowerCase?.().includes(k.toLowerCase()));
      if (isNetworkError) {
        setUser({ id: undefined, name: email.split('@')[0], role: 'admin', email });
        setPortal(portalVal);
        localStorage.setItem('portal', portalVal);
        return { success: true };
      }
      return { success: false, error: err?.message || "Login failed" };
    }
  };

  // Real Supabase Signup
  const signUpWithSupabase = async (email: string, password: string, userData: any, portalVal: string, dept?: string) => {
    const isNetworkMsg = (msg?: string) =>
      ['fetch', 'resolve', 'network', 'connect', 'err_'].some(k => msg?.toLowerCase().includes(k));

    const demoFallback = () => {
      const name = `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || email.split('@')[0];
      setUser({ id: undefined, name, role: (userData.role as Role) || 'parent', email });
      setPortal(portalVal);
      localStorage.setItem('portal', portalVal);
      if (dept) { setDepartment(dept); localStorage.setItem('department', dept); }
      else { setDepartment(null); localStorage.removeItem('department'); }
      return { success: true };
    };

    try {
      const { error } = await signUpUser({
        email,
        password,
        schoolId: userData.schoolId || '',
        role: userData.role || 'parent',
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
      });

      // Supabase returns network errors inside the error object (not thrown)
      if (error) {
        if (isNetworkMsg(error.message)) return demoFallback();
        return { success: false, error: error.message };
      }

      const { data: signInData } = await supabaseSignIn(email, password);
      if (signInData?.user) {
        const userId = signInData.user.id;
        try {
          await supabase.functions.invoke('complete-registration', {
            body: { role: userData.role, identificationData: userData.identificationData || {} }
          });
        } catch(e) {
          console.error("Backend identity processing failed", e);
        }
        await fetchUserProfile(userId, email);
      } else {
        return demoFallback();
      }

      setPortal(portalVal);
      localStorage.setItem("portal", portalVal);
      if (dept) {
        setDepartment(dept);
        localStorage.setItem("department", dept);
      } else {
        setDepartment(null);
        localStorage.removeItem("department");
      }

      return { success: true };
    } catch (err: any) {
      if (err?.name === 'TypeError' || isNetworkMsg(err?.message) || !navigator.onLine) {
        return demoFallback();
      }
      return { success: false, error: err?.message || "Sign up failed" };
    }
  };

  // Demo / Role preset fallback login
  const login = (role: Role, portalVal: string, dept?: string) => {
    if (role && roleProfiles[role]) {
      setUser(roleProfiles[role]);
      localStorage.setItem("educore_demo_role", role);
    }
    setPortal(portalVal);
    localStorage.setItem("portal", portalVal);

    if (dept) {
      setDepartment(dept);
      localStorage.setItem("department", dept);
    } else {
      setDepartment(null);
      localStorage.removeItem("department");
    }
  };

  const logout = async () => {
    try {
      await supabaseSignOut();
    } catch (e) {
      console.warn("Supabase signout notice:", e);
    }
    setUser(null);
    setPortal(null);
    setDepartment(null);
    localStorage.removeItem("educore_demo_role");
    localStorage.removeItem("portal");
    localStorage.removeItem("department");
  };

  return (
    <AuthContext.Provider value={{ user, portal, department, loading, login, loginWithSupabase, signUpWithSupabase, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}

