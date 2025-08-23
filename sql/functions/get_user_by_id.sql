-- Create function to get user by ID from auth.users table
-- This requires SECURITY DEFINER to access auth schema
CREATE OR REPLACE FUNCTION get_user_by_id(user_id uuid)
RETURNS TABLE (
    id uuid,
    email text,
    created_at timestamptz,
    updated_at timestamptz,
    email_confirmed_at timestamptz,
    phone text,
    phone_confirmed_at timestamptz,
    last_sign_in_at timestamptz,
    raw_user_meta_data jsonb,
    raw_app_meta_data jsonb
)
SECURITY DEFINER
SET search_path = auth, public
LANGUAGE sql
AS $$
    SELECT 
        u.id,
        u.email::text,
        u.created_at,
        u.updated_at,
        u.email_confirmed_at,
        u.phone::text,
        u.phone_confirmed_at,
        u.last_sign_in_at,
        u.raw_user_meta_data,
        u.raw_app_meta_data
    FROM auth.users u
    WHERE 
        u.id = user_id
        AND u.email_confirmed_at IS NOT NULL -- Only confirmed users
    LIMIT 1;
$$;
