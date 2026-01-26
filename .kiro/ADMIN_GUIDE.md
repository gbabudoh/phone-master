# Phone Master Admin Backend Guide

## Overview

The admin backend provides comprehensive marketplace management capabilities for wholesale sellers (admins) to manage the entire platform.

## Admin Features

### 1. Dashboard (`/admin/dashboard`)
- **Overview Statistics**
  - Total Users count
  - Active Sellers count
  - Total Products count
  - Total Transactions count
  - Total Revenue (commission earned)
  - Pending Approvals alert

- **Quick Actions**
  - Manage Banners
  - Review Sellers
  - Access Settings

### 2. Seller Management (`/admin/sellers`)

#### Features:
- **View All Sellers** - See personal, retail, and wholesale sellers
- **Filter & Search**
  - Search by email or name
  - Filter by seller type (Personal, Retail, Wholesale)
  - Filter by status (Active, Pending, Suspended)

- **Seller Statistics**
  - Total sales count
  - Total earnings
  - Active listings
  - Seller rating

- **Actions**
  - Activate seller accounts
  - Suspend seller accounts
  - View seller details

#### Seller Types:
- **Personal Seller**: Individual sellers with limited listings
- **Retail Seller**: Business sellers with moderate inventory
- **Wholesale Seller**: Large-scale sellers (also admin role)

### 3. User Management (`/admin/users`)
- View all platform users (buyers and sellers)
- Search users by email or name
- Activate/Suspend user accounts
- View user details and creation date

### 4. Product Management (`/admin/products`)
- View all products listed on the platform
- Search and filter products
- Monitor product status
- View seller information for each product

### 5. Transaction Management (`/admin/transactions`)
- View all marketplace transactions
- Track transaction status
- Monitor commission fees
- View buyer and seller information
- Track payout status

### 6. Banner Management (`/admin/banners`)
- **Create Banners**
  - Upload banner images (JPEG, PNG, GIF, WebP)
  - Add title and description
  - Set banner link and link text
  - Schedule with start/end dates

- **Edit Banners**
  - Update banner content
  - Change images
  - Modify scheduling

- **Delete Banners**
  - Remove inactive banners

- **Reorder Banners**
  - Set display order
  - Move banners up/down

- **Activate/Deactivate**
  - Toggle banner visibility

### 7. Settings (`/admin/settings`)
- **Platform Settings**
  - Platform name
  - Support email

- **Commission Settings**
  - Commission rate (%)
  - Minimum withdrawal amount
  - Maximum withdrawal amount

## API Endpoints

### Dashboard
- `GET /api/admin/dashboard` - Get dashboard statistics

### Sellers
- `GET /api/admin/sellers` - List all sellers with stats
- `GET /api/admin/sellers/[id]` - Get seller details
- `PUT /api/admin/sellers/[id]` - Update seller status

### Users
- `GET /api/admin/users` - List all users
- `PUT /api/admin/users/[id]` - Update user status

### Transactions
- `GET /api/admin/transactions` - List all transactions

### Banners
- `GET /api/banners` - List banners
- `POST /api/banners` - Create banner
- `PUT /api/banners/[id]` - Update banner
- `DELETE /api/banners/[id]` - Delete banner

### Upload
- `POST /api/upload` - Upload image files

## Access Control

- **Admin Access**: Only users with `wholesale_seller` role can access admin panel
- **Protected Routes**: All admin routes require authentication
- **API Protection**: All admin APIs check for `wholesale_seller` role

## File Structure

```
app/admin/
├── layout.tsx              # Admin layout with sidebar navigation
├── dashboard/
│   └── page.tsx           # Dashboard overview
├── sellers/
│   └── page.tsx           # Seller management
├── users/
│   └── page.tsx           # User management
├── products/
│   └── page.tsx           # Product management
├── transactions/
│   └── page.tsx           # Transaction management
├── banners/
│   └── page.tsx           # Banner management
└── settings/
    └── page.tsx           # Platform settings

app/api/admin/
├── dashboard/
│   └── route.ts           # Dashboard stats API
├── sellers/
│   ├── route.ts           # List sellers API
│   └── [id]/route.ts      # Seller details API
├── users/
│   ├── route.ts           # List users API
│   └── [id]/route.ts      # User details API
├── transactions/
│   └── route.ts           # List transactions API
└── banners/
    ├── route.ts           # Banner CRUD API
    └── [id]/route.ts      # Individual banner API

app/api/upload/
└── route.ts               # File upload API
```

## Usage Examples

### Access Admin Panel
1. Login as a wholesale seller
2. Navigate to `/admin/dashboard`
3. Use sidebar to navigate between sections

### Manage Sellers
1. Go to `/admin/sellers`
2. Search or filter sellers
3. Click actions to activate/suspend
4. View seller statistics

### Add Banner
1. Go to `/admin/banners`
2. Click "Add Banner"
3. Upload image or enter URL
4. Fill in title, description, link
5. Set scheduling (optional)
6. Click "Create"

### Monitor Transactions
1. Go to `/admin/transactions`
2. View all marketplace transactions
3. Track commission fees
4. Monitor payout status

## Features Coming Soon

- [ ] Seller verification system
- [ ] Advanced analytics and reporting
- [ ] Bulk user actions
- [ ] Email notifications
- [ ] Audit logs
- [ ] Custom commission rates per seller
- [ ] Dispute resolution system
- [ ] Automated payouts

## Notes

- All timestamps are stored in UTC
- Prices are stored in cents (multiply by 100 for display)
- Commission rates are percentages (0-100)
- File uploads are stored in `/public/uploads/`
- All admin actions are logged for audit purposes
