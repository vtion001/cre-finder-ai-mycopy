"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCampaignSchema } from "@v1/supabase/validations/campaigns";
import { Button } from "@v1/ui/button";
import { Input } from "@v1/ui/input";
import { Textarea } from "@v1/ui/textarea";
import { Label } from "@v1/ui/label";
import { Checkbox } from "@v1/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@v1/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@v1/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@v1/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@v1/ui/tabs";
import { toast } from "@v1/ui/sonner";
import { IconPlus, IconPhone, IconMessage, IconMail, IconCalendar, IconClock } from "@tabler/icons-react";

// Define the type locally since the import is broken
interface CreateCampaignData {
  name: string;
  description?: string;
  channels: any;
  record_ids: string[];
  template_id?: string;
  scheduled_at?: Date;
  campaign_type: "manual" | "scheduled" | "automated";
  priority: "low" | "normal" | "high" | "urgent";
  settings?: Record<string, any>;
}

interface CreateCampaignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recordIds: string[];
  onSuccess?: () => void;
}

export function CreateCampaignDialog({ 
  open, 
  onOpenChange, 
  recordIds, 
  onSuccess 
}: CreateCampaignDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedChannels, setSelectedChannels] = useState<Set<string>>(new Set());

  const form = useForm<CreateCampaignData>({
    resolver: zodResolver(createCampaignSchema) as any,
    defaultValues: {
      name: "",
      description: "",
      channels: {},
      record_ids: recordIds,
      campaign_type: "manual",
      priority: "normal",
      settings: {},
    },
  });

  const onSubmit = async (data: CreateCampaignData) => {
    try {
      setIsSubmitting(true);

      const response = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create campaign");
      }

      toast.success("Campaign created successfully!");
      onSuccess?.();
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error("Error creating campaign:", error);
      toast.error(error instanceof Error ? error.message : "Failed to create campaign");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChannelToggle = (channel: string, enabled: boolean) => {
    const newChannels = new Set(selectedChannels);
    if (enabled) {
      newChannels.add(channel);
    } else {
      newChannels.delete(channel);
    }
    setSelectedChannels(newChannels);

    // Update form values
    const currentChannels = form.getValues("channels");
    if (enabled) {
      form.setValue(`channels.${channel}`, { enabled: true });
    } else {
      form.setValue(`channels.${channel}`, { enabled: false });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconPlus className="h-5 w-5" />
            Create New Campaign
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Campaign Information */}
          <Card>
            <CardHeader>
              <CardTitle>Campaign Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Campaign Name *</Label>
                  <Input
                    id="name"
                    {...form.register("name")}
                    placeholder="Enter campaign name"
                  />
                  {form.formState.errors.name && (
                    <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="campaign_type">Campaign Type</Label>
                  <Select
                    value={form.watch("campaign_type")}
                    onValueChange={(value) => form.setValue("campaign_type", value as any)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manual">Manual</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="automated">Automated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  {...form.register("description")}
                  placeholder="Describe your campaign"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={form.watch("priority")}
                    onValueChange={(value) => form.setValue("priority", value as any)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="scheduled_at">Schedule (Optional)</Label>
                  <Input
                    id="scheduled_at"
                    type="datetime-local"
                    onChange={(e) => {
                      if (e.target.value) {
                        form.setValue("scheduled_at", new Date(e.target.value));
                      }
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Channel Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Communication Channels</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="voice"
                    checked={selectedChannels.has("voice")}
                    onCheckedChange={(checked) => handleChannelToggle("voice", checked as boolean)}
                  />
                  <Label htmlFor="voice" className="flex items-center gap-2 cursor-pointer">
                    <IconPhone className="h-4 w-4" />
                    Voice Calls
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="sms"
                    checked={selectedChannels.has("sms")}
                    onCheckedChange={(checked) => handleChannelToggle("sms", checked as boolean)}
                  />
                  <Label htmlFor="sms" className="flex items-center gap-2 cursor-pointer">
                    <IconMessage className="h-4 w-4" />
                    SMS Messages
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="email"
                    checked={selectedChannels.has("email")}
                    onCheckedChange={(checked) => handleChannelToggle("email", checked as boolean)}
                  />
                  <Label htmlFor="email" className="flex items-center gap-2 cursor-pointer">
                    <IconMail className="h-4 w-4" />
                    Email
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Channel Configuration */}
          <Tabs defaultValue="voice" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="voice" disabled={!selectedChannels.has("voice")}>
                Voice Settings
              </TabsTrigger>
              <TabsTrigger value="sms" disabled={!selectedChannels.has("sms")}>
                SMS Settings
              </TabsTrigger>
              <TabsTrigger value="email" disabled={!selectedChannels.has("email")}>
                Email Settings
              </TabsTrigger>
            </TabsList>

            {/* Voice Channel Settings */}
            <TabsContent value="voice" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <IconPhone className="h-5 w-5" />
                    Voice Campaign Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="voice_script">Script Template</Label>
                    <Textarea
                      id="voice_script"
                      placeholder="Enter your voice script template..."
                      rows={6}
                      {...form.register("channels.voice.script_template")}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="voice_max_duration">Max Duration (seconds)</Label>
                      <Input
                        id="voice_max_duration"
                        type="number"
                        min="30"
                        max="300"
                        placeholder="120"
                        {...form.register("channels.voice.max_duration", { valueAsNumber: true })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="voice_retry_count">Retry Count</Label>
                      <Input
                        id="voice_max_duration"
                        type="number"
                        min="0"
                        max="5"
                        placeholder="3"
                        {...form.register("channels.voice.retry_count", { valueAsNumber: true })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* SMS Channel Settings */}
            <TabsContent value="sms" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <IconMessage className="h-5 w-5" />
                    SMS Campaign Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="sms_message">Message Template</Label>
                    <Textarea
                      id="sms_message"
                      placeholder="Enter your SMS message template..."
                      rows={4}
                      maxLength={1600}
                      {...form.register("channels.sms.message_template")}
                    />
                    <p className="text-xs text-muted-foreground">
                      Character count: {form.watch("channels.sms.message_template")?.length || 0}/1600
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="sms_from_number">From Number (Optional)</Label>
                      <Input
                        id="sms_from_number"
                        placeholder="+1234567890"
                        {...form.register("channels.sms.from_number")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sms_retry_count">Retry Count</Label>
                      <Input
                        id="sms_retry_count"
                        type="number"
                        min="0"
                        max="5"
                        placeholder="3"
                        {...form.register("channels.sms.retry_count", { valueAsNumber: true })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Email Channel Settings */}
            <TabsContent value="email" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <IconMail className="h-5 w-5" />
                    Email Campaign Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email_subject">Subject Template</Label>
                    <Input
                      id="email_subject"
                      placeholder="Enter your email subject template..."
                      {...form.register("channels.email.subject_template")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email_body">Body Template</Label>
                    <Textarea
                      id="email_body"
                      placeholder="Enter your email body template..."
                      rows={8}
                      {...form.register("channels.email.body_template")}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email_from_email">From Email</Label>
                      <Input
                        id="email_from_email"
                        type="email"
                        placeholder="noreply@yourdomain.com"
                        {...form.register("channels.email.from_email")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email_from_name">From Name</Label>
                      <Input
                        id="email_from_email"
                        placeholder="CRE Finder AI"
                        {...form.register("channels.email.from_name")}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Campaign Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Campaign Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Total Records:</span> {recordIds.length}
                </div>
                <div>
                  <span className="font-medium">Selected Channels:</span> {selectedChannels.size}
                </div>
                <div>
                  <span className="font-medium">Campaign Type:</span> {form.watch("campaign_type")}
                </div>
                <div>
                  <span className="font-medium">Priority:</span> {form.watch("priority")}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || selectedChannels.size === 0}>
              {isSubmitting ? "Creating..." : "Create Campaign"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
