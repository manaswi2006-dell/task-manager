# ⚡ Task Master — MERN Stack Task Management System

A full-stack MERN (MongoDB, Express.js, React, Node.js) task management web application engineered with a modern cyberpunk glassmorphism dark UI.

---

## 🚀 Features

- **JWT Authentication & Authorization**: Secure signup & login with bcrypt password hashing and token validation.
- **User-Specific Tasks**: Multi-user isolation where each registered user manages only their tasks.
- **Complete Task CRUD**:
  - `POST /api/tasks` — Create new tasks with title, description, priority, status, and due date.
  - `GET /api/tasks` — Fetch user tasks with real-time search and status filtering.
  - `GET /api/tasks/:id` — View details for a specific task.
  - `PUT /api/tasks/:id` — Update status, priority, or content.
  - `DELETE /api/tasks/:id` — Delete task.
- **Dynamic Dashboard Metrics**: Live calculation of Total, Pending, In Progress, and Completed counts, along with donut chart completion rate.
- **Dual Validation**: Server-side validation using Joi schemas and client-side form validation.
- **Centralized Error Handling**: Standardized JSON response formatting across all Express routes.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, React Router DOM, Axios, Lucide React
- **Backend**: Node.js, Express.js, Mongoose, JSON Web Tokens (JWT), Bcrypt.js, Joi
- **Database**: MongoDB (Local or MongoDB Atlas)

---

## 📁 Project Structure

```text
task-manager-mern/
├── server/
│   ├── config/db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── taskController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── errorMiddleware.js
│   │   └── validateMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── taskRoutes.js
│   ├── validators/
│   │   ├── authValidator.js
│   │   └── taskValidator.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── client/
│   ├── src/
│   │   ├── api/axiosClient.js
│   │   ├── components/
│   │   ├── context/AuthContext.jsx
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
├── .env.example
├── .gitignore
└── README.md
```

---

## ⚙️ Setup & Execution

### 1. Backend Setup

```bash
cd server
npm install
```

Ensure MongoDB is running locally (`mongodb://127.0.0.1:27017/taskmanager_db`) or replace `MONGO_URI` in `server/.env` with your MongoDB Atlas connection string.

Start the server:
```bash
npm start
# or with nodemon:
npm run dev
```

### 2. Frontend Setup

In a new terminal window:
```bash
cd client
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.
