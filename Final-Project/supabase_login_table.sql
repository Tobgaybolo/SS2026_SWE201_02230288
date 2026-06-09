create extension if not exists pgcrypto;

create table if not exists public."login" (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    gmail text not null unique,
    password text not null,
    created_at timestamptz not null default now()
);
