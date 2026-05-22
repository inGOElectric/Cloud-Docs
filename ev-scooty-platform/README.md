# EV Scooty Platform

EV Scooty Platform is a service and test ride management system for an electric scooty business. It supports customer service booking, admin job card creation, technician repair workflow, vehicle inspection, work logs, spare part requests, and public test ride booking.

## Tech Stack

- Frontend: React, Vite, React Router, Axios
- Backend: Django, Django REST Framework
- Authentication: JWT using Simple JWT
- Database: PostgreSQL
- Styling: Plain CSS in `frontend/src/index.css`
- Main language: JavaScript and Python

## Project Structure

```text
ev-scooty-platform/
  backend/
    accounts/       User roles and customer profile models
    vehicles/       Vehicle registration and vehicle data
    service/        Service bookings, job cards, inspections, work logs, parts
    test_rides/     Public test ride booking and slot availability
    config/         Django settings, URLs, ASGI/WSGI
    manage.py

  frontend/
    public/         Images, bike assets, videos
    src/
      api/client.js API client and JWT refresh logic
      App.jsx       Main React routes and page components
      index.css     Main styling
    package.json
```

## Main Roles

### Admin / Service Advisor

Can:

- View service workflow
- Create job cards from service bookings
- Assign technicians
- View inspections, work logs, spare requests
- Approve, reject, and issue spare part requests
- View test ride records if exposed in admin tools

### Technician

Can:

- View assigned job cards only
- Save odometer and battery voltage readings
- Submit vehicle inspection
- Add work logs under complaints
- Complete work logs
- Raise spare part requests
- Close job cards after required conditions are met

### Customer

Can:

- Login and view registered vehicles
- Book service
- Track service workflow
- View job card progress
- Raise complaints against existing job cards
- Book test rides from the public page

## Core Service Workflow

```text
Customer creates service booking
Admin reviews booking
Admin creates job card and assigns technician
Technician saves readings
Technician submits inspection
Technician adds work logs under complaints
Technician requests spare parts if needed
Admin approves, rejects, or issues spare parts
Technician completes work logs
Technician closes job card
Customer tracks progress
```

Important rules:

- A job card belongs to one service booking.
- Complaints are attached to the job card after job card creation.
- Work logs must be under their respective complaint.
- Job card cannot be closed until inspection is submitted.
- Job card cannot be closed until at least one work log is completed.
- Job card cannot be closed while spare part requests are `PENDING` or `APPROVED`.
- Spare part requests must become `REJECTED` or `ISSUED` before closing.

## Backend Setup

### 1. Go to backend folder

```bat
cd D:\ingo\sip\ev-scooty-platform\backend
```

### 2. Create and activate virtual environment

Recommended:

```bat
python -m venv venv
venv\Scripts\activate
```

If the system has multiple Python versions, use the version that has Django installed or install Django into the virtual environment.

### 3. Install backend dependencies

Backend dependencies are listed in:

```text
backend/requirements.txt
```

Install them with:

```bat
pip install -r requirements.txt
```

The main backend packages are:

```text
Django
Django REST Framework
Simple JWT
django-cors-headers
psycopg PostgreSQL driver
```

If a developer installs or upgrades backend packages, update the file:

```bat
pip freeze > requirements.txt
```

### 4. PostgreSQL database setup

This project uses PostgreSQL, not SQLite, for normal development.

#### Install PostgreSQL

Install PostgreSQL locally before running migrations.

Windows options:

- Install from the official PostgreSQL installer.
- During installation, remember the password you set for the `postgres` user.
- Make sure PostgreSQL is running as a Windows service.
- Add PostgreSQL `bin` folder to PATH if `psql` is not recognized.

Common Windows PostgreSQL bin path:

```text
C:\Program Files\PostgreSQL\18\bin
```

Check that PostgreSQL is available:

```bat
psql --version
```

Check that the server is accepting connections:

```bat
psql -h localhost -U postgres
```

If prompted, enter the PostgreSQL password.

Current database settings are in:

```text
backend/config/settings.py
```

Current development database settings:

```text
Database name: ev_scooty_db
User: postgres
Password: local@123
Host: localhost
Port: 5432
```

#### Create the development database

Login to PostgreSQL:

```bat
psql -h localhost -U postgres
```

Then run:

```sql
CREATE DATABASE ev_scooty_db;
\q
```

If the database already exists, PostgreSQL will show an error. That is okay; continue with migrations.

#### Optional: create a dedicated database user

The current development settings use the default `postgres` user. For a cleaner setup, a developer can create a project-specific user:

```sql
CREATE USER ev_scooty_user WITH PASSWORD 'change_this_password';
ALTER ROLE ev_scooty_user SET client_encoding TO 'utf8';
ALTER ROLE ev_scooty_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE ev_scooty_user SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE ev_scooty_db TO ev_scooty_user;
```

If using this user, update `backend/config/settings.py`:

```python
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": "ev_scooty_db",
        "USER": "ev_scooty_user",
        "PASSWORD": "change_this_password",
        "HOST": "localhost",
        "PORT": "5432",
    }
}
```

#### Verify database connection from Django

After installing requirements and creating the database, run:

```bat
python manage.py check
```

If database settings are wrong, Django or migrations will fail with a PostgreSQL connection error.

### 5. Run migrations

```bat
python manage.py makemigrations
python manage.py migrate
```

### 6. Create superuser

```bat
python manage.py createsuperuser
```

### 7. Start backend server

```bat
python manage.py runserver
```

Default backend URL:

```text
http://127.0.0.1:8000
```

### PostgreSQL troubleshooting

#### `psql is not recognized`

PostgreSQL is not in PATH. Add the PostgreSQL `bin` directory to Windows PATH, or use the full path:

```bat
"C:\Program Files\PostgreSQL\18\bin\psql.exe" -h localhost -U postgres
```

#### `password authentication failed for user postgres`

The password in `backend/config/settings.py` does not match your local PostgreSQL password.

Fix one of these:

- Change the PostgreSQL password.
- Or update `DATABASES["default"]["PASSWORD"]` in `backend/config/settings.py`.

#### `database ev_scooty_db does not exist`

Create the database:

```bat
psql -h localhost -U postgres
```

```sql
CREATE DATABASE ev_scooty_db;
```

#### `connection refused`

PostgreSQL server is not running.

On Windows:

- Open Services.
- Find PostgreSQL service.
- Start or restart it.

#### `permission denied for schema public`

If using a custom database user, grant schema permissions:

```sql
\c ev_scooty_db
GRANT ALL ON SCHEMA public TO ev_scooty_user;
```

## Frontend Setup

### 1. Go to frontend folder

```bat
cd D:\ingo\sip\ev-scooty-platform\frontend
```

### 2. Install dependencies

```bat
npm install
```

### 3. Start frontend dev server

```bat
npm run dev
```

Vite usually starts on:

```text
http://localhost:5173
```

In this project it has also been used on:

```text
http://localhost:5174
```

Use the URL shown in the terminal.

### 4. Production build

```bat
npm run build
```

Build output:

```text
frontend/dist/
```

## Frontend API Client

API client file:

```text
frontend/src/api/client.js
```

It handles:

- Base backend API URL
- Access token
- Refresh token
- Automatic JWT refresh
- Redirecting to login when refresh fails

Tokens are stored in browser local storage:

```text
accessToken
refreshToken
```

If the wrong user is showing after login, clear local storage:

```js
localStorage.clear()
```

Run this in the browser console, then login again.

## Important Frontend Routes

```text
/                       Public index page
/login                  Login page
/admin                  Admin dashboard
/customer               Customer dashboard
/technician             Technician dashboard
/book-service           Customer service booking
/test-ride              Public test ride booking
/slots-availability     Public test ride slot availability
/bike/1                 Flee low-speed explore page
/bike/2                 Flee high-speed explore page
/customer/booking/:id   Customer booking detail
/customer/job-card/:id  Customer job card detail
```

## Important Backend API Endpoints

Authentication:

```text
POST /api/token/
POST /api/token/refresh/
GET  /api/accounts/users/me/
```

Vehicles:

```text
GET  /api/vehicles/
POST /api/vehicles/
```

Service bookings:

```text
GET  /api/service/bookings/
POST /api/service/bookings/
GET  /api/service/bookings/:id/
POST /api/service/bookings/:id/create-job-card/
```

Job cards:

```text
GET  /api/service/job-cards/
GET  /api/service/job-cards/:id/
PATCH /api/service/job-cards/:id/
POST /api/service/job-cards/:id/save-readings/
POST /api/service/job-cards/:id/close/
```

Inspections:

```text
GET  /api/service/inspections/
POST /api/service/inspections/
```

Work logs:

```text
GET  /api/service/work-logs/
POST /api/service/work-logs/
POST /api/service/work-logs/:id/complete/
```

Spare part requests:

```text
GET  /api/service/parts/
POST /api/service/parts/
POST /api/service/parts/:id/approve/
POST /api/service/parts/:id/reject/
POST /api/service/parts/:id/issue/
```

Test rides:

```text
GET  /api/test-rides/
POST /api/test-rides/
GET  /api/test-rides/slots-range/
```

## Job Card Number Standard

New job cards should use:

```text
JC-{job_card.id}
```

Example:

```text
Job card database id: 7
Job card number: JC-7
```

Older data may contain older formats such as:

```text
JC-0001
```

The frontend should display `job_card_number`, not guess from `job_card_id`.

## Technician Visibility Rule

Technicians only see job cards assigned to their exact user account.

Backend filtering:

```python
JobCard.objects.filter(assigned_technician=user)
```

Example:

```text
JC-2 assigned to tech1
```

Then `JC-2` appears only when logged in as `tech1`, not when logged in as another technician account.

## Development Commands

Backend:

```bat
cd D:\ingo\sip\ev-scooty-platform\backend
venv\Scripts\activate
python manage.py runserver
```

Frontend:

```bat
cd D:\ingo\sip\ev-scooty-platform\frontend
npm run dev
```

Build frontend:

```bat
cd D:\ingo\sip\ev-scooty-platform\frontend
npm run build
```

Run migrations:

```bat
cd D:\ingo\sip\ev-scooty-platform\backend
python manage.py makemigrations
python manage.py migrate
```

Create admin user:

```bat
cd D:\ingo\sip\ev-scooty-platform\backend
python manage.py createsuperuser
```

## Deployment Process

This section describes a practical production deployment. Exact commands may change depending on the hosting provider.

### 1. Prepare production server

Install:

- Python
- Node.js
- PostgreSQL
- Git
- A production web server such as Nginx or Apache
- A Python process manager such as Gunicorn, uWSGI, Waitress, or a Windows service runner

### 2. Clone project

```bash
git clone <repository-url>
cd ev-scooty-platform
```

### 3. Backend production setup

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

On Windows:

```bat
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

### 4. Configure production settings

For production, avoid hardcoding secrets directly in `settings.py`.

Recommended environment values:

```text
SECRET_KEY=<secure-secret-key>
DEBUG=False
ALLOWED_HOSTS=your-domain.com,your-server-ip
DATABASE_NAME=ev_scooty_db
DATABASE_USER=<db-user>
DATABASE_PASSWORD=<db-password>
DATABASE_HOST=<db-host>
DATABASE_PORT=5432
```

Current development settings are inside:

```text
backend/config/settings.py
```

Before production:

- Set `DEBUG = False`
- Set correct `ALLOWED_HOSTS`
- Set production database credentials
- Set CORS allowed origins to the frontend domain
- Keep JWT lifetime appropriate for production

### 5. Production database

Create production database:

```sql
CREATE DATABASE ev_scooty_db;
```

Run migrations:

```bash
python manage.py migrate
```

Create superuser:

```bash
python manage.py createsuperuser
```

### 6. Static and media files

If static files are enabled in production:

```bash
python manage.py collectstatic
```

Media uploads such as job card media and service booking media should be stored in a persistent media directory. Configure:

```python
MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"
```

Then configure Nginx or the hosting provider to serve media files.

### 7. Build frontend

```bash
cd frontend
npm install
npm run build
```

Production frontend files will be in:

```text
frontend/dist/
```

### 8. Serve frontend

Option A: Serve `frontend/dist` using Nginx.

Example Nginx idea:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    root /path/to/ev-scooty-platform/frontend/dist;
    index index.html;

    location / {
        try_files $uri /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:8000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Option B: Host frontend separately, then configure backend CORS.

### 9. Run backend in production

Linux example with Gunicorn:

```bash
gunicorn config.wsgi:application --bind 127.0.0.1:8000
```

Windows example with Waitress:

```bat
pip install waitress
waitress-serve --listen=127.0.0.1:8000 config.wsgi:application
```

### 10. Deployment checklist

Before going live:

- `DEBUG = False`
- `ALLOWED_HOSTS` configured
- CORS configured for frontend domain
- PostgreSQL database created
- Migrations run
- Superuser created
- Frontend built
- Static files collected if needed
- Media path configured
- Backend started with production server
- HTTPS enabled
- Admin login tested
- Customer login tested
- Technician login tested
- Job card workflow tested end to end
- Test ride booking tested

## Troubleshooting

### Frontend changes not visible

Hard refresh:

```text
Ctrl + Shift + R
```

Restart Vite:

```bat
npm run dev
```

### Wrong user dashboard opens

Clear browser local storage:

```js
localStorage.clear()
```

Then login again.

### 401 Unauthorized

Common causes:

- Access token expired
- Refresh token expired
- Browser has old token
- Backend server restarted with changed auth configuration

Fix:

```js
localStorage.clear()
```

Then login again.

### 403 Forbidden

Common causes:

- Logged-in user role does not have permission
- Technician is trying to access another technician's job card
- Customer is trying to access admin or technician API
- Technician is trying to issue spare parts

### Technician cannot see job card

Check:

- Job card has assigned technician
- Assigned technician matches logged-in technician user
- Job card is in correct tab: Active Jobs or Closed Jobs
- Browser token belongs to correct technician account

Database query example:

```sql
SELECT
  jc.id,
  jc.job_card_number,
  jc.status,
  jc.assigned_technician_id,
  u.username,
  u.role
FROM service_jobcard jc
LEFT JOIN accounts_user u ON u.id = jc.assigned_technician_id
ORDER BY jc.id;
```

### Odometer or battery voltage not saving

Rules:

- Odometer must be zero or positive
- Battery voltage must be greater than zero
- Readings can only be saved once
- Closed job cards cannot be edited

### Job card close button not visible

The job card can close only when:

- Inspection is submitted
- At least one work log is completed
- No spare part request is `PENDING`
- No spare part request is `APPROVED`
- Job card is not already closed

### Spare part issue button gives 403

Only admin or service advisor can issue parts.

Technician can request spare parts, but cannot issue them.

## Notes for Future Developers

- Keep business rules enforced in backend, not only frontend.
- Do not rely only on frontend hiding buttons.
- Always check user role on backend actions.
- Avoid guessing job card numbers in frontend.
- Display `job_card_number` from backend.
- Keep work logs under their respective complaints.
- Keep spare part requests under their respective complaints.
- When adding new technician features, verify assigned technician filtering.
- When changing JWT settings, test login, refresh, and logout.

## Recommended Future Improvements

- Split `App.jsx` into separate page components.
- Add `.env` support for backend settings.
- Keep `backend/requirements.txt` updated when backend packages change.
- Add automated tests for job card close rules.
- Add role-based frontend route guards for all private pages.
- Add cleaner admin analytics dashboard.
- Add audit logs for spare part approval and issue actions.
