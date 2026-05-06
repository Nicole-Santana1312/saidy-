-- ============================================================================
-- SUPABASE MIGRATION: Add verification fields and fix RLS
-- Run this in Supabase SQL Editor to update existing database
-- ============================================================================

-- Disable RLS for admins table to allow initial admin creation
ALTER TABLE admins DISABLE ROW LEVEL SECURITY;

-- Add verification fields to usuarios_app table
ALTER TABLE usuarios_app
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS verification_code TEXT;

-- Create index for verification_code
CREATE INDEX IF NOT EXISTS idx_usuarios_app_verification_code ON usuarios_app(verification_code);

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================