Perfect 👍
Below is the **complete `README.md` code**.
You can **copy–paste this directly** into a file named **`README.md`** in your GitHub repo.

---

```md
# Scotch — Full-Stack CRUD Application with Authentication

Scotch is a full-stack web application built using **Node.js, Express, MongoDB, and EJS**.  
It implements **JWT-based authentication**, **protected routes**, and **CRUD operations**, wrapped in a modern UI.

This README is written so that **any developer can clone, configure, and run the project without confusion**.

---

## 🚀 Features

- User authentication (Register / Login / Logout)
- JWT authentication using HTTP-only cookies
- Protected routes with middleware
- Create, Read, Update, Delete (CRUD) for People profiles
- Clean error & success handling (no query strings)
- Modern UI with Tailwind CSS
- MongoDB integration
- Production-ready project structure

---

## 🧱 Tech Stack

- **Backend:** Node.js, Express
- **Frontend:** EJS, Tailwind CSS
- **Database:** MongoDB
- **Authentication:** JWT, bcrypt
- **Utilities:** dotenv, cookie-parser

---

## 📁 Project Structure

```

project-root/
│
├── app.js
├── package.json
├── .env                # Environment variables (NOT committed)
│
├── config/
│   └── db.js           # MongoDB connection
│
├── middleware/
│   └── auth.js         # Route protection middleware
│
├── models/
│   ├── user.js         # User schema (authentication)
│   └── people.js       # People schema (CRUD)
│
├── views/
│   ├── register.ejs
│   ├── login.ejs
│   ├── index.ejs
│   ├── read.ejs
│   └── edit.ejs
│
├── public/
│   └── stylesheets/
│
└── README.md

```
```

---

## ⚙️ Environment Variables

Create a file named **`.env`** in the project root.

```env
PORT=3000
JWT_KEY=your_super_secret_jwt_key
MONGODB_URI=your_mongodb_connection_string
````

### 🔑 Explanation

* `PORT` – Port where the server runs
* `JWT_KEY` – Secret key used to sign JWT tokens
* `MONGODB_URI` – MongoDB connection string

⚠️ **Never commit `.env` to GitHub**

---

## 🗄️ Database Configuration

### `config/db.js`

```js
const mongoose = require('mongoose');

module.exports = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');
  } catch (err) {
    console.error('MongoDB Connection Failed');
    process.exit(1);
  }
};
```

You can use:

* MongoDB Atlas (recommended)
* Local MongoDB (`mongodb://127.0.0.1:27017/dbname`)

---

## 🔐 Authentication Flow

1. User registers → password is hashed using bcrypt
2. User logs in → JWT is generated
3. JWT is stored in an HTTP-only cookie
4. Protected routes verify JWT via middleware
5. Logout clears the cookie

### `middleware/auth.js`

```js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) return res.redirect('/login');

  try {
    jwt.verify(token, process.env.JWT_KEY);
    next();
  } catch {
    res.redirect('/login');
  }
};
```

---

## ▶️ Running the Project Locally

### 1️⃣ Clone the repository

```bash
git clone <repository-url>
cd project-folder
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Setup environment variables

Create `.env` and add required values.

### 4️⃣ Start the server

```bash
node app.js
```

or (recommended during development):

```bash
nodemon app.js
```

### 5️⃣ Open in browser

```
http://localhost:3000
```

---

## 🔒 Protected Routes

The following routes require authentication:

* `/index`
* `/read`
* `/create`
* `/edit/:id`
* `/delete/:id`
* `/logout`

Unauthenticated users are redirected to `/login`.

---

## 🧪 Common Issues & Fixes

### ❌ `error is not defined` in EJS

✔ Fixed using global middleware:

```js
app.use((req, res, next) => {
  res.locals.error = null;
  res.locals.success = null;
  next();
});
```

---

### ❌ MongoDB Duplicate Key Error

If you modified schemas and see:

```
E11000 duplicate key error
```

Drop old indexes in MongoDB:

```js
db.collection.dropIndex('email_1')
```

---

## 🌍 Deployment Notes

* Push changes to GitHub
* Hosting platform (Render / Railway / etc.) auto-deploys
* Changes reflect after successful build

---

## 🔐 Security Notes

* Passwords are hashed using bcrypt
* JWT stored in HTTP-only cookies
* Routes protected using middleware
* Environment variables kept secret

---

## 📄 License

This project is built for learning and demonstration purposes.

---

## 🙌 Acknowledgements

This project demonstrates:

* full-stack authentication
* clean MVC architecture
* production-ready patterns

---

⭐ If you find this project useful, feel free to star the repository!

````

---
