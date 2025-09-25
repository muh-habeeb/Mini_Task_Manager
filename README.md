# 🗓️ Daily Task Tracker with Productivity Insights

## 📌 Project Overview

The **Daily Task Tracker** is a full-stack web application designed to help users manage their daily tasks efficiently while providing insights into their productivity.  
Users can create, update, and delete tasks, track their completion status, apply filters, and view visual analytics to monitor their task habits over time.

---

## 🗂️ Project Structure

```
└── 📁 task-tracker/
    ├── 📁 public/
    │   ├── 📁 css/
    │   │   └── 🎨 style.css
    │   ├── 📁 js/
    │   │   ├── 📄 analytics.js
    │   │   ├── 📄 auth.js
    │   │   └── 📄 dashboard.js
    │   ├── 🌐 dashboard.html
    │   ├── 🌐 index.html
    │   ├── 🌐 login.html
    │   └── 🌐 register.html
    ├── 📁 server/
    │   ├── 📁 .git/ 🚫 (auto-hidden)
    │   ├── 📁 config/
    │   │   └── 📄 database.js
    │   ├── 📁 controllers/
    │   │   ├── 📄 analyticsController.js
    │   │   ├── 📄 authController.js
    │   │   └── 📄 taskController.js
    │   ├── 📁 middleware/
    │   │   └── 📄 auth.js
    │   ├── 📁 models/
    │   │   ├── 📄 Task.js
    │   │   ├── 📄 TaskLog.js
    │   │   └── 📄 User.js
    │   ├── 📁 node_modules/ 🚫 (auto-hidden)
    │   ├── 📁 routes/
    │   │   ├── 📄 analytics.js
    │   │   ├── 📄 auth.js
    │   │   └── 📄 tasks.js
    │   ├── 🔒 .env 🚫 (auto-hidden)
    │   ├── 🚫 .gitignore
    │   ├── 📄 app.js
    │   ├── 📄 package-lock.json
    │   └── 📄 package.json
    └── 📖 README.md
```

    
---

## 🚀 Getting Started

### ✅ Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MySQL](https://www.mysql.com/)
- npm or yarn

---

## 🛠️ Setup Instructions

### 1. 📦 Clone the Repository

```bash
git clone https://github.com/your-username/task-tracker.git
cd task-tracker/server
```
### 2 📁 Environment Variables

> #### [!IMPORTANT] Create a .env file inside the server/ directory and add your MySQL credentials:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=task_tracker
DB_PORT=3306       # Optional
JWT_SECRET=your_jwt_secret
```
### 3 🧱 Install Dependencies
```json
npm install
```

> ### [!CAUTION] 4. 🏗️ Create Database & Tables

Create a MySQL database named task_tracker.
Then run the schema (if provided) or ensure the backend auto-creates tables if configured.

### 5. 🚦 Start the Server

```
npm run dev 
```
>[!TIP]
>### 6. 🌐 Access the App

```
http://localhost:3000
```

## 💡 Features

✅ User Registration & Login (JWT-based)
✅ Password hashing with bcrypt
✅ Task Management (Create, Read, Update, Delete)
✅ Task filtering, sorting, and searching
✅ Task completion status updates
✅ Interactive analytics via charts (Chart.js)
✅ Productivity insights (by status, priority, and time)
✅ Clean and responsive UI
✅ SQL injection protection
✅ RESTful API design
✅ Modular MVC folder structure
✅ Input validation with express-validator

## 📊 Analytics Included

📈 Line Chart: Tasks completed over time

🥧 Pie Chart: Task completion status (Completed vs Pending)

🍩 Doughnut Chart: Task priority distribution (Low, Medium, High)

🔐 Security & Best Practices

JWT-based authentication with route protection middleware

Environment variables using .env

SQL parameterization to prevent injection

Form validation on both client and server side  


>[!DANGER]