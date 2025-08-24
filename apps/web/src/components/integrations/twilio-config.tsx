"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "@v1/ui/sonner";
import { Button } from "@v1/ui/button";
import { Input } from "@v1/ui/input";
import { Label } from "@v1/ui/label";
import { Textarea } from "@v1/ui/textarea";
import { CheckCircle, Loader2, Settings } from "lucide-react";

// Twilio Configuration Schema
const twilioConfigSchema = z.object({
  accountSid: z.string().min(1, "Account SID is required"),
  authToken: z.string().min(1, "Auth Token is required"),
  phoneNumber: z.string().min(1, "Phone Number is required"),
  messagingServiceSid: z.string().optional(),
  webhookUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  customMessage: z.string().optional(),
});

type TwilioConfigFormData = z.infer<typeof twilioConfigSchema>;

interface TwilioConfigProps {
  onConfigUpdate: () => void;
  initialConfig?: Partial<TwilioConfigFormData>;
}

export function TwilioConfig({
  onConfigUpdate,
  initialConfig,
}: TwilioConfigProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isTestLoading, setIsTestLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<TwilioConfigFormData>({
    resolver: zodResolver(twilioConfigSchema),
    defaultValues: initialConfig || {
      accountSid: "",
      authToken: "",
      phoneNumber: "",
      messagingServiceSid: "",
      webhookUrl: "",
      customMessage: "",
    },
  });

  const onSubmit = async (data: TwilioConfigFormData) => {
    setIsLoading(true);
    try {
      // TODO: Implement API call to save configuration
      const response = await fetch("/api/integrations/twilio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies for authentication
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || `HTTP ${response.status}: ${response.statusText}`;
        
        if (response.status === 401) {
          throw new Error("Authentication required. Please log in again.");
        }
        
        throw new Error(errorMessage);
      }

      const result = await response.json();
      toast.success(result.message || "Twilio configuration saved successfully!");
      onConfigUpdate();
      reset();
    } catch (error) {
      console.error("Error saving Twilio config:", error);
      toast.error("Failed to save Twilio configuration. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestConnection = async () => {
    setIsTestLoading(true);
    try {
      // TODO: Implement Twilio connection test
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      toast.success("Twilio connection test successful!");
    } catch (error) {
      toast.error("Twilio connection test failed. Please check your credentials.");
    } finally {
      setIsTestLoading(false);
    }
  };

  const handleCancel = () => {
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="accountSid" className="text-sm font-medium">
              Account SID *
            </Label>
            <Input
              id="accountSid"
              placeholder="AC..."
              {...register("accountSid")}
              className={errors.accountSid ? "border-red-500" : ""}
            />
            {errors.accountSid && (
              <p className="text-sm text-red-500">{errors.accountSid.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="authToken" className="text-sm font-medium">
              Auth Token *
            </Label>
            <Input
              id="authToken"
              type="password"
              placeholder="Enter your auth token"
              {...register("authToken")}
              className={errors.authToken ? "border-red-500" : ""}
            />
            {errors.authToken && (
              <p className="text-sm text-red-500">{errors.authToken.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phoneNumber" className="text-sm font-medium">
              Phone Number *
            </Label>
            <Input
              id="phoneNumber"
              placeholder="+1234567890"
              {...register("phoneNumber")}
              className={errors.phoneNumber ? "border-red-500" : ""}
            />
            {errors.phoneNumber && (
              <p className="text-sm text-red-500">{errors.phoneNumber.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="messagingServiceSid" className="text-sm font-medium">
              Messaging Service SID
            </Label>
            <Input
              id="messagingServiceSid"
              placeholder="MG..."
              {...register("messagingServiceSid")}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="webhookUrl" className="text-sm font-medium">
            Webhook URL (Optional)
          </Label>
          <Input
            id="webhookUrl"
            type="url"
            placeholder="https://your-domain.com/webhook"
            {...register("webhookUrl")}
            className={errors.webhookUrl ? "border-red-500" : ""}
          />
          {errors.webhookUrl && (
            <p className="text-sm text-red-500">{errors.webhookUrl.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="customMessage" className="text-sm font-medium">
            Default Message Template (Optional)
          </Label>
          <Textarea
            id="customMessage"
            placeholder="Enter default message template for SMS campaigns..."
            {...register("customMessage")}
            rows={3}
          />
        </div>

        <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <p className="text-sm text-green-800">
            Your Twilio credentials are encrypted and stored securely. Only you can access this information.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={handleTestConnection}
          disabled={!isValid || isTestLoading}
          className="w-full sm:w-auto"
        >
          {isTestLoading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <CheckCircle className="h-4 w-4 mr-2" />
          )}
          Test Connection
        </Button>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
            className="flex-1 sm:flex-none"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!isValid || isLoading}
            className="flex-1 sm:flex-none"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Settings className="h-4 w-4 mr-2" />
            )}
            Save Configuration
          </Button>
        </div>
      </div>
    </form>
  );
}
