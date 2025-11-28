# Deployment Guide

## Westsidez - International Parcel Tracker

This guide will help you deploy the application to Vercel or Netlify.

---

## Prerequisites

1. **GitHub Account** - Code must be pushed to GitHub first
2. **Vercel or Netlify Account** - Free tier is sufficient
3. **Database** - Choose one:
   - Supabase (Recommended - Free tier available)
   - MySQL/TiDB compatible database
   - PlanetScale
   - Railway

---

## Option 1: Deploy to Vercel (Recommended)

### Step 1: Push to GitHub

```bash
git remote add origin https://github.com/bank-spn/westz.git
git branch -M main
git push -u origin main
```

### Step 2: Import to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New Project"**
3. Import your GitHub repository: `bank-spn/westz`
4. Vercel will auto-detect the configuration

### Step 3: Configure Environment Variables

Add these environment variables in Vercel dashboard:

**Required:**
```
DATABASE_URL=your_database_connection_string
```

**Optional (for Supabase):**
```
VITE_SUPABASE_URL=https://shislvyommsbeiejrwzq.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Optional (for Thailand Post API):**
```
THAILAND_POST_API_TOKEN=your_token_here
```

### Step 4: Deploy

Click **"Deploy"** and wait for the build to complete.

Your app will be live at: `https://your-project.vercel.app`

---

## Option 2: Deploy to Netlify

### Step 1: Push to GitHub

```bash
git remote add origin https://github.com/bank-spn/westz.git
git branch -M main
git push -u origin main
```

### Step 2: Import to Netlify

1. Go to [netlify.com](https://netlify.com)
2. Click **"Add new site" → "Import an existing project"**
3. Connect to GitHub and select `bank-spn/westz`

### Step 3: Build Settings

Netlify will auto-detect from `netlify.toml`:
- **Build command:** `pnpm build`
- **Publish directory:** `dist/client`

### Step 4: Configure Environment Variables

Add the same environment variables as Vercel (see above).

### Step 5: Deploy

Click **"Deploy site"** and wait for the build.

Your app will be live at: `https://your-site.netlify.app`

---

## Database Setup

### Using Supabase (Recommended)

1. Create account at [supabase.com](https://supabase.com)
2. Create new project: **Westz**
3. Go to **SQL Editor**
4. Run the SQL from `supabase/schema.sql`
5. Copy your connection string:
   - Go to **Project Settings → Database**
   - Copy **Connection string** (URI mode)
   - Use as `DATABASE_URL`

### Using Other Databases

Any MySQL-compatible database will work:
- PlanetScale
- Railway
- AWS RDS
- DigitalOcean Managed Database

Just provide the connection string as `DATABASE_URL`.

---

## Post-Deployment

### 1. Run Database Migrations

If using the built-in database schema:
```bash
pnpm db:push
```

If using Supabase:
- Import `supabase/schema.sql` via Supabase Dashboard

### 2. Test the Application

1. Visit your deployed URL
2. Try adding a parcel
3. Test Thailand Post API integration
4. Verify realtime updates (if using Supabase)

### 3. Custom Domain (Optional)

**Vercel:**
- Go to **Settings → Domains**
- Add your custom domain
- Update DNS records as instructed

**Netlify:**
- Go to **Domain settings**
- Add custom domain
- Follow DNS configuration steps

---

## Troubleshooting

### Build Fails

**Error: "Cannot find module"**
- Make sure all dependencies are in `package.json`
- Run `pnpm install` locally to verify

**Error: "Database connection failed"**
- Verify `DATABASE_URL` is set correctly
- Check database is accessible from the internet

### Runtime Errors

**Error: "API calls failing"**
- Check environment variables are set
- Verify API tokens are valid

**Error: "Thailand Post API not working"**
- Default token may have expired
- Set custom `THAILAND_POST_API_TOKEN`

---

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | Database connection string |
| `VITE_SUPABASE_URL` | No | Supabase project URL (if using Supabase) |
| `VITE_SUPABASE_ANON_KEY` | No | Supabase anon key (if using Supabase) |
| `THAILAND_POST_API_TOKEN` | No | Thailand Post API token (uses default if not set) |
| `JWT_SECRET` | No | Session secret (auto-generated if not set) |

---

## Support

For issues or questions:
1. Check the logs in Vercel/Netlify dashboard
2. Review `supabase/README.md` for database setup
3. Open an issue on GitHub

---

## License

MIT
