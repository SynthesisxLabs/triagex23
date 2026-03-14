'use server'

import { createClient } from '@/utils/supabase/server'

export async function sendOtpAction(email: string) {
  if (email.endsWith('@example.com')) {
    // Mock success for @example.com domains without bothering Supabase email APIs
    return { success: true }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true
    }
  })

  if (error) {
    console.error('sendOtpAction Error:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function verifyOtpAction(email: string, otp: string) {
  const supabase = await createClient()

  if (email.endsWith('@example.com') && otp === '123456') {
    // For our mocked seeded admins, attempt a password login since we seeded the DB with '123456'
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password: otp
    })

    if (signInError) {
      // If the example.com user wasn't seeded, try creating them right now
      if (signInError.message.includes('Invalid login credentials')) {
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password: otp,
          options: {
            data: { full_name: 'Test Administrator' }
          }
        })
        if (signUpError) {
          return { success: false, error: signUpError.message }
        }
        return { success: true, user: signUpData.user }
      }
      return { success: false, error: signInError.message }
    }
    
    return { success: true, user: signInData.user }
  }

  // Normal flow: verify the real OTP
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token: otp,
    type: 'email'
  })

  if (error) {
    console.error('verifyOtpAction Error:', error)
    return { success: false, error: error.message }
  }

  return { success: true, user: data.user }
}
