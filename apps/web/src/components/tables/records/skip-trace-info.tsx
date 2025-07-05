"use client";

import {
  createEmailLink,
  createPhoneLink,
  formatPhoneNumber,
} from "@/lib/format";
import { Badge } from "@v1/ui/badge";
import { Button } from "@v1/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@v1/ui/popover";
import { Separator } from "@v1/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@v1/ui/tooltip";
import { Eye, Mail, MapPin, Phone, User } from "lucide-react";
import { useState } from "react";

// Types based on actual API response structure
interface SkipTracePhone {
  phone: string;
  phoneDisplay: string;
  isConnected: boolean;
  doNotCall: boolean;
  phoneType: string;
  lastSeen: string;
}

interface SkipTraceEmail {
  email: string;
  emailType: string;
}

interface SkipTraceAddress {
  formattedAddress: string;
  lastSeen: string;
}

interface SkipTraceIdentity {
  phones: SkipTracePhone[];
  emails: SkipTraceEmail[];
  address: SkipTraceAddress;
  addressHistory: SkipTraceAddress[];
}

interface SkipTraceDemographics {
  age: number;
  gender: string;
  ageDisplay: string;
}

interface SkipTraceStats {
  phoneNumbers: number;
  emailAddresses: number;
  addresses: number;
}

interface SkipTraceOutput {
  identity: SkipTraceIdentity;
  demographics: SkipTraceDemographics;
  stats: SkipTraceStats;
}

interface SkipTraceApiResponse {
  output?: SkipTraceOutput;
  statusCode: number;
  statusMessage: string;
}

interface SkipTraceContactInfoProps {
  skipTraceData: SkipTraceApiResponse | null;
  ownerName: string;
}

export function SkipTraceContactInfo({
  skipTraceData,
  ownerName,
}: SkipTraceContactInfoProps) {
  const [open, setOpen] = useState(false);

  if (!skipTraceData?.output?.identity) {
    return (
      <span className="text-sm text-muted-foreground">No contact info</span>
    );
  }

  const { identity, demographics, stats } = skipTraceData.output;
  const phones = identity.phones || [];
  const emails = identity.emails || [];
  const currentAddress = identity.address;
  const addressHistory = identity.addressHistory || [];

  const hasContactInfo = phones.length > 0 || emails.length > 0;

  if (!hasContactInfo) {
    return (
      <span className="text-sm text-muted-foreground">No contact info</span>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-auto p-1 text-left justify-start hover:bg-accent/50 group cursor-pointer"
        >
          <div className="flex items-center space-x-2">
            <div className="flex flex-col items-start space-y-1">
              <div className="flex items-center space-x-1">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-xs font-medium">Contact Available</span>
              </div>
              <div className="text-xs text-muted-foreground">
                {stats?.phoneNumbers || 0} phone
                {(stats?.phoneNumbers || 0) !== 1 ? "s" : ""},{" "}
                {stats?.emailAddresses || 0} email
                {(stats?.emailAddresses || 0) !== 1 ? "s" : ""}
              </div>
            </div>
            <Eye className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <div className="p-4">
          <div className="flex items-center space-x-2 mb-3">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium text-sm">{ownerName}</span>
            {demographics?.age && (
              <Badge variant="outline" className="text-xs">
                Age {demographics.age}
              </Badge>
            )}
          </div>

          {/* Phone Numbers */}
          {phones.length > 0 && (
            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-2">
                <Phone className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Phone Numbers
                </span>
              </div>
              <div className="space-y-1">
                {phones.map((phone, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <a
                      href={createPhoneLink(
                        phone.phoneDisplay || phone.phone || "",
                      )}
                      className="text-sm hover:text-primary transition-colors"
                    >
                      {formatPhoneNumber(
                        phone.phoneDisplay || phone.phone || "",
                      )}
                    </a>
                    <div className="flex items-center space-x-1">
                      {phone.isConnected && (
                        <div
                          className="h-2 w-2 rounded-full bg-green-500"
                          title="Connected"
                        />
                      )}
                      {phone.phoneType && (
                        <Badge variant="outline" className="text-xs">
                          {phone.phoneType}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Email Addresses */}
          {emails.length > 0 && (
            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-2">
                <Mail className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Email Addresses
                </span>
              </div>
              <div className="space-y-1">
                {emails.map((email, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <a
                      href={createEmailLink(email.email || "")}
                      className="text-sm hover:text-primary transition-colors truncate"
                    >
                      {email.email}
                    </a>
                    {email.emailType && (
                      <Badge variant="outline" className="text-xs ml-2">
                        {email.emailType}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Known Addresses */}
          {(currentAddress || addressHistory.length > 0) && (
            <div className="space-y-2">
              <Separator />
              <div className="flex items-center space-x-2 mt-3">
                <MapPin className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Known Addresses
                </span>
              </div>
              <div className="space-y-1">
                {currentAddress && (
                  <div className="text-xs text-muted-foreground">
                    <div className="font-medium">Current:</div>
                    <div>{currentAddress.formattedAddress}</div>
                  </div>
                )}
                {addressHistory.slice(0, 2).map((address, index) => (
                  <div key={index} className="text-xs text-muted-foreground">
                    <div className="font-medium">Previous:</div>
                    <div>{address.formattedAddress}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
