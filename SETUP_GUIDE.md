# 🚀 Phone Master - Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Copy `.env.local` and update with your actual values:

```bash
# The file is already created, just update the values
```

**Required Variables:**
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens (generate with: `openssl rand -base64 32`)

**Optional but Recommended:**
- `STRIPE_SECRET_KEY` - For payment processing
- `MINIO_*` - For image storage
- `GEMINI_API_KEY` - For AI chatbot

### 3. Set Up MongoDB

**Option A: Local MongoDB**
```bash
# Install MongoDB locally or use Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

**Option B: MongoDB Atlas (Cloud)**
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env.local`

### 4. Set Up MinIO (Image Storage)

**Using Docker:**
```bash
docker run -d \
  -p 9000:9000 \
  -p 9001:9001 \
  --name minio \
  -e "MINIO_ROOT_USER=minioadmin" \
  -e "MINIO_ROOT_PASSWORD=minioadmin" \
  minio/minio server /data --console-address ":9001"
```

Access MinIO Console: http://localhost:9001
- Username: minioadmin
- Password: minioadmin

### 5. Generate JWT Secret

```bash
# On Linux/Mac
openssl rand -base64 32

# On Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

Copy the output and set it as `JWT_SECRET` in `.env.local`

### 6. Run the Application

```bash
npm run dev
```

Visit: http://localhost:3000

## 🔐 First User Setup

### Create Admin Account

1. Visit `/register`
2. Register with role: `wholesale_seller`
3. Login at `/login`
4. Access admin panel at `/admin/dashboard`

### Create Test Seller Accounts

1. **Retail Seller**: Register with `retail_seller` role
2. **Personal Seller**: Register with `personal_seller` role
3. **Buyer**: Register with `buyer` role (default)

## 📋 Environment Variables Checklist

- [ ] `MONGODB_URI` - Database connection
- [ ] `JWT_SECRET` - Authentication secret
- [ ] `STRIPE_SECRET_KEY` - Payment processing (optional)
- [ ] `MINIO_ENDPOINT` - Image storage (optional)
- [ ] `GEMINI_API_KEY` - AI chatbot (optional)
- [ ] `NEXT_PUBLIC_APP_URL` - Application URL

## 🧪 Testing the Setup

1. **Test Authentication**:
   - Register a new user
   - Login
   - Check dashboard access

2. **Test API Endpoints**:
   - `/api/auth/me` - Should return user data
   - `/api/seller/stats` - Should return stats (if logged in as seller)
   - `/api/admin/stats` - Should return admin stats (if admin)

3. **Test Real-time Updates**:
   - Open `/admin/dashboard`
   - Stats should update every 5 seconds

4. **Test Charts**:
   - Visit `/dashboard/analytics`
   - Charts should render (may be empty if no data)

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Check if MongoDB is running
- Verify connection string format
- Check firewall settings

### Authentication Not Working
- Verify `JWT_SECRET` is set
- Check browser cookies are enabled
- Clear browser cache

### Images Not Uploading
- Verify MinIO is running
- Check MinIO credentials
- Verify bucket exists

### Real-time Updates Not Working
- Check browser console for errors
- Verify SSE endpoint is accessible
- Check network tab for EventSource connection

## 📚 Next Steps

1. Create your first product listing
2. Set up Stripe for payments
3. Configure email notifications
4. Add more products to test search/filtering
5. Test the banner slider

---

**Need Help?** Check the console logs and browser network tab for detailed error messages.

