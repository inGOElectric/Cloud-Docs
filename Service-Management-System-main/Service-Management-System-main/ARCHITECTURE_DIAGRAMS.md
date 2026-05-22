# Staff Login - Architecture & Flow Diagrams

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         SERVICE MANAGEMENT SYSTEM                │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                          FRONTEND (React)                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────┐         ┌──────────────────────────────┐ │
│  │  PUBLIC PAGES    │         │   PROTECTED DASHBOARDS       │ │
│  ├──────────────────┤         ├──────────────────────────────┤ │
│  │ • HomePage       │         │ • AdminDashboard             │ │
│  │ • CustomerLogin  │         │ • ServiceAdvisorDashboard    │ │
│  │ • StaffLogin ✨  │         │ • TechnicianDashboard        │ │
│  │                  │         │ • SupplyChainDashboard       │ │
│  └──────────────────┘         │ • SalesDashboard             │ │
│                               │                              │ │
│  RoleBasedRoute Guard ✨      │ Job Card Operations          │ │
│  - Checks user.role           │ (CUSTOMER only)              │ │
│  - Prevents unauthorized      └──────────────────────────────┘ │
│  - Redirects to home                                           │
│                                                                │
│  AuthProvider (useAuth Hook) ✨                               │
│  - Stores token + user                                        │
│  - Restores session on mount                                  │
│  - Provides login/logout                                      │
└─────────────────────────────────────────────────────────────────┘
         ↕ JWT Token (Authorization: Bearer)
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND (Node.js/Express)                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Public Routes (No Auth)                                 │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │ POST /api/auth/login          → login()                 │   │
│  │ POST /api/auth/staff/login ✨ → staffLogin() ✨         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                           ↓                                      │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  authenticate() Middleware                              │   │
│  │  - Validates JWT token                                 │   │
│  │  - Extracts user (id, role)                            │   │
│  │  - Attaches to req.user                                │   │
│  └─────────────────────────────────────────────────────────┘   │
│                           ↓                                      │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Protected Routes (Requires Auth)                       │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │ GET  /api/job-cards                                     │   │
│  │ POST /api/job-cards                                     │   │
│  │ (all protected with authorizeRoles middleware)          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Database (PostgreSQL + Prisma)                         │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │ User {                                                  │   │
│  │   id, name, email, passwordHash,                        │   │
│  │   role: ADMIN | CUSTOMER | SERVICE_ADVISOR |           │   │
│  │         TECHNICIAN | SUPPLY_CHAIN | SALES ✨           │   │
│  │ }                                                        │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Authentication Flow - Customer

```
USER                    FRONTEND                BACKEND              DATABASE
 │                         │                       │                    │
 ├──(visit /)──────────────→│                       │                    │
 │                         │◄──(HomePage)──────────│                    │
 │                         │                       │                    │
 ├──(click Customer Login)─→│                       │                    │
 │                         │◄──(Login Page)────────│                    │
 │                         │                       │                    │
 ├──(enter email/password)─→│                       │                    │
 │◄──(handleSubmit)────────┤                       │                    │
 │                         │──POST /api/auth/login─→│                    │
 │                         │                       ├──(verify password)──→│
 │                         │                       │◄──(user data)───────│
 │                         │◄──({token, user})────┤                    │
 │                         │                       │                    │
 │◄─(setUser + navigate)───│                       │                    │
 │                         │                       │                    │
 ├──(redirect /dashboard)──→│                       │                    │
 │                         │◄──(Dashboard)─────────│                    │
 │                         │   [role=CUSTOMER]     │                    │
 │                         │                       │                    │
```

---

## Authentication Flow - Staff (SERVICE_ADVISOR)

```
USER                    FRONTEND                BACKEND              DATABASE
 │                         │                       │                    │
 ├──(visit /login/staff)───→│                       │                    │
 │                         │◄──(StaffLogin Page)───│                    │
 │                         │                       │                    │
 ├──(enter email/password)─→│                       │                    │
 │◄──(handleSubmit)────────┤                       │                    │
 │                         │──POST /auth/staff/login→│                   │
 │                         │                       ├──(verify password)──→│
 │                         │                       ├──(check role)────────→
 │                         │                       │◄──(user: SERVICE_ADV)│
 │                         │◄──({token, user})────┤                    │
 │                         │                       │                    │
 │◄─(setUser)──────────────│                       │                    │
 │                         │   {id: 2,             │                    │
 │                         │    role: SERVICE_ADVISOR}                   │
 │                         │                       │                    │
 │◄─(navigate based on role│                       │                    │
 │   SERVICE_ADVISOR       │                       │                    │
 │   → /dashboard/         │                       │                    │
 │     service-advisor)────│                       │                    │
 │                         │                       │                    │
 ├──(redirect /dash...)────→│                       │                    │
 │                         │◄──(ServiceAdvisor────┤                    │
 │                         │    Dashboard)        │                    │
 │                         │   [role=             │                    │
 │                         │   SERVICE_ADVISOR]   │                    │
 │                         │                       │                    │
```

---

## Route Guard Logic - RoleBasedRoute

```
User tries to access /dashboard/admin
                ↓
    ┌─────────────────────────────┐
    │ Is user authenticated?       │ NO
    │ (user !== null)              ├────→ Redirect to /
    └─────────────────────────────┘
                ↓ YES
    ┌─────────────────────────────┐
    │ Is user.role in              │ NO
    │ allowedRoles?                ├────→ Redirect to /
    │ e.g., ["ADMIN"]              │
    └─────────────────────────────┘
                ↓ YES
    ┌─────────────────────────────┐
    │ Render children              │
    │ (Component)                  │
    └─────────────────────────────┘
```

---

## Role Matrix - Who Can Access What

```
┌────────────────┬──────────┬──────────┬──────────┬────────────┐
│ ROUTE          │ CUSTOMER │ ADMIN    │ ADVISOR  │ TECHNICIAN │
├────────────────┼──────────┼──────────┼──────────┼────────────┤
│ /              │ ✅ Public│ ✅ Public│ ✅ Public│ ✅ Public  │
│ /login/        │          │          │          │            │
│  customer      │ ✅       │ ✅       │ ✅       │ ✅         │
│ /login/staff   │ ❌       │ ✅       │ ✅       │ ✅         │
├────────────────┼──────────┼──────────┼──────────┼────────────┤
│ /dashboard     │ ✅       │ ❌       │ ❌       │ ❌         │
│ /dashboard/    │          │          │          │            │
│  admin         │ ❌       │ ✅       │ ❌       │ ❌         │
│ /dashboard/    │          │          │          │            │
│  service-      │          │          │          │            │
│  advisor       │ ❌       │ ❌       │ ✅       │ ❌         │
│ /dashboard/    │          │          │          │            │
│  technician    │ ❌       │ ❌       │ ❌       │ ✅         │
├────────────────┼──────────┼──────────┼──────────┼────────────┤
│ /job-cards/*   │ ✅       │ ❌       │ ❌       │ ❌         │
│ (all job card  │          │          │          │            │
│  operations)   │          │          │          │            │
└────────────────┴──────────┴──────────┴──────────┴────────────┘

Legend: ✅ = Can access  |  ❌ = Cannot access
```

---

## Session Restoration Flow

```
User opens browser (or refreshes page)
                ↓
    ┌─────────────────────────────┐
    │ App Mounts                   │
    │ (AuthProvider useEffect)     │
    └─────────────────────────────┘
                ↓
    ┌─────────────────────────────┐
    │ Check localStorage.token     │
    │ exists?                      │ NO
    │                              ├────→ user = null
    └─────────────────────────────┘
                ↓ YES
    ┌─────────────────────────────┐
    │ Decode JWT payload           │
    │ Extract: { id, role }        │
    └─────────────────────────────┘
                ↓
    ┌─────────────────────────────┐
    │ Valid JWT?                   │ NO
    │ (has id AND role)            ├────→ Clear token
    │                              │      user = null
    └─────────────────────────────┘
                ↓ YES
    ┌─────────────────────────────┐
    │ setUser({ id, role })        │
    │ User session restored! ✅    │
    └─────────────────────────────┘
```

---

## Login Endpoint Comparison

```
CUSTOMER LOGIN                      STAFF LOGIN (NEW)
┌──────────────────────────────┐    ┌──────────────────────────────┐
│ POST /api/auth/login         │    │ POST /api/auth/staff/login ✨ │
├──────────────────────────────┤    ├──────────────────────────────┤
│ Request: {                   │    │ Request: {                   │
│   email: "...",              │    │   email: "...",              │
│   password: "..."            │    │   password: "..."            │
│ }                            │    │ }                            │
├──────────────────────────────┤    ├──────────────────────────────┤
│ 1. Find user by email        │    │ 1. Find user by email        │
│ 2. Verify password           │    │ 2. Verify password           │
│ 3. Issue JWT                 │    │ 3. CHECK role !== CUSTOMER ✨ │
│ 4. Return { token, user }    │    │ 4. Issue JWT                 │
│                              │    │ 5. Return { token, user }    │
│                              │    │                              │
│ No role checks               │    │ Rejects CUSTOMER with:       │
│                              │    │ 403 "Customers must use      │
│                              │    │     customer login"          │
└──────────────────────────────┘    └──────────────────────────────┘
```

---

## State Flow Diagram

```
INITIAL STATE
┌─────────────────────────┐
│ user = null             │
│ token = null            │
│ loggedIn = false        │
└─────────────────────────┘
         ↓
    User visits /login/customer or /login/staff
         ↓
    User enters credentials
         ↓
    Frontend calls:
    /auth/login OR /auth/staff/login
         ↓
    ┌─────────────────────────────┐
    │ LOGGED IN STATE             │
    ├─────────────────────────────┤
    │ user = { id, role }         │
    │ token = JWT string          │
    │ loggedIn = true             │
    │                             │
    │ Role determines access:     │
    │ - CUSTOMER → /dashboard    │
    │ - ADMIN → /dashboard/admin │
    │ - SERVICE_ADVISOR →        │
    │   /dashboard/service-…     │
    │ - etc.                      │
    └─────────────────────────────┘
         ↓
    User navigates within authorized routes
    OR
    User tries to access unauthorized route
         ↓
    RoleBasedRoute checks user.role
    against allowedRoles
         ↓
    ┌──────────────────┐  ┌─────────────────┐
    │ Role matches?    │  │ Role NOT match?  │
    │ ✅ YES           │  │ ❌ NO            │
    │ Render component │  │ Redirect to /    │
    └──────────────────┘  └─────────────────┘
         ↓
    User clicks logout (future)
         ↓
    ┌─────────────────────────────┐
    │ LOGGED OUT STATE            │
    ├─────────────────────────────┤
    │ user = null                 │
    │ token = null                │
    │ localStorage cleared        │
    │ Redirect to /               │
    └─────────────────────────────┘
```

---

## JWT Token Lifecycle

```
┌────────────────────────────────────────────────────────────┐
│ 1. LOGIN                                                   │
│    POST /auth/login or /auth/staff/login                   │
│    ↓                                                       │
│    Backend verifies credentials                            │
│    ↓                                                       │
│    jwt.sign({ id, role }, JWT_SECRET, { expiresIn: "1d"})│
│    ↓                                                       │
│    Returns: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...."  │
└────────────────────────────────────────────────────────────┘
                              ↓
┌────────────────────────────────────────────────────────────┐
│ 2. STORAGE                                                 │
│    Frontend receives token                                 │
│    ↓                                                       │
│    localStorage.setItem("token", token)                    │
│    ↓                                                       │
│    Stored in browser local storage                         │
└────────────────────────────────────────────────────────────┘
                              ↓
┌────────────────────────────────────────────────────────────┐
│ 3. USAGE                                                   │
│    Every API request includes:                             │
│    Authorization: Bearer <token>                           │
│    ↓                                                       │
│    Backend middleware verifies JWT                         │
│    ↓                                                       │
│    Extracts payload: { id, role }                          │
│    ↓                                                       │
│    Attaches to req.user for route handlers                │
└────────────────────────────────────────────────────────────┘
                              ↓
┌────────────────────────────────────────────────────────────┐
│ 4. SESSION PERSISTENCE                                     │
│    User refreshes page                                     │
│    ↓                                                       │
│    useEffect on app mount                                  │
│    ↓                                                       │
│    localStorage.getItem("token")                           │
│    ↓                                                       │
│    atob() decode payload                                   │
│    ↓                                                       │
│    setUser({ id, role })                                  │
│    ↓                                                       │
│    User session restored ✅                               │
└────────────────────────────────────────────────────────────┘
                              ↓
┌────────────────────────────────────────────────────────────┐
│ 5. EXPIRATION                                              │
│    Token expires after 24 hours (1d)                       │
│    ↓                                                       │
│    Next API call fails with 401 Unauthorized               │
│    ↓                                                       │
│    Frontend catches error                                  │
│    ↓                                                       │
│    User redirected to login page (future implementation)   │
│    ↓                                                       │
│    localStorage cleared                                    │
└────────────────────────────────────────────────────────────┘
```

---

## Future Extension - Technician Role Expanded

```
CURRENT (PLACEHOLDER)          FUTURE IMPLEMENTATION
┌──────────────────────────┐   ┌────────────────────────────┐
│ TechnicianDashboard      │   │ TechnicianDashboard        │
├──────────────────────────┤   ├────────────────────────────┤
│                          │   │                            │
│ □ Assigned Work          │   │ ✅ Assigned Work           │
│   TODO: Load work...     │ → │   • List of assigned jobs  │
│                          │   │   • Filter by status       │
│ □ Work Logs              │   │   • Quick actions          │
│   TODO: Build interface..│ → │ ✅ Work Logs               │
│                          │   │   • Time tracking          │
│ □ Technical Resources    │   │   • Activity logging       │
│   TODO: Link documents...│ → │ ✅ Technical Resources     │
│                          │   │   • Manuals & guides       │
│ □ Performance            │   │   • Video tutorials        │
│   TODO: Show metrics...  │ → │ ✅ Performance             │
│                          │   │   • Jobs completed         │
│                          │   │   • Average time per job   │
│                          │   │   • Customer ratings       │
│                          │   │                            │
└──────────────────────────┘   └────────────────────────────┘

Each TODO can be implemented independently
without affecting other roles or dashboards
```

---

## Key Components Hierarchy

```
App
├── Routes
│   ├── / (HomePage)
│   ├── /login/customer (Login)
│   ├── /login/staff (StaffLogin) ✨
│   ├── /dashboard (RoleBasedRoute → Dashboard) ✨
│   │   └── Requires: role = CUSTOMER
│   ├── /dashboard/admin (RoleBasedRoute → AdminDashboard) ✨
│   │   └── Requires: role = ADMIN
│   ├── /dashboard/service-advisor (RoleBasedRoute → ServiceAdvisorDashboard) ✨
│   │   └── Requires: role = SERVICE_ADVISOR
│   ├── /dashboard/technician (RoleBasedRoute → TechnicianDashboard) ✨
│   │   └── Requires: role = TECHNICIAN
│   ├── /dashboard/supply-chain (RoleBasedRoute → SupplyChainDashboard) ✨
│   │   └── Requires: role = SUPPLY_CHAIN
│   ├── /dashboard/sales (RoleBasedRoute → SalesDashboard) ✨
│   │   └── Requires: role = SALES
│   └── /job-cards/* (RoleBasedRoute → Components) ✨
│       └── Requires: role = CUSTOMER
│
├── AuthProvider
│   ├── useAuth Hook
│   ├── Token restoration on mount
│   └── Session state management
│
└── ProtectedRoute / RoleBasedRoute ✨
    ├── Check authentication
    └── Check authorization by role
```

---

## Summary of Changes with Emphasis

```
BACKEND                         FRONTEND
┌────────────────────────────┐ ┌────────────────────────────┐
│ • Prisma Schema            │ │ • StaffLogin Page ✨       │
│   - Extended Role enum ✨  │ │ • 5 Role Dashboards ✨     │
│                            │ │ • RoleBasedRoute ✨        │
│ • Auth Controller          │ │ • Updated Router ✨        │
│   - staffLogin() ✨        │ │ • Auth Hook Update ✨      │
│                            │ │ • HomePage integration ✅  │
│ • Auth Routes              │ │ • Existing Login ✅        │
│   - /staff/login ✨        │ │                            │
│                            │ │ NO NEW DEPENDENCIES        │
│ NO DATA MIGRATIONS         │ │ NO BREAKING CHANGES        │
│ NO BREAKING CHANGES        │ │ BACKWARD COMPATIBLE ✅     │
└────────────────────────────┘ └────────────────────────────┘
         ↓                              ↓
    Secure staff                 Clean role-based
    authentication               routing & guards
         ↓                              ↓
    ┌────────────────────────────────────────┐
    │  INTEGRATED SYSTEM                     │
    │                                        │
    │  Customers → /dashboard                │
    │  Admin → /dashboard/admin              │
    │  Service Advisor → /dashboard/         │
    │                   service-advisor      │
    │  etc.                                  │
    │                                        │
    │  All with proper role-based guards     │
    │  and session persistence ✅            │
    └────────────────────────────────────────┘
```

Legend: ✨ = New  |  ✅ = Verified working  |  📋 = TODO for future
