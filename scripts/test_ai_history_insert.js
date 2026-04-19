// test_ai_history_insert.js
require('dotenv').config({ path: 'apps/web/.env.local' });
const { createClient } = require('@supabase/supabase-js');

async function testInsert() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  console.log('Testing insert to ai_qa_history as ANON...');
  const { data, error } = await supabase.from('ai_qa_history').insert({
    user_id: '00000000-0000-0000-0000-000000000000', // Dummy UUID
    question_original: 'Test Question',
    answer: 'Test Answer',
    context_data: {}
  });

  console.log('Result:', { data, error });
}

testInsert();
