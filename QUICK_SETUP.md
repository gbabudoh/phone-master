# ⚡ Quick Setup Guide

## 🚀 3-Minute Setup

### Step 1: Generate JWT Secret
```bash
npm run generate:jwt
```
Copy the generated secret and add it to `.env.local`

### Step 2: Update .env.local

**Minimum Required Configuration:**
```env
MONGODB_URI=mongodb://localhost:27017/phone-master
JWT_SECRET=your-generated-secret-here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 3: Start MongoDB

**Option A: Docker (Recommended)**
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

**Option B: Local Installation**
- Install MongoDB from https://www.mongodb.com/try/download/community
- Start MongoDB service

### Step 4: Run the App
```bash
npm run dev
```

Visit: **http://localhost:3000**

## 📋 Environment Variables Quick Reference

### ✅ Required
- `MONGODB_URI` - Database connection
- `JWT_SECRET` - Authentication (generate with `npm run generate:jwt`)

### 🔧 Optional (for full functionality)
- `STRIPE_SECRET_KEY` - Payment processing
- `MINIO_ENDPOINT` - Image storage
- `GEMINI_API_KEY` - AI chatbot

## 🎯 First Steps After Setup

1. **Register Admin Account**
   - Go to `/register`
   - Choose role: `wholesale_seller`
   - Login at `/login`

2. **Create Test Banner**
   - Go to `/admin/banners`
   - Add a banner with image URL
   - See it on homepage

3. **Test Dashboard**
   - Go to `/dashboard`
   - View stats and analytics

## 🐛 Common Issues

**"MongoDB connection failed"**
- Check MongoDB is running: `docker ps` or check MongoDB service
- Verify connection string in `.env.local`

**"JWT_SECRET not set"**
- Run `npm run generate:jwt`
- Copy secret to `.env.local`

**"Unauthorized" errors**
- Make sure you're logged in
- Check browser cookies are enabled
- Clear browser cache and try again

## 📚 Full Documentation

See `SETUP_GUIDE.md` for detailed setup instructions.

