# Friendsgiving Coordinator

A beautiful, AI-powered web app to coordinate your Friendsgiving dinner. Guests can sign up, get personalized recipe suggestions based on their cooking skills, and claim dishes. The app features a modern, homely design with warm autumn colors and an intuitive interface.

## Features

- **Password-Protected Access**: Separate guest and admin passwords for security
- **Beautiful Invitation Landing Page**: Warm, welcoming design with event details
- **Phone-Based RSVP System**:
  - Use phone numbers instead of emails for easy tracking
  - Look up existing RSVPs to view/edit responses
  - Partner tracking (guests can indicate if bringing a +1)
- **Smart Recipe Suggestions**: AI-powered suggestions using Anthropic's Claude, tailored to:
  - Guest's cooking skill level (beginner/intermediate/advanced)
  - Dietary restrictions
  - Current dish balance (suggests categories that need more coverage)
  - Full recipes with ingredients and step-by-step instructions
- **Flexible Dish Selection**:
  - Claim AI-suggested recipes with full cooking instructions
  - Add your own specialty dishes
  - Claim multiple dishes if you want to contribute more
  - Load more suggestions for different recipe options
  - **"Claim Later" SMS Reminders**: Schedule a text reminder to claim dishes later (configurable delay)
- **Guest Dashboard**: Real-time overview of:
  - All claimed dishes and their recipes
  - Colorful menu balance indicators
  - Complete guest list (with privacy - no phone numbers shown)
  - Total guest count includes partners
- **Admin Dashboard**: Manage the entire event:
  - Edit and delete guests and dishes
  - View phone numbers and partner status
  - Update event details (date, location, guest count, SMS reminder delay)
  - Monitor dish category balance
  - View all participants
- **Automated SMS Reminders**:
  - Twilio integration for sending text reminders
  - Configurable delay (default: 24 hours)
  - Automatic hourly cron job checks for pending reminders

## Tech Stack

- **Next.js 14+** with TypeScript and App Router
- **Netlify Blobs** for simple JSON-based data storage
- **Anthropic API (Claude 3.5 Sonnet)** for intelligent recipe suggestions
- **Twilio API** for SMS reminders
- **Netlify Scheduled Functions** for automated reminder sending
- **Tailwind CSS** with custom color palette for styling
- **Google Fonts** (Playfair Display & Inter) for typography
- **Lucide React** for modern icons
- **Edge Functions** for fast, serverless API routes
- **Middleware-based Authentication** for route protection

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Anthropic API key (get one at [https://console.anthropic.com](https://console.anthropic.com))
- Twilio account with phone number (get one at [https://www.twilio.com](https://www.twilio.com)) - **Optional** for SMS reminders
- Netlify account (free tier works great)

### Local Development

1. **Clone and install dependencies:**

```bash
git clone <your-repo-url>
cd friendsgiving
npm install
```

2. **Set up environment variables:**

```bash
cp .env.example .env
```

Edit `.env` and add your API keys and passwords:

```
ANTHROPIC_API_KEY=your_actual_api_key_here
GUEST_PASSWORD=your_guest_password_here
ADMIN_PASSWORD=your_admin_password_here

# Optional - For SMS reminders
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+15551234567
CRON_SECRET=your_random_secret_string
NEXT_PUBLIC_APP_URL=http://localhost:8888
```

3. **Install Netlify CLI (for local blob storage emulation):**

```bash
npm install -g netlify-cli
```

4. **Run the development server:**

```bash
netlify dev
```

The app will be available at `http://localhost:8888`

**Note:** Local development with Netlify Blobs requires the Netlify CLI. The `netlify dev` command provides blob storage emulation.

## Deployment to Netlify

### Option 1: Deploy via Git (Recommended)

1. **Push your code to GitHub/GitLab/Bitbucket**

2. **Connect to Netlify:**
   - Go to [Netlify](https://app.netlify.com)
   - Click "Add new site" -> "Import an existing project"
   - Connect your Git provider and select the repository
   - Netlify will auto-detect Next.js settings

3. **Configure environment variables:**
   - In your site dashboard, go to "Site settings" -> "Environment variables"
   - **Required:**
     - `ANTHROPIC_API_KEY`: Your Anthropic API key
     - `GUEST_PASSWORD`: Password for guest access
     - `ADMIN_PASSWORD`: Password for admin access
   - **Optional (for SMS reminders):**
     - `TWILIO_ACCOUNT_SID`: Your Twilio Account SID
     - `TWILIO_AUTH_TOKEN`: Your Twilio Auth Token
     - `TWILIO_PHONE_NUMBER`: Your Twilio phone number (e.g., +15551234567)
     - `CRON_SECRET`: Random secret string to secure the cron endpoint
     - `NEXT_PUBLIC_APP_URL`: Your deployed app URL (e.g., https://your-app.netlify.app)

4. **Deploy:**
   - Click "Deploy site"
   - Netlify will build and deploy automatically
   - Future git pushes will trigger automatic deployments

### Option 2: Deploy via Netlify CLI

1. **Login to Netlify:**

```bash
netlify login
```

2. **Initialize site:**

```bash
netlify init
```

Follow the prompts to create a new site or link to an existing one.

3. **Set environment variable:**

```bash
netlify env:set ANTHROPIC_API_KEY your_actual_api_key_here

... contine for other environment variables ...
```

4. **Deploy:**

```bash
netlify deploy --prod
```

## Using the App

### For Guests

1. **Access the site**: Navigate to the home page and enter the guest password
2. **View the invitation**: See the beautiful event details (date, location, expected guests)
3. **RSVP Options**:
   - **New RSVP**: Click "RSVP & Choose Your Dish"
   - **Existing RSVP**: Click "View/Edit Your RSVP" and enter your phone number
4. **Fill out your info** (new RSVP):
   - Your name and phone number (numbers only)
   - Select your cooking skill level (beginner/intermediate/advanced)
   - Add any dietary restrictions (optional)
   - Check "I'd like to bring my partner" if bringing a +1
5. **Get suggestions**: AI will generate personalized recipe suggestions
6. **Browse options**:
   - View full recipes with ingredients and instructions
   - Click "Load More" for different suggestions
   - Click "Bring Your Own Specialty Dish" to add your own
   - Click "Claim Later (Get SMS Reminder)" to get a text reminder to choose later
7. **Claim dishes**: Click "Claim This" on recipes you want to make
8. **Claim multiple**: You can claim as many dishes as you'd like!
9. **View your recipes**: Access full cooking instructions for all claimed dishes

### For Admins

1. **Access admin panel**: Click "Host dashboard" and enter the admin password
2. **Manage the event**:
   - **Edit event details**: Update date, location, guest count, or SMS reminder delay
   - **Manage guests**: Edit names, phone numbers, skills, partner status, or delete guests
   - **Manage dishes**: Edit dish details or remove dishes
   - **Monitor balance**: See colorful progress bars for each category
     - Green: Category goal met
     - Orange: Halfway there
     - Blue: Needs more dishes
3. **View complete data**:
   - All guests with their phone numbers, partner status, and claimed status
   - All dishes with guest names, and categories
4. **Configure SMS reminders**:
   - Set the reminder delay in hours (default: 24 hours)
   - Guests who click "Claim Later" will receive a text reminder after this delay

### Configuring the Event

Event configuration can be managed in two ways:

#### Via Admin Dashboard (Recommended)
1. Log in to the admin panel with your admin password
2. Click "Edit Event Details"
3. Update date, location, or guest count
4. Changes are saved immediately

#### Via Direct Blob Storage (Advanced)
The event config is stored in Netlify Blobs with the key `"event-config"`:

```typescript
{
  "date": "2024-11-28T00:00:00.000Z",
  "location": "123 Harvest Lane, Oakland, CA",
  "target_guest_count": 20,
  "reminder_delay_hours": 24,
  "category_targets": {
    "appetizer": 3,
    "main": 2,
    "side": 4,
    "dessert": 3,
    "beverage": 2
  }
}
```

To modify via CLI:
1. Access your Netlify site's blob storage via the Netlify CLI
2. Update the `event-config` blob with your desired values
3. The dashboard will automatically reflect the new targets

## Data Storage

This app uses Netlify Blobs for data persistence. Data is stored as JSON blobs:

- **`guests`**: Array of guest objects (with phone numbers and partner status)
- **`dishes`**: Array of dish objects
- **`event-config`**: Event configuration object (includes reminder delay)
- **`pending-reminders`**: Array of scheduled SMS reminders

Netlify Blobs provides:
- **Strong consistency**: Reads reflect the latest writes
- **Automatic backups**: Built into Netlify infrastructure
- **No database setup**: Works out of the box on Netlify
- **Free tier**: Generous limits for small events

### SMS Reminder System

The app uses Twilio for sending SMS reminders and Netlify Scheduled Functions for automation:

1. **Guest clicks "Claim Later"**: A reminder is scheduled based on the configured delay
2. **Scheduled function runs hourly**: Checks for pending reminders that are due
3. **SMS sent via Twilio**: Guests receive a text with a link to claim their dish
4. **Reminder marked as sent**: Prevents duplicate messages

The cron job is configured in `netlify.toml` to run every hour automatically.

## Customization

### Changing Dish Categories

Edit [types/index.ts](types/index.ts):
```typescript
export type DishCategory = 'appetizer' | 'main' | 'side' | 'dessert' | 'beverage' | 'bread';
```

Then update the default event config in [lib/storage.ts](lib/storage.ts) to include targets for new categories.

### Adjusting Recipe Suggestion Logic

The AI prompt in [app/api/suggest-recipes/route.ts](app/api/suggest-recipes/route.ts) can be customized to change how recipes are suggested. Modify the prompt to emphasize different criteria or change the response format.
