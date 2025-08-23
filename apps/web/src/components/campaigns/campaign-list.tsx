"use client";

import { useState, useEffect } from "react";
import { Button } from "@v1/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@v1/ui/card";
import { Badge } from "@v1/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@v1/ui/dialog";
import { toast } from "@v1/ui/sonner";
import { 
  IconPhone, 
  IconMessage, 
  IconMail, 
  IconPlayerPlay,
  IconPlayerPause,
  IconTrash, 
  IconEdit,
  IconEye,
  IconCalendar,
  IconClock,
  IconTarget,
  IconUsers,
  IconPlus
} from "@tabler/icons-react";
import { CreateCampaignDialog } from "./create-campaign-dialog";
import { CampaignDetails } from "./campaign-details";

interface Campaign {
  id: string;
  name: string;
  description?: string;
  status: string;
  channels: any;
  record_ids: string[];
  total_records: number;
  sent_count: number;
  delivered_count: number;
  failed_count: number;
  responded_count: number;
  campaign_type: string;
  priority: string;
  created_at: string;
  scheduled_at?: string;
}

interface CampaignListProps {
  recordIds?: string[];
  onRefresh?: () => void;
}

export function CampaignList({ recordIds = [], onRefresh }: CampaignListProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/campaigns");
      if (response.ok) {
        const data = await response.json();
        setCampaigns(data.campaigns || []);
      } else {
        throw new Error("Failed to fetch campaigns");
      }
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      toast.error("Failed to fetch campaigns");
    } finally {
      setIsLoading(false);
    }
  };

  const executeCampaign = async (campaignId: string) => {
    try {
      const response = await fetch("/api/campaigns/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ campaign_id: campaignId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to execute campaign");
      }

      toast.success("Campaign execution started!");
      fetchCampaigns(); // Refresh the list
      onRefresh?.();
    } catch (error) {
      console.error("Error executing campaign:", error);
      toast.error(error instanceof Error ? error.message : "Failed to execute campaign");
    }
  };

  const deleteCampaign = async (campaignId: string) => {
    if (!confirm("Are you sure you want to delete this campaign?")) return;

    try {
      const response = await fetch(`/api/campaigns/${campaignId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete campaign");
      }

      toast.success("Campaign deleted successfully!");
      fetchCampaigns(); // Refresh the list
      onRefresh?.();
    } catch (error) {
      console.error("Error deleting campaign:", error);
      toast.error(error instanceof Error ? error.message : "Failed to delete campaign");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "paused": return "bg-blue-100 text-blue-800";
      case "completed": return "bg-gray-100 text-gray-800";
      case "failed": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-red-100 text-red-800";
      case "high": return "bg-orange-100 text-orange-800";
      case "normal": return "bg-blue-100 text-blue-800";
      case "low": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getChannelIcons = (channels: any) => {
    const icons = [];
    if (channels?.voice?.enabled) icons.push(<IconPhone key="voice" className="h-4 w-4" />);
    if (channels?.sms?.enabled) icons.push(<IconMessage key="sms" className="h-4 w-4" />);
    if (channels?.email?.enabled) icons.push(<IconMail key="email" className="h-4 w-4" />);
    return icons;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getSuccessRate = (campaign: Campaign) => {
    if (campaign.total_records === 0) return 0;
    return Math.round((campaign.delivered_count / campaign.total_records) * 100);
  };

  const getResponseRate = (campaign: Campaign) => {
    if (campaign.delivered_count === 0) return 0;
    return Math.round((campaign.responded_count / campaign.delivered_count) * 100);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Campaigns</h2>
          <p className="text-muted-foreground">
            Manage your outbound marketing campaigns across voice, SMS, and email channels.
          </p>
        </div>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setCreateDialogOpen(true)}>
              <IconPlus className="h-4 w-4 mr-2" />
              Create Campaign
            </Button>
          </DialogTrigger>
          <CreateCampaignDialog
            open={createDialogOpen}
            onOpenChange={setCreateDialogOpen}
            recordIds={recordIds}
            onSuccess={fetchCampaigns}
          />
        </Dialog>
      </div>

      {/* Campaigns List */}
      {campaigns.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="space-y-4">
              <IconTarget className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="text-lg font-semibold">No campaigns yet</h3>
              <p className="text-muted-foreground">
                Create your first campaign to start reaching out to property owners.
              </p>
              <Button onClick={() => setCreateDialogOpen(true)}>
                <IconPlus className="h-4 w-4 mr-2" />
                Create Your First Campaign
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {campaigns.map((campaign) => (
            <Card key={campaign.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-4">
                    {/* Campaign Header */}
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h3 className="text-lg font-semibold">{campaign.name}</h3>
                        {campaign.description && (
                          <p className="text-sm text-muted-foreground">{campaign.description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(campaign.status)}>
                          {campaign.status}
                        </Badge>
                        <Badge className={getPriorityColor(campaign.priority)}>
                          {campaign.priority}
                        </Badge>
                      </div>
                    </div>

                    {/* Campaign Details */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <IconUsers className="h-4 w-4 text-muted-foreground" />
                        <span>{campaign.total_records} records</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <IconTarget className="h-4 w-4 text-muted-foreground" />
                        <span>{getSuccessRate(campaign)}% success</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <IconMessage className="h-4 w-4 text-muted-foreground" />
                        <span>{getResponseRate(campaign)}% response</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <IconCalendar className="h-4 w-4 text-muted-foreground" />
                        <span>{formatDate(campaign.created_at)}</span>
                      </div>
                    </div>

                    {/* Channels */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Channels:</span>
                      <div className="flex items-center gap-1">
                        {getChannelIcons(campaign.channels)}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Progress</span>
                        <span>{campaign.sent_count}/{campaign.total_records}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${campaign.total_records > 0 ? (campaign.sent_count / campaign.total_records) * 100 : 0}%`
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedCampaign(campaign);
                        setDetailsDialogOpen(true);
                      }}
                    >
                      <IconEye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    
                    {campaign.status === "pending" && (
                      <Button
                        size="sm"
                        onClick={() => executeCampaign(campaign.id)}
                      >
                        <IconPlayerPlay className="h-4 w-4 mr-1" />
                        Start
                      </Button>
                    )}
                    
                    {campaign.status === "active" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {/* TODO: Implement pause */}}
                      >
                        <IconPlayerPause className="h-4 w-4 mr-1" />
                        Pause
                      </Button>
                    )}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {/* TODO: Implement edit */}}
                    >
                      <IconEdit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteCampaign(campaign.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <IconTrash className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Campaign Details Dialog */}
      {selectedCampaign && (
        <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Campaign Details: {selectedCampaign.name}</DialogTitle>
            </DialogHeader>
            <CampaignDetails campaign={selectedCampaign} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
