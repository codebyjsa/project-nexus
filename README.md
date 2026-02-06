# Project Nexus - Student Exchange Module

## 🎯 Overview

This implementation covers **Section 2.2 - The Student Exchange** from the AI Fusion Hackathon Problem Statement, featuring three core modules:

1. **Lost & Found** - Report and find lost items on campus
2. **Buy / Sell Marketplace** - Trade items within the student community
3. **Cab Pool** - Share rides and split travel costs

## 🏗️ Architecture

### Technology Stack
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Data Storage**: File-based JSON (no database)
- **Language**: JavaScript/TypeScript

### Directory Structure

```
project-nexus/
├── app/
│   ├── exchange/
│   │   └── page.jsx              # Main Exchange Hub page
│   └── api/
│       ├── lost-found/
│       │   └── route.js          # Lost & Found API endpoints
│       ├── marketplace/
│       │   └── route.js          # Marketplace API endpoints
│       └── cabpool/
│           └── route.js          # Cab Pool API endpoints
├── components/
│   └── exchange/
│       ├── LostFoundTab.jsx      # Lost & Found UI component
│       ├── MarketplaceTab.jsx    # Marketplace UI component
│       ├── CabPoolTab.jsx        # Cab Pool UI component
│       ├── ItemCard.jsx          # Lost & Found item card
│       ├── ProductCard.jsx       # Marketplace product card
│       ├── RideCard.jsx          # Cab Pool ride card
│       └── PostForm.jsx          # Reusable form modal
└── data/
    ├── lost-found.json           # Lost & Found data storage
    ├── marketplace.json          # Marketplace data storage
    └── cabpool.json              # Cab Pool data storage
```

## 📋 Features Implemented

### 1️⃣ Lost & Found Module

**Data Model:**
```javascript
{
  id: string,              // Auto-generated timestamp
  title: string,
  description: string,
  category: string,
  status: 'lost' | 'found',
  location: string,
  userName: string,
  createdAt: ISO timestamp
}
```

**Features:**
- Report lost items
- Report found items
- Filter by status (All | Lost | Found)
- Visual distinction with color-coded badges (🔴 Lost, 🟢 Found)
- Delete items
- Future-ready: Comment placeholders for AI image recognition

**API Endpoints:**
- `GET /api/lost-found` - Fetch all items
- `POST /api/lost-found` - Create new item
- `DELETE /api/lost-found?id={id}` - Delete item

### 2️⃣ Buy / Sell Marketplace

**Data Model:**
```javascript
{
  id: string,
  title: string,
  description: string,
  price: number,
  category: string,
  condition: 'new' | 'good' | 'used',
  userName: string,
  createdAt: ISO timestamp
}
```

**Features:**
- Post items for sale
- View all listings
- Delete own listing
- Prominent price display
- Condition badges (color-coded)
- Future-ready: Comment placeholders for AI pricing engine

**API Endpoints:**
- `GET /api/marketplace` - Fetch all products
- `POST /api/marketplace` - Create new product
- `DELETE /api/marketplace?id={id}` - Delete product

### 3️⃣ Travel Sharing - Cab Pool

**Data Model:**
```javascript
{
  id: string,
  destination: string,
  departureTime: ISO timestamp,
  seatsAvailable: number,
  costEstimate: number,
  userName: string,
  createdAt: ISO timestamp
}
```

**Features:**
- Create cab pool listings
- View upcoming rides
- Chronological sorting by departure time
- Prominent departure time display
- Seats and cost information
- Delete rides
- Future-ready: Comment placeholders for real-time tracking and maps

**API Endpoints:**
- `GET /api/cabpool` - Fetch all rides (sorted chronologically)
- `POST /api/cabpool` - Create new ride
- `DELETE /api/cabpool?id={id}` - Delete ride

## 🎨 Design System

### iOS 18+ Aesthetic
- **Rounded corners**: `rounded-2xl` (16px)
- **Soft shadows**: `shadow-lg`, `shadow-xl`
- **Glassmorphism**: `backdrop-blur-sm`, `bg-white/80`
- **Gradient backgrounds**: `bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50`
- **Apple-style typography**: `-apple-system, BlinkMacSystemFont, 'Segoe UI'...`
- **Smooth transitions**: `transition-all duration-300`
- **Hover effects**: `hover:scale-[1.02]`, `hover:shadow-xl`
- **Large tap targets**: Mobile-first design

### Color Palette
- **Lost items**: Red (`bg-red-100 text-red-700`)
- **Found items**: Green (`bg-green-100 text-green-700`)
- **New condition**: Blue (`bg-blue-100 text-blue-700`)
- **Good condition**: Green (`bg-green-100 text-green-700`)
- **Used condition**: Yellow (`bg-yellow-100 text-yellow-700`)
- **Primary action**: Blue 600 (`bg-blue-600`)

## 🚀 Getting Started

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

Visit `http://localhost:3000` to see the landing page, then navigate to `/exchange` for the Student Exchange Hub.

### Build
```bash
npm run build
npm start
```

## 📁 Data Storage

All data is stored in JSON files in the `data/` directory:
- `data/lost-found.json`
- `data/marketplace.json`
- `data/cabpool.json`

**File Operations:**
- Read → Parse → Modify → Write back
- Auto-generated IDs using `Date.now().toString()`
- Non-blocking async operations using `fs/promises`

## 🔒 Constraints Followed

✅ **Strictly followed directory structure** - No files created outside specified directories  
✅ **File-based JSON storage only** - No database, Prisma, or Supabase  
✅ **Next.js App Router** - All routes use App Router conventions  
✅ **CRUD via API routes** - All operations through `/app/api/.../route.js`  
✅ **iOS 18+ design** - Clean, glassy, rounded, subtle animations  
✅ **No mock features** - Only implemented features from the problem statement  
✅ **Merge-safe** - No modifications to shared components or teammates' folders  

## ❌ Non-Goals (Not Implemented)

As per requirements, the following were explicitly NOT implemented:
- Authentication logic
- AI recommendations
- Image uploads
- Notifications
- External APIs
- Role management
- Payments
- Maps integration
- Real-time sockets

However, code comments indicate where these features could be integrated in the future.

## 🧪 Testing

The application has been tested with:
- Creating items in Lost & Found
- Creating products in Marketplace
- Creating rides in Cab Pool
- Filtering Lost & Found items
- Deleting items from all modules
- Data persistence across page reloads

## 📝 Future Extensions

The codebase includes comment placeholders for future AI features:

### Lost & Found
```javascript
// Future AI extension point: Add imageUrl field for AI image recognition
```

### Marketplace
```javascript
// Future AI extension point: Add aiPriceSuggestion field for AI pricing engine
```

### Cab Pool
```javascript
// Future extension points:
// - Add pickupLocation for route optimization
// - Add realTimeTracking boolean for future GPS integration
```

## 🎯 Deliverable Checklist

✅ Student Exchange works fully  
✅ CRUD via JSON files  
✅ UI clean & presentable  
✅ Merge-safe implementation  
✅ Zero changes outside assigned directories  
✅ Code is readable and well-commented  
✅ Future AI features documented in comments  

## 📸 Screenshots

The application features:
- Landing page with feature overview
- Exchange Hub with tab navigation
- Lost & Found with filtering
- Marketplace with product cards
- Cab Pool with ride listings
- Modal forms for creating entries

## 👥 Team Integration

This module is designed to work alongside other team members' implementations:
- No modifications to shared components
- Self-contained in designated directories
- API routes follow consistent patterns
- Can be merged without conflicts

---

**Built with ❤️ for AI Fusion Hackathon**
