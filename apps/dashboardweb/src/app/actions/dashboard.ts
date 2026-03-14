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

export async function addHospital(arg1: any, arg2?: any) {
  const formData = arg2 instanceof FormData ? arg2 : (arg1 as FormData);
  const supabase = await createClient()
  const name = formData.get('name') as string
  const city = formData.get('city') as string
  const { data: { user } } = await supabase.auth.getUser()
  const { error } = await supabase.from('hospitals').insert([{ name, city, created_by: user?.id }])
  if (error) { 
    console.error('Error adding hospital:', error); 
    return { error: error.message };
  }
  revalidatePath('/admin/hospitals');
  return { success: true };
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
export async function addDoctor(arg1: any, arg2?: any) {
  const formData = arg2 instanceof FormData ? arg2 : (arg1 as FormData);
  const admin = getAdminClient()

  const full_name = formData.get('full_name') as string
  const email = formData.get('email') as string
  const phone = (formData.get('phone') as string) || null
  const specialization = formData.get('specialization') as string
  const license_number = (formData.get('license_number') as string) || null
  const experience_years = parseInt(formData.get('experience_years') as string) || 0
  const consultation_fee = parseFloat(formData.get('consultation_fee') as string) || 0

  // Step 1: Create auth user
  const tempPassword = `Tmp!${crypto.randomUUID().slice(0, 8)}`
  const { data: authData, error: authError } = await admin.auth.admin.createUser({
    email,
    password: tempPassword,
    email_confirm: true,
    user_metadata: { full_name, phone },
  })

  if (authError) {
    console.error('Error creating auth user (doctor):', authError)
    return { error: authError.message }
  }

  const userId = authData.user.id

  // Step 2: Update profile
  const { error: profileError } = await admin
    .from('profiles')
    .update({ role: 'doctor', full_name, phone })
    .eq('id', userId)
  if (profileError) {
    console.error('Error updating doctor profile role:', profileError)
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
    return { error: doctorError.message }
  }

  revalidatePath('/admin/doctors')
  return { success: true }
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

export async function addPatient(arg1: any, arg2?: any) {
  const formData = arg2 instanceof FormData ? arg2 : (arg1 as FormData);
  const admin = getAdminClient()

  const full_name = formData.get('full_name') as string
  const email = formData.get('email') as string
  const phone = (formData.get('phone') as string) || null
  const blood_group = (formData.get('blood_group') as string) || null
  const date_of_birth = (formData.get('date_of_birth') as string) || null
  const gender = (formData.get('gender') as string) || null
  const emergency_contact = (formData.get('emergency_contact') as string) || null

  // Step 1: Create auth user
  const tempPassword = `Tmp!${crypto.randomUUID().slice(0, 8)}`
  const { data: authData, error: authError } = await admin.auth.admin.createUser({
    email,
    password: tempPassword,
    email_confirm: true,
    user_metadata: { full_name, phone },
  })
  if (authError) {
    console.error('Error creating auth user (patient):', authError)
    return { error: authError.message }
  }

  const userId = authData.user.id

  // Step 2: Update profile
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
    return { error: patientError.message }
  }

  revalidatePath('/admin/patients')
  return { success: true }
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

export async function addDriver(arg1: any, arg2?: any) {
  const formData = arg2 instanceof FormData ? arg2 : (arg1 as FormData);
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
    return { error: authError.message }
  }

  const userId = authData.user.id

  // Step 2: Update profile
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
    return { error: driverError.message }
  }

  revalidatePath('/admin/drivers')
  return { success: true }
}
