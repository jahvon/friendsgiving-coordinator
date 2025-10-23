# Deployment Checklist

Quick checklist for deploying your Friendsgiving Coordinator to Netlify.

## Pre-Deployment

- [ ] Have a Netlify account (sign up at https://netlify.com)
- [ ] Have an Anthropic API key (get one at https://console.anthropic.com)
- [ ] Code is pushed to a Git repository (GitHub, GitLab, or Bitbucket)

## Deploy Steps

### 1. Connect Repository to Netlify

1. Log in to Netlify
2. Click "Add new site" → "Import an existing project"
3. Choose your Git provider
4. Select your repository
5. Netlify will auto-detect Next.js settings

### 2. Configure Build Settings

Netlify should automatically detect:
- **Build command:** `npm run build`
- **Publish directory:** `.next`
- **Functions directory:** Auto-detected

If not, set these manually.

### 3. Set Environment Variables

In Netlify dashboard → Site settings → Environment variables:

Add the following variable:

| Key | Value |
|-----|-------|
| `ANTHROPIC_API_KEY` | Your Anthropic API key |

### 4. Deploy

Click "Deploy site"

Netlify will:
1. Install dependencies
2. Build your Next.js app
3. Deploy Edge Functions
4. Set up Netlify Blobs automatically
5. Generate a URL (e.g., `your-site-name.netlify.app`)

### 5. Verify Deployment

1. Visit your deployed URL
2. Test the signup flow:
   - Go to /signup
   - Fill out the guest form
   - Verify you get AI recipe suggestions
   - Claim a dish
3. Test the dashboard:
   - Go to /dashboard
   - Verify you see the guest and dish you just created
   - Check that category balance shows correctly

## Post-Deployment

### Custom Domain (Optional)

1. In Netlify dashboard → Domain settings
2. Add custom domain
3. Follow DNS configuration instructions

### Configure Event Details

The app initializes with default event settings. To customize:

1. Use Netlify CLI to update blob storage:
```bash
netlify blobs:set friendsgiving-data event-config '{"date":"2024-11-28T18:00:00.000Z","location":"123 Main St","target_guest_count":25,"category_targets":{"appetizer":3,"main":2,"side":5,"dessert":3,"beverage":2}}'
```

Or create a temporary admin page to update event settings (not included in this basic version).

### Monitor Usage

- Check Netlify Blobs usage in dashboard (free tier is generous)
- Monitor Anthropic API usage in Anthropic console
- Review Netlify function logs for any errors

## Troubleshooting Deployment

### Build Fails

1. Check build logs in Netlify dashboard
2. Verify all dependencies are in package.json
3. Ensure Node.js version is 18+ (set in Netlify build settings if needed)

### API Errors After Deploy

1. Verify `ANTHROPIC_API_KEY` is set correctly in environment variables
2. Check function logs in Netlify dashboard
3. Ensure Netlify Blobs is enabled (automatic on new sites)

### Data Not Persisting

1. Verify you're accessing the deployed URL (not localhost)
2. Check Netlify Blobs is active in site dashboard
3. Review function logs for blob operation errors

## Security Notes

- Never commit `.env` file or expose API keys
- All API calls happen server-side via Edge Functions
- Consider enabling Netlify Identity for production use (see README.md)

## Continuous Deployment

Once connected to Git:
- Every push to main branch triggers automatic deployment
- Pull requests can create deploy previews (configure in Netlify settings)
- Rollback to previous deployments via Netlify dashboard if needed

## Support

If deployment fails:
1. Check this checklist
2. Review Netlify build logs
3. See README.md troubleshooting section
4. Contact Netlify support or open an issue
