# Supabase Setup Guide

## Prerequisites
- Supabase Project: **Westz**
- Supabase URL: `https://shislvyommsbeiejrwzq.supabase.co`

## Step 1: Import Schema

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/shislvyommsbeiejrwzq
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy and paste the contents of `schema.sql`
5. Click **Run** to execute the SQL

This will create:
- All tables (parcels, projects, weekly_plans, settings)
- Indexes for performance
- Triggers for auto-updating timestamps
- Row Level Security policies
- Realtime subscriptions

## Step 2: Verify Tables

1. Go to **Table Editor** in your Supabase Dashboard
2. You should see these tables:
   - `parcels`
   - `projects`
   - `weekly_plans`
   - `settings`

## Step 3: Enable Realtime (if not already enabled)

1. Go to **Database** → **Replication**
2. Find each table and toggle **Realtime** to ON:
   - parcels
   - projects
   - weekly_plans
   - settings

## Step 4: Configure Environment Variables

The app is already configured with your Supabase credentials:
- `VITE_SUPABASE_URL`: https://shislvyommsbeiejrwzq.supabase.co
- `VITE_SUPABASE_ANON_KEY`: (already set in code)

## Features Enabled

### Row Level Security (RLS)
All tables have RLS enabled with permissive policies (allow all operations).
You can restrict access later by modifying the policies in the SQL Editor.

### Realtime Updates
All tables are configured for real-time subscriptions, allowing the app to:
- Auto-refresh parcel status
- Live update project changes
- Sync weekly plans across devices

### Auto-Timestamps
All tables automatically update their `updated_at` field when modified.

## Optional: Edge Functions

If you want to add server-side logic (e.g., scheduled parcel status checks), you can create Edge Functions:

1. Install Supabase CLI: `npm install -g supabase`
2. Login: `supabase login`
3. Link project: `supabase link --project-ref shislvyommsbeiejrwzq`
4. Create function: `supabase functions new function-name`
5. Deploy: `supabase functions deploy function-name`

## Troubleshooting

### Tables not appearing
- Make sure you ran the entire `schema.sql` file
- Check for errors in the SQL Editor output

### Realtime not working
- Verify Realtime is enabled for each table in Database → Replication
- Check that RLS policies allow read access

### Connection errors
- Verify your Supabase URL and Anon Key are correct
- Check that your project is not paused (free tier projects pause after inactivity)
