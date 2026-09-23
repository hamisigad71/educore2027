import { createClient } from '@supabase/supabase-js'

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL  as string
const supabaseKey  = import.meta.env.VITE_SUPABASE_ANON_KEY as string

const hasEnvVars = !!supabaseUrl && !!supabaseKey;

if (!hasEnvVars) {
  console.warn(
    '[EduCore] Missing Supabase env vars (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY). ' +
    'Authentication features will be disabled. Add these in Vercel → Project Settings → Environment Variables.'
  )
}

export const supabase = hasEnvVars
  ? createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null as any;

// ─── Typed helpers ────────────────────────────────────────────────────────────

/** Sign up a new user and pass school metadata so the DB trigger can link them */
export async function signUpUser({
  email,
  password,
  schoolId,
  role = 'admin',
  firstName,
  lastName,
}: {
  email: string
  password: string
  schoolId: string
  role?: 'admin' | 'teacher' | 'staff' | 'parent' | 'student'
  firstName: string
  lastName: string
}) {
  return supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        school_id:  schoolId,
        role,
        first_name: firstName,
        last_name:  lastName,
      },
    },
  })
}

/** Sign in with email + password */
export const signIn = (email: string, password: string) =>
  supabase.auth.signInWithPassword({ email, password })

/** Sign out the current session */
export const signOut = () => supabase.auth.signOut()

/** Get the currently authenticated user */
export const getCurrentUser = () => supabase.auth.getUser()

/** Subscribe to auth state changes */
export const onAuthStateChange = (
  callback: Parameters<typeof supabase.auth.onAuthStateChange>[0]
) => supabase.auth.onAuthStateChange(callback)

/** Send OTP via Email or SMS */
export async function sendOtpCode(destination: string, channel: 'email' | 'phone', userData?: any) {
  if (channel === 'email') {
    return supabase.auth.signInWithOtp({
      email: destination,
      options: {
        shouldCreateUser: true,
        data: userData || {},
      },
    })
  } else {
    return supabase.auth.signInWithOtp({
      phone: destination,
      options: {
        shouldCreateUser: true,
        data: userData || {},
      },
    })
  }
}


/** Verify OTP code */
export async function verifyOtpCode(destination: string, token: string, channel: 'email' | 'phone', isSignup = false) {
  if (channel === 'email') {
    const typesToTry = isSignup ? ['signup', 'magiclink', 'email'] : ['email', 'magiclink'];
    let lastError = null;

    for (const type of typesToTry) {
      const { data, error } = await supabase.auth.verifyOtp({
        email: destination,
        token,
        type: type as any,
      });
      
      if (!error) {
        return { data, error: null };
      }
      lastError = error;
    }
    
    return { data: null, error: lastError };
  } else {
    return supabase.auth.verifyOtp({
      phone: destination,
      token,
      type: 'sms',
    })
  }
}

