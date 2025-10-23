# Quick Start Guide

Get your Friendsgiving Coordinator running in 5 minutes.

## Prerequisites

- Node.js 18+ installed
- Anthropic API key ([get one here](https://console.anthropic.com))
- Netlify CLI installed: `npm install -g netlify-cli`

## Local Development

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variable
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY

# 3. Start development server with Netlify CLI
netlify dev

# App will be available at http://localhost:8888
```

## Test the App

1. **Open** http://localhost:8888
2. **Click** "Guest Signup"
3. **Fill out** the form (use any name/email, select cooking skill)
4. **Get** AI-powered recipe suggestions
5. **Claim** a dish by clicking "Claim This Dish"
6. **View** the dashboard at http://localhost:8888/dashboard
7. **See** your guest and dish appear with category balance

## Deploy to Netlify

### Option 1: Via Git (Recommended)

```bash
# 1. Initialize git and push to GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo-url>
git push -u origin main

# 2. Go to https://app.netlify.com
# 3. Click "Add new site" → "Import an existing project"
# 4. Select your repository
# 5. Set environment variable: ANTHROPIC_API_KEY
# 6. Deploy!
```

### Option 2: Via CLI

```bash
# 1. Login to Netlify
netlify login

# 2. Initialize and deploy
netlify init
netlify env:set ANTHROPIC_API_KEY your_actual_key_here
netlify deploy --prod
```

## Common Issues

**Q: Getting "ANTHROPIC_API_KEY not configured" error?**
A: Make sure you created `.env` file with your API key and restarted the dev server.

**Q: Blob storage errors in local dev?**
A: Use `netlify dev` instead of `npm run dev`. Netlify CLI provides blob storage emulation.

**Q: Recipe suggestions not working?**
A: Verify your Anthropic API key is valid and has available credits.

## What's Next?

- Customize event settings (see README.md)
- Add more guests and test dish balance
- Consider adding Netlify Identity for password protection
- Set up a custom domain

See [README.md](README.md) for complete documentation.
See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.
