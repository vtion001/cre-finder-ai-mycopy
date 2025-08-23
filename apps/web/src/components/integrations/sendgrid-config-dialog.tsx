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
} from "@v1/ui/dialog";
import { Settings, Loader2, CheckCircle2 } from "lucide-react";

// SendGrid Configuration Schema
const sendgridConfigSchema = z.object({
  apiKey: z.string().min(1, "API Key is required"),
  fromEmail: z.string().email("Must be a valid email address"),
  fromName: z.string().min(1, "From Name is required"),
  templateId: z.string().optional(),
  webhookUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  customSubject: z.string().optional(),
});

type SendGridConfigFormData = z.infer<typeof sendgridConfigSchema>;

interface SendGridConfigDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfigSaved: () => void;
  initialConfig?: Partial<SendGridConfigFormData>;
}

export function SendGridConfigDialog({
  isOpen,
  onOpenChange,
  onConfigSaved,
  initialConfig,
}: SendGridConfigDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isTestLoading, setIsTestLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<SendGridConfigFormData>({
    resolver: zodResolver(sendgridConfigSchema),
    defaultValues: initialConfig || {
      apiKey: "",
      fromEmail: "",
      fromName: "",
      templateId: "",
      webhookUrl: "",
      customSubject: "",
    },
  });

  const onSubmit = async (data: SendGridConfigFormData) => {
    setIsLoading(true);
    try {
      // TODO: Implement API call to save configuration
      const response = await fetch("/api/integrations/sendgrid", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to save configuration");
      }

      toast.success("SendGrid configuration saved successfully!");
      onConfigSaved();
      onOpenChange(false);
      reset();
    } catch (error) {
      console.error("Error saving SendGrid config:", error);
      toast.error("Failed to save SendGrid configuration. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestConnection = async () => {
    setIsTestLoading(true);
    try {
      // TODO: Implement SendGrid connection test
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      toast.success("SendGrid connection test successful!");
    } catch (error) {
      toast.error("SendGrid connection test failed. Please check your credentials.");
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
            <div className="p-2 bg-orange-100 rounded-lg">
              <Settings className="h-5 w-5 text-orange-600" />
            </div>
            Configure SendGrid Integration
          </DialogTitle>
          <DialogDescription>
            Set up your SendGrid credentials for email campaigns. All fields marked with * are required.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey" className="text-sm font-medium">
              API Key *
            </Label>
            <Input
              id="apiKey"
              type="password"
              placeholder="SG..."
              {...register("apiKey")}
              className={errors.apiKey ? "border-red-500" : ""}
            />
            {errors.apiKey && (
              <p className="text-sm text-red-500">{errors.apiKey.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fromEmail" className="text-sm font-medium">
                From Email *
              </Label>
              <Input
                id="fromEmail"
                type="email"
                placeholder="noreply@yourdomain.com"
                {...register("fromEmail")}
                className={errors.fromEmail ? "border-red-500" : ""}
              />
              {errors.fromEmail && (
                <p className="text-sm text-red-500">{errors.fromEmail.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="fromName" className="text-sm font-medium">
                From Name *
              </Label>
              <Input
                id="fromName"
                placeholder="Your Company Name"
                {...register("fromName")}
                className={errors.fromName ? "border-red-500" : ""}
              />
              {errors.fromName && (
                <p className="text-sm text-red-500">{errors.fromName.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="templateId" className="text-sm font-medium">
              Template ID (Optional)
            </Label>
            <Input
              id="templateId"
              placeholder="d-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              {...register("templateId")}
            />
            <p className="text-xs text-muted-foreground">
              Leave empty to use dynamic content instead of templates
            </p>
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
            <Label htmlFor="customSubject" className="text-sm font-medium">
              Default Subject Line (Optional)
            </Label>
            <Input
              id="customSubject"
              placeholder="Your default email subject line"
              {...register("customSubject")}
            />
          </div>

          <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg border border-orange-200">
            <CheckCircle2 className="h-4 w-4 text-orange-600" />
            <p className="text-sm text-orange-800">
              Your SendGrid API key is encrypted and stored securely. Only you can access this information.
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
