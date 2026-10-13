# 🚀 Render Deployment - Quick Start

## Step-by-Step Deployment

### ✅ Step 1: Prepare External Services

1. **MongoDB Atlas** - Database
   - Sign up: https://www.mongodb.com/cloud/atlas
   - Create free cluster → Get connection string
   - Format: `mongodb+srv://user:pass@cluster.mongodb.net/doctor_appointment`

2. **Cloudinary** - Image Storage
   - Sign up: https://cloudinary.com
   - Copy: Cloud Name, API Key, API Secret

3. **Gmail App Password** - Email Service
   - Enable 2FA on Google account
   - Generate app password: https://myaccount.google.com/apppasswords

---

### ✅ Step 2: Push Code to Git

```bash
# If not already in a git repository
git init
git add .
git commit -m "Initial commit"

# Create repo on GitHub/GitLab/Bitbucket, then:
git remote add origin <your-repo-url>
git push -u origin main
```

---

### ✅ Step 3: Deploy Backend on Render

1. **Login to Render:** https://dashboard.render.com
2. **Create Web Service:**
   - Click "New +" → "Web Service"
   - Connect your Git repository
   
3. **Configure:**
   ```
   Name: doctor-appointment-backend
   Root Directory: backend
   Environment: Node
   Build Command: npm install
   Start Command: npm start
   Instance Type: Free
   ```

4. **Add Environment Variables:**
   ```
   NODE_ENV=production
   MONGO_URI=<your_mongodb_atlas_connection_string>
   JWT_SECRET=<random_32+_character_string>
   JWT_EXPIRE=30d
   CLOUDINARY_CLOUD_NAME=<from_cloudinary>
   CLOUDINARY_API_KEY=<from_cloudinary>
   CLOUDINARY_API_SECRET=<from_cloudinary>
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=<your_gmail>
   EMAIL_PASS=<gmail_app_password>
   EMAIL_FROM=noreply@docbook.com
   CLIENT_URL=https://your-frontend-url.onrender.com
   ```
   
   **Generate JWT_SECRET (PowerShell):**
   ```powershell
   -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
   ```

5. **Click "Create Web Service"**
6. **Wait 5-10 minutes** for deployment
7. **Copy your backend URL:** `https://doctor-appointment-backend.onrender.com`

---

### ✅ Step 4: Deploy Frontend on Render

1. **Create Static Site:**
   - Click "New +" → "Static Site"
   - Select same repository

2. **Configure:**
   ```
   Name: doctor-appointment-frontend
   Root Directory: frontend
   Build Command: npm install && npm run build
   Publish Directory: build
   ```

3. **Add Environment Variable:**
   ```
   REACT_APP_API_URL=<your_backend_url_from_step_3>
   ```

4. **Click "Create Static Site"**
5. **Wait 5-10 minutes** for deployment
6. **Copy your frontend URL:** `https://doctor-appointment-frontend.onrender.com`

---

### ✅ Step 5: Update Backend with Frontend URL

1. Go to **backend service** in Render
2. Click "Environment" tab
3. Find `CLIENT_URL` and update with your frontend URL
4. Click "Save Changes" (triggers redeploy)

---

### ✅ Step 6: Seed Database (Optional)

In Render backend service:
1. Go to "Shell" tab
2. Run: `npm run seed`

Or seed from your local machine:
```bash
cd backend
# Update .env with production MONGO_URI temporarily
npm run seed
# Revert .env back to local settings
```

---

## 🎉 You're Done!

Visit your frontend URL to see your deployed app!

**Backend API:** `https://your-backend.onrender.com`
**Frontend App:** `https://your-frontend.onrender.com`

---

## ⚠️ Important Notes

- **First Load:** May take 30-60 seconds (free tier spins down when inactive)
- **Auto-Deploy:** Pushes to main branch automatically redeploy
- **Logs:** Check Render dashboard → Service → Logs for errors
- **Custom Domain:** Can add in Render settings (paid plans)

---

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Backend won't start | Check logs, verify all env vars set |
| Frontend blank page | Check browser console, verify API URL |
| Can't connect to DB | Check MongoDB IP whitelist has `0.0.0.0/0` |
| Emails not sending | Verify Gmail app password, enable 2FA |
| CORS errors | Verify CLIENT_URL in backend matches frontend URL |

---

## 📞 Need Help?

- Full guide: See `DEPLOYMENT.md`
- Render docs: https://render.com/docs
- Issues: Check service logs in Render dashboard
