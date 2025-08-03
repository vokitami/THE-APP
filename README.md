# THE APP – User Management with Login and Admin Dashboard  

A web application built with **React (Vite)** for the frontend and **Express.js + SQLite** for the backend.  
It allows **user registration, authentication, listing, blocking, unblocking, and deleting**, with **JWT authentication** and protected routes.  

🌐 **Frontend (Vercel):** [https://the-app-2am5.vercel.app/#/login](https://the-app-2am5.vercel.app/#/login)  
🛠 **Backend (Railway):** [https://the-app-production.up.railway.app](https://the-app-production.up.railway.app)  

---

## 🚀 Features
- User registration and login.
- Authentication with **JWT**.
- Admin dashboard to list users.
- Block, unblock, and delete user accounts.
- Protected routes: access only with a valid token.
- **SQLite** database for persistence.
- Deployed on **Vercel (Frontend)** and **Railway (Backend)**.

---

## 🛠 Installation & Local Setup

### 1️⃣ Clone the repository
```bash
git clone https://github.com/username/the-app.git
cd the-app
```

 JWT Authentication
Backend issues a JWT token upon login.

Token is stored in localStorage and sent via Authorization: Bearer TOKEN header.

Protected backend routes validate the token before granting access.


