# AI Stress Detection App - Deployment Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Deployment Options](#deployment-options)
3. [Quick Deploy (Recommended)](#quick-deploy-recommended)
4. [Option 1: Vercel (Full Stack)](#option-1-vercel-full-stack)
5. [Option 2: Netlify + Render](#option-2-netlify--render)
6. [Option 3: Manual VPS Deployment](#option-3-manual-vps-deployment)
7. [Environment Variables](#environment-variables)
8. [Post-Deployment Checklist](#post-deployment-checklist)

---

## Prerequisites

Before deploying, ensure you have:
- ✅ Git repository (GitHub, GitLab, or Bitbucket)
- ✅ Google Gemini API Key ([Get it here](https://makersuite.google.com/app/apikey))
- ✅ Node.js installed (v16 or higher)
- ✅ Project code committed to repository

---

## Deployment Options

| Platform | Frontend | Backend | Difficulty | Cost |
|----------|----------|---------|------------|------|
| **Vercel** | ✅ | ✅ | Easy | Free tier available |
| **Netlify + Render** | ✅ | ✅ | Medium | Free tier available |
| **Railway** | ✅ | ✅ | Easy | Free tier available |
| **VPS (DigitalOcean)** | ✅ | ✅ | Hard | $5-10/month |

---

## Quick Deploy (Recommended)

### Using Vercel (Easiest - Full Stack)

**1. Prepare Your Repository**
```bash
# Ensure your code is pushed to GitHub
git add .
git commit -m "Ready for deployment"
git push origin main
```

**2. Deploy Frontend (Client)**
1. Go to [Vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `client`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Add Environment Variable:
   - `VITE_API_URL` = `https://your-backend-url.vercel.app`
6. Click "Deploy"

**3. Deploy Backend (Server)**
1. Create another Vercel project
2. Import same repository
3. Configure:
   - **Root Directory:** `server`
   - **Build Command:** Leave empty
   - **Output Directory:** Leave empty
4. Add Environment Variable:
   - `GEMINI_API_KEY` = Your Gemini API Key
   - `PORT` = 3000
5. Create `vercel.json` in server folder:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}
```

6. Click "Deploy"

**4. Update Frontend API URL**
- Go back to your frontend project on Vercel
- Update `VITE_API_URL` with your backend URL
- Redeploy

---

## Option 1: Vercel (Full Stack)

### Step-by-Step Instructions

#### A. Frontend Deployment

```bash
# 1. Navigate to client folder
cd client

# 2. Install Vercel CLI (optional)
npm install -g vercel

# 3. Deploy
vercel

# Follow prompts:
# - Link to existing project or create new
# - Set root directory to ./client
# - Override build command: npm run build
# - Override output directory: dist
```

**Environment Variables:**
```env
VITE_API_URL=https://your-backend.vercel.app
```

#### B. Backend Deployment

```bash
# 1. Navigate to server folder
cd ../server

# 2. Create vercel.json
```

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "server.js"
    }
  ],
  "env": {
    "GEMINI_API_KEY": "@gemini-api-key"
  }
}
```

```bash
# 3. Deploy
vercel

# 4. Add secret
vercel env add GEMINI_API_KEY production
```

---

## Option 2: Netlify + Render

### A. Frontend on Netlify

**1. Via Netlify Dashboard:**
1. Go to [Netlify](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub
4. Configure:
   - **Base directory:** `client`
   - **Build command:** `npm run build`
   - **Publish directory:** `client/dist`
5. Add Environment Variable:
   - `VITE_API_URL` = Your Render backend URL
6. Deploy!

**2. Via CLI:**
```bash
cd client
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod
```

### B. Backend on Render

**1. Via Render Dashboard:**
1. Go to [Render.com](https://render.com)
2. Click "New" → "Web Service"
3. Connect repository
4. Configure:
   - **Name:** comfy-backend
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
5. Add Environment Variable:
   - `GEMINI_API_KEY` = Your API Key
6. Deploy!

**2. Via render.yaml:**

Create `render.yaml` in project root:

```yaml
services:
  - type: web
    name: comfy-backend
    env: node
    rootDir: server
    buildCommand: npm install
    startCommand: node server.js
    envVars:
      - key: GEMINI_API_KEY
        sync: false
```

---

## Option 3: Manual VPS Deployment

### Prerequisites
- Ubuntu 20.04+ server
- Domain name (optional)
- SSH access

### Step 1: Server Setup

```bash
# SSH into your server
ssh root@your-server-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 (process manager)
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx -y
```

### Step 2: Deploy Backend

```bash
# Clone repository
git clone https://github.com/yourusername/your-repo.git
cd your-repo/server

# Install dependencies
npm install

# Create .env file
nano .env
```

Add to `.env`:
```env
GEMINI_API_KEY=your-api-key-here
PORT=3000
```

```bash
# Start with PM2
pm2 start server.js --name comfy-backend
pm2 save
pm2 startup
```

### Step 3: Deploy Frontend

```bash
cd ../client

# Install dependencies
npm install

# Build for production
npm run build

# Copy build to Nginx
sudo cp -r dist/* /var/www/html/
```

### Step 4: Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/comfy
```

Add configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /var/www/html;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/comfy /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 5: SSL Certificate (Optional but Recommended)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get certificate
sudo certbot --nginx -d your-domain.com
```

---

## Environment Variables

### Frontend (.env in /client)
```env
# API URL for production
VITE_API_URL=https://your-backend-url.com
```

### Backend (.env in /server)
```env
# Google Gemini API Key
GEMINI_API_KEY=your-gemini-api-key

# Port (optional, defaults to 3000)
PORT=3000

# CORS Origin (optional)
CORS_ORIGIN=https://your-frontend-url.com
```

---

## Post-Deployment Checklist

### Testing
- [ ] Test questionnaire flow
- [ ] Verify AI responses are working
- [ ] Test contact form submission
- [ ] Check mobile responsiveness
- [ ] Test all navigation links
- [ ] Verify animations work smoothly
- [ ] Test on multiple browsers

### Performance
- [ ] Enable caching
- [ ] Compress assets
- [ ] Optimize images
- [ ] Enable CDN (if applicable)

### Security
- [ ] Enable HTTPS/SSL
- [ ] Set up CORS properly
- [ ] Hide sensitive API keys
- [ ] Implement rate limiting (optional)

### Monitoring
- [ ] Set up error tracking (Sentry)
- [ ] Monitor API usage (Gemini API quota)
- [ ] Set up uptime monitoring
- [ ] Configure analytics (Google Analytics)

---

## Troubleshooting

### Common Issues

**1. Frontend can't connect to Backend**
```javascript
// Update client/src/App.jsx
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Use in axios call
const response = await axios.post(`${API_URL}/api/analyze-stress`, { answers });
```

**2. Gemini API 404 Error**
- Verify API key is correctly set in backend environment
- Check API key has necessary permissions
- Ensure billing is enabled on Google Cloud

**3. CORS Errors**
```javascript
// Update server/server.js
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
};
app.use(cors(corsOptions));
```

---

## CI/CD Automation (Optional)

### GitHub Actions for Auto-Deploy

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy Frontend
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./client

      - name: Deploy Backend
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID_BACKEND }}
          working-directory: ./server
```

---

## Cost Estimation

### Free Tier Limits

**Vercel:**
- Bandwidth: 100GB/month
- Builds: 6000 minutes/month
- Serverless Functions: 100GB-hrs/month

**Render:**
- 750 hours/month free tier
- 100GB bandwidth

**Netlify:**
- 100GB bandwidth
- 300 build minutes

### Paid Options (if needed)
- Vercel Pro: $20/month
- Render: $7/month
- DigitalOcean VPS: $6/month

---

## Support & Resources

- **Vercel Docs:** https://vercel.com/docs
- **Render Docs:** https://render.com/docs
- **Netlify Docs:** https://docs.netlify.com
- **Gemini API:** https://ai.google.dev/docs

---

## Quick Commands Reference

```bash
# Build frontend
cd client && npm run build

# Start backend locally
cd server && node server.js

# Deploy to Vercel
vercel --prod

# Deploy to Netlify
netlify deploy --prod

# Check PM2 status
pm2 list
pm2 logs comfy-backend
```

---

**Happy Deploying! 🚀**

For issues or questions, refer to the platform-specific documentation or create an issue in your repository.
