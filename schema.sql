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
