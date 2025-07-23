# n8n Automation Platform

This directory contains the dockerized n8n instance for workflow automation.

## Quick Start

```bash
# Initial setup (recommended for first time)
bun run setup

# Or start n8n directly
bun run dev

# View logs
bun run logs

# Stop n8n
bun run stop

# Restart n8n
bun run restart

# Clean up (removes containers and volumes)
bun run clean

# Additional commands
bun run status        # Check container status
bun run health        # Health check
bun run shell         # Access n8n container shell
bun run backup        # Backup workflows
bun run restore       # Restore workflows
```

## Access

- **n8n Interface**: http://localhost:5678
- **Webhooks**: http://localhost:5678/webhook/

## Configuration

1. Copy `.env.example` to `.env` and customize as needed
2. The default configuration runs n8n in development mode with user management disabled
3. For production, enable authentication and use a proper database

## Directory Structure

- `workflows/` - n8n workflow files (auto-created)
- `credentials/` - n8n credential files (auto-created)
- `docker-compose.yml` - Docker configuration
- `.env.example` - Environment variables template

## Database

By default, n8n uses SQLite. To use PostgreSQL:

1. Uncomment the postgres service in `docker-compose.yml`
2. Uncomment the database environment variables in `.env`
3. Restart the containers

## Security Notes

- The default configuration disables authentication for development
- For production, set `N8N_BASIC_AUTH_ACTIVE=true` and configure credentials
- Consider using HTTPS in production environments

## Integration with CRE Finder

This n8n instance can be used to automate workflows related to:
- Property data processing
- Email notifications
- API integrations
- Data synchronization
- Webhook handling

### 🚀 Outbound Real Estate System

A complete outbound marketing system is included that integrates:
- **Twilio**: Voice calls and SMS messaging
- **ElevenLabs**: AI-generated voice content
- **OpenAI**: Personalized content generation
- **Loops.so**: Professional email campaigns

**Quick Start:**
```bash
# See detailed setup guide
cat OUTBOUND_SETUP.md

# Test the system
bun run test:outbound
```

**Workflow Features:**
- Automated voice calls with AI-generated scripts
- Follow-up SMS messages
- Personalized email campaigns
- Complete lead tracking and analytics

## Troubleshooting

- Check logs: `bun run logs`
- Restart services: `bun run restart`
- Clean reset: `bun run clean && bun run dev`
