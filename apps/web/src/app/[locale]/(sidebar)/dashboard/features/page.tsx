"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@v1/ui/card';
import { Badge } from '@v1/ui/badge';
import { Button } from '@v1/ui/button';
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Home, 
  Phone, 
  MessageSquare, 
  Mail, 
  Database, 
  Shield, 
  Users, 
  Search, 
  BarChart3, 
  Settings, 
  Zap,
  Globe,
  Lock,
  FileText,
  Calendar,
  Target,
  TrendingUp,
  Bell,
  LinkIcon,
  Palette,
  Rocket
} from 'lucide-react';
import Link from 'next/link';

interface Feature {
  id: string;
  name: string;
  description: string;
  status: 'completed' | 'in-progress' | 'planned';
  category: 'core' | 'integrations' | 'management' | 'analytics' | 'security';
  icon: React.ReactNode;
  url?: string;
  priority: 'high' | 'medium' | 'low';
}

const features: Feature[] = [
  // Core System Features
  {
    id: '1',
    name: 'User Authentication & Authorization',
    description: 'Secure user login, registration, and role-based access control with Supabase',
    status: 'completed',
    category: 'core',
    icon: <Shield className="h-6 w-6" />,
    url: '/en/account',
    priority: 'high'
  },
  {
    id: '2',
    name: 'Multi-language Support',
    description: 'Internationalization with locale-based routing and content',
    status: 'completed',
    category: 'core',
    icon: <Globe className="h-6 w-6" />,
    priority: 'high'
  },
  {
    id: '3',
    name: 'Responsive Dashboard',
    description: 'Modern, mobile-first dashboard with sidebar navigation',
    status: 'completed',
    category: 'core',
    icon: <Home className="h-6 w-6" />,
    url: '/en/dashboard',
    priority: 'high'
  },
  {
    id: '4',
    name: 'Role-based Access Control',
    description: 'User roles: Investor, Wholesaler, Broker, Admin with appropriate permissions',
    status: 'completed',
    category: 'core',
    icon: <Users className="h-6 w-6" />,
    priority: 'high'
  },

  // Integrations System
  {
    id: '5',
    name: 'VAPI Voice AI Integration',
    description: 'Voice AI assistant integration for real estate calls and lead qualification',
    status: 'completed',
    category: 'integrations',
    icon: <Phone className="h-6 w-6" />,
    url: '/en/account/integrations',
    priority: 'high'
  },
  {
    id: '6',
    name: 'Twilio SMS/Voice Integration',
    description: 'SMS and voice calling capabilities for lead communication',
    status: 'completed',
    category: 'integrations',
    icon: <MessageSquare className="h-6 w-6" />,
    url: '/en/account/integrations',
    priority: 'high'
  },
  {
    id: '7',
    name: 'SendGrid Email Integration',
    description: 'Email marketing and automation for lead nurturing',
    status: 'completed',
    category: 'integrations',
    icon: <Mail className="h-6 w-6" />,
    url: '/en/account/integrations',
    priority: 'high'
  },
  {
    id: '8',
    name: 'Integration Configuration Management',
    description: 'Centralized management of all third-party service configurations',
    status: 'completed',
    category: 'integrations',
    icon: <Settings className="h-6 w-6" />,
    url: '/en/account/integrations',
    priority: 'high'
  },
  {
    id: '9',
    name: 'Integration Status Monitoring',
    description: 'Real-time monitoring of integration health and performance',
    status: 'completed',
    category: 'integrations',
    icon: <BarChart3 className="h-6 w-6" />,
    url: '/en/account/integrations',
    priority: 'medium'
  },

  // Property Management
  {
    id: '10',
    name: 'Property Database',
    description: 'Comprehensive property management with detailed listings',
    status: 'completed',
    category: 'management',
    icon: <Database className="h-6 w-6" />,
    url: '/en/dashboard/properties',
    priority: 'high'
  },
  {
    id: '11',
    name: 'Property Search & Filtering',
    description: 'Advanced search with filters for type, price, location, and features',
    status: 'completed',
    category: 'management',
    icon: <Search className="h-6 w-6" />,
    url: '/en/dashboard/search',
    priority: 'high'
  },
  {
    id: '12',
    name: 'Property Form Builder',
    description: 'Dynamic form for adding and editing property details',
    status: 'completed',
    category: 'management',
    icon: <FileText className="h-6 w-6" />,
    url: '/en/dashboard/properties',
    priority: 'medium'
  },
  {
    id: '13',
    name: 'Property Features & Media',
    description: 'Support for property features, images, and documents',
    status: 'completed',
    category: 'management',
    icon: <Palette className="h-6 w-6" />,
    priority: 'medium'
  },

  // Campaign Management
  {
    id: '14',
    name: 'Campaign Creation & Management',
    description: 'Create and manage marketing campaigns for properties',
    status: 'completed',
    category: 'management',
    icon: <Target className="h-6 w-6" />,
    url: '/en/dashboard/campaigns',
    priority: 'high'
  },
  {
    id: '15',
    name: 'Campaign Templates',
    description: 'Reusable templates for different types of marketing campaigns',
    status: 'completed',
    category: 'management',
    icon: <FileText className="h-6 w-6" />,
    url: '/en/dashboard/campaigns',
    priority: 'medium'
  },
  {
    id: '16',
    name: 'Campaign Execution',
    description: 'Automated campaign execution across multiple channels',
    status: 'completed',
    category: 'management',
    icon: <Zap className="h-6 w-6" />,
    url: '/en/dashboard/campaigns',
    priority: 'high'
  },
  {
    id: '17',
    name: 'Campaign Results Tracking',
    description: 'Monitor and analyze campaign performance and results',
    status: 'completed',
    category: 'analytics',
    icon: <TrendingUp className="h-6 w-6" />,
    url: '/en/dashboard/campaigns',
    priority: 'medium'
  },

  // Analytics & Reporting
  {
    id: '18',
    name: 'Lead Analytics Dashboard',
    description: 'Comprehensive analytics for lead generation and conversion',
    status: 'completed',
    category: 'analytics',
    icon: <BarChart3 className="h-6 w-6" />,
    priority: 'medium'
  },
  {
    id: '19',
    name: 'Performance Metrics',
    description: 'Track key performance indicators and business metrics',
    status: 'completed',
    category: 'analytics',
    icon: <TrendingUp className="h-6 w-6" />,
    priority: 'medium'
  },

  // Security & Compliance
  {
    id: '20',
    name: 'Row Level Security (RLS)',
    description: 'Database-level security ensuring users only access their own data',
    status: 'completed',
    category: 'security',
    icon: <Lock className="h-6 w-6" />,
    priority: 'high'
  },
  {
    id: '21',
    name: 'API Security & Validation',
    description: 'Secure API endpoints with input validation and authentication',
    status: 'completed',
    category: 'security',
    icon: <Shield className="h-6 w-6" />,
    priority: 'high'
  },
  {
    id: '22',
    name: 'Data Encryption',
    description: 'End-to-end encryption for sensitive data and communications',
    status: 'completed',
    category: 'security',
    icon: <Lock className="h-6 w-6" />,
    priority: 'high'
  },

  // Call Recording & Analytics
  {
    id: '23',
    name: 'Call Recording System',
    description: 'Record and store voice calls for analysis and compliance',
    status: 'completed',
    category: 'management',
    icon: <Phone className="h-6 w-6" />,
    priority: 'high'
  },
  {
    id: '24',
    name: 'Voice Analytics & Transcription',
    description: 'AI-powered call transcription and sentiment analysis',
    status: 'completed',
    category: 'analytics',
    icon: <BarChart3 className="h-6 w-6" />,
    priority: 'medium'
  },
  {
    id: '25',
    name: 'Call Tracking & Lead Qualification',
    description: 'Track call outcomes and automatically qualify leads',
    status: 'completed',
    category: 'management',
    icon: <Target className="h-6 w-6" />,
    priority: 'high'
  },
  {
    id: '26',
    name: 'Real-time Notifications',
    description: 'Instant notifications for leads, campaigns, and system events',
    status: 'completed',
    category: 'core',
    icon: <Bell className="h-6 w-6" />,
    priority: 'medium'
  },
  {
    id: '27',
    name: 'API Integration Hub',
    description: 'Centralized hub for managing all external service integrations',
    status: 'completed',
    category: 'integrations',
    icon: <LinkIcon className="h-6 w-6" />,
    url: '/en/account/integrations',
    priority: 'high'
  }
];

const categoryColors = {
  core: 'bg-blue-100 text-blue-800',
  integrations: 'bg-green-100 text-green-800',
  management: 'bg-purple-100 text-purple-800',
  analytics: 'bg-orange-100 text-orange-800',
  security: 'bg-red-100 text-red-800'
};

const priorityColors = {
  high: 'bg-red-100 text-red-800',
  medium: 'bg-yellow-100 text-yellow-800',
  low: 'bg-gray-100 text-gray-800'
};

const statusIcons = {
  completed: <CheckCircle2 className="h-5 w-5 text-green-600" />,
  'in-progress': <AlertCircle className="h-5 w-5 text-yellow-600" />,
  planned: <XCircle className="h-5 w-5 text-gray-600" />
};

export default function FeaturesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const filteredFeatures = features.filter(feature => {
    const categoryMatch = selectedCategory === 'all' || feature.category === selectedCategory;
    const statusMatch = selectedStatus === 'all' || feature.status === selectedStatus;
    return categoryMatch && statusMatch;
  });

  const completedCount = features.filter(f => f.status === 'completed').length;
  const totalCount = features.length;

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">System Features Overview</h1>
        <p className="text-gray-600 mb-4">
          Complete overview of all 24 implemented features in the CRE Finder AI platform
        </p>
        
        {/* Progress Summary */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Implementation Progress</h3>
                <p className="text-sm text-gray-600">
                  {completedCount} of {totalCount} features completed
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">
                  {Math.round((completedCount / totalCount) * 100)}%
                </div>
                <div className="text-sm text-gray-600">Complete</div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(completedCount / totalCount) * 100}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="core">Core System</option>
              <option value="integrations">Integrations</option>
              <option value="management">Management</option>
              <option value="analytics">Analytics</option>
              <option value="security">Security</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="in-progress">In Progress</option>
              <option value="planned">Planned</option>
            </select>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFeatures.map((feature) => (
          <Card key={feature.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    {feature.icon}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{feature.name}</CardTitle>
                    <div className="flex gap-2 mt-2">
                      <Badge className={categoryColors[feature.category]}>
                        {feature.category}
                      </Badge>
                      <Badge className={priorityColors[feature.priority]}>
                        {feature.priority}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {statusIcons[feature.status]}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <CardDescription className="mb-4">
                {feature.description}
              </CardDescription>
              
              <div className="flex items-center justify-between">
                <Badge 
                  variant={feature.status === 'completed' ? 'default' : 'secondary'}
                  className={feature.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                >
                  {feature.status.replace('-', ' ')}
                </Badge>
                
                {feature.url && (
                  <Button asChild size="sm" variant="outline">
                    <Link href={feature.url}>
                      View Feature
                    </Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredFeatures.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No features found</h3>
            <p className="text-gray-600">
              Try adjusting your filters to see more features
            </p>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Access key features directly</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button asChild variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Link href="/en/dashboard/properties">
                <Home className="h-6 w-6" />
                <span>Properties</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Link href="/en/account/integrations">
                <Settings className="h-6 w-6" />
                <span>Integrations</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Link href="/en/dashboard/campaigns">
                <Target className="h-6 w-6" />
                <span>Campaigns</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Link href="/en/dashboard/search">
                <Search className="h-6 w-6" />
                <span>Search</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
