import { VAPITestClient } from "./vapi-test-client";
import { createClient } from "@v1/supabase/server";
import { serializeVAPIConfig } from "@/lib/serialization";
import { checkTestDataStatus, testDatabaseConnection } from "@/lib/auth-utils";

export default async function VapiTestPage() {
  // Check authentication status
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isAuthenticated = !!user;
  
  // Check test data status
  const testDataStatus = await checkTestDataStatus();
  
  // Get VAPI configuration (serialized for client)
  let vapiConfig = null;
  if (isAuthenticated) {
    try {
      const { data: config } = await supabase
        .from("vapi_configs")
        .select("*")
        .eq("user_id", user.id)
        .eq("is_active", true)
        .single();
      
      vapiConfig = config ? serializeVAPIConfig(config) : null;
    } catch (error) {
      console.error("Error fetching VAPI config:", error);
    }
  }
  
  // Test database connection
  const dbConnectionTest = await testDatabaseConnection();
  
  return (
    <VAPITestClient 
      isAuthenticated={isAuthenticated}
      testDataStatus={testDataStatus}
      vapiConfig={vapiConfig}
      dbConnectionTest={dbConnectionTest}
      userId={user?.id}
    />
  );
}
