# Westsidez - International Parcel Tracker

![Logo](client/public/logo.png)

A modern web application for tracking international parcels through Thailand Post API with real-time updates and comprehensive management features.

## Features

- 📦 **Parcel Tracking** - Track multiple international parcels with Thailand Post API integration
- 📊 **Dashboard** - Overview of all parcels with statistics and status summaries
- 🔄 **Real-time Updates** - Automatic status updates and live tracking timeline
- 📋 **Project Management** - Track projects with status and priority levels
- 📅 **Weekly Planning** - Plan and manage weekly tasks with day-by-day organization
- ⚙️ **Settings** - Configure API tokens and notification preferences
- 🎨 **Modern UI** - Clean, responsive design with green primary and red secondary theme
- 📱 **Mobile Friendly** - Optimized for iPhone and mobile devices

## Tech Stack

**Frontend:**
- React 19
- TypeScript
- Tailwind CSS 4
- shadcn/ui components
- Wouter (routing)
- tRPC (type-safe API)

**Backend:**
- Node.js + Express
- tRPC 11
- Drizzle ORM
- MySQL/TiDB compatible database

**External APIs:**
- Thailand Post Tracking API
- Supabase (optional)

## Quick Start

### Prerequisites

- Node.js 22+
- pnpm 10+
- MySQL/TiDB database or Supabase account

### Installation

```bash
# Clone the repository
git clone https://github.com/bank-spn/westz.git
cd westz

# Install dependencies
pnpm install

# Set up environment variables
# (See DEPLOYMENT.md for details)

# Push database schema
pnpm db:push

# Start development server
pnpm dev
```

The app will be available at `http://localhost:3000`

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions for:
- Vercel (Recommended)
- Netlify
- Self-hosting

## Database Setup

### Using Supabase

1. Import `supabase/schema.sql` to your Supabase project
2. See `supabase/README.md` for detailed setup instructions

### Using Other Databases

Any MySQL-compatible database works:
- Run migrations with `pnpm db:push`
- Configure `DATABASE_URL` in environment variables

## Project Structure

```
westsidez/
├── client/                 # Frontend React application
│   ├── public/            # Static assets
│   └── src/
│       ├── components/    # Reusable UI components
│       ├── pages/         # Page components
│       ├── lib/           # Utilities and configs
│       └── App.tsx        # Main app component
├── server/                # Backend Express + tRPC
│   ├── routers.ts         # API routes
│   ├── db.ts              # Database queries
│   └── thailandPost.ts    # Thailand Post API integration
├── drizzle/               # Database schema
│   └── schema.ts
├── supabase/              # Supabase setup (optional)
│   ├── schema.sql
│   └── README.md
└── shared/                # Shared types and constants
```

## Available Scripts

```bash
# Development
pnpm dev          # Start dev server

# Building
pnpm build        # Build for production
pnpm start        # Start production server

# Database
pnpm db:push      # Push schema changes to database

# Testing
pnpm test         # Run tests
pnpm check        # TypeScript type checking

# Code Quality
pnpm format       # Format code with Prettier
```

## Features Guide

### Dashboard
- View statistics: Total parcels, Delivered, In Transit, Customs Clearance
- See recent parcels with quick status overview
- Real-time updates when parcel status changes

### Parcel Management
- Add new parcels with tracking number and details
- Edit parcel information
- Delete parcels
- Refresh status from Thailand Post API
- View complete tracking timeline by clicking on parcel card

### Project Tracker
- Create and manage projects
- Set status: Planning, In Progress, Completed, On Hold
- Set priority: Low, Medium, High, Urgent
- Track start and end dates

### Weekly Plan
- Plan tasks for each day of the week
- Set time ranges for tasks
- Mark tasks as completed
- Navigate between weeks

### Settings
- Configure Thailand Post API token
- Test API connection status
- Enable/disable notifications
- Configure Supabase connection (optional)

## Environment Variables

See [DEPLOYMENT.md](DEPLOYMENT.md) for complete environment variables reference.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT

## Support

For issues or questions:
- Open an issue on GitHub
- Check [DEPLOYMENT.md](DEPLOYMENT.md) for deployment help
- Review [supabase/README.md](supabase/README.md) for database setup

---

**Made with ❤️ for West Side Cannabis Phuket**
