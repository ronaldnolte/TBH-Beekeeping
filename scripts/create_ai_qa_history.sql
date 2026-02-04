-- Create table for storing AI Q&A history
create table if not exists public.ai_qa_history (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) on delete cascade,
    question_original text not null,
    answer text not null,
    context_data jsonb,
    created_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.ai_qa_history enable row level security;

-- Policy: Users can see their own history
create policy "Users can view their own AI history"
on public.ai_qa_history
for select
using (auth.uid() = user_id);

-- Policy: Users can insert their own history
create policy "Users can insert their own AI history"
on public.ai_qa_history
for insert
with check (auth.uid() = user_id);
