# Deployment Guide - Render.com

## 📋 Pre-Deployment Checklist

- [ ] MongoDB Atlas cluster created and connection string obtained
- [ ] Cloudinary account setup (for image uploads)
- [ ] Gmail App Password generated (for email notifications)
- [ ] Code pushed to Git repository (GitHub/GitLab/Bitbucket)
- [ ] Render account created

---

## 🗄️ Database Setup (MongoDB Atlas)

1. Create free cluster at https://www.mongodb.com/cloud/atlas
2. Database Access → Add Database User
3. Network Access → Add IP: `0.0.0.0/0`
4. Connect → Connect your application → Copy connection string
5. Replace `<password>` with your database user password
6. Add database name: `/doctor_appointment`

**Connection String Format:**
```
mongodb+srv://username:password@cluster.mongodb.net/doctor_appointment?retryWrites=true&w=majority
```

---

## 🔧 Environment Variables Reference

### Backend Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Server port | `10000` |
| `MONGO_URI` | MongoDB connection | `mongodb+srv://...` |
| `JWT_SECRET` | JWT signing key (min 32 chars) | Generate random string |
| `JWT_EXPIRE` | Token expiration | `30d` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | Your cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key | Your API key |
| `CLOUDINARY_API_SECRET` | Cloudinary secret | Your secret |
| `EMAIL_HOST` | SMTP host | `smtp.gmail.com` |
| `EMAIL_PORT` | SMTP port | `587` |
| `EMAIL_USER` | Email address | `your@gmail.com` |
| `EMAIL_PASS` | Gmail app password | 16-char password |
| `EMAIL_FROM` | Sender email | `noreply@docbook.com` |
| `CLIENT_URL` | Frontend URL | `https://your-app.onrender.com` |

### Frontend Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API URL | `https://your-backend.onrender.com` |

---

## 🚀 Deployment Steps

### 1. Deploy Backend (Web Service)

```bash
# Service Configuration
Name: doctor-appointment-backend
Environment: Node
Region: Oregon (US West)
Branch: main
Root Directory: backend
Build Command: npm install
Start Command: npm start
Plan: Free
```

**Add all backend environment variables listed above**

### 2. Deploy Frontend (Static Site)

```bash
# Service Configuration
Name: doctor-appointment-frontend
Environment: Static Site
Region: Oregon (US West)
Branch: main
Root Directory: frontend
Build Command: npm install && npm run build
Publish Directory: build
```

**Add frontend environment variable:**
- `REACT_APP_API_URL`: Your backend URL

### 3. Update Backend CLIENT_URL

After frontend deploys, update backend's `CLIENT_URL` environment variable with your frontend URL.

---

## 🔑 Generating Secure JWT Secret

**Windows (PowerShell):**
```powershell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

**Online:**
Use https://generate-secret.vercel.app/32

---

## 📧 Gmail App Password Setup

1. Enable 2FA on your Google account
2. Go to https://myaccount.google.com/apppasswords
3. Select "Mail" and "Other (Custom name)"
4. Generate password (16 characters)
5. Use this password in `EMAIL_PASS` environment variable

---

## ☁️ Cloudinary Setup

1. Sign up at https://cloudinary.com
2. Dashboard → Copy:
   - Cloud Name
   - API Key
   - API Secret
3. Add to backend environment variables

---

## 🔄 Auto-Deploy on Git Push

Render automatically redeploys when you push to your connected branch:

```bash
git add .
git commit -m "Update feature"
git push origin main
```

---

## 🐛 Troubleshooting

### Backend won't start
- Check logs in Render dashboard
- Verify all environment variables are set
- Ensure MongoDB connection string is correct
- Check port is set to 10000

### Frontend shows blank page
- Check browser console for errors
- Verify `REACT_APP_API_URL` matches backend URL
- Ensure backend CORS allows frontend URL

### Database connection errors
- Verify MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- Check database user has correct permissions
- Ensure connection string has correct password

### Email not sending
- Verify Gmail app password is correct
- Check 2FA is enabled on Google account
- Ensure `EMAIL_HOST` and `EMAIL_PORT` are correct

---

## 📊 Monitoring

- **Logs:** Render Dashboard → Service → Logs tab
- **Metrics:** Monitor CPU, memory usage in dashboard
- **Alerts:** Configure in Render settings

---

## 💰 Free Tier Limitations

- Backend: Spins down after 15 minutes of inactivity
- First request after sleep: 30-60 second delay
- 750 hours/month of runtime
- Upgrade to paid plan ($7/month) for always-on service

---

## 🔒 Security Best Practices

1. Never commit `.env` files to Git
2. Use strong, unique JWT_SECRET
3. Rotate secrets periodically
4. Enable MongoDB authentication
5. Use HTTPS only (Render provides free SSL)
6. Regularly update dependencies

---

## 📝 Post-Deployment

- [ ] Test all authentication flows
- [ ] Verify email notifications work
- [ ] Test image uploads to Cloudinary
- [ ] Check appointment booking workflow
- [ ] Test on mobile devices
- [ ] Setup custom domain (optional)

---

## 🆘 Support

- Render Docs: https://render.com/docs
- Render Community: https://community.render.com
- MongoDB Atlas Support: https://www.mongodb.com/docs/atlas/
