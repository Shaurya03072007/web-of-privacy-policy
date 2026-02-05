-- Create Users Table with Session Token
create table public.users (
  id uuid default gen_random_uuid() primary key,
  google_id text unique not null,
  email text unique not null,
  display_name text,
  session_token text, -- Stores the current valid session token
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS) - Optional for now since we use Service Key on backend, but good practice
alter table public.users enable row level security;

-- Create policy to allow select for authenticated users (if using Supabase Auth on client side later)
-- For this Node.js implementation, the Service Role key bypasses RLS.

-- STAGE 2
-- 1. Add 'role' and 'subscription_tier' to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user',
ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'free';
-- 2. Set 'jshauryareddy@gmail.com' as Admin (Run this AFTER you log in once)
UPDATE users 
SET role = 'admin', subscription_tier = 'premium' 
WHERE email = 'jshauryareddy@gmail.com';
-- 3. Policy to allow Admins to update other users (if RLS is enabled)
-- Note: Requires enabling RLS and creating specific policies. 
-- For now, the Node.js backend (using service role or standard client) will handle logic.