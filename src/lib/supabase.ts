import { createClient } from '@supabase/supabase-js'

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL  as string
const supabaseKey  = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseKey) {
  console.error(
    'Missing Supabase env vars. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your Vercel Environment Variables.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})

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
export async function sendOtpCode(destination: string, channel: 'email' | 'phone') {
  if (channel === 'email') {
    return supabase.auth.signInWithOtp({
      email: destination,
      options: {
        shouldCreateUser: true,
      },
    })
  } else {
    return supabase.auth.signInWithOtp({
      phone: destination,
      options: {
        shouldCreateUser: true,
      },
    })
  }
}


/** Verify OTP code */
export async function verifyOtpCode(destination: string, token: string, channel: 'email' | 'phone') {
  if (channel === 'email') {
    return supabase.auth.verifyOtp({
      email: destination,
      token,
      type: 'email',
    })
  } else {
    return supabase.auth.verifyOtp({
      phone: destination,
      token,
      type: 'sms',
    })
  }
}

