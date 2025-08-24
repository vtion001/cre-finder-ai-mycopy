import { TwilioTestClient } from "./twilio-test-client";
import { createClient } from "@v1/supabase/server";
import { serializeTwilioConfig } from "@/lib/serialization";
import { checkTestDataStatus, testDatabaseConnection } from "@/lib/auth-utils";

export default async function TwilioTestPage() {
  // Check authentication status
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isAuthenticated = !!user;
  
  // Check test data status
  const testDataStatus = await checkTestDataStatus();
  
  // Get Twilio configuration (serialized for client)
  let twilioConfig = null;
  if (isAuthenticated) {
    try {
      const { data: config } = await supabase
        .from("twilio_configs")
        .select("*")
        .eq("user_id", user.id)
        .eq("is_active", true)
        .single();
      
      twilioConfig = config ? serializeTwilioConfig(config) : null;
    } catch (error) {
      console.error("Error fetching Twilio config:", error);
    }
  }
  
  // Test database connection
  const dbConnectionTest = await testDatabaseConnection();
  
  return (
    <TwilioTestClient 
      isAuthenticated={isAuthenticated}
      testDataStatus={testDataStatus}
      twilioConfig={twilioConfig}
      dbConnectionTest={dbConnectionTest}
      userId={user?.id}
    />
  );
}
