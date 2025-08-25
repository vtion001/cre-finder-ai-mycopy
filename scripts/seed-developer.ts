#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL || 'http://127.0.0.1:54321';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function main() {
  console.log('🌱 Seeding developer data...');

  const developerEmail = 'dev@example.com';
  const developerPassword = 'devpassword123';
  const hashedPassword = await bcrypt.hash(developerPassword, 12);

  try {
    // Check if developer user already exists in auth.users
    const { data: existingAuthUser, error: authCheckError } = await supabase.auth.admin.listUsers();
    
    let developerUserId: string;
    let userExists = false;

    if (existingAuthUser?.users) {
      const existingUser = existingAuthUser.users.find(user => user.email === developerEmail);
      if (existingUser) {
        developerUserId = existingUser.id;
        userExists = true;
        console.log('Developer user already exists in auth, updating...');
        
        // Update existing user password
        const { error: updateError } = await supabase.auth.admin.updateUserById(developerUserId, {
          password: developerPassword,
          user_metadata: {
            role: 'DEVELOPER',
            isActive: true,
            developerMode: true
          }
        });

        if (updateError) {
          console.error('Error updating auth user:', updateError);
        } else {
          console.log('✅ Developer auth user updated');
        }
      }
    }

    if (!userExists) {
      // Create new developer user in auth.users
      const { data: newAuthUser, error: createAuthError } = await supabase.auth.admin.createUser({
        email: developerEmail,
        password: developerPassword,
        email_confirm: true,
        user_metadata: {
          role: 'DEVELOPER',
          isActive: true,
          developerMode: true
        }
      });

      if (createAuthError) {
        throw new Error(`Failed to create auth user: ${createAuthError.message}`);
      }

      developerUserId = newAuthUser.user.id;
      console.log('✅ Developer auth user created:', developerUserId);
    }

    // Create/update user in public.users table
    const { error: publicUserError } = await supabase
      .from('users')
      .upsert({
        id: developerUserId,
        email: developerEmail,
        full_name: 'Developer User',
        role: 'DEVELOPER',
        is_active: true,
        developer_mode: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'id'
      });

    if (publicUserError) {
      console.error('Error upserting public user:', publicUserError);
    } else {
      console.log('✅ Developer public user created/updated');
    }

    // Create test VAPI configuration
    const { error: vapiError } = await supabase
      .from('vapi_configs')
      .upsert({
        user_id: developerUserId,
        api_key: 'test_vapi_api_key',
        organization: 'Test Organization',
        assistant_id: 'test_assistant_id',
        phone_number: '+1234567890',
        webhook_url: 'https://test.com/webhook',
        custom_prompt: 'Test VAPI prompt',
        name: 'Test VAPI Configuration',
        is_test_config: true,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      });

    if (vapiError) {
      console.error('Error creating VAPI config:', vapiError);
    } else {
      console.log('✅ Test VAPI configuration created');
    }

    // Create test Twilio configuration
    const { error: twilioError } = await supabase
      .from('twilio_configs')
      .upsert({
        user_id: developerUserId,
        account_sid: 'test_account_sid',
        auth_token: 'test_auth_token',
        phone_number: '+1234567890',
        messaging_service_sid: 'test_messaging_service',
        webhook_url: 'https://test.com/webhook',
        custom_message: 'Test Twilio message',
        name: 'Test Twilio Configuration',
        is_test_config: true,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      });

    if (twilioError) {
      console.error('Error creating Twilio config:', twilioError);
    } else {
      console.log('✅ Test Twilio configuration created');
    }

    // Create test property records
    const { error: propertyError } = await supabase
      .from('properties')
      .insert({
        user_id: developerUserId,
        title: 'Test Commercial Property',
        description: 'A test property for development',
        property_type: 'office',
        status: 'active',
        price: 500000,
        price_type: 'sale',
        square_feet: 5000,
        address_line_1: '123 Test Street',
        city: 'Test City',
        state: 'TC',
        zip_code: '12345',
        country: 'USA',
        contact_info: {
          contact_name: 'Test Contact',
          contact_email: 'test@example.com',
          contact_phone: '+1234567890',
          contact_company: 'Test Company'
        },
        is_featured: false,
        is_test_record: true,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (propertyError) {
      console.error('Error creating test property:', propertyError);
    } else {
      console.log('✅ Test property record created');
    }

    // Create integration statuses
    const integrations = ['vapi', 'twilio', 'sendgrid'];
    for (const integration of integrations) {
      const { error: statusError } = await supabase
        .from('integration_statuses')
        .upsert({
          user_id: developerUserId,
          integration_type: integration,
          is_configured: true,
          last_tested_at: new Date().toISOString(),
          test_status: 'success',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,integration_type'
        });

      if (statusError) {
        console.error(`Error creating ${integration} status:`, statusError);
      } else {
        console.log(`✅ ${integration} integration status created`);
      }
    }

    console.log('');
    console.log('🎉 Developer seeding completed!');
    console.log('');
    console.log('Developer Login Credentials:');
    console.log('Email: dev@example.com');
    console.log('Password: devpassword123');
    console.log('');
    console.log('Test Data Created:');
    console.log('✅ Developer user account');
    console.log('✅ VAPI test configuration');
    console.log('✅ Twilio test configuration');
    console.log('✅ Test property record');
    console.log('✅ Integration statuses');
    console.log('');
    console.log('You can now login with these credentials and access all test functionality.');

  } catch (error) {
    console.error('❌ Error seeding developer data:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    console.log('🌱 Seeding process completed');
  });
