# 🏗️ System Architecture Technical Document (TD)
**CRE Finder AI - Multi-Channel Marketing Automation Platform**

---

## 📋 Document Information
- **Document Type**: System Architecture Technical Document
- **Version**: 1.0
- **Date**: 2024
- **Status**: Active
- **Scope**: Complete system architecture for CRE Finder AI platform

---

## 🎯 Executive Summary

CRE Finder AI is a comprehensive marketing automation platform designed for commercial real estate professionals. The system enables property search, owner identification, and multi-channel outreach campaigns through voice AI, SMS, and email communications.

### **Key Architectural Principles:**
- **Microservices Architecture**: Modular, scalable services
- **Event-Driven Design**: Asynchronous processing and real-time updates
- **Multi-Tenant Security**: Row-level security and data isolation
- **API-First Development**: All functionality exposed through APIs
- **Cloud-Native Deployment**: Serverless and edge computing

---

## 🏗️ System Architecture Overview

### **1. Frontend Layer Architecture**

#### **1.1 Web Application (Primary Interface)**
- **Technology**: Next.js 14 with App Router
- **Purpose**: Main user dashboard for property search and campaign management
- **Key Features**:
  - Property search and filtering interface
  - Campaign creation and management tools
  - Integration configuration panels
  - Real-time analytics dashboards
  - User account and subscription management

#### **1.2 Marketing Website (Public Interface)**
- **Technology**: Next.js 14 with static generation
- **Purpose**: Public-facing website for lead generation and product information
- **Key Features**:
  - Landing pages with conversion optimization
  - Pricing and feature information
  - Lead capture forms
  - SEO-optimized content management

#### **1.3 Mobile Interface (Responsive Design)**
- **Technology**: Progressive Web App (PWA) capabilities
- **Purpose**: Mobile-optimized access to core platform features
- **Key Features**:
  - Touch-optimized interface design
  - Offline functionality for critical features
  - Push notifications for campaign updates
  - Mobile-specific UI components

### **2. Application Services Layer Architecture**

#### **2.1 Authentication Service**
- **Technology**: Supabase Auth with Row Level Security (RLS)
- **Architecture Pattern**: Centralized authentication with distributed authorization
- **Security Features**:
  - Multi-factor authentication support
  - OAuth provider integration (Google, Microsoft)
  - Session management with JWT tokens
  - Role-based access control (RBAC)
- **Data Isolation**: User-scoped data access through RLS policies

#### **2.2 API Gateway**
- **Technology**: tRPC for type-safe APIs + Next.js API routes for REST endpoints
- **Architecture Pattern**: Gateway aggregation with type safety
- **Features**:
  - Automatic API documentation generation
  - Request/response validation
  - Rate limiting and throttling
  - Error handling and standardization
- **Performance**: Edge caching and CDN optimization

#### **2.3 Caching Layer**
- **Technology**: React Query (client-side) + Edge caching (server-side)
- **Architecture Pattern**: Multi-layer caching strategy
- **Implementation**:
  - Client-side: React Query for server state management
  - Server-side: Next.js edge caching and ISR
  - Database: Optimized queries with indexing
- **Cache Invalidation**: Event-driven cache updates

#### **2.4 File Storage Service**
- **Technology**: Supabase Storage with CDN integration
- **Architecture Pattern**: Object storage with edge distribution
- **Use Cases**:
  - User profile images and documents
  - Property photos and attachments
  - Email template assets
  - Campaign media files

### **3. Business Logic Layer Architecture**

#### **3.1 Property Search Engine**
- **Architecture Pattern**: CQRS (Command Query Responsibility Segregation)
- **Components**:
  - **Query Processor**: Handles search requests with complex filtering
  - **Data Aggregator**: Combines local and external property data
  - **Search Optimizer**: Performance optimization and caching
  - **Result Formatter**: Standardizes output across data sources
- **External Integration**: Real Estate API for comprehensive property data
- **Performance**: Indexed searches with sub-second response times

#### **3.2 Campaign Engine**
- **Architecture Pattern**: Event-driven orchestration
- **Components**:
  - **Campaign Scheduler**: Manages multi-channel campaign timing
  - **Message Generator**: Creates personalized content
  - **Channel Router**: Directs messages to appropriate services
  - **Response Processor**: Handles incoming responses and callbacks
- **Integration Points**:
  - VAPI for AI-powered voice calls
  - Twilio for SMS and traditional voice
  - SendGrid for email campaigns
  - N8N for complex workflow automation

#### **3.3 Analytics Engine**
- **Architecture Pattern**: Real-time stream processing
- **Components**:
  - **Event Collector**: Captures all user and system events
  - **Metrics Calculator**: Real-time performance calculations
  - **Report Generator**: Automated reporting and insights
  - **Predictive Analytics**: ML-based performance predictions
- **Data Storage**: Time-series data for historical analysis
- **Performance**: Real-time dashboards with millisecond updates

#### **3.4 Background Job Processor**
- **Technology**: Trigger.dev for reliable job processing
- **Architecture Pattern**: Queue-based asynchronous processing
- **Job Types**:
  - Property data updates and synchronization
  - Campaign message sending and scheduling
  - Analytics data processing
  - User notification delivery
- **Reliability**: Retry logic, dead letter queues, and monitoring

### **4. Data Layer Architecture**

#### **4.1 Primary Database (PostgreSQL + Supabase)**
- **Architecture Pattern**: Single-tenant with multi-user isolation
- **Key Tables**:
  - **Users**: Authentication and profile data
  - **Asset/Location Licenses**: Subscription and access control
  - **Property Records**: Real estate data and owner information
  - **Campaigns**: Marketing campaign definitions
  - **Outbound Events**: Message tracking across all channels
  - **Integration Configs**: Encrypted API credentials
- **Security**: Row Level Security (RLS) for complete data isolation
- **Performance**: Optimized indexes and query patterns

#### **4.2 Search Index (Optimized Queries)**
- **Technology**: PostgreSQL with full-text search and GIN indexes
- **Purpose**: High-performance property search capabilities
- **Optimization**: Materialized views for complex aggregations
- **Maintenance**: Automated index updates and statistics

#### **4.3 Audit Logs (Compliance Tracking)**
- **Technology**: Separate audit database for compliance
- **Purpose**: Complete audit trail for regulatory compliance
- **Data Retention**: Configurable retention policies
- **Access Control**: Read-only access with administrative oversight

### **5. External Integrations Architecture**

#### **5.1 VAPI (Voice AI Service)**
- **Integration Pattern**: API-first with webhook callbacks
- **Purpose**: AI-powered voice calls for property outreach
- **Data Flow**: Campaign → VAPI → Conversation → Results → Analytics
- **Security**: API key authentication and webhook signature verification

#### **5.2 Twilio (SMS and Voice Service)**
- **Integration Pattern**: REST API with webhook status updates
- **Purpose**: SMS messaging and traditional voice calls
- **Compliance**: Built-in opt-out handling and regulatory compliance
- **Reliability**: Status tracking and delivery confirmation

#### **5.3 SendGrid (Email Service)**
- **Integration Pattern**: API integration with event webhooks
- **Purpose**: Professional email campaigns with tracking
- **Features**: Template management, A/B testing, and analytics
- **Deliverability**: High inbox delivery rates and reputation management

#### **5.4 Stripe (Payment Processing)**
- **Integration Pattern**: Secure API with webhook events
- **Purpose**: Subscription billing and payment processing
- **Security**: PCI compliance and tokenized payments
- **Features**: Subscription management and usage-based billing

#### **5.5 Property APIs (Data Sources)**
- **Integration Pattern**: RESTful APIs with rate limiting
- **Purpose**: Comprehensive property and owner data
- **Data Quality**: Validation and enrichment processes
- **Updates**: Scheduled synchronization and real-time updates

#### **5.6 N8N (Workflow Automation)**
- **Integration Pattern**: Visual workflow designer with API triggers
- **Purpose**: Complex multi-step campaign automation
- **Capabilities**: Conditional logic, delays, and cross-platform integration
- **Monitoring**: Workflow execution tracking and error handling

### **6. Infrastructure Layer Architecture**

#### **6.1 Vercel Platform (Hosting and CDN)**
- **Architecture Pattern**: Serverless with edge computing
- **Features**:
  - Global CDN with edge caching
  - Automatic scaling and load balancing
  - Zero-downtime deployments
  - Built-in monitoring and analytics
- **Performance**: Sub-100ms response times globally

#### **6.2 Monitoring and Observability**
- **Technology**: Sentry for error tracking + Vercel Analytics
- **Components**:
  - Real-time error tracking and alerting
  - Performance monitoring and optimization
  - User behavior analytics
  - System health dashboards
- **Alerting**: Automated incident detection and notification

#### **6.3 Security Layer**
- **Components**:
  - SSL/TLS encryption for all communications
  - Web Application Firewall (WAF) protection
  - DDoS protection and rate limiting
  - Security headers and CSRF protection
- **Compliance**: GDPR, CCPA, and industry standard compliance

---

## 📊 Data Architecture and Flow

### **Database Schema Relationships**

#### **Core Entity Relationships:**
1. **Users** → **Asset Licenses** (1:N): Users can have multiple property type subscriptions
2. **Asset Licenses** → **Location Licenses** (1:N): Each license covers multiple geographic areas
3. **Location Licenses** → **Property Records** (1:N): Properties are tied to specific licensed areas
4. **Users** → **Campaigns** (1:N): Users create and manage multiple campaigns
5. **Campaigns** → **Outbound Events** (1:N): Each campaign generates multiple message events
6. **Property Records** → **Outbound Events** (1:N): Properties are targeted by multiple campaigns
7. **Users** → **Integration Configs** (1:N): Users configure multiple external services

#### **Data Flow Patterns:**

**1. Property Search Flow:**
```
User Query → API Gateway → Property Engine → Database Query + External API → 
Result Aggregation → Cache Storage → Response to User
```

**2. Campaign Execution Flow:**
```
Campaign Creation → Property Selection → Message Generation → 
Channel Routing (VAPI/Twilio/SendGrid) → External Service → 
Webhook Response → Event Logging → Analytics Update
```

**3. User Authentication Flow:**
```
Login Request → Supabase Auth → Session Creation → RLS Policy Application → 
Resource Access → Audit Logging
```

---

## 🔒 Security Architecture

### **Security Principles:**
1. **Defense in Depth**: Multiple security layers
2. **Zero Trust**: Verify all requests and users
3. **Principle of Least Privilege**: Minimal required access
4. **Data Encryption**: At rest and in transit
5. **Audit Everything**: Complete activity logging

### **Security Implementation:**

#### **Authentication Security:**
- Multi-factor authentication (MFA) support
- OAuth 2.0 with trusted providers
- Session management with secure tokens
- Password policies and rotation

#### **Authorization Security:**
- Row Level Security (RLS) for data isolation
- Role-based access control (RBAC)
- API-level permission checking
- Resource-specific authorization

#### **Data Security:**
- AES-256 encryption at rest
- TLS 1.3 encryption in transit
- Encrypted API credentials storage
- Secure key management

#### **Network Security:**
- Web Application Firewall (WAF)
- DDoS protection and rate limiting
- IP allowlisting for sensitive operations
- Security headers (CSP, HSTS, etc.)

---

## ⚡ Performance Architecture

### **Performance Targets:**
- **API Response Time**: < 200ms (95th percentile)
- **Page Load Time**: < 2 seconds (LCP)
- **Database Queries**: < 50ms average
- **Campaign Processing**: < 5 seconds for 1000 contacts
- **System Availability**: 99.9% uptime

### **Performance Strategies:**

#### **Frontend Performance:**
- Server-side rendering (SSR) for initial page loads
- Client-side routing for subsequent navigation
- Code splitting and lazy loading
- Image optimization and CDN delivery
- Edge caching for static assets

#### **Backend Performance:**
- Database query optimization and indexing
- Connection pooling and query caching
- Background job processing for heavy operations
- API response caching and compression
- Horizontal scaling with load balancing

#### **Infrastructure Performance:**
- Global CDN with edge locations
- Serverless architecture for automatic scaling
- Database read replicas for query distribution
- Caching layers at multiple levels
- Performance monitoring and optimization

---

## 📈 Scalability Architecture

### **Scalability Patterns:**

#### **Horizontal Scaling:**
- Stateless application design
- Load balancing across multiple instances
- Database sharding for large datasets
- Microservices for independent scaling
- Queue-based processing for peak loads

#### **Vertical Scaling:**
- Resource monitoring and auto-scaling
- Performance profiling and optimization
- Memory and CPU optimization
- Database performance tuning
- Caching strategy optimization

#### **Geographic Scaling:**
- Multi-region deployment capability
- Edge computing for reduced latency
- Data replication strategies
- Regional compliance requirements
- Global load balancing

---

## 🔄 Integration Architecture

### **Integration Patterns:**

#### **API Integration:**
- RESTful APIs for external services
- GraphQL for complex data queries
- Webhook-based event handling
- Rate limiting and retry logic
- Circuit breaker patterns for resilience

#### **Event-Driven Integration:**
- Asynchronous message processing
- Event sourcing for audit trails
- Saga patterns for distributed transactions
- Event bus for service communication
- Dead letter queues for error handling

#### **Data Integration:**
- ETL processes for data synchronization
- Real-time data streaming
- Data validation and cleansing
- Conflict resolution strategies
- Data lineage tracking

---

## 🚀 Deployment Architecture

### **Deployment Strategy:**
- **Environment Separation**: Development, Staging, Production
- **Blue-Green Deployment**: Zero-downtime releases
- **Feature Flags**: Gradual feature rollout
- **Automated Testing**: CI/CD pipeline integration
- **Rollback Capability**: Quick recovery from issues

### **Infrastructure as Code:**
- Vercel configuration for hosting
- Supabase configuration for database
- Environment variable management
- Automated backup strategies
- Disaster recovery procedures

---

## 📊 Monitoring and Observability

### **Monitoring Components:**

#### **Application Monitoring:**
- Real-time error tracking (Sentry)
- Performance metrics collection
- User behavior analytics
- API usage monitoring
- Security event detection

#### **Infrastructure Monitoring:**
- Server health and resource usage
- Database performance metrics
- Network latency and throughput
- Third-party service availability
- Cost optimization tracking

#### **Business Monitoring:**
- Campaign performance metrics
- User engagement analytics
- Revenue and subscription tracking
- Customer success indicators
- Compliance and audit reporting

---

## 🎯 Success Metrics and KPIs

### **Technical KPIs:**
- System uptime and availability
- API response times and throughput
- Error rates and resolution times
- Security incident frequency
- Performance optimization gains

### **Business KPIs:**
- User adoption and retention rates
- Campaign success and conversion rates
- Revenue growth and profitability
- Customer satisfaction scores
- Market penetration metrics

---

## 📋 Architecture Decision Records (ADRs)

### **Key Architectural Decisions:**

#### **ADR-001: Next.js App Router**
- **Decision**: Use Next.js 14 App Router for frontend
- **Rationale**: Better performance, SEO, and developer experience
- **Alternatives**: React SPA, Nuxt.js, Angular
- **Status**: Accepted

#### **ADR-002: Supabase as Backend**
- **Decision**: Use Supabase for database, auth, and storage
- **Rationale**: Rapid development, built-in security, cost-effective
- **Alternatives**: Firebase, AWS Amplify, custom backend
- **Status**: Accepted

#### **ADR-003: tRPC for API Layer**
- **Decision**: Use tRPC for type-safe API communication
- **Rationale**: End-to-end type safety, better developer experience
- **Alternatives**: REST APIs, GraphQL, gRPC
- **Status**: Accepted

#### **ADR-004: Multi-Channel Integration**
- **Decision**: Integrate VAPI, Twilio, and SendGrid for communications
- **Rationale**: Best-in-class services for each channel
- **Alternatives**: Single provider, custom solutions
- **Status**: Accepted

---

## 🔮 Future Architecture Considerations

### **Planned Enhancements:**
1. **Machine Learning Integration**: AI-powered campaign optimization
2. **Advanced Analytics**: Predictive modeling and insights
3. **Mobile Applications**: Native iOS and Android apps
4. **API Marketplace**: Third-party integration ecosystem
5. **Multi-Language Support**: International expansion capabilities

### **Technology Evolution:**
- Migration to newer framework versions
- Database optimization and sharding
- Enhanced security and compliance
- Performance optimization initiatives
- Cost optimization strategies

---

## 📚 Related Documents
- Implementation Guidelines Technical Document
- Integration Guidelines Technical Document
- Database Schema Documentation
- API Documentation
- Security Compliance Documentation
- Deployment and Operations Guide

---

**Document Approval:**
- **Architect**: [Name]
- **Engineering Lead**: [Name]  
- **Product Owner**: [Name]
- **Security Lead**: [Name]

**Last Updated**: [Date]
**Next Review**: [Date + 6 months]
