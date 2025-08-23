"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@v1/ui/card";
import { Badge } from "@v1/ui/badge";
import { Button } from "@v1/ui/button";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { toast } from "@v1/ui/sonner";

interface IntegrationStatus {
  integration_type: string;
  is_active: boolean;
  last_tested?: string;
  status_message?: string;
  error_count?: number;
}

interface IntegrationStatusDashboardProps {
  userId: string;
}

export function IntegrationStatusDashboard({ userId }: IntegrationStatusDashboardProps) {
  const [statuses, setStatuses] = useState<IntegrationStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatuses();
  }, [userId]);

  const fetchStatuses = async () => {
    try {
      const response = await fetch(`/api/integrations/status?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setStatuses(data.statuses || []);
      } else {
        console.error("Failed to fetch integration statuses");
      }
    } catch (error) {
      console.error("Error fetching statuses:", error);
    } finally {
      setLoading(false);
    }
  };



  const testIntegration = async (integrationType: string) => {
    try {
      const response = await fetch(`/api/integrations/${integrationType}/test`, {
        method: "POST",
      });
      
      if (response.ok) {
        toast.success(`${integrationType.toUpperCase()} integration test successful`);
        await fetchStatuses(); // Refresh statuses
      } else {
        toast.error(`${integrationType.toUpperCase()} integration test failed`);
      }
    } catch (error) {
      toast.error(`Error testing ${integrationType} integration`);
    }
  };

  const getStatusIcon = (isActive: boolean, hasErrors?: number) => {
    if (hasErrors && hasErrors > 0) {
      return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
    return isActive ? (
      <CheckCircle2 className="h-4 w-4 text-green-500" />
    ) : (
      <XCircle className="h-4 w-4 text-red-500" />
    );
  };

  const getStatusBadge = (isActive: boolean, hasErrors?: number) => {
    if (hasErrors && hasErrors > 0) {
      return <Badge variant="secondary">Warning</Badge>;
    }
    return isActive ? (
      <Badge variant="default">Active</Badge>
    ) : (
      <Badge variant="destructive">Inactive</Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Integration Status Dashboard</h3>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {statuses.map((status) => (
          <Card key={status.integration_type} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium capitalize">
                  {status.integration_type}
                </CardTitle>
                {getStatusIcon(status.is_active, status.error_count)}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                {getStatusBadge(status.is_active, status.error_count)}
              </div>
              
              {status.last_tested && (
                <div className="text-xs text-muted-foreground">
                  Last tested: {new Date(status.last_tested).toLocaleDateString()}
                </div>
              )}
              
              {status.status_message && (
                <div className="text-xs text-muted-foreground">
                  {status.status_message}
                </div>
              )}
              
              {status.error_count && status.error_count > 0 && (
                <div className="text-xs text-yellow-600">
                  {status.error_count} error(s) detected
                </div>
              )}
              
              <Button
                onClick={() => testIntegration(status.integration_type)}
                variant="outline"
                size="sm"
                className="w-full"
              >
                Test Connection
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {statuses.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No integration statuses found. Configure your integrations to see their status.
        </div>
      )}
    </div>
  );
}
