-- Create app_settings table for admin-controlled feature flags
create table if not exists public.app_settings (
    id uuid primary key default gen_random_uuid(),
    key text not null unique,
    value text not null,
    updated_at timestamp with time zone default now()
);

-- Insert default: AI logging off
insert into public.app_settings (key, value)
values ('ai_logging_enabled', 'false')
on conflict (key) do nothing;

-- No RLS needed - this is admin-only and accessed via service-role context.
-- If you want to lock it down further, enable RLS with an admin-only policy:
-- alter table public.app_settings enable row level security;
-- create policy "Admins only" on public.app_settings
-- using (exists (
--     select 1 from public.user_roles
--     where user_id = auth.uid() and role = 'admin'
-- ));
