'use server'

import { createClient } from '@/utils/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

// Service-role admin client — bypasses RLS and can create auth.users entries
// The service role key is NEVER exposed to the browser (this file is 'use server')
function getAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createAdminClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

// ─── HOSPITALS ──────────────────────────────────────────────────────────────

export async function getHospitals() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('hospitals')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) { console.error('Error fetching hospitals:', error); return [] }
  return data
}

export async function addHospital(formData: FormData) {
  const supabase = await createClient()
  const name = formData.get('name') as string
  const city = formData.get('city') as string
  const { data: { user } } = await supabase.auth.getUser()
  const { error } = await supabase.from('hospitals').insert([{ name, city, created_by: user?.id }])
  if (error) { console.error('Error adding hospital:', error); throw new Error(error.message) }
  revalidatePath('/admin/hospitals')
}

// ─── DOCTORS ────────────────────────────────────────────────────────────────

export async function getDoctors() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('doctors')
    .select(`id, specialization, license_number, experience_years, consultation_fee, status, created_at, profiles ( full_name, email, phone )`)
    .order('created_at', { ascending: false })
  if (error) { console.error('Error fetching doctors:', error); return [] }
  return data
}

/**
 * Admin creates a doctor:
 * 1. Use admin API to create an auth.users entry (email_confirm: true, random password)
 * 2. The DB trigger fires → auto-creates profile with role='patient' (default)
 * 3. We then update profile role to 'doctor' and insert the doctors row
 */
export async function addDoctor(formData: FormData) {
  const admin = getAdminClient()

  const full_name = formData.get('full_name') as string
  const email = formData.get('email') as string
  const phone = (formData.get('phone') as string) || null
  const specialization = formData.get('specialization') as string
  const license_number = (formData.get('license_number') as string) || null
  const experience_years = parseInt(formData.get('experience_years') as string) || 0
  const consultation_fee = parseFloat(formData.get('consultation_fee') as string) || 0

  // Step 1: Create aauth user — this triggers the DB function to create the profile row
  const tempPassword = `Tmp!${crypto.randomUUID().slice(0, 8)}`
  const { data: authData, error: authError } = await admin.auth.admin.createUser({
    email,
    password: tempPassword,
    email_confirm: true, // skip email verification
    user_metadata: { full_name, phone },
  })
  if (authError) {
    console.error('Error creating auth user (doctor):', authError)
    throw new Error(authError.message)
  }

  const userId = authData.user.id

  // Step 2: Update the auto-created profile to set role=doctor and fill in details
  // (The trigger creates profile with default role='patient', we override it)
  const { error: profileError } = await admin
    .from('profiles')
    .update({ role: 'doctor', full_name, phone })
    .eq('id', userId)
  if (profileError) {
    console.error('Error updating doctor profile role:', profileError)
    // Don't throw — the user was created, continue to insert doctors row
  }

  // Step 3: Insert the doctor-specific record
  const { error: doctorError } = await admin.from('doctors').insert([{
    profile_id: userId,
    specialization,
    license_number,
    experience_years,
    consultation_fee,
    status: 'active',
  }])
  if (doctorError) {
    console.error('Error inserting doctor record:', doctorError)
    throw new Error(doctorError.message)
  }

  revalidatePath('/admin/doctors')
}

// ─── PATIENTS ───────────────────────────────────────────────────────────────

export async function getPatients() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('patients')
    .select(`id, blood_group, date_of_birth, gender, emergency_contact, created_at, profiles ( full_name, email, phone )`)
    .order('created_at', { ascending: false })
  if (error) { console.error('Error fetching patients:', error); return [] }
  return data
}

export async function addPatient(formData: FormData) {
  const admin = getAdminClient()

  const full_name = formData.get('full_name') as string
  const email = formData.get('email') as string
  const phone = (formData.get('phone') as string) || null
  const blood_group = (formData.get('blood_group') as string) || null
  const date_of_birth = (formData.get('date_of_birth') as string) || null
  const gender = (formData.get('gender') as string) || null
  const emergency_contact = (formData.get('emergency_contact') as string) || null

  // Step 1: Create auth user (triggers profile creation with role='patient' — correct default!)
  const tempPassword = `Tmp!${crypto.randomUUID().slice(0, 8)}`
  const { data: authData, error: authError } = await admin.auth.admin.createUser({
    email,
    password: tempPassword,
    email_confirm: true,
    user_metadata: { full_name, phone },
  })
  if (authError) {
    console.error('Error creating auth user (patient):', authError)
    throw new Error(authError.message)
  }

  const userId = authData.user.id

  // Step 2: Update profile with display name / phone (role is already 'patient' by default trigger)
  await admin.from('profiles').update({ full_name, phone }).eq('id', userId)

  // Step 3: Insert the patient-specific record
  const { error: patientError } = await admin.from('patients').insert([{
    profile_id: userId,
    blood_group,
    date_of_birth,
    gender,
    emergency_contact,
  }])
  if (patientError) {
    console.error('Error inserting patient record:', patientError)
    throw new Error(patientError.message)
  }

  revalidatePath('/admin/patients')
}

// ─── DRIVERS ────────────────────────────────────────────────────────────────

export async function getDrivers() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('drivers')
    .select(`id, license_number, vehicle_number, vehicle_type, status, is_verified, created_at, profiles ( full_name, email, phone )`)
    .order('created_at', { ascending: false })
  if (error) { console.error('Error fetching drivers:', error); return [] }
  return data
}

export async function addDriver(formData: FormData) {
  const admin = getAdminClient()

  const full_name = formData.get('full_name') as string
  const email = formData.get('email') as string
  const phone = (formData.get('phone') as string) || null
  const license_number = (formData.get('license_number') as string) || null
  const vehicle_number = (formData.get('vehicle_number') as string) || null
  const vehicle_type = (formData.get('vehicle_type') as string) || null

  // Step 1: Create auth user
  const tempPassword = `Tmp!${crypto.randomUUID().slice(0, 8)}`
  const { data: authData, error: authError } = await admin.auth.admin.createUser({
    email,
    password: tempPassword,
    email_confirm: true,
    user_metadata: { full_name, phone },
  })
  if (authError) {
    console.error('Error creating auth user (driver):', authError)
    throw new Error(authError.message)
  }

  const userId = authData.user.id

  // Step 2: Update profile role to 'driver' and fill in details
  const { error: profileError } = await admin
    .from('profiles')
    .update({ role: 'driver', full_name, phone })
    .eq('id', userId)
  if (profileError) {
    console.error('Error updating driver profile role:', profileError)
  }

  // Step 3: Insert the driver-specific record
  const { error: driverError } = await admin.from('drivers').insert([{
    profile_id: userId,
    license_number,
    vehicle_number,
    vehicle_type,
    status: 'offline',
    is_verified: false,
  }])
  if (driverError) {
    console.error('Error inserting driver record:', driverError)
    throw new Error(driverError.message)
  }

  revalidatePath('/admin/drivers')
}
