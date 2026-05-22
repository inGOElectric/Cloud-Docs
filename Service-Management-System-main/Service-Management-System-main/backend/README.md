# Backend API

Backend application built with Node.js, Express.js, PostgreSQL, and Prisma ORM.

## Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create environment file:**
   Create a `.env` file in the backend directory with the following content:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/service_system?schema=public"
   TWILIO_ACCOUNT_SID= 
   TWILIO_AUTH_TOKEN= 
   TWILIO_WHATSAPP_NUMBER=
   PORT=4000
   NODE_ENV=development
   JWT_SECRET = super_secure_random_string_12345 
   ```
   Update the `DATABASE_URL` with your PostgreSQL credentials.

3. **Generate Prisma Client:**
   ```bash
   npm run prisma:generate
   ```

4. **Run database migrations:**
   ```bash
   npm run prisma:migrate
   ```

5. **Start development server:**
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:4000` (or the port specified in your `.env` file).

## API Endpoints

- `GET /health` - Health check endpoint that returns `{ status: "ok" }`

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js    # Prisma client configuration
│   │   └── env.js          # Environment variables
│   ├── controllers/
│   │   └── healthController.js
│   ├── routes/
│   │   └── healthRoutes.js
│   └── index.js            # Express server entry point
├── prisma/
│   └── schema.prisma       # Prisma schema
├── package.json
└── README.md
```

The frontend server is running on `http://localhost:5173`.

Prisma Studio is running on `http://localhost:5555`.


## 📱 Twilio + ngrok Integration Guide

This section explains how to configure WhatsApp messaging using Twilio and expose the local development server using ngrok.

---

### 1. Twilio Account Setup

1. Create an account at https://www.twilio.com/
2. Verify your email and phone number
3. From the dashboard, note the following credentials:

   * `ACCOUNT SID`
   * `AUTH TOKEN`

---

### 2. WhatsApp Sandbox Configuration

1. Navigate to:

   ```
   Messaging → Try it out → Send a WhatsApp message
   ```

2. Connect your personal WhatsApp:

   * Send the provided **join code** to the sandbox number shown in the console

**Note:**

* The sandbox number is typically shared across users
* Your session is identified by the join code
* For production use, a dedicated Twilio number is required

---

### 3. Project Setup

Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd <project-directory>
npm install
```

Create a `.env` file:

```env
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+<your-number>
PORT=4000
```

Start the server:

```bash
npm run dev
```

Expected output:

```
Server running on http://localhost:4000
```

---

### 4. ngrok Setup

Install ngrok:

```bash
npm install -g ngrok
```

Authenticate:

```bash
ngrok config add-authtoken YOUR_NGROK_TOKEN
```

Start tunneling:

```bash
ngrok http 4000
```

Expected output:

```
Forwarding https://<generated-url>.ngrok-free.dev -> http://localhost:4000
```

---

### 5. Twilio Webhook Configuration

In the Twilio Sandbox settings, configure:

* **Webhook URL:**

  ```
  https://<ngrok-url>/whatsapp
  ```
* **HTTP Method:** `POST`

Save the configuration.

---

### 6. Testing the Integration

1. Send a message (e.g., `hi`) from your WhatsApp
2. Verify the following:

**ngrok Inspector**

```
POST /whatsapp → 200 OK
```

**Server Logs**

```
📩 +<user-number>: hi
```

**WhatsApp Response**

```
Processing your request...
```

If additional processing is implemented, a follow-up response should be delivered.

---

### 7. Expected End-to-End Flow

```
WhatsApp User
   ↓
Twilio Sandbox
   ↓
ngrok (public URL)
   ↓
Express Webhook (/whatsapp)
   ↓
Application Logic
   ↓
Twilio API (outgoing message)
   ↓
WhatsApp User
```

---

### 8. Notes

* ngrok generates a new public URL on each restart; update the webhook accordingly
* The sandbox only works with numbers that have joined via the code
* Ensure the server is running before sending messages
* Always return a valid TwiML response to avoid webhook failures

---
