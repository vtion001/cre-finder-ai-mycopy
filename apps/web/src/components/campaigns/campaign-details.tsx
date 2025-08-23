"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@v1/ui/card";
import { Badge } from "@v1/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@v1/ui/tabs";
import { 
  IconPhone, 
  IconMessage, 
  IconMail, 
  IconCalendar,
  IconClock,
  IconTarget,
  IconUsers,
  IconCheck,
  IconX,
  IconAlertCircle,
  IconPhoneCall,
  IconMessageCircle,
  IconMail as IconMailIcon
} from "@tabler/icons-react";

interface CampaignResult {
  id: string;
  record_id: string;
  channel: string;
  status: string;
  sent_at?: string;
  delivered_at?: string;
  response_data?: any;
  error_message?: string;
  retry_count: number;
  property_records?: {
    address: string;
    city: string;
    state: string;
    zip_code: string;
    property_type: string;
    square_feet: number;
    price: number;
  };
}

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
  campaign_results?: CampaignResult[];
}

interface CampaignDetailsProps {
  campaign: Campaign;
}

export function CampaignDetails({ campaign }: CampaignDetailsProps) {
  const [results, setResults] = useState<CampaignResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCampaignResults();
  }, [campaign.id]);

  const fetchCampaignResults = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/campaigns/${campaign.id}`);
      if (response.ok) {
        const data = await response.json();
        setResults(data.campaign?.campaign_results || []);
      }
    } catch (error) {
      console.error("Error fetching campaign results:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered": return "bg-green-100 text-green-800";
      case "sent": return "bg-blue-100 text-blue-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "failed": return "bg-red-100 text-red-800";
      case "responded": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case "voice": return <IconPhone className="h-4 w-4" />;
      case "sms": return <IconMessage className="h-4 w-4" />;
      case "email": return <IconMailIcon className="h-4 w-4" />;
      default: return <IconTarget className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getChannelStats = () => {
    const stats = { voice: 0, sms: 0, email: 0 };
    results.forEach(result => {
      if (stats[result.channel as keyof typeof stats] !== undefined) {
        stats[result.channel as keyof typeof stats]++;
      }
    });
    return stats;
  };

  const getStatusStats = () => {
    const stats = { pending: 0, sent: 0, delivered: 0, failed: 0, responded: 0 };
    results.forEach(result => {
      if (stats[result.status as keyof typeof stats] !== undefined) {
        stats[result.status as keyof typeof stats]++;
      }
    });
    return stats;
  };

  const channelStats = getChannelStats();
  const statusStats = getStatusStats();

  return (
    <div className="space-y-6">
      {/* Campaign Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{campaign.total_records}</div>
              <div className="text-sm text-muted-foreground">Total Records</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{campaign.sent_count}</div>
              <div className="text-sm text-muted-foreground">Sent</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{campaign.delivered_count}</div>
              <div className="text-sm text-muted-foreground">Delivered</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{campaign.responded_count}</div>
              <div className="text-sm text-muted-foreground">Responses</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Campaign Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type:</span>
                  <Badge variant="outline">{campaign.campaign_type}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Priority:</span>
                  <Badge variant="outline">{campaign.priority}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge className={getStatusColor(campaign.status)}>{campaign.status}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created:</span>
                  <span>{formatDate(campaign.created_at)}</span>
                </div>
                {campaign.scheduled_at && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Scheduled:</span>
                    <span>{formatDate(campaign.scheduled_at)}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Channels</h4>
              <div className="space-y-2">
                {Object.entries(campaign.channels).map(([channel, config]: [string, any]) => (
                  config?.enabled && (
                    <div key={channel} className="flex items-center gap-2">
                      {getChannelIcon(channel)}
                      <span className="capitalize">{channel}</span>
                      <Badge variant="outline" className="ml-auto">
                        {channelStats[channel as keyof typeof channelStats] || 0}
                      </Badge>
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analytics */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="channels">By Channel</TabsTrigger>
              <TabsTrigger value="results">Results</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {Object.entries(statusStats).map(([status, count]) => (
                  <div key={status} className="text-center">
                    <div className="text-xl font-bold">{count}</div>
                    <div className="text-sm text-muted-foreground capitalize">{status}</div>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Success Rate</h4>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-green-600 h-3 rounded-full transition-all duration-300"
                      style={{
                        width: `${campaign.total_records > 0 ? (campaign.delivered_count / campaign.total_records) * 100 : 0}%`
                      }}
                    ></div>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {campaign.total_records > 0 ? Math.round((campaign.delivered_count / campaign.total_records) * 100) : 0}% delivered successfully
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Response Rate</h4>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-purple-600 h-3 rounded-full transition-all duration-300"
                      style={{
                        width: `${campaign.delivered_count > 0 ? (campaign.responded_count / campaign.delivered_count) * 100 : 0}%`
                      }}
                    ></div>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {campaign.delivered_count > 0 ? Math.round((campaign.responded_count / campaign.delivered_count) * 100) : 0}% of delivered messages got responses
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="channels" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(channelStats).map(([channel, count]) => (
                  <Card key={channel}>
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2 text-sm">
                        {getChannelIcon(channel)}
                        <span className="capitalize">{channel}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{count}</div>
                      <div className="text-sm text-muted-foreground">records</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="results" className="space-y-4">
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="text-muted-foreground mt-2">Loading results...</p>
                </div>
              ) : results.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No results found for this campaign.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {results.map((result) => (
                    <Card key={result.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {getChannelIcon(result.channel)}
                            <div>
                              <div className="font-medium">
                                {result.property_records?.address || result.record_id}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {result.property_records?.city}, {result.property_records?.state} {result.property_records?.zip_code}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(result.status)}>
                              {result.status}
                            </Badge>
                            {result.sent_at && (
                              <div className="text-xs text-muted-foreground">
                                {formatDate(result.sent_at)}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {result.error_message && (
                          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                            <div className="flex items-center gap-1">
                              <IconAlertCircle className="h-4 w-4" />
                              Error: {result.error_message}
                            </div>
                          </div>
                        )}

                        {result.response_data && Object.keys(result.response_data).length > 0 && (
                          <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm">
                            <div className="flex items-center gap-1">
                              <IconCheck className="h-4 w-4 text-green-600" />
                              Response received
                            </div>
                          </div>
                        )}

                        {result.retry_count > 0 && (
                          <div className="mt-2 text-xs text-muted-foreground">
                            Retries: {result.retry_count}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
