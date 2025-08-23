-- Create test user in auth.users - the trigger will handle public.users creation
-- This ensures proper foreign key relationships

-- Create the test user in auth.users if it doesn't exist
DO $$
BEGIN
    -- Check if user exists in auth.users
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = 'aec53558-767e-4408-b4d6-1c1e6f17ffe5') THEN
        -- Insert into auth.users - the trigger will create the public.users entry
        INSERT INTO auth.users (
            id,
            instance_id,
            aud,
            role,
            email,
            encrypted_password,
            email_confirmed_at,
            raw_app_meta_data,
            raw_user_meta_data,
            created_at,
            updated_at
        ) VALUES (
            'aec53558-767e-4408-b4d6-1c1e6f17ffe5',
            '00000000-0000-0000-0000-000000000000',
            'authenticated',
            'authenticated',
            'user@example.com',
            crypt('testpassword123', gen_salt('bf')),
            NOW(),
            '{"provider":"email","providers":["email"]}',
            '{"full_name":"Test User","role":"investor"}',
            NOW(),
            NOW()
        );
        
        RAISE NOTICE 'Test user created successfully in auth.users';
    ELSE
        RAISE NOTICE 'Test user already exists in auth.users';
    END IF;
END $$;

-- Verify the user was created in both tables
SELECT 'Auth user status:' as status, 
       CASE 
           WHEN EXISTS (SELECT 1 FROM auth.users WHERE id = 'aec53558-767e-4408-b4d6-1c1e6f17ffe5') 
           THEN 'User exists' 
           ELSE 'User missing' 
       END as result
UNION ALL
SELECT 'Public user status:' as status, 
       CASE 
           WHEN EXISTS (SELECT 1 FROM public.users WHERE id = 'aec53558-767e-4408-b4d6-1c1e6f17ffe5') 
           THEN 'User exists' 
           ELSE 'User missing' 
       END as result;
