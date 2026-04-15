# Deployment Guide

This guide will walk you through deploying the Trello Clone application to production.

## Prerequisites

- Supabase account (for PostgreSQL database)
- Render account (for backend API)
- Vercel account (for frontend)
- Git repository (GitHub, GitLab, or Bitbucket)

## Step 1: Database Setup (Supabase)

### 1.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Fill in project details:
   - Name: `trello-clone`
   - Database Password: (generate a strong password)
   - Region: Choose closest to your users
4. Wait for project to be created (~2 minutes)

### 1.2 Run Database Migrations

1. In your Supabase project, go to "SQL Editor"
2. Click "New Query"
3. Copy the entire contents of `backend/database/schema.sql`
4. Paste and click "Run"
5. Wait for completion (should see "Success" message)

### 1.3 Seed Database

1. Create another new query
2. Copy contents of `backend/database/seed.sql`
3. Paste and click "Run"
4. Verify data by going to "Table Editor" and checking tables

### 1.4 Get Connection String

1. Go to "Project Settings" → "Database"
2. Scroll to "Connection string" section
3. Select "URI" tab
4. Copy the connection string (it looks like: `postgresql://postgres:[YOUR-PASSWORD]@...`)
5. Save this for later use

## Step 2: Backend Deployment (Render)

### 2.1 Prepare Repository

1. Push your code to GitHub/GitLab/Bitbucket
2. Ensure `backend/` directory is in the repository

### 2.2 Create Web Service

1. Go to [render.com](https://render.com) and sign in
2. Click "New +" → "Web Service"
3. Connect your repository
4. Configure the service:
   - **Name**: `trello-clone-api`
   - **Region**: Choose closest to your users
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free (or paid for better performance)

### 2.3 Set Environment Variables

In the "Environment" section, add:

```
PORT=5000
DATABASE_URL=your_supabase_connection_string_here
NODE_ENV=production
```

Replace `your_supabase_connection_string_here` with the connection string from Step 1.4

### 2.4 Deploy

1. Click "Create Web Service"
2. Wait for deployment (~3-5 minutes)
3. Once deployed, copy the service URL (e.g., `https://trello-clone-api.onrender.com`)
4. Test by visiting `https://your-service-url.onrender.com/health`

## Step 3: Frontend Deployment (Vercel)

### 3.1 Prepare Frontend

1. Ensure `frontend/` directory is in your repository
2. Create `.env.local` file in frontend directory (for local testing):

```env
NEXT_PUBLIC_API_URL=https://your-render-service-url.onrender.com
```

### 3.2 Deploy to Vercel

#### Option A: Using Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Navigate to frontend directory:
```bash
cd frontend
```

3. Deploy:
```bash
vercel
```

4. Follow the prompts:
   - Set up and deploy? `Y`
   - Which scope? (select your account)
   - Link to existing project? `N`
   - Project name: `trello-clone`
   - Directory: `./`
   - Override settings? `N`

5. Set environment variable:
```bash
vercel env add NEXT_PUBLIC_API_URL
```
Enter your Render backend URL when prompted.

6. Deploy to production:
```bash
vercel --prod
```

#### Option B: Using Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New..." → "Project"
3. Import your Git repository
4. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)

5. Add Environment Variables:
   - Key: `NEXT_PUBLIC_API_URL`
   - Value: Your Render backend URL (e.g., `https://trello-clone-api.onrender.com`)

6. Click "Deploy"
7. Wait for deployment (~2-3 minutes)

### 3.3 Verify Deployment

1. Visit your Vercel URL (e.g., `https://trello-clone.vercel.app`)
2. You should see the boards page
3. Try creating a board and adding lists/cards

## Step 4: Configure CORS (Backend)

If you encounter CORS errors:

1. Go to your Render dashboard
2. Select your backend service
3. Go to "Environment" tab
4. Add environment variable:
   - Key: `ALLOWED_ORIGINS`
   - Value: Your Vercel frontend URL

5. Update `backend/src/server.js` to use this:

```javascript
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS || '*'
}));
```

6. Redeploy the backend

## Step 5: Custom Domain (Optional)

### Frontend (Vercel)

1. In Vercel dashboard, go to your project
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

### Backend (Render)

1. In Render dashboard, go to your service
2. Click "Settings" → "Custom Domain"
3. Add your custom domain
4. Update DNS records as instructed

## Troubleshooting

### Database Connection Issues

- Verify connection string is correct
- Check if Supabase project is active
- Ensure IP allowlist includes Render's IPs (usually not needed)

### Backend Not Starting

- Check Render logs: Dashboard → Service → Logs
- Verify all environment variables are set
- Ensure `package.json` has correct start script

### Frontend API Errors

- Verify `NEXT_PUBLIC_API_URL` is set correctly
- Check browser console for CORS errors
- Test backend health endpoint directly

### Slow Performance (Free Tier)

- Render free tier spins down after inactivity
- First request may take 30-60 seconds
- Consider upgrading to paid tier for production

## Monitoring

### Backend (Render)

- View logs: Dashboard → Service → Logs
- Monitor metrics: Dashboard → Service → Metrics
- Set up alerts in Render dashboard

### Frontend (Vercel)

- View deployment logs: Dashboard → Project → Deployments
- Monitor analytics: Dashboard → Project → Analytics
- Check function logs for API routes

### Database (Supabase)

- Monitor usage: Dashboard → Database → Usage
- View logs: Dashboard → Database → Logs
- Set up database backups

## Scaling Considerations

### Database

- Monitor connection pool usage
- Add indexes for frequently queried columns
- Consider read replicas for high traffic

### Backend

- Upgrade Render instance type
- Enable auto-scaling
- Add Redis for caching

### Frontend

- Vercel automatically scales
- Optimize images with Next.js Image component
- Enable ISR (Incremental Static Regeneration) where applicable

## Security Checklist

- [ ] Database connection string is secure
- [ ] Environment variables are not committed to Git
- [ ] CORS is properly configured
- [ ] Rate limiting is implemented (consider adding)
- [ ] Input validation is in place
- [ ] SQL injection protection (using parameterized queries)
- [ ] HTTPS is enabled (automatic on Vercel/Render)

## Backup Strategy

### Database Backups

1. Supabase provides automatic daily backups
2. For manual backups:
   - Go to Supabase Dashboard → Database → Backups
   - Click "Create Backup"

### Code Backups

- Code is backed up in Git repository
- Tag releases: `git tag v1.0.0 && git push --tags`

## Rollback Procedure

### Frontend

1. Go to Vercel dashboard
2. Select project → Deployments
3. Find previous working deployment
4. Click "..." → "Promote to Production"

### Backend

1. Go to Render dashboard
2. Select service → Manual Deploy
3. Select previous commit
4. Click "Deploy"

### Database

1. Go to Supabase dashboard
2. Database → Backups
3. Select backup to restore
4. Click "Restore"

## Cost Estimates

### Free Tier (Development/Testing)

- Supabase: Free (500MB database, 2GB bandwidth)
- Render: Free (750 hours/month, spins down after inactivity)
- Vercel: Free (100GB bandwidth, unlimited deployments)
- **Total: $0/month**

### Production (Recommended)

- Supabase Pro: $25/month (8GB database, 50GB bandwidth)
- Render Starter: $7/month (always on, 512MB RAM)
- Vercel Pro: $20/month (1TB bandwidth, advanced features)
- **Total: ~$52/month**

## Support

For issues:
1. Check application logs
2. Review this deployment guide
3. Check service status pages:
   - [Vercel Status](https://www.vercel-status.com/)
   - [Render Status](https://status.render.com/)
   - [Supabase Status](https://status.supabase.com/)

---

**Congratulations!** Your Trello Clone is now deployed and ready for production use.
