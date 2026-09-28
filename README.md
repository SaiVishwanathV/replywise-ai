# 🤖 ReplyWise AI — AI-Powered Email Assistant

> A full-stack AI-powered email assistant for generating professional, context-aware email replies with personalized preferences, secure authentication, email OTP verification, and reply history.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)
![TiDB](https://img.shields.io/badge/TiDB-Cloud-00A98F)
![OpenRouter](https://img.shields.io/badge/OpenRouter-AI-6366F1)
![EmailJS](https://img.shields.io/badge/EmailJS-OTP-FF6B6B)
![Firebase](https://img.shields.io/badge/Firebase-Hosting-FFCA28?logo=firebase)
![Render](https://img.shields.io/badge/Render-Backend-46E3B7?logo=render)

**Live Application:** https://replywise-4i.web.app

**Backend API:** https://replywise-ai.onrender.com

**Repository:** https://github.com/SaiVishwanathV/replywise-ai

---

# 📖 Overview

ReplyWise AI is a full-stack web application that helps users generate professional and context-aware email replies using Artificial Intelligence.

The application provides a dedicated workspace where users can enter email content, customize response preferences, and generate AI-powered replies.

It also includes user authentication, email verification through a 6-digit OTP, personalized preferences, reply history, and profile management.

The application uses different cloud platforms for different responsibilities:

- **Firebase Hosting** for the frontend
- **Render** for the backend
- **TiDB Cloud** for the production database
- **EmailJS** for OTP email delivery
- **OpenRouter** for AI API access
- **GitHub** for source control

---

# ✨ Key Highlights

- 🤖 AI-powered email reply generation
- 📝 Context-aware professional responses
- 🎨 Custom reply tone and length
- 🌐 Preferred language selection
- 🔐 JWT-based authentication
- 👤 Login using email or username
- 📧 6-digit email OTP verification
- 🔒 Password hashing using bcrypt
- 🗂 Reply history
- 👤 Profile and preference management
- 🛡 Protected backend API routes
- ☁ Production cloud deployment
- 📱 Responsive modern interface
- ⚡ React + Vite frontend
- 🚀 Node.js + Express backend

---

# 🏗 Tech Stack

| Category | Technology | Purpose |
|----------|------------|---------|
| Frontend | React | User interface and application components |
| Build Tool | Vite | Frontend development and production builds |
| Styling | Tailwind CSS | Responsive UI styling |
| Routing | React Router | Client-side navigation |
| Backend | Node.js | Server-side JavaScript runtime |
| API | Express.js | REST API and backend logic |
| ORM | Prisma | Database access and schema management |
| Database | TiDB Cloud | Production relational database |
| Database Compatibility | MySQL | Relational database compatibility |
| Authentication | JWT | Access and refresh token authentication |
| Password Security | bcrypt | Secure password hashing |
| OTP Delivery | EmailJS | Email verification OTP delivery |
| AI Integration | OpenRouter | AI API access |
| Frontend Hosting | Firebase Hosting | React application hosting |
| Backend Hosting | Render | Node.js backend hosting |
| Version Control | Git + GitHub | Source control |

---

# 🏗 System Architecture

```text
                         ┌─────────────────────┐
                         │        User         │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │   React + Vite      │
                         │     Frontend        │
                         └──────────┬──────────┘
                                    │
                               REST API
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │ Node.js + Express   │
                         │      Backend        │
                         └──────┬───────┬──────┘
                                │       │
                    ┌───────────┘       └────────────┐
                    ▼                                ▼
           ┌─────────────────┐              ┌─────────────────┐
           │   TiDB Cloud    │              │   OpenRouter    │
           │    Database     │              │     AI API      │
           └─────────────────┘              └─────────────────┘
                    │
                    ▼
           ┌─────────────────┐
           │     EmailJS     │
           │   OTP Delivery  │
           └─────────────────┘
```

---

# 🔄 Application Flow

## User Registration & Verification

```text
User
 │
 ▼
Signup Form
 │
 ▼
Express Backend
 │
 ├── Validate User Details
 │
 ├── Create User
 │
 ├── Generate 6-Digit OTP
 │
 └── Hash OTP
 │
 ▼
TiDB Cloud
 │
 ▼
EmailJS
 │
 ▼
User's Email
 │
 ▼
Enter OTP
 │
 ▼
Express Backend
 │
 ├── Hash Submitted OTP
 │
 └── Compare With Stored Hash
 │
 ▼
Email Verified
 │
 ▼
Account Activated
```

---

# 🔐 Authentication

ReplyWise AI uses backend-based authentication with JWT access and refresh tokens.

Users can log in using:

- Email address
- Username

### Authentication Flow

```text
User
  │
  ▼
Login
  │
  ▼
Express Backend
  │
  ├── Find User
  ├── Verify Password
  └── Check Account Status
  │
  ▼
JWT Access Token
  │
  ▼
Refresh Token
  │
  ▼
Authenticated Application
```

Passwords are hashed using **bcrypt** before being stored.

---

# 📧 Email OTP Verification

EmailJS is used specifically for sending account verification emails.

The actual OTP generation and verification logic is handled by the backend.

### OTP Workflow

1. User submits the signup form.
2. Backend generates a random 6-digit OTP.
3. OTP is hashed before storage.
4. OTP information is stored in the database.
5. EmailJS sends the OTP to the user's email.
6. User enters the received OTP.
7. Backend hashes the submitted OTP.
8. The hashes are compared.
9. A valid OTP verifies the user's email.
10. The OTP record is removed after successful verification.
11. The account becomes active.

---

# 🤖 AI Email Reply Generation

ReplyWise AI uses **OpenRouter** as the AI API layer.

The backend receives the user's email content and selected preferences, prepares the AI request, and sends it to OpenRouter.

```text
User
 │
 ▼
ReplyWise Workspace
 │
 ▼
Enter Email Content
 │
 ▼
Select Preferences
 │
 ▼
React Frontend
 │
 ▼
Express REST API
 │
 ▼
AI Prompt Processing
 │
 ▼
OpenRouter
 │
 ▼
AI Model
 │
 ▼
Generated Email Reply
 │
 ▼
Express Backend
 │
 ▼
React Frontend
 │
 ▼
User
```

The OpenRouter API key is stored on the backend and is never exposed to the frontend.

---

# 🎯 Personalization

Users can configure how ReplyWise generates email responses.

Available preferences include:

- **Reply Tone**
- **Reply Length**
- **Preferred Language**

These preferences are included when preparing the AI prompt so that generated responses better match the user's selected writing style.

---

# 🗂 Reply History

ReplyWise stores generated replies so users can access previous responses through the History section.

The history system allows users to:

- Review previous AI-generated replies
- Access their previous responses
- Maintain a record of generated email content

---

# 🗄 Database Architecture

TiDB Cloud is used as the production relational database.

Prisma provides the database access layer between the Node.js backend and TiDB Cloud.

```text
Node.js + Express
        │
        ▼
      Prisma
        │
        ▼
   TiDB Cloud
```

The database stores application information such as:

- User accounts
- Authentication information
- Email verification data
- User preferences
- Reply history
- Application records

---

# 🌐 Platform Responsibilities

ReplyWise AI uses specialized platforms for different application responsibilities.

| Platform | Responsibility |
|----------|----------------|
| Firebase Hosting | Frontend hosting |
| Render | Backend hosting |
| TiDB Cloud | Production database |
| EmailJS | OTP email delivery |
| OpenRouter | AI API integration |
| GitHub | Source control |

This architecture keeps the major application components separated and independently managed.

---

# 🚀 Deployment Architecture

```text
                    ┌──────────────────────┐
                    │   Firebase Hosting   │
                    │    React Frontend    │
                    └──────────┬───────────┘
                               │
                               │ REST API
                               ▼
                    ┌──────────────────────┐
                    │       Render         │
                    │ Node.js + Express    │
                    │      Backend         │
                    └───────┬──────┬───────┘
                            │      │
                 ┌──────────┘      └──────────┐
                 ▼                            ▼
          ┌──────────────┐             ┌──────────────┐
          │ TiDB Cloud   │             │  OpenRouter  │
          │  Database    │             │     AI       │
          └──────────────┘             └──────────────┘

                            │
                            ▼
                     ┌──────────────┐
                     │    EmailJS   │
                     │  OTP Email   │
                     └──────────────┘
```

---

# 📱 User Interface

ReplyWise AI uses a clean, minimal interface designed for a modern productivity experience.

### UI Principles

- Clean light theme
- Minimal navigation
- Soft card-based layouts
- Rounded components
- Subtle shadows
- Blue accent colors
- Responsive design
- Reduced visual clutter
- Consistent spacing and typography

---

# 📄 Main Application Pages

| Page | Purpose |
|------|---------|
| Landing | Introduction to ReplyWise AI |
| Login | User authentication |
| Signup | Account registration |
| Email Verification | OTP verification |
| Dashboard | Application overview |
| ReplyWise Workspace | AI email reply generation |
| History | Previously generated replies |
| Profile | Account and preference management |

---

# 📂 Project Structure

```text
replywise-ai/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── ...
│   │
│   ├── firebase.json
│   ├── .firebaserc
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   └── server.js
│   │
│   ├── prisma/
│   ├── package.json
│   └── ...
│
├── .gitignore
└── README.md
```

---

# 🔒 Security Design

| Security Feature | Implementation |
|------------------|----------------|
| Password Storage | bcrypt hashing |
| Authentication | JWT access + refresh tokens |
| Email Verification | 6-digit OTP |
| OTP Storage | Hashed OTP |
| API Security | Protected backend routes |
| AI Credentials | Backend environment variables |
| EmailJS Private Key | Backend environment variables |
| Database Credentials | Backend environment variables |
| Source Control | Sensitive `.env` files excluded |

Sensitive API credentials are never included in the frontend application.

---

# 🌍 Production URLs

### Frontend

https://replywise-4i.web.app

### Backend

https://replywise-ai.onrender.com

### GitHub Repository

https://github.com/SaiVishwanathV/replywise-ai

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/SaiVishwanathV/replywise-ai.git

cd replywise-ai
```

---

## Backend Setup

```bash
cd server
npm install
```

Create a `.env` file inside the `server` directory and configure the required backend environment variables.

Generate Prisma Client:

```bash
npx prisma generate
```

Start the backend:

```bash
npm start
```

---

## Frontend Setup

Open another terminal:

```bash
cd client
npm install
```

Configure the required frontend environment variables in `.env`.

Start the development server:

```bash
npm run dev
```

The frontend will run using the Vite development server.

---

# ☁️ Production Deployment

## Frontend

The React frontend is deployed using Firebase Hosting.

```text
React + Vite
      ↓
Production Build
      ↓
Firebase Hosting
      ↓
replywise-4i.web.app
```

## Backend

The Node.js + Express backend is deployed using Render.

```text
Node.js + Express
        ↓
      GitHub
        ↓
      Render
        ↓
replywise-ai.onrender.com
```

## Database

Production application data is stored in TiDB Cloud.

## Email

Email verification OTPs are delivered using EmailJS.

## AI

AI response generation is handled through OpenRouter.

---

# 🔮 Future Enhancements

- Gmail integration
- Outlook integration
- Direct email sending
- Browser extension
- Additional AI models
- Advanced email templates
- Usage analytics
- Pro subscription features
- Additional productivity integrations

---

# 👨‍💻 Author

**V Sai Vishwanath**

B.Tech — Computer Science & Engineering  
Mahatma Gandhi Institute of Technology (MGIT), Hyderabad

**GitHub:**  
https://github.com/SaiVishwanathV

---

## ⭐ ReplyWise AI

**React • Node.js • Express • Prisma • TiDB Cloud • OpenRouter • EmailJS • Firebase • Render**
