# 📱 Phone Master

A comprehensive e-commerce platform for mobile phones, accessories, and expert technical support. Built with Next.js, MongoDB, Stripe, and modern web technologies.

## 🚀 Features

### Marketplace
- **Wholesale Marketplace**: Bulk orders for businesses (0% commission, dedicated support)
- **Retail Marketplace**: For businesses and high-volume sellers (3% commission)
- **Individual Marketplace**: Personal sellers (8% commission, max 5 listings)

### Core Features
- 🔍 Advanced search and filtering
- 🛡️ ESCROW payment protection
- 📱 IMEI/Blacklist verification
- 🤖 Phone Genius AI chatbot for instant support
- 💳 Stripe integration for secure payments
- 📸 Image upload and processing with MinIO/imgproxy

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Styling**: Tailwind CSS v4
- **Payments**: Stripe (with Connect & Escrow)
- **Storage**: MinIO (S3-compatible)
- **Image Processing**: imgproxy
- **AI Chatbot**: Google Gemini API
- **Icons**: Lucide React

## 📁 Project Structure

```
phone-master/
├── app/                    # Next.js App Router pages
│   ├── (marketplace)/      # Marketplace routes
│   ├── api/                # API routes
│   ├── dashboard/          # User dashboard
│   ├── support/            # Support pages
│   └── layout.tsx          # Root layout
├── components/             # React components
│   ├── global/            # Header, Footer, Chatbot
│   └── marketplace/       # Product cards, filters
├── lib/                    # Utility functions
│   ├── ai/                # AI/Chatbot logic
│   ├── db.ts              # MongoDB connection
│   ├── payment.ts         # Stripe integration
│   └── minio.ts           # MinIO storage
├── models/                 # MongoDB schemas
├── types/                  # TypeScript definitions
└── public/                 # Static assets
```

## 🏃 Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB (local or Atlas)
- Stripe account (optional, for payments)
- MinIO instance (optional, for image storage)
- Google Gemini API key (optional, for chatbot)

### Quick Setup (3 minutes)

1. **Install dependencies:**
```bash
npm install
```

2. **Generate JWT secret:**
```bash
npm run generate:jwt
```

3. **Set up environment variables:**
```bash
# Copy template (if .env.local doesn't exist)
npm run setup:env
```

Then edit `.env.local` and update:
- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - The secret generated in step 2
- `NEXT_PUBLIC_APP_URL` - http://localhost:3000

**Minimum required:**
```env
MONGODB_URI=mongodb://localhost:27017/phone-master
JWT_SECRET=your-generated-secret-here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **Start MongoDB:**
```bash
# Using Docker (recommended)
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

5. **Run the development server:**
```bash
npm run dev
```

6. **Open [http://localhost:3000](http://localhost:3000)** in your browser.

### First User Setup

1. **Register Admin Account:**
   - Visit `/register`
   - Choose role: `wholesale_seller`
   - Complete registration

2. **Login:**
   - Visit `/login`
   - Enter your credentials

3. **Access Dashboards:**
   - Seller Dashboard: `/dashboard`
   - Admin Dashboard: `/admin/dashboard`

📚 **For detailed setup instructions, see `SETUP_GUIDE.md`**

## 🎨 Theme Colors

Phone Master uses a modern color scheme:
- **Primary**: `#014f86` (Navy Blue)
- **Accent Grey**: `#bfb7b6` (Light Grey)
- **Accent Cyan**: `#b3dee2` (Light Cyan)

## 📝 Environment Variables

See `.env.example` for all required environment variables.

## 🔐 User Roles & Permissions

- **Buyer**: Default role, can browse and purchase
- **Personal Seller**: Max 5 listings, £0.80 listing fee, 8% commission
- **Retail Seller**: Unlimited listings, £12/month subscription, 3% commission
- **Wholesale Seller**: Unlimited listings, £29/month subscription, 0% commission

## 🛡️ Security Features

- ESCROW payment protection
- IMEI blacklist verification
- Server-side validation
- Secure image uploads with presigned URLs
- Stripe Connect for seller payouts

## 📚 API Routes

- `POST /api/auth/register` - User registration
- `POST /api/listings/create` - Create product listing
- `GET /api/listings/search` - Search products
- `POST /api/support/chatbot` - Chatbot API
- `POST /api/seller/media/upload` - Get upload URL

## 🚧 Development Status

This is an active development project. Current features:
- ✅ Core project structure
- ✅ Database models and types
- ✅ UI components
- ✅ API routes (basic)
- ✅ Marketplace pages
- ✅ Support/chatbot integration
- ⏳ Authentication system
- ⏳ Payment processing
- ⏳ Image upload workflow
- ⏳ Full search functionality

## 📄 License

[Your License Here]

## 🤝 Contributing

[Contributing guidelines]

## 📞 Support

For support, use the Phone Genius chatbot or visit the support page.
