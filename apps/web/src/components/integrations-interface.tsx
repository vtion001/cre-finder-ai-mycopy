"use client";

import { IntegrationsForm } from "./integrations-form";
import { useEffect, useState } from "react";

type ConfigData = Record<string, string>;

async function fetchConfig(provider: string): Promise<ConfigData> {
  try {
    const res = await fetch(`/api/integrations/${provider}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    
    if (!res.ok) {
      console.warn(`Failed to fetch ${provider} config:`, res.status);
      return {};
    }
    
    const data = await res.json();
    return data?.config || {};
  } catch (error) {
    console.warn(`Error fetching ${provider} config:`, error);
    return {};
  }
}

export function IntegrationsInterface() {
  const [twilioConfig, setTwilioConfig] = useState<ConfigData>({});
  const [sendgridConfig, setSendgridConfig] = useState<ConfigData>({});
  const [vapiConfig, setVapiConfig] = useState<ConfigData>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadConfigs() {
      try {
        const [twilio, sendgrid, vapi] = await Promise.all([
          fetchConfig("twilio"),
          fetchConfig("sendgrid"),
          fetchConfig("vapi"),
        ]);
        
        setTwilioConfig(twilio);
        setSendgridConfig(sendgrid);
        setVapiConfig(vapi);
      } catch (error) {
        console.error("Error loading integration configs:", error);
      } finally {
        setLoading(false);
      }
    }

    loadConfigs();
  }, []);

  if (loading) {
    return (
      <div className="grid gap-6">
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-gray-200 rounded-lg"></div>
          <div className="h-32 bg-gray-200 rounded-lg"></div>
          <div className="h-32 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <IntegrationsForm
      initialTwilio={twilioConfig}
      initialSendgrid={sendgridConfig}
      initialVapi={vapiConfig}
    />
  );
}
