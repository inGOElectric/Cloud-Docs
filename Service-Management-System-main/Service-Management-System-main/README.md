# Service Management System

## Overview
The Service Management System is a comprehensive platform designed to streamline service operations, manage customer interactions, and optimize workflows for service-based businesses. It includes both backend and frontend components to deliver a seamless user experience.

## Features
- **Admin Dashboard**: Manage users, roles, and permissions.
- **Staff Login**: Secure authentication for staff members.
- **Service Management**: Track job cards, service bookings, and service jobs.
- **Customer Management**: Handle customer data and interactions.
- **Reports**: Generate and view detailed reports.

## Project Structure

### Backend
Located in the `backend/` directory, the backend is built with Node.js and Prisma for database management.
- **Key Files**:
  - `server.js`: Main server file.
  - `schema.prisma`: Database schema.
  - `migrations/`: Database migration files.
  - `scripts/`: Utility scripts for data management.
- **Testing**:
  - Test files like `test-login.js` and `testReports.js` are included for backend functionality.

### Frontend
Located in the `frontend/` directory, the frontend is built with modern JavaScript frameworks and tools.
- **Key Files**:
  - `index.html`: Entry point for the frontend.
  - `vite.config.js`: Configuration for Vite.
  - `components/`: Reusable React components.
  - `pages/`: Application pages.

## Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Prisma CLI

### Steps
1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the backend directory and install dependencies:
   ```bash
   cd backend
   npm install
   ```
3. Navigate to the frontend directory and install dependencies:
   ```bash
   cd ../frontend
   npm install
   ```

## Usage

### Backend
1. Set up the database:
   ```bash
   npx prisma migrate dev
   ```
2. Seed the database (optional):
   ```bash
   node prisma/seed.js
   ```
3. Start the backend server:
   ```bash
   npm start
   ```

### Frontend
1. Start the development server:
   ```bash
   npm run dev
   ```
2. Open the application in your browser at `http://localhost:4000`.

## Contributing
1. Fork the repository.
2. Create a new branch for your feature:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add new feature"
   ```
4. Push to the branch:
   ```bash
   git push origin feature-name
   ```
5. Create a pull request.

## License
This project is licensed under the MIT License. See the LICENSE file for details.