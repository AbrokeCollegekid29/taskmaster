const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://xwfuuwqcmqszdkrwerwp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3ZnV1d3FjbXFzemRrcndlcndwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2OTUxNTgsImV4cCI6MjA4ODI3MTE1OH0.vMRjcIj0kFHhcLFsn-Ub5ZZ2camhybDnoT9dKjHZQzk';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testSignup() {
    console.log('--- Testing SignUp ---');

    // Generating a random unique email to bypass rate limits on the same email if any
    const randomEmail = `sharath29j+${Date.now()}@gmail.com`;

    const { data, error } = await supabase.auth.signUp({
        email: randomEmail,
        password: 'sharath1',
        options: {
            data: { full_name: 'Sharath Test' }
        }
    });

    if (error) {
        console.error('\n❌ SignUp Error:');
        console.error(error);
    } else {
        console.log('\n✅ SignUp Success!');
        console.log('User ID:', data.user.id);
        console.log('Email sent locally?', data.user.identities?.length > 0);
        console.log('Session returned?', !!data.session);
        console.log('\nFull Data Object:', JSON.stringify(data, null, 2));
    }
}

testSignup();
