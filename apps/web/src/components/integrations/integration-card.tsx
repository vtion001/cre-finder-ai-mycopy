"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@v1/ui/card";
import { Button } from "@v1/ui/button";
import { Badge } from "@v1/ui/badge";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@v1/ui/collapsible";
import { 
  Settings, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  TestTube
} from "lucide-react";
import { cn } from "@v1/ui/cn";

interface IntegrationCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  isConfigured: boolean;
  isMinimized: boolean;
  onToggleMinimize: () => void;
  onConfigure: () => void;
  onTest?: () => void;
  isTesting?: boolean;
  lastTested?: string;
  children?: React.ReactNode;
  className?: string;
}

export function IntegrationCard({
  title,
  description,
  icon,
  isConfigured,
  isMinimized,
  onToggleMinimize,
  onConfigure,
  onTest,
  isTesting = false,
  lastTested,
  children,
  className,
}: IntegrationCardProps) {
  return (
    <Collapsible open={!isMinimized} onOpenChange={() => onToggleMinimize()}>
      <Card className={cn("transition-all duration-200", className)}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted">
                {icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-lg">{title}</CardTitle>
                  <Badge 
                    variant={isConfigured ? "default" : "secondary"}
                    className={cn(
                      "text-xs",
                      isConfigured 
                        ? "bg-green-100 text-green-700 border-green-200" 
                        : "bg-gray-100 text-gray-600 border-gray-200"
                    )}
                  >
                    {isConfigured ? (
                      <>
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Configured
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Not Configured
                      </>
                    )}
                  </Badge>
                </div>
                <CardDescription className="text-sm mt-1">
                  {description}
                </CardDescription>
                {lastTested && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Last tested: {new Date(lastTested).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {onTest && isConfigured && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onTest}
                  disabled={isTesting}
                  className="h-8"
                >
                  {isTesting ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <TestTube className="h-3 w-3" />
                  )}
                  {isTesting ? "Testing..." : "Test"}
                </Button>
              )}
              
              <Button
                size="sm"
                variant="outline"
                onClick={onConfigure}
                className="h-8"
              >
                <Settings className="h-3 w-3 mr-1" />
                Configure
              </Button>
              
              <CollapsibleTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0"
                >
                  {isMinimized ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronUp className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
            </div>
          </div>
        </CardHeader>
        
        <CollapsibleContent>
          {children && (
            <CardContent className="pt-0">
              {children}
            </CardContent>
          )}
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
