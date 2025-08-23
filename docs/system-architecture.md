# 🏗️ CRE Finder AI - System Architecture Documentation

## 🎯 What is CRE Finder AI?
**Think of it like having a super smart assistant for finding properties and talking to property owners!**

CRE Finder AI is a marketing automation platform for commercial real estate professionals. Imagine you want to buy a house, but instead of looking for just one house, you're looking for hundreds of commercial buildings like stores, offices, and restaurants. This platform helps you:

1. **Find Properties** 🏢 - Like having a magic search that shows you all the buildings in any city or county
2. **Get Owner Info** 📞 - Like having a phone book that tells you who owns each building and how to contact them
3. **Send Messages Automatically** 🤖 - Like having a robot assistant that can call, text, and email property owners for you
4. **Track Everything** 📊 - Like having a notebook that remembers every conversation and message

---

## 🏗️ High-Level System Architecture

```mermaid
graph TB
    subgraph "User Interface Layer"
        Web[Web App - Next.js 14<br/>Property Search & Campaigns]
        Marketing[Marketing Site - Next.js 14<br/>Public Website]
        Mobile[Mobile Interface<br/>Responsive Design]
    end
    
    subgraph "Application Services Layer"
        Auth[Authentication Service<br/>Supabase Auth]
        API[API Gateway<br/>tRPC + REST]
        Cache[Caching Layer<br/>React Query + Redis]
        Files[File Storage<br/>Supabase Storage]
    end
    
    subgraph "Business Logic Layer"
        PropertyEngine[Property Search Engine<br/>Real Estate Data Processing]
        CampaignEngine[Campaign Engine<br/>Multi-Channel Orchestration]
        AnalyticsEngine[Analytics Engine<br/>Performance Tracking]
        JobProcessor[Background Jobs<br/>Trigger.dev Processing]
    end
    
    subgraph "Data Layer"
        Database[(Primary Database<br/>PostgreSQL + Supabase)]
        SearchIndex[(Search Index<br/>Property Data)]
        AuditLog[(Audit Logs<br/>User Actions)]
    end
    
    subgraph "External Systems"
        PropertyData[Real Estate API<br/>Property Data Source]
        VAPI[VAPI Service<br/>Voice AI Calls]
        Twilio[Twilio Service<br/>SMS & Voice]
        SendGrid[SendGrid Service<br/>Email Delivery]
        Stripe[Stripe Service<br/>Payments & Billing]
        N8N[N8N Workflows<br/>Automation Engine]
    end
    
    subgraph "Infrastructure Layer"
        Vercel[Vercel Platform<br/>Hosting & CDN]
        Monitoring[Monitoring<br/>Logs & Analytics]
        Security[Security Layer<br/>SSL & Firewall]
    end
    
    %% User Interface Connections
    Web --> Auth
    Web --> API
    Web --> Cache
    Marketing --> Auth
    Mobile --> API
    
    %% Application Services Connections
    Auth --> Database
    API --> PropertyEngine
    API --> CampaignEngine
    API --> AnalyticsEngine
    Cache --> Database
    Files --> Database
    
    %% Business Logic Connections
    PropertyEngine --> Database
    PropertyEngine --> SearchIndex
    PropertyEngine --> PropertyData
    CampaignEngine --> VAPI
    CampaignEngine --> Twilio
    CampaignEngine --> SendGrid
    CampaignEngine --> N8N
    AnalyticsEngine --> AuditLog
    JobProcessor --> PropertyData
    JobProcessor --> Database
    
    %% External System Connections
    Stripe --> Database
    N8N --> VAPI
    N8N --> Twilio
    N8N --> SendGrid
    
    %% Infrastructure Connections
    Web --> Vercel
    Marketing --> Vercel
    Database --> Monitoring
    API --> Security
```

---

## 🧩 Core System Components

### 🖥️ Frontend Applications Layer
**Like the pretty faces users see and interact with**

#### 1. **Main Web Application (`apps/web/`)**
- **Purpose**: User dashboard for property search and campaign management
- **Technology**: Next.js 14 with App Router
- **Key Features**:
  - Property search and filtering
  - Campaign creation and management
  - Integration configuration
  - Analytics dashboard
  - User account management

#### 2. **Marketing Website (`apps/marketing/`)**
- **Purpose**: Public-facing website for lead generation
- **Technology**: Next.js 14 static generation
- **Key Features**:
  - Landing pages
  - Pricing information
  - Feature demonstrations
  - Lead capture forms

#### 3. **Mobile Interface**
- **Purpose**: Responsive design for mobile users
- **Technology**: Progressive Web App (PWA)
- **Key Features**:
  - Touch-optimized interface
  - Offline capabilities
  - Push notifications

### 🛢️ Backend Services Layer
**Like the brain that remembers everything and does the hard work**

#### 1. **Authentication Service**
- **Technology**: Supabase Auth
- **Features**:
  - Email/password authentication
  - OAuth providers (Google, etc.)
  - Session management
  - Role-based access control

#### 2. **API Gateway**
- **Technology**: tRPC + Next.js API Routes
- **Features**:
  - Type-safe API endpoints
  - Request validation
  - Rate limiting
  - Error handling

#### 3. **Caching Layer**
- **Technology**: React Query + Redis
- **Features**:
  - Client-side caching
  - Server-side caching
  - Cache invalidation
  - Performance optimization

### ⚙️ Business Logic Layer
**Like the smart workers that understand your business**

#### 1. **Property Search Engine**
```mermaid
graph LR
    subgraph "Property Search Engine"
        A[Search Request] --> B[Query Builder]
        B --> C[Data Fetcher]
        C --> D[Result Processor]
        D --> E[Cache Manager]
        E --> F[Search Results]
        
        G[Filter Engine] --> B
        H[Location Service] --> B
        I[Asset Type Service] --> B
        
        C --> J[External Property API]
        C --> K[Local Database]
        
        L[Skip Trace Service] --> D
        M[Data Enrichment] --> D
    end
```

#### 2. **Campaign Engine**
```mermaid
graph TD
    subgraph "Campaign Engine"
        A[Campaign Request] --> B[Property Selection]
        B --> C[Channel Configuration]
        C --> D[Sequence Builder]
        D --> E[Message Generator]
        E --> F[Delivery Scheduler]
        
        G[VAPI Handler] --> F
        H[Twilio Handler] --> F
        I[SendGrid Handler] --> F
        
        F --> J[Status Tracker]
        J --> K[Analytics Collector]
        K --> L[Response Handler]
        
        M[Follow-up Engine] --> D
        N[A/B Testing] --> E
    end
```

#### 3. **Analytics Engine**
```mermaid
graph LR
    subgraph "Analytics Engine"
        A[Event Collector] --> B[Data Processor]
        B --> C[Metric Calculator]
        C --> D[Report Generator]
        
        E[Campaign Analytics] --> B
        F[User Analytics] --> B
        G[System Analytics] --> B
        
        H[Real-time Dashboard] --> C
        I[Historical Reports] --> D
        J[Predictive Analytics] --> D
    end
```

---

## 📊 Database Architecture

### 🗄️ Core Database Design

```mermaid
erDiagram
    %% User Management
    USERS ||--o{ ASSET_LICENSES : owns
    USERS ||--o{ CAMPAIGNS : creates
    USERS ||--o{ OUTBOUND_EVENTS : sends
    USERS ||--o{ INTEGRATION_CONFIGS : configures
    USERS ||--o{ SUBSCRIPTIONS : has
    
    %% Property Licensing System
    ASSET_LICENSES ||--o{ LOCATION_LICENSES : contains
    LOCATION_LICENSES ||--o{ PROPERTY_RECORDS : stores
    ASSET_TYPES ||--o{ ASSET_LICENSES : defines
    
    %% Campaign System
    CAMPAIGNS ||--o{ OUTBOUND_EVENTS : generates
    PROPERTY_RECORDS ||--o{ OUTBOUND_EVENTS : targets
    CAMPAIGNS ||--o{ CAMPAIGN_SEQUENCES : contains
    
    %% Payment System
    CUSTOMERS ||--|| USERS : links
    CUSTOMERS ||--o{ SUBSCRIPTIONS : has
    PRODUCTS ||--o{ PRICES : contains
    PRICES ||--o{ SUBSCRIPTIONS : priced_by
    
    %% VAPI System
    USERS ||--o{ VAPI_ASSISTANTS : configures
    VAPI_ASSISTANTS ||--o{ OUTBOUND_EVENTS : used_in
    
    USERS {
        uuid id PK
        text email
        text full_name
        user_role role
        text phone_number
        text crm_id
        jsonb billing_address
        timestamptz created_at
        timestamptz updated_at
    }
    
    ASSET_LICENSES {
        uuid id PK
        uuid user_id FK
        text asset_type_slug FK
        jsonb search_params
        boolean is_active
        timestamptz created_at
        timestamptz updated_at
    }
    
    LOCATION_LICENSES {
        uuid id PK
        uuid asset_license_id FK
        text location_internal_id
        text location_name
        location_type location_type
        text location_formatted
        text location_state
        integer result_count
        timestamptz expires_at
        boolean is_active
        timestamptz created_at
        timestamptz updated_at
    }
    
    PROPERTY_RECORDS {
        uuid id PK
        uuid location_license_id FK
        uuid asset_license_id FK
        uuid user_id FK
        text property_id
        text address
        text owner1_first_name
        text owner1_last_name
        text city
        text state
        text zip
        jsonb skip_trace_data
        timestamptz skip_trace_updated_at
        timestamptz created_at
        timestamptz updated_at
    }
    
    CAMPAIGNS {
        uuid id PK
        uuid user_id FK
        text name
        jsonb channels
        text[] record_ids
        text status
        jsonb results
        timestamptz created_at
        timestamptz updated_at
        timestamptz completed_at
    }
    
    OUTBOUND_EVENTS {
        uuid id PK
        uuid user_id FK
        uuid campaign_id FK
        text property_id
        outbound_channel channel
        text to_contact
        text status
        integer cost_cents
        jsonb payload
        text error
        timestamptz created_at
        timestamptz updated_at
    }
    
    INTEGRATION_CONFIGS {
        uuid id PK
        uuid user_id FK
        text provider
        jsonb config
        timestamptz created_at
        timestamptz updated_at
    }
    
    VAPI_ASSISTANTS {
        uuid id PK
        uuid user_id FK
        text name
        text vapi_assistant_id
        jsonb model_parameters
        jsonb voice_parameters
        text first_message
        text system_prompt
        boolean is_active
        timestamptz created_at
        timestamptz updated_at
    }
```

### 📋 Database Table Explanations

#### **👥 Users & Authentication**
- **`users`**: Core user profiles with role-based access
- **`customers`**: Stripe customer mapping for billing
- **`integration_configs`**: Third-party service configurations per user

#### **🏢 Property Management**
- **`asset_types`**: Types of properties (residential, commercial, restaurant)
- **`asset_licenses`**: User subscriptions to property types
- **`location_licenses`**: Specific geographic access permissions
- **`property_records`**: Individual property data with owner information

#### **📢 Campaign System**
- **`campaigns`**: Marketing campaign definitions
- **`outbound_events`**: Individual message sends across all channels
- **`vapi_assistants`**: AI voice assistant configurations

#### **💳 Billing & Subscriptions**
- **`products`**: Stripe product definitions
- **`prices`**: Pricing tiers and subscription options
- **`subscriptions`**: Active user subscriptions

---

## 🔄 System Data Flow

### 🎯 Property Search Flow
```mermaid
sequenceDiagram
    participant User
    participant WebApp
    participant API
    participant PropertyEngine
    participant Database
    participant ExternalAPI
    participant Cache
    
    User->>WebApp: Search for properties
    WebApp->>API: Submit search request
    API->>PropertyEngine: Process search parameters
    
    PropertyEngine->>Cache: Check cached results
    alt Cache Hit
        Cache-->>PropertyEngine: Return cached data
    else Cache Miss
        PropertyEngine->>Database: Query local properties
        PropertyEngine->>ExternalAPI: Fetch additional data
        ExternalAPI-->>PropertyEngine: Return property data
        PropertyEngine->>Cache: Store results
    end
    
    PropertyEngine-->>API: Return search results
    API-->>WebApp: Send property list
    WebApp-->>User: Display properties
```

### 📢 Campaign Creation Flow
```mermaid
sequenceDiagram
    participant User
    participant WebApp
    participant CampaignEngine
    participant Database
    participant VAPI
    participant Twilio
    participant SendGrid
    participant N8N
    
    User->>WebApp: Create campaign
    WebApp->>CampaignEngine: Submit campaign config
    CampaignEngine->>Database: Store campaign record
    
    loop For each property
        CampaignEngine->>Database: Get property owner info
        
        alt Voice Channel
            CampaignEngine->>VAPI: Schedule voice call
            VAPI-->>Database: Log call attempt
        end
        
        alt SMS Channel
            CampaignEngine->>Twilio: Send SMS message
            Twilio-->>Database: Log SMS status
        end
        
        alt Email Channel
            CampaignEngine->>SendGrid: Send email
            SendGrid-->>Database: Log email status
        end
    end
    
    CampaignEngine->>N8N: Setup follow-up sequences
    N8N->>N8N: Schedule future actions
    
    CampaignEngine-->>WebApp: Campaign initiated
    WebApp-->>User: Show campaign status
```

### 💰 Subscription & Billing Flow
```mermaid
sequenceDiagram
    participant User
    participant WebApp
    participant Stripe
    participant Database
    participant JobProcessor
    participant PropertyAPI
    
    User->>WebApp: Select property locations
    WebApp->>Stripe: Create checkout session
    Stripe-->>WebApp: Return payment URL
    WebApp-->>User: Redirect to payment
    
    User->>Stripe: Complete payment
    Stripe->>WebApp: Payment success webhook
    WebApp->>Database: Create license records
    WebApp->>JobProcessor: Queue property update job
    
    JobProcessor->>PropertyAPI: Fetch property data
    PropertyAPI-->>JobProcessor: Return property records
    JobProcessor->>Database: Store property data
    JobProcessor->>WebApp: Send completion notification
    
    WebApp-->>User: Data ready notification
```

---

## 🔐 Security Architecture

### 🛡️ Authentication & Authorization

```mermaid
graph TD
    subgraph "Authentication Layer"
        A[User Request] --> B{Authenticated?}
        B -->|No| C[Redirect to Login]
        B -->|Yes| D[Verify Session]
        D --> E{Valid Session?}
        E -->|No| C
        E -->|Yes| F[Check Permissions]
    end
    
    subgraph "Authorization Layer"
        F --> G{Has Permission?}
        G -->|No| H[Access Denied]
        G -->|Yes| I[Row Level Security]
        I --> J{Owns Resource?}
        J -->|No| H
        J -->|Yes| K[Grant Access]
    end
    
    subgraph "Data Security"
        K --> L[Encrypt Sensitive Data]
        L --> M[Audit Log Entry]
        M --> N[Return Response]
    end
```

### 🔒 Data Protection Layers

1. **Network Security**
   - HTTPS/TLS encryption for all traffic
   - API rate limiting and DDoS protection
   - Firewall rules and IP filtering

2. **Application Security**
   - Input validation and sanitization
   - SQL injection prevention
   - XSS protection with Content Security Policy

3. **Database Security**
   - Row Level Security (RLS) policies
   - Encrypted data at rest
   - Database connection pooling and timeouts

4. **API Security**
   - JWT token validation
   - API key encryption and rotation
   - Webhook signature verification

---

## 🚀 Performance & Scalability

### ⚡ Performance Optimization Strategy

```mermaid
graph LR
    subgraph "Client Performance"
        A[Code Splitting] --> B[Lazy Loading]
        B --> C[Image Optimization]
        C --> D[Bundle Optimization]
    end
    
    subgraph "Server Performance"
        E[Database Indexing] --> F[Query Optimization]
        F --> G[Connection Pooling]
        G --> H[Background Jobs]
    end
    
    subgraph "Network Performance"
        I[CDN Distribution] --> J[Edge Caching]
        J --> K[Compression]
        K --> L[HTTP/2 & HTTP/3]
    end
    
    subgraph "Caching Strategy"
        M[Browser Cache] --> N[CDN Cache]
        N --> O[Application Cache]
        O --> P[Database Cache]
    end
    
    A --> E
    E --> I
    I --> M
```

### 📈 Scalability Architecture

1. **Horizontal Scaling**
   - Stateless application design
   - Load balancing across multiple instances
   - Database read replicas
   - Microservices architecture

2. **Vertical Scaling**
   - Resource monitoring and auto-scaling
   - Performance profiling and optimization
   - Memory and CPU optimization

3. **Geographic Scaling**
   - Global CDN distribution
   - Regional data centers
   - Edge computing for reduced latency

---

## 🏗️ Deployment Architecture

### 🌐 Infrastructure Overview

```mermaid
graph TB
    subgraph "Production Environment"
        subgraph "Vercel Platform"
            A[Next.js Applications]
            B[Edge Functions]
            C[Static Assets]
        end
        
        subgraph "Supabase Cloud"
            D[PostgreSQL Database]
            E[Authentication Service]
            F[Storage Service]
        end
        
        subgraph "External Services"
            G[Trigger.dev Jobs]
            H[Third-party APIs]
            I[Monitoring Services]
        end
    end
    
    subgraph "Development Environment"
        J[Local Supabase]
        K[Local Next.js]
        L[Local N8N]
    end
    
    subgraph "CI/CD Pipeline"
        M[GitHub Repository]
        N[Automated Testing]
        O[Build Process]
        P[Deployment]
    end
    
    A --> D
    A --> E
    A --> G
    B --> H
    
    M --> N
    N --> O
    O --> P
    P --> A
    
    K --> J
    K --> L
```

### 🔄 Deployment Strategy

1. **Continuous Integration**
   - Automated testing on every commit
   - Code quality checks and linting
   - Security vulnerability scanning

2. **Continuous Deployment**
   - Automatic deployment to staging
   - Manual approval for production
   - Blue-green deployment strategy

3. **Monitoring & Observability**
   - Real-time error tracking
   - Performance monitoring
   - User analytics and behavior tracking

---

## 📊 System Monitoring

### 📈 Key Metrics Dashboard

```mermaid
graph LR
    subgraph "Application Metrics"
        A[Response Time] --> B[Error Rate]
        B --> C[Throughput]
        C --> D[User Sessions]
    end
    
    subgraph "Business Metrics"
        E[Campaign Success Rate] --> F[Property Search Volume]
        F --> G[User Engagement]
        G --> H[Revenue Metrics]
    end
    
    subgraph "Infrastructure Metrics"
        I[CPU Usage] --> J[Memory Usage]
        J --> K[Database Performance]
        K --> L[Network Latency]
    end
    
    subgraph "Integration Metrics"
        M[API Success Rate] --> N[Message Delivery]
        N --> O[Cost Tracking]
        O --> P[Rate Limits]
    end
```

### 🚨 Alerting Strategy

1. **Critical Alerts**
   - System downtime or major errors
   - Database connectivity issues
   - Payment processing failures

2. **Warning Alerts**
   - High response times
   - Increased error rates
   - API rate limit approaching

3. **Information Alerts**
   - Deployment notifications
   - Unusual traffic patterns
   - Scheduled maintenance

---

## 🎯 Summary

The CRE Finder AI system architecture is designed for:

- **🔄 Scalability**: Handle growing user base and data volume
- **🔒 Security**: Protect sensitive property and user data
- **⚡ Performance**: Fast response times and efficient processing
- **🔌 Integration**: Seamless connection with external services
- **📊 Observability**: Complete visibility into system health
- **🚀 Maintainability**: Clean, modular, and well-documented code

This architecture supports the core mission of enabling real estate professionals to find properties and automate their marketing outreach with sophisticated, multi-channel campaigns.
