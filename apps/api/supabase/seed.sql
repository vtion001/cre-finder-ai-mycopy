INSERT INTO
    auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        invited_at,
        confirmation_token,
        confirmation_sent_at,
        recovery_token,
        recovery_sent_at,
        email_change_token_new,
        email_change,
        email_change_sent_at,
        last_sign_in_at,
        raw_app_meta_data,
        raw_user_meta_data,
        is_super_admin,
        created_at,
        updated_at,
        phone,
        phone_confirmed_at,
        phone_change,
        phone_change_token,
        phone_change_sent_at,
        email_change_token_current,
        email_change_confirm_status,
        banned_until,
        reauthentication_token,
        reauthentication_sent_at,
        is_sso_user,
        deleted_at,
        is_anonymous
    )
VALUES (
        '00000000-0000-0000-0000-000000000000',
        'aec53558-767e-4408-b4d6-1c1e6f17ffe5',
        'authenticated',
        'authenticated',
        'user@example.com',
        '$2a$10$nnqTShcTX48N6QWWjbPUee.wrGz1kGx/uq5lORviCm.fn04W1BeRe',
        '2024-09-01 17:21:01.462788+00',
        NULL,
        '',
        NULL,
        '',
        NULL,
        '',
        '',
        NULL,
        NULL,
        '{"provider": "email", "providers": ["email"]}',
        '{"username": "username", "full_name": "Test User"}',
        NULL,
        '2024-09-01 17:21:01.455486+00',
        '2024-09-01 17:21:01.46295+00',
        NULL,
        NULL,
        '',
        '',
        NULL,
        '',
        0,
        NULL,
        '',
        NULL,
        false,
        NULL,
        false
    );

INSERT INTO
    auth.identities (
        provider_id,
        user_id,
        identity_data,
        provider,
        last_sign_in_at,
        created_at,
        updated_at,
        id
    )
VALUES (
        'aec53558-767e-4408-b4d6-1c1e6f17ffe5',
        'aec53558-767e-4408-b4d6-1c1e6f17ffe5',
        '{"sub": "aec53558-767e-4408-b4d6-1c1e6f17ffe5", "email": "user@example.com", "email_verified": false, "phone_verified": false}',
        'email',
        '2024-09-01 17:21:01.459821+00',
        '2024-09-01 17:21:01.459849+00',
        '2024-09-01 17:21:01.459849+00',
        'c5e81668-437b-47c2-83e2-84b8566b3018'
    );

-- create storage buckets
insert into
    storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

INSERT INTO
    public.asset_types (name, description, use_codes)
VALUES (
        'Residential',
        'Single-family homes, condos, townhouses, and multi-family properties up to 4 units',
        '{365, 366, 367, 369, 372, 373, 376, 377, 380, 382, 383, 384, 385, 386, 387, 388, 390}'
    ),
    (
        'Multi-Family',
        'Apartment buildings with 5+ units',
        '{357, 358, 359, 360, 361, 381}'
    ),
    (
        'Office',
        'Commercial office buildings and spaces',
        '{136, 139, 140, 169, 170, 176, 177, 184}'
    ),
    (
        'Retail',
        'Retail stores, shopping centers, and malls',
        '{124, 125, 128, 130, 141, 143, 144, 145, 151, 158, 167, 178, 179, 183, 188}'
    ),
    (
        'Industrial',
        'Warehouses, manufacturing facilities, and distribution centers',
        '{195, 196, 197, 198, 199, 200, 201, 202, 203, 205, 206, 207, 208, 210, 211, 212, 213, 215, 216, 217, 218, 220, 221, 224, 225, 226, 227, 228, 231, 232, 238}'
    ),
    (
        'Land',
        'Vacant land and development sites',
        '{102, 112, 117, 389, 392, 393, 394, 395, 396, 398, 399, 400, 401, 403, 404, 406}'
    ),
    (
        'Hospitality',
        'Hotels, motels, and resorts',
        '{131, 132, 153, 154, 155, 163, 273}'
    ),
    (
        'Self Storage',
        'Self-storage facilities and storage unit complexes',
        '{229, 196, 236, 202, 235, 238, 448, 356}'
    ),
    (
        'Mixed-Use',
        'Properties with multiple uses (e.g., retail on ground floor, residential above)',
        '{140, 161, 171, 187}'
    );