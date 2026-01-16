# 🚀 Deployment Guide - NKR Tech Solutions

## Quick Deployment Checklist

### Before Deployment
- [ ] Test all forms locally
- [ ] Verify admin dashboard works
- [ ] Configure email credentials in .env
- [ ] Update JWT_SECRET to a strong random string
- [ ] Build React app (`npm run build`)
- [ ] Test backend API endpoints

---

## Option 1: Vercel (Frontend) + Heroku (Backend)

### Deploy Backend to Heroku

1. **Install Heroku CLI**
```bash
npm install -g heroku
```

2. **Login to Heroku**
```bash
heroku login
```

3. **Create Heroku App**
```bash
cd server
heroku create nkr-tech-backend
```

4. **Set Environment Variables**
```bash
heroku config:set JWT_SECRET=your_strong_random_secret
heroku config:set NODE_ENV=production
heroku config:set EMAIL_HOST=smtp.gmail.com
heroku config:set EMAIL_PORT=587
heroku config:set EMAIL_USER=your-email@gmail.com
heroku config:set EMAIL_PASS=your-app-password
heroku config:set ADMIN_EMAIL=admin@nkrtechsolution.com
```

5. **Deploy**
```bash
git init
git add .
git commit -m "Initial commit"
git push heroku main
```

6. **Your backend URL:** `https://nkr-tech-backend.herokuapp.com`

### Deploy Frontend to Vercel

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Update API URL in client**
   
   Create `client/.env.production`:
   ```env
   REACT_APP_API_URL=https://nkr-tech-backend.herokuapp.com/api
   ```

3. **Build React App**
```bash
cd client
npm run build
```

4. **Deploy to Vercel**
```bash
vercel --prod
```

5. **Your frontend URL:** Will be provided by Vercel

---

## Option 2: Single Server (DigitalOcean/AWS)

### 1. Setup Server
```bash
# SSH into your server
ssh root@your_server_ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 (process manager)
sudo npm install -g pm2
```

### 2. Clone Your Project
```bash
cd /var/www
git clone https://github.com/yourusername/nkr-tech-solution.git
cd nkr-tech-solution
```

### 3. Setup Backend
```bash
cd server
npm install --production
```

Create `/var/www/nkr-tech-solution/server/.env`:
```env
PORT=5000
JWT_SECRET=your_strong_random_secret
NODE_ENV=production
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@nkrtechsolution.com
ADMIN_EMAIL=admin@nkrtechsolution.com
```

Start backend with PM2:
```bash
pm2 start server.js --name nkr-backend
pm2 save
pm2 startup
```

### 4. Setup Frontend
```bash
cd ../client
npm install
npm run build
```

### 5. Setup Nginx
```bash
sudo apt install nginx

# Create Nginx config
sudo nano /etc/nginx/sites-available/nkr-tech
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name your_domain.com;

    # Frontend
    location / {
        root /var/www/nkr-tech-solution/client/build;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/nkr-tech /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 6. Setup SSL (Let's Encrypt)
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your_domain.com
```

---

## Option 3: Netlify (Frontend) + Railway (Backend)

### Deploy Backend to Railway

1. Go to https://railway.app
2. Click "New Project" > "Deploy from GitHub repo"
3. Select your repository
4. Railway will auto-detect Node.js
5. Add environment variables in Railway dashboard
6. Deploy!

### Deploy Frontend to Netlify

1. Go to https://www.netlify.com
2. Drag and drop your `client/build` folder
3. Or connect your GitHub repo
4. Set build command: `npm run build`
5. Set publish directory: `build`
6. Add environment variable: `REACT_APP_API_URL=https://your-railway-app.railway.app/api`

---

## Environment Variables Reference

### Backend (.env)
```env
PORT=5000
JWT_SECRET=your_very_long_random_secret_key_here
NODE_ENV=production

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
EMAIL_FROM=noreply@nkrtechsolution.com
ADMIN_EMAIL=admin@nkrtechsolution.com
```

### Frontend (.env.production)
```env
REACT_APP_API_URL=https://your-backend-url.com/api
```

---

## Gmail App Password Setup

If using Gmail for emails:

1. Go to Google Account: https://myaccount.google.com
2. Security → 2-Step Verification (enable it)
3. Security → App passwords
4. Select "Mail" and "Other device"
5. Copy the 16-character password
6. Use this as `EMAIL_PASS` in .env

---

## Database Migration (SQLite → PostgreSQL)

If you want to use PostgreSQL in production:

1. **Install pg package**
```bash
npm install pg
```

2. **Update database/init.js to use PostgreSQL**

3. **Migration script** (if needed):
```bash
sqlite3 nkr_tech.db .dump > backup.sql
psql your_database < backup.sql
```

---

## Security Checklist

Before going live:

- [ ] Change default admin password
- [ ] Use strong JWT_SECRET (random 64+ characters)
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS to allow only your domain
- [ ] Set secure cookie flags
- [ ] Use environment variables (never commit .env)
- [ ] Enable rate limiting
- [ ] Add helmet.js for security headers
- [ ] Validate all user inputs
- [ ] Sanitize SQL queries (already done)

---

## Performance Optimization

### Backend
```javascript
// Add compression
npm install compression
// In server.js
const compression = require('compression');
app.use(compression());
```

### Frontend
- Already optimized with `npm run build`
- Minified JavaScript
- Optimized assets
- Code splitting enabled

---

## Monitoring & Logs

### PM2 Logs
```bash
pm2 logs nkr-backend
pm2 monit
```

### Heroku Logs
```bash
heroku logs --tail
```

### Error Tracking
Consider adding:
- Sentry.io for error tracking
- LogRocket for session replay
- Google Analytics for usage stats

---

## Backup Strategy

### Database Backup
```bash
# Daily backup script
sqlite3 /path/to/nkr_tech.db ".backup '/backups/nkr_tech_$(date +%Y%m%d).db'"
```

### Automated Backups (Cron)
```bash
crontab -e
# Add: Daily at 2 AM
0 2 * * * /path/to/backup_script.sh
```

---

## Domain Configuration

### DNS Settings
Point your domain to your server:

**For Heroku/Railway:**
```
Type: CNAME
Name: www
Value: your-app.herokuapp.com
```

**For VPS:**
```
Type: A
Name: @
Value: your_server_ip
```

---

## Testing Deployment

After deployment, test:

1. **Frontend**
   - [ ] All pages load
   - [ ] Navigation works
   - [ ] Forms submit
   - [ ] Responsive design

2. **Backend**
   - [ ] API endpoints respond
   - [ ] Authentication works
   - [ ] Database operations work
   - [ ] Emails send (if configured)

3. **Integration**
   - [ ] Forms save to database
   - [ ] Admin can login
   - [ ] Admin dashboard loads data
   - [ ] Status updates work
   - [ ] Delete operations work

---

## Troubleshooting Deployment

### Backend won't start
- Check environment variables
- Verify Node version (18+)
- Check port availability
- Review logs for errors

### Frontend can't connect to backend
- Verify REACT_APP_API_URL is correct
- Check CORS settings in backend
- Verify backend is running
- Check network/firewall

### Database errors
- Ensure database file has write permissions
- Check SQLite version
- Verify database path is correct

### Email not working
- Verify EMAIL credentials
- Check Gmail "Less secure app access"
- Use App Password for Gmail
- Check spam folder

---

## Cost Estimates

### Free Tier Options
- **Vercel**: Free for personal projects
- **Netlify**: Free for personal projects
- **Heroku**: Free dyno (with sleep)
- **Railway**: $5/month free credit

### Paid Options
- **DigitalOcean Droplet**: $5-10/month
- **AWS EC2**: $5-20/month
- **Heroku Hobby**: $7/month
- **Railway**: Pay as you go

---

## Post-Deployment

1. **Monitor Performance**
   - Check response times
   - Monitor error rates
   - Track user activity

2. **Regular Updates**
   - Update dependencies monthly
   - Review security advisories
   - Apply patches

3. **Backup Regularly**
   - Daily database backups
   - Code repository backups
   - Email archive

4. **Scale as Needed**
   - Monitor traffic
   - Upgrade server if needed
   - Add caching (Redis)
   - Use CDN for assets

---

## Support & Maintenance

For ongoing support:
- Check logs regularly
- Monitor uptime
- Update dependencies
- Respond to security alerts
- Add new features as needed

---

## 🎉 Congratulations!

Your website is now deployed and ready for real users!

**Need help?** Check:
- Server logs
- Browser console
- Network tab
- Database queries

**Happy deploying! 🚀**
