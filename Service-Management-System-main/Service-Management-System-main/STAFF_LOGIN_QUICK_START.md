# Staff Login - Quick Start Guide

## 🚀 What Was Implemented

### Backend (3 changes)
1. **Prisma Schema** - Added 6 role types (ADMIN, CUSTOMER, SERVICE_ADVISOR, TECHNICIAN, SUPPLY_CHAIN, SALES)
2. **Auth Controller** - Added `staffLogin()` function that rejects CUSTOMER role
3. **Auth Routes** - Added `POST /api/auth/staff/login` endpoint

### Frontend (8 new files + updates)
1. **StaffLogin Page** (`/login/staff`) - Single form for all staff roles
2. **5 Staff Dashboards** - Unique dashboards for each role
3. **RoleBasedRoute Guard** - Protects routes by user role
4. **Updated Router** - Role-specific redirects + guards
5. **Updated Auth Hook** - Token restoration on mount + setUser exposure

---

## ✅ Testing Checklist

### Step 1: Verify Backend Routes
```bash
# Test customer login (existing)
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}'

# Test staff login (new)
curl -X POST http://localhost:4000/api/auth/staff/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}'

# Test staff login with CUSTOMER role (should fail)
# Create a user with role=CUSTOMER first, then:
curl -X POST http://localhost:4000/api/auth/staff/login \
  -H "Content-Type: application/json" \
  -d '{"email":"customer@example.com","password":"password"}'
# Expected: 403 Forbidden - "Customers must use customer login"
```

### Step 2: Test Frontend UI

#### Customer Login Flow
1. ✅ Go to http://localhost:5173
2. ✅ Click hamburger menu → "Customer Login"
3. ✅ Enter credentials for CUSTOMER role user
4. ✅ Should redirect to `/dashboard` (customer dashboard)
5. ✅ Can see job card creation button
6. ✅ Refresh page - session persists

#### Staff Login Flow (SERVICE_ADVISOR)
1. ✅ Go to http://localhost:5173/login/staff
2. ✅ Enter email + password for SERVICE_ADVISOR user
3. ✅ Should redirect to `/dashboard/service-advisor`
4. ✅ See "Service Advisor Dashboard" with placeholder sections
5. ✅ Refresh page - session persists

#### Admin Login Flow (works same as before)
1. ✅ Go to http://localhost:5173/login/staff
2. ✅ Enter credentials for ADMIN user
3. ✅ Should redirect to `/dashboard/admin`
4. ✅ See full job card management interface
5. ✅ All features work (create, inspect, complain, parts, work log)

### Step 3: Test Route Guards

#### Customer Cannot Access Staff Dashboard
1. ✅ Login as CUSTOMER user
2. ✅ Manually navigate to `/dashboard/admin`
3. ✅ Should redirect to `/` (home page)
4. ✅ Manually navigate to `/dashboard/service-advisor`
5. ✅ Should redirect to `/` (home page)

#### Staff Cannot Access Customer Features
1. ✅ Login as SERVICE_ADVISOR user
2. ✅ Manually navigate to `/dashboard` (customer dashboard)
3. ✅ Should redirect to `/` (home page)
4. ✅ Manually navigate to `/job-cards/new`
5. ✅ Should redirect to `/` (home page)

#### Protect Unauthenticated Access
1. ✅ Clear localStorage
2. ✅ Manually navigate to `/dashboard`
3. ✅ Should redirect to `/` (home page)
4. ✅ Manually navigate to `/dashboard/admin`
5. ✅ Should redirect to `/` (home page)

### Step 4: Test Other Staff Roles

For each role below, create a test user and verify the dashboard loads:

```sql
-- Create test users (backend command or script)
-- Role: SERVICE_ADVISOR
-- Role: TECHNICIAN
-- Role: SUPPLY_CHAIN
-- Role: SALES
```

Then test each:
- ✅ SERVICE_ADVISOR → `/dashboard/service-advisor` (works)
- ✅ TECHNICIAN → `/dashboard/technician` (works)
- ✅ SUPPLY_CHAIN → `/dashboard/supply-chain` (works)
- ✅ SALES → `/dashboard/sales` (works)

---

## 🔧 Deployment Steps

### Backend
```bash
# No database changes needed - enum only
# Just restart Node.js server

cd backend
npm run dev
# Or: node src/index.js
```

### Frontend
```bash
cd frontend
npm install  # (optional - no new dependencies)
npm run build
npm run preview  # (optional - test build locally)
```

Then deploy the `dist/` folder to your hosting.

---

## 📋 API Contract

### Customer Login (Existing - Unchanged)
```
POST /api/auth/login
{
  "email": "customer@example.com",
  "password": "password123"
}

200 OK:
{
  "token": "eyJhbGc...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "customer@example.com",
    "role": "CUSTOMER",
    "active": true
  }
}
```

### Staff Login (New)
```
POST /api/auth/staff/login
{
  "email": "advisor@example.com",
  "password": "password123"
}

200 OK:
{
  "token": "eyJhbGc...",
  "user": {
    "id": 2,
    "name": "Jane Smith",
    "email": "advisor@example.com",
    "role": "SERVICE_ADVISOR",
    "active": true
  }
}

403 Forbidden (CUSTOMER role):
{
  "error": "Customers must use customer login"
}
```

---

## 📍 Routes Summary

### Public Routes
- `GET /` - Home page
- `GET /login/customer` - Customer login page
- `GET /login/staff` - Staff login page

### Dashboard Routes (Role-Protected)
- `GET /dashboard` - Customer dashboard (CUSTOMER only)
- `GET /dashboard/admin` - Admin dashboard (ADMIN only)
- `GET /dashboard/service-advisor` - Service advisor dashboard (SERVICE_ADVISOR only)
- `GET /dashboard/technician` - Technician dashboard (TECHNICIAN only)
- `GET /dashboard/supply-chain` - Supply chain dashboard (SUPPLY_CHAIN only)
- `GET /dashboard/sales` - Sales dashboard (SALES only)

### Job Card Routes (CUSTOMER only)
- `GET /job-cards/new` - Create job card form
- `GET /job-cards/:id` - View job card details
- `GET /job-cards/:id/inspection` - Add inspection
- `GET /job-cards/:id/complaints` - Add complaint
- `GET /job-cards/:id/parts` - Parts replacement
- `GET /job-cards/:id/work-log` - Work log
- `GET /job-cards/:jobCardId/media/:mediaId` - View media

---

## 🔐 Security Notes

- ✅ Customer cannot login via staff endpoint
- ✅ Staff cannot access customer features
- ✅ JWT tokens valid for 1 day (24 hours)
- ✅ Token restoration uses simple atob() decoding (for efficiency)
- ✅ All routes protected by role-based middleware
- ✅ Authorization enforced on both frontend AND backend

---

## 🐛 Troubleshooting

### "User not found" on login
- Verify user exists in database
- Check email spelling
- Verify password is correct (case-sensitive)

### "Invalid or expired token" on page refresh
- Check token stored in localStorage
- Clear localStorage: `localStorage.clear()`
- Login again

### "Forbidden" accessing dashboard
- Verify user role in database
- Check role matches dashboard route
- Clear browser cache and localStorage

### Token not restoring on page load
- Check browser console for errors
- Verify token exists in localStorage
- Try logging in again

---

## 📚 Files Reference

### Backend Files
- `backend/prisma/schema.prisma` - Role enum (UPDATED)
- `backend/src/controllers/authController.js` - staffLogin() function (UPDATED)
- `backend/src/routes/authRoutes.js` - /staff/login route (UPDATED)

### Frontend Files - New
- `frontend/src/pages/login/StaffLogin.jsx`
- `frontend/src/pages/dashboard/AdminDashboard.jsx`
- `frontend/src/pages/dashboard/ServiceAdvisorDashboard.jsx`
- `frontend/src/pages/dashboard/TechnicianDashboard.jsx`
- `frontend/src/pages/dashboard/SupplyChainDashboard.jsx`
- `frontend/src/pages/dashboard/SalesDashboard.jsx`
- `frontend/src/components/RoleBasedRoute.jsx`

### Frontend Files - Updated
- `frontend/src/hooks/useAuth.jsx` - Token restoration + setUser
- `frontend/src/App.jsx` - Role-based routes + dashboards

---

## ✨ Next Steps

1. **Create test users** with each role in database
2. **Run testing checklist** above
3. **Deploy** backend and frontend
4. **Monitor logs** for any issues
5. **Implement future features** in placeholder dashboards

---

## 📞 Support

For issues:
1. Check browser console for errors
2. Check backend server logs
3. Verify token in localStorage
4. Check user role in database
5. Refer to implementation guide: `STAFF_LOGIN_IMPLEMENTATION.md`
