const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'http://127.0.0.1:54321', 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'
);

async function testLogin() {
  console.log('🔐 Testing login with john.recruiter@acme-staffing.com...');
  
  // First sign out any existing session
  await supabase.auth.signOut();
  
  // Sign in with test user
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'john.recruiter@acme-staffing.com',
    password: 'customer123'
  });
  
  if (error) {
    console.error('❌ Login failed:', error.message);
    return;
  }
  
  console.log('✅ Login successful!');
  console.log('User ID:', data.user.id);
  console.log('Email:', data.user.email);
  
  // Check user profile
  const { data: userProfile, error: profileError } = await supabase
    .from('users')
    .select('*')
    .eq('id', data.user.id)
    .single();
    
  if (profileError) {
    console.error('❌ Profile lookup failed:', profileError.message);
    return;
  }
  
  console.log('📋 User Profile:');
  console.log('  Role:', userProfile.role);
  console.log('  Direct permissions:', userProfile.process_permissions);
  console.log('  Profile permissions:', userProfile.profile?.process_permissions);
  
  const permissions = userProfile.profile?.process_permissions || userProfile.process_permissions || [];
  console.log('  Final permissions:', permissions);
  
  if (permissions.length > 0) {
    console.log('✅ User has permissions - should be able to access app');
  } else {
    console.log('❌ User has no permissions - will be denied access');
  }
}

testLogin().catch(console.error);
