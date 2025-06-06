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
    "public"."products" (
        "id",
        "active",
        "name",
        "description",
        "image",
        "metadata"
    )
VALUES (
        'prod_SN538Grmjkm88g',
        'true',
        'Standard',
        'Perfect for individual investors and small teams.',
        null,
        '{"max_searches": "500", "county_access": "Single county", "is_enterprise": "false", "max_skip_trace": "500", "asset_type_count": "1"}'
    ),
    (
        'prod_SN53TiCcrdzupJ',
        'true',
        'Professional',
        'For active investors and mid-sized investment firms.',
        null,
        '{"max_searches": "1000", "county_access": "Single county", "is_enterprise": "false", "max_skip_trace": "1000", "asset_type_count": "1"}'
    ),
    (
        'prod_SN53gqW98XepUr',
        'true',
        'Enterprise',
        'For large investment firms and institutional investors.',
        null,
        '{"max_searches": "5000", "county_access": "Multiple counties", "is_enterprise": "true", "max_skip_trace": "5000", "asset_type_count": "5"}'
    );

INSERT INTO
    "public"."prices" (
        "id",
        "product_id",
        "active",
        "description",
        "unit_amount",
        "currency",
        "type",
        "interval",
        "interval_count",
        "trial_period_days",
        "metadata"
    )
VALUES (
        'price_1RSKt7FrXwG87GjC2LQx4M1d',
        'prod_SN538Grmjkm88g',
        'true',
        null,
        '49900',
        'usd',
        'recurring',
        'month',
        '1',
        '0',
        '{"features": ["Up to 500 property searches per month", "Skip-trace up to 500 properties", "Single county access", "1 asset type", "Email support", "Data export (CSV,Excel)"]}'
    ),
    (
        'price_1RSKt8FrXwG87GjCp1a85OR6',
        'prod_SN53TiCcrdzupJ',
        'true',
        null,
        '99900',
        'usd',
        'recurring',
        'month',
        '1',
        '0',
        '{"features": ["Up to 1000 property searches per month", "Skip-trace up to 1000 properties", "Single county access", "1 asset type", "Email support", "Data export (CSV,Excel)"]}'
    );