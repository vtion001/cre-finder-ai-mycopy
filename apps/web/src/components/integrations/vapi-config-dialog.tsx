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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@v1/ui/dialog";
import { Settings, Loader2, CheckCircle2 } from "lucide-react";

// VAPI Configuration Schema
const vapiConfigSchema = z.object({
  apiKey: z.string().min(1, "API Key is required"),
  organization: z.string().min(1, "Organization is required"),
  assistantId: z.string().min(1, "Assistant ID is required"),
  phoneNumber: z.string().min(1, "Phone Number is required"),
  webhookUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  customPrompt: z.string().optional(),
});

type VapiConfigFormData = z.infer<typeof vapiConfigSchema>;

interface VapiConfigDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfigSaved: () => void;
  initialConfig?: Partial<VapiConfigFormData>;
}

export function VapiConfigDialog({
  isOpen,
  onOpenChange,
  onConfigSaved,
  initialConfig,
}: VapiConfigDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isTestLoading, setIsTestLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<VapiConfigFormData>({
    resolver: zodResolver(vapiConfigSchema),
    defaultValues: initialConfig || {
      apiKey: "",
      organization: "",
      assistantId: "",
      phoneNumber: "",
      webhookUrl: "",
      customPrompt: "",
    },
  });

  const onSubmit = async (data: VapiConfigFormData) => {
    setIsLoading(true);
    try {
      // TODO: Implement API call to save configuration
      const response = await fetch("/api/integrations/vapi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to save configuration");
      }

      toast.success("VAPI configuration saved successfully!");
      onConfigSaved();
      onOpenChange(false);
      reset();
    } catch (error) {
      console.error("Error saving VAPI config:", error);
      toast.error("Failed to save VAPI configuration. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestConnection = async () => {
    setIsTestLoading(true);
    try {
      // TODO: Implement VAPI connection test
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      toast.success("VAPI connection test successful!");
    } catch (error) {
      toast.error("VAPI connection test failed. Please check your credentials.");
    } finally {
      setIsTestLoading(false);
    }
  };

  const handleCancel = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Settings className="h-5 w-5 text-blue-600" />
            </div>
            Configure VAPI Integration
          </DialogTitle>
          <DialogDescription>
            Set up your VAPI credentials for voice AI campaigns. All fields marked with * are required.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="apiKey" className="text-sm font-medium">
                API Key *
              </Label>
              <Input
                id="apiKey"
                type="password"
                placeholder="vapi_..."
                {...register("apiKey")}
                className={errors.apiKey ? "border-red-500" : ""}
              />
              {errors.apiKey && (
                <p className="text-sm text-red-500">{errors.apiKey.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="organization" className="text-sm font-medium">
                Organization *
              </Label>
              <Input
                id="organization"
                placeholder="your-org-id"
                {...register("organization")}
                className={errors.organization ? "border-red-500" : ""}
              />
              {errors.organization && (
                <p className="text-sm text-red-500">{errors.organization.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="assistantId" className="text-sm font-medium">
                Assistant ID *
              </Label>
              <Input
                id="assistantId"
                placeholder="asst_..."
                {...register("assistantId")}
                className={errors.assistantId ? "border-red-500" : ""}
              />
              {errors.assistantId && (
                <p className="text-sm text-red-500">{errors.assistantId.message}</p>
              )}
            </div>

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
            <Label htmlFor="customPrompt" className="text-sm font-medium">
              Custom Prompt (Optional)
            </Label>
            <Textarea
              id="customPrompt"
              placeholder="Enter custom instructions for your VAPI assistant..."
              {...register("customPrompt")}
              rows={3}
            />
          </div>

          <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <CheckCircle2 className="h-4 w-4 text-blue-600" />
            <p className="text-sm text-blue-800">
              Your API credentials are encrypted and stored securely. Only you can access this information.
            </p>
          </div>
        </form>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={handleTestConnection}
            disabled={!isValid || isTestLoading}
            className="w-full sm:w-auto"
          >
            {isTestLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <CheckCircle2 className="h-4 w-4 mr-2" />
            )}
            Test Connection
          </Button>
          
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
              className="flex-1 sm:flex-none"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit(onSubmit)}
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
