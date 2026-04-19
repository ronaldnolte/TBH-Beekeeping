// test_ai_history_admin.js
require('dotenv').config({ path: 'apps/web/.env.local' });
const { createClient } = require('@supabase/supabase-js');

async function testAdminInsert() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceKey) {
      console.error("Missing SUPABASE_SERVICE_ROLE_KEY in .env.local");
      return;
  }

  const adminSupabase = createClient(supabaseUrl, serviceKey);

  console.log(`Testing insert to ai_qa_history as ADMIN on ${supabaseUrl}...`);
  const { data, error } = await adminSupabase.from('ai_qa_history').insert({
    user_id: '00000000-0000-0000-0000-000000000000', // Dummy UUID
    question_original: 'Admin Test Question',
    answer: 'Admin Test Answer',
    context_data: { test: true }
  }).select();

  console.log('Result:', { data, error });
}

testAdminInsert();
