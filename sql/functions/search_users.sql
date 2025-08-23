-- Create function to search users from auth.users table
-- This requires SECURITY DEFINER to access auth schema
CREATE OR REPLACE FUNCTION search_users(search_query text)
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
        u.email_confirmed_at IS NOT NULL -- Only confirmed users
        AND (
            u.email ILIKE '%' || search_query || '%'
            OR u.raw_user_meta_data->>'display_name' ILIKE '%' || search_query || '%'
            OR u.raw_user_meta_data->>'full_name' ILIKE '%' || search_query || '%'
        )
    ORDER BY u.created_at DESC
    LIMIT 20;
$$;
