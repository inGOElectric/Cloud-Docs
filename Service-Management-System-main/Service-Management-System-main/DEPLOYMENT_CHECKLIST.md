# Admin Dashboard - Deployment Checklist

**Before deploying to production, verify all items below:**

---

## ✅ Pre-Deployment Verification

### Environment Configuration
- [ ] NODE_ENV is set to "production"
- [ ] DATABASE_URL points to production database
- [ ] JWT_SECRET is set (strong, random value)
- [ ] PORT is configured (default: 4000)
- [ ] CORS_ORIGIN is set correctly
- [ ] No hardcoded credentials in code

### Database
- [ ] PostgreSQL is running and accessible
- [ ] Database exists and has correct permissions
- [ ] Prisma migrations are up-to-date
  ```bash
  cd backend && npx prisma migrate deploy
  ```
- [ ] Database backups are enabled
- [ ] Connection pool is configured

### Backend
- [ ] All dependencies installed
  ```bash
  cd backend && npm install
  ```
- [ ] Backend starts without errors
  ```bash
  npm run dev  # or node src/index.js
  ```
- [ ] Logs show "🚀 Server running on port 4000"
- [ ] Health check endpoint responds: GET /health
- [ ] Authentication middleware is active
- [ ] CORS middleware is configured

### Frontend
- [ ] All dependencies installed
  ```bash
  cd frontend && npm install
  ```
- [ ] Frontend builds successfully
  ```bash
  npm run build
  ```
- [ ] Build output in `dist/` folder
- [ ] API client points to correct backend URL
- [ ] Environment variables configured
- [ ] No build warnings or errors

### Routes & URLs
- [ ] Backend URL is correct in frontend API client
- [ ] Frontend served from correct domain
- [ ] All route paths are exact matches:
  - [ ] Link to="/job-cards/new" matches route path="/job-cards/new"
  - [ ] Link to="/dashboard/admin" matches route path="/dashboard/admin"
- [ ] Redirect to "/" works for unauthorized access
- [ ] Catch-all route redirects to /dashboard

### Authentication
- [ ] JWT token generation working
- [ ] JWT token validation working
- [ ] Token stored in localStorage
- [ ] Token sent in Authorization header
- [ ] Token refresh mechanism working (if applicable)
- [ ] Logout clears token

### Security
- [ ] HTTPS is enabled (in production)
- [ ] SSL certificate is valid
- [ ] CORS is configured correctly
- [ ] No sensitive data in console logs
- [ ] Password hashing working
- [ ] Role validation is case-sensitive ("ADMIN" not "Admin")
- [ ] Admin-only endpoints require role check
- [ ] No SQL injection vulnerabilities (Prisma ORM)

---

## ✅ Functional Testing

### Admin Dashboard Access
- [ ] Login as ADMIN user succeeds
- [ ] Navigate to /dashboard/admin loads page
- [ ] Table displays with correct columns:
  - [ ] Job Card #
  - [ ] Customer
  - [ ] Vehicle
  - [ ] Service Type
  - [ ] Status
  - [ ] Created
  - [ ] Actions
- [ ] Status badges display with correct colors
- [ ] No redirect to "/" when accessing as ADMIN

### Search Functionality
- [ ] Search box accepts input
- [ ] Searching by job card number works
- [ ] Searching by customer name works
- [ ] Searching by vehicle model works
- [ ] Results update in real-time
- [ ] Empty search shows all records

### Filter Functionality
- [ ] Status filter dropdown works
- [ ] Service type filter dropdown works
- [ ] Filters return correct results
- [ ] Multiple filters work together
- [ ] Clearing filters shows all records

### Create Job Card
- [ ] "+ Create Job Card" button visible
- [ ] Clicking button navigates to /job-cards/new
- [ ] Form displays with all fields
- [ ] Customer Name field validates (required)
- [ ] Mobile Number field validates (10+ digits)
- [ ] VIN Number field validates (required)
- [ ] Vehicle Model field validates (required)
- [ ] Service Date/Time field validates (required)
- [ ] Remarks field is optional
- [ ] Error messages display for invalid input
- [ ] Submit button disabled while loading
- [ ] Form submits successfully
- [ ] Job card number auto-generates
- [ ] Redirects to job card detail page
- [ ] Does NOT redirect to "/"

### Job Card Details
- [ ] Clicking "Open" in table loads detail page
- [ ] All job card information displays
- [ ] Customer information shows
- [ ] Vehicle information shows
- [ ] Can access Inspection tab
- [ ] Can access Complaints tab
- [ ] Can access Parts tab
- [ ] Can access Work Log tab
- [ ] Can access Media uploads

### Access Control
- [ ] ADMIN can access /dashboard/admin
- [ ] ADMIN can create job cards
- [ ] CUSTOMER cannot access /dashboard/admin
- [ ] CUSTOMER can access /job-cards/new
- [ ] TECHNICIAN can access inspection operations
- [ ] Non-logged-in users redirect to "/"
- [ ] Unauthorized access shows redirect, not error page

### Error Handling
- [ ] Network error shows user-friendly message
- [ ] Validation error messages are specific
- [ ] 403 Forbidden handled gracefully
- [ ] 404 Not Found handled gracefully
- [ ] 500 Server Error handled gracefully
- [ ] Loading states display during API calls
- [ ] Error messages don't expose sensitive info

---

## ✅ API Testing

### GET /api/job-cards/search
- [ ] Requires JWT token
- [ ] Returns data in format: { data: [...] }
- [ ] Search by query parameter works
- [ ] Returns correct results
- [ ] Handles case-insensitive search
- [ ] Returns empty array when no match

### POST /api/job-cards
- [ ] Requires JWT token
- [ ] Requires ADMIN role (403 if not)
- [ ] Validates request schema
- [ ] Auto-generates job card number
- [ ] Creates customer record
- [ ] Updates customer if exists
- [ ] Creates vehicle record
- [ ] Updates vehicle if exists
- [ ] Returns 201 Created
- [ ] Returns complete job card object

### GET /api/job-cards/:id
- [ ] Requires JWT token
- [ ] Returns job card object
- [ ] Includes customer relationship
- [ ] Includes vehicle relationship
- [ ] Includes all related records
- [ ] Returns 404 if not found

### PATCH /api/job-cards/:id/status
- [ ] Requires JWT token
- [ ] Requires ADMIN role (403 if not)
- [ ] Validates status transition
- [ ] Updates status correctly
- [ ] Sets closedAt on CLOSED
- [ ] Returns updated job card
- [ ] Rejects invalid transitions

---

## ✅ Performance & Stability

### Database Performance
- [ ] Job card queries complete < 1s
- [ ] Search queries complete < 1s
- [ ] No N+1 query problems
- [ ] Indexes on frequently queried fields
- [ ] Connection pool working

### Frontend Performance
- [ ] Page load time < 3s
- [ ] Table renders with < 100ms delay
- [ ] Search results update immediately
- [ ] No memory leaks on component unmount
- [ ] Lazy loading implemented (if needed)

### Backend Performance
- [ ] API response time < 500ms
- [ ] No console warnings or errors
- [ ] Memory usage stable
- [ ] CPU usage normal
- [ ] No hanging requests

### Stability
- [ ] Backend stays running (no crashes)
- [ ] Frontend doesn't crash on errors
- [ ] Handles concurrent requests
- [ ] Handles rapid clicks/submissions
- [ ] Handles network disconnections

---

## ✅ Browser Compatibility

Test on:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

Verify:
- [ ] Page layout is responsive
- [ ] Tables display correctly
- [ ] Forms are usable
- [ ] Buttons are clickable
- [ ] No console errors

---

## ✅ Mobile Testing (if applicable)

- [ ] Dashboard is responsive on mobile
- [ ] Table scrolls horizontally
- [ ] Forms are touch-friendly
- [ ] Search works on mobile
- [ ] Filters work on mobile

---

## ✅ Documentation

- [ ] README.md is up-to-date
- [ ] API documentation is accurate
- [ ] User guide is accessible
- [ ] Troubleshooting guide is comprehensive
- [ ] Deployment instructions are clear
- [ ] Comments in code are helpful

---

## ✅ Backup & Recovery

- [ ] Database backup completed
- [ ] Backup restore tested
- [ ] Data migration strategy documented
- [ ] Rollback plan documented
- [ ] Crisis response plan documented

---

## ✅ Monitoring & Logging

- [ ] Error logs are being captured
- [ ] Application logs are available
- [ ] Log rotation configured
- [ ] Log retention policy set
- [ ] Monitoring alerts configured
- [ ] Dashboard for system health available

---

## ✅ Post-Deployment

After successful deployment:

### Immediate (within 1 hour)
- [ ] Verify all endpoints responding
- [ ] Check error logs for issues
- [ ] Monitor system resources
- [ ] Test key user workflows
- [ ] Verify backups are active

### Short-term (within 24 hours)
- [ ] Monitor error rate
- [ ] Check performance metrics
- [ ] Gather user feedback
- [ ] Review logs for any warnings
- [ ] Verify data integrity

### Ongoing
- [ ] Daily log reviews
- [ ] Weekly performance reports
- [ ] Monthly security audits
- [ ] Quarterly backup restoration tests
- [ ] Regular security updates

---

## 🚨 Rollback Plan

If issues occur, rollback by:
1. Revert code to previous commit
2. Rebuild frontend: `npm run build`
3. Restart backend
4. Verify all endpoints respond
5. Restore from backup if data corrupted

---

## 📞 Support Contacts

**Development Issues:**
- Backend: Check server logs
- Frontend: Check browser console
- Database: Check connections

**User Issues:**
- Share error message
- Reproduce steps
- Check error logs
- Escalate if needed

---

## ✅ Final Checklist

Before marking as "READY FOR PRODUCTION":
- [ ] All items above checked
- [ ] No critical warnings
- [ ] Performance acceptable
- [ ] Security verified
- [ ] Backups confirmed
- [ ] Team trained
- [ ] Documentation complete
- [ ] Support plan ready

---

**READY FOR PRODUCTION:** _______ (date)  
**DEPLOYED BY:** ________________ (name)  
**VERIFIED BY:** ________________ (name)

---

Once all items are checked, the Admin Dashboard is ready for production deployment!
