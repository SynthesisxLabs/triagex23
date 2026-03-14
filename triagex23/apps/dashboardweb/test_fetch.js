const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://plraftmudigboygpdtal.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBscmFmdG11ZGlnYm95Z3BkdGFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0OTE0MTIsImV4cCI6MjA4OTA2NzQxMn0.fISFO7XbkEq0oCvmccephv8xEE8KVlq3lnQE6GTZ084';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testFetch() {
  // Login first to get the admin token
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'admin@example.com',
    password: '123456'
  });

  if (authError) {
    console.error('Auth error:', authError);
    process.exit(1);
  }

  // Fetch patients
  const { data, error } = await supabase
    .from('patients')
    .select(`
      id,
      blood_group,
      created_at,
      profiles (
        full_name,
        email,
        phone
      )
    `);

  if (error) {
    console.error('Error fetching patients:', error);
    process.exit(1);
  }

  console.log('Patients data:', data);
}

testFetch();
