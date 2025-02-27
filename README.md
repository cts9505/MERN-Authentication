# MERN Authentication System 🚀

A secure and scalable **MERN (MongoDB, Express, React, Node.js) authentication system** with **JWT authentication**, **bcrypt password hashing**, and **protected routes**.

## 🌟 Features

👉 **User Authentication** (Register, Login, Logout)  
👉 **JWT-Based Authentication** (Secure access tokens)  
👉 **Bcrypt Password Hashing** (Secure user credentials)  
👉 **Protected Routes** (Access control for authenticated users)  
👉 **Email Verification** (Send email confirmation on registration)  
👉 **Responsive UI** (React & Tailwind CSS)  
👉 **Error Handling & Validation**  

## 🛠️ Tech Stack

- **Frontend:** React.js, Axios, React Router, Tailwind CSS  
- **Backend:** Node.js, Express.js, MongoDB, Mongoose  
- **Authentication:** JWT (JSON Web Tokens), Bcrypt  
- **Database:** MongoDB  
- **API Testing:** Postman  

## 🚀 Getting Started

### 1️⃣ Clone the Repository
```sh
git clone https://github.com/cts9505/MERN-Authentication.git
cd MERN-Authentication
```

### 2️⃣ Install Dependencies  
#### Backend
```sh
cd backend
npm install
```
#### Frontend
```sh
cd frontend
npm install
```

### 3️⃣ Configure Environment Variables  
Create a `.env` file in the **backend** folder and add:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=your_mode
SMTP_HOST='smtp-relay.brevo.com'
SMTP_PORT=given_in_website
SMTP_USER=your_smtp_username
SMTP_PASS=your_password
SENDER_EMAIL=your_email
```

Create a `.env` file in the **frontend** folder and add:
```env
VITE_BACKEND_URL='your_backend_url'
```
### 4️⃣ Run the Application  

#### Start Backend Server  
```sh
cd backend
npm start
```
#### Start Frontend Server  
```sh
cd frontend
npm start
```
Your app should be running on `http://localhost:3000` (frontend) and `http://localhost:5000` (backend).  

## 🔐 API Endpoints

| Method | Route                 | Description            |
|--------|----------------------|------------------------|
| POST   | `/api/auth/register` | Register a new user   |
| POST   | `/api/auth/login`    | Login user & get token |
| GET    | `/api/auth/user`     | Get authenticated user |
| GET    | `/api/auth/logout`   | Logout user           |

## 🛠️ Future Enhancements  
- ✅ Role-based authentication (Admin/User)  
- ✅ Multi-factor authentication (MFA)  
- ✅ Password reset functionality  
- ✅ OAuth integration (Google, GitHub)  

## 🙌 Contributing
Feel free to contribute by submitting pull requests or opening issues.  

## 🐟 License
This project is **MIT Licensed**.

