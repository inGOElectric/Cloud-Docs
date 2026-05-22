# Admin Dashboard - Quick Start Guide

**For NON-TECHNICAL Users**

---

## 🎯 What is the Admin Dashboard?

A web-based system to manage all vehicle service job cards without using any technical tools or databases.

---

## 🚀 Getting Started

### Step 1: Login
1. Open the web application
2. Click "Staff Login"
3. Enter your ADMIN credentials
4. You'll see the Admin Dashboard

### Step 2: Access Admin Dashboard
- After login, click the **Admin Dashboard** link in the navigation menu
- You'll see a table of all job cards in the system

---

## 📋 Admin Dashboard Features

### The Job Cards Table

The table shows all vehicle service requests with these columns:

| Column | What it shows |
|--------|--------------|
| Job Card # | Unique identifier (e.g., JC-000001) |
| Customer | Customer's name |
| Vehicle | Vehicle model |
| Service Type | Type of service (General, Complaint, Battery, Charger) |
| Status | Current status (Open, In Progress, Completed, Closed) |
| Created | Date job card was created |
| Actions | Links to view/edit job card |

---

## 🔍 Search & Filter

### Search by Text
1. Type in the **Search** box at the top
2. You can search by:
   - Job Card Number (e.g., "JC-000001")
   - Customer Name (e.g., "John Smith")
   - Vehicle Model (e.g., "Honda Civic")

### Filter by Status
1. Click the **"Filter by Status"** dropdown
2. Select a status:
   - **All Status** - Show all records
   - **Open** - New job cards not started
   - **In Progress** - Work is being done
   - **Completed** - Work is done
   - **Pending Payment** - Waiting for payment
   - **Closed** - Job finished and closed

### Filter by Service Type
1. Click the **"Filter by Service Type"** dropdown
2. Select a type:
   - **All Types** - Show all records
   - **General** - Regular maintenance
   - **Complaint** - Customer complaint
   - **Battery** - Battery service
   - **Charger** - Charger service

### Combine Filters
You can use search AND filters together:
- Search for "John Smith" AND Filter Status = "Open"
- This shows only open job cards for John Smith

---

## ➕ Create a New Job Card

### Step 1: Click "+ Create Job Card"
The green button at the top of the page.

### Step 2: Fill in Customer Information

**Service Type** (required)
- Select from dropdown: General, Complaint, Battery, Charger

**Service Date & Time** (required)
- Click the date/time field
- Select when the service is scheduled

**Customer Name** (required)
- Enter the customer's full name
- Example: "John Smith"

**Customer Mobile** (required)
- Enter mobile number (10+ digits)
- Example: "9876543210"

### Step 3: Fill in Vehicle Information

**VIN Number** (required)
- Enter the Vehicle Identification Number
- Usually found on the dashboard or door frame
- Example: "5TDJKRFH7LS123456"

**Vehicle Model** (required)
- Enter the vehicle model
- Example: "Honda Civic 2022"

### Step 4: Additional Information

**Remarks** (optional)
- Add any special notes about the service
- Example: "Customer requested pickup and drop"

### Step 5: Submit
1. Click **"Create Job Card"** button
2. System will:
   - Generate a unique job card number automatically
   - Create customer record if new
   - Create vehicle record if new
   - Show the new job card details

---

## 🔍 View Job Card Details

### Click "Open" in Actions
1. From the table, find the job card
2. Click the blue **"Open"** link
3. See full details:
   - Job card number
   - Customer information
   - Vehicle information
   - Service type and status
   - Created date
   - Any remarks

---

## 🛠️ Job Card Actions

From the job card detail view, you can:

### Inspect Tab
- Add technical inspection details
- Record vehicle condition
- Note any issues found

### Complaints Tab
- Record customer complaints
- Track complaint status
- Add resolution notes

### Parts Tab
- Add/replace parts used
- Track inventory
- Record part costs

### Work Log Tab
- Log work performed
- Record hours spent
- Track progress

### Media
- Upload photos of damage
- Upload video documentation
- Store service records

---

## ✏️ Color Codes in Table

Status badges are color-coded for quick recognition:

- 🟢 **Green (OPEN)** - New, not started
- 🟡 **Yellow (IN_PROGRESS)** - Work in progress
- 🔵 **Blue (COMPLETED)** - Work completed
- ⚫ **Gray (CLOSED)** - Finished and closed
- 🟠 **Orange (PENDING_PAYMENT)** - Waiting for payment

---

## ❓ FAQ

### Q: How do I search for a specific job card?
**A:** Type in the Search box at the top. You can search by:
- Job card number (JC-000001)
- Customer name (John Smith)
- Vehicle model (Honda Civic)

### Q: Can I delete a job card?
**A:** Only OPEN job cards can be deleted. Once work starts, the record is permanent for audit purposes.

### Q: What if I make a mistake entering customer details?
**A:** The system allows updating customer and vehicle information. Just recreate the record if needed.

### Q: Can multiple people create job cards at the same time?
**A:** Yes, the system safely handles multiple users creating jobs simultaneously. Each gets a unique number.

### Q: How are job card numbers generated?
**A:** Automatically by the system:
- First job card: JC-000001
- Second job card: JC-000002
- And so on...

### Q: Can I see all job cards or just mine?
**A:** Admin can see ALL job cards in the system.

### Q: What if the page shows an error?
**A:** 
1. Check your internet connection
2. Refresh the page
3. Try again
4. If error persists, contact support

---

## 🔐 Security Notes

- Your login is secure (encrypted connection)
- Each user has their own login
- Only ADMIN users can create job cards
- Passwords are never stored in plain text
- All actions are logged for audit

---

## 📞 Need Help?

If you encounter issues:
1. Check your internet connection
2. Clear browser cache (Ctrl+Shift+Delete)
3. Refresh the page (Ctrl+R)
4. Try logging out and back in
5. Contact IT support if problem persists

---

**Remember:** This web application is designed for NON-TECHNICAL users. There's no need to use any database tools like Prisma Studio. Everything is done through the web interface!
