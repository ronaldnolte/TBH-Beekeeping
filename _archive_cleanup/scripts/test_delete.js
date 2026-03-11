const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const dotenv = require('dotenv');

const envConfig = dotenv.parse(fs.readFileSync('apps/web/.env.production.local'));
const supabaseUrl = envConfig.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envConfig.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

async function testDelete() {
    const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers();
    if (error) { console.error('Error fetching users', error); return; }

    const targetUser = users.find(u => u.email === 'ron.nolte+test2@gmail.com');
    if (!targetUser) { console.log('User not found'); return; }

    console.log('Attempting to delete user', targetUser.id);
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(targetUser.id);
    console.log('Result:', deleteError || 'Success');
}

testDelete();
