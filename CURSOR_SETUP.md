# Cursor Setup Instructions for Monorepo Project

## Project Overview
This is a monorepo project using workspace dependencies with Bun as the package manager. The project contains multiple packages that reference each other using the `workspace:*` protocol.

## Prerequisites
1. **Install Bun**: This project requires Bun as the package manager.
   ```bash
   curl -fsSL https://bun.sh/install | bash
   ```
   Restart your terminal after installation.

2. **Install Node.js**: If not already installed, download from [nodejs.org](https://nodejs.org/)

## Cursor Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd <project-directory>
```

### 2. Install Dependencies
⚠️ **Important**: Do NOT use `npm install` for this project.

```bash
# Install root dependencies
bun install

# Install dependencies for all apps/packages
bun install --frozen-lockfile
```

### 3. Configure Cursor Settings

Create a `.vscode/settings.json` file with the following configuration:

```json
{
  "npm.packageManager": "bun",
  "terminal.integrated.defaultProfile.linux": "bash",
  "terminal.integrated.profiles.linux": {
    "bash": {
      "path": "bash",
      "args": ["-l"]
    }
  },
  "typescript.preferences.preferTypeOnlyAutoImports": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

### 4. Recommended Extensions
Install these extensions in Cursor:
- **Bun** (by Oven)
- **ESLint**
- **Prettier - Code formatter**
- **TypeScript Vue Plugin (Volar)** (if using Vue)
- **Tailwind CSS IntelliSense** (if using Tailwind)

## Development Workflow

### Starting Development Servers
```bash
# Start the web app
cd apps/web && bun run dev

# Start other apps as needed
cd apps/other-app && bun run dev
```

### Adding Dependencies
```bash
# Add a dependency to a specific package
cd packages/ui && bun add <package-name>

# Add a dev dependency
cd packages/ui && bun add -D <dev-package-name>

# Add to workspace
bun add <package-name> --workspace=apps/web
```

### Building the Project
```bash
# Build all packages
bun run build

# Build specific app
cd apps/web && bun run build
```

## Common Pitfalls & Solutions

### ❌ Error: "Unsupported URL Type 'workspace:'"
**Cause**: Using `npm install` instead of `bun install`
**Solution**: Always use `bun install` for this project

### ❌ Error: "Command not found: bun"
**Cause**: Bun is not installed or not in PATH
**Solution**: Install Bun and restart your terminal

### ❌ Error: "Cannot find module '@v1/ui'"
**Cause**: Dependencies not installed properly
**Solution**: Run `bun install` from the project root

### ❌ Error: "Failed to resolve entry for package '@v1/ui'"
**Cause**: Missing build step
**Solution**: Run `bun run build` from the project root

## Troubleshooting

### Resetting the Environment
If you encounter persistent issues:

```bash
# Remove node_modules and lock files
find . -name "node_modules" -type d -exec rm -rf {} +
find . -name "*.lock" -delete

# Reinstall dependencies
bun install
```

### Verifying Setup
```bash
# Check Bun version
bun --version

# Check if dependencies are properly linked
bun run ls
```

## Project Structure
```
project-root/
├── apps/               # Applications
│   ├── web/           # Web application
│   └── admin/         # Admin panel
├── packages/          # Shared packages
│   ├── ui/            # UI components
│   ├── utils/         # Utility functions
│   └── config/        # Shared configurations
├── package.json       # Root package configuration
└── bun.lockb          # Lock file (Bun format)
```

## Additional Resources
- [Bun Documentation](https://bun.sh/docs)
- [Workspace Dependencies in Bun](https://bun.sh/docs/cli/install#workspace-dependencies)
- [Monorepo Best Practices](https://bun.sh/guides/ecosystem/monorepo)

Remember: Always use `bun` instead of `npm` for this project to avoid workspace protocol errors!
